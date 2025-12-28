# wealth/utils.py
from decimal import Decimal
from django.db.models import Sum
from django.contrib.auth import get_user_model

from .models import Asset, Liability, NetWorthSnapshot


def compute_current_net_worth(user):
    """
    Calculate comprehensive net worth including:
    - Assets (manual + auto-synced from investments)
    - Savings goals (current amounts)
    - Account balances (positive = asset, negative = liability)
    - Liabilities (loans, debts)
    
    Formula: Net Worth = Total Assets - Total Liabilities
    """
    from savings.models import SavingsGoal
    from finance.models import Account
    
    # 1. Assets (includes auto-synced investments via signals)
    total_assets = (
        Asset.objects.filter(user=user).aggregate(total=Sum("current_value"))["total"]
        or Decimal("0")
    )
    
    # 2. Savings Goals - current amounts saved
    total_savings = (
        SavingsGoal.objects.filter(user=user).aggregate(total=Sum("current_amount"))["total"]
        or Decimal("0")
    )
    
    # 3. Account balances
    # Get all active accounts and their current balances
    accounts = Account.objects.filter(user=user, status='ACTIVE')
    
    total_account_assets = Decimal("0")
    total_account_liabilities = Decimal("0")
    
    for account in accounts:
        balance = account.calculate_current_balance()
        if balance >= 0:
            total_account_assets += balance
        else:
            total_account_liabilities += abs(balance)
    
    # 4. Liabilities (loans, debts)
    total_liabilities = (
        Liability.objects.filter(user=user).aggregate(total=Sum("principal_balance"))["total"]
        or Decimal("0")
    )
    
    # Calculate totals
    # Note: We don't double count accounts that are already synced as assets
    # Assets already include synced accounts via sync_from_accounts action
    # So we only add account balances that aren't already synced
    
    # Check which accounts are already synced as assets
    synced_account_ids = Asset.objects.filter(
        user=user,
        linked_account__isnull=False
    ).values_list('linked_account_id', flat=True)
    
    # Calculate unsynced account balances
    unsynced_account_assets = Decimal("0")
    unsynced_account_liabilities = Decimal("0")
    
    for account in accounts:
        if account.id not in synced_account_ids:
            balance = account.calculate_current_balance()
            if balance >= 0:
                unsynced_account_assets += balance
            else:
                unsynced_account_liabilities += abs(balance)
    
    # Final calculations
    grand_total_assets = total_assets + total_savings + unsynced_account_assets
    grand_total_liabilities = total_liabilities + unsynced_account_liabilities + total_account_liabilities
    
    net = grand_total_assets - grand_total_liabilities
    
    return {
        "total_assets": grand_total_assets,
        "total_liabilities": grand_total_liabilities,
        "net_worth": net,
        # Breakdown for detailed view
        "breakdown": {
            "assets_manual": float(total_assets),
            "savings_goals": float(total_savings),
            "account_balances": float(unsynced_account_assets),
            "liabilities_loans": float(total_liabilities),
            "account_overdrafts": float(unsynced_account_liabilities + total_account_liabilities),
        }
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
