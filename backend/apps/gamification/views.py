from rest_framework import serializers, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import Challenge, UserChallenge, Achievement, UserAchievement, UserPoints
from apps.users.serializers import UserSerializer

User = get_user_model()


class ChallengeSerializer(serializers.ModelSerializer):
    """Serializer for Challenge model"""
    
    class Meta:
        model = Challenge
        fields = [
            'id', 'name', 'description', 'challenge_type', 'points_reward',
            'duration_days', 'target_value', 'target_unit', 'category',
            'start_date', 'end_date', 'max_participants', 'is_featured'
        ]


class UserChallengeSerializer(serializers.ModelSerializer):
    """Serializer for UserChallenge model"""
    challenge = ChallengeSerializer(read_only=True)
    
    class Meta:
        model = UserChallenge
        fields = [
            'id', 'challenge', 'status', 'progress_value', 
            'progress_percentage', 'joined_at', 'completed_at'
        ]


class AchievementSerializer(serializers.ModelSerializer):
    """Serializer for Achievement model"""
    
    class Meta:
        model = Achievement
        fields = [
            'id', 'name', 'description', 'badge_icon', 'points_required',
            'criteria_type', 'criteria_value', 'category', 'is_hidden'
        ]


class UserAchievementSerializer(serializers.ModelSerializer):
    """Serializer for UserAchievement model"""
    achievement = AchievementSerializer(read_only=True)
    
    class Meta:
        model = UserAchievement
        fields = ['id', 'achievement', 'earned_at']


class UserPointsSerializer(serializers.ModelSerializer):
    """Serializer for UserPoints model"""
    
    class Meta:
        model = UserPoints
        fields = [
            'id', 'points', 'source', 'description', 
            'reference_id', 'created_at'
        ]


# ViewSets
class ChallengeViewSet(viewsets.ModelViewSet):
    """ViewSet for Challenge model"""
    serializer_class = ChallengeSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Challenge.objects.filter(is_active=True)


class AchievementViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for Achievement model"""
    serializer_class = AchievementSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Achievement.objects.filter(is_active=True)


# API Views
class JoinChallengeView(APIView):
    """API view to join a challenge"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request, challenge_id):
        try:
            challenge = Challenge.objects.get(id=challenge_id, is_active=True)
        except Challenge.DoesNotExist:
            return Response(
                {'error': 'Challenge not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if user already joined
        if UserChallenge.objects.filter(user=request.user, challenge=challenge).exists():
            return Response(
                {'error': 'Already joined this challenge'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user_challenge = UserChallenge.objects.create(
            user=request.user,
            challenge=challenge,
            status='ACTIVE'
        )
        
        serializer = UserChallengeSerializer(user_challenge)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class UpdateProgressView(APIView):
    """API view to update challenge progress"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request, challenge_id):
        try:
            user_challenge = UserChallenge.objects.get(
                user=request.user,
                challenge_id=challenge_id,
                status='ACTIVE'
            )
        except UserChallenge.DoesNotExist:
            return Response(
                {'error': 'Challenge not found or not joined'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        progress_value = request.data.get('progress_value')
        if progress_value is None:
            return Response(
                {'error': 'progress_value is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user_challenge.progress_value = progress_value
        user_challenge.progress_percentage = min(100, (progress_value / user_challenge.challenge.target_value) * 100)
        
        if user_challenge.progress_percentage >= 100:
            user_challenge.status = 'COMPLETED'
            user_challenge.completed_at = timezone.now()
        
        user_challenge.save()
        
        serializer = UserChallengeSerializer(user_challenge)
        return Response(serializer.data)


class GamificationLeaderboardView(APIView):
    """API view for gamification leaderboard"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        users = User.objects.all().order_by('-total_points')[:10]
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


class UserPointsView(APIView):
    """API view for user points"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        points = UserPoints.objects.filter(user=request.user).order_by('-created_at')
        serializer = UserPointsSerializer(points, many=True)
        return Response(serializer.data)
