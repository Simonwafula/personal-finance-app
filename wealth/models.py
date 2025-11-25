from django.conf import settings
from django.db import models
from finance.models import Account


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Asset(TimeStampedModel):
    class AssetType(models.TextChoices):
        MMF = "MMF", "Money Market Fund"
        STOCK = "STOCK", "Stock"
        BOND = "BOND", "Bond"
        LAND = "LAND", "Land"
        VEHICLE = "VEHICLE", "Vehicle"
        BUSINESS = "BUSINESS", "Business"
        PENSION = "PENSION", "Pension"
        OTHER = "OTHER", "Other"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="assets"
    )
    name = models.CharField(max_length=100)
    asset_type = models.CharField(
        max_length=20, choices=AssetType.choices, default=AssetType.OTHER
    )
    current_value = models.DecimalField(max_digits=16, decimal_places=2)
    acquisition_date = models.DateField(null=True, blank=True)
    cost_basis = models.DecimalField(
        max_digits=16, decimal_places=2, null=True, blank=True
    )
    currency = models.CharField(max_length=10, default="KES")
    linked_account = models.ForeignKey(
        Account, on_delete=models.SET_NULL, null=True, blank=True
    )
    notes = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Liability(TimeStampedModel):
    class LiabilityType(models.TextChoices):
        MORTGAGE = "MORTGAGE", "Mortgage"
        LOAN = "LOAN", "Loan"
        CREDIT_CARD = "CREDIT_CARD", "Credit Card"
        OTHER = "OTHER", "Other"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="liabilities"
    )
    name = models.CharField(max_length=100)
    liability_type = models.CharField(
        max_length=20, choices=LiabilityType.choices, default=LiabilityType.LOAN
    )
    principal_balance = models.DecimalField(max_digits=16, decimal_places=2)
    interest_rate = models.DecimalField(
        max_digits=5, decimal_places=2, help_text="Annual interest rate in %"
    )
    minimum_payment = models.DecimalField(max_digits=14, decimal_places=2)
    due_day_of_month = models.PositiveSmallIntegerField(null=True, blank=True)
    linked_account = models.ForeignKey(
        Account, on_delete=models.SET_NULL, null=True, blank=True
    )
    notes = models.TextField(blank=True)

    def __str__(self):
        return self.name


class NetWorthSnapshot(TimeStampedModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="net_worth_snapshots",
    )
    date = models.DateField()
    total_assets = models.DecimalField(max_digits=16, decimal_places=2)
    total_liabilities = models.DecimalField(max_digits=16, decimal_places=2)
    net_worth = models.DecimalField(max_digits=16, decimal_places=2)

    class Meta:
        unique_together = ("user", "date")
        ordering = ["-date"]

    def __str__(self):
        return f"{self.user} - {self.date} - {self.net_worth}"
