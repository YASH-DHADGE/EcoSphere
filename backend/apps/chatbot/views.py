from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .models import ChatMessage, ChatSession, ChatbotConfig


class ChatMessageViewSet(viewsets.ModelViewSet):
    """ViewSet for chat messages"""
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ChatMessage.objects.filter(user=self.request.user).order_by('created_at')


class ChatSessionViewSet(viewsets.ModelViewSet):
    """ViewSet for chat sessions"""
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ChatSession.objects.filter(user=self.request.user).order_by('-last_activity')


class ChatbotConfigViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for chatbot configuration"""
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ChatbotConfig.objects.filter(is_active=True)


# API Views
class ChatMessageView(APIView):
    """API view to send a chat message"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        message_text = request.data.get('message')
        session_id = request.data.get('session_id')
        
        if not message_text:
            return Response(
                {'error': 'Message is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get or create session
        if session_id:
            try:
                session = ChatSession.objects.get(id=session_id, user=request.user)
            except ChatSession.DoesNotExist:
                return Response(
                    {'error': 'Session not found'}, 
                    status=status.HTTP_404_NOT_FOUND
                )
        else:
            session = ChatSession.objects.create(user=request.user)
        
        # Create user message
        user_message = ChatMessage.objects.create(
            user=request.user,
            session=session,
            message=message_text,
            is_user=True
        )
        
        # Here you would typically call the AI service to get a response
        # For now, we'll create a placeholder response
        bot_response = "This is a placeholder response. The AI service would be integrated here."
        
        bot_message = ChatMessage.objects.create(
            user=request.user,
            session=session,
            message=bot_response,
            is_user=False
        )
        
        return Response({
            'user_message': {
                'id': user_message.id,
                'message': user_message.message,
                'created_at': user_message.created_at
            },
            'bot_message': {
                'id': bot_message.id,
                'message': bot_message.message,
                'created_at': bot_message.created_at
            },
            'session_id': session.id
        }, status=status.HTTP_201_CREATED)


class ChatHistoryView(APIView):
    """API view to get chat history"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        session_id = request.GET.get('session_id')
        
        if session_id:
            try:
                session = ChatSession.objects.get(id=session_id, user=request.user)
                messages = ChatMessage.objects.filter(session=session).order_by('created_at')
            except ChatSession.DoesNotExist:
                return Response(
                    {'error': 'Session not found'}, 
                    status=status.HTTP_404_NOT_FOUND
                )
        else:
            # Get all messages for the user
            messages = ChatMessage.objects.filter(user=request.user).order_by('created_at')
        
        data = {
            'messages': [
                {
                    'id': msg.id,
                    'message': msg.message,
                    'is_user': msg.is_user,
                    'created_at': msg.created_at
                } for msg in messages
            ]
        }
        
        return Response(data)


class ChatbotConfigView(APIView):
    """API view to get chatbot configuration"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        configs = ChatbotConfig.objects.filter(is_active=True)
        
        data = {
            'configs': [
                {
                    'id': config.id,
                    'name': config.name,
                    'description': config.description,
                    'model_name': config.model_name,
                    'temperature': config.temperature,
                    'max_tokens': config.max_tokens
                } for config in configs
            ]
        }
        
        return Response(data)
