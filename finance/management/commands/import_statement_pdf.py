from datetime import datetime
from decimal import Decimal, InvalidOperation
import re
from pathlib import Path

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction as db_transaction

from finance.models import Account, Transaction

try:
    from pypdf import PdfReader
except ImportError:  # pragma: no cover - handled in runtime error
    PdfReader = None


DATE_RE = re.compile(r"^\d{2}/\d{2}/\d{4}$")
AMOUNT_RE = re.compile(r"^(?:\d{1,3}(?:,\d{3})*|\d+)\.\d{2}$")

NOISE_EXACT = {
    "account",
    "statement",
    "account number",
    "currency",
    "account branch",
    "statement date",
    "statement period",
    "account created",
    "transactions",
    "transaction details",
    "payment reference",
    "value date",
    "credit (money",
    "in)",
    "debit (money out)",
    "balance",
    "disclaimer",
    "total",
}
NOISE_CONTAINS = [
    "record is produced",
    "computer generated statement",
    "contact us for 24 hours assistance",
    "equitybank.co.ke",
]


class Command(BaseCommand):
    help = "Import transactions from a bank statement PDF."

    def add_arguments(self, parser):
        parser.add_argument("pdf_path", type=str, help="Path to the statement PDF.")
        parser.add_argument("--user-id", type=int, help="User id to import for.")
        parser.add_argument("--user-email", type=str, help="User email to import for.")
        parser.add_argument("--account-id", type=int, help="Account id to import into.")
        parser.add_argument("--account-name", type=str, help="Account name to import into.")
        parser.add_argument(
            "--opening-balance",
            type=str,
            help="Opening balance before the first transaction (optional).",
        )
        parser.add_argument(
            "--first-transaction-kind",
            choices=[Transaction.Kind.INCOME, Transaction.Kind.EXPENSE],
            help="Fallback kind when the first transaction cannot be inferred.",
        )
        parser.add_argument(
            "--allow-duplicates",
            action="store_true",
            help="Do not skip duplicates (by date/amount/description/kind).",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Parse and report results without writing transactions.",
        )

    def handle(self, *args, **options):
        if PdfReader is None:
            raise CommandError("pypdf is required. Install it with `pip install pypdf`.")

        pdf_path = Path(options["pdf_path"])
        if not pdf_path.exists():
            raise CommandError(f"PDF not found: {pdf_path}")

        user = self._get_user(options)
        account = self._get_account(options, user)
        opening_balance = self._parse_decimal(options.get("opening_balance"))
        first_kind = options.get("first_transaction_kind")
        allow_duplicates = options.get("allow_duplicates", False)
        dry_run = options.get("dry_run", False)

        transactions = self._parse_pdf(pdf_path)
        if not transactions:
            self.stdout.write(self.style.WARNING("No transactions parsed."))
            return

        if transactions[0]["date"] > transactions[-1]["date"]:
            transactions = list(reversed(transactions))

        created = 0
        duplicates = 0
        prev_balance = opening_balance

        with db_transaction.atomic():
            for idx, tx in enumerate(transactions):
                kind = self._infer_kind(
                    tx,
                    prev_balance,
                    first_kind if idx == 0 else None,
                )
                prev_balance = tx["balance"]

                description = tx["description"][:255]
                amount = abs(tx["amount"])

                if not allow_duplicates:
                    exists = Transaction.objects.filter(
                        user=user,
                        account=account,
                        date=tx["date"],
                        amount=amount,
                        kind=kind,
                        description=description,
                    ).exists()
                    if exists:
                        duplicates += 1
                        continue

                created += 1
                if dry_run:
                    continue

                Transaction.objects.create(
                    user=user,
                    account=account,
                    date=tx["date"],
                    amount=amount,
                    fee=0,
                    kind=kind,
                    description=description,
                    source=Transaction.Source.IMPORT,
                )

            if dry_run:
                db_transaction.set_rollback(True)

        self.stdout.write(self.style.SUCCESS("Statement import complete."))
        self.stdout.write(f"parsed: {len(transactions)}")
        self.stdout.write(f"created: {created}")
        self.stdout.write(f"duplicates: {duplicates}")

    def _get_user(self, options):
        user_id = options.get("user_id")
        user_email = options.get("user_email")
        if not user_id and not user_email:
            raise CommandError("Provide --user-id or --user-email.")

        User = get_user_model()
        if user_id:
            user = User.objects.filter(id=user_id).first()
        else:
            user = User.objects.filter(email__iexact=user_email).first()

        if not user:
            raise CommandError("User not found.")
        return user

    def _get_account(self, options, user):
        account_id = options.get("account_id")
        account_name = options.get("account_name")
        if not account_id and not account_name:
            raise CommandError("Provide --account-id or --account-name.")

        if account_id:
            account = Account.objects.filter(user=user, id=account_id).first()
        else:
            account = Account.objects.filter(
                user=user, name__iexact=account_name
            ).first()

        if not account:
            raise CommandError("Account not found for user.")
        return account

    def _parse_pdf(self, pdf_path):
        lines = []
        reader = PdfReader(str(pdf_path))
        for page in reader.pages:
            text = page.extract_text() or ""
            for line in text.splitlines():
                stripped = line.strip()
                if stripped:
                    lines.append(stripped)

        transactions = []
        pending = []
        in_transactions = False
        skip_footer = 0
        i = 0

        while i < len(lines):
            line = lines[i].strip()
            i += 1

            if skip_footer:
                skip_footer -= 1
                continue
            if line == "Page":
                skip_footer = 3
                continue

            if not in_transactions:
                if line == "Transactions":
                    in_transactions = True
                continue

            if self._is_noise_line(line):
                continue

            if DATE_RE.match(line):
                amount_line = lines[i].strip() if i < len(lines) else ""
                balance_line = lines[i + 1].strip() if i + 1 < len(lines) else ""
                if self._is_amount(amount_line) and self._is_amount(balance_line):
                    date = datetime.strptime(line, "%d/%m/%Y").date()
                    amount = self._parse_decimal(amount_line)
                    balance = self._parse_decimal(balance_line)
                    description = " ".join(pending).strip()
                    if description:
                        transactions.append(
                            {
                                "date": date,
                                "amount": amount,
                                "balance": balance,
                                "description": description,
                            }
                        )
                    pending = []
                    i += 2
                continue

            if self._is_amount(line):
                continue

            pending.append(line)

        return transactions

    def _infer_kind(self, tx, prev_balance, fallback_kind):
        if prev_balance is not None:
            delta = tx["balance"] - prev_balance
            return Transaction.Kind.INCOME if delta >= 0 else Transaction.Kind.EXPENSE

        description = tx["description"].lower()
        debit_keywords = ["withdrawal", "purchase", "fee", "charge", "to ", "cash"]
        credit_keywords = ["deposit", "salary", "disbursement", "rtgs", "payoff"]
        if any(word in description for word in debit_keywords):
            return Transaction.Kind.EXPENSE
        if any(word in description for word in credit_keywords):
            return Transaction.Kind.INCOME
        return fallback_kind or Transaction.Kind.INCOME

    def _is_amount(self, value):
        return bool(AMOUNT_RE.match(value))

    def _is_noise_line(self, line):
        lower = line.lower()
        if lower in NOISE_EXACT:
            return True
        if any(fragment in lower for fragment in NOISE_CONTAINS):
            return True
        if lower.startswith("statement date"):
            return True
        if lower.startswith("statement period"):
            return True
        if lower.startswith("account created"):
            return True
        return False

    def _parse_decimal(self, value):
        if value is None:
            return None
        try:
            return Decimal(str(value).replace(",", ""))
        except (InvalidOperation, AttributeError) as exc:
            raise CommandError(f"Invalid decimal: {value}") from exc
