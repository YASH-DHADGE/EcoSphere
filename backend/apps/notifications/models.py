from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Notification(models.Model):
    """
    Model for user notifications
    """
    TYPE_CHOICES = [
        ('ACHIEVEMENT', 'Achievement Unlocked'),
        ('CHALLENGE', 'Challenge Update'),
        ('FRIEND_REQUEST', 'Friend Request'),
        ('CLIMATE_ALERT', 'Climate Alert'),
        ('WEEKLY_SUMMARY', 'Weekly Summary'),
        ('SYSTEM', 'System Notification'),
        ('NEWS', 'News Update'),
    ]
    
    PRIORITY_CHOICES = [
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
        ('URGENT', 'Urgent'),
    ]
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    
    notification_type = models.CharField(
        max_length=20,
        choices=TYPE_CHOICES,
        help_text='Type of notification'
    )
    
    title = models.CharField(
        max_length=200,
        help_text='Notification title'
    )
    
    content = models.TextField(
        help_text='Notification content'
    )
    
    priority = models.CharField(
        max_length=10,
        choices=PRIORITY_CHOICES,
        default='MEDIUM',
        help_text='Notification priority'
    )
    
    is_read = models.BooleanField(
        default=False,
        help_text='Whether notification has been read'
    )
    
    action_url = models.URLField(
        blank=True,
        help_text='URL to navigate to when clicked'
    )
    
    icon = models.CharField(
        max_length=50,
        blank=True,
        help_text='Icon identifier for the notification'
    )
    
    reference_id = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text='ID of related object'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'notifications'
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username}: {self.title}"
    
    def mark_as_read(self):
        """Mark notification as read"""
        if not self.is_read:
            self.is_read = True
            from django.utils import timezone
            self.read_at = timezone.now()
            self.save(update_fields=['is_read', 'read_at'])


class NotificationTemplate(models.Model):
    """
    Model for notification templates
    """
    name = models.CharField(
        max_length=100,
        help_text='Template name'
    )
    
    notification_type = models.CharField(
        max_length=20,
        choices=Notification.TYPE_CHOICES,
        help_text='Type of notification'
    )
    
    title_template = models.CharField(
        max_length=200,
        help_text='Title template with placeholders'
    )
    
    content_template = models.TextField(
        help_text='Content template with placeholders'
    )
    
    icon = models.CharField(
        max_length=50,
        blank=True,
        help_text='Default icon for this template'
    )
    
    priority = models.CharField(
        max_length=10,
        choices=Notification.PRIORITY_CHOICES,
        default='MEDIUM'
    )
    
    is_active = models.BooleanField(
        default=True,
        help_text='Whether template is active'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'notification_templates'
        verbose_name = 'Notification Template'
        verbose_name_plural = 'Notification Templates'
    
    def __str__(self):
        return self.name
