from django.urls import path
from apps.payment import views
urlpatterns = [
    path('payments/', views.PaymentListCreate.as_view(), name='payments_list_create'),
    path('payments/<uuid:pk>', views.PaymentDetails.as_view(), name='payments_details'),
    ]