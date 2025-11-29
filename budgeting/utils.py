# budgeting/utils.py
from decimal import Decimal
from django.db.models import Sum
from finance.models import Transaction
from .models import Budget
from notifications.utils import create_notification
from notifications.models import Notification as NotificationModel


def calculate_budget_summary(budget: Budget):
    """
    Returns a dict with:
    - lines: list of {category_id, category_name, planned, actual, difference}
    - totals: {planned, actual, difference}
    """
    user = budget.user

    lines_data = []
    total_planned = Decimal("0")
    total_actual = Decimal("0")

    for line in budget.lines.select_related("category"):
        planned = line.planned_amount or Decimal("0")

        actual = (
            Transaction.objects.filter(
                user=user,
                date__gte=budget.start_date,
                date__lte=budget.end_date,
                category=line.category,
            ).aggregate(total=Sum("amount"))["total"]
            or Decimal("0")
        )

        diff = planned - actual

        lines_data.append(
            {
                "category_id": line.category.id,
                "category_name": line.category.name,
                "planned": planned,
                "actual": actual,
                "difference": diff,
            }
        )

        total_planned += planned
        total_actual += actual

    return {
        "budget": {
            "id": budget.id,
            "name": budget.name,
            "start_date": budget.start_date,
            "end_date": budget.end_date,
        },
        "lines": lines_data,
        "totals": {
            "planned": total_planned,
            "actual": total_actual,
            "difference": total_planned - total_actual,
        },
    }


def notify_budget_thresholds_for_transaction(
    tx: Transaction, threshold: float = 0.9
):
    """
    When a transaction is created, check any active budgets for the user where
    this transaction's category is budgeted. If the spend crosses the threshold
    (e.g., 90%) for a line, create a notification.
    """
    # Local imports avoided to prevent circulars; keep minimal.

    user = tx.user
    # Find budgets active on the transaction date
    budgets = Budget.objects.filter(
        user=user, start_date__lte=tx.date, end_date__gte=tx.date
    ).prefetch_related("lines__category")

    for budget in budgets:
        line = next(
            (
                bl
                for bl in budget.lines.all()
                if bl.category_id == getattr(tx, "category_id", None)
            ),
            None,
        )
        if not line or not line.planned_amount or line.planned_amount == 0:
            continue

        planned = Decimal(line.planned_amount)
        # Sum actual BEFORE this tx
        prev_actual = (
            Transaction.objects.filter(
                user=user,
                date__gte=budget.start_date,
                date__lte=budget.end_date,
                category_id=line.category_id,
            )
            .exclude(id=tx.id)
            .aggregate(total=Sum("amount"))
            .get("total")
            or Decimal("0")
        )
        new_actual = prev_actual + Decimal(tx.amount)
        if planned <= 0:
            continue

        prev_ratio = float(prev_actual / planned) if planned != 0 else 0.0
        new_ratio = float(new_actual / planned) if planned != 0 else 0.0

        crossed = prev_ratio < threshold <= new_ratio
        if not crossed:
            continue

        # Deduplicate: if a recent notification exists for this
        # budget+category, skip
        title = (
            f"Budget '{budget.name}': {line.category.name} reached "
            f"{int(threshold*100)}%"
        )
        recent_exists = NotificationModel.objects.filter(
            user=user,
            title=title,
            created_at__gte=budget.start_date,
        ).exists()
        if recent_exists:
            continue

        msg = (
            f"Planned: {planned}. Spent: {new_actual}. Period: "
            f"{budget.start_date} → {budget.end_date}."
        )
        try:
            create_notification(
                user=user,
                title=title,
                message=msg,
                level=NotificationModel.Level.WARNING,
                category="budget",
                link_url="/budgets",
                send_email_flag=True,
            )
        except Exception:
            pass
