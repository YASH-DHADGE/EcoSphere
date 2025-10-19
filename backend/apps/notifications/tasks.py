from celery import shared_task
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.db import models
from datetime import datetime, timedelta
import logging

from apps.notifications.models import Notification
from apps.news.models import NewsArticle
from apps.climate_data.models import ClimateData, ClimateStatistics
from apps.chatbot.services import NewsCurationService, ClimateDataService

logger = logging.getLogger(__name__)
User = get_user_model()


@shared_task
def send_weekly_summary():
    """Send weekly summary notifications to all users"""
    try:
        logger.info("Starting weekly summary task")
        
        # Get all active users
        users = User.objects.filter(is_active=True)
        
        for user in users:
            # Calculate user's weekly stats
            week_ago = timezone.now() - timedelta(days=7)
            
            # Get carbon entries from last week
            from apps.carbon.models import CarbonEntry
            weekly_entries = CarbonEntry.objects.filter(
                user=user,
                created_at__gte=week_ago
            )
            
            total_co2 = sum(entry.co2_calculated for entry in weekly_entries)
            entries_count = weekly_entries.count()
            
            # Get challenges completed
            from apps.gamification.models import UserChallenge
            challenges_completed = UserChallenge.objects.filter(
                user=user,
                completed_at__gte=week_ago,
                status='COMPLETED'
            ).count()
            
            # Get achievements earned
            from apps.gamification.models import UserAchievement
            achievements_earned = UserAchievement.objects.filter(
                user=user,
                earned_at__gte=week_ago
            ).count()
            
            # Create notification
            content = f"""Weekly EcoSphere Summary:
            
• Carbon tracked: {total_co2:.1f} kg CO2 ({entries_count} entries)
• Challenges completed: {challenges_completed}
• Achievements earned: {achievements_earned}
• Current points: {user.total_points}

Keep up the great work! 🌱"""
            
            Notification.objects.create(
                user=user,
                notification_type='WEEKLY_SUMMARY',
                title='Weekly EcoSphere Summary',
                content=content,
                priority='MEDIUM',
                icon='📊'
            )
        
        logger.info(f"Weekly summary sent to {users.count()} users")
        
    except Exception as e:
        logger.error(f"Error in weekly summary task: {e}")


@shared_task
def fetch_and_curate_news():
    """Fetch and curate climate news articles"""
    try:
        logger.info("Starting news curation task")
        
        # Mock news sources (in production, integrate with real news APIs)
        mock_articles = [
            {
                'title': 'Global CO2 Levels Reach New Record High',
                'content': 'Scientists report that atmospheric CO2 concentrations have reached 420.5 ppm, the highest level in human history. This represents a significant increase from pre-industrial levels of 280 ppm.',
                'source': 'Climate Science Journal',
                'url': 'https://example.com/co2-record',
                'published_date': timezone.now() - timedelta(hours=2)
            },
            {
                'title': 'Renewable Energy Surpasses Coal in Global Electricity Generation',
                'content': 'For the first time in history, renewable energy sources have generated more electricity globally than coal-fired power plants. Solar and wind power lead the transition.',
                'source': 'Energy Report',
                'url': 'https://example.com/renewable-milestone',
                'published_date': timezone.now() - timedelta(hours=5)
            },
            {
                'title': 'Arctic Ice Extent Shows Continued Decline',
                'content': 'Satellite data reveals that Arctic sea ice extent has reached its second-lowest level on record, continuing a decades-long trend of decline due to global warming.',
                'source': 'Polar Research Institute',
                'url': 'https://example.com/arctic-ice',
                'published_date': timezone.now() - timedelta(hours=8)
            }
        ]
        
        curation_service = NewsCurationService()
        
        for article_data in mock_articles:
            # Check if article already exists
            if NewsArticle.objects.filter(url=article_data['url']).exists():
                continue
            
            # Summarize and categorize
            summary = curation_service.summarize_article(
                article_data['title'], 
                article_data['content']
            )
            category = curation_service.categorize_article(
                article_data['title'], 
                article_data['content']
            )
            
            # Create article
            NewsArticle.objects.create(
                title=article_data['title'],
                summary=summary,
                content=article_data['content'],
                source=article_data['source'],
                url=article_data['url'],
                category=category,
                published_date=article_data['published_date']
            )
        
        logger.info(f"Processed {len(mock_articles)} news articles")
        
    except Exception as e:
        logger.error(f"Error in news curation task: {e}")


