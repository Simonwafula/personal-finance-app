from django.core.management.base import BaseCommand
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from budgeting.models import Budget

import datetime


class Command(BaseCommand):
    help = "Send simple notification emails for budgets nearing end date"

    def handle(self, *args, **options):
        today = timezone.localdate()
        soon = today + datetime.timedelta(days=3)
        budgets = Budget.objects.filter(end_date__lte=soon, end_date__gte=today)
        sent = 0
        for b in budgets:
            user = b.user
            try:
                subject = f"Budget ending soon: {b.name}"
                message = f"Your budget '{b.name}' ends on {b.end_date}. Check its summary in the app."
                send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email], fail_silently=False)
                sent += 1
            except Exception as e:
                print(f"Failed to send to {user.email}: {e}")

        self.stdout.write(self.style.SUCCESS(f"Sent {sent} budget notifications"))
