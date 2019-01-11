# Generated by Django 2.1.4 on 2019-01-08 23:00

import cloudinary.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0010_pyale'),
    ]

    operations = [
        migrations.RenameField(
            model_name='letting',
            old_name='payment_schedule',
            new_name='schedule_type',
        ),
        migrations.AddField(
            model_name='paymentschedule',
            name='tag',
            field=models.CharField(default='Rent', max_length=255),
        ),
        migrations.AlterField(
            model_name='tenantdocument',
            name='document',
            field=cloudinary.models.CloudinaryField(max_length=255),
        ),
    ]
