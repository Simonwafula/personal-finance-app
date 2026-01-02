# backend/auth_views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from django.contrib.auth import get_user_model, authenticate, login
from django.contrib.auth import logout as django_logout
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)
from rest_framework.request import Request
from rest_framework.authentication import SessionAuthentication
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.mail import send_mail
from django.conf import settings
import os


def get_user_data_with_profile(user):
    """Helper function to return user data with profile information"""
    data = {
        "id": user.id,
        "username": user.get_username(),
        "email": user.email,
    }
    
    # Include profile data if it exists
    if hasattr(user, 'profile'):
        profile = user.profile
        data['profile'] = {
            'bio': profile.bio,
            'phone': profile.phone,
            'avatar_url': profile.avatar_url,
            'date_of_birth': (
                str(profile.date_of_birth) if profile.date_of_birth else None
            ),
            'country': profile.country,
            'city': profile.city,
        }
    
    return data


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(get_user_data_with_profile(request.user))


@api_view(["POST"])
@permission_classes([AllowAny])
def register_view(request: Request):
    """Registration endpoint: accepts email, password, optional username."""
    User = get_user_model()
    data = request.data or {}
    email = data.get("email")
    password = data.get("password")
    username = data.get("username") or email
    if not email or not password:
        return Response(
            {"detail": "email and password required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Check existing
    if User.objects.filter(email__iexact=email).exists():
        return Response(
            {"detail": "User with this email already exists"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(
        username=username, email=email, password=password
    )
    
    # Update profile with additional data if provided
    if hasattr(user, 'profile'):
        profile = user.profile
        profile.phone = data.get('phone', '')
        profile.bio = data.get('bio', '')
        profile.country = data.get('country', '')
        profile.city = data.get('city', '')
        profile.save()
    
    # Log the user in using Django's login function
    django_req = getattr(request, '_request', request)
    backend = 'django.contrib.auth.backends.ModelBackend'
    login(django_req, user, backend=backend)
    
    # Ensure session is saved
    django_req.session.save()
    
    return Response(
        get_user_data_with_profile(user),
        status=status.HTTP_201_CREATED
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request: Request):
    """Login endpoint: accepts email/username + password and sets session."""
    User = get_user_model()
    data = request.data or {}
    identifier = data.get("email") or data.get("username")
    password = data.get("password")
    if not identifier or not password:
        return Response(
            {"detail": "username/email and password required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # If identifier looks like email, try to find username
    username = identifier
    if "@" in identifier:
        u = User.objects.filter(email__iexact=identifier).first()
        if u:
            username = u.get_username()

    # Get the underlying Django request
    django_req = getattr(request, "_request", request)
    
    # Authenticate with the Django request
    user = authenticate(django_req, username=username, password=password)
    if user is None:
        return Response(
            {"detail": "Invalid credentials"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Use Django's login function to properly set up the session
    backend = "django.contrib.auth.backends.ModelBackend"
    login(django_req, user, backend=backend)
    
    # Ensure session is saved
    django_req.session.save()

    return Response(
        get_user_data_with_profile(user),
        status=status.HTTP_200_OK
    )


@csrf_exempt
@api_view(["GET"])
@authentication_classes([SessionAuthentication])
@permission_classes([AllowAny])
def current_user_view(request: Request):
    """
    Get current user without CSRF requirement.
    Returns 200 with user if authenticated, else 401.
    """
    if request.user and request.user.is_authenticated:
        return Response(
            get_user_data_with_profile(request.user),
            status=status.HTTP_200_OK,
        )
    return Response(
        {"detail": "Not authenticated"},
        status=status.HTTP_401_UNAUTHORIZED,
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def forgot_password_view(request: Request):
    """
    Request a password reset token via email.
    Accepts: { email }
    Returns: { message, detail }
    """
    User = get_user_model()
    data = request.data or {}
    email = data.get("email")

    if not email:
        return Response(
            {"detail": "Email is required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = User.objects.filter(email__iexact=email).first()
    if not user:
        # Don't reveal whether email exists (security best practice)
        return Response(
            {
                "message": (
                    "If an account exists with this email, "
                    "a reset link will be sent."
                )
            },
            status=status.HTTP_200_OK,
        )

    # Generate reset token
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(str(user.pk).encode())

    # Build reset URL for frontend
    reset_url = (
        f"{os.getenv('FRONTEND_URL', 'http://localhost:5174')}/"
        f"reset-password?uid={uid}&token={token}"
    )

    # Send email
    try:
        subject = "Reset Your Password"
        message = (
            f"Click the link below to reset your password:\n\n"
            f"{reset_url}\n\n"
            f"This link expires in 24 hours.\n\n"
            f"If you didn't request this, ignore this email."
        )
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL or "noreply@finance.local",
            [user.email],
            fail_silently=False,
        )
    except Exception as e:
        print(f"Error sending reset email: {e}")
        return Response(
            {"detail": "Failed to send reset email"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    return Response(
        {
            "message": (
                "If an account exists with this email, "
                "a reset link will be sent."
            )
        },
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def reset_password_view(request: Request):
    """
    Reset password using token sent to email.
    Accepts: { uid, token, new_password }
    Returns: { message } or error detail
    """
    User = get_user_model()
    data = request.data or {}
    uid = data.get("uid")
    token = data.get("token")
    new_password = data.get("new_password")

    if not all([uid, token, new_password]):
        return Response(
            {"detail": "uid, token, and new_password are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        user_pk = urlsafe_base64_decode(uid).decode()
        user = User.objects.get(pk=user_pk)
    except (User.DoesNotExist, ValueError, TypeError):
        return Response(
            {"detail": "Invalid or expired reset link"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Verify token
    if not default_token_generator.check_token(user, token):
        return Response(
            {"detail": "Invalid or expired reset link"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Set new password
    user.set_password(new_password)
    user.save()

    return Response(
        {"message": "Password reset successful. You can now log in."},
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_password_view(request: Request):
    """
    Change password for authenticated user.
    Accepts: { current_password, new_password }
    Returns: { message } or error detail
    """
    data = request.data or {}
    current_password = data.get("current_password")
    new_password = data.get("new_password")

    if not current_password or not new_password:
        return Response(
            {"detail": "current_password and new_password are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = request.user

    # Verify current password
    if not user.check_password(current_password):
        return Response(
            {"detail": "Current password is incorrect"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Set new password
    user.set_password(new_password)
    user.save()

    # Re-login to update session
    django_req = getattr(request, "_request", request)
    backend = "django.contrib.auth.backends.ModelBackend"
    login(django_req, user, backend=backend)

    return Response(
        {"message": "Password changed successfully"},
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_view(request: Request):
    """Log out the current user and clear the session."""
    django_req = getattr(request, "_request", request)
    django_logout(django_req)
    try:
        django_req.session.flush()
    except Exception:
        # If session is already cleared, ignore.
        pass
    return Response({"message": "Logged out"}, status=status.HTTP_200_OK)
