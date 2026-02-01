from django.contrib import admin
from .models import Member


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ('user', 'primary_trainer', 'status', 'joining_date')
    list_filter = ('status', 'joining_date')
    search_fields = ('user__email', 'primary_trainer__email')
    readonly_fields = ('joining_date',)
