from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from django.conf import settings

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecosphere.settings.dev')

app = Celery('ecosphere')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()

# Celery Beat schedule
app.conf.beat_schedule = {
    'weekly-summary': {
        'task': 'apps.notifications.tasks.send_weekly_summary',
        'schedule': 60.0 * 60.0 * 24.0 * 7.0,  # Every Sunday
    },
    'fetch-news': {
        'task': 'apps.notifications.tasks.fetch_and_curate_news',
        'schedule': 60.0 * 60.0 * 6.0,  # Every 6 hours
    },
    'update-climate-data': {
        'task': 'apps.notifications.tasks.update_climate_data',
        'schedule': 60.0 * 60.0,  # Every hour
    },
    'check-achievements': {
        'task': 'apps.notifications.tasks.check_achievement_criteria',
        'schedule': 60.0 * 60.0 * 24.0,  # Daily
    },
    'cleanup-data': {
        'task': 'apps.notifications.tasks.cleanup_old_data',
        'schedule': 60.0 * 60.0 * 24.0 * 7.0,  # Weekly
    },
    'climate-alerts': {
        'task': 'apps.notifications.tasks.send_climate_alerts',
        'schedule': 60.0 * 30.0,  # Every 30 minutes
    },
}

app.conf.timezone = 'UTC'

@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
