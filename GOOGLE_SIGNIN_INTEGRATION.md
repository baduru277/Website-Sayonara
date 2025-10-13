[//]: # (# Google Sign-In Integration for Sayonara Platform)

[//]: # ()
[//]: # (This document describes the Google Sign-In integration implemented for the Sayonara platform's login and sign-up functionality.)

[//]: # ()
[//]: # (## Overview)

[//]: # ()
[//]: # (The integration includes:)

[//]: # (- Google Platform Library integration)

[//]: # (- Client ID configuration)

[//]: # (- Sign-in/Sign-up functionality on both login page and auth modal)

[//]: # (- User profile information retrieval)

[//]: # (- Sign-out functionality)

[//]: # (- Proper error handling and TypeScript support)

[//]: # ()
[//]: # (## Client ID)

[//]: # ()
[//]: # (**Client ID:** `380078509373-814un77hbu18p9s6s8tqeit1t18lfnk1.apps.googleusercontent.com`)

[//]: # ()
[//]: # (## Files Modified/Created)

[//]: # ()
[//]: # (### 1. Layout Configuration &#40;`/frontend/src/app/layout.tsx`&#41;)

[//]: # (- Added Google Platform Library script: `https://apis.google.com/js/platform.js`)

[//]: # (- Added meta tag with Google Sign-In client ID)

[//]: # (- Scripts load asynchronously with `async defer` attributes)

[//]: # ()
[//]: # (### 2. Google Auth Utility &#40;`/frontend/src/utils/googleAuth.ts`&#41;)

[//]: # (- **`initGoogleSignIn&#40;&#41;`**: Initializes Google Sign-In with the client ID)

[//]: # (- **`onSignIn&#40;googleUser&#41;`**: Handles successful sign-in, extracts user profile data)

[//]: # (- **`signOut&#40;&#41;`**: Signs out user from Google and clears local storage)

[//]: # (- **`renderGoogleButton&#40;&#41;`**: Programmatically renders Google Sign-In buttons)

[//]: # (- TypeScript interfaces for proper type safety)

[//]: # ()
[//]: # (### 3. Login Page &#40;`/frontend/src/app/login/page.tsx`&#41;)

[//]: # (- Added Google Sign-In functionality to both login and signup forms)

[//]: # (- Automatic Google Sign-In button &#40;using `g-signin2` class&#41;)

[//]: # (- Manual Google Sign-In button with custom styling)

[//]: # (- Sign-out link for testing purposes)

[//]: # (- Proper initialization on component mount)

[//]: # ()
[//]: # (### 4. Auth Modal &#40;`/frontend/src/components/AuthModal.tsx`&#41;)

[//]: # (- Integrated Google Sign-In for both login and signup tabs)

[//]: # (- Modal closes automatically after successful Google Sign-In)

[//]: # (- Error handling for failed Google Sign-In attempts)

[//]: # (- Initialization when modal opens)

[//]: # ()
[//]: # (### 5. Test Page &#40;`/frontend/public/google-signin-test.html`&#41;)

[//]: # (- Standalone HTML page for testing Google Sign-In functionality)

[//]: # (- Displays user information after successful sign-in)

[//]: # (- Manual and automatic sign-in buttons)

[//]: # (- Status messages for debugging)

[//]: # ()
[//]: # (## Features Implemented)

[//]: # ()
[//]: # (### User Profile Information)

[//]: # (After successful sign-in, the following user data is available:)

[//]: # (- **User ID** &#40;Do not send to backend - use ID token instead&#41;)

[//]: # (- **Name**)

[//]: # (- **Email**)

[//]: # (- **Profile Image URL**)

[//]: # (- **ID Token** &#40;for backend verification&#41;)

[//]: # ()
[//]: # (### Authentication Flow)

[//]: # (1. User clicks Google Sign-In button)

[//]: # (2. Google authentication popup appears)

[//]: # (3. User completes Google authentication)

[//]: # (4. Profile information is extracted and logged)

[//]: # (5. User data is stored in localStorage)

[//]: # (6. Page reloads to update UI state)

[//]: # (7. Modal closes &#40;if applicable&#41;)

[//]: # ()
[//]: # (### Sign-Out Flow)

[//]: # (1. User clicks sign-out link/button)

[//]: # (2. Google Sign-In session is terminated)

[//]: # (3. Local storage is cleared)

[//]: # (4. Page reloads to update UI state)

[//]: # ()
[//]: # (## Security Considerations)

[//]: # ()
[//]: # (⚠️ **Important Security Notes:**)

[//]: # (- Never send the Google User ID to your backend)

[//]: # (- Always use the ID token for backend verification)

[//]: # (- ID tokens should be validated on your backend server)

[//]: # (- Store minimal user information in localStorage)

[//]: # (- Implement proper CSRF protection)

[//]: # ()
[//]: # (## Usage Examples)

[//]: # ()
[//]: # (### Basic Implementation)

[//]: # (```typescript)

[//]: # (import { initGoogleSignIn, onSignIn, signOut } from '@/utils/googleAuth';)

[//]: # ()
[//]: # (// Initialize &#40;call once when component mounts&#41;)

[//]: # (useEffect&#40;&#40;&#41; => {)

[//]: # (  const timer = setTimeout&#40;&#40;&#41; => {)

[//]: # (    initGoogleSignIn&#40;&#41;;)

[//]: # (  }, 1000&#41;;)

[//]: # (  return &#40;&#41; => clearTimeout&#40;timer&#41;;)

[//]: # (}, []&#41;;)

[//]: # ()
[//]: # (// Handle manual sign-in)

[//]: # (const handleGoogleSignIn = &#40;&#41; => {)

[//]: # (  if &#40;typeof window !== 'undefined' && window.gapi&#41; {)

[//]: # (    const auth2 = window.gapi.auth2.getAuthInstance&#40;&#41;;)

[//]: # (    if &#40;auth2&#41; {)

[//]: # (      auth2.signIn&#40;&#41;.then&#40;&#40;googleUser: any&#41; => {)

[//]: # (        onSignIn&#40;googleUser&#41;;)

[//]: # (      }&#41;.catch&#40;&#40;error: any&#41; => {)

[//]: # (        console.error&#40;'Google Sign-In failed:', error&#41;;)

[//]: # (      }&#41;;)

[//]: # (    })

[//]: # (  })

[//]: # (};)

[//]: # (```)

[//]: # ()
[//]: # (### Automatic Button &#40;HTML&#41;)

[//]: # (```html)

[//]: # (<div class="g-signin2" data-onsuccess="onSignIn"></div>)

[//]: # (```)

[//]: # ()
[//]: # (### Manual Button &#40;React&#41;)

[//]: # (```jsx)

[//]: # (<button onClick={handleGoogleSignIn}>)

[//]: # (  Sign in with Google)

[//]: # (</button>)

[//]: # (```)

[//]: # ()
[//]: # (## Testing)

[//]: # ()
[//]: # (### Test Page Access)

[//]: # (Visit `/google-signin-test.html` in your browser to test the integration:)

[//]: # (- Automatic Google Sign-In button)

[//]: # (- Manual sign-in button)

[//]: # (- User information display)

[//]: # (- Sign-out functionality)

[//]: # (- Status messages)

[//]: # ()
[//]: # (### Testing Checklist)

[//]: # (- [ ] Google Platform Library loads correctly)

[//]: # (- [ ] Client ID is properly configured)

[//]: # (- [ ] Sign-in popup appears when button is clicked)

[//]: # (- [ ] User profile information is extracted correctly)

[//]: # (- [ ] ID token is available for backend verification)

[//]: # (- [ ] Sign-out functionality works properly)

[//]: # (- [ ] Local storage is managed correctly)

[//]: # (- [ ] Error handling works for failed sign-ins)

[//]: # ()
[//]: # (## Backend Integration)

[//]: # ()
[//]: # (To complete the integration, your backend should:)

[//]: # ()
[//]: # (1. **Verify ID Tokens**: Use Google's token verification libraries)

[//]: # (2. **Create/Update User Records**: Store user information in your database)

[//]: # (3. **Generate Session Tokens**: Create your own authentication tokens)

[//]: # (4. **Handle User Linking**: Link Google accounts to existing user accounts if needed)

[//]: # ()
[//]: # (### Example Backend Verification &#40;Node.js&#41;)

[//]: # (```javascript)

[//]: # (const { OAuth2Client } = require&#40;'google-auth-library'&#41;;)

[//]: # (const client = new OAuth2Client&#40;'380078509373-814un77hbu18p9s6s8tqeit1t18lfnk1.apps.googleusercontent.com'&#41;;)

[//]: # ()
[//]: # (async function verify&#40;token&#41; {)

[//]: # (  const ticket = await client.verifyIdToken&#40;{)

[//]: # (    idToken: token,)

[//]: # (    audience: '380078509373-814un77hbu18p9s6s8tqeit1t18lfnk1.apps.googleusercontent.com',)

[//]: # (  }&#41;;)

[//]: # (  const payload = ticket.getPayload&#40;&#41;;)

[//]: # (  const userid = payload['sub'];)

[//]: # (  // Use payload.email, payload.name, etc.)

[//]: # (})

[//]: # (```)

[//]: # ()
[//]: # (## Troubleshooting)

[//]: # ()
[//]: # (### Common Issues)

[//]: # (1. **"gapi is not defined"**: Ensure Google Platform Library loads before initialization)

[//]: # (2. **"Invalid client ID"**: Verify the client ID is correctly configured)

[//]: # (3. **Popup blocked**: Ensure popups are allowed for your domain)

[//]: # (4. **CORS errors**: Verify your domain is authorized in Google Console)

[//]: # ()
[//]: # (### Debug Information)

[//]: # (- Check browser console for error messages)

[//]: # (- Verify network requests to Google APIs)

[//]: # (- Test with the standalone test page first)

[//]: # (- Ensure proper HTTPS configuration for production)

[//]: # ()
[//]: # (## Next Steps)

[//]: # ()
[//]: # (1. **Backend Integration**: Implement ID token verification on your backend)

[//]: # (2. **User Management**: Create user accounts based on Google profile data)

[//]: # (3. **Session Management**: Implement proper session handling)

[//]: # (4. **UI Improvements**: Customize Google Sign-In button styling)

[//]: # (5. **Error Handling**: Implement comprehensive error handling and user feedback)

[//]: # (6. **Testing**: Conduct thorough testing across different browsers and devices)