from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Program
from .serializers import ProgramSerializer

class ProgramViewSet(viewsets.ModelViewSet):
    queryset = Program.objects.filter(is_active=True)
    serializer_class = ProgramSerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['get'])
    def by_type(self, request):
        """Get programs by type (cardio, muscle, yoga, etc.)"""
        program_type = request.query_params.get('type')
        if program_type:
            queryset = self.queryset.filter(program_type=program_type)
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        return Response({'error': 'type parameter required'}, status=400)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured/popular programs"""
        programs = self.queryset[:6]
        serializer = self.get_serializer(programs, many=True)
        return Response(serializer.data)
