from django.db import models
import uuid
from apps.user.models import CustomUser
from apps.expenses.models import Expense
from django.db.models import CheckConstraint, Q
from django.core.exceptions import ValidationError

class Split(models.Model):
    SPLIT_TYPES = (
        ('equal', 'Equal'),
        ('unequal', 'Unequal'),
        ('percentage', 'Percentage'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    expense = models.ForeignKey(Expense, on_delete=models.SET_NULL, null=True, related_name="splits")
    user = models.ForeignKey(CustomUser,on_delete=models.SET_NULL, null=True)
    

    share_value = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    split_type = models.CharField(max_length=10, choices=SPLIT_TYPES, default='equal')
    
    amount_owed = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False)

    def __str__(self):
        return f"{self.id}, {self.expense}, {self.user},{self.amount_owed}"
    
    class Meta:
        constraints = [
            CheckConstraint(
                check=Q(amount_owed__gte=0),
                name='split_non_negative_amount_owed'
            ),
            CheckConstraint(
                check=Q(amount_paid__gte=0),
                name='split_non_negative_amount_paid'
            ),
        ]

    def clean(self):
        if self.split_type in ['unequal', 'percentage'] and self.share_value is None:
            raise ValidationError("share_value must be set for unequal or percentage splits.")
        if self.split_type == 'equal' and self.share_value is not None:
            raise ValidationError("share_value must be null for equal splits.")
        if self.split_type == 'percentage' and (self.share_value < 0 or self.share_value > 100):
            raise ValidationError("share_value must be between 0 and 100 for percentage splits.")
        
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['expense', 'user'],
                name='unique_expense_user_split'
            ),
        ]
    class Meta:
        indexes = [
            models.Index(fields=['expense'], name='idx_split_expense'),
            models.Index(fields=['user'], name='idx_split_user'),
        ]