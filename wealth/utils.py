# wealth/utils.py
from decimal import Decimal
from django.db.models import Sum
from django.contrib.auth import get_user_model

from .models import Asset, Liability, NetWorthSnapshot


def compute_current_net_worth(user):
    total_assets = (
        Asset.objects.filter(user=user).aggregate(total=Sum("current_value"))["total"]
        or Decimal("0")
    )
    total_liabilities = (
        Liability.objects.filter(user=user).aggregate(total=Sum("principal_balance"))[
            "total"
        ]
        or Decimal("0")
    )
    net = total_assets - total_liabilities
    return {
        "total_assets": total_assets,
        "total_liabilities": total_liabilities,
        "net_worth": net,
    }


def create_net_worth_snapshot(user, date):
    data = compute_current_net_worth(user)
    snapshot, _ = NetWorthSnapshot.objects.update_or_create(
        user=user,
        date=date,
        defaults={
            "total_assets": data["total_assets"],
            "total_liabilities": data["total_liabilities"],
            "net_worth": data["net_worth"],
        },
    )
    return snapshot
