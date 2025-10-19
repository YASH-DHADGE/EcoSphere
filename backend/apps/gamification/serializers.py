from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from .models import Challenge, UserChallenge, Achievement, UserAchievement, UserPoints
from .serializers import (
    ChallengeSerializer, UserChallengeSerializer, 
    AchievementSerializer, UserAchievementSerializer, UserPointsSerializer
)

User = get_user_model()


class ChallengeViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for challenges"""
    serializer_class = ChallengeSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Challenge.objects.filter(status='ACTIVE').order_by('-created_at')


class UserChallengeViewSet(viewsets.ModelViewSet):
    """ViewSet for user challenge participation"""
    serializer_class = UserChallengeSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return UserChallenge.objects.filter(user=self.request.user).order_by('-joined_at')


class AchievementViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for achievements"""
    serializer_class = AchievementSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Achievement.objects.all().order_by('points_required')


class UserAchievementViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for user achievements"""
    serializer_class = UserAchievementSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return UserAchievement.objects.filter(user=self.request.user).order_by('-earned_at')


class UserPointsViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for user points"""
    serializer_class = UserPointsSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return UserPoints.objects.filter(user=self.request.user).order_by('-created_at')
