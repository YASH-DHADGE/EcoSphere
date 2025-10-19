"""
EcoSphere URL Configuration
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods

@require_http_methods(["GET"])
def api_root(request):
    """Root API endpoint with information about available endpoints"""
    return JsonResponse({
        'message': 'Welcome to EcoSphere API',
        'version': '1.0.0',
        'description': 'Climate Change Awareness and Carbon Tracking Platform',
        'endpoints': {
            'admin': '/admin/',
            'authentication': '/api/auth/',
            'user_registration': '/api/auth/registration/',
            'users': '/api/users/',
            'carbon_tracking': '/api/carbon/',
            'gamification': '/api/gamification/',
            'news': '/api/news/',
            'notifications': '/api/notifications/',
            'chatbot': '/api/chatbot/',
            'climate_data': '/api/climate/',
        },
        'documentation': 'API documentation available at /api/docs/ (if configured)',
        'status': 'operational'
    })

urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    path('api/users/', include('apps.users.urls')),
    path('api/carbon/', include('apps.carbon.urls')),
    path('api/gamification/', include('apps.gamification.urls')),
    path('api/news/', include('apps.news.urls')),
    path('api/notifications/', include('apps.notifications.urls')),
    path('api/chatbot/', include('apps.chatbot.urls')),
    path('api/climate/', include('apps.climate_data.urls')),
]

# Serve static and media files in development
if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        path('__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
