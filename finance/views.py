# finance/views.py
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.db.models import Sum, Q
from django.db.models.functions import TruncDay, TruncMonth

from .models import Account, Category, Transaction
from .serializers import AccountSerializer, CategorySerializer, TransactionSerializer

User = get_user_model()


class AccountViewSet(viewsets.ModelViewSet):
    serializer_class = AccountSerializer
    # Require authentication for accounts
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only show accounts for the current user
        return Account.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Save as the current user
        serializer.save(user=self.request.user)


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only the current user's transactions
        qs = Transaction.objects.filter(user=self.request.user)
        account_id = self.request.query_params.get("account")
        start = self.request.query_params.get("start")
        end = self.request.query_params.get("end")
        category = self.request.query_params.get("category")
        kind = self.request.query_params.get("kind")
        if account_id:
            # Ensure account belongs to user
            qs = qs.filter(
                account_id=account_id, account__user=self.request.user
            )
        if start:
            qs = qs.filter(date__gte=start)
        if end:
            qs = qs.filter(date__lte=end)
        if category:
            qs = qs.filter(category_id=category)
        if kind:
            qs = qs.filter(kind=kind)
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["get"])
    def aggregated(self, request):
        """
        Returns aggregated transaction amounts grouped by day or month: ?start=YYYY-MM-DD&end=YYYY-MM-DD&group_by=day|month
        """
        qs = Transaction.objects.filter(user=request.user)
        start = request.query_params.get("start")
        end = request.query_params.get("end")
        group_by = request.query_params.get("group_by", "day")
        kind = request.query_params.get("kind")  # optional filter by kind
        if start:
            qs = qs.filter(date__gte=start)
        if end:
            qs = qs.filter(date__lte=end)
        if kind:
            qs = qs.filter(kind=kind)

        if group_by == "month":
            trunc = TruncMonth("date")
        else:
            trunc = TruncDay("date")

        series = (
            qs.annotate(period=trunc)
            .values("period")
            .annotate(
                income=Sum("amount", filter=Q(kind=Transaction.Kind.INCOME)),
                expenses=Sum("amount", filter=Q(kind=Transaction.Kind.EXPENSE)),
            )
            .order_by("period")
        )

        data = [
            {
                "date": s["period"].strftime("%Y-%m-%d") if s["period"] else None,
                "income": float(s.get("income") or 0),
                "expenses": float(s.get("expenses") or 0),
            }
            for s in series
        ]
        return Response({"series": data})

    @action(detail=False, methods=["get"])
    def top_categories(self, request):
        """
        Returns top expense categories between start and end. Use ?start=YYYY-MM-DD&end=YYYY-MM-DD&limit=6
        """
        qs = Transaction.objects.filter(user=request.user, kind=Transaction.Kind.EXPENSE)
        start = request.query_params.get("start")
        end = request.query_params.get("end")
        limit = int(request.query_params.get("limit", 6))
        if start:
            qs = qs.filter(date__gte=start)
        if end:
            qs = qs.filter(date__lte=end)

        cat_series = (
            qs.values("category", "category__name")
            .annotate(amount=Sum("amount"))
            .order_by("-amount")[:limit]
        )
        data = [
            {"id": c["category"], "name": c["category__name"], "amount": float(c["amount"] or 0)}
            for c in cat_series
        ]
        return Response({"categories": data})
