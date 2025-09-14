from django.contrib import admin
from apps.payment.models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['id','payer','payee','group','amount','status']
    search_fields = ['payer','payee','group','status']
    
