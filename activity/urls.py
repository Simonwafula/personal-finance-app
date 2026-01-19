from rest_framework.routers import DefaultRouter

from .views import ActivityLogViewSet

router = DefaultRouter()
router.register(r"logs", ActivityLogViewSet, basename="activity")

urlpatterns = router.urls
