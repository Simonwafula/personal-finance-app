from django.db import models
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver


class UserProfile(models.Model):
    """Extended user profile information"""
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile'
    )
    bio = models.TextField(blank=True, max_length=500)
    phone = models.CharField(max_length=20, blank=True)
    avatar_url = models.URLField(blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    country = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s profile"


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_profile(sender, instance, created, **kwargs):
    """Automatically create a profile when a user is created"""
    if created:
        UserProfile.objects.create(user=instance)


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def save_user_profile(sender, instance, **kwargs):
    """Save the profile when the user is saved"""
    # Accessing the reverse one-to-one relation can raise a
    # RelatedObjectDoesNotExist exception if the profile is missing.
    try:
        profile = instance.profile
    except Exception:
        profile = None

    if profile:
        profile.save()
