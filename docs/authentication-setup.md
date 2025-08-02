# Authentication Setup Guide

## Overview

This guide explains how to set up and configure the Supabase authentication system for the Liberador Inaplast Order Management System.

## Prerequisites

- Supabase project created
- Environment variables configured
- Database migrations applied

## Configuration Steps

### 1. Environment Variables

Ensure the following environment variables are set in your `.env` file:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Supabase Auth Configuration

The authentication is configured in `nuxt.config.ts`:

```typescript
supabase: {
  url: process.env.SUPABASE_URL,
  key: process.env.SUPABASE_ANON_KEY,
  redirectOptions: {
    login: '/auth/login',
    callback: '/confirm',
    exclude: ['/']
  }
}
```

### 3. User Creation

Since user registration is disabled, create users through the Supabase dashboard:

1. **Access Supabase Dashboard**
   - Go to your project dashboard at https://supabase.com
   - Navigate to Authentication > Users

2. **Add New User**
   - Click "Add user" button
   - Choose "Create a new user"
   - Enter email address
   - Enter password (minimum 6 characters)
   - Optionally add user metadata
   - Click "Create user"

3. **User Status**
   - New users are automatically confirmed
   - Users can immediately log in with their credentials
   - No email verification required for manually created users

### 4. Authentication Flow

#### Login Process
1. User visits any protected route
2. Authentication middleware checks for valid session
3. If not authenticated, user is redirected to `/auth/login`
4. User enters email and password
5. Supabase validates credentials
6. On success, user is redirected to original route or dashboard
7. Session is automatically maintained across browser sessions

#### Password Reset Process
1. User clicks "¿Olvidaste tu contraseña?" on login page
2. User enters email address in reset modal
3. Supabase sends password reset email
4. User clicks link in email
5. User is redirected to `/auth/reset-password`
6. User enters new password
7. Password is updated and user is logged in

#### Logout Process
1. User clicks logout from user menu
2. Supabase session is terminated
3. User is redirected to login page
4. All authentication state is cleared

## Security Features

### Route Protection
- All routes are protected by default via `auth` middleware
- Authentication pages are excluded from protection
- Middleware automatically redirects unauthenticated users

### Session Management
- Sessions are handled automatically by Supabase
- Tokens are refreshed transparently
- Sessions persist across browser restarts
- Logout properly clears all session data

### Password Security
- Passwords are hashed by Supabase
- Minimum 6 character requirement
- Password reset requires email verification
- No passwords are stored in the application

## Troubleshooting

### Common Issues

#### "User not found" Error
- **Cause**: User doesn't exist in Supabase Auth
- **Solution**: Create user through Supabase dashboard

#### Infinite Redirect Loop
- **Cause**: Missing or invalid environment variables
- **Solution**: Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` are correct

#### "Invalid login credentials"
- **Cause**: Incorrect email or password
- **Solution**: Verify credentials or reset password

#### Session Not Persisting
- **Cause**: Browser blocking cookies or localStorage
- **Solution**: Check browser privacy settings

### Environment Issues

#### Missing Environment Variables
```bash
# Check if variables are loaded
echo $SUPABASE_URL
echo $SUPABASE_ANON_KEY
```

#### Invalid Supabase Configuration
- Verify project URL format: `https://[project-id].supabase.co`
- Verify anon key is the public anon key, not service role key
- Check Supabase project is active and accessible

## Development Testing

### Testing Authentication
1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Test Unauthenticated Access**
   - Visit `http://localhost:3000`
   - Should redirect to `/auth/login`

3. **Test Login**
   - Enter valid user credentials
   - Should redirect to dashboard after successful login

4. **Test Session Persistence**
   - Refresh browser
   - Should remain logged in

5. **Test Logout**
   - Click user menu and logout
   - Should redirect to login page

### Creating Test Users

For development testing, create users with these roles:

```bash
# Admin user
Email: admin@inaplast.com
Password: admin123

# Manager user  
Email: manager@inaplast.com
Password: manager123

# User
Email: user@inaplast.com
Password: user123
```

## Production Deployment

### Environment Variables
Ensure production environment has:
- `SUPABASE_URL` - Production Supabase project URL
- `SUPABASE_ANON_KEY` - Production anon key

### Security Checklist
- [ ] Environment variables are secure
- [ ] Supabase RLS policies are enabled
- [ ] Auth redirect URLs are configured for production domain
- [ ] Email templates are customized for brand
- [ ] Rate limiting is configured for auth endpoints

### Monitoring
- Monitor failed login attempts in Supabase Auth logs
- Set up alerts for unusual authentication patterns
- Regularly review user access and permissions

## API Reference

### useAuth Composable

```typescript
const { 
  user,           // Current user object
  signIn,         // Login function
  signOut,        // Logout function
  resetPassword,  // Password reset function
  updatePassword, // Password update function
  isAuthenticated // Authentication status
} = useAuth()
```

### Authentication Middleware

```typescript
// Protect a route
definePageMeta({
  middleware: 'auth'
})

// Exclude from protection (auth pages only)
definePageMeta({
  auth: false
})
```

## Support

For authentication issues:
1. Check Supabase project status
2. Verify environment configuration  
3. Review browser console for errors
4. Check network requests in developer tools
5. Consult Supabase Auth documentation