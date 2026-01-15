from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
from users.serializers import UserSerializer

User = get_user_model()


class TrainerViewSet(viewsets.ModelViewSet):
    queryset = User.objects.filter(role='trainer')
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        """Get all active trainers"""
        return User.objects.filter(role='trainer', is_active=True)
