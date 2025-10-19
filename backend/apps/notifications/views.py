from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .models import Notification, NotificationTemplate


class NotificationViewSet(viewsets.ModelViewSet):
    """ViewSet for notifications"""
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')


class NotificationTemplateViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for notification templates"""
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return NotificationTemplate.objects.filter(is_active=True)


# API Views
class MarkAllReadView(APIView):
    """API view to mark all notifications as read"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        Notification.objects.filter(
            user=request.user,
            is_read=False
        ).update(is_read=True)
        
        return Response({'message': 'All notifications marked as read'}, status=status.HTTP_200_OK)


class UnreadCountView(APIView):
    """API view to get unread notification count"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        count = Notification.objects.filter(
            user=request.user,
            is_read=False
        ).count()
        
        return Response({'unread_count': count})
