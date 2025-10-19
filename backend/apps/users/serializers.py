from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Friendship

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'role', 'avatar', 'location', 'bio',
            'total_points', 'login_streak', 'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'total_points', 'login_streak']


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile updates"""
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'avatar', 'location', 'bio',
            'notifications_enabled', 'email_notifications'
        ]
        read_only_fields = ['id', 'username', 'email']


class FriendshipSerializer(serializers.ModelSerializer):
    """Serializer for Friendship model"""
    friend = UserSerializer(read_only=True)
    friend_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Friendship
        fields = ['id', 'friend', 'friend_id', 'status', 'created_at']
        read_only_fields = ['id', 'created_at']


class UserStatsSerializer(serializers.Serializer):
    """Serializer for user statistics"""
    total_carbon_entries = serializers.IntegerField()
    monthly_carbon_total = serializers.DecimalField(max_digits=10, decimal_places=2)
    yearly_carbon_total = serializers.DecimalField(max_digits=10, decimal_places=2)
    challenges_completed = serializers.IntegerField()
    achievements_earned = serializers.IntegerField()
    friends_count = serializers.IntegerField()
