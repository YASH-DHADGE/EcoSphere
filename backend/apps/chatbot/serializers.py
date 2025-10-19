from rest_framework import serializers
from .models import ChatMessage, ChatSession, ChatbotConfig


class ChatMessageSerializer(serializers.ModelSerializer):
    """Serializer for ChatMessage model"""
    
    class Meta:
        model = ChatMessage
        fields = [
            'id', 'role', 'content', 'session_id', 'tokens_used',
            'response_time', 'created_at'
        ]


class ChatSessionSerializer(serializers.ModelSerializer):
    """Serializer for ChatSession model"""
    
    class Meta:
        model = ChatSession
        fields = [
            'id', 'session_id', 'title', 'message_count', 'total_tokens',
            'is_active', 'created_at', 'updated_at', 'last_activity'
        ]


class ChatbotConfigSerializer(serializers.ModelSerializer):
    """Serializer for ChatbotConfig model"""
    
    class Meta:
        model = ChatbotConfig
        fields = [
            'id', 'name', 'system_prompt', 'max_tokens', 'temperature',
            'include_user_data', 'include_climate_data', 'is_active'
        ]
