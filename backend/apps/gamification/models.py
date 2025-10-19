from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Challenge(models.Model):
    """
    Model for gamification challenges
    """
    TYPE_CHOICES = [
        ('WEEKLY', 'Weekly'),
        ('MONTHLY', 'Monthly'),
        ('COMMUNITY', 'Community'),
        ('CUSTOM', 'Custom'),
    ]
    
    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('COMPLETED', 'Completed'),
        ('EXPIRED', 'Expired'),
        ('CANCELLED', 'Cancelled'),
    ]
    
    name = models.CharField(
        max_length=100,
        help_text='Challenge name'
    )
    
    description = models.TextField(
        help_text='Detailed challenge description'
    )
    
    challenge_type = models.CharField(
        max_length=20,
        choices=TYPE_CHOICES,
        help_text='Type of challenge'
    )
    
    points_reward = models.PositiveIntegerField(
        help_text='Points awarded for completion'
    )
    
    duration_days = models.PositiveIntegerField(
        help_text='Challenge duration in days'
    )
    
    target_value = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text='Target value to achieve (optional)'
    )
    
    target_unit = models.CharField(
        max_length=20,
        blank=True,
        help_text='Unit for target value'
    )
    
    category = models.CharField(
        max_length=50,
        blank=True,
        help_text='Challenge category (e.g., Transportation, Energy)'
    )
    
    creator = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='created_challenges',
        null=True,
        blank=True,
        help_text='NGO user who created this challenge'
    )
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='ACTIVE'
    )
    
    start_date = models.DateTimeField(
        help_text='Challenge start date'
    )
    
    end_date = models.DateTimeField(
        help_text='Challenge end date'
    )
    
    max_participants = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text='Maximum number of participants'
    )
    
    is_featured = models.BooleanField(
        default=False,
        help_text='Whether this is a featured challenge'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'challenges'
        verbose_name = 'Challenge'
        verbose_name_plural = 'Challenges'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name
    
    @property
    def is_active(self):
        """Check if challenge is currently active"""
        from django.utils import timezone
        now = timezone.now()
        return self.status == 'ACTIVE' and self.start_date <= now <= self.end_date


class UserChallenge(models.Model):
    """
    Model to track user participation in challenges
    """
    STATUS_CHOICES = [
        ('JOINED', 'Joined'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
    ]
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='user_challenges'
    )
    
    challenge = models.ForeignKey(
        Challenge,
        on_delete=models.CASCADE,
        related_name='participants'
    )
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='JOINED'
    )
    
    progress_value = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        help_text='Current progress value'
    )
    
    progress_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0,
        help_text='Progress percentage'
    )
    
    joined_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'user_challenges'
        verbose_name = 'User Challenge'
        verbose_name_plural = 'User Challenges'
        unique_together = ['user', 'challenge']
        ordering = ['-joined_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.challenge.name}"
    
    def update_progress(self, value):
        """Update challenge progress"""
        self.progress_value = value
        if self.challenge.target_value:
            self.progress_percentage = min(100, (value / self.challenge.target_value) * 100)
            
            if self.progress_percentage >= 100:
                self.status = 'COMPLETED'
                from django.utils import timezone
                self.completed_at = timezone.now()
        
        self.save()


class Achievement(models.Model):
    """
    Model for user achievements/badges
    """
    name = models.CharField(
        max_length=100,
        help_text='Achievement name'
    )
    
    description = models.TextField(
        help_text='Achievement description'
    )
    
    badge_icon = models.CharField(
        max_length=50,
        help_text='Icon identifier for the badge'
    )
    
    points_required = models.PositiveIntegerField(
        help_text='Points required to unlock'
    )
    
    criteria_type = models.CharField(
        max_length=50,
        help_text='Type of criteria (points, carbon_reduction, streak, etc.)'
    )
    
    criteria_value = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text='Specific value required for criteria'
    )
    
    category = models.CharField(
        max_length=50,
        help_text='Achievement category'
    )
    
    is_hidden = models.BooleanField(
        default=False,
        help_text='Whether achievement is hidden until unlocked'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'achievements'
        verbose_name = 'Achievement'
        verbose_name_plural = 'Achievements'
        ordering = ['points_required']
    
    def __str__(self):
        return self.name


class UserAchievement(models.Model):
    """
    Model to track user achievements
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='user_achievements'
    )
    
    achievement = models.ForeignKey(
        Achievement,
        on_delete=models.CASCADE,
        related_name='user_achievements'
    )
    
    earned_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'user_achievements'
        verbose_name = 'User Achievement'
        verbose_name_plural = 'User Achievements'
        unique_together = ['user', 'achievement']
        ordering = ['-earned_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.achievement.name}"


class UserPoints(models.Model):
    """
    Model to track user points ledger
    """
    POINT_SOURCE_CHOICES = [
        ('CARBON_REDUCTION', 'Carbon Reduction'),
        ('CHALLENGE_COMPLETION', 'Challenge Completion'),
        ('LOGIN_STREAK', 'Login Streak'),
        ('ACHIEVEMENT', 'Achievement'),
        ('BONUS', 'Bonus'),
    ]
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='points_entries'
    )
    
    points = models.IntegerField(
        help_text='Points earned (can be negative)'
    )
    
    source = models.CharField(
        max_length=30,
        choices=POINT_SOURCE_CHOICES,
        help_text='Source of the points'
    )
    
    description = models.CharField(
        max_length=200,
        help_text='Description of the points source'
    )
    
    reference_id = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text='ID of related object (challenge, achievement, etc.)'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'user_points'
        verbose_name = 'User Points Entry'
        verbose_name_plural = 'User Points Entries'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username}: {self.points} points ({self.source})"
