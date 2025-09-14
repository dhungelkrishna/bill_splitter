from django.urls import path
from apps.group_user import views
from .views import GroupUserCreate, GroupUserList
urlpatterns = [
    path('groupusers/', GroupUserCreate.as_view(), name='groupuser_create'),
    path('groupusers/<uuid:group_id>/', GroupUserList.as_view(), name='groupuser_list'),
    path('groupusers/<uuid:pk>', views.GroupUserDetails.as_view(), name='groupuser_details'),
    ]