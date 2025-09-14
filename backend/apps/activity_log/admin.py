from django.contrib import admin
from .models import ActivityLog
@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'action_type', 'content_object', 'timestamp')
