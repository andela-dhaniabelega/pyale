# Generated by Django 2.1.4 on 2019-01-19 08:51

from decimal import Decimal
from django.db import migrations
import djmoney.models.fields


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0021_pyale'),
    ]

    operations = [
        migrations.AlterField(
            model_name='letting',
            name='deposit',
            field=djmoney.models.fields.MoneyField(decimal_places=4, default=Decimal('0.0'), help_text='Deposit for this letting (in Naira)', max_digits=19),
        ),
        migrations.AlterField(
            model_name='letting',
            name='service_charge',
            field=djmoney.models.fields.MoneyField(decimal_places=4, default=Decimal('0.0'), help_text='Annual Service Charge (in Naira)', max_digits=19),
        ),
        migrations.AlterField(
            model_name='letting',
            name='total_letting_cost',
            field=djmoney.models.fields.MoneyField(decimal_places=4, default=Decimal('0.0'), help_text='Total Cost for the letting period (in Naira)', max_digits=19),
        ),
        migrations.AlterField(
            model_name='paymentschedule',
            name='amount_due',
            field=djmoney.models.fields.MoneyField(decimal_places=4, default=Decimal('0.0'), help_text='The amount to be paid per cycle e.g. the amount per month or per quarter (in Naira)', max_digits=19),
        ),
        migrations.AlterField(
            model_name='property',
            name='total_cost',
            field=djmoney.models.fields.MoneyField(decimal_places=4, default=Decimal('0.0'), help_text='Cost of Property in Naira', max_digits=19),
        ),
    ]
