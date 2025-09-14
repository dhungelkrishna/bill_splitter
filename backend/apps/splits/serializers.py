from rest_framework import serializers
from .models import Split, CustomUser

class SplitSerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(
        queryset = CustomUser.objects.all(),
        slug_field = 'email',
    )
    
    class Meta:
        model = Split
        fields = ('user', 'split_type', 'share_value')