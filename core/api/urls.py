from django.urls import path, include

from core.api import views

urlpatterns = [
    path("user/register/", views.UserRegister.as_view()),
    path("user/login/", views.UserLogin.as_view()),
    path("properties/", views.PropertyList.as_view()),
    path("properties/<int:pk>/", views.PropertyDetails.as_view()),
    path('rest-auth/', include('rest_auth.urls'))
]
