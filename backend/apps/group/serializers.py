from rest_framework import serializers
# from .serializers import CustomUserSerializer
from .models import CustomUser, Group
from apps.group_user.models import GroupUser
from apps.group_user.serializers import GroupUserSerializer

class GroupSerializer(serializers.ModelSerializer):
    custom_user = serializers.SlugRelatedField(
        read_only=True, 
        slug_field='email',
        source='created_by'
    )

    members = GroupUserSerializer(source='group_members',many=True, read_only=True)

    class Meta:
        model = Group
        fields = ['id', 'name', 'custom_user', 'created_at', 'avatar', 'created_by', 'members']

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user
        validated_data['created_by'] = user
        group =  super().create(validated_data)
        GroupUser.objects.create(user=user, group=group)
        return group
    
    


