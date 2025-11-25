from rest_framework import serializers
from .models import Account, Category, Transaction


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
