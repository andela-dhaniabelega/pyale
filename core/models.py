import re

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.exceptions import ValidationError
from django.db import models


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
