from django.conf import settings
from django.db import models


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Account(TimeStampedModel):
    class AccountType(models.TextChoices):
        BANK = "BANK", "Bank"
        MOBILE_MONEY = "MOBILE_MONEY", "Mobile Money"
        CASH = "CASH", "Cash"
        SACCO = "SACCO", "SACCO"
        INVESTMENT = "INVESTMENT", "Investment"
        LOAN = "LOAN", "Loan"
        CREDIT_CARD = "CREDIT_CARD", "Credit Card"
        OTHER = "OTHER", "Other"

    class AccountStatus(models.TextChoices):
        ACTIVE = "ACTIVE", "Active"
        CLOSED = "CLOSED", "Closed"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="accounts"
    )
    name = models.CharField(max_length=100)
    account_type = models.CharField(
        max_length=20, choices=AccountType.choices, default=AccountType.BANK
    )
    currency = models.CharField(max_length=10, default="KES")
    opening_balance = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    status = models.CharField(
        max_length=10, choices=AccountStatus.choices, default=AccountStatus.ACTIVE
    )
    institution = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.name} ({self.account_type})"
    
    def calculate_current_balance(self):
        """Calculate current balance: opening_balance + sum of all transactions"""
        from django.db.models import Sum, Q
        
        # Sum income transactions (positive)
        income = self.transactions.filter(kind='INCOME').aggregate(
            total=Sum('amount')
        )['total'] or 0
        
        # Sum expense transactions (negative)
        expenses = self.transactions.filter(kind='EXPENSE').aggregate(
            total=Sum('amount')
        )['total'] or 0
        
        # For transfers, we need to check if this account is the source or destination
        # Transfers out reduce balance (negative), transfers in increase balance (positive)
        # Assuming transfer amounts are stored as positive and we need to subtract them
        transfers_out = self.transactions.filter(kind='TRANSFER').aggregate(
            total=Sum('amount')
        )['total'] or 0
        
        return self.opening_balance + income - expenses - transfers_out


class Category(TimeStampedModel):
    class Kind(models.TextChoices):
        INCOME = "INCOME", "Income"
        EXPENSE = "EXPENSE", "Expense"
        TRANSFER = "TRANSFER", "Transfer"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="categories"
    )
    name = models.CharField(max_length=100)
    kind = models.CharField(max_length=10, choices=Kind.choices)
    parent = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="subcategories",
    )

    class Meta:
        unique_together = ("user", "name", "kind")

    def __str__(self):
        return self.name


class Transaction(TimeStampedModel):
    class Kind(models.TextChoices):
        INCOME = "INCOME", "Income"
        EXPENSE = "EXPENSE", "Expense"
        TRANSFER = "TRANSFER", "Transfer"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="transactions"
    )
    account = models.ForeignKey(
        Account, on_delete=models.CASCADE, related_name="transactions"
    )
    date = models.DateField()
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    kind = models.CharField(max_length=10, choices=Kind.choices)
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, blank=True
    )
    description = models.CharField(max_length=255, blank=True)
    tags = models.CharField(max_length=255, blank=True)
    is_recurring = models.BooleanField(default=False)
    recurring_rule = models.JSONField(null=True, blank=True)
    # Link to savings goal if this transaction is for savings
    savings_goal = models.ForeignKey(
        'savings.SavingsGoal',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="transactions"
    )

    class Meta:
        ordering = ["-date", "-created_at"]

    def __str__(self):
        return f"{self.date} - {self.kind} - {self.amount}"


class RecurringTransaction(TimeStampedModel):
    class Frequency(models.TextChoices):
        DAILY = "DAILY", "Daily"
        WEEKLY = "WEEKLY", "Weekly"
        MONTHLY = "MONTHLY", "Monthly"
        YEARLY = "YEARLY", "Yearly"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="recurring_transactions"
    )
    account = models.ForeignKey(
        Account, on_delete=models.CASCADE, related_name="recurring_transactions"
    )
    date = models.DateField(help_text="Next due date")
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    kind = models.CharField(max_length=10, choices=Transaction.Kind.choices)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    description = models.CharField(max_length=255, blank=True)
    frequency = models.CharField(max_length=10, choices=Frequency.choices, default=Frequency.MONTHLY)
    end_date = models.DateField(null=True, blank=True)
    last_executed = models.DateField(null=True, blank=True)

    class Meta:
        ordering = ["-date"]

    def __str__(self):
        return f"Recurring {self.kind} {self.amount} every {self.frequency} starting {self.date}"


class Tag(TimeStampedModel):
    """Tags for organizing and analyzing transactions"""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="tags"
    )
    name = models.CharField(max_length=50)
    color = models.CharField(
        max_length=7, default="#3B82F6", help_text="Hex color code"
    )
    
    class Meta:
        unique_together = ("user", "name")
        ordering = ["name"]
    
    def __str__(self):
        return self.name
