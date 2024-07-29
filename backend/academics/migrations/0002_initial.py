# Generated by Django 5.0.7 on 2024-07-29 15:54

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('academics', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='classroom',
            name='assigned_Teacher',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='classrooms', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='classroom',
            name='students',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='classes', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='result',
            name='assigned_class',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='results', to='academics.classroom'),
        ),
        migrations.AddField(
            model_name='result',
            name='assigned_student',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='results', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='subject',
            name='assigned_class',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.PROTECT, related_name='sujects', to='academics.classroom'),
        ),
        migrations.AddField(
            model_name='subject',
            name='students_offering',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='subjects', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='uploadlist',
            name='assigned_teacher',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='uploalists', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='uploadlist',
            name='results_to_be_uploaded',
            field=models.ManyToManyField(related_name='uploalists', to='academics.result'),
        ),
    ]