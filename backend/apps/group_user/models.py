from django.shortcuts import render
from django.db import models
import uuid
from apps.user.models import CustomUser
from apps.group.models import Group

class GroupUser(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(CustomUser,on_delete=models.SET_NULL, null=True, blank=True, related_name="group_memberships")
    group = models.ForeignKey(Group,on_delete=models.SET_NULL, null=True, blank=True, related_name="group_members")
    joined_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user}, {self.group}"
    
    class Meta:
        unique_together = ('group','user')