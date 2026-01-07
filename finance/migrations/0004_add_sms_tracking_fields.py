# Generated migration for SMS tracking fields
# Production-safe: All fields nullable or have defaults

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('finance', '0003_transaction_savings_goal'),
    ]

    operations = [
        # Add source field with default='MANUAL'
        # Safe: Existing rows will automatically get 'MANUAL' value
        migrations.AddField(
            model_name='transaction',
            name='source',
            field=models.CharField(
                choices=[
                    ('MANUAL', 'Manual Entry'),
                    ('SMS', 'SMS Auto-Detection'),
                    ('IMPORT', 'CSV Import')
                ],
                default='MANUAL',
                help_text='How this transaction was created',
                max_length=10,
            ),
        ),

        # Add sms_reference field (nullable)
        # Safe: Existing rows will have NULL, which is fine
        migrations.AddField(
            model_name='transaction',
            name='sms_reference',
            field=models.CharField(
                blank=True,
                help_text='SMS reference number if source is SMS',
                max_length=100,
                null=True,
            ),
        ),

        # Add sms_detected_at field (nullable)
        # Safe: Existing rows will have NULL, which is fine
        migrations.AddField(
            model_name='transaction',
            name='sms_detected_at',
            field=models.DateTimeField(
                blank=True,
                help_text='When SMS was detected and parsed',
                null=True,
            ),
        ),

        # Add indexes for performance
        # Note: Use migrations.AddIndex instead of AddIndexConcurrently for SQLite compatibility
        # For PostgreSQL in production, consider running this separately with CONCURRENTLY
        migrations.AddIndex(
            model_name='transaction',
            index=models.Index(fields=['source'], name='finance_tra_source_idx'),
        ),
        migrations.AddIndex(
            model_name='transaction',
            index=models.Index(fields=['sms_reference'], name='finance_tra_sms_ref_idx'),
        ),
    ]
