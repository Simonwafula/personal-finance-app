# Login Flow Troubleshooting & Fix Guide

## Issues Fixed

### Problem 1: Login Page Uses Only Email
**What was happening:**
- LoginPage form only accepted email input
- Backend `/api/auth/login/` accepts both `username` and `email`
- Users who signed up with a username couldn't log in with the email field

**Fix applied:**
- Changed input to accept both email and username
- Updated label to "Email or Username"
- Added logic to detect format (if contains '@', send as `email`; otherwise as `username`)

### Problem 2: Layout Component Doesn't Refresh After Login
**What was happening:**
- After successful login/signup, the Layout component didn't know the user was authenticated
- `fetchCurrentUser()` was only called on component mount (initial page load)
- Navigating to "/" after login didn't show the user as signed in until the page was manually refreshed

**Fix applied:**
- Added event listener in Layout's useEffect to listen for `authChanged` custom event
- LoginPage now dispatches `window.dispatchEvent(new Event('authChanged'))` after successful login
- SignupPage now does the same after successful registration
- When the event fires, Layout calls `loadUser()` which refreshes the user state

## How to Test Locally

### Step 1: Ensure Dev Servers Are Running
```bash
# Terminal 1: Backend
cd /path/to/personal-finance-app
source .venv/bin/activate
python manage.py runserver 0.0.0.0:8000

# Terminal 2: Frontend
cd /path/to/personal-finance-app/client
npm run dev
```

Both should be running at:
- Backend: http://127.0.0.1:8000/
- Frontend: http://localhost:5174/

### Step 2: Test Sign Up
1. Open http://localhost:5174/ in your browser
2. On the index page, you should see only a **"Login"** button (no "Sign up")
3. Click **"Login"** button to go to /login page
4. On /login page, you should see both **"Login"** and **"Sign up"** buttons
5. Click **"Sign up"** to go to /signup page
6. Fill in:
   - Email: `testuser@example.com`
   - Username (optional): `testuser`
   - Password: `password123`
7. Click **"Create account"**
8. You should be redirected to "/" (index page)
9. The header should now show **"Signed in as testuser"** instead of the Login button
10. A **"Logout"** link should appear

### Step 3: Test Login
1. Click **"Logout"** to log out
2. The header should revert to showing **"Login"** button
3. Click **"Login"** to go to /login page
4. Fill in:
   - Email or Username: `testuser` (or `testuser@example.com`)
   - Password: `password123`
5. Click **"Sign in"**
6. You should be redirected to "/" (index page)
7. The header should show **"Signed in as testuser"** again

### Step 4: Verify Session Cookie
1. Open browser DevTools (F12)
2. Go to **Application** → **Cookies** → http://localhost:5174
3. You should see a `sessionid` cookie after login
4. Refresh the page — you should remain logged in (header still shows "Signed in as testuser")

## Expected Behavior After Fixes

| Page | Unauthenticated User | Authenticated User |
|------|---|---|
| `/` (index) | Shows only "Login" button | Shows "Signed in as {user}" + Logout |
| `/login` | Shows both "Login" and "Sign up" buttons | Redirects to "/" (already logged in) |
| `/signup` | Shows both "Login" and "Sign up" buttons | Redirects to "/" (already logged in) |
| Other pages | Shows "Login" button (use sidebar nav to reach protected routes) | Shows "Signed in as {user}" + Logout |

## Files Modified

1. `client/src/components/Layout.tsx`
   - Added `useLocation` import
   - Added `location` state and `isAuthPage` logic
   - Conditional rendering of "Login"/"Sign up" buttons based on route
   - Added event listener for `authChanged` event
   - Added refresh logic in `loadUser()` function

2. `client/src/pages/LoginPage.tsx`
   - Changed state from `email` to `identifier` (accepts both email and username)
   - Added logic to detect format and send as either `email` or `username` to backend
   - Updated label to "Email or Username" with placeholder
   - Added `window.dispatchEvent(new Event('authChanged'))` after successful login
   - Removed hardcoded "email" parameter

3. `client/src/pages/SignupPage.tsx`
   - Added `window.dispatchEvent(new Event('authChanged'))` after successful registration
   - Updated comment to clarify the event dispatch

## Backend API Details (No Changes Required)

### POST /api/auth/register/
- Accepts: `{ email, password, username? }`
- Returns: `{ id, username, email }` + sets sessionid cookie
- Status: 201 Created (or 400 if email already exists)

### POST /api/auth/login/
- Accepts: `{ email?, username?, password }`
- Returns: `{ id, username, email }` + sets sessionid cookie
- Status: 200 OK (or 400 if invalid credentials)

### GET /api/auth/me/
- Requires: Valid sessionid cookie
- Returns: `{ id, username, email }`
- Status: 200 OK (or 401/403 if not authenticated)

## Debugging Tips

If login still doesn't work after these fixes:

1. **Check browser console** (F12 → Console tab)
   - Look for any error messages from the fetch request
   - Check for CORS issues

2. **Check Network tab**
   - Go to Network tab before submitting login form
   - Submit the form and look for the POST to `/api/auth/login/`
   - Click that request and check:
     - Status: should be 200 OK
     - Response: should contain `{ id, username, email }`
     - Headers: look for Set-Cookie: sessionid

3. **Check browser cookies**
   - After login, go to DevTools → Application → Cookies → http://localhost:5174
   - There should be a `sessionid` cookie with a long value
   - If it's not there, the session wasn't set on the backend

4. **Test the backend directly with curl** (provided test script)
   ```bash
   bash test_login_flow.sh
   ```

## Next Steps

Once the login flow works:
1. Test the Dashboard and other protected pages
2. Create some sample transactions to see the charts
3. Test the time range selector and filters
4. Test the dark theme toggle
5. Test the OAuth popup flow (requires Google credentials setup)

