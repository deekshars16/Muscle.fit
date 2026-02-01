from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.response import Response
from rest_framework.views import APIView

class RootView(APIView):
    """Root API endpoint"""
    def get(self, request):
        return Response({
            'message': 'Welcome to muscle.fit API',
            'version': '1.0.0',
            'endpoints': {
                'users': '/api/users/',
                'trainers': '/api/trainers/',
                'programs': '/api/programs/',
                'gym': '/api/gym/',
                'token': '/api/token/',
            }
        })

urlpatterns = [
    path('', RootView.as_view(), name='root'),
    path('admin/', admin.site.urls),
    
    # JWT Authentication
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Auth endpoints
    path('api/auth/', include('authapi.urls')),
    
    # App URLs
    path('api/users/', include('users.urls')),
    path('api/members/', include('members.urls')),
    path('api/trainers/', include('trainers.urls')),
    path('api/programs/', include('programs.urls')),
    path('api/gym/', include('gym_info.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
