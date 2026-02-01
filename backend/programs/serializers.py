from rest_framework import serializers
from .models import Program, ProgramAssignment

class ProgramSerializer(serializers.ModelSerializer):
    # Frontend field mappings
    type = serializers.SerializerMethodField()
    mrp = serializers.DecimalField(max_digits=10, decimal_places=2, default=0, required=False)
    sellingPrice = serializers.SerializerMethodField()
    discountType = serializers.SerializerMethodField()
    discountValue = serializers.SerializerMethodField()
    finalPrice = serializers.SerializerMethodField()
    validityNumber = serializers.SerializerMethodField()
    validityUnit = serializers.CharField(default='Months', required=False)
    features = serializers.SerializerMethodField()
    thumbnailUrl = serializers.SerializerMethodField()
    videoUrl = serializers.CharField(default=None, required=False, allow_null=True)
    status = serializers.SerializerMethodField()
    trainer_name = serializers.CharField(source='trainer.first_name', read_only=True)
    enrollments = serializers.SerializerMethodField()
    
    class Meta:
        model = Program
        fields = (
            'id', 'name', 'type', 'description', 'trainer_name', 'trainer',
            'mrp', 'sellingPrice', 'discountType', 'discountValue', 'finalPrice',
            'validityNumber', 'validityUnit', 'features', 'thumbnailUrl', 'videoUrl', 'status',
            'program_type', 'difficulty_level', 'duration_weeks', 'price', 'is_active', 'created_at', 'updated_at', 'enrollments'
        )
        read_only_fields = ('id', 'created_at', 'updated_at', 'trainer_name', 'enrollments')
    
    def get_type(self, obj):
        """Map program_type to frontend type (Gym / PT / Classes)"""
        type_mapping = {
            'cardio': 'Gym',
            'muscle': 'Gym',
            'yoga': 'Classes',
            'strength': 'Gym',
            'flexibility': 'Classes',
        }
        return type_mapping.get(obj.program_type, 'Gym')
    
    def get_sellingPrice(self, obj):
        """Return price as sellingPrice"""
        return float(obj.price)
    
    def get_discountType(self, obj):
        """Default discount type - can be extended if model has discount info"""
        return None
    
    def get_discountValue(self, obj):
        """Default discount value - can be extended if model has discount info"""
        return None
    
    def get_finalPrice(self, obj):
        """Compute final price (selling price - discount if applicable)"""
        price = float(obj.price)
        # If discount fields exist in future, apply them here
        return price
    
    def get_validityNumber(self, obj):
        """Derive validity from duration_weeks"""
        if obj.duration_weeks:
            # Convert weeks to months (approximately 4 weeks per month)
            return max(1, obj.duration_weeks // 4)
        return 1
    
    def get_features(self, obj):
        """Generate features based on program type and difficulty"""
        features = []
        
        # Add type-specific features
        type_features = {
            'cardio': ['Cardio Equipment', 'Heart Rate Monitoring', 'Progress Tracking'],
            'muscle': ['Gym Access', 'Equipment Usage', 'Strength Training', 'Progress Tracking'],
            'yoga': ['Yoga Classes', 'Flexibility Training', 'Wellness Program'],
            'strength': ['Strength Training', 'Equipment Usage', 'Form Coaching', 'Progress Tracking'],
            'flexibility': ['Flexibility Training', 'Stretching Programs', 'Mobility Work'],
        }
        
        features.extend(type_features.get(obj.program_type, []))
        
        # Add difficulty-specific features
        if obj.difficulty_level == 'intermediate':
            features.append('Advanced Techniques')
        elif obj.difficulty_level == 'advanced':
            features.extend(['Advanced Techniques', 'Personalized Support'])
        
        return features if features else ['Program Access']
    
    def get_thumbnailUrl(self, obj):
        """Return image URL or empty string"""
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return str(obj.image)
        return None
    
    def get_videoUrl(self, obj):
        """Return video URL if available"""
        return None
    
    def get_status(self, obj):
        """Convert boolean is_active to status string"""
        return 'active' if obj.is_active else 'inactive'
    
    def get_enrollments(self, obj):
        """Get count of enrolled members"""
        return obj.assignments.count()


class ProgramAssignmentSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source='member.first_name', read_only=True)
    member_email = serializers.CharField(source='member.email', read_only=True)
    program_name = serializers.CharField(source='program.name', read_only=True)
    
    class Meta:
        model = ProgramAssignment
        fields = ('id', 'program', 'member', 'member_name', 'member_email', 'program_name', 'assigned_at')
        read_only_fields = ('id', 'assigned_at', 'member_name', 'member_email', 'program_name')
