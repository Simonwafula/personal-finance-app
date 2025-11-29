"""
Create profiles for existing users who don't have one.
Run this with: python manage.py shell < create_missing_profiles.py
"""
from django.contrib.auth import get_user_model
from profiles.models import UserProfile

User = get_user_model()

users_without_profiles = []
for user in User.objects.all():
    if not hasattr(user, 'profile'):
        UserProfile.objects.create(user=user)
        users_without_profiles.append(user.username)
        print(f"Created profile for {user.username}")

if not users_without_profiles:
    print("All users already have profiles!")
else:
    print(f"\nCreated profiles for {len(users_without_profiles)} users")
