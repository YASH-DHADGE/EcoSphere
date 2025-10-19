from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class CarbonEntry(models.Model):
    """
    Model to track user carbon footprint entries
    """
    CATEGORY_CHOICES = [
        ('DOMESTIC', 'Domestic'),
        ('TRANSPORTATION', 'Transportation'),
    ]
    
    DOMESTIC_SUBCATEGORIES = [
        ('ELECTRICITY', 'Electricity'),
        ('WATER', 'Water'),
        ('NATURAL_GAS', 'Natural Gas'),
        ('WASTE', 'Waste'),
    ]
    
    TRANSPORTATION_SUBCATEGORIES = [
        ('CAR', 'Car'),
        ('MOTORCYCLE', 'Motorcycle/Bike'),
        ('PUBLIC_TRANSIT', 'Public Transit'),
        ('FLIGHT', 'Flight'),
    ]
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='carbon_entries'
    )
    
    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        help_text='Main category of carbon emission'
    )
    
    subcategory = models.CharField(
        max_length=20,
        help_text='Specific subcategory within the main category'
    )
    
    value = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text='Numeric value of the entry (kWh, liters, km, etc.)'
    )
    
    unit = models.CharField(
        max_length=20,
        help_text='Unit of measurement (kWh, liters, km, etc.)'
    )
    
    co2_calculated = models.DecimalField(
        max_digits=10,
        decimal_places=3,
        help_text='Calculated CO2 emissions in kg'
    )
    
    date = models.DateField(
        help_text='Date of the carbon entry'
    )
    
    notes = models.TextField(
        blank=True,
        help_text='Additional notes about the entry'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'carbon_entries'
        verbose_name = 'Carbon Entry'
        verbose_name_plural = 'Carbon Entries'
        ordering = ['-date', '-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.category} ({self.date})"
    
    def get_subcategory_display(self):
        """Get human-readable subcategory name"""
        all_subcategories = dict(self.DOMESTIC_SUBCATEGORIES + self.TRANSPORTATION_SUBCATEGORIES)
        return all_subcategories.get(self.subcategory, self.subcategory)


class CarbonGoal(models.Model):
    """
    Model to track user's carbon reduction goals
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='carbon_goals'
    )
    
    title = models.CharField(
        max_length=100,
        help_text='Goal title'
    )
    
    description = models.TextField(
        help_text='Detailed description of the goal'
    )
    
    target_reduction = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text='Target CO2 reduction in kg per month'
    )
    
    current_reduction = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        help_text='Current CO2 reduction achieved'
    )
    
    start_date = models.DateField(
        help_text='Goal start date'
    )
    
    end_date = models.DateField(
        help_text='Goal end date'
    )
    
    is_active = models.BooleanField(
        default=True,
        help_text='Whether the goal is currently active'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'carbon_goals'
        verbose_name = 'Carbon Goal'
        verbose_name_plural = 'Carbon Goals'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.title}"
    
    @property
    def progress_percentage(self):
        """Calculate progress percentage"""
        if self.target_reduction == 0:
            return 0
        return min(100, (self.current_reduction / self.target_reduction) * 100)
