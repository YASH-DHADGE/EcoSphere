from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class NewsArticle(models.Model):
    """
    Model for climate news articles
    """
    CATEGORY_CHOICES = [
        ('POLICY', 'Policy'),
        ('SCIENCE', 'Science'),
        ('DISASTERS', 'Disasters'),
        ('SOLUTIONS', 'Solutions'),
        ('LOCAL', 'Local'),
        ('GLOBAL', 'Global'),
    ]
    
    title = models.CharField(
        max_length=200,
        help_text='Article title'
    )
    
    summary = models.TextField(
        help_text='AI-generated summary (150-200 words)'
    )
    
    content = models.TextField(
        blank=True,
        help_text='Full article content (if available)'
    )
    
    source = models.CharField(
        max_length=100,
        help_text='News source'
    )
    
    url = models.URLField(
        help_text='Original article URL'
    )
    
    image_url = models.URLField(
        blank=True,
        help_text='Article image URL'
    )
    
    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        help_text='Article category'
    )
    
    published_date = models.DateTimeField(
        help_text='Original publication date'
    )
    
    is_featured = models.BooleanField(
        default=False,
        help_text='Whether this is a featured article'
    )
    
    is_trending = models.BooleanField(
        default=False,
        help_text='Whether this article is trending'
    )
    
    view_count = models.PositiveIntegerField(
        default=0,
        help_text='Number of views'
    )
    
    bookmark_count = models.PositiveIntegerField(
        default=0,
        help_text='Number of bookmarks'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'news_articles'
        verbose_name = 'News Article'
        verbose_name_plural = 'News Articles'
        ordering = ['-published_date']
    
    def __str__(self):
        return self.title


class ArticleBookmark(models.Model):
    """
    Model to track user bookmarks
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='bookmarks'
    )
    
    article = models.ForeignKey(
        NewsArticle,
        on_delete=models.CASCADE,
        related_name='bookmarks'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'article_bookmarks'
        verbose_name = 'Article Bookmark'
        verbose_name_plural = 'Article Bookmarks'
        unique_together = ['user', 'article']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} bookmarked {self.article.title}"


class TrendingTopic(models.Model):
    """
    Model to track trending climate topics
    """
    topic = models.CharField(
        max_length=100,
        help_text='Trending topic name'
    )
    
    search_count = models.PositiveIntegerField(
        default=0,
        help_text='Number of searches for this topic'
    )
    
    trend_score = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0,
        help_text='Calculated trend score'
    )
    
    date = models.DateField(
        help_text='Date of trending data'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'trending_topics'
        verbose_name = 'Trending Topic'
        verbose_name_plural = 'Trending Topics'
        unique_together = ['topic', 'date']
        ordering = ['-trend_score', '-date']
    
    def __str__(self):
        return f"{self.topic} ({self.date})"
