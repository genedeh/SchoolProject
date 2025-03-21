# Generated by Django 5.1.2 on 2025-03-08 10:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='admission_number',
            field=models.CharField(blank=True, max_length=20, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='user',
            name='blood_group',
            field=models.CharField(blank=True, max_length=3, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='boarding_status',
            field=models.CharField(choices=[('Day', 'Day'), ('Boarding', 'Boarding')], default='Day', max_length=10),
        ),
        migrations.AddField(
            model_name='user',
            name='disability_status',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='genotype',
            field=models.CharField(blank=True, max_length=2, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='home_town',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='local_government_area',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='nationality',
            field=models.CharField(default='Nigerian', max_length=50),
        ),
        migrations.AddField(
            model_name='user',
            name='nin',
            field=models.CharField(blank=True, max_length=11, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='user',
            name='parent_guardian_email',
            field=models.EmailField(blank=True, max_length=254, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='parent_guardian_name',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='user',
            name='parent_guardian_phone',
            field=models.CharField(blank=True, max_length=15),
        ),
        migrations.AddField(
            model_name='user',
            name='previous_classes',
            field=models.JSONField(default=list),
        ),
        migrations.AddField(
            model_name='user',
            name='religion',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='state_of_origin',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
