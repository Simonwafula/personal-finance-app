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
    
    # Notification preferences
    email_notifications = models.BooleanField(default=True, help_text="Receive email notifications for budget alerts")
    email_budget_alerts = models.BooleanField(default=True, help_text="Receive emails when budget thresholds are reached")
    email_recurring_reminders = models.BooleanField(default=True, help_text="Receive email reminders for upcoming recurring transactions")
    email_weekly_summary = models.BooleanField(default=False, help_text="Receive weekly financial summary emails")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s profile"


class UserSession(models.Model):
    """Track user login sessions for security"""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sessions'
    )
    session_key = models.CharField(max_length=255, unique=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    device_type = models.CharField(max_length=50, blank=True)  # desktop, mobile, tablet
    browser = models.CharField(max_length=100, blank=True)
    os = models.CharField(max_length=100, blank=True)
    location = models.CharField(max_length=200, blank=True)  # City, Country from IP
    is_current = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    last_activity = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-last_activity']
    
    def __str__(self):
        return f"{self.user.username} - {self.device_type or 'Unknown'} ({self.ip_address})"


class LoginHistory(models.Model):
    """Record of all login attempts"""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='login_history',
        null=True,
        blank=True  # null for failed logins with unknown user
    )
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    device_type = models.CharField(max_length=50, blank=True)
    browser = models.CharField(max_length=100, blank=True)
    os = models.CharField(max_length=100, blank=True)
    location = models.CharField(max_length=200, blank=True)
    success = models.BooleanField(default=True)
    failure_reason = models.CharField(max_length=200, blank=True)  # Invalid password, account locked, etc.
    login_method = models.CharField(max_length=50, default='password')  # password, google, etc.
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-timestamp']
        verbose_name_plural = 'Login histories'
    
    def __str__(self):
        status = "✓" if self.success else "✗"
        return f"{status} {self.user.username if self.user else 'Unknown'} - {self.timestamp}"


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_profile(sender, instance, created, **kwargs):
    """Automatically create a profile when a user is created"""
    if created:
        UserProfile.objects.create(user=instance)


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def save_user_profile(sender, instance, **kwargs):
    """Save the profile when the user is saved"""
    if hasattr(instance, 'profile'):
        instance.profile.save()
