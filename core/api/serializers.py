from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers
from rest_framework_jwt.settings import api_settings

from core.models import Property

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
            password = validated_data.pop('password', None)
            instance.set_password(password)
        instance.save()
        return instance

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email', 'password',)
        extra_kwargs = {'password': {'write_only': True}}


class UserLoginSerializer(serializers.Serializer):
    """
    Serializer used to validate an email and password
    """
    email = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):

        credentials = {
            'email': attrs.get('email'),
            'password': attrs.get('password')
        }

        if all(credentials.values()):
            user = authenticate(**credentials)

            if user:
                if not user.is_active:
                    msg = 'User account disabled'
                    raise serializers.ValidationError(msg)

                payload = jwt_payload_handler(user)
                token = jwt_encode_handler(payload)
                return {
                    'user': {
                        'id': user.id,
                        'email': user.email,
                        'first_name': user.first_name,
                        'last_name': user.last_name
                    },
                    'token': token
                }
            else:
                msg = 'Incorrect username or password'
                raise serializers.ValidationError(msg)
        else:
            msg = 'Username and Password are required'
            raise serializers.ValidationError(msg)


class PropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = '__all__'
