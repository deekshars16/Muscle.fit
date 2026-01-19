from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GymInfoViewSet, ContactMessageViewSet

router = DefaultRouter()
router.register(r'', GymInfoViewSet, basename='gym-info')
router.register(r'contact', ContactMessageViewSet, basename='contact-message')

# Custom actions can be added explicitly if needed
urlpatterns = [
    path('current/', GymInfoViewSet.as_view({'get': 'current'}), name='gym-current'),
    path('dashboard_stats/', GymInfoViewSet.as_view({'get': 'dashboard_stats'}), name='gym-dashboard-stats'),
    path('membership_growth/', GymInfoViewSet.as_view({'get': 'membership_growth'}), name='gym-membership-growth'),
    path('', include(router.urls)),
]
