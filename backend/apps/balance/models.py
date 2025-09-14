from django.db import models
import uuid
from apps.group.models import Group
from apps.user.models import CustomUser
from django.core.exceptions import ValidationError

class Balance(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    debtor = models.ForeignKey(CustomUser,on_delete=models.PROTECT,related_name='debts_owed',
        help_text="User who owes the amount.")
    creditor = models.ForeignKey(CustomUser,on_delete=models.PROTECT,related_name='debts_due',
        help_text="User who is owed the amount."
    )
    group = models.ForeignKey(Group,on_delete=models.CASCADE,related_name='balances'
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.id}: {self.group.name}, {self.debtor.username} owes {self.creditor.username} ${self.amount}"