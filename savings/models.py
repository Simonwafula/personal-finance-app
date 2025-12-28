from django.db import models
from django.conf import settings
from finance.models import Account, Transaction


class SavingsGoal(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="savings_goals"
    )
    name = models.CharField(max_length=200)
    target_amount = models.DecimalField(
        max_digits=14,
        decimal_places=2
    )
    current_amount = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        default=0
    )
    target_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    linked_account = models.ForeignKey(
        Account,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="savings_goals"
    )
    description = models.TextField(blank=True)
    emoji = models.CharField(max_length=10, default="🎯")
    interest_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0,
        help_text="Annual interest rate as a percentage (e.g., 10 for 10%)"
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.user.username}"

    @property
    def progress_percentage(self):
        if self.target_amount <= 0:
            return 0
        return min(
            100,
            (float(self.current_amount) / float(self.target_amount)) * 100
        )

    @property
    def remaining_amount(self):
        return max(0, self.target_amount - self.current_amount)


class GoalContribution(models.Model):
    CONTRIBUTION_TYPE = [
        ('MANUAL', 'Manual'),
        ('AUTOMATIC', 'Automatic'),
    ]

    goal = models.ForeignKey(
        SavingsGoal,
        on_delete=models.CASCADE,
        related_name="contributions"
    )
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    contribution_type = models.CharField(
        max_length=10,
        choices=CONTRIBUTION_TYPE,
        default='MANUAL'
    )
    date = models.DateField()
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    # Link to transaction if contribution came from a categorized transaction
    transaction = models.OneToOneField(
        Transaction,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="savings_contribution"
    )

    class Meta:
        ordering = ['-date', '-created_at']

    def __str__(self):
        return (
            f"{self.goal.name} - "
            f"{self.amount} on {self.date}"
        )

    def save(self, *args, **kwargs):
        # Update goal's current amount when contribution is saved
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new:
            self.goal.current_amount += self.amount
            self.goal.save()
