from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AccountViewSet, CategoryViewSet, TransactionViewSet, RecurringTransactionViewSet

router = DefaultRouter()
router.register(r"accounts", AccountViewSet, basename="account")
router.register(r"categories", CategoryViewSet, basename="category")
router.register(r"transactions", TransactionViewSet, basename="transaction")
router.register(r"recurring", RecurringTransactionViewSet, basename="recurring")

urlpatterns = [
    path("", include(router.urls)),
]
