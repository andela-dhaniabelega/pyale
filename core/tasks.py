import logging

from celery.task import task
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
import pendulum

from core import models
from pyale.settings import AUTOMATED_EMAIL_ADDRESS

log = logging.getLogger(__name__)


@task(name="reminder")
def send_end_of_letting_reminder():
    log.info("Sending email")
    for letting in models.Letting.objects.all():
        letting_end_date = pendulum.date(
            year=letting.end_date.year, month=letting.end_date.month, day=letting.end_date.day
        )
        if letting_end_date.diff().in_weeks() == 2:
            tenant_email = letting.tenant.email
            tenant_name = " ".join([letting.tenant.first_name, letting.tenant.last_name])
            property_name = letting.realty.name
            send_email_to_tenant(tenant_email, tenant_name, property_name, letting_end_date)
            send_email_to_admin(tenant_name, tenant_email, property_name, letting_end_date)


# TODO: Create a util for sending email to avoid repetitive code. This util will also be used in models.py
def send_email_to_tenant(email, tenant_name, property_name, end_date):
    context = {"tenant_name": tenant_name, "property_name": property_name, "end_date": end_date}

    # render email text
    email_html_message = render_to_string("email/letting_expiration_reminder.html", context)
    email_plaintext_message = render_to_string("email/letting_expiration_reminder.txt", context)

    msg = EmailMultiAlternatives(
        # title:
        "Your Tenancy Expires in Two Weeks!",
        # message:
        email_plaintext_message,
        # from:
        AUTOMATED_EMAIL_ADDRESS,
        # to:
        [email],
    )
    msg.attach_alternative(email_html_message, "text/html")
    msg.send()


def send_email_to_admin(tenant_name, email, property_name, end_date):
    context = {"tenant_name": tenant_name, "email": email, "property_name": property_name, "end_date": end_date}

    # render email text
    email_html_message = render_to_string("email/letting_expiration_reminder_admin.html", context)
    email_plaintext_message = render_to_string("email/letting_expiration_reminder_admin.txt", context)

    msg = EmailMultiAlternatives(
        # title:
        "Tenancy Expiration Reminder",
        # message:
        email_plaintext_message,
        # from:
        "Pyale Properties <donotreply@pyaleproperties.com>",
        # to:
        ["info@pyaleproperties.com"],
    )
    msg.attach_alternative(email_html_message, "text/html")
    msg.send()
