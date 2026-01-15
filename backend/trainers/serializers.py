from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class TrainerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'phone', 'bio', 'profile_image', 'created_at')
        read_only_fields = ('id', 'created_at')
