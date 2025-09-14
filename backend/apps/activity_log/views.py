from django.shortcuts import render
from rest_framework import generics
from .serializers import ActivityLogSerializer
from .models import ActivityLog
from apps.group.models import Group
from apps.expenses.models import Expense
from django.contrib.contenttypes.models import ContentType
from django.db import models


class ActivityLogList(generics.ListCreateAPIView):
    queryset = ActivityLog.objects.all()
    serializer_class = ActivityLogSerializer
    lookup_field = 'id'


class ActivityLogDetails(generics.RetrieveAPIView):
    queryset = ActivityLog.objects.all()
    serializer_class = ActivityLogSerializer
    lookup_field = 'id'

class GroupActivityLogList(generics.ListAPIView):
    serializer_class = ActivityLogSerializer

    def get_queryset(self):
        group_id = self.kwargs['group_id']
        # Get ContentTypes for Group and related models (e.g., Expense)
        group_content_type = ContentType.objects.get_for_model(Group)
        expense_content_type = ContentType.objects.get_for_model(Expense)

        # Filter ActivityLog entries for the group and its related expenses
        queryset = ActivityLog.objects.filter(
            models.Q(content_type=group_content_type, object_id=group_id) |
            models.Q(content_type=expense_content_type, object_id__in=Expense.objects.filter(group_id=group_id).values('id'))
        )
        return queryset.order_by('-timestamp')  # Order by timestamp, newest first