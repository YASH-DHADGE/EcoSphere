from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from django.db.models import Q, Sum
from .models import Friendship
from .serializers import UserSerializer, UserProfileSerializer, FriendshipSerializer, UserStatsSerializer

User = get_user_model()


class UserProfileViewSet(viewsets.ModelViewSet):
    """ViewSet for user profile management"""
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)
    
    def get_object(self):
        return self.request.user
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get user statistics"""
        user = request.user
        
        # Calculate carbon statistics
        from apps.carbon.models import CarbonEntry
        from apps.gamification.models import UserChallenge, UserAchievement
        
        total_entries = CarbonEntry.objects.filter(user=user).count()
        monthly_total = CarbonEntry.objects.filter(
            user=user,
            date__month=request.GET.get('month', 1)
        ).aggregate(total=Sum('co2_calculated'))['total'] or 0
        
        yearly_total = CarbonEntry.objects.filter(
            user=user,
            date__year=request.GET.get('year', 2024)
        ).aggregate(total=Sum('co2_calculated'))['total'] or 0
        
        challenges_completed = UserChallenge.objects.filter(
            user=user,
            status='COMPLETED'
        ).count()
        
        achievements_earned = UserAchievement.objects.filter(user=user).count()
        friends_count = Friendship.objects.filter(
            Q(user=user) | Q(friend=user),
            status='ACCEPTED'
        ).count()
        
        stats_data = {
            'total_carbon_entries': total_entries,
            'monthly_carbon_total': monthly_total,
            'yearly_carbon_total': yearly_total,
            'challenges_completed': challenges_completed,
            'achievements_earned': achievements_earned,
            'friends_count': friends_count,
        }
        
        serializer = UserStatsSerializer(stats_data)
        return Response(serializer.data)


class LeaderboardViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for leaderboard data"""
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        leaderboard_type = self.request.query_params.get('type', 'global')
        
        if leaderboard_type == 'friends':
            # Get friends leaderboard
            friend_ids = Friendship.objects.filter(
                Q(user=self.request.user) | Q(friend=self.request.user),
                status='ACCEPTED'
            ).values_list('user_id', 'friend_id')
            
            all_friend_ids = set()
            for user_id, friend_id in friend_ids:
                all_friend_ids.add(user_id)
                all_friend_ids.add(friend_id)
            
            return User.objects.filter(id__in=all_friend_ids).order_by('-total_points')
        
        elif leaderboard_type == 'city':
            # Get city-based leaderboard
            user_city = self.request.user.location.split(',')[0] if self.request.user.location else None
            if user_city:
                return User.objects.filter(
                    location__icontains=user_city
                ).order_by('-total_points')
        
        # Global leaderboard (default)
        return User.objects.all().order_by('-total_points')


class FriendListView(viewsets.ModelViewSet):
    """ViewSet for friend management"""
    serializer_class = FriendshipSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Friendship.objects.filter(
            Q(user=self.request.user) | Q(friend=self.request.user)
        ).order_by('-created_at')
    
    def create(self, request):
        """Send friend request"""
        friend_id = request.data.get('friend_id')
        
        if not friend_id:
            return Response(
                {'error': 'friend_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            friend = User.objects.get(id=friend_id)
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        if friend == request.user:
            return Response(
                {'error': 'Cannot add yourself as friend'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if friendship already exists
        existing_friendship = Friendship.objects.filter(
            Q(user=request.user, friend=friend) | Q(user=friend, friend=request.user)
        ).first()
        
        if existing_friendship:
            return Response(
                {'error': 'Friendship already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        friendship = Friendship.objects.create(
            user=request.user,
            friend=friend,
            status='PENDING'
        )
        
        serializer = self.get_serializer(friendship)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class FriendDetailView(viewsets.ModelViewSet):
    """ViewSet for individual friend management"""
    serializer_class = FriendshipSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Friendship.objects.filter(
            Q(user=self.request.user) | Q(friend=self.request.user)
        )
    
    def update(self, request, friend_id):
        """Accept or reject friend request"""
        try:
            friendship = Friendship.objects.get(
                id=friend_id,
                friend=request.user,
                status='PENDING'
            )
        except Friendship.DoesNotExist:
            return Response(
                {'error': 'Friend request not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        action = request.data.get('action')
        if action == 'accept':
            friendship.status = 'ACCEPTED'
            friendship.save()
        elif action == 'reject':
            friendship.status = 'BLOCKED'
            friendship.save()
        else:
            return Response(
                {'error': 'Invalid action'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = self.get_serializer(friendship)
        return Response(serializer.data)
    
    def destroy(self, request, friend_id):
        """Remove friend"""
        friendship = Friendship.objects.filter(
            Q(user=request.user) | Q(friend=request.user),
            id=friend_id
        ).first()
        
        if not friendship:
            return Response(
                {'error': 'Friendship not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        friendship.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class UserStatsView(viewsets.ReadOnlyModelViewSet):
    """ViewSet for user statistics"""
    serializer_class = UserStatsSerializer
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        """Get current user's statistics"""
        user = request.user
        
        # Calculate statistics
        from apps.carbon.models import CarbonEntry
        from apps.gamification.models import UserChallenge, UserAchievement
        
        total_entries = CarbonEntry.objects.filter(user=user).count()
        
        # Monthly total
        from datetime import datetime
        current_month = datetime.now().month
        monthly_total = CarbonEntry.objects.filter(
            user=user,
            date__month=current_month
        ).aggregate(total=Sum('co2_calculated'))['total'] or 0
        
        # Yearly total
        current_year = datetime.now().year
        yearly_total = CarbonEntry.objects.filter(
            user=user,
            date__year=current_year
        ).aggregate(total=Sum('co2_calculated'))['total'] or 0
        
        challenges_completed = UserChallenge.objects.filter(
            user=user,
            status='COMPLETED'
        ).count()
        
        achievements_earned = UserAchievement.objects.filter(user=user).count()
        
        friends_count = Friendship.objects.filter(
            Q(user=user) | Q(friend=user),
            status='ACCEPTED'
        ).count()
        
        stats_data = {
            'total_carbon_entries': total_entries,
            'monthly_carbon_total': monthly_total,
            'yearly_carbon_total': yearly_total,
            'challenges_completed': challenges_completed,
            'achievements_earned': achievements_earned,
            'friends_count': friends_count,
        }
        
        serializer = self.get_serializer(stats_data)
        return Response(serializer.data)
