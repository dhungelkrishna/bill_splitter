from django.shortcuts import render
from rest_framework import generics
from apps.expenses.serializers import ExpenseSerializer
from apps.expenses.models import Expense
from bill_splitter.pagination import CustomPagination


class ExpenseListCreate(generics.ListCreateAPIView):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    lookup_field = 'id'
    pagination_class = CustomPagination



class ExpenseDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    lookup_field = 'id'

    def destroy(self, request, *args, **kwargs):

        # checking logics here. logic apply garena vane. super delete function run hunxa. 
        # check wheather the all payment cleared or not.

        return super().destroy(request, *args, **kwargs)

        # expense update delete post ko logics haru lagaunu paryo. 


