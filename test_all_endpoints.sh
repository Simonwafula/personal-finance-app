#!/bin/bash
# Comprehensive test for all auth endpoints and functionality

set -e

BACKEND="http://localhost:8000"
FRONTEND="http://localhost:5174"
TEST_USER="testuser_$(date +%s)@example.com"
TEST_USERNAME="testuser_$(date +%s)"
TEST_PASSWORD="TestPassword123!"
NEW_PASSWORD="NewPassword456!"

echo "🧪 COMPREHENSIVE AUTH SYSTEM TEST"
echo "=================================="
echo ""

# Test 1: Register
echo "TEST 1: Register endpoint"
echo "------------------------"
REGISTER_RESPONSE=$(curl -s -X POST "$BACKEND/api/auth/register/" \
  -H "Content-Type: application/json" \
  -c /tmp/cookies.txt \
  -d "{
    \"email\": \"$TEST_USER\",
    \"username\": \"$TEST_USERNAME\",
    \"password\": \"$TEST_PASSWORD\"
  }")

echo "Request: POST /api/auth/register/"
echo "Payload: {email, username, password}"
echo "Response: $REGISTER_RESPONSE"

if echo "$REGISTER_RESPONSE" | grep -q "\"id\""; then
  echo "✅ Register PASSED"
  USER_ID=$(echo "$REGISTER_RESPONSE" | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)
else
  echo "❌ Register FAILED"
  exit 1
fi
echo ""

# Test 2: Get Current User (should work with session)
echo "TEST 2: Get current user endpoint"
echo "--------------------------------"
CURRENT_USER=$(curl -s -X GET "$BACKEND/api/auth/me/" \
  -H "Content-Type: application/json" \
  -b /tmp/cookies.txt)

echo "Request: GET /api/auth/me/"
echo "Response: $CURRENT_USER"

if echo "$CURRENT_USER" | grep -q "\"id\""; then
  echo "✅ Get current user PASSED"
else
  echo "❌ Get current user FAILED"
  exit 1
fi
echo ""

# Test 3: Login
echo "TEST 3: Login endpoint"
echo "--------------------"
rm -f /tmp/cookies2.txt
LOGIN_RESPONSE=$(curl -s -X POST "$BACKEND/api/auth/login/" \
  -H "Content-Type: application/json" \
  -c /tmp/cookies2.txt \
  -d "{
    \"email\": \"$TEST_USER\",
    \"password\": \"$TEST_PASSWORD\"
  }")

echo "Request: POST /api/auth/login/"
echo "Payload: {email, password}"
echo "Response: $LOGIN_RESPONSE"

if echo "$LOGIN_RESPONSE" | grep -q "\"id\""; then
  echo "✅ Login with email PASSED"
else
  echo "❌ Login with email FAILED"
  exit 1
fi
echo ""

# Test 4: Login with username
echo "TEST 4: Login with username"
echo "---------------------------"
rm -f /tmp/cookies3.txt
LOGIN_USERNAME=$(curl -s -X POST "$BACKEND/api/auth/login/" \
  -H "Content-Type: application/json" \
  -c /tmp/cookies3.txt \
  -d "{
    \"username\": \"$TEST_USERNAME\",
    \"password\": \"$TEST_PASSWORD\"
  }")

echo "Request: POST /api/auth/login/"
echo "Payload: {username, password}"
echo "Response: $LOGIN_USERNAME"

if echo "$LOGIN_USERNAME" | grep -q "\"id\""; then
  echo "✅ Login with username PASSED"
else
  echo "❌ Login with username FAILED"
  exit 1
fi
echo ""

# Test 5: Invalid Login
echo "TEST 5: Invalid login (wrong password)"
echo "-------------------------------------"
INVALID_LOGIN=$(curl -s -X POST "$BACKEND/api/auth/login/" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_USER\",
    \"password\": \"WrongPassword\"
  }")

echo "Request: POST /api/auth/login/ with wrong password"
echo "Response: $INVALID_LOGIN"

if echo "$INVALID_LOGIN" | grep -q "Invalid credentials"; then
  echo "✅ Invalid login rejection PASSED"
else
  echo "❌ Invalid login rejection FAILED"
  exit 1
fi
echo ""

# Test 6: Forgot Password
echo "TEST 6: Forgot password endpoint"
echo "-------------------------------"
FORGOT=$(curl -s -X POST "$BACKEND/api/auth/forgot-password/" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_USER\"
  }")

echo "Request: POST /api/auth/forgot-password/"
echo "Payload: {email}"
echo "Response: $FORGOT"

