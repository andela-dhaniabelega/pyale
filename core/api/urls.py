from django.urls import path

from core.api import views

urlpatterns = [
    path('user/register/', views.UserRegister.as_view()),
    path('user/login/', views.UserLogin.as_view())
]
