"""
ASGI config for space_aware project.
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'space_aware.settings')

application = get_asgi_application()