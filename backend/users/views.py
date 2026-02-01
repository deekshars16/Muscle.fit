from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from .serializers import (
    UserSerializer, RegisterSerializer, CustomTokenObtainPairSerializer,
    OwnerDashboardSerializer, TrainerDashboardSerializer, MemberDashboardSerializer
)
from rest_framework_simplejwt.views import TokenObtainPairView

User = get_user_model()

class RegisterView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'register':
            return RegisterSerializer
        return UserSerializer
    
    def list(self, request):
        """List all users - filtered by role if specified"""
        queryset = self.get_queryset()
        
        # Filter by role if provided
        role = request.query_params.get('role')
        if role:
            queryset = queryset.filter(role=role)
        
        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def register(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'message': 'User registered successfully',
                'user': UserSerializer(user).data,
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def profile(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def members(self, request):
        """Get all members"""
        members = User.objects.filter(role='member')
        serializer = UserSerializer(members, many=True)
        return Response(serializer.data)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class DashboardView(APIView):
    """
    Return role-specific dashboard data for Owner, Trainer, or Member.
    All roles call this single endpoint: GET /api/users/dashboard/
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        if user.role == 'owner':
            return self._owner_dashboard(user)
        elif user.role == 'trainer':
            return self._trainer_dashboard(user)
        elif user.role == 'member':
            return self._member_dashboard(user)
        
        return Response({'error': 'Invalid user role'}, status=status.HTTP_400_BAD_REQUEST)
    
    def _owner_dashboard(self, user):
        """Owner sees all trainers and members"""
        serializer = OwnerDashboardSerializer(user)
        return Response(serializer.data)
    
    def _trainer_dashboard(self, user):
        """Trainer sees only their assigned members and programs"""
        serializer = TrainerDashboardSerializer(user)
        return Response(serializer.data)
    
    def _member_dashboard(self, user):
        """Member sees their trainer and assigned programs"""
        serializer = MemberDashboardSerializer(user)
        return Response(serializer.data)