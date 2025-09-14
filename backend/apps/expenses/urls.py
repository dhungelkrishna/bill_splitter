from django.urls import path
from apps.expenses import views
urlpatterns = [
    path('expenses/', views.ExpenseListCreate.as_view(), name='expenses_list_create'),
    path('expenses/<uuid:pk>', views.ExpenseDetails.as_view(), name='expenses_details'),
    ]