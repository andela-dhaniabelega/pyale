import cloudinary
import cloudinary.uploader
import cloudinary.api
from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_jwt.settings import api_settings

from core.api.serializers import UserRegisterSerializer, UserLoginSerializer, PropertySerializer, \
    PropertyImageSerializer
from core.models import Property, PropertyImage
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
    permission_classes = (permissions.IsAuthenticated, IsSuperUser)


class PropertyDetails(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, Update or Destroy a given property
    """
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = (permissions.IsAuthenticated, IsSuperUser,)

    def destroy(self, request, *args, **kwargs):
        obj = Property.objects.get(pk=kwargs['pk'])
        obj.is_active = False
        obj.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


# class PropertyImageList(generics.ListCreateAPIView):
#     """
#     Add or List Property Images
#     """
#     queryset = PropertyImage.objects.all()
#     serializer_class = PropertyImageSerializer
#     permission_classes = (permissions.IsAuthenticated, IsSuperUser,)
#
#     def create(self, request, *args, **kwargs):
#         serializer = PropertyImageSerializer(data=request.data)
#         if serializer.is_valid():
#             res = cloudinary.uploader.upload(request.FILES['file'])
#             serializer.save(image=res["url"])
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         else:
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#
#
# class PropertyImageDetails(generics.RetrieveUpdateDestroyAPIView):
#     queryset = PropertyImage.objects.all()
#     serializer_class = PropertyImageSerializer
#     permission_classes = (permissions.IsAuthenticated, IsSuperUser,)
#
#     def destroy(self, request, *args, **kwargs):
#         obj = PropertyImage.objects.get(pk=kwargs['pk'])
#         public_id = self.get_public_id_from_url(obj['url'])
#         cloudinary.uploader.destroy(public_id)
#         obj.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)
#
#     # def partial_update(self, request, *args, **kwargs):
#     #     obj = PropertyImage.objects.get(pk=kwargs['pk'])
#     #     serializer = PropertyImageSerializer(obj, data=request.data, partial=True)
#     #     if serializer.is_valid():
#     #         if 'url' in request.data.keys():
#     #             res = cloudinary.uploader.upload(request.FILES['file'])
#     #             serializer.save(image=res["url"])
#     #         else:
#     #             serializer.save()
#     #         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     #     else:
#     #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#
#     def get_public_id_from_url(self, url):
#         public_id_extension = url.split("/")[-1]
#         public_id = public_id_extension.split(".")[0]
#         return public_id

