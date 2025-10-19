from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.gamification.models import Challenge, Achievement, UserAchievement
from apps.news.models import NewsArticle
from apps.climate_data.models import ClimateData, ClimateStatistics
from apps.carbon.models import CarbonEntry
from datetime import datetime, timedelta
import random

User = get_user_model()


class Command(BaseCommand):
    help = 'Seed the database with sample data'

    def handle(self, *args, **options):
        self.stdout.write('Starting to seed database...')
        
        # Create demo users
        self.create_demo_users()
        
        # Create challenges
        self.create_challenges()
        
        # Create achievements
        self.create_achievements()
        
        # Create news articles
        self.create_news_articles()
        
        # Create climate data
        self.create_climate_data()
        
        # Create sample carbon entries
        self.create_carbon_entries()
        
        self.stdout.write(
            self.style.SUCCESS('Successfully seeded database with sample data!')
        )

    def create_demo_users(self):
        """Create demo users for testing"""
        users_data = [
            {
                'username': 'demo_user',
                'email': 'demo@ecosphere.com',
                'role': 'INDIVIDUAL',
                'location': 'San Francisco, CA',
                'bio': 'Environmental enthusiast',
                'total_points': 150,
                'login_streak': 5
            },
            {
                'username': 'eco_warrior',
                'email': 'warrior@ecosphere.com',
                'role': 'INDIVIDUAL',
                'location': 'New York, NY',
                'bio': 'Climate activist',
                'total_points': 300,
                'login_streak': 12
            },
            {
                'username': 'green_ngo',
                'email': 'ngo@ecosphere.com',
                'role': 'NGO',
                'location': 'Seattle, WA',
                'bio': 'Environmental NGO',
                'total_points': 500,
                'login_streak': 8
            },
            {
                'username': 'admin_user',
                'email': 'admin@ecosphere.com',
                'role': 'ADMIN',
                'location': 'Boston, MA',
                'bio': 'Platform administrator',
                'total_points': 1000,
                'login_streak': 30
            }
        ]
        
        for user_data in users_data:
            user, created = User.objects.get_or_create(
                username=user_data['username'],
                defaults=user_data
            )
            if created:
                self.stdout.write(f'Created user: {user.username}')
            else:
                self.stdout.write(f'User already exists: {user.username}')

    def create_challenges(self):
        """Create sample challenges"""
        challenges_data = [
            {
                'name': 'Weekly Public Transport Challenge',
                'description': 'Use public transportation for at least 5 trips this week',
                'challenge_type': 'WEEKLY',
                'points_reward': 50,
                'duration_days': 7,
                'target_value': 5,
                'target_unit': 'trips',
                'category': 'Transportation',
                'start_date': datetime.now(),
                'end_date': datetime.now() + timedelta(days=7)
            },
            {
                'name': 'Monthly Energy Reduction',
                'description': 'Reduce your electricity consumption by 20% this month',
                'challenge_type': 'MONTHLY',
                'points_reward': 100,
                'duration_days': 30,
                'target_value': 20,
                'target_unit': '%',
                'category': 'Energy',
                'start_date': datetime.now(),
                'end_date': datetime.now() + timedelta(days=30)
            },
            {
                'name': 'Community Tree Planting',
                'description': 'Plant 3 trees and upload verification photos',
                'challenge_type': 'COMMUNITY',
                'points_reward': 75,
                'duration_days': 14,
                'target_value': 3,
                'target_unit': 'trees',
                'category': 'Nature',
                'start_date': datetime.now(),
                'end_date': datetime.now() + timedelta(days=14)
            },
            {
                'name': 'Zero Waste Week',
                'description': 'Generate less than 1kg of waste this week',
                'challenge_type': 'WEEKLY',
                'points_reward': 60,
                'duration_days': 7,
                'target_value': 1,
                'target_unit': 'kg',
                'category': 'Waste',
                'start_date': datetime.now(),
                'end_date': datetime.now() + timedelta(days=7)
            }
        ]
        
        for challenge_data in challenges_data:
            challenge, created = Challenge.objects.get_or_create(
                name=challenge_data['name'],
                defaults=challenge_data
            )
            if created:
                self.stdout.write(f'Created challenge: {challenge.name}')

    def create_achievements(self):
        """Create sample achievements"""
        achievements_data = [
            {
                'name': 'Green Warrior',
                'description': 'Reduce 100kg of CO2 emissions',
                'badge_icon': '🌱',
                'points_required': 100,
                'criteria_type': 'carbon_reduction',
                'criteria_value': 100,
                'category': 'Carbon Reduction'
            },
            {
                'name': 'Transit Hero',
                'description': 'Use public transport for 30 consecutive days',
                'badge_icon': '🚌',
                'points_required': 200,
                'criteria_type': 'streak',
                'criteria_value': 30,
                'category': 'Transportation'
            },
            {
                'name': 'Plant Pioneer',
                'description': 'Plant 10 trees',
                'badge_icon': '🌳',
                'points_required': 150,
                'criteria_type': 'entries',
                'criteria_value': 10,
                'category': 'Nature'
            },
            {
                'name': 'EcoSphere Champion',
                'description': 'Reach top 10 in global leaderboard',
                'badge_icon': '🏆',
                'points_required': 500,
                'criteria_type': 'points',
                'criteria_value': 500,
                'category': 'Achievement'
            },
            {
                'name': 'Consistent Tracker',
                'description': 'Log carbon entries for 7 consecutive days',
                'badge_icon': '📊',
                'points_required': 75,
                'criteria_type': 'streak',
                'criteria_value': 7,
                'category': 'Tracking'
            }
        ]
        
        for achievement_data in achievements_data:
            achievement, created = Achievement.objects.get_or_create(
                name=achievement_data['name'],
                defaults=achievement_data
            )
            if created:
                self.stdout.write(f'Created achievement: {achievement.name}')

    def create_news_articles(self):
        """Create sample news articles"""
        articles_data = [
            {
                'title': 'Global CO2 Levels Reach New Record High',
                'summary': 'Scientists report that atmospheric CO2 concentrations have reached 420.5 ppm, the highest level in human history. This represents a significant increase from pre-industrial levels of 280 ppm and highlights the urgent need for climate action.',
                'content': 'Atmospheric carbon dioxide levels have reached a new record high of 420.5 parts per million (ppm), according to the latest measurements from the Mauna Loa Observatory. This represents the highest concentration of CO2 in the atmosphere in human history, surpassing the previous record set just last year. The increase continues a decades-long trend of rising greenhouse gas concentrations that are driving global climate change.',
                'source': 'Climate Science Journal',
                'url': 'https://example.com/co2-record',
                'category': 'SCIENCE',
                'published_date': datetime.now() - timedelta(hours=2)
            },
            {
                'title': 'Renewable Energy Surpasses Coal in Global Electricity Generation',
                'summary': 'For the first time in history, renewable energy sources have generated more electricity globally than coal-fired power plants. Solar and wind power lead the transition, marking a significant milestone in the clean energy revolution.',
                'content': 'Renewable energy sources have achieved a historic milestone by generating more electricity globally than coal-fired power plants for the first time. Solar and wind power are leading this transition, with solar capacity increasing by 22% and wind capacity by 12% compared to the previous year. This shift represents a major step forward in the global transition to clean energy.',
                'source': 'Energy Report',
                'url': 'https://example.com/renewable-milestone',
                'category': 'SOLUTIONS',
                'published_date': datetime.now() - timedelta(hours=5)
            },
            {
                'title': 'Arctic Ice Extent Shows Continued Decline',
                'summary': 'Satellite data reveals that Arctic sea ice extent has reached its second-lowest level on record, continuing a decades-long trend of decline due to global warming. The loss of ice has significant implications for global climate patterns.',
                'content': 'New satellite data from the National Snow and Ice Data Center shows that Arctic sea ice extent has reached its second-lowest level on record. The ice cover measured 3.74 million square kilometers, continuing a decades-long trend of decline attributed to rising global temperatures. The loss of Arctic ice has far-reaching implications for global climate patterns and local ecosystems.',
                'source': 'Polar Research Institute',
                'url': 'https://example.com/arctic-ice',
                'category': 'SCIENCE',
                'published_date': datetime.now() - timedelta(hours=8)
            }
        ]
        
        for article_data in articles_data:
            article, created = NewsArticle.objects.get_or_create(
                title=article_data['title'],
                defaults=article_data
            )
            if created:
                self.stdout.write(f'Created article: {article.title}')

    def create_climate_data(self):
        """Create sample climate data"""
        # Create historical climate data
        for i in range(12):  # Last 12 months
            date = datetime.now() - timedelta(days=i*30)
            
            ClimateData.objects.get_or_create(
                data_type='CO2_LEVELS',
                date=date.date(),
                defaults={
                    'value': 415 + (i * 0.5) + random.uniform(-0.2, 0.2),
                    'unit': 'ppm',
                    'source': 'Mauna Loa Observatory'
                }
            )
            
            ClimateData.objects.get_or_create(
                data_type='TEMPERATURE_ANOMALY',
                date=date.date(),
                defaults={
                    'value': 0.8 + (i * 0.05) + random.uniform(-0.1, 0.1),
                    'unit': '°C',
                    'source': 'NOAA'
                }
            )
        
        # Create climate statistics
        ClimateStatistics.objects.get_or_create(
            stat_type='GLOBAL_CO2',
            period='daily',
            date=datetime.now().date(),
            defaults={
                'current_value': 420.5,
                'unit': 'ppm',
                'source': 'Mauna Loa Observatory'
            }
        )
        
        ClimateStatistics.objects.get_or_create(
            stat_type='GLOBAL_TEMP',
            period='daily',
            date=datetime.now().date(),
            defaults={
                'current_value': 1.2,
                'unit': '°C',
                'source': 'NOAA'
            }
        )
        
        self.stdout.write('Created climate data')

    def create_carbon_entries(self):
        """Create sample carbon entries for demo users"""
        users = User.objects.filter(role='INDIVIDUAL')
        
        for user in users:
            # Create some sample entries
            entries_data = [
                {
                    'category': 'DOMESTIC',
                    'subcategory': 'ELECTRICITY',
                    'value': random.uniform(200, 400),
                    'unit': 'kWh',
                    'co2_calculated': random.uniform(80, 160),
                    'date': datetime.now() - timedelta(days=random.randint(1, 30)),
                    'notes': 'Monthly electricity usage'
                },
                {
                    'category': 'TRANSPORTATION',
                    'subcategory': 'CAR',
                    'value': random.uniform(100, 300),
                    'unit': 'km',
                    'co2_calculated': random.uniform(20, 60),
                    'date': datetime.now() - timedelta(days=random.randint(1, 30)),
                    'notes': 'Daily commute'
                },
                {
                    'category': 'DOMESTIC',
                    'subcategory': 'WATER',
                    'value': random.uniform(1000, 2000),
                    'unit': 'liters',
                    'co2_calculated': random.uniform(0.3, 0.6),
                    'date': datetime.now() - timedelta(days=random.randint(1, 30)),
                    'notes': 'Monthly water usage'
                }
            ]
            
            for entry_data in entries_data:
                CarbonEntry.objects.create(
                    user=user,
                    **entry_data
                )
        
        self.stdout.write('Created sample carbon entries')
