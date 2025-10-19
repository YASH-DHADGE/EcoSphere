from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    """
    Custom User model with role-based access control
    """
    ROLE_CHOICES = [
        ('INDIVIDUAL', 'Individual User'),
        ('NGO', 'NGO Account'),
        ('ADMIN', 'Admin'),
    ]
    
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='INDIVIDUAL',
        help_text='User role determining access permissions'
    )
    
    # Profile information
    avatar = models.ImageField(
        upload_to='avatars/',
        null=True,
        blank=True,
        help_text='User profile picture'
    )
    
    location = models.CharField(
        max_length=100,
        blank=True,
        help_text='User location (city, country)'
    )
    
    bio = models.TextField(
        max_length=500,
        blank=True,
        help_text='User bio/description'
    )
    
    # Preferences
    notifications_enabled = models.BooleanField(
        default=True,
        help_text='Whether user wants to receive notifications'
    )
    
    email_notifications = models.BooleanField(
        default=True,
        help_text='Whether user wants email notifications'
    )
    
    # Gamification
    total_points = models.PositiveIntegerField(
        default=0,
        help_text='Total EcoSphere points earned'
    )
    
    login_streak = models.PositiveIntegerField(
        default=0,
        help_text='Current daily login streak'
    )
    
    last_login_date = models.DateField(
        null=True,
        blank=True,
        help_text='Last date user logged in'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
    
    def is_ngo(self):
        return self.role == 'NGO'
    
    def is_admin(self):
        return self.role == 'ADMIN'
    
    def is_individual(self):
        return self.role == 'INDIVIDUAL'
    
    def update_login_streak(self):
        """Update login streak based on last login date"""
        today = timezone.now().date()
        
        if self.last_login_date is None:
            # First login
            self.login_streak = 1
        elif self.last_login_date == today:
            # Already logged in today
            pass
        elif self.last_login_date == today - timezone.timedelta(days=1):
            # Consecutive day
            self.login_streak += 1
        else:
            # Streak broken
            self.login_streak = 1
        
        self.last_login_date = today
        self.save(update_fields=['login_streak', 'last_login_date'])


class Friendship(models.Model):
    """
    Model to track user friendships
    """
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('ACCEPTED', 'Accepted'),
        ('BLOCKED', 'Blocked'),
    ]
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='friendships_initiated'
    )
    
    friend = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='friendships_received'
    )
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='PENDING'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'friendships'
        unique_together = ['user', 'friend']
        verbose_name = 'Friendship'
        verbose_name_plural = 'Friendships'
    
    def __str__(self):
        return f"{self.user.username} -> {self.friend.username} ({self.status})"
