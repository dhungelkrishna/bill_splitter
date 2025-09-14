from django.urls import path
from apps.activity_log import views
urlpatterns = [
    path('activitylog/', views.ActivityLogList.as_view(), name='activitylog_list_create'),
    path('activitylog/<uuid:pk>', views.ActivityLogDetails.as_view(), name='activitylog_details'),
    path('activitylog/group/<uuid:group_id>/', views.GroupActivityLogList.as_view(), name='group_activitylog_list'),
    ]