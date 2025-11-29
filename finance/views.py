# finance/views.py
import datetime

from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import LimitOffsetPagination
from django.contrib.auth import get_user_model
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

    def perform_create(self, serializer):
        tx = serializer.save(user=self.request.user)
        # Budget threshold notifications
        try:
            from budgeting.utils import (
                notify_budget_thresholds_for_transaction,
            )

            notify_budget_thresholds_for_transaction(tx, threshold=0.9)
        except Exception:
            # Don't block transaction creation on notifications
            pass

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
                    expenses=Sum(
                        "amount",
                        filter=Q(kind=Transaction.Kind.EXPENSE)
                    ),
                )
                .order_by("year", "quarter")
            )
            data = [
                {
                    "date": f"{s['year']}-Q{s['quarter']}",
                    "income": float(s.get("income") or 0),
                    "expenses": float(s.get("expenses") or 0),
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
                expenses=Sum(
                    "amount",
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
                "income": float(s.get("income") or 0),
                "expenses": float(s.get("expenses") or 0),
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
                    kind=row.get("kind") or "EXPENSE",
                    description=row.get("description", ""),
                )
                created += 1
            except Exception as e:
                errors.append({"row": idx + 1, "error": str(e)})

        return Response({"created": created, "errors": errors})

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
            .annotate(amount=Sum("amount"))
            .order_by("-amount")[:limit]
        )
        data = [
            {
                "id": c["category"],
                "name": c["category__name"],
                "amount": float(c["amount"] or 0),
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
