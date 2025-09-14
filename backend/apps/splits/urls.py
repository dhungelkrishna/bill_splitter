from django.urls import path
from apps.splits import views
urlpatterns = [
    path('split/', views.SplitListCreate.as_view(), name='split_list_create'),
    path('split/<uuid:pk>', views.SplitDetails.as_view(), name='split_details'),
    ]