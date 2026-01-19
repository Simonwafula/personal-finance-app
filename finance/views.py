# finance/views.py
import datetime
from decimal import Decimal, InvalidOperation
from uuid import uuid4

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import LimitOffsetPagination
from django.contrib.auth import get_user_model
from django.db import transaction as db_transaction
from django.db.models import Sum, Q
from django.db.models.functions import (
    TruncDay, TruncMonth, TruncWeek,
    ExtractYear, ExtractQuarter
)

from .models import Account, Category, Transaction
from .serializers import (
    AccountSerializer,
    CategorySerializer,
    TransactionSerializer,
)
from .models import RecurringTransaction, Tag
from .serializers import RecurringTransactionSerializer, TagSerializer
from notifications.utils import create_notification
from notifications.models import Notification as NotificationModel
from wealth.models import Liability
from savings.models import SavingsGoal, GoalContribution
from investments.models import Investment
from .statement_import import build_preview, parse_statement_pdf

User = get_user_model()


class AccountViewSet(viewsets.ModelViewSet):
    serializer_class = AccountSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Account.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = LimitOffsetPagination

    def get_queryset(self):
        qs = Transaction.objects.filter(user=self.request.user)
        account_id = self.request.query_params.get("account")
        start = self.request.query_params.get("start")
        end = self.request.query_params.get("end")
        category = self.request.query_params.get("category")
        kind = self.request.query_params.get("kind")

        if account_id:
            qs = qs.filter(
                account_id=account_id, account__user=self.request.user
            )
        if start:
            qs = qs.filter(date__gte=start)
        if end:
            qs = qs.filter(date__lte=end)
        if category:
            qs = qs.filter(category_id=category)
        if kind:
            qs = qs.filter(kind=kind)
        return qs

    def _notify_budget_thresholds(self, tx):
        if tx.kind == Transaction.Kind.TRANSFER:
            return
        try:
            from budgeting.utils import (
                notify_budget_thresholds_for_transaction,
            )

            notify_budget_thresholds_for_transaction(tx, threshold=0.9)
        except Exception:
            # Don't block transaction creation on notifications
            pass

    def _liability_effect(self, tx):
        if not tx or tx.kind != Transaction.Kind.EXPENSE or not tx.liability_id:
            return None
        return tx.liability_id, Decimal(tx.amount)

    def _apply_liability_delta(self, liability_id, delta):
        if not liability_id or delta == 0:
            return
        liability = Liability.objects.select_for_update().filter(
            id=liability_id, user=self.request.user
        ).first()
        if not liability:
            return
        new_balance = Decimal(liability.principal_balance) + delta
        if new_balance < 0:
            new_balance = Decimal("0")
        liability.principal_balance = new_balance
        liability.save(update_fields=["principal_balance"])

    def _sync_liability(self, before, after):
        before_effect = self._liability_effect(before)
        after_effect = self._liability_effect(after)
        if before_effect:
            self._apply_liability_delta(before_effect[0], before_effect[1])
        if after_effect:
            self._apply_liability_delta(after_effect[0], -after_effect[1])

    def _savings_effect(self, tx):
        if not tx or not tx.savings_goal_id or tx.kind == Transaction.Kind.TRANSFER:
            return None
        return tx.savings_goal_id, Decimal(tx.amount)

    def _apply_savings_delta(self, goal_id, delta):
        if not goal_id or delta == 0:
            return
        goal = SavingsGoal.objects.select_for_update().filter(
            id=goal_id, user=self.request.user
        ).first()
        if not goal:
            return
        new_amount = Decimal(goal.current_amount) + delta
        if new_amount < 0:
            new_amount = Decimal("0")
        goal.current_amount = new_amount
        goal.save(update_fields=["current_amount"])

    def _sync_savings(self, before, after):
        before_effect = self._savings_effect(before)
        after_effect = self._savings_effect(after)

        if before_effect and after_effect and before_effect[0] == after_effect[0]:
            before_amount = before_effect[1]
            after_amount = after_effect[1]
            contribution = GoalContribution.objects.filter(
                transaction=after
            ).first()
            if contribution:
                delta = after_amount - before_amount
                if delta:
                    self._apply_savings_delta(after_effect[0], delta)
                contribution.goal_id = after_effect[0]
                contribution.amount = after_amount
                contribution.date = after.date
                contribution.notes = after.description or ""
                contribution.contribution_type = "AUTOMATIC"
                contribution.save()
            else:
                GoalContribution.objects.create(
                    goal_id=after_effect[0],
                    amount=after_amount,
                    date=after.date,
                    contribution_type="AUTOMATIC",
                    notes=after.description or "",
                    transaction=after,
                )
            return

        if before_effect:
            self._apply_savings_delta(before_effect[0], -before_effect[1])
            GoalContribution.objects.filter(transaction=before).delete()

        if after_effect:
            GoalContribution.objects.create(
                goal_id=after_effect[0],
                amount=after_effect[1],
                date=after.date,
                contribution_type="AUTOMATIC",
                notes=after.description or "",
                transaction=after,
            )

    def _investment_effect(self, tx):
        if not tx or not tx.investment_id or tx.kind == Transaction.Kind.TRANSFER:
            return None
        action = tx.investment_action
        if not action:
            if tx.kind == Transaction.Kind.EXPENSE:
                action = Transaction.InvestmentAction.BUY
            elif tx.kind == Transaction.Kind.INCOME:
                action = Transaction.InvestmentAction.SELL
            else:
                return None
        return tx.investment_id, action, Decimal(tx.amount)

    def _apply_investment_delta(self, investment_id, action, amount, reverse=False):
        if not investment_id or amount == 0:
            return

        effect_map = {
            Transaction.InvestmentAction.BUY: 1,
            Transaction.InvestmentAction.SELL: -1,
            Transaction.InvestmentAction.FEE: -1,
            Transaction.InvestmentAction.DIVIDEND: 0,
            Transaction.InvestmentAction.INTEREST: 0,
        }
        sign = effect_map.get(action, 0)
        if reverse:
            sign *= -1
        if sign == 0:
            return

        investment = Investment.objects.select_for_update().filter(
            id=investment_id, user=self.request.user
        ).first()
        if not investment:
            return

        delta = amount * Decimal(sign)
        update_fields = []

        if investment.quantity == 1:
            new_price = Decimal(investment.current_price) + delta
            if new_price < 0:
                new_price = Decimal("0")
            investment.current_price = new_price
            update_fields.append("current_price")
        else:
            current_price = Decimal(investment.current_price)
            if current_price > 0:
                qty_delta = delta / current_price
                new_qty = Decimal(investment.quantity) + qty_delta
                if new_qty < 0:
                    new_qty = Decimal("0")
                investment.quantity = new_qty
                update_fields.append("quantity")
                if new_qty == 0 and investment.status != "SOLD":
                    investment.status = "SOLD"
                    update_fields.append("status")

        if update_fields:
            investment.save(update_fields=update_fields)

    def _sync_investment(self, before, after):
        before_effect = self._investment_effect(before)
        after_effect = self._investment_effect(after)
        if before_effect:
            self._apply_investment_delta(
                before_effect[0], before_effect[1], before_effect[2], reverse=True
            )
        if after_effect:
            self._apply_investment_delta(
                after_effect[0], after_effect[1], after_effect[2], reverse=False
            )

    def _ensure_investment_action(self, tx):
        if not tx or not tx.investment_id or tx.investment_action:
            return
        if tx.kind == Transaction.Kind.EXPENSE:
            tx.investment_action = Transaction.InvestmentAction.BUY
        elif tx.kind == Transaction.Kind.INCOME:
            tx.investment_action = Transaction.InvestmentAction.SELL
        else:
            return
        tx.save(update_fields=["investment_action"])

    def _build_transfer_shared_fields(self, data, fallback):
        fields = [
            "date",
            "amount",
            "fee",
            "kind",
            "category",
            "description",
            "tags",
            "savings_goal",
            "source",
            "sms_reference",
            "sms_detected_at",
            "is_recurring",
            "recurring_rule",
        ]
        shared = {}
        for field in fields:
            if field in data:
                shared[field] = data[field]
            else:
                shared[field] = getattr(fallback, field)
        shared["kind"] = Transaction.Kind.TRANSFER
        return shared

    def _create_transfer_pair(self, user, data):
        transfer_account = data.get("transfer_account")
        if not transfer_account:
            tx = Transaction.objects.create(user=user, **data)
            return tx

        transfer_group = uuid4()
        source_account = data["account"]
        fee = data.get("fee", 0)
        shared = data.copy()
        shared.update(
            {
                "user": user,
                "kind": Transaction.Kind.TRANSFER,
                "transfer_group": transfer_group,
            }
        )
        shared.pop("account", None)
        shared.pop("transfer_account", None)
        shared.pop("liability", None)
        shared.pop("fee", None)

        source_tx = Transaction.objects.create(
            **shared,
            account=source_account,
            transfer_account=transfer_account,
            transfer_direction=Transaction.TransferDirection.OUT,
            fee=fee or 0,
        )
        Transaction.objects.create(
            **shared,
            account=transfer_account,
            transfer_account=source_account,
            transfer_direction=Transaction.TransferDirection.IN,
            fee=0,
        )
        return source_tx

    def _resolve_transfer_accounts(self, instance, data):
        account_value = data.get("account", instance.account)
        transfer_account_value = data.get(
            "transfer_account", instance.transfer_account
        )
        if instance.transfer_direction == Transaction.TransferDirection.IN:
            return transfer_account_value, account_value
        return account_value, transfer_account_value

    def _update_transfer_pair(self, instance, data):
        new_kind = data.get("kind", instance.kind)
        if new_kind != Transaction.Kind.TRANSFER:
            counterpart = None
            if instance.transfer_group:
                counterpart = Transaction.objects.filter(
                    user=self.request.user,
                    transfer_group=instance.transfer_group,
                ).exclude(id=instance.id).first()
            if counterpart:
                counterpart.delete()
            instance.transfer_group = None
            instance.transfer_account = None
            instance.transfer_direction = None
            return instance

        source_account, dest_account = self._resolve_transfer_accounts(
            instance, data
        )
        if dest_account and source_account == dest_account:
            raise ValueError("Transfer account must differ from source.")

        counterpart = None
        if instance.transfer_group:
            counterpart = Transaction.objects.filter(
                user=self.request.user,
                transfer_group=instance.transfer_group,
            ).exclude(id=instance.id).first()

        out_tx = instance
        in_tx = counterpart
        if instance.transfer_direction == Transaction.TransferDirection.IN and counterpart:
            out_tx = counterpart
            in_tx = instance

        if not dest_account:
            if counterpart:
                counterpart.delete()
            out_tx.transfer_group = None
            out_tx.transfer_account = None
            out_tx.transfer_direction = None
            return out_tx

        transfer_group = out_tx.transfer_group or uuid4()
        shared = self._build_transfer_shared_fields(data, out_tx)

        out_tx.account = source_account
        out_tx.transfer_account = dest_account
        out_tx.transfer_group = transfer_group
        out_tx.transfer_direction = Transaction.TransferDirection.OUT
        for field, value in shared.items():
            setattr(out_tx, field, value)
        out_tx.save()

        if in_tx:
            in_tx.account = dest_account
            in_tx.transfer_account = source_account
            in_tx.transfer_group = transfer_group
            in_tx.transfer_direction = Transaction.TransferDirection.IN
            for field, value in shared.items():
                setattr(in_tx, field, value)
            in_tx.fee = 0
            in_tx.save()
        else:
            shared_without_fee = {
                key: value for key, value in shared.items() if key != "fee"
            }
            Transaction.objects.create(
                user=self.request.user,
                account=dest_account,
                transfer_account=source_account,
                transfer_group=transfer_group,
                transfer_direction=Transaction.TransferDirection.IN,
                fee=0,
                **shared_without_fee,
            )

        return out_tx

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        kind = data.get("kind")

        with db_transaction.atomic():
            if kind == Transaction.Kind.TRANSFER:
                tx = self._create_transfer_pair(request.user, data)
            else:
                tx = serializer.save(user=request.user)
                self._ensure_investment_action(tx)
                self._sync_liability(None, tx)
                self._sync_savings(None, tx)
                self._sync_investment(None, tx)

        self._notify_budget_thresholds(tx)
        out = self.get_serializer(tx)
        headers = self.get_success_headers(out.data)
        return Response(out.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        before = Transaction.objects.get(pk=instance.pk)
        serializer = self.get_serializer(
            instance, data=request.data, partial=partial
        )
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        new_kind = data.get("kind", instance.kind)

        with db_transaction.atomic():
            if instance.kind == Transaction.Kind.TRANSFER or new_kind == Transaction.Kind.TRANSFER:
                try:
                    updated = self._update_transfer_pair(instance, data)
                except ValueError as exc:
                    return Response(
                        {"detail": str(exc)},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                if new_kind == Transaction.Kind.TRANSFER:
                    skip_fields = {
                        "account",
                        "transfer_account",
                        "transfer_group",
                        "transfer_direction",
                    }
                else:
                    skip_fields = {
                        "transfer_account",
                        "transfer_group",
                        "transfer_direction",
                    }
                for field, value in data.items():
                    if field in skip_fields:
                        continue
                    setattr(updated, field, value)
                updated.save()
            else:
                updated = serializer.save()

            self._ensure_investment_action(updated)
            self._sync_liability(before, updated)
            self._sync_savings(before, updated)
            self._sync_investment(before, updated)

        self._notify_budget_thresholds(updated)
        return Response(self.get_serializer(updated).data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        before = Transaction.objects.get(pk=instance.pk)
        with db_transaction.atomic():
            if instance.kind == Transaction.Kind.TRANSFER and instance.transfer_group:
                Transaction.objects.filter(
                    user=request.user,
                    transfer_group=instance.transfer_group,
                ).delete()
            else:
                self._sync_liability(before, None)
                self._sync_savings(before, None)
                self._sync_investment(before, None)
                instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=["get"])
    def aggregated(self, request):
        """
        Aggregated transactions by date/month/week/quarter.
        Params: start, end (YYYY-MM-DD), group_by (day|month|week|quarter),
        last_n_days, kind (INCOME|EXPENSE)
        """
        qs = Transaction.objects.filter(user=request.user)
        start = request.query_params.get("start")
        end = request.query_params.get("end")
        group_by = request.query_params.get("group_by", "day")
        kind = request.query_params.get("kind")
        last_n_days = request.query_params.get("last_n_days")

        # Handle last_n_days shortcut
        if last_n_days:
            try:
                nd = int(last_n_days)
                delta = datetime.timedelta(days=nd)
                start = (datetime.date.today() - delta).isoformat()
            except (ValueError, TypeError):
                pass

        if start:
            qs = qs.filter(date__gte=start)
        if end:
            qs = qs.filter(date__lte=end)
        if kind:
            qs = qs.filter(kind=kind)

        # Handle quarter grouping separately (year + quarter)
        if group_by == "quarter":
            series = (
                qs.annotate(
                    year=ExtractYear("date"),
                    quarter=ExtractQuarter("date")
                )
                .values("year", "quarter")
                .annotate(
                    income=Sum(
                        "amount",
                        filter=Q(kind=Transaction.Kind.INCOME)
                    ),
                    income_fees=Sum(
                        "fee",
                        filter=Q(kind=Transaction.Kind.INCOME)
                    ),
                    expenses=Sum(
                        "amount",
                        filter=Q(kind=Transaction.Kind.EXPENSE)
                    ),
                    expense_fees=Sum(
                        "fee",
                        filter=Q(kind=Transaction.Kind.EXPENSE)
                    ),
                )
                .order_by("year", "quarter")
            )
            data = [
                {
                    "date": f"{s['year']}-Q{s['quarter']}",
                    "income": float(
                        (s.get("income") or 0) - (s.get("income_fees") or 0)
                    ),
                    "expenses": float(
                        (s.get("expenses") or 0) + (s.get("expense_fees") or 0)
                    ),
                }
                for s in series
            ]
            return Response({"series": data})

        # Other groupings use Trunc functions
        if group_by == "month":
            trunc = TruncMonth("date")
        elif group_by == "week":
            trunc = TruncWeek("date")
        else:
            trunc = TruncDay("date")

        series = (
            qs.annotate(period=trunc)
            .values("period")
            .annotate(
                income=Sum(
                    "amount",
                    filter=Q(kind=Transaction.Kind.INCOME)
                ),
                income_fees=Sum(
                    "fee",
                    filter=Q(kind=Transaction.Kind.INCOME)
                ),
                expenses=Sum(
                    "amount",
                    filter=Q(kind=Transaction.Kind.EXPENSE)
                ),
                expense_fees=Sum(
                    "fee",
                    filter=Q(kind=Transaction.Kind.EXPENSE)
                ),
            )
            .order_by("period")
        )

        data = [
            {
                "date": (
                    s["period"].strftime("%Y-%m-%d")
                    if s["period"] else None
                ),
                "income": float(
                    (s.get("income") or 0) - (s.get("income_fees") or 0)
                ),
                "expenses": float(
                    (s.get("expenses") or 0) + (s.get("expense_fees") or 0)
                ),
            }
            for s in series
        ]
        return Response({"series": data})

    @action(detail=False, methods=["post"], url_path="import-csv")
    def import_csv(self, request):
        """
        Import transactions from an uploaded CSV file.
        Expects 'file' in files.
        """
        f = request.FILES.get("file")
        if not f:
            return Response({"detail": "file is required"}, status=400)

        import csv
        from io import TextIOWrapper
        reader = csv.DictReader(TextIOWrapper(f.file, encoding='utf-8'))
        created = 0
        errors = []
        for idx, row in enumerate(reader):
            try:
                acc_id = row.get("account")
                account = Account.objects.filter(
                    user=request.user, id=acc_id
                ).first()
                if not account:
                    raise ValueError("account not found")
                Transaction.objects.create(
                    user=request.user,
                    account=account,
                    date=row.get("date"),
                    amount=row.get("amount"),
                    fee=row.get("fee") or 0,
                    kind=row.get("kind") or "EXPENSE",
                    description=row.get("description", ""),
                )
                created += 1
            except Exception as e:
                errors.append({"row": idx + 1, "error": str(e)})

        return Response({"created": created, "errors": errors})

    @action(detail=False, methods=["post"], url_path="import-pdf-preview")
    def import_pdf_preview(self, request):
        """
        Parse a statement PDF and return a preview list of transactions.
        """
        f = request.FILES.get("file")
        if not f:
            return Response({"detail": "file is required"}, status=400)

        opening_balance = request.data.get("opening_balance")
        first_kind = request.data.get("first_transaction_kind")
        if first_kind and first_kind not in Transaction.Kind.values:
            return Response({"detail": "invalid first_transaction_kind"}, status=400)

        opening_balance_value = None
        if opening_balance not in (None, ""):
            try:
                opening_balance_value = Decimal(str(opening_balance).replace(",", ""))
            except (InvalidOperation, ValueError):
                return Response({"detail": "invalid opening_balance"}, status=400)

        try:
            parsed = parse_statement_pdf(f.read())
        except Exception as exc:
            return Response({"detail": str(exc)}, status=400)

        preview_rows, summary = build_preview(
            parsed.transactions, opening_balance_value, first_kind
        )
        return Response(
            {
                "statement_type": parsed.statement_type,
                "transactions": preview_rows,
                "summary": summary,
            }
        )

    @action(detail=False, methods=["post"], url_path="import-pdf-confirm")
    def import_pdf_confirm(self, request):
        """
        Create transactions from a parsed PDF preview payload.
        """
        account_id = request.data.get("account")
        rows = request.data.get("transactions", [])
        allow_duplicates_raw = request.data.get("allow_duplicates")
        if isinstance(allow_duplicates_raw, bool):
            allow_duplicates = allow_duplicates_raw
        else:
            allow_duplicates = str(allow_duplicates_raw).lower() in {"true", "1", "yes", "on"}

        if not account_id:
            return Response({"detail": "account is required"}, status=400)
        if not isinstance(rows, list):
            return Response({"detail": "transactions must be a list"}, status=400)

        account = Account.objects.filter(
            user=request.user, id=account_id
        ).first()
        if not account:
            return Response({"detail": "account not found"}, status=400)

        created = 0
        skipped = 0
        errors = []

        for idx, row in enumerate(rows):
            try:
                date = row.get("date")
                amount = row.get("amount")
                description = (row.get("description") or "")[:255]
                kind = (row.get("kind") or Transaction.Kind.EXPENSE).upper()
                if kind not in Transaction.Kind.values:
                    raise ValueError("invalid kind")
                if not date or amount in (None, ""):
                    raise ValueError("missing date or amount")
                amount_value = abs(Decimal(str(amount).replace(",", "")))

                if not allow_duplicates:
                    exists = Transaction.objects.filter(
                        user=request.user,
                        account=account,
                        date=date,
                        amount=amount_value,
                        kind=kind,
                        description=description,
                    ).exists()
                    if exists:
                        skipped += 1
                        continue

                Transaction.objects.create(
                    user=request.user,
                    account=account,
                    date=date,
                    amount=amount_value,
                    fee=0,
                    kind=kind,
                    description=description,
                    source=Transaction.Source.IMPORT,
                )
                created += 1
            except Exception as exc:
                errors.append({"row": idx + 1, "error": str(exc)})

        return Response({"imported": created, "skipped": skipped, "errors": errors})

    @action(detail=False, methods=["get"], url_path="export-csv")
    def export_csv(self, request):
        """Export filtered transactions as CSV."""
        qs = self.filter_queryset(self.get_queryset())
        import csv
        from io import StringIO
        out = StringIO()
        writer = csv.writer(out)
        writer.writerow([
            "id",
            "date",
            "account",
            "amount",
            "fee",
            "kind",
            "category",
            "description",
        ])
        for t in qs:
            writer.writerow([
                t.id,
                t.date.isoformat(),
                getattr(t.account, 'id', ''),
                str(t.amount),
                str(t.fee or 0),
                t.kind,
                getattr(t.category, 'id', ''),
                t.description,
            ])
        resp = Response(out.getvalue(), content_type='text/csv')
        resp['Content-Disposition'] = 'attachment; filename=transactions.csv'
        return resp

    @action(detail=False, methods=["get"])
    def top_categories(self, request):
        """
        Top expense categories. Params: start, end (YYYY-MM-DD), limit
        """
        kind = Transaction.Kind.EXPENSE
        qs = Transaction.objects.filter(
            user=request.user, kind=kind
        )
        start = request.query_params.get("start")
        end = request.query_params.get("end")
        limit = int(request.query_params.get("limit", 6))

        if start:
            qs = qs.filter(date__gte=start)
        if end:
            qs = qs.filter(date__lte=end)

        cat_series = (
            qs.values("category", "category__name")
            .annotate(amount=Sum("amount"), fees=Sum("fee"))
            .order_by("-amount")[:limit]
        )
        data = [
            {
                "id": c["category"],
                "name": c["category__name"],
                "amount": float((c["amount"] or 0) + (c["fees"] or 0)),
            }
            for c in cat_series
        ]
        return Response({"categories": data})


class RecurringTransactionViewSet(viewsets.ModelViewSet):
    serializer_class = RecurringTransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return RecurringTransaction.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["get"])
    def preview(self, request, pk=None):
        """
        Return the next few scheduled dates for this recurring transaction.
        """
        obj = self.get_object()
        dates = []
        d = obj.date
        for i in range(6):
            dates.append(d.isoformat())
            if obj.frequency == obj.Frequency.DAILY:
                d = d + datetime.timedelta(days=1)
            elif obj.frequency == obj.Frequency.WEEKLY:
                d = d + datetime.timedelta(weeks=1)
            elif obj.frequency == obj.Frequency.MONTHLY:
                # naive month increment
                m = d.month + 1
                y = d.year + (m - 1) // 12
                m = (m - 1) % 12 + 1
                d = d.replace(year=y, month=m)
            else:
                d = d.replace(year=d.year + 1)
        return Response({"dates": dates})

    @action(detail=False, methods=["post"])  # POST /recurring/materialize/
    def materialize(self, request):
        """Materialize recurring transactions into Transaction rows for
        the current user. Optional body/query: days (default 30).
        """
        try:
            days = int(
                request.data.get("days")
                or request.query_params.get("days")
                or 30
            )
        except (TypeError, ValueError):
            days = 30

        import datetime
        from datetime import date
        from .models import Transaction  # local import to avoid cycles

        def add_months(d, months):
            month = d.month - 1 + months
            year = d.year + month // 12
            month = month % 12 + 1
            day = min(d.day, 28)
            return date(year, month, day)

        today = datetime.date.today()
        horizon = today + datetime.timedelta(days=days)
        qs = RecurringTransaction.objects.filter(user=request.user)
        created = 0
        for r in qs:
            next_date = r.date if not r.last_executed else r.last_executed
            if r.last_executed:
                if r.frequency == RecurringTransaction.Frequency.DAILY:
                    next_date = next_date + datetime.timedelta(days=1)
                elif r.frequency == RecurringTransaction.Frequency.WEEKLY:
                    next_date = next_date + datetime.timedelta(weeks=1)
                elif r.frequency == RecurringTransaction.Frequency.MONTHLY:
                    next_date = add_months(next_date, 1)
                else:
                    next_date = next_date.replace(year=next_date.year + 1)

            while (
                next_date <= horizon
                and (not r.end_date or next_date <= r.end_date)
            ):
                Transaction.objects.create(
                    user=r.user,
                    account=r.account,
                    date=next_date,
                    amount=r.amount,
                    kind=r.kind,
                    category=r.category,
                    description=(r.description or "Recurring transaction"),
                )
                created += 1
                r.last_executed = next_date
                if r.frequency == RecurringTransaction.Frequency.DAILY:
                    next_date = next_date + datetime.timedelta(days=1)
                elif r.frequency == RecurringTransaction.Frequency.WEEKLY:
                    next_date = next_date + datetime.timedelta(weeks=1)
                elif r.frequency == RecurringTransaction.Frequency.MONTHLY:
                    next_date = add_months(next_date, 1)
                else:
                    next_date = next_date.replace(year=next_date.year + 1)
            r.save()

        # Create a notification for the user about materialized transactions
        plural_tx = 's' if created != 1 else ''
        title = (
            f"Materialized {created} recurring transaction{plural_tx}"
        )
        message = (
            f"Created {created} transaction{'s' if created != 1 else ''} "
            f"over the next {days} day{'s' if days != 1 else ''}."
        )
        try:
            create_notification(
                user=request.user,
                title=title,
                message=message,
                level=NotificationModel.Level.SUCCESS,
                category="recurring",
                link_url="/subscriptions",
                send_email_flag=True,
            )
        except Exception:
            # Do not block API response on notification errors
            pass

        return Response({"created": created, "days": days})

    @action(detail=False, methods=["post"], url_path="notify-due")
    def notify_due(self, request):
        """
        Create notifications for recurring transactions with the next
        occurrence due within the next N days (default 3).
        """
        try:
            days = int(request.data.get("days") or 3)
        except (TypeError, ValueError):
            days = 3

        import datetime
        today = datetime.date.today()
        horizon = today + datetime.timedelta(days=days)

        created = 0
        for r in RecurringTransaction.objects.filter(user=request.user):
            next_date = r.date if not r.last_executed else r.last_executed
            if r.last_executed:
                if r.frequency == RecurringTransaction.Frequency.DAILY:
                    next_date = next_date + datetime.timedelta(days=1)
                elif r.frequency == RecurringTransaction.Frequency.WEEKLY:
                    next_date = next_date + datetime.timedelta(weeks=1)
                elif r.frequency == RecurringTransaction.Frequency.MONTHLY:
                    # approximate month increment similar to materialize
                    month = next_date.month - 1 + 1
                    year = next_date.year + month // 12
                    month = month % 12 + 1
                    day = min(next_date.day, 28)
                    next_date = datetime.date(year, month, day)
                else:
                    next_date = next_date.replace(year=next_date.year + 1)

            if today <= next_date <= horizon:
                title = f"Upcoming subscription on {next_date.isoformat()}"
                message = (
                    f"{r.description or 'Recurring transaction'} scheduled on "
                    f"{next_date.isoformat()} for {r.amount}."
                )
                try:
                    create_notification(
                        user=request.user,
                        title=title,
                        message=message,
                        level=NotificationModel.Level.INFO,
                        category="recurring-due",
                        link_url="/subscriptions",
                        send_email_flag=True,
                    )
                    created += 1
                except Exception:
                    pass

        return Response({"notified": created, "days": days})


class TagViewSet(viewsets.ModelViewSet):
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Tag.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["get"])
    def analysis(self, request):
        """Analyze spending by tags across transactions"""
        start = request.query_params.get("start")
        end = request.query_params.get("end")

        qs = Transaction.objects.filter(user=request.user)
        if start:
            qs = qs.filter(date__gte=start)
        if end:
            qs = qs.filter(date__lte=end)

        # Parse tags from transactions and aggregate
        tag_totals = {}
        tag_counts = {}
        tag_colors = {t.name: t.color for t in self.get_queryset()}

        for tx in qs:
            if tx.tags:
                tags = [t.strip() for t in tx.tags.split(",") if t.strip()]
                for tag in tags:
                    if tag not in tag_totals:
                        tag_totals[tag] = 0
                        tag_counts[tag] = 0
                    tag_totals[tag] += float(tx.amount)
                    tag_counts[tag] += 1

        result = [
            {
                "name": tag,
                "total": total,
                "count": tag_counts[tag],
                "color": tag_colors.get(tag, "#3B82F6"),
            }
            for tag, total in sorted(
                tag_totals.items(), key=lambda x: x[1], reverse=True
            )
        ]

        return Response({"tags": result})
