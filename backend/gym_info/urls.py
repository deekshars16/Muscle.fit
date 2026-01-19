from django.urls import path
from .views import (
    current_gym_info,
    update_gym_info,
    dashboard_stats, 
    membership_growth, 
    recent_activity,
    create_contact_message,
    unread_messages
)

urlpatterns = [
    # Gym Info Endpoints
    path('', current_gym_info, name='gym-list'),  # Default to current gym info
    path('current/', current_gym_info, name='gym-current'),
    path('<int:pk>/', update_gym_info, name='gym-update'),  # PUT/PATCH to /gym/1/
    path('dashboard_stats/', dashboard_stats, name='gym-dashboard-stats'),
    path('membership_growth/', membership_growth, name='gym-membership-growth'),
    path('recent_activity/', recent_activity, name='gym-recent-activity'),
    
    # Contact Message Endpoints
    path('contact/', create_contact_message, name='contact-create'),
    path('contact/unread/', unread_messages, name='contact-unread'),
]
