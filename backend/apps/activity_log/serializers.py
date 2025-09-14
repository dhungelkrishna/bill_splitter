from rest_framework import serializers
from .models import ActivityLog

class ActivityLogSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    action_type_display = serializers.CharField(source='get_action_type_display', read_only=True)
    entity_type = serializers.CharField(source='content_type.model', read_only=True)

    class Meta:
        model = ActivityLog
        fields = [
            'id',
            'user',
            'user_name',
            'entity_type',
            'object_id',
            'action_type',
            'action_type_display',
            'description',
            'timestamp'
        ]
        read_only_fields = ['id', 'user', 'user_name', 'entity_type', 'object_id', 'action_type', 'action_type_display', 'timestamp']