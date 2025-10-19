from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class ChatMessage(models.Model):
    """
    Model to store chatbot conversation history
    """
    ROLE_CHOICES = [
        ('USER', 'User'),
        ('ASSISTANT', 'Assistant'),
        ('SYSTEM', 'System'),
    ]
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='chat_messages'
    )
    
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        help_text='Message role'
    )
    
    content = models.TextField(
        help_text='Message content'
    )
    
    session_id = models.CharField(
        max_length=100,
        help_text='Chat session identifier'
    )
    
    tokens_used = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text='Number of tokens used for this message'
    )
    
    response_time = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        help_text='Response time in seconds'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'chat_messages'
        verbose_name = 'Chat Message'
        verbose_name_plural = 'Chat Messages'
        ordering = ['created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.role}: {self.content[:50]}..."


class ChatSession(models.Model):
    """
    Model to track chat sessions
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='chat_sessions'
    )
    
    session_id = models.CharField(
        max_length=100,
        unique=True,
        help_text='Unique session identifier'
    )
    
    title = models.CharField(
        max_length=200,
        blank=True,
        help_text='Session title (auto-generated)'
    )
    
    message_count = models.PositiveIntegerField(
        default=0,
        help_text='Number of messages in session'
    )
    
    total_tokens = models.PositiveIntegerField(
        default=0,
        help_text='Total tokens used in session'
    )
    
    is_active = models.BooleanField(
        default=True,
        help_text='Whether session is active'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_activity = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'chat_sessions'
        verbose_name = 'Chat Session'
        verbose_name_plural = 'Chat Sessions'
        ordering = ['-last_activity']
    
    def __str__(self):
        return f"{self.user.username} - {self.session_id}"


class ChatbotConfig(models.Model):
    """
    Model to store chatbot configuration
    """
    name = models.CharField(
        max_length=100,
        unique=True,
        help_text='Configuration name'
    )
    
    system_prompt = models.TextField(
        help_text='System prompt for the chatbot'
    )
    
    max_tokens = models.PositiveIntegerField(
        default=1000,
        help_text='Maximum tokens per response'
    )
    
    temperature = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0.7,
        help_text='Response creativity (0.0 to 1.0)'
    )
    
    include_user_data = models.BooleanField(
        default=True,
        help_text='Whether to include user carbon data in context'
    )
    
    include_climate_data = models.BooleanField(
        default=True,
        help_text='Whether to include climate data in context'
    )
    
    is_active = models.BooleanField(
        default=True,
        help_text='Whether this configuration is active'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'chatbot_configs'
        verbose_name = 'Chatbot Configuration'
        verbose_name_plural = 'Chatbot Configurations'
    
    def __str__(self):
        return self.name
