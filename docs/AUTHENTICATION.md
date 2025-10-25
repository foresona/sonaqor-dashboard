# Authentication System

This dashboard includes a comprehensive authentication system with the following features:

## Features

✅ **Login Page** - Beautiful, animated login form with demo credentials
✅ **Protected Routes** - All dashboard pages require authentication
✅ **Session Management** - Automatic token refresh and session persistence
✅ **User Profile** - Display user info in sidebar with avatar support
✅ **Logout Functionality** - Clean logout with token invalidation
✅ **Route Guards** - Middleware-level and component-level protection

## Demo Credentials

### Admin Account

- **Email:** admin@sonaqor.com
- **Password:** admin123
- **Role:** Admin
- **Organization:** Sonaqor

### Partner Account

- **Email:** partner@example.com
- **Password:** partner123
- **Role:** Partner
- **Organization:** Example Corp

## File Structure

```
src/
├── lib/
│   └── auth.ts                    # Authentication service with mock API
├── store/
│   └── authStore.ts               # Zustand store for auth state management
├── app/
│   └── login/
│       └── page.tsx               # Login page component
├── components/
│   ├── ProtectedRoute.tsx         # HOC for route protection
│   ├── DashboardLayout.tsx        # Updated with auth wrapper
│   └── Sidebar.tsx                # Updated with user info & logout
└── middleware.ts                  # Next.js middleware for route guards
```

## How It Works

### 1. Login Flow

1. User enters credentials on `/login` page
2. `authService.login()` validates credentials (mock authentication)
3. Tokens are stored in localStorage and cookies
4. User info is saved in Zustand store
5. User is redirected to dashboard

### 2. Route Protection

- **Middleware Level:** `src/middleware.ts` checks for auth token in cookies
- **Component Level:** `ProtectedRoute` component wraps dashboard pages
- Unauthenticated users are redirected to `/login`

### 3. Session Persistence

- Auth state is persisted using Zustand's persist middleware
- Tokens are stored in both localStorage (for client) and cookies (for middleware)
- On page refresh, `checkAuth()` verifies token validity

### 4. Logout Flow

1. User clicks logout button in sidebar
2. `authService.logout()` is called (can invalidate server-side session)
3. Tokens are removed from localStorage and cookies
4. Auth state is cleared in Zustand store
5. User is redirected to `/login`

## Integration with Real API

To connect to a real backend API, update the following files:

### 1. Update `src/lib/auth.ts`

Replace the mock functions with real API calls:

```typescript
export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      throw new Error('Invalid credentials')
    }

    return response.json()
  },

  async logout(): Promise<void> {
    await fetch('/api/auth/logout', { method: 'POST' })
  },

  async verifyToken(token: string): Promise<User | null> {
    const response = await fetch('/api/auth/verify', {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!response.ok) return null
    return response.json()
  },
}
```

### 2. Update Token Refresh

Add automatic token refresh in `src/store/authStore.ts`:

```typescript
// Add token refresh logic
const refreshAuthToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token')
  if (!refreshToken) return null

  const response = await authService.refreshToken(refreshToken)
  // Update tokens and return new access token
  return response.token
}
```

### 3. Add API Interceptor

Create an axios interceptor to automatically add auth headers:

```typescript
// src/lib/apiClient.ts
import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh or redirect to login
    }
    return Promise.reject(error)
  },
)

export default apiClient
```

## Security Considerations

### Current Implementation (Mock/Demo)

- ⚠️ Tokens are simple strings (not JWT)
- ⚠️ No server-side validation
- ⚠️ Passwords are stored in plain text in mock data
- ⚠️ No rate limiting or brute force protection

### Production Recommendations

1. **Use JWT Tokens** - Implement proper JWT token validation
2. **Secure Password Storage** - Never store passwords in frontend
3. **HTTPS Only** - Use secure cookies with httpOnly flag
4. **Token Expiration** - Implement short-lived access tokens with refresh tokens
5. **CSRF Protection** - Add CSRF tokens for state-changing operations
6. **Rate Limiting** - Implement login attempt rate limiting
7. **Two-Factor Authentication** - Add 2FA for enhanced security
8. **Session Management** - Track active sessions server-side
9. **Audit Logging** - Log authentication events
10. **Password Policies** - Enforce strong password requirements

## User Roles & Permissions

The system supports role-based access:

- **Admin** - Full access to all features
- **Partner** - Limited access to partner-specific features
- **User** - Basic read access

To implement role-based UI:

```typescript
const { user } = useAuthStore()

if (user?.role === 'admin') {
  // Show admin-only features
}
```

## Testing

To test the authentication system:

1. Start the dev server: `npm run dev`
2. Navigate to `http://localhost:3001`
3. You'll be redirected to `/login`
4. Use demo credentials to log in
5. Explore the dashboard
6. Click logout to test logout flow

## Troubleshooting

### Redirect Loop

If you experience redirect loops:

- Clear localStorage: `localStorage.clear()`
- Clear cookies
- Refresh the page

### Token Not Persisting

- Check browser console for errors
- Verify localStorage is enabled
- Check cookie settings

### Can't Access Protected Routes

- Ensure you're logged in
- Check if token exists: `localStorage.getItem('auth_token')`
- Verify middleware is running

## Future Enhancements

- [ ] Add password reset functionality
- [ ] Implement email verification
- [ ] Add "Remember Me" option
- [ ] Support for OAuth/Social login
- [ ] Multi-factor authentication
- [ ] Session timeout warnings
- [ ] Concurrent session management
- [ ] Device tracking and management
