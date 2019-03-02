import logging
import re

import cloudinary
import cloudinary.uploader
from dirtyfields import DirtyFieldsMixin
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.exceptions import ValidationError
from django.core.mail import send_mail, EmailMultiAlternatives
from django.db import models
from django.contrib.postgres.fields import ArrayField, JSONField
from django.dispatch import receiver
from django.db.models.signals import post_save
from cloudinary.models import CloudinaryField
import pendulum
from django.template.loader import render_to_string
from django.urls import reverse
from django.utils.html import strip_tags
from django_rest_passwordreset.signals import reset_password_token_created
from djmoney.models.fields import MoneyField

from core.constants import LOCAL_HOST
from core.utils import get_public_id_from_url, get_cycles_from_date_range, generate_random_string
from pyale import settings
from pyale.settings import EMAIL_HOST_USER

logger = logging.getLogger(__name__)
ALLOWED_CONTENT_TYPES = ("application/pdf",)
ALLOWED_IMAGE_TYPES = ("image/png", "image/jpg", "image/jpeg", "image/gif", "image/svg")


class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, email, first_name, last_name, password=None):
        user = self.model(email=self.normalize_email(email), first_name=first_name, last_name=last_name)
        if all([email, first_name, last_name, password]):
            user.set_password(password)
            user.save(using=self._db)
        return user

    def create_superuser(self, email, password, first_name, last_name):
        user = self.create_user(
            email=self.normalize_email(email), password=password, first_name=first_name, last_name=last_name
        )
        user.is_staff = True
        user.admin_user = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField(verbose_name="email address", max_length=255, unique=True)
    is_active = models.BooleanField(default=True)
    admin_user = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)
    temp_password_expiry = models.DateTimeField(null=True, blank=True)
    temp_password = models.CharField(max_length=50, null=True, blank=True)

    objects = UserManager()

    USERNAME_FIELD = "email"

    def __str__(self):
        return " ".join([self.first_name, self.last_name])

    def clean(self):
        # password_pattern = (
        #     "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
        # )
        # if self.password and not re.match(password_pattern, self.password):
        #     raise ValidationError(
        #         "Password must contain at least: "
        #         "1 upper case letter, 1 lower case letter, 1 special character, 1 digit "
        #         "and have a minimum 8 characters"
        #     )

        email_pattern = (
            "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}"
            "[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
        )
        if self.email and not re.match(email_pattern, self.email):
            raise ValidationError("Invalid Email")

    def save(self, *args, **kwargs):
        if self._state.adding and not self.is_superuser:
            self.temp_password = generate_random_string()
            self.set_password(self.temp_password)
        super().save()

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Tenants"


class Property(models.Model):
    PROPERTY_CATEGORIES = (("Residential", "residential"), ("Commercial", "commercial"))
    PROPERTY_LOCATIONS = (("Lagos", "lagos"), ("Port Harcourt", "portharcourt"))

    category = models.CharField(max_length=255, choices=PROPERTY_CATEGORIES)
    property_value = MoneyField(
        max_digits=19,
        decimal_places=2,
        default_currency=settings.DEFAULT_CURRENCY,
        blank=True,
        null=True,
        help_text="Value of Property in Naira",
    )
    current_rental_value = MoneyField(
        max_digits=19,
        decimal_places=2,
        default_currency=settings.DEFAULT_CURRENCY,
        blank=True,
        null=True,
        help_text="Rental Value of Property in Naira for current year",
    )
    rental_revenue = MoneyField(
        max_digits=19,
        decimal_places=2,
        blank=True,
        null=True,
        default_currency=settings.DEFAULT_CURRENCY,
        help_text="Payable Revenue on property in Naira for current year",
    )
    year = models.CharField(max_length=100)
    net_revenue = MoneyField(
        max_digits=19,
        decimal_places=2,
        blank=True,
        null=True,
        default_currency=settings.DEFAULT_CURRENCY,
        help_text="Net Revenue of Property in Naira for current year",
    )
    description = models.TextField()
    specs = ArrayField(models.CharField(max_length=512))
    name = models.CharField(unique=True, max_length=512)
    location = models.CharField(blank=True, null=True, max_length=100, choices=PROPERTY_LOCATIONS)

    def __str__(self):
        return self.name

    def save(self, force_insert=False, force_update=False, using=None, update_fields=None):
        self.year = pendulum.now(tz="Africa/Lagos").year

        if self.rental_revenue and self.id:
            running_cost = [
                running_cost.amount for running_cost in PropertyRunningCosts.objects.filter(realty_id=self.id)
            ]
            running_cost = sum(running_cost)
            self.net_revenue = self.rental_revenue.amount - running_cost

        super().save()

    def delete(self, using=None, keep_parents=False):
        property_images = PropertyImage.objects.filter(realty_id=self.id)
        if property_images is not None:
            for property_image in property_images:
                public_id = get_public_id_from_url(property_image.image.url)
                cloudinary.uploader.destroy(public_id)
        super().delete()

    class Meta:
        verbose_name = "Property"
        verbose_name_plural = "Properties"


