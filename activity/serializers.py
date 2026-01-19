from rest_framework import serializers

from .models import ActivityLog


class ActivityLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityLog
        fields = [
            "id",
            "created_at",
            "actor",
            "action",
            "summary",
            "entity_type",
            "entity_id",
            "metadata",
        ]
