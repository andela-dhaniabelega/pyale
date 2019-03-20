from django.urls import path, include

from core.api import views

urlpatterns = [
    path("properties/", views.PropertyList.as_view()),
    path("properties/<int:pk>/", views.PropertyDetails.as_view()),
    path("properties/filter/", views.PropertyFilter.as_view()),
    path("tenant/documents/", views.TenantDocumentList.as_view()),
    path("tenant/<int:pk>/bills/", views.TenantBillsList.as_view()),
    path("tenant/<int:pk>/bills/update/", views.TenantBillsUpdate.as_view()),
    path("tenant/<int:pk>/lettings/", views.TenantLetting.as_view()),
    path("tenant/support/", views.TenantSupport.as_view()),
    path("tenant/enquiry/", views.TenantEnquiry.as_view()),
    path("tenant/<int:pk>/email/change/", views.EmailChange.as_view()),
    path("rest-auth/", include("rest_auth.urls")),
    path("password_reset/", include("django_rest_passwordreset.urls", namespace="password_reset")),
]
