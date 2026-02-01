from rest_framework import serializers
from django.contrib.auth import get_user_model
from members.models import Member

User = get_user_model()

class MemberSerializer(serializers.ModelSerializer):
    trainer_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'trainer_name')
    
    def get_trainer_name(self, obj):
        if hasattr(obj, 'member_profile') and obj.member_profile.primary_trainer:
            trainer = obj.member_profile.primary_trainer
            return f"{trainer.first_name} {trainer.last_name}".strip()
        return None


class CreateMemberSerializer(serializers.Serializer):
    """Serializer for creating a new member (used by Owner)"""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    
    def validate_email(self, value):
        """Check if email already exists"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value
    
    def create(self, validated_data):
        """Create User and Member profile"""
        email = validated_data['email']
        password = validated_data['password']
        first_name = validated_data.get('first_name', '')
        last_name = validated_data.get('last_name', '')
        
        # Create User with role='member'
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            role='member'
        )
        
        # Create Member profile
        Member.objects.create(user=user)
        
        return user