class PropertyRunningCosts(models.Model):
    realty = models.ForeignKey(Property, on_delete=models.CASCADE)
    cost_description = models.TextField()
    amount_spent = MoneyField(max_digits=19, decimal_places=2, default_currency=settings.DEFAULT_CURRENCY)

    def __str__(self):
        return self.realty.name

    class Meta:
        verbose_name = "Property Running Cost"
        verbose_name_plural = "Property Running Costs"


class PropertyImage(DirtyFieldsMixin, models.Model):
    realty = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="property_images")
    image = CloudinaryField("image")
    image_details = JSONField(max_length=255, null=True, blank=True)
    tag = models.CharField(max_length=255, help_text="A tag name for this image")

    def __str__(self):
        return self.tag

    def save(self, force_insert=False, force_update=False, using=None, update_fields=None):
        self.full_clean()
        if self._state.adding:
            new_image = cloudinary.uploader.upload(self.image, use_filename=True, folder="property_images/")
            self.image_details = new_image
            self.image = new_image["url"]
        else:
            modified_fields = self.get_dirty_fields()
            if "image" in modified_fields:
                # Remove existing image from Cloudinary
                public_id = get_public_id_from_url(self._original_state["image"].url)
                cloudinary.uploader.destroy(public_id)

                # Save new Image
                new_image = cloudinary.uploader.upload(self.image)
                self.image_details = new_image
                self.image = new_image["url"]
        super().save()

    def clean(self):
        if hasattr(self.image, "file"):
            if self.image.content_type not in ALLOWED_IMAGE_TYPES:
                raise ValidationError({"image": "Unsupported Image Format. Supported: .jpg, .jpeg, .png, .gif, .svg"})
            if self.image.size > 1_000_000:
                raise ValidationError({"image": "Maximum Image size is 10MB"})

    def delete(self, using=None, keep_parents=False):
        public_id = get_public_id_from_url(self.image.url)
        cloudinary.uploader.destroy(public_id)
        super().delete()

    class Meta:
        verbose_name = "Property Image"
        verbose_name_plural = "Property Images"


class PropertyDocument(DirtyFieldsMixin, models.Model):
    realty = models.ForeignKey(Property, on_delete=models.CASCADE)
    document = CloudinaryField()
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)
    name = models.CharField(unique=True, max_length=255)

    def __str__(self):
        return self.name

    def save(self, force_insert=False, force_update=False, using=None, update_fields=None):
        self.full_clean()
        if self._state.adding:
            new_document = cloudinary.uploader.upload(self.document, use_filename=True, folder="property_documents/")
            self.document = new_document["url"]
        else:
            modified_fields = self.get_dirty_fields()
            if "document" in modified_fields:
                # Remove existing image from Cloudinary
                original_document = self._original_state["document"]
                public_id = get_public_id_from_url(original_document.url)
                cloudinary.uploader.destroy(f"{public_id}.{original_document.format}", resource_type="raw")

                # Save new Document
                new_document = cloudinary.uploader.upload(self.document, resource_type="raw")
                self.document = new_document["url"]
        super().save()

    def clean(self):
        if self.document.content_type not in ALLOWED_CONTENT_TYPES:
            raise ValidationError({"document": "Only PDF documents are allowed at this time"})
        if self.document.size > 1_000_000:
            raise ValidationError({"document": "Maximum file size allowed is 10MB"})

    class Meta:
        verbose_name = "Property Document"
        verbose_name_plural = "Property Documents"


