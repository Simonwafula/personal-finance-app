from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("finance", "0005_remove_transaction_finance_tra_source_idx_and_more"),
        ("wealth", "0004_add_insurance_types"),
    ]

    operations = [
        migrations.AddField(
            model_name="transaction",
            name="transfer_group",
            field=models.UUIDField(blank=True, db_index=True, null=True),
        ),
        migrations.AddField(
            model_name="transaction",
            name="transfer_account",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="transfer_counterpart_transactions",
                to="finance.account",
            ),
        ),
        migrations.AddField(
            model_name="transaction",
            name="transfer_direction",
            field=models.CharField(
                blank=True,
                choices=[("OUT", "Out"), ("IN", "In")],
                max_length=3,
                null=True,
            ),
        ),
        migrations.AddField(
            model_name="transaction",
            name="liability",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="transactions",
                to="wealth.liability",
            ),
        ),
    ]
