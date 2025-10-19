from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'sessions', views.ChatSessionViewSet, basename='chat-session')

urlpatterns = [
    path('', include(router.urls)),
    path('message/', views.ChatMessageView.as_view(), name='chat-message'),
    path('history/', views.ChatHistoryView.as_view(), name='chat-history'),
    path('config/', views.ChatbotConfigView.as_view(), name='chatbot-config'),
]
