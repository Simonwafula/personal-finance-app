from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
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
    ]
    return HttpResponse("\n".join(lines), content_type="text/plain")


urlpatterns = [
    path("admin/", admin.site.urls),
    path("accounts/", include("allauth.urls")),  # <-- allauth
    path("api/auth/me/", CurrentUserView.as_view()),
    path("api/auth/register/", register_view),
    path("api/auth/login/", login_view),
    path("api/auth/forgot-password/", forgot_password_view),
    path("api/auth/reset-password/", reset_password_view),
    path("api/auth/profile/", include("profiles.urls")),
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
    # Dev: redirect backend root to frontend
    path("", RedirectView.as_view(url="http://localhost:5173/")),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )
