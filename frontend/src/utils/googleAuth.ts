// Google Sign-In utility functions

declare global {
  interface Window {
    gapi: any;
    onSignIn: (googleUser: any) => void;
    signOut: () => void;

interface GoogleAPI {
  load: (api: string, callback: () => void) => void;
  auth2: {
    init: (config: { client_id: string }) => Promise<GoogleAuth2>;
    getAuthInstance: () => GoogleAuth2 | null;
  };
  signin2: {
    render: (elementId: string, options: GoogleSignInOptions) => void;
  };
}

interface GoogleAuth2 {
  signIn: () => Promise<GoogleUser>;
  signOut: () => Promise<void>;
  isSignedIn: {
    get: () => boolean;
  };
}

interface GoogleSignInOptions {
  scope: string;
  width: number;
  height: number;
  longtitle: boolean;
  theme: 'dark' | 'light';
  onsuccess: (googleUser: GoogleUser) => void;
  onfailure: (error: Error) => void;
}

declare global {
  interface Window {
    gapi: GoogleAPI;
    onSignIn: (googleUser: GoogleUser) => void;
    signOut: () => void;
    googleSignInReady: boolean;
  }
}

export interface GoogleProfile {
  getId: () => string;
  getName: () => string;
  getImageUrl: () => string;
  getEmail: () => string;
}

export interface GoogleUser {
  getBasicProfile: () => GoogleProfile;
  getAuthResponse: () => {
    id_token: string;
    access_token: string;
  };
}

// Initialize Google Sign-In
export const initGoogleSignIn = () => {
  if (typeof window !== 'undefined' && window.gapi) {
    window.gapi.load('auth2', () => {
      window.gapi.auth2.init({
        client_id: '380078509373-814un77hbu18p9s6s8tqeit1t18lfnk1.apps.googleusercontent.com'
      });
    });
  }
// Client ID
const GOOGLE_CLIENT_ID = '380078509373-814un77hbu18p9s6s8tqeit1t18lfnk1.apps.googleusercontent.com';

// Debug logging
const debug = (message: string, data?: unknown) => {
  console.log(`[GoogleAuth] ${message}`, data || '');
};

// Initialize Google Sign-In with better error handling and timing
export const initGoogleSignIn = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      debug('Window object not available');
      reject(new Error('Window object not available'));
      return;
    }

    // Check if already initialized
    if (window.googleSignInReady) {
      debug('Google Sign-In already initialized');
      resolve();
      return;
    }

    debug('Starting Google Sign-In initialization');

    // Wait for gapi to be available
    const checkGapi = () => {
      if (window.gapi) {
        debug('GAPI available, loading auth2');
        window.gapi.load('auth2', () => {
          debug('Auth2 loaded, initializing with client ID');
          window.gapi.auth2.init({
            client_id: GOOGLE_CLIENT_ID
          }).then(() => {
            debug('Google Sign-In initialized successfully');
            window.googleSignInReady = true;
            resolve();
          }).catch((error) => {
            debug('Error initializing Google Sign-In', error);
            reject(error);
          });
        });
      } else {
        debug('GAPI not available yet, retrying...');
        // Retry after a short delay
        setTimeout(checkGapi, 100);
      }
    };

    checkGapi();
  });
};

// Handle successful Google Sign-In
export const onSignIn = (googleUser: GoogleUser) => {
  debug('Google Sign-In successful');
  const profile = googleUser.getBasicProfile();
  const authResponse = googleUser.getAuthResponse();
  
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  console.log('ID Token: ' + authResponse.id_token); // Send this to your backend for verification
  
  // Store user information for the app
  const userInfo = {
    id: profile.getId(),
    name: profile.getName(),
    email: profile.getEmail(),
    imageUrl: profile.getImageUrl(),
    idToken: authResponse.id_token
  };
  
  // Store in localStorage or send to your backend
  localStorage.setItem('googleUser', JSON.stringify(userInfo));
  localStorage.setItem('isLoggedIn', 'true');
  

  debug('User info stored, reloading page');
  // Reload page to update UI
  window.location.reload();
};

// Sign out function
export const signOut = () => {
  if (typeof window !== 'undefined' && window.gapi) {
    const auth2 = window.gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
      console.log('User signed out.');
      localStorage.removeItem('googleUser');
      localStorage.removeItem('isLoggedIn');
      window.location.reload();
    });
// Enhanced sign-in function with better error handling
export const triggerGoogleSignIn = (): Promise<GoogleUser> => {
  return new Promise((resolve, reject) => {
    debug('Triggering Google Sign-In');
    
    if (typeof window === 'undefined') {
      debug('Window object not available');
      reject(new Error('Window object not available'));
      return;
    }

    if (!window.gapi) {
      debug('Google API not loaded');
      reject(new Error('Google API not loaded'));
      return;
    }

    const auth2 = window.gapi.auth2.getAuthInstance();
    if (!auth2) {
      debug('Google Auth2 not initialized');
      reject(new Error('Google Auth2 not initialized'));
      return;
    }

    debug('Calling auth2.signIn()');
    auth2.signIn().then((googleUser: GoogleUser) => {
      debug('Sign-in promise resolved');
      onSignIn(googleUser);
      resolve(googleUser);
    }).catch((error: Error) => {
      debug('Google Sign-In failed', error);
      reject(error);
    });
  });
};

// Sign out function
export const signOut = () => {
  debug('Signing out');
  if (typeof window !== 'undefined' && window.gapi) {
    const auth2 = window.gapi.auth2.getAuthInstance();
    if (auth2) {
      auth2.signOut().then(() => {
        debug('User signed out successfully');
        localStorage.removeItem('googleUser');
        localStorage.removeItem('isLoggedIn');
        window.location.reload();
      });
    }
  }
};

// Render Google Sign-In button programmatically
export const renderGoogleButton = (elementId: string, theme: 'dark' | 'light' = 'light') => {

  debug(`Rendering Google button for element: ${elementId}`);
  if (typeof window !== 'undefined' && window.gapi) {
    window.gapi.load('signin2', () => {
      window.gapi.signin2.render(elementId, {
        'scope': 'profile email',
        'width': 240,
        'height': 50,
        'longtitle': true,
        'theme': theme,
        'onsuccess': onSignIn,
        'onfailure': (error: any) => console.error('Google Sign-In failed:', error)
      });
    });
  }
};


        'onfailure': (error: Error) => {
          debug('Google Sign-In button failed', error);
          console.error('Google Sign-In failed:', error);
        }
      });
    });
  }
};

// Check if Google Sign-In is ready
export const isGoogleSignInReady = (): boolean => {
  const ready = typeof window !== 'undefined' && 
         window.googleSignInReady === true && 
         window.gapi && 
         window.gapi.auth2.getAuthInstance() !== null;
  
  debug(`Google Sign-In ready check: ${ready}`);
  return ready;
};

// Make functions available globally for HTML onclick handlers
if (typeof window !== 'undefined') {
  window.onSignIn = onSignIn;
  window.signOut = signOut;
}
