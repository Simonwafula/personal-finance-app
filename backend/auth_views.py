# backend/auth_views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.contrib.auth import get_user_model, authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.mail import send_mail
from django.conf import settings
import os


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response(
            {
                "id": user.id,
                "username": user.get_username(),
                "email": user.email,
            }
        )


@api_view(["POST"])
@permission_classes([AllowAny])
def register_view(request: Request):
    """Simple registration endpoint: accepts email, password, optional username."""
    User = get_user_model()
    data = request.data or {}
    email = data.get("email")
    password = data.get("password")
    username = data.get("username") or email
    if not email or not password:
        return Response({"detail": "email and password required"}, status=status.HTTP_400_BAD_REQUEST)

    # Check existing
    if User.objects.filter(email__iexact=email).exists():
        return Response({"detail": "User with this email already exists"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)
    # Log the user in so the session cookie is set for subsequent requests
    try:
        # Ensure session contains authentication keys so SessionAuthentication works
        drf_req = request
        django_req = getattr(drf_req, '_request', drf_req)
        django_req.session['_auth_user_id'] = user.pk
        django_req.session['_auth_user_backend'] = django_req.session.get('_auth_user_backend') or 'django.contrib.auth.backends.ModelBackend'
        django_req.session['_auth_user_hash'] = user.get_session_auth_hash()
        django_req.session.save()
    except Exception:
        pass
    return Response({"id": user.id, "username": user.get_username(), "email": user.email}, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request: Request):
    """Simple login endpoint that accepts email/username + password and sets session."""
    User = get_user_model()
    data = request.data or {}
    identifier = data.get("email") or data.get("username")
    password = data.get("password")
    if not identifier or not password:
        return Response({"detail": "username/email and password required"}, status=status.HTTP_400_BAD_REQUEST)

    # If identifier looks like email, try to find username
    username = identifier
    if "@" in identifier:
        u = User.objects.filter(email__iexact=identifier).first()
        if u:
            username = u.get_username()

    user = authenticate(request, username=username, password=password)
    if user is None:
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        django_req = getattr(request, "_request", request)
        django_req.session["_auth_user_id"] = user.pk
        django_req.session["_auth_user_backend"] = django_req.session.get("_auth_user_backend") or "django.contrib.auth.backends.ModelBackend"
        django_req.session["_auth_user_hash"] = user.get_session_auth_hash()
        django_req.session.save()
    except Exception:
        pass

    return Response({"id": user.id, "username": user.get_username(), "email": user.email}, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def current_user_view(request: Request):
    """Get current authenticated user."""
    user = request.user
    return Response(
        {
            "id": user.id,
            "username": user.get_username(),
            "email": user.email,
        },
        status=status.HTTP_200_OK,
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
