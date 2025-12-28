from rest_framework import serializers
from .models import UserProfile, UserSession, LoginHistory
from django.contrib.auth import get_user_model

User = get_user_model()


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = [
            'username',
            'email',
            'bio',
            'phone',
            'avatar_url',
            'date_of_birth',
            'country',
            'city',
            'email_notifications',
            'email_budget_alerts',
            'email_recurring_reminders',
            'email_weekly_summary',
        ]
        
        
class UserWithProfileSerializer(serializers.ModelSerializer):
    """Serializer that includes both user and profile data"""
    profile = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile']


class UserSessionSerializer(serializers.ModelSerializer):
    """Serializer for active sessions"""
    class Meta:
        model = UserSession
        fields = [
            'id',
            'ip_address',
            'device_type',
            'browser',
            'os',
            'location',
            'is_current',
            'created_at',
            'last_activity',
        ]


class LoginHistorySerializer(serializers.ModelSerializer):
    """Serializer for login history"""
    class Meta:
        model = LoginHistory
        fields = [
            'id',
            'ip_address',
            'device_type',
            'browser',
            'os',
            'location',
            'success',
            'failure_reason',
            'login_method',
            'timestamp',
        ]
