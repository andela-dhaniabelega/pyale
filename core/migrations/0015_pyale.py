# Generated by Django 2.1.4 on 2019-01-11 00:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0014_pyale'),
    ]

    operations = [
        migrations.AlterField(
            model_name='payment',
            name='payment_date',
            field=models.DateField(),
        ),
        migrations.AlterField(
            model_name='paymentschedule',
            name='payment_date',
            field=models.DateField(blank=True, null=True),
        ),
    ]
