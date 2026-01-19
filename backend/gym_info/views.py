from rest_framework import viewsets, status
from rest_framework.decorators import action, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.authentication import TokenAuthentication
from django.db.models import Count, Sum
from django.utils import timezone
from datetime import timedelta
from .models import GymInfo, WorkingHours, ContactMessage
from .serializers import GymInfoSerializer, WorkingHoursSerializer, ContactMessageSerializer
from users.models import User

class GymInfoViewSet(viewsets.ModelViewSet):
    queryset = GymInfo.objects.all()
    serializer_class = GymInfoSerializer
    permission_classes = [AllowAny]
    authentication_classes = []  # Disable JWT authentication for this viewset
    
    @action(detail=False, methods=['get'])
    def current(self, request):
        """Get current gym info"""
        gym = GymInfo.objects.first()
        if gym:
            serializer = self.get_serializer(gym)
            return Response(serializer.data)
        return Response({'error': 'Gym info not found'}, status=404)
    
    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        """Get dashboard statistics for gym owner"""
        try:
            # Count active trainers
            active_trainers = User.objects.filter(role='trainer', is_active=True).count()
            
            # Count active members
            active_members = User.objects.filter(role='member', is_active=True).count()
            
            # Count new members this month
            current_month = timezone.now().replace(day=1)
            new_members = User.objects.filter(
                role='member',
                created_at__gte=current_month
            ).count()
            
            # Get unread alerts/messages
            unread_alerts = ContactMessage.objects.filter(is_read=False).count()
            
            # Mock revenue data - can be expanded with actual payment tracking
            revenue = 124500  # Monthly revenue in rupees
            
            return Response({
                'trainers': {
                    'count': active_trainers,
                    'label': 'Active'
                },
                'members': {
                    'count': active_members,
                    'new': new_members,
                    'label': f'+{new_members} new'
                },
                'revenue': {
                    'amount': revenue,
                    'currency': '₹',
                    'period': 'This month'
                },
                'alerts': {
                    'count': unread_alerts,
                    'label': 'Expiring'
                }
            })
        except Exception as e:
            return Response(
                {'error': f'Failed to fetch dashboard stats: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def membership_growth(self, request):
        """Get weekly membership growth data"""
        try:
            # Get data for last 4 weeks
            weeks_data = []
            for week_offset in range(4, 0, -1):
                week_start = timezone.now() - timedelta(weeks=week_offset)
                week_end = week_start + timedelta(weeks=1)
                
                count = User.objects.filter(
                    role='member',
                    created_at__gte=week_start,
                    created_at__lt=week_end
                ).count()
                
                weeks_data.append({
                    'week': f'Week {5 - week_offset}',
                    'members': count + (60 - week_offset * 5)  # Mock progressive data
                })
            
            return Response({
                'chart_type': 'area',
                'data': weeks_data,
                'title': 'Membership Growth',
                'subtitle': 'January 2026 - Weekly overview'
            })
        except Exception as e:
            return Response(
                {'error': f'Failed to fetch membership growth: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def recent_activity(self, request):
        """Get recent gym activity"""
        try:
            activities = []
            
            # Get recent member joinings
            recent_members = User.objects.filter(
                role='member',
                created_at__gte=timezone.now() - timedelta(days=7)
            ).order_by('-created_at')[:3]
            
            for member in recent_members:
                activities.append({
                    'type': 'member_joined',
                    'title': 'New member joined',
                    'name': member.get_full_name() or member.email,
                    'timestamp': member.created_at.isoformat(),
                    'icon': 'user-plus'
                })
            
            # Mock additional activities
            if not activities:
                activities.append({
                    'type': 'member_joined',
                    'title': 'New member joined',
                    'name': 'Rahul Sharma',
                    'timestamp': timezone.now().isoformat(),
                    'icon': 'user-plus'
                })
                activities.append({
                    'type': 'payment_received',
                    'title': 'Payment received',
                    'name': 'Priya Patel',
                    'amount': '₹2,500',
                    'timestamp': (timezone.now() - timedelta(hours=4)).isoformat(),
                    'icon': 'credit-card'
                })
                activities.append({
                    'type': 'membership_expired',
                    'title': 'Membership expired',
                    'name': 'Amit Kumar',
                    'timestamp': (timezone.now() - timedelta(days=1)).isoformat(),
                    'icon': 'alert-circle'
                })
            
            return Response({
                'activities': activities
            })
        except Exception as e:
            return Response(
                {'error': f'Failed to fetch recent activity: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        """Create a new contact message"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({'message': 'Message sent successfully'}, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def unread(self, request):
        """Get unread messages (admin only)"""
        unread_messages = self.queryset.filter(is_read=False)
        serializer = self.get_serializer(unread_messages, many=True)
        return Response(serializer.data)
