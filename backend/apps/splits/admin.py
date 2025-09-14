from django.contrib import admin
from apps.splits.models import Split

@admin.register(Split)
class SplitAdmin(admin.ModelAdmin):
    list_display = ['id','user','amount_owed','amount_paid', 'expense']
    search_fields = ['user']
    
    
