from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone

from .models import Asset, Liability, NetWorthSnapshot
from .serializers import (
    AssetSerializer,
    LiabilitySerializer,
    NetWorthSnapshotSerializer,
)
from .utils import compute_current_net_worth, create_net_worth_snapshot


class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return getattr(obj, "user", None) == request.user


class AssetViewSet(viewsets.ModelViewSet):
    serializer_class = AssetSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return Asset.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class LiabilityViewSet(viewsets.ModelViewSet):
    serializer_class = LiabilitySerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return Liability.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class NetWorthSnapshotViewSet(viewsets.ModelViewSet):
    serializer_class = NetWorthSnapshotSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return NetWorthSnapshot.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["get"])
    def current(self, request):
        data = compute_current_net_worth(request.user)
        return Response(data)

    @action(detail=False, methods=["post"])
    def snapshot(self, request):
        today = timezone.localdate()
        snapshot = create_net_worth_snapshot(request.user, today)
        serializer = self.get_serializer(snapshot)
        return Response(serializer.data)
