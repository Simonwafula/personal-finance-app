from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("finance", "0006_add_transfer_and_liability_fields"),
        ("investments", "0003_add_detailed_investment_fields"),
    ]

    operations = [
        migrations.AddField(
            model_name="transaction",
            name="investment",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="finance_transactions",
                to="investments.investment",
            ),
        ),
        migrations.AddField(
            model_name="transaction",
            name="investment_action",
            field=models.CharField(
                blank=True,
                choices=[
                    ("BUY", "Buy/Contribution"),
                    ("SELL", "Sell/Withdrawal"),
                    ("DIVIDEND", "Dividend"),
                    ("INTEREST", "Interest"),
                    ("FEE", "Fee/Charge"),
                ],
                max_length=10,
                null=True,
            ),
        ),
    ]
