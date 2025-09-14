from rest_framework import serializers
from apps.group_user.models import GroupUser
from apps.user.models import CustomUser
from apps.group.models import Group
# from apps.group.serializers import GroupSerializer   # it created circular serializer import so that commented.
from apps.user.serializers import CustomUserSerializer
from rest_framework.exceptions import ValidationError

class GroupUserSerializer(serializers.ModelSerializer):
    custom_user = CustomUserSerializer(source='user',read_only=True)
    # group_detail = GroupSerializer(source="group",read_only=True)
    class Meta:
        model = GroupUser
        fields = '__all__'
        read_only_fields = ['custom_user']
    

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['user'] = request.user  
        return super().create(validated_data)
    
    def validate(self, attrs):
        request = self.context.get('request')
        user = request.user
        group = attrs.get('group')
        if GroupUser.objects.filter(user = user, group = group).exists():
            raise ValidationError({"detail":"You're already in the group. "})
        
        return attrs