from django.db import models


class ClimateData(models.Model):
    """
    Model to store climate data from external APIs
    """
    DATA_TYPE_CHOICES = [
        ('CO2_LEVELS', 'CO2 Levels'),
        ('TEMPERATURE_ANOMALY', 'Temperature Anomaly'),
        ('SEA_LEVEL', 'Sea Level'),
        ('ARCTIC_ICE', 'Arctic Ice'),
        ('GREENHOUSE_GASES', 'Greenhouse Gases'),
    ]
    
    data_type = models.CharField(
        max_length=30,
        choices=DATA_TYPE_CHOICES,
        help_text='Type of climate data'
    )
    
    value = models.DecimalField(
        max_digits=10,
        decimal_places=3,
        help_text='Data value'
    )
    
    unit = models.CharField(
        max_length=20,
        help_text='Unit of measurement'
    )
    
    date = models.DateField(
        help_text='Date of the data point'
    )
    
    source = models.CharField(
        max_length=100,
        help_text='Data source (API name)'
    )
    
    metadata = models.JSONField(
        default=dict,
        blank=True,
        help_text='Additional metadata about the data point'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'climate_data'
        verbose_name = 'Climate Data Point'
        verbose_name_plural = 'Climate Data Points'
        unique_together = ['data_type', 'date']
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.get_data_type_display()}: {self.value} {self.unit} ({self.date})"


class ClimateAlert(models.Model):
    """
    Model for climate alerts and warnings
    """
    SEVERITY_CHOICES = [
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
        ('CRITICAL', 'Critical'),
    ]
    
    ALERT_TYPE_CHOICES = [
        ('TEMPERATURE', 'Temperature'),
        ('PRECIPITATION', 'Precipitation'),
        ('AIR_QUALITY', 'Air Quality'),
        ('SEA_LEVEL', 'Sea Level'),
        ('EXTREME_WEATHER', 'Extreme Weather'),
    ]
    
    title = models.CharField(
        max_length=200,
        help_text='Alert title'
    )
    
    description = models.TextField(
        help_text='Alert description'
    )
    
    alert_type = models.CharField(
        max_length=20,
        choices=ALERT_TYPE_CHOICES,
        help_text='Type of alert'
    )
    
    severity = models.CharField(
        max_length=10,
        choices=SEVERITY_CHOICES,
        help_text='Alert severity'
    )
    
    location = models.CharField(
        max_length=100,
        help_text='Affected location'
    )
    
    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True,
        help_text='Latitude coordinate'
    )
    
    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True,
        help_text='Longitude coordinate'
    )
    
    start_date = models.DateTimeField(
        help_text='Alert start date'
    )
    
    end_date = models.DateTimeField(
        null=True,
        blank=True,
        help_text='Alert end date'
    )
    
    is_active = models.BooleanField(
        default=True,
        help_text='Whether alert is currently active'
    )
    
    source = models.CharField(
        max_length=100,
        help_text='Alert source'
    )
    
    external_id = models.CharField(
        max_length=100,
        blank=True,
        help_text='External alert ID'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'climate_alerts'
        verbose_name = 'Climate Alert'
        verbose_name_plural = 'Climate Alerts'
        ordering = ['-severity', '-start_date']
    
    def __str__(self):
        return f"{self.title} ({self.get_severity_display()})"


class ClimateStatistics(models.Model):
    """
    Model to store aggregated climate statistics
    """
    STAT_TYPE_CHOICES = [
        ('GLOBAL_CO2', 'Global CO2'),
        ('GLOBAL_TEMP', 'Global Temperature'),
        ('ARCTIC_ICE_EXTENT', 'Arctic Ice Extent'),
        ('SEA_LEVEL_RISE', 'Sea Level Rise'),
        ('RENEWABLE_ENERGY', 'Renewable Energy'),
    ]
    
    stat_type = models.CharField(
        max_length=30,
        choices=STAT_TYPE_CHOICES,
        help_text='Type of statistic'
    )
    
    current_value = models.DecimalField(
        max_digits=10,
        decimal_places=3,
        help_text='Current value'
    )
    
    previous_value = models.DecimalField(
        max_digits=10,
        decimal_places=3,
        null=True,
        blank=True,
        help_text='Previous period value'
    )
    
    change_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        help_text='Percentage change from previous period'
    )
    
    unit = models.CharField(
        max_length=20,
        help_text='Unit of measurement'
    )
    
    period = models.CharField(
        max_length=20,
        help_text='Time period (daily, weekly, monthly, yearly)'
    )
    
    date = models.DateField(
        help_text='Date of the statistic'
    )
    
    source = models.CharField(
        max_length=100,
        help_text='Data source'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'climate_statistics'
        verbose_name = 'Climate Statistic'
        verbose_name_plural = 'Climate Statistics'
        unique_together = ['stat_type', 'period', 'date']
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.get_stat_type_display()}: {self.current_value} {self.unit} ({self.date})"
