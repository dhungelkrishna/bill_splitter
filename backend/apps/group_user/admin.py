from django.contrib import admin
from apps.group_user.models import GroupUser

@admin.register(GroupUser)
class GroupUserAdmin(admin.ModelAdmin):
    list_display = ['id','user','group']
    search_fields = ['id']
    
