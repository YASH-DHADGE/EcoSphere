from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'challenges', views.ChallengeViewSet, basename='challenge')
router.register(r'achievements', views.AchievementViewSet, basename='achievement')

urlpatterns = [
    path('', include(router.urls)),
    path('challenges/<int:challenge_id>/join/', views.JoinChallengeView.as_view(), name='join-challenge'),
    path('challenges/<int:challenge_id>/progress/', views.UpdateProgressView.as_view(), name='update-progress'),
    path('leaderboard/', views.GamificationLeaderboardView.as_view(), name='gamification-leaderboard'),
    path('points/', views.UserPointsView.as_view(), name='user-points'),
]
