from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import SavingsGoal, GoalContribution
from .serializers import (
    SavingsGoalSerializer,
    GoalContributionSerializer
)


class SavingsGoalViewSet(viewsets.ModelViewSet):
    serializer_class = SavingsGoalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SavingsGoal.objects.filter(
            user=self.request.user
        ).select_related('linked_account')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def contribute(self, request, pk=None):
        """Add a contribution to a savings goal"""
        goal = self.get_object()
        serializer = GoalContributionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(goal=goal)
            # Return updated goal
            goal.refresh_from_db()
            return Response(
                SavingsGoalSerializer(goal).data,
                status=status.HTTP_201_CREATED
            )
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get savings summary statistics"""
        goals = self.get_queryset()
        total_target = sum(g.target_amount for g in goals)
        total_saved = sum(g.current_amount for g in goals)
        total_remaining = sum(g.remaining_amount for g in goals)
        avg_progress = (
            sum(g.progress_percentage for g in goals) / len(goals)
            if goals else 0
        )

        return Response({
            'total_goals': goals.count(),
            'total_target': float(total_target),
            'total_saved': float(total_saved),
            'total_remaining': float(total_remaining),
            'average_progress': round(avg_progress, 2),
        })


class GoalContributionViewSet(viewsets.ModelViewSet):
    serializer_class = GoalContributionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return GoalContribution.objects.filter(
            goal__user=self.request.user
        ).select_related('goal')
