# Generated by Django 2.1.4 on 2019-01-08 23:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0011_pyale'),
    ]

    operations = [
        migrations.AlterField(
            model_name='letting',
            name='letting_end_date',
            field=models.DateTimeField(),
        ),
        migrations.AlterField(
            model_name='letting',
            name='letting_start_date',
            field=models.DateTimeField(),
        ),
    ]
