# budgeting/utils.py
from decimal import Decimal
from django.db.models import Sum
from finance.models import Transaction
from .models import Budget


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
