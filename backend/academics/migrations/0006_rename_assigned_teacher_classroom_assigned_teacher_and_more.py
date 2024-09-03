# Generated by Django 5.1 on 2024-09-03 22:08

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('academics', '0005_alter_classroom_students'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RenameField(
            model_name='classroom',
            old_name='assigned_Teacher',
            new_name='assigned_teacher',
        ),
        migrations.AlterField(
            model_name='classroom',
            name='students',
            field=models.ManyToManyField(blank=True, related_name='classes', to=settings.AUTH_USER_MODEL),
        ),
    ]
