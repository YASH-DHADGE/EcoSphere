import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

User = get_user_model()


class NotificationConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for real-time notifications
    """
    
    async def connect(self):
        """Handle WebSocket connection"""
        # Get user from JWT token in query parameters
        self.user = await self.get_user_from_token()
        
        if self.user is None or isinstance(self.user, AnonymousUser):
            await self.close()
            return
        
        # Join user-specific group
        self.group_name = f'user_{self.user.id}'
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Send connection confirmation
        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message': 'Connected to EcoSphere notifications'
        }))
    
    async def disconnect(self, close_code):
        """Handle WebSocket disconnection"""
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )
    
    async def receive(self, text_data):
        """Handle messages from WebSocket client"""
        try:
            data = json.loads(text_data)
            message_type = data.get('type')
            
            if message_type == 'mark_notification_read':
                notification_id = data.get('notification_id')
                await self.mark_notification_as_read(notification_id)
            
            elif message_type == 'ping':
                await self.send(text_data=json.dumps({
                    'type': 'pong',
                    'timestamp': data.get('timestamp')
                }))
                
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Invalid JSON format'
            }))
    
    async def notification_message(self, event):
        """Send notification to WebSocket client"""
        await self.send(text_data=json.dumps({
            'type': 'notification',
            'id': event['id'],
            'title': event['title'],
            'content': event['content'],
            'notification_type': event['notification_type'],
            'priority': event['priority'],
            'icon': event.get('icon', ''),
            'action_url': event.get('action_url', ''),
            'created_at': event['created_at']
        }))
    
    async def achievement_unlocked(self, event):
        """Send achievement notification"""
        await self.send(text_data=json.dumps({
            'type': 'achievement',
            'achievement_id': event['achievement_id'],
            'name': event['name'],
            'description': event['description'],
            'badge_icon': event['badge_icon'],
            'points': event['points']
        }))
    
    async def challenge_update(self, event):
        """Send challenge update notification"""
        await self.send(text_data=json.dumps({
            'type': 'challenge_update',
            'challenge_id': event['challenge_id'],
            'challenge_name': event['challenge_name'],
            'progress': event['progress'],
            'status': event['status']
        }))
    
    async def climate_alert(self, event):
        """Send climate alert notification"""
        await self.send(text_data=json.dumps({
            'type': 'climate_alert',
            'alert_id': event['alert_id'],
            'title': event['title'],
            'description': event['description'],
            'severity': event['severity'],
            'location': event['location']
        }))
    
    @database_sync_to_async
    def get_user_from_token(self):
        """Get user from JWT token"""
        try:
            # Get token from query parameters
            token = self.scope['query_string'].decode().split('token=')[1] if 'token=' in self.scope['query_string'].decode() else None
            
            if not token:
                return None
            
            # Decode and validate token
            access_token = AccessToken(token)
            user_id = access_token['user_id']
            user = User.objects.get(id=user_id)
            return user
            
        except (InvalidToken, TokenError, User.DoesNotExist, IndexError, KeyError):
            return None
    
    @database_sync_to_async
    def mark_notification_as_read(self, notification_id):
        """Mark notification as read"""
        try:
            from apps.notifications.models import Notification
            notification = Notification.objects.get(
                id=notification_id,
                user=self.user
            )
            notification.mark_as_read()
            return True
        except Notification.DoesNotExist:
            return False
