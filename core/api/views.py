from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_jwt.settings import api_settings

from core.api.serializers import UserRegisterSerializer, UserLoginSerializer, PropertySerializer
from core.models import Property
from core.utils import IsSuperUser


class UserRegister(APIView):
    """
    Creates and registers a new user
    :param
    :return
    """
    permission_classes = []
    serializer_class = UserRegisterSerializer

    def post(self, request, format=None):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
            jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
            user = serializer.save()
            payload = jwt_payload_handler(user)
            token = jwt_encode_handler(payload)
            data = {
                'user': serializer.data,
                'token': token
            }
            return Response(data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLogin(APIView):
    """
    Implements User Login
    """
    permission_classes = []

    def post(self, request, format=None):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PropertyList(generics.ListCreateAPIView):
    """
    Create New Property or List Existing Properties
    """
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = [permissions.IsAuthenticated, ]


class PropertyDetails(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, Update or Destroy a given property
    """
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = (permissions.IsAuthenticated, IsSuperUser,)

    def delete(self, request, *args, **kwargs):
        obj = Property.objects.get(pk=kwargs['pk'])
        obj.is_active = False
        obj.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
