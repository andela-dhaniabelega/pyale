import logging
import re

import cloudinary
import cloudinary.uploader
from dirtyfields import DirtyFieldsMixin
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.dispatch import receiver
from django.db.models.signals import post_save
from cloudinary.models import CloudinaryField
import pendulum
from django.utils.html import strip_tags
from djmoney.models.fields import MoneyField

from core.utils import (
    get_public_id_from_url,
    get_years_cycles_from_date_range,
    compute_period_from_date_range,
    generate_random_string,
)
from pyale import settings
from pyale.settings import EMAIL_HOST_USER

logger = logging.getLogger(__name__)
ALLOWED_CONTENT_TYPES = ("application/pdf",)
ALLOWED_IMAGE_TYPES = ("image/png", "image/jpg", "image/jpeg", "image/gif", "image/svg")


class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, email, first_name, last_name, password=None):
        user = self.model(
            email=self.normalize_email(email),
            first_name=first_name,
            last_name=last_name,
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
        self.password = generate_random_string()
        super().save()

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Tenants"


class Property(models.Model):
    PROPERTY_CATEGORIES = (("Residential", "residential"), ("Commercial", "commercial"))

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

    def __str__(self):
        return self.name

    def save(
        self, force_insert=False, force_update=False, using=None, update_fields=None
    ):
        self.year = pendulum.now(tz="Africa/Lagos").year

        if self.rental_revenue and self.id:
            running_cost = [
                running_cost.amount
                for running_cost in PropertyRunningCosts.objects.filter(
                    realty_id=self.id
                )
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
    amount_spent = MoneyField(
        max_digits=19, decimal_places=2, default_currency=settings.DEFAULT_CURRENCY
    )

    def __str__(self):
        return self.realty.name

    class Meta:
        verbose_name = "Property Running Cost"
        verbose_name_plural = "Property Running Costs"


class PropertyImage(DirtyFieldsMixin, models.Model):
    realty = models.ForeignKey(
        Property, on_delete=models.CASCADE, related_name="property_images"
    )
    image = CloudinaryField("image")
    tag = models.CharField(
        max_length=255, unique=True, help_text="A unique name for this image"
    )

    def __str__(self):
        return self.tag

    def save(
        self, force_insert=False, force_update=False, using=None, update_fields=None
    ):
        self.full_clean()
        if self._state.adding:
            new_image = cloudinary.uploader.upload(
                self.image, use_filename=True, folder="property_images/"
            )
            self.image = new_image["url"]
        else:
            modified_fields = self.get_dirty_fields()
            if "image" in modified_fields:
                # Remove existing image from Cloudinary
                public_id = get_public_id_from_url(self._original_state["image"].url)
                cloudinary.uploader.destroy(public_id)

                # Save new Image
                new_image = cloudinary.uploader.upload(self.image)
                self.image = new_image["url"]
        super().save()

    def clean(self):
        if self.image.content_type not in ALLOWED_IMAGE_TYPES:
            raise ValidationError(
                {
                    "image": "Unsupported Image Format. Supported: .jpg, .jpeg, .png, .gif, .svg"
                }
            )
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

    def save(
        self, force_insert=False, force_update=False, using=None, update_fields=None
    ):
        self.full_clean()
        if self._state.adding:
            new_document = cloudinary.uploader.upload(
                self.document, use_filename=True, folder="property_documents/"
            )
            self.document = new_document["url"]
        else:
            modified_fields = self.get_dirty_fields()
            if "document" in modified_fields:
                # Remove existing image from Cloudinary
                original_document = self._original_state["document"]
                public_id = get_public_id_from_url(original_document.url)
                cloudinary.uploader.destroy(
                    f"{public_id}.{original_document.format}", resource_type="raw"
                )

                # Save new Document
                new_document = cloudinary.uploader.upload(
                    self.document, resource_type="raw"
                )
                self.document = new_document["url"]
        super().save()

    def clean(self):
        if self.document.content_type not in ALLOWED_CONTENT_TYPES:
            raise ValidationError(
                {"document": "Only PDF documents are allowed at this time"}
            )
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

    def save(
        self, force_insert=False, force_update=False, using=None, update_fields=None
    ):
        self.full_clean()
        if self._state.adding:
            new_document = cloudinary.uploader.upload(
                self.document, use_filename=True, folder="tenant_documents/"
            )
            self.document = new_document["url"]
        else:
            modified_fields = self.get_dirty_fields()
            if "document" in modified_fields:
                # Remove existing image from Cloudinary
                original_document = self._original_state["document"]
                public_id = get_public_id_from_url(original_document.url)
                cloudinary.uploader.destroy(
                    f"{public_id}.{original_document.format}", resource_type="raw"
                )

                # Save new Document
                new_document = cloudinary.uploader.upload(
                    self.document, resource_type="raw"
                )
                self.document = f"{new_document['url']}.{new_document.format}"
        super().save()

    def clean(self):
        if self.document.content_type not in ALLOWED_CONTENT_TYPES:
            raise ValidationError(
                {"document": "Only PDF documents are allowed at this time"}
            )
        if self.document.size > 1_000_000:
            raise ValidationError({"document": "Maximum file size allowed is 10MB"})

    def delete(self, using=None, keep_parents=False):
        public_id = get_public_id_from_url(self.document.url)
        cloudinary.uploader.destroy(
            f"{public_id}.{self.document.format}", resource_type="raw"
        )
        super().delete()

    class Meta:
        verbose_name = "Tenant Document"
        verbose_name_plural = "Tenant Documents"


class Letting(DirtyFieldsMixin, models.Model):
    PAYMENT_SCHEDULE_TYPES = (
        ("Annual", "annual"),
        ("Quarterly", "quarterly"),
        ("Monthly", "monthly"),
    )
    TOTAL_LETTING_COST = "total_letting_cost"
    LETTING_START_DATE = "letting_start_date"
    LETTING_DURATION = "letting_duration"
    SCHEDULE_TYPE = "schedule_type"
    ANNUAL = "annual"
    QUARTERLY = "quarterly"
    MONTHLY = "monthly"
    MAX_LETTING_DURATION = 5

    tenant = models.ForeignKey(User, on_delete=models.CASCADE)
    realty = models.ForeignKey(Property, on_delete=models.CASCADE)
    letting_type = models.CharField(max_length=50, default="Rent")
    letting_duration = models.IntegerField(
        default=0, help_text="Letting period (must be in years)"
    )
    letting_start_date = models.DateField()
    letting_end_date = models.DateField(editable=False)
    deposit = MoneyField(
        max_digits=19,
        decimal_places=2,
        default_currency=settings.DEFAULT_CURRENCY,
        help_text="Deposit for this letting (in Naira)",
    )
    deposit_refunded = models.BooleanField(null=True, blank=True)
    deposit_refund_date = models.DateField(null=True, blank=True)
    total_letting_cost = MoneyField(
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
        max_length=100,
        help_text="Monthly, Quarterly or Annually",
        choices=PAYMENT_SCHEDULE_TYPES,
    )

    def __str__(self):
        return " ".join([self.tenant.first_name, self.tenant.last_name])

    def save(
        self, force_insert=False, force_update=False, using=None, update_fields=None
    ):
        self.clean()

        letting_start_date = pendulum.datetime(
            self.letting_start_date.year,
            self.letting_start_date.month,
            self.letting_start_date.day,
        )
        self.letting_end_date = (
            letting_start_date.add(years=self.letting_duration).subtract(days=1).date()
        )

        modified_fields = self.get_dirty_fields()
        fields_requiring_schedule_update = {
            self.TOTAL_LETTING_COST,
            self.LETTING_DURATION,
            self.SCHEDULE_TYPE,
        }

        if (
            any(field in fields_requiring_schedule_update for field in modified_fields)
            and self.id is not None
        ):
            if self.LETTING_START_DATE in modified_fields:
                raise ValidationError(
                    "You cannot edit the start date of an ongoing letting"
                )

            # Calculate new letting end date if duration is changed
            self.letting_end_date = (
                letting_start_date.add(years=self.letting_duration)
                .subtract(days=1)
                .date()
            )

            # Deactivate old schedule
            PaymentSchedule.objects.filter(letting_id=self.id).update(
                active_schedule=False
            )

            # Create new schedule
            self.create_payment_schedule(
                self.schedule_type,
                self.total_letting_cost.amount,
                self.letting_start_date,
                self.letting_end_date.add(days=1).date(),
            )
        super().save()

    def clean(self):
        super().clean_fields()
        letting_start_date = pendulum.datetime(
            self.letting_start_date.year,
            self.letting_start_date.month,
            self.letting_start_date.day,
        )

        current_date = pendulum.now().date()

        if letting_start_date.date() < current_date:
            raise ValidationError(
                {
                    "letting_start_date": "Letting start date cannot be earlier than current date:"
                }
            )

        if self.letting_duration > self.MAX_LETTING_DURATION:
            raise ValidationError(
                {
                    "letting_duration": "Maximum Letting Duration is {}".format(
                        self.MAX_LETTING_DURATION
                    )
                }
            )
        super().validate_unique()

    def create_payment_schedule(
        self, schedule_type, total_letting_cost, start_date, end_date
    ):
        payment_schedules = {
            "annual": self.create_annual_schedule,
            "quarterly": self.create_quarterly_schedule,
            "monthly": self.create_monthly_schedule,
        }
        payment_schedules[schedule_type.lower()](
            total_letting_cost, start_date, end_date
        )

    def create_annual_schedule(self, total_letting_cost, start_date, end_date):
        period, cycles = get_years_cycles_from_date_range(start_date, end_date)
        amount_per_year = total_letting_cost / period.years
        new_payment_schedule = [
            PaymentSchedule(
                letting_id=self.id,
                amount_due=amount_per_year,
                payment_status=False,
                payment_cycle=cycle,
            )
            for cycle in cycles
        ]
        PaymentSchedule.objects.bulk_create(new_payment_schedule)

    def create_quarterly_schedule(self, total_letting_cost, start_date, end_date):
        quarters = compute_period_from_date_range(
            start_date, end_date, period="quarter"
        )
        amount_per_quarter = total_letting_cost / len(quarters)
        new_payment_schedule = [
            PaymentSchedule(
                letting_id=self.id,
                amount_due=amount_per_quarter,
                payment_status=False,
                payment_cycle="{from_date} to {to_date}".format(
                    from_date=quarter[0], to_date=quarter[1]
                ),
            )
            for quarter in quarters
        ]
        PaymentSchedule.objects.bulk_create(new_payment_schedule)

    def create_monthly_schedule(self, total_letting_cost, start_date, end_date):
        months = compute_period_from_date_range(start_date, end_date, period="month")
        amount_per_month = total_letting_cost / len(months)
        new_payment_schedule = [
            PaymentSchedule(
                letting_id=self.id,
                amount_due=amount_per_month,
                payment_status=False,
                payment_cycle="{from_date} to {to_date}".format(
                    from_date=month[0], to_date=month[1]
                ),
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
        help_text="The amount to be paid per cycle e.g. the amount per month "
        "or per quarter (in Naira)",
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
            instance.schedule_type,
            instance.total_letting_cost.amount,
            instance.letting_start_date,
            instance.letting_end_date.add(days=1),
        )


@receiver(post_save, sender=User)
def send_registration_email(sender, **kwargs):
    if kwargs.get("created"):
        instance = kwargs.get("instance")
        subject = "Pyale Properties Tenant Portal"
        message = f"""Dear {instance.first_name}, Thank you for your business. <br/> <br/> We are happy 
        to introduce you to our Tenant Portal. Within the tenant portal you can: <ul><li>Pay Electricity Bills
        </li><li>Review Documents related to your Tenancy</li><li>Contact us with any issues you may have 
        regarding your tenancy</li><li>And much more</li></ul>. <br/>To access this portal, 
        Visit <a href="">http://pyaleproperties.com/login</a> and login with the your email and temporary 
        password shown below. You'll prompted to change this password when you login. <br/>
        <br/> Email: {instance.email}<br/> Password: {instance.password}. <br/>Do not hesitate to contact us
        at support@pyaleproperties.com, if you have any issues."""
        plain_message = strip_tags(message)

        send_mail(
            subject=subject,
            message=plain_message,
            from_email=EMAIL_HOST_USER,
            recipient_list=[instance.email],
            html_message=message,
        )
