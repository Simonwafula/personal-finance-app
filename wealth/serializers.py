from rest_framework import serializers
from .models import Asset, Liability, NetWorthSnapshot


class AssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = [
            "id",
            "name",
            "asset_type",
            "current_value",
            "acquisition_date",
            "cost_basis",
            "currency",
            "linked_account",
            "notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class LiabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Liability
        fields = [
            "id",
            "name",
            "liability_type",
            "principal_balance",
            "interest_rate",
            "minimum_payment",
            "due_day_of_month",
            "linked_account",
            "notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class NetWorthSnapshotSerializer(serializers.ModelSerializer):
    class Meta:
        model = NetWorthSnapshot
        fields = [
            "id",
            "date",
            "total_assets",
            "total_liabilities",
            "net_worth",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
