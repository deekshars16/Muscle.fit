from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProgramViewSet, ClientTrainerAssignmentViewSet, SessionViewSet

router = DefaultRouter()
router.register(r'', ProgramViewSet, basename='programs')
router.register(r'assignments', ClientTrainerAssignmentViewSet, basename='assignments')
router.register(r'sessions', SessionViewSet, basename='sessions')

urlpatterns = [
    path('', include(router.urls)),
]
