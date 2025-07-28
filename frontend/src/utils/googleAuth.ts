// Google Sign-In utility functions

interface GoogleAPI {
  load: (api: string, callback: () => void) => void;
  auth2: {
    init: (config: { client_id: string }) => void;
    getAuthInstance: () => GoogleAuth2;
  };
  signin2: {
    render: (elementId: string, options: GoogleSignInOptions) => void;
  };
}

interface GoogleAuth2 {
  signIn: () => Promise<GoogleUser>;
  signOut: () => Promise<void>;
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
};

// Handle successful Google Sign-In
export const onSignIn = (googleUser: GoogleUser) => {
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
  }
};

// Render Google Sign-In button programmatically
export const renderGoogleButton = (elementId: string, theme: 'dark' | 'light' = 'light') => {
  if (typeof window !== 'undefined' && window.gapi) {
    window.gapi.load('signin2', () => {
      window.gapi.signin2.render(elementId, {
        'scope': 'profile email',
        'width': 240,
        'height': 50,
        'longtitle': true,
        'theme': theme,
        'onsuccess': onSignIn,
        'onfailure': (error: Error) => console.error('Google Sign-In failed:', error)
      });
    });
  }
};

// Make functions available globally for HTML onclick handlers
if (typeof window !== 'undefined') {
  window.onSignIn = onSignIn;
  window.signOut = signOut;
}