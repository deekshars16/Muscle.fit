# Generated migration for trainer functionality

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('programs', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='program',
            name='trainer',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='programs', to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
        migrations.CreateModel(
            name='Session',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('scheduled_date', models.DateTimeField()),
                ('session_type', models.CharField(choices=[('in-person', 'In-Person'), ('virtual', 'Virtual')], max_length=20)),
                ('attendance_status', models.CharField(choices=[('scheduled', 'Scheduled'), ('present', 'Present'), ('absent', 'Absent'), ('cancelled', 'Cancelled')], default='scheduled', max_length=20)),
                ('duration_minutes', models.IntegerField(default=60)),
                ('notes', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='client_sessions', to=settings.AUTH_USER_MODEL)),
                ('trainer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='trainer_sessions', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-scheduled_date'],
            },
        ),
        migrations.CreateModel(
            name='ClientTrainerAssignment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('assigned_date', models.DateTimeField(auto_now_add=True)),
                ('status', models.CharField(choices=[('active', 'Active'), ('inactive', 'Inactive'), ('completed', 'Completed')], default='active', max_length=20)),
                ('progress_notes', models.TextField(blank=True, null=True)),
                ('progress_percentage', models.IntegerField(default=0, help_text='0-100')),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='trainers', to=settings.AUTH_USER_MODEL)),
                ('program', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='programs.program')),
                ('trainer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='assigned_clients', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-assigned_date'],
                'unique_together': {('trainer', 'client')},
            },
        ),
    ]
