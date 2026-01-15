from django.db import models

class GymInfo(models.Model):
    name = models.CharField(max_length=200, default='Muscle.fit')
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    whatsapp = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    logo = models.ImageField(upload_to='gym/', blank=True, null=True)
    hero_image = models.ImageField(upload_to='gym/', blank=True, null=True)
    description = models.TextField(blank=True)
    established_year = models.IntegerField(blank=True, null=True)
    
    class Meta:
        verbose_name = 'Gym Info'
        verbose_name_plural = 'Gym Info'
    
    def __str__(self):
        return self.name

class WorkingHours(models.Model):
    DAYS_CHOICES = [
        ('Monday', 'Monday'),
        ('Tuesday', 'Tuesday'),
        ('Wednesday', 'Wednesday'),
        ('Thursday', 'Thursday'),
        ('Friday', 'Friday'),
        ('Saturday', 'Saturday'),
        ('Sunday', 'Sunday'),
    ]
    
    gym = models.ForeignKey(GymInfo, on_delete=models.CASCADE, related_name='working_hours')
    day = models.CharField(max_length=20, choices=DAYS_CHOICES)
    opening_time = models.TimeField()
    closing_time = models.TimeField()
    is_closed = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['day']
        unique_together = ('gym', 'day')
    
    def __str__(self):
        return f"{self.gym.name} - {self.day}"

class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    subject = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Contact Message'
        verbose_name_plural = 'Contact Messages'
    
    def __str__(self):
        return f"{self.name} - {self.subject}"
