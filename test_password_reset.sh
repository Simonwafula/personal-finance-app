#!/bin/bash
# Test forgot password and reset password endpoints

set -e

BACKEND_URL="http://localhost:8000"
TEST_EMAIL="testuser@example.com"
TEST_PASSWORD="TestPassword123!"
TEST_USERNAME="testuser"

echo "🔐 Testing Password Reset Flow"
echo "======================================"

# 1. Register a test user
echo ""
echo "1. Registering test user..."
REGISTER_RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/auth/register/" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"username\": \"$TEST_USERNAME\",
    \"password\": \"$TEST_PASSWORD\"
  }")
echo "✓ Register response: $REGISTER_RESPONSE"

# Extract user ID
USER_ID=$(echo "$REGISTER_RESPONSE" | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')
echo "✓ User ID: $USER_ID"

# 2. Request password reset
echo ""
echo "2. Requesting password reset..."
FORGOT_RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/auth/forgot-password/" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\"
  }")
echo "✓ Forgot password response:"
echo "$FORGOT_RESPONSE" | jq . 2>/dev/null || echo "$FORGOT_RESPONSE"

# Check if message contains "sent"
if echo "$FORGOT_RESPONSE" | grep -q "If an account exists"; then
  echo "✓ Reset email request successful (message generated)"
else
  echo "❌ Unexpected response format"
  exit 1
fi

# 3. Test invalid reset (no token)
echo ""
echo "3. Testing invalid reset (no token)..."
INVALID_RESET=$(curl -s -X POST "$BACKEND_URL/api/auth/reset-password/" \
  -H "Content-Type: application/json" \
  -d "{
    \"uid\": \"invalid\",
    \"token\": \"invalid\",
    \"new_password\": \"NewPassword123!\"
  }")
echo "✓ Invalid reset response:"
echo "$INVALID_RESET" | jq . 2>/dev/null || echo "$INVALID_RESET"

if echo "$INVALID_RESET" | grep -q "Invalid or expired"; then
  echo "✓ Invalid token correctly rejected"
else
  echo "❌ Should reject invalid token"
  exit 1
fi

# 4. Test missing fields
echo ""
echo "4. Testing missing fields..."
MISSING_FIELDS=$(curl -s -X POST "$BACKEND_URL/api/auth/reset-password/" \
  -H "Content-Type: application/json" \
  -d "{}")
echo "✓ Missing fields response:"
echo "$MISSING_FIELDS" | jq . 2>/dev/null || echo "$MISSING_FIELDS"

if echo "$MISSING_FIELDS" | grep -q "required"; then
  echo "✓ Missing fields correctly rejected"
else
  echo "❌ Should reject missing fields"
  exit 1
fi

echo ""
echo "======================================"
echo "✅ All password reset tests passed!"
echo ""
echo "Note: Email was sent to console (development mode)"
echo "Check Django console output for the password reset link"
echo "To test the full flow in development, extract UID and token from the console output"
echo "and call reset-password with those values."
