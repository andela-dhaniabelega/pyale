# Generated by Django 2.1.4 on 2019-02-03 02:37

from django.db import migrations, models
import djmoney.models.fields


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0024_pyale'),
    ]

    operations = [
        migrations.AddField(
            model_name='letting',
            name='amount_outstanding',
            field=djmoney.models.fields.MoneyField(blank=True, decimal_places=2, default=None, editable=False, help_text='Total amount outstanding for the letting duration (in Naira)', max_digits=19, null=True),
        ),
        migrations.AddField(
            model_name='letting',
            name='amount_outstanding_currency',
            field=djmoney.models.fields.CurrencyField(choices=[('NGN', 'Naira')], default='NGN', editable=False, max_length=3),
        ),
        migrations.AddField(
            model_name='letting',
            name='amount_paid',
            field=djmoney.models.fields.MoneyField(blank=True, decimal_places=2, default=None, editable=False, help_text='Total amount paid for the letting duration (in Naira)', max_digits=19, null=True),
        ),
        migrations.AddField(
            model_name='letting',
            name='amount_paid_currency',
            field=djmoney.models.fields.CurrencyField(choices=[('NGN', 'Naira')], default='NGN', editable=False, max_length=3),
        ),
        migrations.AlterField(
            model_name='letting',
            name='letting_duration',
            field=models.IntegerField(default=0, help_text='Letting period (must be in months)'),
        ),
    ]