class TenantDocument(DirtyFieldsMixin, models.Model):
    tenant = models.ForeignKey(User, on_delete=models.CASCADE)
    document = CloudinaryField()
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)
    name = models.CharField(unique=True, max_length=255)
    admin_only_access = models.BooleanField(default=False)

    def __str__(self):
        return self.name

    def save(self, force_insert=False, force_update=False, using=None, update_fields=None):
        self.full_clean()
        if self._state.adding:
            new_document = cloudinary.uploader.upload(self.document, use_filename=True, folder="tenant_documents/")
            self.document = new_document["url"]
        else:
            modified_fields = self.get_dirty_fields()
            if "document" in modified_fields:
                # Remove existing image from Cloudinary
                original_document = self._original_state["document"]
                public_id = get_public_id_from_url(original_document.url)
                cloudinary.uploader.destroy(f"{public_id}.{original_document.format}", resource_type="raw")

                # Save new Document
                new_document = cloudinary.uploader.upload(self.document, resource_type="raw")
                self.document = f"{new_document['url']}.{new_document.format}"
        super().save()

    def clean(self):
        if self.document.content_type not in ALLOWED_CONTENT_TYPES:
            raise ValidationError({"document": "Only PDF documents are allowed at this time"})
        if self.document.size > 1_000_000:
            raise ValidationError({"document": "Maximum file size allowed is 10MB"})

    def delete(self, using=None, keep_parents=False):
        public_id = get_public_id_from_url(self.document.url)
        cloudinary.uploader.destroy(f"{public_id}.{self.document.format}", resource_type="raw")
        super().delete()

    class Meta:
        verbose_name = "Tenant Document"
        verbose_name_plural = "Tenant Documents"


class TenantComment(models.Model):
    tenant = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.TextField()
    date_added = models.DateField(auto_now_add=True)

    def __str__(self):
        return " ".join([self.tenant.first_name, self.tenant.last_name])


