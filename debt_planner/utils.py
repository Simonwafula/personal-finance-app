# debt_planner/utils.py
from decimal import Decimal
from datetime import date
from dateutil.relativedelta import relativedelta  # pip install python-dateutil

from wealth.models import Liability
from .models import DebtPlan


def generate_debt_schedule(plan: DebtPlan):
    """
    Generate a simple monthly payoff schedule for all liabilities of the user
    using either Avalanche (highest rate) or Snowball (lowest balance).
    Returns a dict with summary and a 'schedule' list.
    """

    user = plan.user
    debts = list(
        Liability.objects.filter(user=user).exclude(principal_balance__lte=0)
    )

    if not debts:
        return {"debts": [], "schedule": [], "months": 0}

    # sanity check: total minimum payments
    total_minimum = sum(d.minimum_payment for d in debts)
    if plan.monthly_amount_available < total_minimum:
        return {
            "error": "Monthly amount is less than sum of minimum payments.",
            "required_minimum": total_minimum,
            "monthly_amount_available": plan.monthly_amount_available,
        }

    # ordering
    if plan.strategy == DebtPlan.Strategy.AVALANCHE:
        debts.sort(key=lambda d: d.interest_rate, reverse=True)
    else:  # SNOWBALL
        debts.sort(key=lambda d: d.principal_balance)

    balances = {d.id: Decimal(d.principal_balance) for d in debts}
    month_date = plan.start_date
    schedule = []
    max_months = 600  # safety cap

    for m in range(max_months):
        # check if all paid
        if all(balances[d.id] <= 0 for d in debts):
            break

        monthly_budget = Decimal(plan.monthly_amount_available)
        total_minimum = sum(
            d.minimum_payment for d in debts if balances[d.id] > 0
        )

        if monthly_budget < total_minimum:
            # this shouldn't happen if checked above, but guard anyway
            break

        extra = monthly_budget - total_minimum

        for idx, d in enumerate(debts):
            bal = balances[d.id]
            if bal <= 0:
                continue

            monthly_rate = Decimal(d.interest_rate) / Decimal("100") / Decimal("12")
            interest = (bal * monthly_rate).quantize(Decimal("0.01"))

            payment = d.minimum_payment
            if extra > 0 and idx == 0:
                payment += extra

            # cap payment
            max_pay = bal + interest
            if payment > max_pay:
                payment = max_pay

            principal_paid = payment - interest
            new_balance = bal + interest - payment

            balances[d.id] = new_balance

            schedule.append(
                {
                    "month": month_date.isoformat(),
                    "liability_id": d.id,
                    "liability_name": d.name,
                    "starting_balance": bal,
                    "interest": interest,
                    "payment": payment,
                    "principal": principal_paid,
                    "ending_balance": new_balance,
                }
            )

        month_date = month_date + relativedelta(months=1)

    months_used = m + 1

    return {
        "strategy": plan.strategy,
        "months": months_used,
        "monthly_amount_available": plan.monthly_amount_available,
        "schedule": schedule,
    }
