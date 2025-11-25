from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AssetViewSet, LiabilityViewSet, NetWorthSnapshotViewSet

router = DefaultRouter()
router.register(r"assets", AssetViewSet, basename="asset")
router.register(r"liabilities", LiabilityViewSet, basename="liability")
router.register(r"net-worth-snapshots", NetWorthSnapshotViewSet, basename="net-worth-snapshot")

urlpatterns = [
    path("", include(router.urls)),
]