class Letting(DirtyFieldsMixin, models.Model):
    PAYMENT_SCHEDULE_TYPES = (
        ("annual", "Annual"),
        ("quarterly", "Quarterly"),
        ("monthly", "Monthly"),
        ("single", "Single"),
    )
    LETTING_TYPES = (("rent", "Rent"), ("lease", "Lease"), ("sale", "Sale"))
    TOTAL_LETTING_COST = "cost"
    LETTING_START_DATE = "start_date"
    LETTING_DURATION = "duration"
    SCHEDULE_TYPE = "schedule_type"
    ANNUAL = "annual"
    QUARTERLY = "quarterly"
    MONTHLY = "monthly"

    tenant = models.ForeignKey(User, on_delete=models.CASCADE)
    realty = models.ForeignKey(Property, on_delete=models.CASCADE)
    type = models.CharField(max_length=50, default="Rent", choices=LETTING_TYPES)
    duration = models.IntegerField(default=0, help_text="Letting period (must be in months)")
    start_date = models.DateField()
    end_date = models.DateField(editable=False)
    deposit = MoneyField(
        max_digits=19,
        decimal_places=2,
        default_currency=settings.DEFAULT_CURRENCY,
        help_text="Deposit for this letting (in Naira)",
    )
    deposit_refunded = models.BooleanField(null=True, blank=True)
    deposit_refund_date = models.DateField(null=True, blank=True)
    cost = MoneyField(
        max_digits=19,
        decimal_places=2,
        default_currency=settings.DEFAULT_CURRENCY,
        help_text="Total Cost for the letting period (in Naira)",
    )
    service_charge = MoneyField(
        max_digits=19,
        decimal_places=2,
        default_currency=settings.DEFAULT_CURRENCY,
        help_text="Annual Service Charge (in Naira)",
    )
    schedule_type = models.CharField(
        max_length=100, help_text="Monthly, Quarterly or Annually", choices=PAYMENT_SCHEDULE_TYPES
    )
    amount_paid = MoneyField(
        max_digits=19,
        decimal_places=2,
        default_currency=settings.DEFAULT_CURRENCY,
        help_text="Total amount paid for the letting duration (in Naira)",
        editable=False,
        blank=True,
        null=True,
    )
    amount_outstanding = MoneyField(
        max_digits=19,
        decimal_places=2,
        default_currency=settings.DEFAULT_CURRENCY,
        help_text="Total amount outstanding for the letting duration (in Naira)",
        editable=False,
        blank=True,
        null=True,
    )
    defaulting_amount = MoneyField(
        max_digits=19,
        decimal_places=2,
        default_currency=settings.DEFAULT_CURRENCY,
        help_text="Total amount defaulted for this letting (in Naira)",
        blank=True,
        null=True,
    )
    defaulting_description = models.TextField(blank=True, null=True)

    def __str__(self):
        return " ".join([self.tenant.first_name, self.tenant.last_name])

    def save(self, force_insert=False, force_update=False, using=None, update_fields=None):
        self.clean()

        start_date = pendulum.datetime(self.start_date.year, self.start_date.month, self.start_date.day)
        self.end_date = start_date.add(months=self.duration).subtract(days=1).date()

        modified_fields = self.get_dirty_fields()

        if self.LETTING_START_DATE in modified_fields:
            raise ValidationError("You cannot edit the start date of an ongoing letting")

        fields_requiring_schedule_update = {self.TOTAL_LETTING_COST, self.LETTING_DURATION, self.SCHEDULE_TYPE}
        if any(field in fields_requiring_schedule_update for field in modified_fields) and self.id is not None:
            # Calculate new letting end date if duration is changed
            self.end_date = start_date.add(months=self.duration).subtract(days=1).date()

            # Deactivate old schedule
            PaymentSchedule.objects.filter(letting_id=self.id).update(active_schedule=False)

            # Create new schedule
            self.create_payment_schedule(
                self.schedule_type, self.cost.amount, self.start_date, self.end_date.add(days=1).date(), self.type
            )
        super().save()

    def clean(self):
        super().clean_fields()
        start_date = pendulum.datetime(self.start_date.year, self.start_date.month, self.start_date.day)

        current_date = pendulum.now().date()

        if self._state.adding and start_date.date() < current_date:
            raise ValidationError({"start_date": "Letting start date cannot be earlier than current date:"})

        if self.duration % 3 != 0 and self.schedule_type.lower() == self.QUARTERLY:
            raise ValidationError(
                {"schedule_type": "Quarterly payment schedule is not suitable for specified letting duration"}
            )

        if self.duration % 12 != 0 and self.schedule_type.lower() == self.ANNUAL:
            raise ValidationError(
                {"schedule_type": "Annual payment schedule is not suitable for specified letting duration"}
            )

        if self.type == "rent":
            if self.duration > settings.MAX_RENT_MONTHS:
                raise ValidationError(
                    {"duration": "Rent period cannot be greater than 5 years (or 60 months). Is this a lease/sale?"}
                )
            if self.schedule_type == "single":
                raise ValidationError(
                    {"schedule_type": "Rent payment schedule type must be either annually, monthly or quarterly"}
                )

        if self.type in ("lease", "sale"):
            if self.duration < settings.MAX_RENT_MONTHS:
                raise ValidationError(
                    {"duration": "Lease or Sale cannot be less than 5 years (or 6 months). Could this be a rental?"}
                )
            if self.schedule_type in (self.ANNUAL, self.QUARTERLY, self.MONTHLY):
                raise ValidationError(
                    {"schedule_type": "You can only choose a 'single' schedule type for Leases or Sales"}
                )

        super().validate_unique()

    def create_payment_schedule(self, schedule_type, cost, start_date, end_date, letting_type):
        payment_schedules = {
            "annual": self.create_annual_schedule,
            "quarterly": self.create_quarterly_schedule,
            "monthly": self.create_monthly_schedule,
            "single": self.create_single_schedule,
        }
        payment_schedules[schedule_type.lower()](cost, start_date, end_date, letting_type)

    def create_single_schedule(self, cost, letting_type):
        PaymentSchedule.objects.create(
            letting_id=self.id, amount_due=cost, payment_status=False, payment_cycle="Single Payment", tag=letting_type
        )

    def create_annual_schedule(self, cost, start_date, end_date, letting_type):
        years = get_cycles_from_date_range(start_date, end_date, schedule=self.ANNUAL)
        amount_per_year = cost / len(years)
        new_payment_schedule = [
            PaymentSchedule(
                letting_id=self.id,
                amount_due=amount_per_year,
                payment_status=False,
                payment_cycle=year,
                tag=letting_type,
            )
            for year in years
        ]
        PaymentSchedule.objects.bulk_create(new_payment_schedule)

    def create_quarterly_schedule(self, cost, start_date, end_date, letting_type):
        quarters = get_cycles_from_date_range(start_date, end_date, schedule=self.QUARTERLY)
        amount_per_quarter = cost / len(quarters)
        new_payment_schedule = [
            PaymentSchedule(
                letting_id=self.id,
                amount_due=amount_per_quarter,
                payment_status=False,
                payment_cycle=quarter,
                tag=letting_type,
            )
            for quarter in quarters
        ]
        PaymentSchedule.objects.bulk_create(new_payment_schedule)

    def create_monthly_schedule(self, cost, start_date, end_date, letting_type):
        months = get_cycles_from_date_range(start_date, end_date, schedule=self.MONTHLY)
        amount_per_month = cost / len(months)
        new_payment_schedule = [
            PaymentSchedule(
                letting_id=self.id,
                amount_due=amount_per_month,
                payment_status=False,
                payment_cycle=month,
                tag=letting_type,
            )
            for month in months
        ]
        PaymentSchedule.objects.bulk_create(new_payment_schedule)


