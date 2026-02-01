from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(read_only=True)
    is_active = serializers.BooleanField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'phone', 'profile_image', 'bio', 'role', 'is_active', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at', 'username', 'is_active')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    password2 = serializers.CharField(write_only=True, min_length=6)
    role = serializers.ChoiceField(choices=['owner', 'trainer', 'member'], default='member')
    
    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name', 'password', 'password2', 'role', 'phone')
    
    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Passwords must match."})
        
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({"email": "Email already registered."})
        
        return data
    
    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        
        user = User(**validated_data)
        user.username = validated_data['email']
        user.set_password(password)
        user.save()
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    # Override to accept email instead of username
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['email'] = serializers.EmailField()
        self.fields.pop('username', None)
    
    def validate(self, attrs):
        # Convert email to username for parent validation
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            try:
                user = User.objects.get(email=email)
                attrs['username'] = user.username
                attrs.pop('email', None)
            except User.DoesNotExist:
                raise serializers.ValidationError({"email": "No user found with this email."})
        
        data = super().validate(attrs)
        
        user_serializer = UserSerializer(self.user)
        data['user'] = user_serializer.data
        
        return data

# Dashboard Serializers (Role-based views)

class DashboardUserSerializer(serializers.ModelSerializer):
    """Simplified user serializer for dashboard views"""
    trainer_name = serializers.SerializerMethodField()
    member_count = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'trainer_name', 'member_count')
    
    def get_trainer_name(self, obj):
        if hasattr(obj, 'member_profile') and obj.member_profile and obj.member_profile.primary_trainer:
            trainer = obj.member_profile.primary_trainer
            return f"{trainer.first_name} {trainer.last_name}".strip()
        return None
    
    def get_member_count(self, obj):
        if obj.role == 'trainer':
            return obj.assigned_members.filter(status='active').count()
        return None


class OwnerDashboardSerializer(serializers.Serializer):
    """Dashboard for gym owner - sees all trainers and members"""
    role = serializers.SerializerMethodField()
    total_trainers = serializers.SerializerMethodField()
    total_members = serializers.SerializerMethodField()
    trainers = serializers.SerializerMethodField()
    members = serializers.SerializerMethodField()
    
    def get_role(self, obj):
        return 'owner'
    
    def get_total_trainers(self, obj):
        return User.objects.filter(role='trainer').count()
    
    def get_total_members(self, obj):
        return User.objects.filter(role='member').count()
    
    def get_trainers(self, obj):
        trainers = User.objects.filter(role='trainer')
        return DashboardUserSerializer(trainers, many=True).data
    
    def get_members(self, obj):
        members = User.objects.filter(role='member')
        return DashboardUserSerializer(members, many=True).data


class TrainerDashboardSerializer(serializers.Serializer):
    """Dashboard for trainer - sees their assigned members and programs"""
    role = serializers.SerializerMethodField()
    total_members = serializers.SerializerMethodField()
    total_programs = serializers.SerializerMethodField()
    members = serializers.SerializerMethodField()
    programs = serializers.SerializerMethodField()
    
    def get_role(self, obj):
        return 'trainer'
    
    def get_total_members(self, obj):
        return User.objects.filter(member_profile__primary_trainer=obj, role='member').count()
    
    def get_total_programs(self, obj):
        return obj.programs.filter(is_active=True).count()
    
    def get_members(self, obj):
        members = User.objects.filter(member_profile__primary_trainer=obj, role='member')
        return DashboardUserSerializer(members, many=True).data
    
    def get_programs(self, obj):
        from programs.serializers import ProgramSerializer
        programs = obj.programs.filter(is_active=True)
        return ProgramSerializer(programs, many=True).data


class MemberDashboardSerializer(serializers.Serializer):
    """Dashboard for member - sees their trainer and assigned programs"""
    role = serializers.SerializerMethodField()
    trainer = serializers.SerializerMethodField()
    programs = serializers.SerializerMethodField()
    stats = serializers.SerializerMethodField()
    
    def get_role(self, obj):
        return 'member'
    
    def get_trainer(self, obj):
        if hasattr(obj, 'member_profile') and obj.member_profile and obj.member_profile.primary_trainer:
            trainer = obj.member_profile.primary_trainer
            return DashboardUserSerializer(trainer).data
        return None
    
    def get_programs(self, obj):
        from programs.serializers import ProgramSerializer
        from programs.models import ProgramAssignment
        # Get the actual Program objects, not the ProgramAssignment objects
        assignments = ProgramAssignment.objects.filter(member=obj)
        programs = [assignment.program for assignment in assignments]
        return ProgramSerializer(programs, many=True).data
    
    def get_stats(self, obj):
        return {
            'workouts_done': 0,
            'attendance_rate': 0,
            'progress': 0,
        }