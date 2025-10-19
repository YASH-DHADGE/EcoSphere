from rest_framework import serializers
from .models import CarbonEntry, CarbonGoal


class CarbonEntrySerializer(serializers.ModelSerializer):
    """Serializer for CarbonEntry model"""
    
    class Meta:
        model = CarbonEntry
        fields = [
            'id', 'category', 'subcategory', 'value', 'unit', 
            'co2_calculated', 'date', 'notes', 'created_at'
        ]
        read_only_fields = ['id', 'co2_calculated', 'created_at']


class CarbonGoalSerializer(serializers.ModelSerializer):
    """Serializer for CarbonGoal model"""
    progress_percentage = serializers.ReadOnlyField()
    
    class Meta:
        model = CarbonGoal
        fields = [
            'id', 'title', 'description', 'target_reduction', 
            'current_reduction', 'progress_percentage', 'start_date', 
            'end_date', 'is_active', 'created_at'
        ]
        read_only_fields = ['id', 'current_reduction', 'progress_percentage', 'created_at']


class CarbonSummarySerializer(serializers.Serializer):
    """Serializer for carbon summary data"""
    monthly_total = serializers.DecimalField(max_digits=10, decimal_places=2)
    yearly_total = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_entries = serializers.IntegerField()
    average_daily = serializers.DecimalField(max_digits=10, decimal_places=2)
    category_breakdown = serializers.DictField()


class CarbonComparisonSerializer(serializers.Serializer):
    """Serializer for carbon comparison data"""
    user_average = serializers.DecimalField(max_digits=10, decimal_places=2)
    national_average = serializers.DecimalField(max_digits=10, decimal_places=2)
    global_average = serializers.DecimalField(max_digits=10, decimal_places=2)
    reduction_percentage = serializers.DecimalField(max_digits=5, decimal_places=2)
    comparison_data = serializers.DictField()
