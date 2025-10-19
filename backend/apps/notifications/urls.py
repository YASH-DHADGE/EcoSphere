from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.NotificationViewSet, basename='notification')

urlpatterns = [
    path('', include(router.urls)),
    path('read-all/', views.MarkAllReadView.as_view(), name='mark-all-read'),
    path('unread-count/', views.UnreadCountView.as_view(), name='unread-count'),
]
