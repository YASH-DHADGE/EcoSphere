from rest_framework import serializers
from .models import ClimateData, ClimateAlert, ClimateStatistics


class ClimateDataSerializer(serializers.ModelSerializer):
    """Serializer for ClimateData model"""
    
    class Meta:
        model = ClimateData
        fields = [
            'id', 'data_type', 'value', 'unit', 'date', 'source', 'metadata'
        ]


class ClimateAlertSerializer(serializers.ModelSerializer):
    """Serializer for ClimateAlert model"""
    
    class Meta:
        model = ClimateAlert
        fields = [
            'id', 'title', 'description', 'alert_type', 'severity',
            'location', 'latitude', 'longitude', 'start_date', 'end_date',
            'is_active', 'source', 'external_id'
        ]


class ClimateStatisticsSerializer(serializers.ModelSerializer):
    """Serializer for ClimateStatistics model"""
    
    class Meta:
        model = ClimateStatistics
        fields = [
            'id', 'stat_type', 'current_value', 'previous_value',
            'change_percentage', 'unit', 'period', 'date', 'source'
        ]