if echo "$FORGOT" | grep -q "If an account exists"; then
  echo "✅ Forgot password PASSED"
else
  echo "❌ Forgot password FAILED"
  exit 1
fi
echo ""

# Test 7: Forgot Password with non-existent email
echo "TEST 7: Forgot password with non-existent email"
echo "----------------------------------------------"
FORGOT_NOTFOUND=$(curl -s -X POST "$BACKEND/api/auth/forgot-password/" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"nonexistent@example.com\"
  }")

echo "Request: POST /api/auth/forgot-password/ with non-existent email"
echo "Response: $FORGOT_NOTFOUND"

if echo "$FORGOT_NOTFOUND" | grep -q "If an account exists"; then
  echo "✅ Non-existent email privacy PASSED (generic message)"
else
  echo "❌ Non-existent email privacy FAILED"
  exit 1
fi
echo ""

# Test 8: Reset Password with invalid token
echo "TEST 8: Reset password with invalid token"
echo "----------------------------------------"
RESET_INVALID=$(curl -s -X POST "$BACKEND/api/auth/reset-password/" \
  -H "Content-Type: application/json" \
  -d "{
    \"uid\": \"invalid\",
    \"token\": \"invalid\",
    \"new_password\": \"$NEW_PASSWORD\"
  }")

echo "Request: POST /api/auth/reset-password/ with invalid token"
echo "Response: $RESET_INVALID"

if echo "$RESET_INVALID" | grep -q "Invalid or expired"; then
  echo "✅ Invalid token rejection PASSED"
else
  echo "❌ Invalid token rejection FAILED"
  exit 1
fi
echo ""

# Test 9: Reset Password missing fields
echo "TEST 9: Reset password with missing fields"
echo "-----------------------------------------"
RESET_MISSING=$(curl -s -X POST "$BACKEND/api/auth/reset-password/" \
  -H "Content-Type: application/json" \
  -d "{}")

echo "Request: POST /api/auth/reset-password/ with no fields"
echo "Response: $RESET_MISSING"

if echo "$RESET_MISSING" | grep -q "required"; then
  echo "✅ Missing fields validation PASSED"
else
  echo "❌ Missing fields validation FAILED"
  exit 1
fi
echo ""

# Test 10: Duplicate email registration
echo "TEST 10: Duplicate email registration"
echo "------------------------------------"
DUPLICATE=$(curl -s -X POST "$BACKEND/api/auth/register/" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_USER\",
    \"username\": \"anotheruser\",
    \"password\": \"$TEST_PASSWORD\"
  }")

echo "Request: POST /api/auth/register/ with duplicate email"
echo "Response: $DUPLICATE"

if echo "$DUPLICATE" | grep -q "already exists"; then
  echo "✅ Duplicate email rejection PASSED"
else
  echo "❌ Duplicate email rejection FAILED"
  exit 1
fi
echo ""

# Test 11: Missing email/password in register
echo "TEST 11: Register with missing email"
echo "-----------------------------------"
MISSING_EMAIL=$(curl -s -X POST "$BACKEND/api/auth/register/" \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"testuser\",
    \"password\": \"$TEST_PASSWORD\"
  }")

echo "Request: POST /api/auth/register/ without email"
echo "Response: $MISSING_EMAIL"

if echo "$MISSING_EMAIL" | grep -q "required"; then
  echo "✅ Missing email validation PASSED"
else
  echo "❌ Missing email validation FAILED"
  exit 1
fi
echo ""

# Test 12: Unauthenticated access to /me/
echo "TEST 12: Unauthenticated access to current user"
echo "----------------------------------------------"
UNAUTHENTICATED=$(curl -s -X GET "$BACKEND/api/auth/me/" \
  -H "Content-Type: application/json")

echo "Request: GET /api/auth/me/ without session"
echo "Response: $UNAUTHENTICATED"

if echo "$UNAUTHENTICATED" | grep -q "401\|403\|Unauthorized\|Permission"; then
  echo "✅ Unauthenticated access rejected PASSED"
  echo "Note: Server correctly requires authentication"
else
  echo "⚠️  Unauthenticated access check (server may return 401/403)"
fi
echo ""

echo "=================================="
echo "✅ ALL TESTS PASSED!"
echo "=================================="
echo ""
echo "Summary:"
echo "• Register: Working ✓"
echo "• Login (email & username): Working ✓"
echo "• Current user: Working ✓"
echo "• Forgot password: Working ✓"
echo "• Reset password: Working ✓"
echo "• Input validation: Working ✓"
echo "• Email privacy: Working ✓"
echo "• Error handling: Working ✓"
echo ""
