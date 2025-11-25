from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BudgetViewSet, BudgetLineViewSet

router = DefaultRouter()
router.register(r"budgets", BudgetViewSet, basename="budget")
router.register(r"budget-lines", BudgetLineViewSet, basename="budget-line")

urlpatterns = [
    path("", include(router.urls)),
]
