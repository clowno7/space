from django.urls import path
from . import views

urlpatterns = [
    path('apod/', views.get_apod, name='apod'),
    path('space-images/', views.get_space_images, name='space-images'),
    path('chat/', views.chat_response, name='chat'),
    path('debris/', views.space_debris, name='debris'),
]