from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction as db_transaction
from django.db.models import Sum
from uuid import uuid4

from finance.models import Transaction
from savings.models import GoalContribution, SavingsGoal


class Command(BaseCommand):
    help = (
        "Backfill transaction links (savings contributions, investment actions, "
        "transfer pairs)."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--user-id",
            type=int,
            help="Limit backfill to a specific user id",
        )
        parser.add_argument(
            "--apply-savings",
            action="store_true",
            help=(
                "Recalculate savings goal current_amount from contributions "
                "after backfill."
            ),
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Show what would change without writing",
        )

    def handle(self, *args, **options):
        user_id = options.get("user_id")
        apply_savings = options.get("apply_savings")
        dry_run = options.get("dry_run")

        User = get_user_model()
        users = User.objects.all()
        if user_id:
            users = users.filter(id=user_id)

        totals = {
            "savings_contributions_created": 0,
            "investment_actions_set": 0,
            "transfer_pairs_created": 0,
            "transfer_pairs_updated": 0,
            "savings_recalculated": 0,
        }

        for user in users:
            with db_transaction.atomic():
                totals["savings_contributions_created"] += self._backfill_savings(
                    user, dry_run
                )
                totals["investment_actions_set"] += self._backfill_investments(
                    user, dry_run
                )
                created, updated = self._backfill_transfers(user, dry_run)
                totals["transfer_pairs_created"] += created
                totals["transfer_pairs_updated"] += updated

                if apply_savings:
                    totals["savings_recalculated"] += self._recalculate_savings(
                        user, dry_run
                    )

        self.stdout.write(self.style.SUCCESS("Backfill complete."))
        for key, value in totals.items():
            self.stdout.write(f"{key}: {value}")

    def _backfill_savings(self, user, dry_run):
        count = 0
        txs = Transaction.objects.filter(
            user=user,
            savings_goal__isnull=False,
        ).exclude(kind=Transaction.Kind.TRANSFER)

        for tx in txs:
            if GoalContribution.objects.filter(transaction=tx).exists():
                continue
            count += 1
            if dry_run:
                continue
            GoalContribution.objects.create(
                goal=tx.savings_goal,
                amount=tx.amount,
                date=tx.date,
                contribution_type="AUTOMATIC",
                notes=tx.description or "",
                transaction=tx,
            )

        return count

    def _backfill_investments(self, user, dry_run):
        count = 0
        expense_qs = Transaction.objects.filter(
            user=user,
            investment__isnull=False,
            investment_action__isnull=True,
            kind=Transaction.Kind.EXPENSE,
        )
        income_qs = Transaction.objects.filter(
            user=user,
            investment__isnull=False,
            investment_action__isnull=True,
            kind=Transaction.Kind.INCOME,
        )
        count += expense_qs.count() + income_qs.count()
        if dry_run:
            return count
        expense_qs.update(investment_action=Transaction.InvestmentAction.BUY)
        income_qs.update(investment_action=Transaction.InvestmentAction.SELL)
        return count

    def _backfill_transfers(self, user, dry_run):
        created = 0
        updated = 0
        txs = Transaction.objects.filter(
            user=user,
            kind=Transaction.Kind.TRANSFER,
            transfer_account__isnull=False,
        )

        for tx in txs:
            if tx.transfer_group and tx.transfer_direction:
                continue

            group_id = tx.transfer_group or uuid4()
            direction = tx.transfer_direction or Transaction.TransferDirection.OUT

            if not dry_run:
                tx.transfer_group = group_id
                tx.transfer_direction = direction
                tx.save(update_fields=["transfer_group", "transfer_direction"])

            counterpart = Transaction.objects.filter(
                user=user,
                kind=Transaction.Kind.TRANSFER,
                account=tx.transfer_account,
                transfer_account=tx.account,
                amount=tx.amount,
                date=tx.date,
            ).exclude(id=tx.id).first()

            if counterpart:
                updated += 1
                if not dry_run:
                    counterpart.transfer_group = group_id
                    counterpart.transfer_direction = Transaction.TransferDirection.IN
                    counterpart.save(update_fields=["transfer_group", "transfer_direction"])
                continue

            created += 1
            if dry_run:
                continue

            Transaction.objects.create(
                user=user,
                account=tx.transfer_account,
                transfer_account=tx.account,
                transfer_group=group_id,
                transfer_direction=Transaction.TransferDirection.IN,
                date=tx.date,
                amount=tx.amount,
                fee=0,
                kind=Transaction.Kind.TRANSFER,
                category=tx.category,
                description=tx.description,
                tags=tx.tags,
                is_recurring=tx.is_recurring,
                recurring_rule=tx.recurring_rule,
                source=tx.source,
                sms_reference=tx.sms_reference,
                sms_detected_at=tx.sms_detected_at,
            )

        return created, updated

    def _recalculate_savings(self, user, dry_run):
        count = 0
        goals = SavingsGoal.objects.filter(user=user)
        for goal in goals:
            total = (
                GoalContribution.objects.filter(goal=goal)
                .aggregate(total=Sum("amount"))
                .get("total")
                or 0
            )
            count += 1
            if dry_run:
                continue
            goal.current_amount = total
            goal.save(update_fields=["current_amount"])
        return count
