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
            "active",
            "home_page"
        )


class TenantLettingSerializer(serializers.ModelSerializer):
    realty = PropertySerializer(read_only=True)

    class Meta:
        model = models.Letting
        fields = "__all__"


class TenantDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TenantDocument
        fields = ("id", "document", "admin_only_access", "date_created", "date_modified", "name", "tenant")


class PaymentScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.PaymentSchedule
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
        fields = (
            "id",
            "first_name",
            "last_name",
            "email",
            "is_previously_logged_in",
            "title",
            "middle_name",
            "maiden_name",
            "nationality",
            "gender",
            "telephone",
            "date_of_birth",
            "id_number",
            "mobile_number",
            "whatsapp_number",
            "previous_address_house_number",
            "previous_address_house_name",
            "previous_address_street",
            "previous_address_town",
            "previous_address_city",
            "previous_address_state",
            "previous_address_duration_of_stay",
            "employment_status",
            "job_title",
            "years_at_current_employment",
            "employer_name",
            "employer_contact_person",
            "employer_telephone",
            "employer_mobile",
            "employer_email",
            "next_of_kin_first_name",
            "next_of_kin_last_name",
            "next_of_kin_house_number",
            "next_of_kin_house_name",
            "next_of_kin_street",
            "next_of_kin_town",
            "next_of_kin_city",
            "next_of_kin_state",
            "next_of_kin_mobile_1",
            "next_of_kin_mobile_2",
            "next_of_kin_email",
            "next_of_kin_relationship_to_tenant",
            "referee_name",
            "referee_mobile_number_1",
            "referee_mobile_number_2",
            "referee_email",
            "referee_relationship_to_tenant",
        )


class EmailChangeSerializer(serializers.ModelSerializer):
    """
    Serializer to change user email.
    """

    class Meta:
        model = User
        fields = ("email",)


class TenantBillsUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Bills
        fields = (
            "payment_status",
            "transaction_date",
            "transaction_reference",
            "is_mobile",
            "bank",
            "card_type",
            "last4",
            "card_expiry_month",
            "card_expiry_year",
            "card_brand",
            "transaction_time",
            "transaction_id",
        )
