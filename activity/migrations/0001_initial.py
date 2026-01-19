from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="ActivityLog",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("actor", models.CharField(choices=[("USER", "User"), ("SYSTEM", "System")], default="USER", max_length=10)),
                ("action", models.CharField(max_length=50)),
                ("entity_type", models.CharField(blank=True, max_length=50)),
                ("entity_id", models.CharField(blank=True, max_length=64)),
                ("summary", models.CharField(max_length=255)),
                ("metadata", models.JSONField(blank=True, default=dict)),
                ("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="activity_logs", to=settings.AUTH_USER_MODEL)),
            ],
            options={
                "ordering": ["-created_at"],
            },
        ),
        migrations.AddIndex(
            model_name="activitylog",
            index=models.Index(fields=["user", "created_at"], name="activity_lo_user_id_9f6b05_idx"),
        ),
        migrations.AddIndex(
            model_name="activitylog",
            index=models.Index(fields=["user", "action"], name="activity_lo_user_id_6b36d9_idx"),
        ),
        migrations.AddIndex(
            model_name="activitylog",
            index=models.Index(fields=["entity_type", "entity_id"], name="activity_lo_entity__6f3d9a_idx"),
        ),
    ]
