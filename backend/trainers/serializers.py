from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class TrainerSerializer(serializers.ModelSerializer):
    username = serializers.CharField(read_only=True)
    is_active = serializers.BooleanField(read_only=True)
    role = serializers.CharField(read_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'phone', 'profile_image', 'bio', 'role', 'is_active', 'created_at')
        read_only_fields = ('id', 'created_at', 'username', 'role', 'is_active')
