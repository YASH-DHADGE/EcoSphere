"""
WSGI config for EcoSphere project.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecosphere.settings.prod')

application = get_wsgi_application()
