# Generated by Django 2.1.4 on 2019-01-17 21:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0016_pyale'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='is_active',
            new_name='active_user',
        ),
        migrations.RenameField(
            model_name='user',
            old_name='is_admin',
            new_name='admin_user',
        ),
        migrations.RenameField(
            model_name='user',
            old_name='is_staff',
            new_name='staff_user',
        ),
        migrations.AddField(
            model_name='user',
            name='superuser',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='user',
            name='is_superuser',
            field=models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status'),
        ),
    ]
