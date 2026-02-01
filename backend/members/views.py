from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import MemberSerializer, CreateMemberSerializer
from members.models import Member

User = get_user_model()

class MemberViewSet(viewsets.ModelViewSet):
    serializer_class = MemberSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter members based on user role"""
        user = self.request.user
        
        if user.role == 'owner':
            # Owner sees all members
            return User.objects.filter(role='member')
        elif user.role == 'trainer':
            # Trainer sees only their assigned members
            return User.objects.filter(member_profile__primary_trainer=user, role='member')
        
        # Member sees only themselves
        return User.objects.filter(id=user.id)
    
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def create_member(self, request):
        """
        Create a new member account.
        Only gym owners can create members.
        
        Request:
            POST /api/members/create_member/
            {
                "email": "member@example.com",
                "password": "securepassword",
                "first_name": "John",
                "last_name": "Doe"
            }
        """
        # Check if user is owner
        if request.user.role != 'owner':
            return Response(
                {'error': 'Only gym owners can create members'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Use CreateMemberSerializer to validate and create
        serializer = CreateMemberSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role,
                'message': 'Member created successfully. They can now log in with their email and password.'
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
