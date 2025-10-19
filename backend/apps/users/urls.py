from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'profile', views.UserProfileViewSet, basename='user-profile')
router.register(r'leaderboard', views.LeaderboardViewSet, basename='leaderboard')

urlpatterns = [
    path('', include(router.urls)),
    path('friends/', views.FriendListView.as_view({'get': 'list', 'post': 'create'}), name='friend-list'),
    path('friends/<int:friend_id>/', views.FriendDetailView.as_view({'put': 'update', 'delete': 'destroy'}), name='friend-detail'),
    path('stats/', views.UserStatsView.as_view({'get': 'list'}), name='user-stats'),
]
