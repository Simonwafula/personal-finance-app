from rest_framework import serializers
from .models import Account, Category, Transaction, Tag
from .models import RecurringTransaction
from wealth.models import Liability
from investments.models import Investment


class AccountSerializer(serializers.ModelSerializer):
    current_balance = serializers.SerializerMethodField()
    
    class Meta:
        model = Account
        fields = [
            "id",
            "name",
            "account_type",
            "currency",
            "opening_balance",
            "current_balance",
            "status",
            "institution",
            "notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "current_balance", "created_at", "updated_at"]
    
    def get_current_balance(self, obj):
        return obj.calculate_current_balance()


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "kind",
            "parent",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class TransactionSerializer(serializers.ModelSerializer):
    account_name = serializers.ReadOnlyField(source="account.name")
    transfer_account_name = serializers.ReadOnlyField(source="transfer_account.name")
    category_name = serializers.ReadOnlyField(source="category.name")
    savings_goal_name = serializers.ReadOnlyField(source="savings_goal.name")
    savings_goal_emoji = serializers.ReadOnlyField(source="savings_goal.emoji")
    liability_name = serializers.ReadOnlyField(source="liability.name")
    investment_name = serializers.ReadOnlyField(source="investment.name")

    class Meta:
        model = Transaction
        fields = [
            "id",
            "account",
            "account_name",
            "transfer_group",
            "transfer_account",
            "transfer_account_name",
            "transfer_direction",
            "investment",
            "investment_name",
            "investment_action",
            "date",
            "amount",
            "fee",
            "kind",
            "category",
            "category_name",
            "description",
            "tags",
            "is_recurring",
            "recurring_rule",
            "savings_goal",
            "savings_goal_name",
            "savings_goal_emoji",
            "liability",
            "liability_name",
            # SMS tracking fields (Mobile-only feature)
            "source",
            "sms_reference",
            "sms_detected_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "transfer_group",
            "transfer_direction",
            "created_at",
            "updated_at",
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and request.user and request.user.is_authenticated:
            self.fields["transfer_account"].queryset = Account.objects.filter(
                user=request.user
            )
            self.fields["liability"].queryset = Liability.objects.filter(
                user=request.user
            )
            self.fields["investment"].queryset = Investment.objects.filter(
                user=request.user
            )

    def validate(self, attrs):
        """Validate SMS fields if source is SMS"""
        source = attrs.get('source', 'MANUAL')
        kind = attrs.get("kind") or getattr(self.instance, "kind", None)
        account = attrs.get("account") or getattr(self.instance, "account", None)
        transfer_account = attrs.get("transfer_account") or getattr(
            self.instance, "transfer_account", None
        )
        liability = attrs.get("liability") or getattr(self.instance, "liability", None)
        savings_goal = attrs.get("savings_goal") or getattr(self.instance, "savings_goal", None)
        investment = attrs.get("investment") or getattr(self.instance, "investment", None)
        investment_action = attrs.get("investment_action") or getattr(
            self.instance, "investment_action", None
        )

        # If source is SMS, sms_reference should be provided
        if source == 'SMS' and not attrs.get('sms_reference'):
            raise serializers.ValidationError({
                'sms_reference': 'SMS reference is required when source is SMS'
            })

        if kind == Transaction.Kind.TRANSFER:
            if transfer_account and account and transfer_account == account:
                raise serializers.ValidationError({
                    "transfer_account": "Transfer account must differ from the source account."
                })
            if liability:
                raise serializers.ValidationError({
                    "liability": "Debt link is only allowed for expense transactions."
                })
            if "investment" in attrs and investment:
                raise serializers.ValidationError({
                    "investment": "Investment link is only allowed for income or expense transactions."
                })
            if "savings_goal" in attrs and savings_goal:
                raise serializers.ValidationError({
                    "savings_goal": "Savings goal link is only allowed for income or expense transactions."
                })
        else:
            if transfer_account:
                raise serializers.ValidationError({
                    "transfer_account": "Transfer account is only allowed for transfer transactions."
                })

        if liability and kind != Transaction.Kind.EXPENSE:
            raise serializers.ValidationError({
                "liability": "Debt link is only allowed for expense transactions."
            })
        if investment_action and not investment:
            raise serializers.ValidationError({
                "investment_action": "Investment action requires an investment selection."
            })

        return attrs


class AggregatedPointSerializer(serializers.Serializer):
    """Serializer for aggregated transaction data points."""
    date = serializers.CharField()
    income = serializers.FloatField()
    expenses = serializers.FloatField()


class TopCategorySerializer(serializers.Serializer):
    """Serializer for top expense categories."""
    id = serializers.IntegerField()
    name = serializers.CharField()
    amount = serializers.FloatField()


class AggregatedResponseSerializer(serializers.Serializer):
    """Response wrapper for aggregated transactions."""
    series = AggregatedPointSerializer(many=True)


class TopCategoriesResponseSerializer(serializers.Serializer):
    """Response wrapper for top categories."""
    categories = TopCategorySerializer(many=True)


class RecurringTransactionSerializer(serializers.ModelSerializer):
    account_name = serializers.ReadOnlyField(source="account.name")
    category_name = serializers.ReadOnlyField(source="category.name")

    class Meta:
        model = RecurringTransaction
        fields = [
            "id",
            "account",
            "account_name",
            "date",
            "amount",
            "kind",
            "category",
            "category_name",
            "description",
            "frequency",
            "end_date",
            "last_executed",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = [
            "id",
            "name",
            "color",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
