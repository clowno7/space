from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
import requests
from huggingface_hub import InferenceClient
from django.conf import settings
import random
import logging

logger = logging.getLogger(__name__)

NASA_API_KEY = settings.NASA_API_KEY
HF_API_KEY = settings.HF_API_KEY

# Fallback image data
FALLBACK_IMAGE = {
    'url': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
    'title': 'Space View',
    'explanation': 'Unable to load image at this time.',
    'date': '2024-01-01',
    'copyright': ''
}

def format_nasa_response(data):
    """Format NASA API response to match expected structure"""
    return {
        'url': data.get('url', FALLBACK_IMAGE['url']),
        'title': data.get('title', FALLBACK_IMAGE['title']),
        'explanation': data.get('explanation', FALLBACK_IMAGE['explanation']),
        'date': data.get('date', FALLBACK_IMAGE['date']),
        'copyright': data.get('copyright', '')
    }

@api_view(['GET'])
def get_apod(request):
    try:
        if not NASA_API_KEY or NASA_API_KEY == 'DEMO_KEY':
            logger.warning('NASA API key not configured, using fallback data')
            return Response(FALLBACK_IMAGE)

        response = requests.get(
            f'https://api.nasa.gov/planetary/apod?api_key={NASA_API_KEY}',
            timeout=5
        )
        
        if not response.ok:
            logger.error(f'NASA API error: {response.status_code} - {response.text}')
            return Response(FALLBACK_IMAGE)

        data = response.json()
        formatted_data = format_nasa_response(data)
        return Response(formatted_data)
    except requests.RequestException as e:
        logger.error(f'Request error in get_apod: {str(e)}')
        return Response(FALLBACK_IMAGE)
    except Exception as e:
        logger.error(f'Unexpected error in get_apod: {str(e)}')
        return Response(FALLBACK_IMAGE)

@api_view(['GET'])
def get_space_images(request):
    count = min(int(request.GET.get('count', 10)), 20)  # Limit max count to 20
    try:
        if not NASA_API_KEY or NASA_API_KEY == 'DEMO_KEY':
            logger.warning('NASA API key not configured, using fallback data')
            return Response([FALLBACK_IMAGE] * count)

        response = requests.get(
            f'https://api.nasa.gov/planetary/apod?api_key={NASA_API_KEY}&count={count}',
            timeout=5
        )
        
        if not response.ok:
            logger.error(f'NASA API error: {response.status_code} - {response.text}')
            return Response([FALLBACK_IMAGE] * count)

        data = response.json()
        images = [format_nasa_response(item) for item in data]
        return Response(images)
    except requests.RequestException as e:
        logger.error(f'Request error in get_space_images: {str(e)}')
        return Response([FALLBACK_IMAGE] * count)
    except Exception as e:
        logger.error(f'Unexpected error in get_space_images: {str(e)}')
        return Response([FALLBACK_IMAGE] * count)

@api_view(['POST'])
def chat_response(request):
    message = request.data.get('message', '')
    try:
        if not HF_API_KEY or HF_API_KEY == 'hf_demo':
            return Response({
                'response': "I'm here to help you learn about space! You can ask me about satellites, space debris, astronomy, or space exploration."
            })

        client = InferenceClient(token=HF_API_KEY)
        response = client.text_generation(
            model="OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5",
            prompt=f"You are a helpful AI assistant specializing in astronomy and space science.\nUser: {message}\nAssistant:",
            max_new_tokens=200,
            temperature=0.7,
            top_p=0.95,
            repetition_penalty=1.2,
        )
        return Response({'response': response})
    except Exception as e:
        logger.error(f'Error in chat_response: {str(e)}')
        return Response({
            'response': "I'm here to help you learn about space! You can ask me about satellites, space debris, astronomy, or space exploration."
        })

@api_view(['GET'])
def space_debris(request):
    try:
        debris = []
        num_debris = 50
        for i in range(num_debris):
            object_type = 'debris' if random.random() > 0.7 else 'satellite'
            
            # More realistic altitude distribution
            if object_type == 'debris':
                altitude = random.uniform(200, 2000)  # Debris tends to be lower
            else:
                altitude = random.uniform(300, 36000) # Satellites can be much higher

            # More realistic risk distribution (higher chance of low risk)
            risk_options = ['low', 'medium', 'high']
            risk_weights = [0.7, 0.2, 0.1]  # Probabilities for low, medium, high risk
            risk = random.choices(risk_options, risk_weights)[0]

            debris.append({
                'id': f'debris-{i}',
                'name': f'Space Object {i}',
                'type': object_type,
                'coordinates': {
                    'lat': random.uniform(-90, 90),
                    'lng': random.uniform(-180, 180),
                },
                'altitude': altitude,
                'velocity': random.uniform(5, 25),
                'risk': risk,
            })
        return Response(debris)
    except Exception as e:
        logger.error(f'Error in space_debris: {str(e)}')
        return Response([])

@api_view(['GET'])
def alerts(request):
    alerts_data = [
        {
            "title": "High-Risk Collision Detected",
            "time": "2 minutes ago",
            "severity": "high",
        },
        {
            "title": "New Debris Field Identified",
            "time": "15 minutes ago",
            "severity": "medium",
        },
        {
            "title": "Satellite Path Adjustment Required",
            "time": "1 hour ago",
            "severity": "low",
        },
    ]
    return Response(alerts_data)

from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    try:
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({'error': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=email, email=email, password=password)
        token = Token.objects.create(user=user)
        return Response({'token': token.key}, status=status.HTTP_201_CREATED)

    except Exception as e:
        logger.exception(f"Error during registration: {e}")
        return Response({'error': 'Registration failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
