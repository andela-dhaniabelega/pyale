from django.core.mail import send_mail, EmailMultiAlternatives
from django.shortcuts import get_object_or_404
from rest_framework import status, generics, permissions
from rest_framework.mixins import UpdateModelMixin
from rest_framework.response import Response
from rest_framework.views import APIView
from core.api import serializers
from core import models
from core.utils import IsSuperUser


class PropertyList(generics.ListAPIView):
    """
    Create New Property or List Existing Properties
    """

    queryset = models.Property.objects.all()
    serializer_class = serializers.PropertySerializer
    permission_classes = ()


class PropertyDetails(generics.RetrieveAPIView):
    """
    Retrieve, Update or Destroy a given property
    """

    serializer_class = serializers.PropertySerializer
    permission_classes = ()

    def get_object(self):
        pk = self.kwargs.get("pk")
        return models.Property.objects.get(pk=pk)


class TenantDocumentList(generics.ListAPIView):
    model = models.TenantDocument
    serializer_class = serializers.TenantDocumentSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        pk = self.request.user.id
        return models.TenantDocument.objects.filter(tenant_id=pk, admin_only_access=False)


class TenantBillsList(generics.ListAPIView):
    model = models.Letting
    serializer_class = serializers.BillsSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        pk = self.request.user.id
        return models.Bills.objects.filter(tenant__id=pk)


class TenantBillsUpdate(generics.UpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = serializers.TenantBillsUpdateSerializer

    def get_queryset(self):
        bill_id = self.kwargs.get("pk")
        queryset = models.Bills.objects.filter(id=bill_id)
        return queryset


class EmailChange(generics.UpdateAPIView):
    serializer_class = serializers.EmailChangeSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user_id = self.kwargs.get("pk")
        queryset = models.User.objects.filter(id=user_id)
        return queryset


class PropertyFilter(generics.ListAPIView):
    serializer_class = serializers.PropertySerializer
    permission_classes = ()

    def get_queryset(self):
        categories = self.request.query_params.get("categories", None).split(",")
        location = self.request.query_params.get("location", None)

        if categories and "" not in categories:
            if location and location != "all":
                return models.Property.objects.filter(category__in=categories, location__exact=location)
            else:
                return models.Property.objects.filter(category__in=categories)
        elif location and location != "all":
            return models.Property.objects.filter(location=location)

        return models.Property.objects.all()


class TenantSupport(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        from_email = request.data.get("email")
        message = request.data.get("message")
        first_name = request.data.get("first_name")
        last_name = request.data.get("last_name")
        subject = request.data.get("subject")

        msg = EmailMultiAlternatives(
            subject=f"Support Request from {first_name} {last_name}: " + subject,
            body=message,
            from_email=from_email,
            to=["support@pyaleproperties.com"],
            reply_to=[from_email],
        )
        try:
            msg.send()
        except Exception as e:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR, data=e)
        else:
            return Response(data="Success", status=status.HTTP_200_OK)


class TenantEnquiry(APIView):
    permission_classes = ()

    def post(self, request, format=None):
        from_email = request.data.get("email")
        message = request.data.get("message")
        name = request.data.get("name")
        subject = request.data.get("subject")

        msg = EmailMultiAlternatives(
            subject=f"Enquiry from {name}: " + subject,
            body=message,
            from_email=from_email,
            to=["info@pyaleproperties.com"],
            reply_to=[from_email],
        )
        try:
            msg.send()
        except Exception as e:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR, data=e)
        else:
            return Response(data="Success", status=status.HTTP_200_OK)


class TenantLetting(generics.ListAPIView):
    model = models.Letting
    serializer_class = serializers.TenantLettingSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        pk = self.request.user.id
        return models.Letting.objects.filter(tenant_id=pk)
