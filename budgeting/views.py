from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Budget, BudgetLine
from .serializers import BudgetSerializer, BudgetLineSerializer
from .utils import calculate_budget_summary


class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return getattr(obj, "user", None) == request.user


class BudgetViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["get"])
    def summary(self, request, pk=None):
        budget = self.get_object()
        data = calculate_budget_summary(budget)
        return Response(data)


class BudgetLineViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetLineSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = BudgetLine.objects.filter(budget__user=self.request.user)
        budget_id = self.request.query_params.get("budget")
        if budget_id:
            qs = qs.filter(budget_id=budget_id)
        return qs

    def perform_create(self, serializer):
        budget = serializer.validated_data["budget"]
        if budget.user != self.request.user:
            raise permissions.PermissionDenied(
                "Cannot add lines to another user's budget."
            )
        serializer.save()
