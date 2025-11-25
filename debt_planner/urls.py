from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DebtPlanViewSet

router = DefaultRouter()
router.register(r"debt-plans", DebtPlanViewSet, basename="debt-plan")

urlpatterns = [
    path("", include(router.urls)),
]
