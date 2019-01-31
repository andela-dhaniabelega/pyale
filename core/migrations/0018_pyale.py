# Generated by Django 2.1.4 on 2019-01-17 21:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0017_pyale'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='superuser',
        ),
        migrations.AlterField(
            model_name='user',
            name='is_superuser',
            field=models.BooleanField(default=False),
        ),
    ]
