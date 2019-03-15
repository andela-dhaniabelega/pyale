from django.contrib.auth import authenticate, get_user_model
from django.utils.translation import ugettext_lazy as _

from rest_framework import serializers, exceptions
from rest_framework_jwt.settings import api_settings

from core import models

User = get_user_model()
jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER


class UserRegisterSerializer(serializers.ModelSerializer):
    """
    Serializer to register a new user
    """

    def validate(self, attrs):
        instance = User(**attrs)
        instance.clean()
        return attrs

    def create(self, validated_data):
        instance = self.Meta.model(**validated_data)
        if all(validated_data.values()):
            password = validated_data.pop("password", None)
            instance.set_password(password)
        instance.save()
        return instance

    class Meta:
        model = User
        fields = ("id", "first_name", "last_name", "email")
        extra_kwargs = {"password": {"write_only": True}}


class UserLoginSerializer(serializers.Serializer):
    """
    Serializer used to validate an email and password
    """

    email = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):

        credentials = {"email": attrs.get("email"), "password": attrs.get("password")}

        if all(credentials.values()):
            user = authenticate(**credentials)

            if user:
                if not user.is_active:
                    msg = "User account disabled"
                    raise serializers.ValidationError(msg)

                payload = jwt_payload_handler(user)
                token = jwt_encode_handler(payload)
                return {
                    "user": {
                        "id": user.id,
                        "email": user.email,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                    },
                    "token": token,
                }
            else:
                msg = "Incorrect username or password"
                raise serializers.ValidationError(msg)
        else:
            msg = "Username and Password are required"
            raise serializers.ValidationError(msg)


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    password = serializers.CharField(style={"input_type": "password"})
    is_previously_logged_in = serializers.BooleanField(default=False)

    def _validate_username_email(self, username, email, password):
        user = None

        if email and password:
            user = authenticate(email=email, password=password)
        elif username and password:
            user = authenticate(username=username, password=password)
        else:
            msg = _('Must include either "username" or "email" and "password".')
            raise exceptions.ValidationError(msg)

        if user.last_login is not None:
            user.is_previously_logged_in = True
        return user

    def validate(self, attrs):
        username = attrs.get("username")
        email = attrs.get("email")
        password = attrs.get("password")

        user = None

        if email:
            try:
                username = User.objects.get(email__iexact=email).get_username()
            except User.DoesNotExist:
                pass

        if username:
            user = self._validate_username_email(username, "", password)

        # Did we get back an active user?
        if user:
            if not user.is_active:
                msg = _("User account is disabled.")
                raise exceptions.ValidationError(msg)
        else:
            msg = _("Unable to log in with provided credentials.")
            raise exceptions.ValidationError(msg)

        attrs["user"] = user
        return attrs


class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.PropertyImage
        fields = "__all__"


class PropertySerializer(serializers.ModelSerializer):
    property_images = PropertyImageSerializer(read_only=True, many=True)

    class Meta:
        model = models.Property
        fields = (
            "id",
            "category",
            "current_rental_value",
            "description",
            "specs",
            "name",
            "location",
            "property_images",
        )


class TenantDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TenantDocument
        fields = ("id", "document", "admin_only_access", "date_created", "date_modified", "name", "tenant")


class PaymentScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.PaymentSchedule
        fields = "__all__"


class LettingSerializer(serializers.ModelSerializer):
    payment_schedules = PaymentScheduleSerializer(read_only=True, many=True)

    class Meta:
        model = models.Letting
        fields = "__all__"


class BillsSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Bills
        fields = "__all__"


class UserDetailsSerializer(serializers.ModelSerializer):
    """
    Serializer to return existing user details.
    """

    class Meta:
        model = User
        fields = ("id", "first_name", "last_name", "email", "password", "is_previously_logged_in")


class EmailChangeSerializer(serializers.ModelSerializer):
    """
    Serializer to change user email.
    """

    class Meta:
        model = User
        fields = ("email",)
