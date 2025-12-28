import datetime
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.db.models import Sum

from finance.models import Transaction, RecurringTransaction
from budgeting.models import Budget
from notifications.utils import create_notification
from notifications.models import Notification as NotificationModel
from profiles.models import UserProfile


class Command(BaseCommand):
    help = (
        "Run cross-cutting notifications checks: budget threshold warnings "
        "and upcoming recurring transaction reminders."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--threshold",
            type=float,
            default=0.9,
            help="Budget usage ratio to warn at (default 0.9)",
        )
        parser.add_argument(
            "--days",
            type=int,
            default=3,
            help="Days ahead for recurring due reminders (default 3)",
        )

    def handle(self, *args, **options):
        threshold = float(options.get("threshold") or 0.9)
        days = int(options.get("days") or 3)

        budget_notifs = self._check_budgets(threshold)
        recurring_notifs = self._check_recurring_due(days)

        self.stdout.write(
            self.style.SUCCESS(
                "Notifications created — "
                f"budget: {budget_notifs}, recurring: {recurring_notifs}"
            )
        )

    def _should_send_email(self, user, notification_type: str) -> bool:
        """Check if user has enabled email notifications for given type."""
        try:
            profile = UserProfile.objects.get(user=user)
            if not profile.email_notifications:
                return False
            if notification_type == "budget" and not profile.email_budget_alerts:
                return False
            if notification_type == "recurring" and not profile.email_recurring_reminders:
                return False
            return True
        except UserProfile.DoesNotExist:
            return False

    def _check_budgets(self, threshold: float) -> int:
        today = datetime.date.today()
        created = 0
        # Active budgets across users
        budgets = (
            Budget.objects.filter(start_date__lte=today, end_date__gte=today)
            .select_related("user")
            .prefetch_related("lines__category")
        )
        for budget in budgets:
            user = budget.user
            for line in budget.lines.all():
                planned = Decimal(line.planned_amount or 0)
                if planned <= 0:
                    continue
                actual = (
                    Transaction.objects.filter(
                        user=user,
                        date__gte=budget.start_date,
                        date__lte=budget.end_date,
                        category_id=line.category_id,
                    ).aggregate(total=Sum("amount"))
                ).get("total") or Decimal("0")

                ratio = float(actual / planned) if planned else 0.0
                if ratio < threshold:
                    continue

                title = (
                    f"Budget '{budget.name}': {line.category.name} reached "
                    f"{int(threshold*100)}%"
                )
                recent_exists = NotificationModel.objects.filter(
                    user=user,
                    title=title,
                    created_at__gte=budget.start_date,
                ).exists()
                if recent_exists:
                    continue

                msg = (
                    f"Planned: {planned}. Spent: {actual}. Period: "
                    f"{budget.start_date} → {budget.end_date}."
                )
                try:
                    create_notification(
                        user=user,
                        title=title,
                        message=msg,
                        level=NotificationModel.Level.WARNING,
                        category="budget",
                        link_url="/budgets",
                        send_email_flag=self._should_send_email(user, "budget"),
                    )
                    created += 1
                except Exception:
                    # skip errors per-user
                    pass

        return created

    def _check_recurring_due(self, days: int) -> int:
        today = datetime.date.today()
        horizon = today + datetime.timedelta(days=days)
        created = 0

        for r in RecurringTransaction.objects.select_related("user").all():
            # Compute next occurrence similar to finance.views
            next_date = r.date if not r.last_executed else r.last_executed
            if r.last_executed:
                if r.frequency == RecurringTransaction.Frequency.DAILY:
                    next_date = next_date + datetime.timedelta(days=1)
                elif r.frequency == RecurringTransaction.Frequency.WEEKLY:
                    next_date = next_date + datetime.timedelta(weeks=1)
                elif r.frequency == RecurringTransaction.Frequency.MONTHLY:
                    month = next_date.month - 1 + 1
                    year = next_date.year + month // 12
                    month = month % 12 + 1
                    day = min(next_date.day, 28)
                    next_date = datetime.date(year, month, day)
                else:
                    next_date = next_date.replace(year=next_date.year + 1)

            if not (today <= next_date <= horizon):
                continue

            title = f"Upcoming subscription on {next_date.isoformat()}"
            recent_exists = NotificationModel.objects.filter(
                user=r.user, title=title, created_at__gte=today
            ).exists()
            if recent_exists:
                continue

            message = (
                f"{r.description or 'Recurring transaction'} scheduled on "
                f"{next_date.isoformat()} for {r.amount}."
            )
            try:
                create_notification(
                    user=r.user,
                    title=title,
                    message=message,
                    level=NotificationModel.Level.INFO,
                    category="recurring-due",
                    link_url="/subscriptions",
                    send_email_flag=self._should_send_email(r.user, "recurring"),
                )
                created += 1
            except Exception:
                pass

        return created
