from django.contrib import admin
from .models import Program, ProgramAssignment

@admin.register(Program)
class ProgramAdmin(admin.ModelAdmin):
    list_display = ('name', 'trainer', 'program_type', 'difficulty_level', 'duration_weeks', 'price', 'is_active')
    list_filter = ('trainer', 'program_type', 'difficulty_level', 'is_active', 'created_at')
    search_fields = ('name', 'description', 'trainer__email')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Program Info', {
            'fields': ('trainer', 'name', 'program_type', 'description', 'image')
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


@admin.register(ProgramAssignment)
class ProgramAssignmentAdmin(admin.ModelAdmin):
    list_display = ('program', 'member', 'assigned_at')
    list_filter = ('assigned_at', 'program__trainer')
    search_fields = ('program__name', 'member__email')
    readonly_fields = ('assigned_at', 'updated_at')
    fieldsets = (
        ('Assignment', {
            'fields': ('program', 'member')
        }),
        ('Timestamps', {
            'fields': ('assigned_at', 'updated_at'),
        }),
    )
