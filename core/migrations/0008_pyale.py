# Generated by Django 2.1.4 on 2019-01-04 08:42

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0007_pyale'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='tenant',
            name='bio',
        ),
        migrations.AlterModelOptions(
            name='property',
            options={'verbose_name': 'Property', 'verbose_name_plural': 'Properties'},
        ),
        migrations.AlterModelOptions(
            name='user',
            options={'verbose_name': 'User', 'verbose_name_plural': 'Tenants'},
        ),
        migrations.RemoveField(
            model_name='propertyimage',
            name='name',
        ),
        migrations.AddField(
            model_name='propertyimage',
            name='tag',
            field=models.CharField(default='Building Image', help_text='A unique identifier for an image', max_length=255, unique=True),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='letting',
            name='tenant',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='payment',
            name='tenant',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='tenantdocument',
            name='tenant',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.DeleteModel(
            name='Tenant',
        ),
    ]