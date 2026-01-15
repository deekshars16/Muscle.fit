from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from .models import GymInfo, WorkingHours, ContactMessage
from .serializers import GymInfoSerializer, WorkingHoursSerializer, ContactMessageSerializer

class GymInfoViewSet(viewsets.ModelViewSet):
    queryset = GymInfo.objects.all()
    serializer_class = GymInfoSerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['get'])
    def current(self, request):
        """Get current gym info"""
        gym = GymInfo.objects.first()
        if gym:
            serializer = self.get_serializer(gym)
            return Response(serializer.data)
        return Response({'error': 'Gym info not found'}, status=404)

class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        """Create a new contact message"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({'message': 'Message sent successfully'}, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def unread(self, request):
        """Get unread messages (admin only)"""
        unread_messages = self.queryset.filter(is_read=False)
        serializer = self.get_serializer(unread_messages, many=True)
        return Response(serializer.data)
