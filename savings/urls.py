from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SavingsGoalViewSet, GoalContributionViewSet

router = DefaultRouter()
router.register(r'goals', SavingsGoalViewSet, basename='savingsgoal')
router.register(
    r'contributions',
    GoalContributionViewSet,
    basename='goalcontribution'
)

urlpatterns = [
    path('', include(router.urls)),
]
