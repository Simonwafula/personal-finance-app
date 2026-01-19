from django.db import models
from django.conf import settings
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from decimal import Decimal


class Investment(models.Model):
    """Track individual investments like stocks, bonds, MMFs, etc."""
    
    INVESTMENT_TYPE = [
        ('STOCK', 'Stock/Shares'),
        ('BOND', 'Bond'),
        ('MMF', 'Money Market Fund'),
        ('MUTUAL_FUND', 'Mutual Fund'),
        ('ETF', 'ETF'),
        ('TBILL', 'Treasury Bill'),
        ('TBOND', 'Treasury Bond'),
        ('FIXED_DEPOSIT', 'Fixed Deposit'),
        ('SACCO', 'SACCO'),
        ('UNIT_TRUST', 'Unit Trust'),
        ('REAL_ESTATE', 'Real Estate'),
        ('CRYPTO', 'Cryptocurrency'),
        ('PENSION', 'Pension/Retirement'),
        ('INSURANCE_ENDOWMENT', 'Insurance - Endowment'),
        ('INSURANCE_WHOLE_LIFE', 'Insurance - Whole Life'),
        ('INSURANCE_EDUCATION', 'Insurance - Education Plan'),
        ('INSURANCE_INVESTMENT', 'Insurance - Investment Linked'),
        ('OTHER', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('SOLD', 'Sold'),
        ('MATURED', 'Matured'),
    ]
    
    PAYMENT_FREQUENCY = [
        ('NONE', 'None'),
        ('MONTHLY', 'Monthly'),
        ('QUARTERLY', 'Quarterly'),
        ('SEMI_ANNUAL', 'Semi-Annual'),
        ('ANNUAL', 'Annual'),
        ('AT_MATURITY', 'At Maturity'),
    ]
    
    BOND_TYPE = [
        ('INFRASTRUCTURE', 'Infrastructure Bond (Tax-Free)'),
        ('CORPORATE', 'Corporate Bond'),
        ('GOVERNMENT', 'Government Bond'),
        ('MUNICIPAL', 'Municipal Bond'),
        ('OTHER', 'Other'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="investments"
    )
    name = models.CharField(max_length=200)
    symbol = models.CharField(max_length=50, blank=True, help_text="Ticker symbol, policy number, or reference")
    investment_type = models.CharField(max_length=25, choices=INVESTMENT_TYPE, default='OTHER')
    
    # Purchase details
    purchase_date = models.DateField()
    purchase_price = models.DecimalField(max_digits=14, decimal_places=2, help_text="Price per unit or total amount")
    quantity = models.DecimalField(max_digits=14, decimal_places=4, default=1, help_text="Units, shares, or face value")
    purchase_fees = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Current valuation
    current_price = models.DecimalField(max_digits=14, decimal_places=2, help_text="Current price per unit or current value")
    last_updated = models.DateTimeField(auto_now=True)
    
    # For interest/income-bearing investments
    interest_rate = models.DecimalField(
        max_digits=6, decimal_places=3, default=0,
        help_text="Annual interest/coupon/dividend rate as percentage"
    )
    maturity_date = models.DateField(null=True, blank=True)
    
    # Bond-specific fields
    bond_type = models.CharField(max_length=20, choices=BOND_TYPE, blank=True, default='')
    payment_frequency = models.CharField(max_length=15, choices=PAYMENT_FREQUENCY, default='NONE')
    next_payment_date = models.DateField(null=True, blank=True)
    tax_rate = models.DecimalField(
        max_digits=5, decimal_places=2, default=0,
        help_text="Withholding tax rate on interest (0 for infra bonds, 15 for others)"
    )
    face_value = models.DecimalField(
        max_digits=14, decimal_places=2, null=True, blank=True,
        help_text="Par/Face value for bonds"
    )
    
    # Real Estate specific fields
    monthly_rent = models.DecimalField(
        max_digits=12, decimal_places=2, default=0,
        help_text="Monthly rental income"
    )
    monthly_costs = models.DecimalField(
        max_digits=12, decimal_places=2, default=0,
        help_text="Monthly costs (maintenance, management, insurance, etc.)"
    )
    property_tax_annual = models.DecimalField(
        max_digits=12, decimal_places=2, default=0,
        help_text="Annual property tax/rates"
    )
    occupancy_status = models.CharField(
        max_length=20, blank=True, default='',
        choices=[
            ('', 'N/A'),
            ('OCCUPIED', 'Occupied'),
            ('VACANT', 'Vacant'),
            ('PARTIALLY', 'Partially Occupied'),
        ]
    )
    
    # Insurance specific fields
    sum_assured = models.DecimalField(
        max_digits=14, decimal_places=2, null=True, blank=True,
        help_text="Death benefit / Maturity value"
    )
    premium_frequency = models.CharField(max_length=15, choices=PAYMENT_FREQUENCY, default='NONE')
    premium_amount = models.DecimalField(
        max_digits=12, decimal_places=2, default=0,
        help_text="Premium amount per payment"
    )
    surrender_value = models.DecimalField(
        max_digits=14, decimal_places=2, null=True, blank=True,
        help_text="Current surrender/cash value"
    )
    
    # SACCO specific fields
    dividend_rate = models.DecimalField(
        max_digits=5, decimal_places=2, default=0,
        help_text="Annual dividend rate on deposits"
    )
    loan_interest_rebate = models.DecimalField(
        max_digits=5, decimal_places=2, default=0,
        help_text="Interest rebate rate on loans"
    )
    
    # Metadata
    platform = models.CharField(max_length=100, blank=True, help_text="e.g., NSE, CIC, Britam, Binance")
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='ACTIVE')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.get_investment_type_display()})"

    @property
    def total_invested(self):
        """Total amount invested including fees"""
        return (self.purchase_price * self.quantity) + self.purchase_fees

    @property
    def current_value(self):
        """Current market value"""
        return self.current_price * self.quantity

    @property
    def gain_loss(self):
        """Unrealized gain/loss"""
        return self.current_value - self.total_invested

    @property
    def gain_loss_percentage(self):
        """Percentage return"""
        if self.total_invested == 0:
            return 0
        return (self.gain_loss / self.total_invested) * 100

    @property
    def days_held(self):
        """Number of days since purchase"""
        from datetime import date
        return (date.today() - self.purchase_date).days

    @property
    def annualized_return(self):
        """Annualized return percentage"""
        if self.days_held == 0 or self.total_invested == 0:
            return 0
        total_return = float(self.gain_loss_percentage)
        years = self.days_held / 365
        if years == 0:
            return total_return
        return ((1 + total_return/100) ** (1/years) - 1) * 100
    
    @property
    def annual_income(self):
        """Estimated annual income from investment"""
        if self.investment_type == 'REAL_ESTATE':
            return (self.monthly_rent - self.monthly_costs) * 12 - self.property_tax_annual
        elif self.investment_type in ['BOND', 'TBOND', 'TBILL']:
            gross_interest = (self.face_value or self.quantity) * (self.interest_rate / 100)
            tax = gross_interest * (self.tax_rate / 100)
            return gross_interest - tax
        elif self.investment_type in ['MMF', 'FIXED_DEPOSIT', 'SACCO']:
            return float(self.current_price) * float(self.interest_rate or self.dividend_rate) / 100
        elif self.investment_type in ['INSURANCE_ENDOWMENT', 'INSURANCE_WHOLE_LIFE', 'INSURANCE_EDUCATION', 'INSURANCE_INVESTMENT']:
            return 0  # Insurance returns are at maturity
        return 0
    
    @property
    def net_rental_yield(self):
        """Net rental yield for real estate"""
        if self.investment_type != 'REAL_ESTATE' or not self.purchase_price:
            return 0
        annual_net_rent = (self.monthly_rent - self.monthly_costs) * 12 - self.property_tax_annual
        return (annual_net_rent / float(self.purchase_price)) * 100


