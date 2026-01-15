from rest_framework import serializers
from .models import Program

class ProgramSerializer(serializers.ModelSerializer):
    program_type_display = serializers.CharField(source='get_program_type_display', read_only=True)
    difficulty_level_display = serializers.CharField(source='get_difficulty_level_display', read_only=True)
    
    class Meta:
        model = Program
        fields = ('id', 'name', 'program_type', 'program_type_display', 'description', 'duration_weeks', 'difficulty_level', 'difficulty_level_display', 'price', 'image', 'is_active', 'created_at')
        read_only_fields = ('id', 'created_at')
