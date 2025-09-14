from django.shortcuts import render
from rest_framework import generics
from apps.splits.serializers import SplitSerializer
from apps.expenses.models import Expense
from apps.splits.models import Split


class SplitListCreate(generics.ListCreateAPIView):
    queryset = Split.objects.all()
    serializer_class = SplitSerializer
    lookup_field = 'id'


class SplitDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Split.objects.all()
    serializer_class = SplitSerializer
    lookup_field = 'id'

    def destroy(self, request, *args, **kwargs):
        # my custom logics. 
        return super().destroy(request, *args, **kwargs)
