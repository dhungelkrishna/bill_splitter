from django.urls import path
from apps.group import views
urlpatterns = [
    path('groups/', views.GroupListCreate.as_view(), name='group_list_create'),
    path('groups/<uuid:id>', views.GroupDetails.as_view(), name='group_details'),
    ]