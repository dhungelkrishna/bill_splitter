from django.shortcuts import render
from .serializers import GroupSerializer
from rest_framework import generics
from .models import Group
from rest_framework.permissions import AllowAny, IsAuthenticated
from bill_splitter.pagination import CustomPagination
from apps.group_user.models import GroupUser


class GroupListCreate(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    # queryset = Group.objects.all().order_by('-created_at')
    serializer_class = GroupSerializer
    lookup_field = 'id'
    pagination_class = CustomPagination

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return Group.objects.filter(group_members__user=user)
        return Group.objects.none



class GroupDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    lookup_field = 'id'

    def destroy(self, request, *args, **kwargs):
        ############################################
        # check wheather the all payment cleared or not.
        return super().destroy(request, *args, **kwargs)
    
    def perform_update(self, serializer):
        serializer.save(updated_by = self.request.user)