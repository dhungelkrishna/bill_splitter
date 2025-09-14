from django.db import models
import uuid
from django.contrib.auth.models import AbstractUser
from apps.user.managers import CustomManager

import uuid
import os
from django.core.validators import RegexValidator, FileExtensionValidator,MaxLengthValidator
from django.db.models import CheckConstraint, Q

def user_avatar_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    new_filename = f"{uuid.uuid4()}.{ext}"
    return f"avatar/{new_filename}"


class CustomUser(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = None
    email = models.EmailField(unique=True, null=False, editable=None)
    phone = models.CharField(max_length=20, null=False, unique=True,
                             validators=[
                                 RegexValidator(regex=r'^98[4-9]\d{7}$', message="Phone number validation Error.")
                             ])
    avatar = models.ImageField(
        upload_to=user_avatar_upload_path,
        null=True,
        blank=True,
        validators=[
            FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'avif', 'webp']),
            MaxLengthValidator(5 * 1024 * 1024)
        ]
    )

    
    USERNAME_FIELD = 'email'

    REQUIRED_FIELDS = []

    objects  = CustomManager()


    def __str__(self):
        return self.email
    
    class Meta:
        constraints = [
            CheckConstraint(
                check=~Q(email=''),
                name='customuser_non_empty_email'
            ),
        ]
        indexes = [
                models.Index(fields=['phone'], name='idx_customuser_phone'),
            ]
    

class PendingUser(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(max_length=254, unique=True, null=False)
    phone = models.CharField(max_length=20, null=False, unique=True)
    password = models.CharField(null=False, unique=True)
    otp = models.CharField(max_length=4, null=False,
        validators=[RegexValidator(regex=r'^\d{4}$', message="OTP must be 4 digits.")])
    

    def __str__(self):
        return self.email
