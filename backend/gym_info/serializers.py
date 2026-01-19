from rest_framework import serializers
from .models import GymInfo, WorkingHours, ContactMessage

class WorkingHoursSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkingHours
        fields = ('day', 'opening_time', 'closing_time', 'is_closed')

class GymInfoSerializer(serializers.ModelSerializer):
    logo = serializers.SerializerMethodField()
    hero_image = serializers.SerializerMethodField()
    
    class Meta:
        model = GymInfo
        fields = ('id', 'name', 'email', 'phone', 'whatsapp', 'address', 'city', 'state', 'postal_code', 'latitude', 'longitude', 'logo', 'hero_image', 'description', 'established_year')
        read_only_fields = ('id',)
    
    def get_logo(self, obj):
        if obj.logo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.logo.url)
            return str(obj.logo)
        return None
    
    def get_hero_image(self, obj):
        if obj.hero_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.hero_image.url)
            return str(obj.hero_image)
        return None

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ('id', 'name', 'email', 'phone', 'subject', 'message', 'created_at')
        read_only_fields = ('id', 'created_at')
