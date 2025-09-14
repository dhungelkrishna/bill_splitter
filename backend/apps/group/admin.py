from django.contrib import admin
from apps.group.models import Group

@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ['id','name','created_by','created_at']
    search_fields = ['name','id']
    
