from django.core.mail import send_mail
from django.conf import settings
from typing import Optional  # noqa: F401

from .models import Notification


def create_notification(
    *,
    user,
    title: str,
    message: str = "",
    level: str = Notification.Level.INFO,
    category: str = "",
    link_url: str = "",
    send_email_flag: bool = False,
) -> Notification:
    notif = Notification.objects.create(
        user=user,
        title=title,
        message=message,
        level=level,
        category=category,
        link_url=link_url,
    )

    if send_email_flag:
        try:
            send_mail(
                subject=title,
                message=message or title,
                from_email=getattr(settings, "DEFAULT_FROM_EMAIL", None),
                recipient_list=[getattr(user, "email", None)],
                fail_silently=True,
            )
            notif.email_sent = True
            notif.save(update_fields=["email_sent"])
        except Exception:
            # swallow errors; email_sent remains False
            pass

    return notif
