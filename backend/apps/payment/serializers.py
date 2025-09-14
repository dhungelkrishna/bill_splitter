from rest_framework import serializers
from apps.user.serializers import CustomUserSerializer
from apps.group.serializers import GroupSerializer
from apps.splits.models import Split
from apps.payment.models import Payment
# from apps.balances.models import Balance
# from apps.activity_log.models import ActivityLog
from django.db import transaction
from rest_framework.exceptions import ValidationError
from .models import CustomUser

class PaymentSerializer(serializers.ModelSerializer):
    # payer_detail = CustomUserSerializer(source="payer", read_only=True)
    payer_detail  = serializers.SlugRelatedField(
        queryset = CustomUser.objects.all(),
        slug_field = 'email',
        write_only = True
        )
    payer = serializers.SlugRelatedField(
        slug_field = 'email',
        read_only = True
    )
    
    # payee_detail = CustomUserSerializer(source="payee", read_only=True)
    payee_detail = serializers.SlugRelatedField(
        queryset = CustomUser.objects.all(),
        slug_field = 'email',
        write_only = True
    )

    payee = serializers.SlugRelatedField(
        slug_field = 'email',
        read_only = True
    )
    group_detail = GroupSerializer(source="group", read_only=True)

    class Meta:
        model = Payment
        fields = ['id', 'payer', 'payee', 'group', 'amount', 'payment_date', 'status', 'group_detail', 'payer_detail', 'payee_detail']
        read_only_fields = ['id', 'payment_date', 'group_detail', 'payer_detail', 'payee_detail']

