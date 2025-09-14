from rest_framework import serializers
from apps.user.serializers import CustomUserSerializer
from apps.group.serializers import GroupSerializer
from apps.splits.models import Split
from apps.payment.models import Payment
from apps.balance.models import Balance
from django.db import transaction
from rest_framework.exceptions import ValidationError

class BalanceSerializer(serializers.ModelSerializer):
    debtor = CustomUserSerializer(read_only=True)
    creditor = CustomUserSerializer(read_only=True)
    group_detail = GroupSerializer(source="group", read_only=True)

    class Meta:
        model = Balance
        fields = ['id', 'debtor', 'creditor', 'group_detail', 'amount', 'updated_at']
        read_only_fields = ['id', 'updated_at', 'group_detail']

    def validate_amount(self, value):
        """Validates that the amount is non-negative."""
        if value < 0:
            raise ValidationError("Amount must be non-negative.")
        return value

    def validate(self, data):
        # Check if debtor and creditor are the same
        if data['debtor'] == data['creditor']:
            raise ValidationError("Debtor and creditor cannot be the same user.")
        
        # Retrieve group, debtor, and creditor from the validated data
        group = data['group']
        debtor = data['debtor']
        creditor = data['creditor']

        # Check if debtor and creditor are members of the group
        if not group.group_members.filter(user_id=debtor.id).exists():
            raise ValidationError("Debtor must be a member of the group.")
        
        if not group.group_members.filter(user_id=creditor.id).exists():
            raise ValidationError("Creditor must be a member of the group.")
        
        # Check if a balance already exists between the debtor and creditor in the group
        if Balance.objects.filter(group=group, debtor=debtor, creditor=creditor).exclude(id=data.get('id')).exists():
            raise ValidationError("A balance between this debtor and creditor already exists in this group.")

        return data

