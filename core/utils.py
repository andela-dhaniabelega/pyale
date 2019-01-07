from datetime import datetime

from django.http import Http404
from rest_framework import permissions


class IsSuperUser(permissions.BasePermission):
    """
    Custom Permission to grant api access to only super users
    """

    def has_permission(self, request, view):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the snippet.
        return request.user.is_superuser


def get_quarter_from_date_range(date_to, date_from=None):
    result = []
    if date_from is None:
        date_from = datetime.now()
    quarter_to = (date_to.month / 4) + 1
    for year in range(date_from.year, date_to.year + 1):
        for quarter in range(1, 5):
            if date_from.year == year and quarter <= quarter_to:
                continue
            if date_to.year == year and quarter > quarter_to:
                break
            result.append([quarter, year])
    return result


def get_single_object(idx, obj_type):
    """
    Return a QuerySet object
    :param idx: Object ID
    :param obj_type: The Queryset Class
    :return: Queryset object
    """
    try:
        return obj_type.objects.get(id=idx)
    except obj_type.DoesNotExist:
        raise Http404


def get_public_id_from_url(url):
    public_id_extension = url.split("/")[-1]
    public_id = public_id_extension.split(".")[0]
    return public_id
