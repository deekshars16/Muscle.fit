from django.contrib import admin
from .models import GymInfo, WorkingHours, ContactMessage

@admin.register(GymInfo)
class GymInfoAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'phone', 'email')
    fieldsets = (
        ('Basic Info', {
            'fields': ('name', 'email', 'phone', 'whatsapp', 'established_year')
        }),
        ('Address', {
            'fields': ('address', 'city', 'state', 'postal_code')
        }),
        ('Location', {
            'fields': ('latitude', 'longitude'),
            'classes': ('collapse',)
        }),
        ('Media', {
            'fields': ('logo', 'hero_image')
        }),
        ('Description', {
            'fields': ('description',)
        }),
    )

class WorkingHoursInline(admin.TabularInline):
    model = WorkingHours
    extra = 0

admin.site.register(WorkingHours)

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'is_read', 'created_at')
    list_filter = ('is_read', 'created_at')
    search_fields = ('name', 'email', 'subject', 'message')
    readonly_fields = ('created_at',)
    actions = ['mark_as_read', 'mark_as_unread']
    
    def mark_as_read(self, request, queryset):
        queryset.update(is_read=True)
        self.message_user(request, f'{queryset.count()} message(s) marked as read.')
    
    def mark_as_unread(self, request, queryset):
        queryset.update(is_read=False)
        self.message_user(request, f'{queryset.count()} message(s) marked as unread.')
    
    mark_as_read.short_description = "Mark selected messages as read"
    mark_as_unread.short_description = "Mark selected messages as unread"
