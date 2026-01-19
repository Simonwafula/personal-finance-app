from datetime import datetime, time, timedelta

from django.utils import timezone
from rest_framework import permissions, viewsets
from rest_framework.pagination import LimitOffsetPagination

from .models import ActivityLog
from .serializers import ActivityLogSerializer
from .utils import RETENTION_DAYS


class ActivityLogViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ActivityLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = LimitOffsetPagination

    def get_queryset(self):
        qs = ActivityLog.objects.filter(user=self.request.user)
        retention_start = timezone.now() - timedelta(days=RETENTION_DAYS)
        qs = qs.filter(created_at__gte=retention_start)

        action = self.request.query_params.get("action")
        entity_type = self.request.query_params.get("entity_type")
        entity_id = self.request.query_params.get("entity_id")
        start = self.request.query_params.get("start")
        end = self.request.query_params.get("end")

        if action:
            qs = qs.filter(action=action)
        if entity_type:
            qs = qs.filter(entity_type=entity_type)
        if entity_id:
            qs = qs.filter(entity_id=str(entity_id))

        if start:
            start_dt = _parse_date(start, time.min)
            if start_dt and start_dt > retention_start:
                qs = qs.filter(created_at__gte=start_dt)
        if end:
            end_dt = _parse_date(end, time.max)
            if end_dt:
                qs = qs.filter(created_at__lte=end_dt)

        return qs


def _parse_date(value: str, t: time):
    try:
        parsed = datetime.strptime(value, "%Y-%m-%d").date()
        tz = timezone.get_current_timezone()
        return timezone.make_aware(datetime.combine(parsed, t), tz)
    except ValueError:
        return None
