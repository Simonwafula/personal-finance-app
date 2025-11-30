from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from backend.auth_views import (
    CurrentUserView,
    register_view,
    login_view,
    forgot_password_view,
    reset_password_view,
)

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
    path("api/", include("notifications.urls")),
    # Dev: redirect backend root to frontend
    path("", RedirectView.as_view(url="http://localhost:5173/")),
]
