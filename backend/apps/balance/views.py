from django.shortcuts import render
from rest_framework import generics, filters
from apps.expenses.serializers import ExpenseSerializer
from apps.balance.serializers import BalanceSerializer
from apps.expenses.models import Expense
from apps.balance.models import Balance
from django_filters.rest_framework import DjangoFilterBackend, RangeFilter


class BalanceListCreate(generics.ListCreateAPIView):
    queryset = Balance.objects.all()
    serializer_class = BalanceSerializer
    lookup_field = 'id'

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter ]
    filterset_fields = ['group','debtor','creditor']
    search_fields = ['debtor__firstname','creditor__firstname','group__name']
    ordering_field = ['amount','updated_at']
    #default ordering fields. //-use gareko chai descending ordering ko lagi ho. 
    ordering = ['-updated_at']




class BalanceDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Balance.objects.all()
    serializer_class = BalanceSerializer
    lookup_field = 'id'

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

