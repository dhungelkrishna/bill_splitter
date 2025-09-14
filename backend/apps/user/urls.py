from django.urls import path
from apps.user import views
urlpatterns = [
    path('users/', views.UserListCreate.as_view(), name='user_list_create'),
    path('users/<uuid:id>', views.UserDetails.as_view(), name='user_details'),
    path('users/register/', views.RegisterView.as_view(), name='register_user'),
    ]