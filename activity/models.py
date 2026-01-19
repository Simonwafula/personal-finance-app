from django.conf import settings
from django.db import models


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class ActivityLog(TimeStampedModel):
    class Actor(models.TextChoices):
        USER = "USER", "User"
        SYSTEM = "SYSTEM", "System"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="activity_logs",
    )
    actor = models.CharField(
        max_length=10, choices=Actor.choices, default=Actor.USER
    )
    action = models.CharField(max_length=50)
    entity_type = models.CharField(max_length=50, blank=True)
    entity_id = models.CharField(max_length=64, blank=True)
    summary = models.CharField(max_length=255)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "created_at"]),
            models.Index(fields=["user", "action"]),
            models.Index(fields=["entity_type", "entity_id"]),
        ]

    def __str__(self):
        return f"{self.user} - {self.action} - {self.summary}"
