from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.db.models import Avg, Max, Min
from .models import ClimateData, ClimateAlert, ClimateStatistics


class ClimateDataViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for climate data"""
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ClimateData.objects.all().order_by('-date')


class ClimateAlertViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for climate alerts"""
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ClimateAlert.objects.filter(is_active=True).order_by('-start_date')


class ClimateStatisticsViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for climate statistics"""
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ClimateStatistics.objects.all().order_by('-date')


# API Views
class ClimateStatsView(APIView):
    """API view for climate statistics summary"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Get basic statistics from climate data
        stats = ClimateData.objects.aggregate(
            avg_temperature=Avg('temperature'),
            max_temperature=Max('temperature'),
            min_temperature=Min('temperature'),
            avg_humidity=Avg('humidity'),
            avg_precipitation=Avg('precipitation')
        )
        
        # Get active alerts count
        active_alerts = ClimateAlert.objects.filter(is_active=True).count()
        
        data = {
            'temperature': {
                'average': round(stats['avg_temperature'] or 0, 2),
                'maximum': round(stats['max_temperature'] or 0, 2),
                'minimum': round(stats['min_temperature'] or 0, 2)
            },
            'humidity': {
                'average': round(stats['avg_humidity'] or 0, 2)
            },
            'precipitation': {
                'average': round(stats['avg_precipitation'] or 0, 2)
            },
            'active_alerts': active_alerts
        }
        
        return Response(data)


class ClimateTrendsView(APIView):
    """API view for climate trends"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Get trends for the last 30 days
        from datetime import datetime, timedelta
        thirty_days_ago = datetime.now() - timedelta(days=30)
        
        recent_data = ClimateData.objects.filter(
            date__gte=thirty_days_ago
        ).order_by('date')
        
        # Calculate trends (simplified)
        temperatures = [data.temperature for data in recent_data if data.temperature]
        humidities = [data.humidity for data in recent_data if data.humidity]
        
        data = {
            'temperature_trend': {
                'current': temperatures[-1] if temperatures else 0,
                'change': (temperatures[-1] - temperatures[0]) if len(temperatures) > 1 else 0,
                'data_points': len(temperatures)
            },
            'humidity_trend': {
                'current': humidities[-1] if humidities else 0,
                'change': (humidities[-1] - humidities[0]) if len(humidities) > 1 else 0,
                'data_points': len(humidities)
            },
            'period_days': 30
        }
        
        return Response(data)
