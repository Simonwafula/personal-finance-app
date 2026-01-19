from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("finance", "0007_add_investment_fields"),
    ]

    operations = [
        migrations.AddField(
            model_name="transaction",
            name="fee",
            field=models.DecimalField(decimal_places=2, default=0, max_digits=14),
        ),
    ]