class PaymentSchedule(models.Model):
    letting = models.ForeignKey(Letting, on_delete=models.CASCADE, editable=False)
    amount_due = MoneyField(
        max_digits=19,
        decimal_places=2,
        default_currency=settings.DEFAULT_CURRENCY,
        help_text="The amount to be paid per cycle e.g. the amount per month " "or per quarter (in Naira)",
    )
    payment_status = models.BooleanField()
    payment_date = models.DateField(null=True, blank=True)
    payment_cycle = models.CharField(max_length=100, editable=False)
    tag = models.CharField(default="Rent", max_length=255, editable=False)
    active_schedule = models.BooleanField(default=True)

    def __str__(self):
        return " ".join([self.letting.tenant.first_name, self.letting.tenant.last_name])

    class Meta:
        verbose_name = "Tenant Payment Schedule"
        verbose_name_plural = "Tenant Payment Schedules"


class Payment(models.Model):
    tenant = models.ForeignKey(User, on_delete=models.CASCADE)
    payment_reference = models.CharField(max_length=255)
    payment_date = models.DateField()

    def __str__(self):
        return " ".join([self.tenant.first_name, self.tenant.last_name])


class PropertyRecords(models.Model):
    """
    Entries from Property model will be moved into this table at the beginning of each year for now.
    """

    PROPERTY_CATEGORIES = (("Residential", "Residential"), ("Commercial", "Commercial"))

    category = models.CharField(max_length=255, choices=PROPERTY_CATEGORIES)
    property_value = MoneyField(
        max_digits=19,
        decimal_places=2,
        default_currency=settings.DEFAULT_CURRENCY,
        blank=True,
        null=True,
        help_text="Value of Property in Naira",
    )
    current_rental_value = MoneyField(
        max_digits=19,
        decimal_places=2,
        default_currency=settings.DEFAULT_CURRENCY,
        blank=True,
        null=True,
        help_text="Rental Value of Property in Naira for current year",
    )
    rental_revenue = MoneyField(
        max_digits=19,
        decimal_places=2,
        blank=True,
        null=True,
        default_currency=settings.DEFAULT_CURRENCY,
        help_text="Payable Revenue on property in Naira for current year",
    )
    year = models.CharField(max_length=100)
    net_revenue = MoneyField(
        max_digits=19,
        decimal_places=2,
        blank=True,
        null=True,
        default_currency=settings.DEFAULT_CURRENCY,
        help_text="Net Revenue of Property in Naira for current year",
    )


