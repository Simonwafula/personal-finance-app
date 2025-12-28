from rest_framework import serializers
from .models import SavingsGoal, GoalContribution


class GoalContributionSerializer(serializers.ModelSerializer):
    transaction_description = serializers.CharField(
        source='transaction.description',
        read_only=True
    )
    
    class Meta:
        model = GoalContribution
        fields = [
            'id', 'amount', 'contribution_type',
            'date', 'notes', 'created_at', 'transaction',
            'transaction_description'
        ]
        read_only_fields = ['id', 'created_at']


class SavingsGoalSerializer(serializers.ModelSerializer):
    progress_percentage = serializers.ReadOnlyField()
    remaining_amount = serializers.ReadOnlyField()
    linked_account_name = serializers.CharField(
        source='linked_account.name',
        read_only=True
    )
    contributions = GoalContributionSerializer(
        many=True,
        read_only=True
    )
    days_remaining = serializers.SerializerMethodField()
    monthly_target = serializers.SerializerMethodField()
    total_from_transactions = serializers.SerializerMethodField()
    projected_value = serializers.SerializerMethodField()

    class Meta:
        model = SavingsGoal
        fields = [
            'id', 'name', 'target_amount', 'current_amount',
            'target_date', 'created_at', 'updated_at',
            'linked_account', 'linked_account_name',
            'description', 'emoji', 'progress_percentage',
            'remaining_amount', 'contributions',
            'days_remaining', 'monthly_target', 'total_from_transactions',
            'interest_rate', 'projected_value'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at'
        ]

    def get_days_remaining(self, obj):
        if not obj.target_date:
            return None
        from datetime import date
        delta = obj.target_date - date.today()
        return max(0, delta.days)

    def get_monthly_target(self, obj):
        """Calculate monthly savings needed accounting for compound interest.
        
        Uses the PMT formula for future value of an annuity:
        PMT = (FV - PV * (1 + r)^n) * r / ((1 + r)^n - 1)
        
        Where:
        - FV = target amount (future value)
        - PV = current amount (present value)
        - r = monthly interest rate
        - n = number of months
        """
        days_remaining = self.get_days_remaining(obj)
        if not days_remaining or days_remaining == 0:
            return float(obj.remaining_amount)
        
        months_remaining = max(1, days_remaining / 30)
        remaining = float(obj.remaining_amount)
        annual_rate = float(obj.interest_rate) / 100  # Convert percentage to decimal
        
        # If no interest rate, simple division
        if annual_rate <= 0:
            return remaining / months_remaining
        
        # Monthly interest rate
        monthly_rate = annual_rate / 12
        n = months_remaining
        
        # Future value needed (remaining amount)
        # Current amount will grow, so we need less from contributions
        current = float(obj.current_amount)
        target = float(obj.target_amount)
        
        # What current savings will grow to with interest
        current_future_value = current * ((1 + monthly_rate) ** n)
        
        # Remaining amount needed after current savings grow
        amount_needed_from_contributions = target - current_future_value
        
        if amount_needed_from_contributions <= 0:
            # Current savings + interest will exceed target
            return 0
        
        # PMT formula for future value of ordinary annuity
        # PMT = FV * r / ((1 + r)^n - 1)
        if monthly_rate > 0:
            monthly_payment = amount_needed_from_contributions * monthly_rate / (((1 + monthly_rate) ** n) - 1)
        else:
            monthly_payment = amount_needed_from_contributions / n
        
        return max(0, monthly_payment)
    
    def get_projected_value(self, obj):
        """Calculate what current savings will be worth at target date with interest."""
        days_remaining = self.get_days_remaining(obj)
        if not days_remaining:
            return float(obj.current_amount)
        
        months_remaining = max(1, days_remaining / 30)
        current = float(obj.current_amount)
        annual_rate = float(obj.interest_rate) / 100
        
        if annual_rate <= 0:
            return current
        
        monthly_rate = annual_rate / 12
        # Compound interest: FV = PV * (1 + r)^n
        projected = current * ((1 + monthly_rate) ** months_remaining)
        return round(projected, 2)
    
    def get_total_from_transactions(self, obj):
        """Calculate total amount from linked transactions"""
        from django.db.models import Sum
        result = obj.transactions.aggregate(total=Sum('amount'))['total']
        return float(result) if result else 0.0
