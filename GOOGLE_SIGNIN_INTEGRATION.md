# Google Sign-In Integration for Sayonara Platform

This document describes the Google Sign-In integration implemented for the Sayonara platform's login and sign-up functionality.

## Overview

The integration includes:
- Google Platform Library integration
- Client ID configuration
- Sign-in/Sign-up functionality on both login page and auth modal
- User profile information retrieval
- Sign-out functionality
- Proper error handling and TypeScript support

## Client ID

**Client ID:** `380078509373-814un77hbu18p9s6s8tqeit1t18lfnk1.apps.googleusercontent.com`

## Files Modified/Created

### 1. Layout Configuration (`/frontend/src/app/layout.tsx`)
- Added Google Platform Library script: `https://apis.google.com/js/platform.js`
- Added meta tag with Google Sign-In client ID
- Scripts load asynchronously with `async defer` attributes

### 2. Google Auth Utility (`/frontend/src/utils/googleAuth.ts`)
- **`initGoogleSignIn()`**: Initializes Google Sign-In with the client ID
- **`onSignIn(googleUser)`**: Handles successful sign-in, extracts user profile data
- **`signOut()`**: Signs out user from Google and clears local storage
- **`renderGoogleButton()`**: Programmatically renders Google Sign-In buttons
- TypeScript interfaces for proper type safety

### 3. Login Page (`/frontend/src/app/login/page.tsx`)
- Added Google Sign-In functionality to both login and signup forms
- Automatic Google Sign-In button (using `g-signin2` class)
- Manual Google Sign-In button with custom styling
- Sign-out link for testing purposes
- Proper initialization on component mount

### 4. Auth Modal (`/frontend/src/components/AuthModal.tsx`)
- Integrated Google Sign-In for both login and signup tabs
- Modal closes automatically after successful Google Sign-In
- Error handling for failed Google Sign-In attempts
- Initialization when modal opens

### 5. Test Page (`/frontend/public/google-signin-test.html`)
- Standalone HTML page for testing Google Sign-In functionality
- Displays user information after successful sign-in
- Manual and automatic sign-in buttons
- Status messages for debugging

## Features Implemented

### User Profile Information
After successful sign-in, the following user data is available:
- **User ID** (Do not send to backend - use ID token instead)
- **Name**
- **Email**
- **Profile Image URL**
- **ID Token** (for backend verification)

### Authentication Flow
1. User clicks Google Sign-In button
2. Google authentication popup appears
3. User completes Google authentication
4. Profile information is extracted and logged
5. User data is stored in localStorage
6. Page reloads to update UI state
7. Modal closes (if applicable)

### Sign-Out Flow
1. User clicks sign-out link/button
2. Google Sign-In session is terminated
3. Local storage is cleared
4. Page reloads to update UI state

## Security Considerations

⚠️ **Important Security Notes:**
- Never send the Google User ID to your backend
- Always use the ID token for backend verification
- ID tokens should be validated on your backend server
- Store minimal user information in localStorage
- Implement proper CSRF protection

## Usage Examples

### Basic Implementation
```typescript
import { initGoogleSignIn, onSignIn, signOut } from '@/utils/googleAuth';

// Initialize (call once when component mounts)
useEffect(() => {
  const timer = setTimeout(() => {
    initGoogleSignIn();
  }, 1000);
  return () => clearTimeout(timer);
}, []);

// Handle manual sign-in
const handleGoogleSignIn = () => {
  if (typeof window !== 'undefined' && window.gapi) {
    const auth2 = window.gapi.auth2.getAuthInstance();
    if (auth2) {
      auth2.signIn().then((googleUser: any) => {
        onSignIn(googleUser);
      }).catch((error: any) => {
        console.error('Google Sign-In failed:', error);
      });
    }
  }
};
```

### Automatic Button (HTML)
```html
<div class="g-signin2" data-onsuccess="onSignIn"></div>
```

### Manual Button (React)
```jsx
<button onClick={handleGoogleSignIn}>
  Sign in with Google
</button>
```

## Testing

### Test Page Access
Visit `/google-signin-test.html` in your browser to test the integration:
- Automatic Google Sign-In button
- Manual sign-in button
- User information display
- Sign-out functionality
- Status messages

### Testing Checklist
- [ ] Google Platform Library loads correctly
- [ ] Client ID is properly configured
- [ ] Sign-in popup appears when button is clicked
- [ ] User profile information is extracted correctly
- [ ] ID token is available for backend verification
- [ ] Sign-out functionality works properly
- [ ] Local storage is managed correctly
- [ ] Error handling works for failed sign-ins

## Backend Integration

To complete the integration, your backend should:

1. **Verify ID Tokens**: Use Google's token verification libraries
2. **Create/Update User Records**: Store user information in your database
3. **Generate Session Tokens**: Create your own authentication tokens
4. **Handle User Linking**: Link Google accounts to existing user accounts if needed

### Example Backend Verification (Node.js)
```javascript
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('380078509373-814un77hbu18p9s6s8tqeit1t18lfnk1.apps.googleusercontent.com');

async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: '380078509373-814un77hbu18p9s6s8tqeit1t18lfnk1.apps.googleusercontent.com',
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  // Use payload.email, payload.name, etc.
}
```

## Troubleshooting

### Common Issues
1. **"gapi is not defined"**: Ensure Google Platform Library loads before initialization
2. **"Invalid client ID"**: Verify the client ID is correctly configured
3. **Popup blocked**: Ensure popups are allowed for your domain
4. **CORS errors**: Verify your domain is authorized in Google Console

### Debug Information
- Check browser console for error messages
- Verify network requests to Google APIs
- Test with the standalone test page first
- Ensure proper HTTPS configuration for production

## Next Steps

1. **Backend Integration**: Implement ID token verification on your backend
2. **User Management**: Create user accounts based on Google profile data
3. **Session Management**: Implement proper session handling
4. **UI Improvements**: Customize Google Sign-In button styling
5. **Error Handling**: Implement comprehensive error handling and user feedback
6. **Testing**: Conduct thorough testing across different browsers and devices