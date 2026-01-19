from django.core.management.base import BaseCommand

from activity.utils import cleanup_old_logs, RETENTION_DAYS


class Command(BaseCommand):
    help = "Delete activity logs older than the retention window."

    def add_arguments(self, parser):
        parser.add_argument(
            "--days",
            type=int,
            default=RETENTION_DAYS,
            help="Retention window in days (default: 365).",
        )

    def handle(self, *args, **options):
        days = options.get("days") or RETENTION_DAYS
        deleted = cleanup_old_logs(days=days)
        self.stdout.write(self.style.SUCCESS(f"Deleted {deleted} activity logs."))
