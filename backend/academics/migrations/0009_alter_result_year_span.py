# Generated by Django 5.1 on 2024-09-22 15:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('academics', '0008_remove_result_assigned_class_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='result',
            name='year_span',
            field=models.CharField(blank=True, default='2024/2025', help_text='For Example: 2023/2024', max_length=10),
        ),
    ]