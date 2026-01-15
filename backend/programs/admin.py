from django.contrib import admin
from .models import Program

@admin.register(Program)
class ProgramAdmin(admin.ModelAdmin):
    list_display = ('name', 'program_type', 'difficulty_level', 'duration_weeks', 'price', 'is_active')
    list_filter = ('program_type', 'difficulty_level', 'is_active', 'created_at')
    search_fields = ('name', 'description')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Program Info', {
            'fields': ('name', 'program_type', 'description', 'image')
        }),
        ('Details', {
            'fields': ('duration_weeks', 'difficulty_level', 'price')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
