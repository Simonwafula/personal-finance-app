from rest_framework import serializers
from .models import Investment, InvestmentTransaction


class InvestmentTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvestmentTransaction
        fields = [
            'id', 'transaction_type', 'date', 'quantity',
            'price_per_unit', 'total_amount', 'fees', 'notes', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class InvestmentSerializer(serializers.ModelSerializer):
    total_invested = serializers.ReadOnlyField()
    current_value = serializers.ReadOnlyField()
    gain_loss = serializers.ReadOnlyField()
    gain_loss_percentage = serializers.ReadOnlyField()
    days_held = serializers.ReadOnlyField()
    annualized_return = serializers.ReadOnlyField()
    annual_income = serializers.ReadOnlyField()
    net_rental_yield = serializers.ReadOnlyField()
    transactions = InvestmentTransactionSerializer(many=True, read_only=True)
    investment_type_display = serializers.CharField(source='get_investment_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    bond_type_display = serializers.CharField(source='get_bond_type_display', read_only=True)
    payment_frequency_display = serializers.CharField(source='get_payment_frequency_display', read_only=True)
    occupancy_status_display = serializers.CharField(source='get_occupancy_status_display', read_only=True)

    class Meta:
        model = Investment
        fields = [
            'id', 'name', 'symbol', 'investment_type', 'investment_type_display',
            'purchase_date', 'purchase_price', 'quantity', 'purchase_fees',
            'current_price', 'last_updated', 'interest_rate', 'maturity_date',
            # Bond fields
            'bond_type', 'bond_type_display', 'payment_frequency', 'payment_frequency_display',
            'next_payment_date', 'tax_rate', 'face_value',
            # Real estate fields
            'monthly_rent', 'monthly_costs', 'property_tax_annual', 
            'occupancy_status', 'occupancy_status_display',
            # Insurance fields
            'sum_assured', 'premium_frequency', 'premium_amount', 'surrender_value',
            # SACCO fields
            'dividend_rate', 'loan_interest_rebate',
            # Common fields
            'platform', 'notes', 'status', 'status_display',
            'total_invested', 'current_value', 'gain_loss', 'gain_loss_percentage',
            'days_held', 'annualized_return', 'annual_income', 'net_rental_yield',
            'transactions', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'last_updated']


class InvestmentSummarySerializer(serializers.Serializer):
    """Summary statistics for all investments"""
    total_invested = serializers.DecimalField(max_digits=16, decimal_places=2)
    total_current_value = serializers.DecimalField(max_digits=16, decimal_places=2)
    total_gain_loss = serializers.DecimalField(max_digits=16, decimal_places=2)
    total_gain_loss_percentage = serializers.DecimalField(max_digits=8, decimal_places=2)
    total_annual_income = serializers.DecimalField(max_digits=16, decimal_places=2)
    investment_count = serializers.IntegerField()
    by_type = serializers.DictField()
