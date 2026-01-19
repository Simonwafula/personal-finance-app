from dataclasses import dataclass
from datetime import date, datetime
from decimal import Decimal, InvalidOperation
from io import BytesIO
import re
from typing import Iterable, List, Optional, Tuple

try:
    from pypdf import PdfReader
except ImportError:  # pragma: no cover - handled by caller
    PdfReader = None


DATE_RE = re.compile(r"^\d{2}[/-]\d{2}[/-]\d{2,4}$")
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


@dataclass
class StatementTransaction:
    date: date
    description: str
    amount: Optional[Decimal] = None
    balance: Optional[Decimal] = None
    credit: Optional[Decimal] = None
    debit: Optional[Decimal] = None


@dataclass
class ParsedStatement:
    statement_type: str
    transactions: List[StatementTransaction]


def parse_statement_pdf(file_bytes: bytes) -> ParsedStatement:
    if PdfReader is None:
        raise RuntimeError("pypdf is required to parse PDF statements.")

    reader = PdfReader(BytesIO(file_bytes))
    lines = _extract_lines(reader.pages)
    text_lower = "\n".join(lines).lower()

    if "m-pesa" in text_lower or "mpesa" in text_lower:
        statement_type = "mpesa"
    elif "equity" in text_lower:
        statement_type = "equity"
    elif "kcb" in text_lower:
        statement_type = "kcb"
    elif "absa" in text_lower:
        statement_type = "absa"
    else:
        statement_type = "generic"

    if statement_type == "equity":
        transactions = _parse_equity(lines)
    elif statement_type == "mpesa":
        transactions = _parse_mpesa(lines)
    else:
        transactions = _parse_generic(lines)

    return ParsedStatement(statement_type=statement_type, transactions=transactions)


def build_preview(
    transactions: List[StatementTransaction],
    opening_balance: Optional[Decimal] = None,
    first_kind: Optional[str] = None,
) -> Tuple[List[dict], dict]:
    if transactions and transactions[0].date > transactions[-1].date:
        transactions = list(reversed(transactions))

    preview_rows = []
    prev_balance = opening_balance
    income = 0
    expense = 0

    for idx, tx in enumerate(transactions):
        kind = _infer_kind(tx, prev_balance, first_kind if idx == 0 else None)
        if kind == "INCOME":
            income += 1
        else:
            expense += 1

        amount = _resolve_amount(tx, kind)
        if amount is None:
            continue

        preview_rows.append(
            {
                "date": tx.date.isoformat(),
                "amount": f"{amount:.2f}",
                "kind": kind,
                "description": tx.description[:255],
                "balance": f"{tx.balance:.2f}" if tx.balance is not None else None,
            }
        )

        if tx.balance is not None:
            prev_balance = tx.balance

    summary = {
        "total": len(preview_rows),
        "income": income,
        "expense": expense,
    }
    return preview_rows, summary


def _extract_lines(pages: Iterable) -> List[str]:
    lines: List[str] = []
    for page in pages:
        text = page.extract_text() or ""
        for line in text.splitlines():
            stripped = line.strip()
            if stripped:
                lines.append(stripped)

    cleaned: List[str] = []
    skip_footer = 0
    for line in lines:
        if skip_footer:
            skip_footer -= 1
            continue
        if line == "Page":
            skip_footer = 3
            continue
        cleaned.append(line)
    return cleaned


def _parse_equity(lines: List[str]) -> List[StatementTransaction]:
    return _parse_date_amount_balance(lines, start_marker="Transactions")


def _parse_mpesa(lines: List[str]) -> List[StatementTransaction]:
    return _parse_date_amount_balance(lines, start_marker=None, expect_three_amounts=True)


def _parse_generic(lines: List[str]) -> List[StatementTransaction]:
    return _parse_date_amount_balance(lines, start_marker=None)


def _parse_date_amount_balance(
    lines: List[str],
    start_marker: Optional[str],
    expect_three_amounts: bool = False,
) -> List[StatementTransaction]:
    in_section = start_marker is None
    pending: List[str] = []
    transactions: List[StatementTransaction] = []
    i = 0

    while i < len(lines):
        line = lines[i].strip()
        i += 1

        if not in_section:
            if line == start_marker:
                in_section = True
            continue

        if _is_noise_line(line):
            continue

        if DATE_RE.match(line):
            amounts: List[Decimal] = []
            j = i
            while j < len(lines) and len(amounts) < (3 if expect_three_amounts else 2):
                candidate = lines[j].strip()
                if _is_noise_line(candidate):
                    j += 1
                    continue
                if DATE_RE.match(candidate):
                    break
                if _is_amount(candidate):
                    amounts.append(_parse_decimal(candidate))
                    j += 1
                    continue
                if amounts:
                    break
                j += 1

            if len(amounts) >= 2:
                tx_date = _parse_date(line)
                description = " ".join(pending).strip()
                if description:
                    tx = StatementTransaction(
                        date=tx_date,
                        description=description,
                        amount=amounts[0],
                        balance=amounts[-1],
                    )
                    if expect_three_amounts and len(amounts) >= 3:
                        tx.debit = amounts[0]
                        tx.credit = amounts[1]
                        tx.balance = amounts[2]
                    transactions.append(tx)
                pending = []
                i = j
            continue

        if _is_amount(line):
            continue

        pending.append(line)

    return transactions


def _infer_kind(
    tx: StatementTransaction,
    prev_balance: Optional[Decimal],
    fallback_kind: Optional[str],
) -> str:
    if tx.credit is not None or tx.debit is not None:
        if tx.credit and tx.credit > 0:
            return "INCOME"
        if tx.debit and tx.debit > 0:
            return "EXPENSE"

    if tx.balance is not None and prev_balance is not None:
        delta = tx.balance - prev_balance
        return "INCOME" if delta >= 0 else "EXPENSE"

    description = tx.description.lower()
    debit_keywords = ["withdrawal", "purchase", "fee", "charge", "to ", "cash"]
    credit_keywords = ["deposit", "salary", "disbursement", "rtgs", "payoff"]
    if any(word in description for word in debit_keywords):
        return "EXPENSE"
    if any(word in description for word in credit_keywords):
        return "INCOME"
    return fallback_kind or "INCOME"


def _resolve_amount(tx: StatementTransaction, kind: str) -> Optional[Decimal]:
    if tx.credit is not None or tx.debit is not None:
        if kind == "INCOME" and tx.credit is not None:
            return tx.credit
        if kind == "EXPENSE" and tx.debit is not None:
            return tx.debit
    return tx.amount


def _is_amount(value: str) -> bool:
    return bool(AMOUNT_RE.match(value))


def _parse_decimal(value: str) -> Decimal:
    try:
        return Decimal(value.replace(",", ""))
    except (InvalidOperation, AttributeError) as exc:
        raise ValueError(f"Invalid decimal: {value}") from exc


def _parse_date(value: str) -> date:
    for fmt in ("%d/%m/%Y", "%d-%m-%Y", "%d/%m/%y", "%d-%m-%y"):
        try:
            return datetime.strptime(value, fmt).date()
        except ValueError:
            continue
    raise ValueError(f"Invalid date: {value}")


def _is_noise_line(line: str) -> bool:
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
