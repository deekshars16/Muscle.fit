from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Program, ProgramAssignment
from .serializers import ProgramSerializer, ProgramAssignmentSerializer

class ProgramViewSet(viewsets.ModelViewSet):
    serializer_class = ProgramSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter programs by logged-in trainer"""
        user = self.request.user
        # Trainers see only their own programs
        if user.role == 'trainer':
            return Program.objects.filter(trainer=user).order_by('-created_at')
        # Owners see all programs
        elif user.role == 'owner':
            return Program.objects.all().order_by('-created_at')
        # Members don't see programs
        return Program.objects.none()
    
    def perform_create(self, serializer):
        """Automatically set trainer to logged-in user when creating"""
        serializer.save(trainer=self.request.user)
    
    @action(detail=True, methods=['post'])
    def duplicate(self, request, pk=None):
        """Duplicate a program"""
        program = self.get_object()
        
        # Check if trainer owns this program
        if program.trainer != request.user:
            return Response(
                {'error': 'You can only duplicate your own programs'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Create a duplicate
        new_program = Program.objects.create(
            trainer=request.user,
            name=f"{program.name} (Copy)",
            program_type=program.program_type,
            description=program.description,
            duration_weeks=program.duration_weeks,
            difficulty_level=program.difficulty_level,
            price=program.price,
            image=program.image,
            is_active=True
        )
        
        serializer = self.get_serializer(new_program)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'])
    def my_programs(self, request):
        """Get programs created by logged-in trainer"""
        if request.user.role != 'trainer':
            return Response(
                {'error': 'Only trainers can view their programs'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        programs = self.get_queryset()
        serializer = self.get_serializer(programs, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def assign_member(self, request, pk=None):
        """Assign a program to a member"""
        program = self.get_object()
        member_id = request.data.get('member_id')
        
        if not member_id:
            return Response(
                {'error': 'member_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if trainer owns this program
        if program.trainer != request.user:
            return Response(
                {'error': 'You can only assign your own programs'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            from django.contrib.auth import get_user_model
            User = get_user_model()
            member = User.objects.get(id=member_id, role='member')
        except User.DoesNotExist:
            return Response(
                {'error': 'Member not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Create or update assignment
        assignment, created = ProgramAssignment.objects.get_or_create(
            program=program,
            member=member
        )
        
        serializer = ProgramAssignmentSerializer(assignment)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['delete'])
    def unassign_member(self, request, pk=None):
        """Remove a program assignment from a member"""
        program = self.get_object()
        member_id = request.data.get('member_id')
        
        if not member_id:
            return Response(
                {'error': 'member_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if trainer owns this program
        if program.trainer != request.user:
            return Response(
                {'error': 'You can only unassign your own programs'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            assignment = ProgramAssignment.objects.get(
                program=program,
                member_id=member_id
            )
            assignment.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ProgramAssignment.DoesNotExist:
            return Response(
                {'error': 'Assignment not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['get'])
    def assigned_members(self, request):
        """Get members assigned to a program"""
        program_id = request.query_params.get('program_id')
        
        if not program_id:
            return Response(
                {'error': 'program_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            program = Program.objects.get(id=program_id, trainer=request.user)
        except Program.DoesNotExist:
            return Response(
                {'error': 'Program not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        assignments = program.assignments.all()
        serializer = ProgramAssignmentSerializer(assignments, many=True)
        return Response(serializer.data)


class ClientTrainerAssignmentViewSet(viewsets.ModelViewSet):
    """ViewSet for program assignments to members"""
    serializer_class = ProgramAssignmentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter assignments by trainer's programs or member's assigned programs"""
        user = self.request.user
        if user.role == 'trainer':
            # Trainers see assignments for their own programs
            return ProgramAssignment.objects.filter(program__trainer=user)
        elif user.role == 'member':
            # Members see their own assignments
            return ProgramAssignment.objects.filter(member=user)
        return ProgramAssignment.objects.none()


class SessionViewSet(viewsets.ModelViewSet):
    """ViewSet for training sessions"""
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter sessions by trainer or member"""
        user = self.request.user
        # For now, return empty queryset - can be expanded based on Session model
        from .models import Program
        if user.role == 'trainer':
            return Program.objects.filter(trainer=user)
        return Program.objects.none()
    
    def get_serializer_class(self):
        # Use ProgramSerializer for now, can create SessionSerializer later
        return ProgramSerializer
