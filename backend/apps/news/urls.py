from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'articles', views.NewsArticleViewSet, basename='news-article')

urlpatterns = [
    path('', include(router.urls)),
    path('articles/<int:article_id>/bookmark/', views.BookmarkArticleView.as_view(), name='bookmark-article'),
    path('digest/', views.WeeklyDigestView.as_view(), name='weekly-digest'),
    path('trending/', views.TrendingTopicsView.as_view(), name='trending-topics'),
    path('search/', views.SearchArticlesView.as_view(), name='search-articles'),
]
