from django.shortcuts import render
from rest_framework import generics
from apps.expenses.serializers import ExpenseSerializer
from apps.payment.serializers import PaymentSerializer
from apps.expenses.models import Expense
from apps.payment.models import Payment


class PaymentListCreate(generics.ListCreateAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    lookup_field = 'id'


class PaymentDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    lookup_field = 'id'

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


