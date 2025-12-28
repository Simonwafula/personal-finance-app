from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InvestmentViewSet, InvestmentTransactionViewSet

router = DefaultRouter()
router.register(r'investments', InvestmentViewSet, basename='investment')
router.register(r'transactions', InvestmentTransactionViewSet, basename='investment-transaction')

urlpatterns = [
    path('', include(router.urls)),
]
