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

    class Meta:
        model = SavingsGoal
        fields = [
            'id', 'name', 'target_amount', 'current_amount',
            'target_date', 'created_at', 'updated_at',
            'linked_account', 'linked_account_name',
            'description', 'emoji', 'progress_percentage',
            'remaining_amount', 'contributions',
            'days_remaining', 'monthly_target', 'total_from_transactions'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at',
            'current_amount'
        ]

    def get_days_remaining(self, obj):
        if not obj.target_date:
            return None
        from datetime import date
        delta = obj.target_date - date.today()
        return max(0, delta.days)

    def get_monthly_target(self, obj):
        days_remaining = self.get_days_remaining(obj)
        if not days_remaining or days_remaining == 0:
            return float(obj.remaining_amount)
        months_remaining = max(1, days_remaining / 30)
        return float(obj.remaining_amount) / months_remaining
    
    def get_total_from_transactions(self, obj):
        """Calculate total amount from linked transactions"""
        from django.db.models import Sum
        result = obj.transactions.aggregate(total=Sum('amount'))['total']
        return float(result) if result else 0.0
