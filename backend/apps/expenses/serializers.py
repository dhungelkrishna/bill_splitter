from rest_framework import serializers
# from apps.user.serializers import CustomUserSerializer
from apps.group.serializers import GroupSerializer
from apps.splits.serializers import SplitSerializer
from apps.expenses.models import Expense
from .models import CustomUser
from apps.splits.models import Split
from rest_framework import serializers
from apps.splits.serializers import SplitSerializer
from apps.expenses.models import Expense
from apps.user.models import CustomUser
from apps.splits.models import Split
from django.db import transaction
from apps.user.serializers import CustomUserSerializer

class ExpenseSerializer(serializers.ModelSerializer):
    paid_by = serializers.SlugRelatedField(
        queryset=CustomUser.objects.all(),
        slug_field='email',
        # This field will be used for both writing and reading the payer
        # No need for a separate 'payer' field
    )
    # user_detail = CustomUserSerializer(source='customuser')

    splits_details = SplitSerializer(many=True, source="splits")

    class Meta:
        model = Expense
        fields = ('title', 'group', 'paid_by', 'total_amount', 'splits_details')
    
    @transaction.atomic # Ensures all splits are created or none are
    def create(self, validated_data):
        splits_data = validated_data.pop('splits', []) # `source="splits"` will populate this key
        expense = Expense.objects.create(**validated_data)
        
        split_type = splits_data[0].get('split_type')
        total_amount = expense.total_amount
        
        for split_detail in splits_data:
            user = split_detail.get('user')
            share_value = split_detail.get('share_value')
            
            # Calculate amount_owed based on split type
            if split_type == 'unequal':
                amount_owed = share_value
            elif split_type == 'percentage':
                amount_owed = (total_amount * share_value) / 100
            elif split_type == 'equal':
                amount_owed = total_amount / len(splits_data)
            
            # The payer has already paid the total amount initially.
            # Other users have paid 0.
            amount_paid = total_amount if user == expense.paid_by else 0
            
            Split.objects.create(
                expense=expense,
                user=user,
                amount_owed=amount_owed,
                amount_paid=amount_paid,
                split_type=split_type, # Add the split type to the model
                share_value=share_value # Add the share value to the model
            )
        
        return expense



    def validate(self, data):
        splits = data.get('splits', []) # `source="splits"` will put it here
        total_amount = data.get('total_amount', 0)
        group = data.get('group') # group object

        if not splits:
            raise serializers.ValidationError("An expense must have at least one split detail.")

        split_type = splits[0].get('split_type')
        
        # Validation for unequal splits
        if split_type == 'unequal':
            total_owed_from_payload = sum(split.get('share_value', 0) for split in splits)
            if total_owed_from_payload != total_amount:
                raise serializers.ValidationError(
                    "For unequal splits, the sum of `share_value` must equal the `total_amount`."
                )
        
        # Validation for percentage splits
        elif split_type == 'percentage':
            total_percentage_from_payload = sum(split.get('share_value', 0) for split in splits)
            if total_percentage_from_payload != 100:
                raise serializers.ValidationError(
                    "For percentage splits, the sum of `share_value` (percentages) must be exactly 100."
                )

        # 1. Check if users are members of the group
        if group:
            group_member_users_id = group.group_members.values_list('user_id', flat=True)
            for split_detail in splits:
                user = split_detail.get('user')
                if user.id not in group_member_users_id:
                    raise serializers.ValidationError(
                        f"User '{user.email}' is not a member of the group."
                    )
        
        # 2. Payer must be in the splits
        payer = data.get('paid_by')
        if not any(split.get('user') == payer for split in splits):
            raise serializers.ValidationError("The payer must be included in the splits_details.")
        
        # 3. Users in splits must be unique
        users_in_splits = [split.get('user') for split in splits]
        if len(users_in_splits) != len(set(users_in_splits)):
            raise serializers.ValidationError("A user cannot appear more than once in splits.")

        return data
