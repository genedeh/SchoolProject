# Generated by Django 5.1 on 2024-08-12 00:37

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('academics', '0004_alter_classroom_assigned_teacher_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name='classroom',
            name='students',
            field=models.ManyToManyField(related_name='classes', to=settings.AUTH_USER_MODEL),
        ),
    ]
