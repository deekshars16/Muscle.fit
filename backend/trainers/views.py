from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from users.serializers import UserSerializer
from programs.models import Program
from programs.serializers import ProgramSerializer

User = get_user_model()


class TrainerViewSet(viewsets.ModelViewSet):
    queryset = User.objects.filter(role='trainer')
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        """Get all active trainers"""
        return User.objects.filter(role='trainer', is_active=True)
    
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def programs(self, request):
        """Create a new program for the logged-in trainer"""
        # Only trainers can create programs
        if request.user.role != 'trainer':
            return Response(
                {'error': 'Only trainers can create programs'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Prepare data with trainer_id automatically set
        data = request.data.copy() if hasattr(request.data, 'copy') else dict(request.data)
        data['trainer'] = request.user.id
        
        # Map frontend field names to backend field names if needed
        if 'program_type' not in data and 'type' in data:
            data['program_type'] = data.pop('type')
        if 'difficulty_level' not in data and 'difficulty' in data:
            data['difficulty_level'] = data.pop('difficulty')
        if 'duration_weeks' not in data and 'duration' in data:
            data['duration_weeks'] = data.pop('duration')
        if 'is_active' not in data and 'status' in data:
            data['is_active'] = data.pop('status')
        
        serializer = ProgramSerializer(data=data)
        if serializer.is_valid():
            serializer.save(trainer=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
