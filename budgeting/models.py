from django.conf import settings
from django.db import models
from finance.models import Category


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Budget(TimeStampedModel):
    class PeriodType(models.TextChoices):
        MONTHLY = "MONTHLY", "Monthly"
        ANNUAL = "ANNUAL", "Annual"
        CUSTOM = "CUSTOM", "Custom"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="budgets"
    )
    name = models.CharField(max_length=100)
    period_type = models.CharField(
        max_length=10, choices=PeriodType.choices, default=PeriodType.MONTHLY
    )
    start_date = models.DateField()
    end_date = models.DateField()
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.name} ({self.start_date} → {self.end_date})"


class BudgetLine(TimeStampedModel):
    budget = models.ForeignKey(
        Budget, on_delete=models.CASCADE, related_name="lines"
    )
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    planned_amount = models.DecimalField(max_digits=14, decimal_places=2)

    class Meta:
        unique_together = ("budget", "category")

    def __str__(self):
        return f"{self.budget.name} - {self.category.name}"
