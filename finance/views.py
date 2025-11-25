# finance/views.py
from rest_framework import viewsets, permissions
from django.contrib.auth import get_user_model

from .models import Account, Category, Transaction
from .serializers import AccountSerializer, CategorySerializer, TransactionSerializer

User = get_user_model()


class AccountViewSet(viewsets.ModelViewSet):
    serializer_class = AccountSerializer
    # DEV: allow calls even if not logged in
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Account.objects.all()

    def perform_create(self, serializer):
        # DEV: if not logged in, attach the first user (usually your superuser)
        user = self.request.user if self.request.user.is_authenticated else User.objects.first()
        serializer.save(user=user)


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Category.objects.all()

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else User.objects.first()
        serializer.save(user=user)


class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = Transaction.objects.all()
        account_id = self.request.query_params.get("account")
        if account_id:
            qs = qs.filter(account_id=account_id)
        return qs

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else User.objects.first()
        serializer.save(user=user)
