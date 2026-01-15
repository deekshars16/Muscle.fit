from rest_framework import serializers
from .models import GymInfo, WorkingHours, ContactMessage

class WorkingHoursSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkingHours
        fields = ('day', 'opening_time', 'closing_time', 'is_closed')

class GymInfoSerializer(serializers.ModelSerializer):
    working_hours = WorkingHoursSerializer(many=True, read_only=True)
    
    class Meta:
        model = GymInfo
        fields = ('id', 'name', 'email', 'phone', 'whatsapp', 'address', 'city', 'state', 'postal_code', 'latitude', 'longitude', 'logo', 'hero_image', 'description', 'established_year', 'working_hours')
        read_only_fields = ('id',)

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ('id', 'name', 'email', 'phone', 'subject', 'message', 'created_at')
        read_only_fields = ('id', 'created_at')
