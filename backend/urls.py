from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.http import HttpResponse
from django.conf import settings
from django.conf.urls.static import static
from backend.auth_views import (
    CurrentUserView,
    register_view,
    login_view,
    forgot_password_view,
    reset_password_view,
)


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
        f"Sitemap: https://{settings.ALLOWED_HOSTS[0] if settings.ALLOWED_HOSTS else 'localhost'}/sitemap.xml",
    ]
    return HttpResponse("\n".join(lines), content_type="text/plain")


urlpatterns = [
    # Admin
    path("admin/", admin.site.urls),

    # Accounts (allauth)
    path("accounts/", include("allauth.urls")),

    # API Auth endpoints
    path("api/auth/me/", CurrentUserView.as_view()),
    path("api/auth/register/", register_view),
    path("api/auth/login/", login_view),
    path("api/auth/forgot-password/", forgot_password_view),
    path("api/auth/reset-password/", reset_password_view),
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

# Serve frontend - Django serves React SPA for all non-API routes
# This must be LAST to act as catch-all for SPA routing
urlpatterns += [
    path('', TemplateView.as_view(template_name='index.html'), name='home'),
    re_path(r'^(?!api/|admin/|accounts/|static/|media/).*$', 
            TemplateView.as_view(template_name='index.html'), name='spa_catchall'),
]
