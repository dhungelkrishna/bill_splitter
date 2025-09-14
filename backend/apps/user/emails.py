from django.core.mail import send_mail
from django.contrib.auth.hashers import make_password
from bill_splitter import settings
import random
from apps.user.models import PendingUser

def send_otp_via_email(email, phone, password):
    otp = str(random.randint(1000, 9999))
    
    pending_user, created = PendingUser.objects.update_or_create(
        email=email,
        defaults={
            'phone': phone,
            'password': make_password(password),
            'otp': otp,
        }
    )

    subject = "Your OTP Code for Bill Splitter"
    message = f"Your OTP is: {otp}"
    email_from = settings.EMAIL_HOST_USER
    send_mail(subject, message, email_from, [email])