class InvestmentTransaction(models.Model):
    """Track buy/sell/dividend transactions for investments"""
    
    TRANSACTION_TYPE = [
        ('BUY', 'Buy'),
        ('SELL', 'Sell'),
        ('DIVIDEND', 'Dividend'),
        ('INTEREST', 'Interest'),
        ('BONUS', 'Bonus Shares'),
        ('SPLIT', 'Stock Split'),
        ('FEE', 'Fee/Charge'),
    ]

    investment = models.ForeignKey(
        Investment,
        on_delete=models.CASCADE,
        related_name="investment_transactions"
    )
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPE)
    date = models.DateField()
    quantity = models.DecimalField(max_digits=14, decimal_places=4, default=0)
    price_per_unit = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=14, decimal_places=2)
    fees = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date', '-created_at']

    def __str__(self):
        return f"{self.investment.name} - {self.get_transaction_type_display()} - {self.total_amount}"


# Signal to sync investments to assets
@receiver(post_save, sender=Investment)
def sync_investment_to_asset(sender, instance, created, **kwargs):
    """Automatically create/update corresponding asset when investment changes"""
    from wealth.models import Asset
    
    if instance.status != 'ACTIVE':
        # If investment is sold/matured, remove the asset
        Asset.objects.filter(
            user=instance.user,
            source_type='INVESTMENT',
            source_id=instance.id
        ).delete()
        return
    
    # Map investment type to asset type
    type_mapping = {
        'STOCK': 'STOCK',
        'BOND': 'BOND',
        'MMF': 'MMF',
        'MUTUAL_FUND': 'MMF',
        'ETF': 'STOCK',
        'TREASURY_BILL': 'BOND',
        'TREASURY_BOND': 'BOND',
        'SACCO_SHARES': 'OTHER',
        'UNIT_TRUST': 'MMF',
        'REAL_ESTATE': 'LAND',
        'CRYPTO': 'OTHER',
        'PENSION': 'PENSION',
        'INSURANCE_ENDOWMENT': 'INSURANCE',
        'INSURANCE_WHOLE_LIFE': 'INSURANCE',
        'INSURANCE_EDUCATION': 'INSURANCE',
        'INSURANCE_INVESTMENT': 'INSURANCE',
        'OTHER': 'OTHER',
    }
    
    asset_type = type_mapping.get(instance.investment_type, 'OTHER')
    
    # Create or update the asset
    Asset.objects.update_or_create(
        user=instance.user,
        source_type='INVESTMENT',
        source_id=instance.id,
        defaults={
            'name': f"{instance.name}",
            'asset_type': asset_type,
            'current_value': instance.current_value,
            'notes': f"Auto-synced from Investments. Platform: {instance.platform}"
        }
    )


@receiver(post_delete, sender=Investment)
def delete_investment_asset(sender, instance, **kwargs):
    """Remove corresponding asset when investment is deleted"""
    from wealth.models import Asset
    Asset.objects.filter(
        user=instance.user,
        source_type='INVESTMENT',
        source_id=instance.id
    ).delete()
