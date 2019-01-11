from datetime import datetime

from django.http import Http404
from rest_framework import permissions
import pendulum


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


# def get_quarter_from_date_range(date_to, date_from=None):
#     result = []
#     if date_from is None:
#         date_from = datetime.now()
#     quarter_to = (date_to.month / 4) + 1
#     for year in range(date_from.year, date_to.year + 1):
#         for quarter in range(1, 5):
#             if date_from.year == year and quarter <= quarter_to:
#                 continue
#             if date_to.year == year and quarter > quarter_to:
#                 break
#             result.append([quarter, year])
#     return result

def create_pendulum_date(start_date, end_date):
    start_date = pendulum.datetime(start_date.year, start_date.month, start_date.day)
    end_date = pendulum.datetime(end_date.year, end_date.month, end_date.day)

    return start_date, end_date


def compute_period_from_date_range(start_date, end_date, period=None):
    """
    Computes the quarter or month periods within a date range
    :param start_date:
    :param end_date:
    :param period:
    :return: A list of tuples containing quarters
    """
    periods = {
        'quarter': 3,
        'month': 1
    }
    dates = []
    start_date, end_date = create_pendulum_date(start_date, end_date)

    while start_date < end_date:
        new_date = start_date.add(months=periods[period])
        dates.append((start_date.date(), new_date.subtract(days=1).date()))  # End dt should be a day less than start dt
        start_date = new_date

    return dates


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


def get_years_cycles_from_date_range(start_date, end_date):
    start_date = pendulum.datetime(start_date.year, start_date.month, start_date.day)
    end_date = pendulum.datetime(end_date.year, end_date.month, end_date.day)
    period = end_date - start_date

    # TODO: Move this to a separate function
    cycles = []
    while start_date < end_date:
        new_start = start_date.add(years=1)
        cycles.append(f"{start_date.date()} to {new_start.date()}")
        start_date = new_start

    return period, cycles
