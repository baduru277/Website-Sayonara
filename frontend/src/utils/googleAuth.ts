// Google Sign-In utility functions

declare global {
  interface Window {
    gapi: any;
    onSignIn: (googleUser: any) => void;
    signOut: () => void;
  }
} // <-- THIS CLOSING BRACE IS REQUIRED

// Now you can declare other interfaces
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

interface GoogleUser {
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
