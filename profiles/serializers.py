from rest_framework import serializers
from .models import UserProfile
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
        ]
        
        
class UserWithProfileSerializer(serializers.ModelSerializer):
    """Serializer that includes both user and profile data"""
    profile = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile']
