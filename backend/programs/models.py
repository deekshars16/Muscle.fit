from django.db import models

class Program(models.Model):
    PROGRAM_TYPES = [
        ('cardio', 'Cardio'),
        ('muscle', 'Muscle Building'),
        ('yoga', 'Yoga'),
        ('strength', 'Strength Training'),
        ('flexibility', 'Flexibility'),
    ]
    
    name = models.CharField(max_length=100)
    program_type = models.CharField(max_length=20, choices=PROGRAM_TYPES)
    description = models.TextField()
    duration_weeks = models.IntegerField(help_text="Duration in weeks")
    difficulty_level = models.CharField(max_length=20, choices=[('beginner', 'Beginner'), ('intermediate', 'Intermediate'), ('advanced', 'Advanced')])
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='programs/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Program'
        verbose_name_plural = 'Programs'
    
    def __str__(self):
        return f"{self.name} ({self.get_program_type_display()})"
