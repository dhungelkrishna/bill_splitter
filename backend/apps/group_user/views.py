from django.shortcuts import render
from apps.group_user.serializers import GroupUserSerializer
from rest_framework import generics
from apps.group_user.models import GroupUser
from rest_framework.exceptions import ValidationError

class GroupUserCreate(generics.CreateAPIView):
    queryset = GroupUser.objects.all()
    serializer_class = GroupUserSerializer
    lookup_field = 'id'


    def perform_create(self, serializer):
        serializer.save(user =  self.request.user)


class GroupUserList(generics.ListAPIView):
    queryset = GroupUser.objects.all()
    serializer_class = GroupUserSerializer
    lookup_field = 'id'


    def get_queryset(self):
        group = self.kwargs.get("group_id")
        return GroupUser.objects.filter(group=group)




class GroupUserDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = GroupUser.objects.all()
    serializer_class = GroupUserSerializer
    lookup_field = 'id'

    def destroy(self, request, *args, **kwargs):
        ############################################3
        # check wheather the all payment cleared or not.

        return super().destroy(request, *args, **kwargs)



