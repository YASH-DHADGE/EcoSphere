from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Avg, Count
from django.http import HttpResponse
from datetime import datetime, timedelta
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
from io import BytesIO
from .models import CarbonEntry, CarbonGoal
from .serializers import (
    CarbonEntrySerializer, CarbonGoalSerializer, 
    CarbonSummarySerializer, CarbonComparisonSerializer
)


class CarbonEntryViewSet(viewsets.ModelViewSet):
    """ViewSet for carbon entry management"""
    serializer_class = CarbonEntrySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return CarbonEntry.objects.filter(user=self.request.user).order_by('-date', '-created_at')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def list(self, request):
        """Get carbon entries with optional filtering"""
        queryset = self.get_queryset()
        
        # Filter by date range
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)
        
        # Filter by category
        category = request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class CarbonGoalViewSet(viewsets.ModelViewSet):
    """ViewSet for carbon goal management"""
    serializer_class = CarbonGoalSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return CarbonGoal.objects.filter(user=self.request.user).order_by('-created_at')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CarbonSummaryView(viewsets.ReadOnlyModelViewSet):
    """View for carbon summary statistics"""
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        """Get carbon summary for current user"""
        user = request.user
        
        # Get date range
        year = int(request.query_params.get('year', datetime.now().year))
        month = int(request.query_params.get('month', datetime.now().month))
        
        # Monthly total
        monthly_entries = CarbonEntry.objects.filter(
            user=user,
            date__year=year,
            date__month=month
        )
        monthly_total = monthly_entries.aggregate(total=Sum('co2_calculated'))['total'] or 0
        
        # Yearly total
        yearly_entries = CarbonEntry.objects.filter(
            user=user,
            date__year=year
        )
        yearly_total = yearly_entries.aggregate(total=Sum('co2_calculated'))['total'] or 0
        
        # Total entries
        total_entries = CarbonEntry.objects.filter(user=user).count()
        
        # Average daily (last 30 days)
        thirty_days_ago = datetime.now() - timedelta(days=30)
        recent_entries = CarbonEntry.objects.filter(
            user=user,
            date__gte=thirty_days_ago
        )
        average_daily = recent_entries.aggregate(avg=Avg('co2_calculated'))['avg'] or 0
        
        # Category breakdown
        category_breakdown = {}
        for category, _ in CarbonEntry.CATEGORY_CHOICES:
            total = CarbonEntry.objects.filter(
                user=user,
                category=category,
                date__year=year
            ).aggregate(total=Sum('co2_calculated'))['total'] or 0
            category_breakdown[category] = float(total)
        
        summary_data = {
            'monthly_total': monthly_total,
            'yearly_total': yearly_total,
            'total_entries': total_entries,
            'average_daily': average_daily,
            'category_breakdown': category_breakdown,
        }
        
        serializer = CarbonSummarySerializer(summary_data)
        return Response(serializer.data)


class CarbonComparisonView(viewsets.ReadOnlyModelViewSet):
    """View for carbon comparison with averages"""
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        """Get carbon comparison data"""
        user = request.user
        
        # User's yearly average
        current_year = datetime.now().year
        user_entries = CarbonEntry.objects.filter(
            user=user,
            date__year=current_year
        )
        user_average = user_entries.aggregate(avg=Avg('co2_calculated'))['avg'] or 0
        
        # Mock national and global averages (in production, these would come from external data)
        national_average = 4000  # kg CO2 per year
        global_average = 5000   # kg CO2 per year
        
        # Calculate reduction percentage
        reduction_percentage = 0
        if national_average > 0:
            reduction_percentage = ((national_average - user_average) / national_average) * 100
        
        # Monthly comparison data
        monthly_data = {}
        for month in range(1, 13):
            month_total = CarbonEntry.objects.filter(
                user=user,
                date__year=current_year,
                date__month=month
            ).aggregate(total=Sum('co2_calculated'))['total'] or 0
            
            monthly_data[month] = {
                'user': float(month_total),
                'national': float(national_average / 12),
                'global': float(global_average / 12),
            }
        
        comparison_data = {
            'user_average': user_average,
            'national_average': national_average,
            'global_average': global_average,
            'reduction_percentage': max(0, reduction_percentage),
            'comparison_data': monthly_data,
        }
        
        serializer = CarbonComparisonSerializer(comparison_data)
        return Response(serializer.data)


class CarbonExportView(viewsets.ReadOnlyModelViewSet):
    """View for exporting carbon data as PDF"""
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        """Export carbon data as PDF"""
        user = request.user
        
        # Get date range
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        if not start_date:
            start_date = (datetime.now() - timedelta(days=365)).strftime('%Y-%m-%d')
        if not end_date:
            end_date = datetime.now().strftime('%Y-%m-%d')
        
        # Get entries
        entries = CarbonEntry.objects.filter(
            user=user,
            date__gte=start_date,
            date__lte=end_date
        ).order_by('-date')
        
        # Create PDF
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        styles = getSampleStyleSheet()
        story = []
        
        # Title
        title = Paragraph("EcoSphere Carbon Footprint Report", styles['Title'])
        story.append(title)
        story.append(Spacer(1, 12))
        
        # User info
        user_info = Paragraph(f"User: {user.username}", styles['Normal'])
        story.append(user_info)
        story.append(Paragraph(f"Report Period: {start_date} to {end_date}", styles['Normal']))
        story.append(Spacer(1, 12))
        
        # Summary
        total_co2 = entries.aggregate(total=Sum('co2_calculated'))['total'] or 0
        total_entries = entries.count()
        
        summary = Paragraph(f"Total CO2 Emissions: {total_co2:.2f} kg", styles['Heading2'])
        story.append(summary)
        story.append(Paragraph(f"Total Entries: {total_entries}", styles['Normal']))
        story.append(Spacer(1, 12))
        
        # Entries table
        if entries.exists():
            story.append(Paragraph("Carbon Entries:", styles['Heading2']))
            story.append(Spacer(1, 6))
            
            for entry in entries[:50]:  # Limit to first 50 entries
                entry_text = f"{entry.date} - {entry.subcategory}: {entry.value} {entry.unit} ({entry.co2_calculated:.2f} kg CO2)"
                story.append(Paragraph(entry_text, styles['Normal']))
                story.append(Spacer(1, 3))
        
        doc.build(story)
        buffer.seek(0)
        
        # Return PDF response
        response = HttpResponse(buffer.getvalue(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="ecosphere-carbon-report-{user.username}.pdf"'
        return response
