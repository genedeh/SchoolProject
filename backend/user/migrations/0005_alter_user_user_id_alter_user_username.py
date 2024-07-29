# Generated by Django 5.0.7 on 2024-07-29 18:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0004_alter_user_user_id_alter_user_username'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='user_id',
            field=models.UUIDField(default='a96512e3-79e8-4fc9-85dd-9ff11be69781', primary_key=True, serialize=False, unique=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='username',
            field=models.CharField(blank=True, max_length=100, unique=True),
        ),
    ]
