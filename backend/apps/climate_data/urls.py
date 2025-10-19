from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'data', views.ClimateDataViewSet, basename='climate-data')
router.register(r'alerts', views.ClimateAlertViewSet, basename='climate-alert')
router.register(r'statistics', views.ClimateStatisticsViewSet, basename='climate-statistics')

urlpatterns = [
    path('', include(router.urls)),
    path('stats/', views.ClimateStatsView.as_view(), name='climate-stats'),
    path('trends/', views.ClimateTrendsView.as_view(), name='climate-trends'),
]
