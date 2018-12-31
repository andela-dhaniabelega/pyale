import re

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.exceptions import ValidationError
from django.db import models
from django.contrib.postgres.fields import ArrayField
from cloudinary.models import CloudinaryField


class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, email, first_name, last_name, password=None):
        user = self.model(
            email=self.normalize_email(email),
            first_name=first_name,
            last_name=last_name
        )
        if all([email, first_name, last_name, password]):
            user.set_password(password)
            user.save(using=self._db)
        return user

    def create_superuser(self, email, password, first_name, last_name):
        user = self.create_user(
            email=self.normalize_email(email),
            password=password,
            first_name=first_name,
            last_name=last_name,
        )
        user.is_staff = True
        user.is_admin = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField(
        verbose_name='email address',
        max_length=255,
        unique=True,
    )
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'

    def __str__(self):
        return " ".join([self.first_name, self.last_name])

    def clean(self):
        password_pattern = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
        if self.password and not re.match(password_pattern, self.password):
            raise ValidationError(
                "Password must contain at least: "
                "1 upper case letter, 1 lower case letter, 1 special character, 1 digit "
                "and have a minimum 8 characters")

        email_pattern = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}" \
                        "[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
        if self.email and not re.match(email_pattern, self.email):
            raise ValidationError("Invalid Email")


class Property(models.Model):

    PROPERTY_CATEGORIES = (
        ('Residential', 'residential'),
        ('Commercial', 'commercial')
    )

    category = models.CharField(
        max_length=255,
        choices=PROPERTY_CATEGORIES
    )
    total_cost = models.CharField(max_length=512)
    description = models.TextField()
    specs = ArrayField(models.CharField(max_length=512))
    title = models.CharField(unique=True, max_length=512)

    def __str__(self):
        return self.title


class PropertyImage(models.Model):
    realty = models.ForeignKey(Property, on_delete=models.CASCADE)
    image = CloudinaryField('image')
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name


class Tenant(models.Model):
    bio = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return " ".join([self.bio.first_name, self.bio.last_name])


class TenantDocument(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    document = models.FileField()
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)
    name = models.CharField(unique=True, max_length=255)

    def __str__(self):
        return self.name


class Letting(models.Model):

    PAYMENT_SCHEDULE_TYPES = (
        ('Annual', 'annual'),
        ('Quarterly', 'quarterly'),
        ('Monthly', 'monthly')
    )

    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    realty = models.ForeignKey(Property, on_delete=models.CASCADE)
    letting_type = models.CharField(max_length=50)
    letting_start_date = models.DateField()
    letting_end_date = models.DateField()
    deposit = models.CharField(max_length=512)
    deposit_refunded = models.BooleanField(null=True, blank=True)
    deposit_refund_date = models.DateTimeField(null=True, blank=True)
    total_letting_cost = models.CharField(max_length=512, help_text="Total Cost for the letting period")
    service_charge = models.CharField(max_length=100)
    payment_schedule = models.CharField(
        max_length=100,
        help_text="Monthly, Quarterly or Annually",
        choices=PAYMENT_SCHEDULE_TYPES
    )

    def __str__(self):
        return " ".join([self.tenant.bio.first_name, self.tenant.bio.last_name])


class PaymentSchedule(models.Model):
    letting = models.ForeignKey(Letting, on_delete=models.CASCADE)
    amount_due = models.CharField(max_length=512,
                                  help_text="The amount to be paid per cycle e.g. the amount per month or per quarter")
    payment_status = models.BooleanField()
    payment_date = models.DateTimeField(null=True, blank=True)
    payment_cycle = models.CharField(max_length=100)

    def __str__(self):
        return " ".join([self.letting.tenant.bio.first_name, self.letting.tenant.bio.last_name])


class Payment(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    payment_reference = models.CharField(max_length=255)
    payment_date = models.DateTimeField()

    def __str__(self):
        return " ".join([self.tenant.bio.first_name, self.tenant.bio.last_name])
