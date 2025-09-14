from django.contrib import admin
from apps.expenses.models import Expense

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ['id','title','paid_by','created_at']
    search_fields = ['title','paid_by']
    
