from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import DebtPlan
from .serializers import DebtPlanSerializer
from .utils import generate_debt_schedule


class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return getattr(obj, "user", None) == request.user


class DebtPlanViewSet(viewsets.ModelViewSet):
    serializer_class = DebtPlanSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return DebtPlan.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["get"])
    def schedule(self, request, pk=None):
        plan = self.get_object()
        data = generate_debt_schedule(plan)
        return Response(data)
