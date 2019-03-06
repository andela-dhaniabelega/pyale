from django.shortcuts import get_object_or_404
from rest_framework import status, generics, permissions
from rest_framework.response import Response

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
        pk = self.kwargs.get('pk')
        return models.Property.objects.get(pk=pk)


class TenantDocumentList(generics.ListAPIView):
    model = models.TenantDocument
    serializer_class = serializers.TenantDocumentSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        pk = self.request.user.id
        return models.TenantDocument.objects.filter(tenant_id=pk, admin_only_access=False)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        for item in queryset:
            item.document = item.document.url

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class EmailChange(generics.UpdateAPIView):
    serializer_class = serializers.EmailChangeSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user_id = self.kwargs.get('pk')
        queryset = models.User.objects.filter(id=user_id)
        return queryset


class PropertyFilter(generics.ListAPIView):
    serializer_class = serializers.PropertySerializer
    permission_classes = ()

    def get_queryset(self):
        categories = self.request.query_params.get('categories', None).split(',')
        location = self.request.query_params.get('location', None)

        if categories and '' not in categories:
            if location and location != 'all':
                return models.Property.objects.filter(category__in=categories, location__exact=location)
            else:
                return models.Property.objects.filter(category__in=categories)
        elif location and location != 'all':
                return models.Property.objects.filter(location=location)

        return models.Property.objects.all()
