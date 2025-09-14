from django.contrib import admin
from apps.user.models import CustomUser, PendingUser

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ['id','email','avatar','date_joined','password']
    search_fields = ['first_name','email','id']
    

@admin.register(PendingUser)
class PendingUserAdmin(admin.ModelAdmin):
    list_display = ['id','email','otp','password']
    search_fields = ['email','otp']
    