# Signals


@receiver(post_save, sender=PaymentSchedule)
def update_letting(sender, **kwargs):
    instance = kwargs.get("instance")

    amount_paid = PaymentSchedule.objects.filter(letting_id=instance.letting.id, payment_status=True)
    amount_paid = sum([amount.amount_due for amount in amount_paid]) if amount_paid else 0.00

    amount_outstanding = PaymentSchedule.objects.filter(letting_id=instance.letting.id, payment_status=False)
    amount_outstanding = sum([amount.amount_due for amount in amount_outstanding]) if amount_outstanding else 0.00

    Letting.objects.filter(pk=instance.letting.id).update(
        amount_paid=amount_paid, amount_outstanding=amount_outstanding
    )


@receiver(post_save, sender=Letting)
def payment_schedule(sender, **kwargs):
    if kwargs.get("created"):
        instance = kwargs.get("instance")

        # Create Schedule for service charge
        PaymentSchedule.objects.create(
            letting=instance,
            amount_due=instance.service_charge,
            payment_status=False,
            payment_cycle="Annual",
            tag="Service Charge",
        )

        # Create Schedule for Rent
        instance.create_payment_schedule(
            instance.schedule_type, instance.cost.amount, instance.start_date, instance.end_date.add(days=1)
        )


@receiver(post_save, sender=User)
def send_registration_email(sender, **kwargs):
    if kwargs.get("created"):
        instance = kwargs.get("instance")
        subject = "Pyale Properties Tenant Portal"
        message = f"""Dear {instance.first_name}, <br/> <br/> We are happy 
        to introduce you to our Tenant Portal. Within the tenant portal you can: <ul><li>Pay Electricity Bills
        </li><li>Review Documents related to your Tenancy</li><li>Contact us with any issues you may have 
        regarding your tenancy</li><li>And much more</li></ul>. <br/>To access this portal, 
        Visit <a href="">http://pyaleproperties.com/login</a> and login with the your email and temporary 
        password shown below. You'll prompted to change this password when you login. <br/>
        <br/> Email: {instance.email}<br/> Password: {instance._temp_password}. <br/>Do not hesitate to contact us
        at support@pyaleproperties.com, if you have any issues."""
        plain_message = strip_tags(message)

        send_mail(
            subject=subject,
            message=plain_message,
            from_email=EMAIL_HOST_USER,
            recipient_list=[instance.email],
            html_message=message,
        )


@receiver(reset_password_token_created)
def password_reset_token_created(sender, reset_password_token, *args, **kwargs):
    """
    Handles password reset tokens
    When a token is created, an e-mail needs to be sent to the user
    :param sender:
    :param reset_password_token:
    :param args:
    :param kwargs:
    :return:
    """
    # send an e-mail to the user
    context = {
        "host": LOCAL_HOST,
        "current_user": reset_password_token.user,
        "email": reset_password_token.user.email,
        "reset_password_url": "{}?token={}".format("password_reset", reset_password_token.key),
    }

    # render email text
    email_html_message = render_to_string("email/user_reset_password.html", context)
    email_plaintext_message = render_to_string("email/user_reset_password.txt", context)

    msg = EmailMultiAlternatives(
        # title:
        "Pyale Properties Tenant Portal Password Reset",
        # message:
        email_plaintext_message,
        # from:
        EMAIL_HOST_USER,
        # to:
        [reset_password_token.user.email],
    )
    msg.attach_alternative(email_html_message, "text/html")
    msg.send()
