from django.urls import path
from apps.balance import views
urlpatterns = [
    path('balances/', views.BalanceListCreate.as_view(), name='balances_list_create'),
    path('balances/<uuid:pk>', views.BalanceDetails.as_view(), name='balances_details'),
    ]