@shared_task
def update_climate_data():
    """Update climate statistics and data"""
    try:
        logger.info("Starting climate data update task")
        
        climate_service = ClimateDataService()
        stats = climate_service.fetch_climate_statistics()
        
        # Update climate statistics
        ClimateStatistics.objects.update_or_create(
            stat_type='GLOBAL_CO2',
            period='daily',
            date=timezone.now().date(),
            defaults={
                'current_value': stats['global_co2'],
                'unit': 'ppm',
                'source': 'Open-Meteo API'
            }
        )
        
        ClimateStatistics.objects.update_or_create(
            stat_type='GLOBAL_TEMP',
            period='daily',
            date=timezone.now().date(),
            defaults={
                'current_value': stats['global_temp_anomaly'],
                'unit': '°C',
                'source': 'Climate Data Service'
            }
        )
        
        ClimateStatistics.objects.update_or_create(
            stat_type='ARCTIC_ICE_EXTENT',
            period='daily',
            date=timezone.now().date(),
            defaults={
                'current_value': stats['arctic_ice_extent'],
                'unit': 'M km²',
                'source': 'Polar Research'
            }
        )
        
        ClimateStatistics.objects.update_or_create(
            stat_type='SEA_LEVEL_RISE',
            period='daily',
            date=timezone.now().date(),
            defaults={
                'current_value': stats['sea_level_rise'],
                'unit': 'mm/year',
                'source': 'Ocean Monitoring'
            }
        )
        
        logger.info("Climate data updated successfully")
        
    except Exception as e:
        logger.error(f"Error updating climate data: {e}")


@shared_task
def check_achievement_criteria():
    """Check and unlock achievements for users"""
    try:
        logger.info("Starting achievement check task")
        
        from apps.gamification.models import Achievement, UserAchievement
        from apps.carbon.models import CarbonEntry
        
        # Get all users
        users = User.objects.filter(is_active=True)
        
        for user in users:
            # Check each achievement
            achievements = Achievement.objects.filter(is_active=True)
            
            for achievement in achievements:
                # Skip if user already has this achievement
                if UserAchievement.objects.filter(user=user, achievement=achievement).exists():
                    continue
                
                unlocked = False
                
                if achievement.criteria_type == 'points':
                    if user.total_points >= achievement.criteria_value:
                        unlocked = True
                
                elif achievement.criteria_type == 'carbon_reduction':
                    # Calculate total CO2 reduced (simplified)
                    total_co2 = CarbonEntry.objects.filter(user=user).aggregate(
                        total=models.Sum('co2_calculated')
                    )['total'] or 0
                    
                    if total_co2 >= achievement.criteria_value:
                        unlocked = True
                
                elif achievement.criteria_type == 'streak':
                    if user.login_streak >= achievement.criteria_value:
                        unlocked = True
                
                elif achievement.criteria_type == 'entries':
                    entries_count = CarbonEntry.objects.filter(user=user).count()
                    if entries_count >= achievement.criteria_value:
                        unlocked = True
                
                # Unlock achievement if criteria met
                if unlocked:
                    UserAchievement.objects.create(
                        user=user,
                        achievement=achievement
                    )
                    
                    # Create notification
                    Notification.objects.create(
                        user=user,
                        notification_type='ACHIEVEMENT',
                        title=f'Achievement Unlocked: {achievement.name}',
                        content=f'Congratulations! You\'ve earned the "{achievement.name}" achievement.',
                        priority='HIGH',
                        icon='🏆',
                        reference_id=achievement.id
                    )
                    
                    logger.info(f"Unlocked achievement {achievement.name} for user {user.username}")
        
        logger.info("Achievement check completed")
        
    except Exception as e:
        logger.error(f"Error in achievement check task: {e}")


@shared_task
def cleanup_old_data():
    """Clean up old data to maintain performance"""
    try:
        logger.info("Starting data cleanup task")
        
        # Clean up old notifications (older than 30 days)
        cutoff_date = timezone.now() - timedelta(days=30)
        old_notifications = Notification.objects.filter(
            created_at__lt=cutoff_date,
            is_read=True
        )
        deleted_count = old_notifications.count()
        old_notifications.delete()
        
        # Clean up old climate data (older than 1 year)
        old_climate_data = ClimateData.objects.filter(
            date__lt=timezone.now().date() - timedelta(days=365)
        )
        climate_deleted_count = old_climate_data.count()
        old_climate_data.delete()
        
        logger.info(f"Cleaned up {deleted_count} old notifications and {climate_deleted_count} old climate data points")
        
    except Exception as e:
        logger.error(f"Error in data cleanup task: {e}")


@shared_task
def send_climate_alerts():
    """Check for and send climate alerts"""
    try:
        logger.info("Starting climate alerts task")
        
        # Mock climate alert check (in production, integrate with real alert systems)
        alert_conditions = [
            {
                'title': 'High Air Quality Alert',
                'description': 'Air quality index has reached unhealthy levels in your area. Consider limiting outdoor activities.',
                'severity': 'HIGH',
                'location': 'Major Cities',
                'alert_type': 'AIR_QUALITY'
            }
        ]
        
        for alert_data in alert_conditions:
            # Get users in affected areas (simplified - all users for demo)
            users = User.objects.filter(is_active=True)
            
            for user in users:
                # Create notification
                Notification.objects.create(
                    user=user,
                    notification_type='CLIMATE_ALERT',
                    title=alert_data['title'],
                    content=alert_data['description'],
                    priority=alert_data['severity'],
                    icon='⚠️'
                )
        
        logger.info("Climate alerts processed")
        
    except Exception as e:
        logger.error(f"Error in climate alerts task: {e}")
