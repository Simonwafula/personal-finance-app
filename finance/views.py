# finance/views.py
from rest_framework import viewsets, permissions
from django.contrib.auth import get_user_model

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
        if account_id:
            # Ensure account belongs to user
            qs = qs.filter(
                account_id=account_id, account__user=self.request.user
            )
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
