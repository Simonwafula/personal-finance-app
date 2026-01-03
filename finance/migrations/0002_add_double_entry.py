# Generated migration for adding double-entry fields and external_id
from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):

    dependencies = [
        ('finance', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='transaction',
            name='from_account',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='transactions_from', to='finance.account'),
        ),
        migrations.AddField(
            model_name='transaction',
            name='to_account',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='transactions_to', to='finance.account'),
        ),
        migrations.AddField(
            model_name='transaction',
            name='external_id',
            field=models.CharField(blank=True, db_index=True, max_length=255, null=True),
        ),
    ]
