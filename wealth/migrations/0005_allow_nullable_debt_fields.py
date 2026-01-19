from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("wealth", "0004_add_insurance_types"),
    ]

    operations = [
        migrations.AlterField(
            model_name="liability",
            name="interest_rate",
            field=models.DecimalField(
                blank=True,
                decimal_places=2,
                help_text="Annual interest rate in %",
                max_digits=5,
                null=True,
            ),
        ),
        migrations.AlterField(
            model_name="liability",
            name="minimum_payment",
            field=models.DecimalField(
                blank=True,
                decimal_places=2,
                max_digits=14,
                null=True,
            ),
        ),
    ]
