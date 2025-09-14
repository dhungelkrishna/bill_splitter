import uuid
from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth import get_user_model
from apps.group.models import Group
from apps.expenses.models import Expense
from apps.payment.models import Payment
from apps.balance.models import Balance

class ActionType(models.TextChoices):
    CREATE = 'CREATE', 'Create'
    UPDATE = 'UPDATE', 'Update'
    DELETE = 'DELETE', 'Delete'
    ADD_MEMBER = 'ADD_MEMBER', 'Add Member'
    REMOVE_MEMBER = 'REMOVE_MEMBER', 'Remove Member'
    MAKE_PAYMENT = 'MAKE_PAYMENT', 'Make Payment'
    ADJUST_BALANCE = 'ADJUST_BALANCE', 'Adjust Balance'

class ActivityLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    user = models.ForeignKey(
        get_user_model(),
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="user_actions"
    )
    
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.UUIDField(db_index=True)
    content_object = GenericForeignKey('content_type', 'object_id')

    action_type = models.CharField(
        max_length=50,
        choices=ActionType.choices,
        default=ActionType.CREATE
    )
    description = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.user} {self.action_type}d on {self.content_object}"