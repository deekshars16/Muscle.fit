from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GymInfoViewSet, ContactMessageViewSet

router = DefaultRouter()
router.register(r'info', GymInfoViewSet, basename='gym-info')
router.register(r'contact', ContactMessageViewSet, basename='contact-message')

urlpatterns = [
    path('', include(router.urls)),
]
