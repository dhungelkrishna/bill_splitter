from django.db import models
import uuid
from apps.group.models import Group
from apps.user.models import CustomUser
from django.core.exceptions import ValidationError
from django.db.models import CheckConstraint, Q
from django.db.models import indexes

class Expense(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=120, null=False)
    class Meta:
        constraints = [
            CheckConstraint(
                check=~Q(title=''),
                name='expense_non_empty_title'
            ),
        ]
    group = models.ForeignKey(Group, on_delete=models.SET_NULL, null=True)
    paid_by = models.ForeignKey(CustomUser,on_delete=models.SET_NULL, null=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False)
    class Meta:
        constraints = [
            CheckConstraint(
                check=Q(total_amount__gt=0),
                name='expense_positive_total_amount'
            ),
        ]
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.id}, {self.group}, {self.paid_by},{self.total_amount}"
    
    class Meta:
        indexes = [
            models.Index(fields=['group'], name='idx_expense_group'),
            models.Index(fields=['paid_by'], name='idx_expense_paid_by'),
        ]
    
    
    def clean(self):
        if self.group is None and self.paid_by is None:
            raise ValidationError("Either 'group' or 'paid_by' must be set.")
        if self.total_amount <= 0:
            raise ValidationError("Total amount must be a positive value.")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
