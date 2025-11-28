from rest_framework import serializers
from .models import Account, Category, Transaction
from .models import RecurringTransaction


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = [
            "id",
            "name",
            "account_type",
            "currency",
            "opening_balance",
            "status",
            "institution",
            "notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "kind",
            "parent",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class TransactionSerializer(serializers.ModelSerializer):
    account_name = serializers.ReadOnlyField(source="account.name")
    category_name = serializers.ReadOnlyField(source="category.name")

    class Meta:
        model = Transaction
        fields = [
            "id",
            "account",
            "account_name",
            "date",
            "amount",
            "kind",
            "category",
            "category_name",
            "description",
            "tags",
            "is_recurring",
            "recurring_rule",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class AggregatedPointSerializer(serializers.Serializer):
    """Serializer for aggregated transaction data points."""
    date = serializers.CharField()
    income = serializers.FloatField()
    expenses = serializers.FloatField()


class TopCategorySerializer(serializers.Serializer):
    """Serializer for top expense categories."""
    id = serializers.IntegerField()
    name = serializers.CharField()
    amount = serializers.FloatField()


class AggregatedResponseSerializer(serializers.Serializer):
    """Response wrapper for aggregated transactions."""
    series = AggregatedPointSerializer(many=True)


class TopCategoriesResponseSerializer(serializers.Serializer):
    """Response wrapper for top categories."""
    categories = TopCategorySerializer(many=True)


class RecurringTransactionSerializer(serializers.ModelSerializer):
    account_name = serializers.ReadOnlyField(source="account.name")
    category_name = serializers.ReadOnlyField(source="category.name")

    class Meta:
        model = RecurringTransaction
        fields = [
            "id",
            "account",
            "account_name",
            "date",
            "amount",
            "kind",
            "category",
            "category_name",
            "description",
            "frequency",
            "end_date",
            "last_executed",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

