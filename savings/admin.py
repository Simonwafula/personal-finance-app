from django.contrib import admin
from .models import SavingsGoal, GoalContribution


@admin.register(SavingsGoal)
class SavingsGoalAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'user', 'target_amount', 'current_amount',
        'progress_percentage', 'target_date'
    ]
    list_filter = ['created_at', 'target_date']
    search_fields = ['name', 'user__username', 'description']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(GoalContribution)
class GoalContributionAdmin(admin.ModelAdmin):
    list_display = [
        'goal', 'amount', 'contribution_type', 'date', 'created_at'
    ]
    list_filter = ['contribution_type', 'date', 'created_at']
    search_fields = ['goal__name', 'notes']
    readonly_fields = ['created_at']
