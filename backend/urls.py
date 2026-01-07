from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView, RedirectView
from django.http import HttpResponse, JsonResponse
from django.conf import settings
from django.conf.urls.static import static
from backend.auth_views import (
    CurrentUserView,
    register_view,
    login_view,
    forgot_password_view,
    reset_password_view,
    change_password_view,
    logout_view,
)
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
import os


def favicon_view(request):
    """Return empty response for favicon to prevent 500 errors."""
    return HttpResponse(status=204)


def robots_txt_view(request):
    """Return robots.txt."""
    lines = [
        "User-agent: *",
        "Disallow: /admin/",
        "Disallow: /api/",
        "Allow: /",
    ]
    if settings.ALLOWED_HOSTS:
        lines.append(f"Sitemap: https://{settings.ALLOWED_HOSTS[0]}/sitemap.xml")
    return HttpResponse("\n".join(lines), content_type="text/plain")


def health_check(request):
    """Simple health check endpoint for monitoring."""
    return JsonResponse({'status': 'healthy', 'service': 'finance-app'})


def google_login_check(request):
    """Check if Google OAuth is configured before redirecting."""
    google_client_id = os.getenv('GOOGLE_CLIENT_ID', '')
    if not google_client_id:
        return JsonResponse({
            'error': 'Google OAuth not configured',
            'message': 'GOOGLE_CLIENT_ID is not set in environment variables. '
                      'Please add your Google OAuth credentials to the .env file.',
            'help': 'Get credentials from: https://console.cloud.google.com/apis/credentials'
        }, status=503)
    # If configured, let allauth handle it
    from allauth.socialaccount.providers.google.views import oauth2_login
    return oauth2_login(request)


urlpatterns = [
    # Admin
    path("admin/", admin.site.urls),
    
    # Health check for monitoring
    path("api/health/", health_check, name="health_check"),
    # OpenAPI schema and UI
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    
    # Google OAuth - custom check before allauth handles it
    path("accounts/google/login/", google_login_check, name="google_login_check"),
    path("accounts/", include("allauth.urls")),
    
    # API Auth endpoints
    path("api/auth/me/", CurrentUserView.as_view()),
    path("api/auth/register/", register_view),
    path("api/auth/login/", login_view),
    path("api/auth/forgot-password/", forgot_password_view),
    path("api/auth/reset-password/", reset_password_view),
    path("api/auth/change-password/", change_password_view),
    path("api/auth/logout/", logout_view),
    path("api/auth/profile/", include("profiles.urls")),
    
    # API endpoints
    path("api/finance/", include("finance.urls")),
    path("api/budgeting/", include("budgeting.urls")),
    path("api/wealth/", include("wealth.urls")),
    path("api/debt/", include("debt_planner.urls")),
    path("api/savings/", include("savings.urls")),
    path("api/investments/", include("investments.urls")),
    path("api/", include("notifications.urls")),
    
    # Static file helpers
    path("favicon.ico", favicon_view),
    path("robots.txt", robots_txt_view),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )
    # Dev: redirect backend root to frontend dev server
    urlpatterns += [
        path("", RedirectView.as_view(url="http://localhost:5173/")),
    ]
else:
    # Production: Serve frontend - Django serves React SPA for all non-API routes
    # This must be LAST to act as catch-all for SPA routing
    urlpatterns += [
        path('', TemplateView.as_view(template_name='index.html'), name='home'),
        re_path(r'^(?!api/|admin/|accounts/|static/|media/).*$', 
                TemplateView.as_view(template_name='index.html'), name='spa_catchall'),
    ]
