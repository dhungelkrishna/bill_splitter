from django.db import models
import uuid
from apps.group.models import Group
from apps.user.models import CustomUser

class Status(models.TextChoices):
    SETTLED = 'SETTLED', 'Settled'
    PENDING = 'PENDING', 'Pending'
    FAILED = 'FAILED', 'Failed'


class Payment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    payer = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, related_name='payments_made')
    payee = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, related_name='payments_received')
    group = models.ForeignKey(Group, on_delete=models.SET_NULL, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)

    def __str__(self):
        payer_name = self.payer.username if self.payer else 'Unknown Payer'
        payee_name = self.payee.username if self.payee else 'Unknown Payee'
        group_name = self.group.name if self.group else 'No Group'
        return f"{self.id}: {group_name}, {payer_name} -> {payee_name}, {self.amount}"