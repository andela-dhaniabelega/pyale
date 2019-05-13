# Generated by Django 2.1.4 on 2019-05-12 11:06

from django.db import migrations, models
import s3direct.fields


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0049_pyale'),
    ]

    operations = [
        migrations.AddField(
            model_name='propertyimage',
            name='image_2',
            field=s3direct.fields.S3DirectField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='propertyimage',
            name='tag',
            field=models.CharField(choices=[('thumbnail', 'Thumbnail'), ('gallery', 'Gallery')], help_text='A tag name for this image', max_length=255),
        ),
    ]