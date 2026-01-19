from datetime import timedelta
from typing import Any, Dict, Optional

from django.utils import timezone

from .models import ActivityLog

RETENTION_DAYS = 365

ACTION_TRANSACTION_CREATED = "transaction.created"
ACTION_TRANSACTION_UPDATED = "transaction.updated"
ACTION_TRANSACTION_DELETED = "transaction.deleted"
ACTION_IMPORT_CSV = "transaction.import.csv"
ACTION_IMPORT_PDF = "transaction.import.pdf"


def log_activity(
    *,
    user,
    action: str,
    summary: str,
    entity_type: str = "",
    entity_id: Optional[str] = None,
    metadata: Optional[Dict[str, Any]] = None,
    actor: str = ActivityLog.Actor.USER,
) -> ActivityLog:
    return ActivityLog.objects.create(
        user=user,
        actor=actor,
        action=action,
        summary=summary[:255],
        entity_type=entity_type,
        entity_id=str(entity_id) if entity_id is not None else "",
        metadata=metadata or {},
    )


def cleanup_old_logs(days: int = RETENTION_DAYS) -> int:
    cutoff = timezone.now() - timedelta(days=days)
    qs = ActivityLog.objects.filter(created_at__lt=cutoff)
    deleted, _ = qs.delete()
    return deleted
