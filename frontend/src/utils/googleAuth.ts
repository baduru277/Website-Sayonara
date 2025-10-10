// Google Sign-In utility for Next.js + TypeScript

declare global {
  interface Window {
    gapi: any;
    onSignIn: (googleUser: GoogleUser) => void;
    signOut: () => void;
  }
}

// --------------------
// Interfaces
// --------------------

export interface GoogleUser {
  getBasicProfile: () => {
    getId: () => string;
    getName: () => string;
    getGivenName: () => string;
    getFamilyName: () => string;
    getImageUrl: () => string;
    getEmail: () => string;
  };
  getAuthResponse: () => { id_token: string };
}

export interface GoogleSignInOptions {
  scope: string;
  width: number;
  height: number;
  longtitle: boolean;
  theme: 'dark' | 'light';
  onsuccess: (googleUser: GoogleUser) => void;
  onfailure: (error: Error) => void;
}

// --------------------
// Functions
// --------------------

// Initialize Google API and auth2
export function initGoogleSignIn(clientId: string, onSuccess: (user: any) => void, onFailure: (error: any) => void) {
  if (!window.gapi) {
    console.error('Google API not loaded');
    return;
  }

  window.gapi.load('auth2', () => {
    const auth2 = window.gapi.auth2.init({ client_id: clientId });
    auth2.then(() => {
      console.log('GoogleAuth initialized');
      onSuccess && onSuccess(auth2);
    }).catch((err: any) => {
      console.error('GoogleAuth init error', err);
      onFailure && onFailure(err);
    });
  });
}

// Called by Google after successful login
export function onSignIn(googleUser: GoogleUser) {
  const profile = googleUser.getBasicProfile();
  console.log('User signed in:', profile.getName(), profile.getEmail());
  // You can call your API here to authenticate the user on your backend
}

// Sign out the user
export function signOut() {
  const auth2 = window.gapi?.auth2?.getAuthInstance();
  if (auth2) {
    auth2.signOut().then(() => console.log('User signed out'));
  } else {
    console.warn('GoogleAuth instance not found');
  }
}
