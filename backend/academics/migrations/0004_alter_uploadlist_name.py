# Generated by Django 5.0.7 on 2024-07-29 17:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('academics', '0003_alter_subject_assigned_class_alter_uploadlist_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='uploadlist',
            name='name',
            field=models.CharField(blank=True, default='Upload_List#9fb8005c-6d27-443b-8fc3-88368770773a', max_length=60, unique=True),
        ),
    ]
