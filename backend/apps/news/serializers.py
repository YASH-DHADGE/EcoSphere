from rest_framework import serializers
from .models import NewsArticle, ArticleBookmark, TrendingTopic


class NewsArticleSerializer(serializers.ModelSerializer):
    """Serializer for NewsArticle model"""
    
    class Meta:
        model = NewsArticle
        fields = [
            'id', 'title', 'summary', 'content', 'source', 'url',
            'image_url', 'category', 'published_date', 'is_featured',
            'is_trending', 'view_count', 'bookmark_count'
        ]


class ArticleBookmarkSerializer(serializers.ModelSerializer):
    """Serializer for ArticleBookmark model"""
    article = NewsArticleSerializer(read_only=True)
    
    class Meta:
        model = ArticleBookmark
        fields = ['id', 'article', 'created_at']


class TrendingTopicSerializer(serializers.ModelSerializer):
    """Serializer for TrendingTopic model"""
    
    class Meta:
        model = TrendingTopic
        fields = [
            'id', 'topic', 'search_count', 'trend_score', 'date'
        ]
