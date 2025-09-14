from django.db import models
import uuid
from apps.user.models import CustomUser
from django.core.validators import RegexValidator
from django.db.models import CheckConstraint,Q
from django.core.validators import FileExtensionValidator, MaxLengthValidator

def avatar_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    new_filename = f"{uuid.uuid4()}.{ext}"
    return f"avatar/{new_filename}"

class Group(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=120, null=False, unique=True, validators=[
            RegexValidator(
                regex=r'^[a-zA-Z0-9\s-]{3,120}$',
                message="Group name must be between 3 and 120 characters and can only contain letters, numbers, spaces, and hyphens."
            )
        ])
    created_by = models.ForeignKey(CustomUser,on_delete=models.SET_NULL, null=True, blank=True, related_name="created_groups")
    created_at = models.DateTimeField(auto_now_add=True)
    avatar = models.ImageField(
    upload_to=avatar_upload_path,
    null=True,
    blank=True,
    validators=[
        FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png']),
        MaxLengthValidator(5 * 1024 * 1024)  # 5MB limit
    ]
)

    def __str__(self):
        return f"{self.id}, {self.name}"
    
    class Meta:
        constraints = [
            CheckConstraint(
                check=~Q(name=''),
                name='group_non_empty_name'
            ),
        ]
        indexes = [
            models.Index(fields=['created_by'], name='idx_group_created_by'),
        ]