from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TrainerViewSet

router = DefaultRouter()
router.register(r'', TrainerViewSet, basename='trainer')

urlpatterns = [
    path('', include(router.urls)),
    path('programs/', TrainerViewSet.as_view({'post': 'programs'}), name='trainer-programs'),
]
