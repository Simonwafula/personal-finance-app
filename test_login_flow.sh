#!/bin/bash
# Test login flow end-to-end

BACKEND="http://127.0.0.1:8000"
FRONTEND="http://localhost:5174"

echo "=== Login Flow Test ==="
echo ""

# Create a test user via signup
echo "1. Creating test user via /api/auth/register/..."
REGISTER_RESPONSE=$(curl -s -X POST "$BACKEND/api/auth/register/" \
  -H "Content-Type: application/json" \
  -H "Origin: $FRONTEND" \
  -c /tmp/test_cookies.txt \
  -d '{"username":"testuser","email":"test@example.com","password":"testpass123"}')

echo "Response: $REGISTER_RESPONSE"
USER_ID=$(echo $REGISTER_RESPONSE | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')
echo "Created user ID: $USER_ID"
echo ""

# Test login via /api/auth/login/
echo "2. Testing login with email via /api/auth/login/..."
LOGIN_RESPONSE=$(curl -s -X POST "$BACKEND/api/auth/login/" \
  -H "Content-Type: application/json" \
  -H "Origin: $FRONTEND" \
  -b /tmp/test_cookies.txt \
  -c /tmp/test_cookies.txt \
  -d '{"email":"test@example.com","password":"testpass123"}')

echo "Response: $LOGIN_RESPONSE"
echo ""

# Test /api/auth/me/ with session cookie
echo "3. Testing /api/auth/me/ with session cookie..."
ME_RESPONSE=$(curl -s "$BACKEND/api/auth/me/" \
  -H "Origin: $FRONTEND" \
  -b /tmp/test_cookies.txt)

echo "Response: $ME_RESPONSE"
echo ""

# Verify the user matches
if echo "$ME_RESPONSE" | grep -q "testuser"; then
  echo "✅ SUCCESS: Login flow works! User authenticated correctly."
else
  echo "❌ FAILED: User not authenticated after login."
fi
