from django.conf import settings
from django.db import models
from wealth.models import Liability


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class DebtPlan(TimeStampedModel):
    class Strategy(models.TextChoices):
        AVALANCHE = "AVALANCHE", "Avalanche (Highest Interest First)"
        SNOWBALL = "SNOWBALL", "Snowball (Lowest Balance First)"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="debt_plans",
    )
    strategy = models.CharField(
        max_length=10, choices=Strategy.choices, default=Strategy.AVALANCHE
    )
    monthly_amount_available = models.DecimalField(max_digits=14, decimal_places=2)
    start_date = models.DateField()

    def __str__(self):
        return f"{self.user} - {self.strategy} plan"
