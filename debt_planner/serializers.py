from rest_framework import serializers
from .models import DebtPlan


class DebtPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = DebtPlan
        fields = [
            "id",
            "strategy",
            "monthly_amount_available",
            "start_date",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
