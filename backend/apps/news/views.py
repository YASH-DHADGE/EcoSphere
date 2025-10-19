from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.db.models import Q
from .models import NewsArticle, ArticleBookmark, TrendingTopic


class NewsArticleViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for news articles"""
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return NewsArticle.objects.all().order_by('-published_date')


class ArticleBookmarkViewSet(viewsets.ModelViewSet):
    """ViewSet for article bookmarks"""
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ArticleBookmark.objects.filter(user=self.request.user).order_by('-created_at')


class TrendingTopicViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for trending topics"""
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return TrendingTopic.objects.all().order_by('-trend_score', '-date')


# API Views
class BookmarkArticleView(APIView):
    """API view to bookmark/unbookmark an article"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request, article_id):
        try:
            article = NewsArticle.objects.get(id=article_id)
        except NewsArticle.DoesNotExist:
            return Response(
                {'error': 'Article not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        bookmark, created = ArticleBookmark.objects.get_or_create(
            user=request.user,
            article=article
        )
        
        if created:
            return Response({'message': 'Article bookmarked'}, status=status.HTTP_201_CREATED)
        else:
            bookmark.delete()
            return Response({'message': 'Article unbookmarked'}, status=status.HTTP_200_OK)


class WeeklyDigestView(APIView):
    """API view for weekly digest"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Get articles from the last week
        from datetime import datetime, timedelta
        week_ago = datetime.now() - timedelta(days=7)
        
        articles = NewsArticle.objects.filter(
            published_date__gte=week_ago
        ).order_by('-published_date')[:10]
        
        # This would typically use a serializer
        data = {
            'articles': [
                {
                    'id': article.id,
                    'title': article.title,
                    'summary': article.summary,
                    'published_date': article.published_date
                } for article in articles
            ]
        }
        
        return Response(data)


class TrendingTopicsView(APIView):
    """API view for trending topics"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        topics = TrendingTopic.objects.all().order_by('-trend_score', '-date')[:10]
        
        data = {
            'topics': [
                {
                    'id': topic.id,
                    'name': topic.name,
                    'trend_score': topic.trend_score,
                    'date': topic.date
                } for topic in topics
            ]
        }
        
        return Response(data)


class SearchArticlesView(APIView):
    """API view to search articles"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        query = request.GET.get('q', '')
        if not query:
            return Response({'error': 'Query parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        articles = NewsArticle.objects.filter(
            Q(title__icontains=query) | Q(content__icontains=query) | Q(summary__icontains=query)
        ).order_by('-published_date')[:20]
        
        data = {
            'articles': [
                {
                    'id': article.id,
                    'title': article.title,
                    'summary': article.summary,
                    'published_date': article.published_date
                } for article in articles
            ]
        }
        
        return Response(data)
