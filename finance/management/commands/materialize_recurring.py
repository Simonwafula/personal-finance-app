from django.core.management.base import BaseCommand
from django.utils import timezone
from finance.models import RecurringTransaction, Transaction

from datetime import date
import datetime


def add_months(d, months):
    # naive month adder
    month = d.month - 1 + months
    year = d.year + month // 12
    month = month % 12 + 1
    day = min(d.day, 28)
    return date(year, month, day)


class Command(BaseCommand):
    help = "Materialize recurring transactions into actual Transaction rows"

    def add_arguments(self, parser):
        parser.add_argument("--days", type=int, default=30, help="How many days ahead to materialize")

    def handle(self, *args, **options):
        days = options.get("days", 30)
        today = timezone.localdate()
        horizon = today + datetime.timedelta(days=days)
        qs = RecurringTransaction.objects.all()
        created = 0
        for r in qs:
            # start from either last_executed+frequency or r.date
            next_date = r.date if not r.last_executed else r.last_executed
            # advance one step if last_executed equals next_date
            if r.last_executed:
                if r.frequency == RecurringTransaction.Frequency.DAILY:
                    next_date = next_date + datetime.timedelta(days=1)
                elif r.frequency == RecurringTransaction.Frequency.WEEKLY:
                    next_date = next_date + datetime.timedelta(weeks=1)
                elif r.frequency == RecurringTransaction.Frequency.MONTHLY:
                    next_date = add_months(next_date, 1)
                else:
                    next_date = next_date.replace(year=next_date.year + 1)

            while next_date <= horizon and (not r.end_date or next_date <= r.end_date):
                # create transaction
                Transaction.objects.create(
                    user=r.user,
                    account=r.account,
                    date=next_date,
                    amount=r.amount,
                    kind=r.kind,
                    category=r.category,
                    description=(r.description or "Recurring transaction"),
                )
                created += 1
                r.last_executed = next_date
                # advance next_date
                if r.frequency == RecurringTransaction.Frequency.DAILY:
                    next_date = next_date + datetime.timedelta(days=1)
                elif r.frequency == RecurringTransaction.Frequency.WEEKLY:
                    next_date = next_date + datetime.timedelta(weeks=1)
                elif r.frequency == RecurringTransaction.Frequency.MONTHLY:
                    next_date = add_months(next_date, 1)
                else:
                    next_date = next_date.replace(year=next_date.year + 1)

            r.save()

        self.stdout.write(self.style.SUCCESS(f"Materialized {created} transactions"))
