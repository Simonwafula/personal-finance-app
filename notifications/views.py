from rest_framework import viewsets, permissions
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Notification
from .serializers import NotificationSerializer


class SmallLimitPagination(LimitOffsetPagination):
    default_limit = 20
    max_limit = 100


class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = SmallLimitPagination

    def get_queryset(self):
        qs = Notification.objects.filter(user=self.request.user)
        params = self.request.query_params
        unread = params.get("unread")
        is_read = params.get("is_read")
        level = params.get("level")
        category = params.get("category")
        q = params.get("q")
        start = params.get("start")  # YYYY-MM-DD
        end = params.get("end")

        if unread == "true":
            qs = qs.filter(is_read=False)
        if is_read in ("true", "false"):
            qs = qs.filter(is_read=(is_read == "true"))
        if level:
            qs = qs.filter(level=level)
        if category:
            qs = qs.filter(category__iexact=category)
        if q:
            qs = (
                qs.filter(title__icontains=q)
                | qs.filter(message__icontains=q)
            )
        if start:
            qs = qs.filter(created_at__date__gte=start)
        if end:
            qs = qs.filter(created_at__date__lte=end)
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["post"], url_path="mark-all-read")
    def mark_all_read(self, request):
        Notification.objects.filter(user=request.user, is_read=False).update(
            is_read=True
        )
        return Response({"status": "ok"})

    @action(detail=True, methods=["post"], url_path="mark-read")
    def mark_read(self, request, pk=None):
        notif = self.get_object()
        notif.is_read = True
        notif.save(update_fields=["is_read"])
        return Response({"status": "ok"})

    @action(detail=False, methods=["get"], url_path="unread-count")
    def unread_count(self, request):
        count = Notification.objects.filter(
            user=request.user, is_read=False
        ).count()
        return Response({"count": count})
