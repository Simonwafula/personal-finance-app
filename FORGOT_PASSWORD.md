# Forgot Password Feature

## Overview

The personal finance app now includes a complete password reset flow that allows users to securely reset their forgotten passwords via email.

## Features

✅ **Password Reset Request** - Users can request a password reset by providing their email  
✅ **Secure Tokens** - Django's built-in `default_token_generator` creates secure, time-limited tokens  
✅ **Email Verification** - Password reset links are sent to the user's registered email  
✅ **Security Best Practices**  
  - Email existence is not revealed (returns same message whether email exists or not)  
  - Tokens expire after 24 hours (configurable via `PASSWORD_RESET_TIMEOUT`)  
  - Tokens are single-use and tied to the user account  
✅ **User-Friendly UI** - Dedicated pages for requesting reset and setting new password  

## Backend API Endpoints

### 1. Request Password Reset
**POST** `/api/auth/forgot-password/`

Request:
```json
{
  "email": "user@example.com"
}
```

Response (200 OK):
```json
{
  "message": "If an account exists with this email, a reset link will be sent."
}
```

**Note:** The response is identical whether the email exists or not (security best practice).

---

### 2. Reset Password with Token
**POST** `/api/auth/reset-password/`

Request:
```json
{
  "uid": "base64-encoded-user-id",
  "token": "password-reset-token",
  "new_password": "NewSecurePassword123!"
}
```

Response (200 OK):
```json
{
  "message": "Password reset successful. You can now log in."
}
```

Error Response (400 Bad Request):
```json
{
  "detail": "Invalid or expired reset link"
}
```

---

## Frontend UI

### 1. ForgotPasswordPage (`/forgot-password`)
- Email input field
- "Send Reset Link" button
- Status messages (loading, success, error)
- "Back to login" link
- Auto-redirects to login after successful submission

### 2. ResetPasswordPage (`/reset-password`)
- Extracts `uid` and `token` from URL search params
- New password input
- Confirm password input
- Validation:
  - Passwords must match
  - Password minimum 8 characters
  - Invalid/expired tokens show error
- Success message and auto-redirect to login

### 3. LoginPage Updates
- Added "Forgot password?" link pointing to `/forgot-password`
- Visible below the Sign In button

---

## Development Email Configuration

In **development mode** (`DEBUG=True`), emails are printed to the console:

```
Content-Type: text/plain; charset="utf-8"
MIME-Version: 1.0
Content-Transfer-Encoding: 7bit
Subject: Reset Your Password
From: noreply@finance-dev.local
To: user@example.com
Date: Mon, 01 Jan 2024 12:00:00 -0000

Click the link below to reset your password:

http://localhost:5174/reset-password?uid=MTI=&token=abc123def456

This link expires in 24 hours.

If you didn't request this, ignore this email.
```

### Example Console Output:
1. User enters email and clicks "Send Reset Link"
2. Check Django server console for the reset URL
3. Copy the `uid` and `token` from the URL
4. Navigate to `http://localhost:5174/reset-password?uid={uid}&token={token}`
5. Enter new password and confirm
6. Submit to complete the reset

---

## Production Email Configuration

In **production** (`DEBUG=False`), configure SMTP via environment variables:

```bash
# .env (production)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-app-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=noreply@yourdomain.com
PASSWORD_RESET_TIMEOUT=86400  # 24 hours in seconds
FRONTEND_URL=https://yourdomain.com
```

### Google Gmail Setup:
1. Enable 2-Step Verification on your Google Account
2. Generate an App Password (not your regular password)
3. Use the App Password in `EMAIL_HOST_PASSWORD`

### Other Email Providers:
- **SendGrid**: `EMAIL_HOST=smtp.sendgrid.net`, `EMAIL_PORT=587`
- **Mailgun**: `EMAIL_HOST=smtp.mailgun.org`, `EMAIL_PORT=587`
- **AWS SES**: `EMAIL_HOST=email-smtp.{region}.amazonaws.com`, `EMAIL_PORT=587`

---

## Testing

### Manual Testing (Development)
1. Run the Django server: `python manage.py runserver`
2. Run the Vite server: `npm run dev` (from `client/`)
3. Navigate to `http://localhost:5174/login`
4. Click "Forgot password?"
5. Enter your email
6. Check Django console for the reset link
7. Click the link or paste it in the browser
8. Enter new password and confirm
9. Login with new password

### Automated Testing
Run the test script:
```bash
./test_password_reset.sh
```

This script:
- Creates a test user
- Requests a password reset
- Verifies error handling for invalid tokens
- Verifies error handling for missing fields
- Confirms all responses have expected format

---

## Security Considerations

✅ **Token Security**
- Tokens are cryptographically signed
- Tokens expire after 24 hours
- Tokens are tied to the user account (can't be reused for another user)
- Tokens are single-use (changes on each password reset request)

✅ **Email Privacy**
- The forgot-password endpoint doesn't reveal whether an email exists
- Same response returned for valid and invalid emails

✅ **Password Security**
- Passwords are hashed using Django's `set_password()` method
- Old sessions are invalidated on password change (user must re-login)

✅ **HTTPS Only** (Production)
- Email links only work over HTTPS in production
- SESSION_COOKIE_SECURE and CSRF_COOKIE_SECURE are enabled

---

## Configuration Reference

| Setting | Default | Description |
|---------|---------|-------------|
| `PASSWORD_RESET_TIMEOUT` | 86400 | Token expiration time in seconds (24 hours) |
| `FRONTEND_URL` | `http://localhost:5174` | Frontend URL for password reset links |
| `EMAIL_BACKEND` | Console (dev) / SMTP (prod) | Email sending backend |
| `EMAIL_HOST` | `smtp.gmail.com` | SMTP server hostname |
| `EMAIL_PORT` | 587 | SMTP server port |
| `EMAIL_USE_TLS` | True | Use TLS for SMTP connection |
| `EMAIL_HOST_USER` | - | SMTP authentication username |
| `EMAIL_HOST_PASSWORD` | - | SMTP authentication password |
| `DEFAULT_FROM_EMAIL` | `noreply@finance-dev.local` | From address for password reset emails |

---

## Troubleshooting

### Email Not Received in Production
1. Verify `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD` are correct
2. Check email provider's SMTP requirements
3. Ensure `DEFAULT_FROM_EMAIL` is configured
4. Check Django logs for send_mail errors

### Reset Link Doesn't Work
1. Verify token hasn't expired (default 24 hours)
2. Verify `FRONTEND_URL` environment variable is set correctly
3. Check browser console for errors
4. Verify UID and token are properly URL-encoded

### Token Validation Fails
1. Token may have expired (request new reset)
2. Token may have already been used
3. URL parameters may be malformed

---

## Future Enhancements

- [ ] Email templates (HTML vs plain text)
- [ ] Rate limiting on password reset requests
- [ ] Admin interface for manual password resets
- [ ] Audit logging for password changes
- [ ] Two-factor authentication support
- [ ] Security questions as alternative verification method
