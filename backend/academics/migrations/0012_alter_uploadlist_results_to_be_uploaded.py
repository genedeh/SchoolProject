# Generated by Django 5.0.7 on 2024-07-30 16:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('academics', '0011_alter_result_year_span'),
    ]

    operations = [
        migrations.AlterField(
            model_name='uploadlist',
            name='results_to_be_uploaded',
            field=models.ManyToManyField(blank=True, related_name='uploalists', to='academics.result'),
        ),
    ]