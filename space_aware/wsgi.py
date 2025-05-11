"""
WSGI config for space_aware project.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'space_aware.settings')

application = get_wsgi_application()