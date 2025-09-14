from django.contrib import admin
from apps.balance.models import Balance

@admin.register(Balance)
class BalanceAdmin(admin.ModelAdmin):
    list_display = ['id','debtor','creditor','group','amount']
    search_fields = ['debtor','creditor','group']
    
