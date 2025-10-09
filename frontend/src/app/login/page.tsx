"use client";

import React, { useState, useEffect } from "react";

// Mock Google Auth utilities for demonstration
const initGoogleSignIn = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Google Sign-In initialized');
      resolve(true);
    }, 1000);
  });
};

const onSignIn = (googleUser) => {
  console.log('User signed in:', googleUser);
  alert('Successfully signed in with Google!');
};

const signOut = () => {
  console.log('User signed out');
  alert('Signed out successfully!');
};

export default function LoginPage() {
  const [tab, setTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Initialize Google Sign-In when component mounts
    const timer = setTimeout(() => {
      initGoogleSignIn().catch(error => {
        console.error('Failed to initialize Google Sign-In:', error);
        setErrorMsg('Failed to initialize Google Sign-In. Please refresh the page.');
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);
    
    try {
      // Simulate Google Sign-In
      await new Promise(resolve => setTimeout(resolve, 1500));
      onSignIn({ email: 'user@example.com' });
    } catch (error) {
      console.error('Google Sign-In failed:', error);
      setErrorMsg(error instanceof Error ? error.message : 'Google Sign-In failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`${tab === 'login' ? 'Login' : 'Sign up'} form submitted!`);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8f9fa',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Quicksand, Montserrat, sans-serif',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 370,
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(146,77,172,0.08)',
        padding: '32px 28px',
        margin: '0 auto',
      }}>
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '2px solid #f3eaff', marginBottom: 28 }}>
          <button
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              borderBottom: tab === 'login' ? '3px solid #924DAC' : '3px solid transparent',
              color: tab === 'login' ? '#924DAC' : '#888',
              fontWeight: 700,
              fontSize: 18,
              padding: '8px 0',
              cursor: 'pointer',
              borderRadius: 0,
              outline: 'none',
              transition: 'color 0.2s, border 0.2s',
            }}
            onClick={() => setTab('login')}
          >
            Log In
          </button>
          <button
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              borderBottom: tab === 'signup' ? '3px solid #924DAC' : '3px solid transparent',
              color: tab === 'signup' ? '#924DAC' : '#888',
              fontWeight: 700,
              fontSize: 18,
              padding: '8px 0',
              cursor: 'pointer',
              borderRadius: 0,
              outline: 'none',
              transition: 'color 0.2s, border 0.2s',
            }}
            onClick={() => setTab('signup')}
          >
            Sign Up
          </button>
        </div>
        
        {/* Error Message */}
        {errorMsg && (
          <div style={{ 
            color: 'red', 
            textAlign: 'center', 
            marginBottom: 10, 
            fontSize: 14,
            padding: '8px',
            background: '#fee',
            borderRadius: 4
          }}>
            {errorMsg}
          </div>
        )}
        
        {/* Form */}
        <div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontWeight: 600, color: '#444', fontSize: 15, display: 'block' }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '2px solid #f3eaff',
                borderRadius: 8,
                fontSize: 16,
                marginTop: 6,
                outline: 'none',
                color: '#924DAC',
                fontWeight: 500,
                background: '#faf8fd',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontWeight: 600, color: '#444', fontSize: 15, display: 'block' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={tab === 'login' ? 'Enter your password' : 'Create a password'}
                style={{
                  width: '100%',
                  padding: '12px 44px 12px 14px',
                  border: '2px solid #f3eaff',
                  borderRadius: 8,
                  fontSize: 16,
                  marginTop: 6,
                  outline: 'none',
                  color: '#924DAC',
                  fontWeight: 500,
                  background: '#faf8fd',
                  boxSizing: 'border-box'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#924DAC',
                  marginTop: 3
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
            {tab === 'login' && (
              <div style={{ textAlign: 'right', marginTop: 4 }}>
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); alert('Forgot password clicked'); }}
                  style={{ color: '#924DAC', fontSize: 13, textDecoration: 'underline', fontWeight: 500 }}
                >
                  Forgot Password?
                </a>
              </div>
            )}
          </div>
          <button 
            onClick={handleSubmit}
            style={{ 
              width: '100%', 
              marginTop: 18, 
              fontSize: 18,
              background: '#924DAC',
              color: 'white',
              border: 'none',
              padding: '14px',
              borderRadius: 8,
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              transition: 'all 0.2s'
            }}
            disabled={loading}
          >
            {tab === 'login' ? 'SIGN IN' : 'SIGN UP'}
          </button>
          <div style={{ textAlign: 'center', margin: '18px 0 10px', color: '#aaa', fontWeight: 500 }}>
            or
          </div>
          
          <button 
            onClick={handleGoogleSignIn}
            disabled={loading}
            style={{ 
              width: '100%', 
              marginBottom: 10, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: 10, 
              background: '#fff', 
              color: '#444', 
              border: '2px solid #924DAC',
              padding: '12px',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M21.8055 11.2221C21.8055 10.2221 21.7166 9.49984 21.5277 8.75539H11.1611V13.2665H17.2388C17.0944 14.3999 16.3166 16.1554 14.5833 17.3332L14.5617 17.4777L18.0722 20.1999L18.3166 20.2221C20.6277 18.111 21.8055 14.9776 21.8055 11.2221Z" fill="#4285F4"/>
              <path d="M11.1611 23.0444C14.4722 23.0444 17.2388 21.9999 19.1388 20.2221L14.5833 17.3332C13.4166 18.111 11.9277 18.6443 11.1611 18.6443C7.91663 18.6443 5.18329 16.5332 4.09441 13.711L3.95551 13.7221L0.294397 16.5443L0.249963 16.6777C2.13885 20.4443 6.38329 23.0444 11.1611 23.0444Z" fill="#34A853"/>
              <path d="M4.09442 13.711C3.81664 12.8888 3.65553 12.011 3.65553 11.0999C3.65553 10.1888 3.81664 9.31103 4.08331 8.48881L4.07553 8.33325L0.366642 5.46658L0.249975 5.52214C0.361086 5.74436 0.249975 5.52214 0.249975 5.52214C-0.638914 7.29992 -0.638914 9.43325 0.249975 11.211C0.249975 11.211 0.361086 10.9888 0.249975 11.211L4.09442 13.711Z" fill="#FBBC05"/>
              <path d="M11.1611 3.55547C12.4277 3.55547 13.2833 4.11102 13.7611 4.55547L17.8277 0.622132C15.9055 -1.17765 14.4722 -1.82209 11.1611 -1.82209C6.38329 -1.82209 2.13885 0.77769 0.249963 4.54436L4.08329 7.04436C5.18329 4.22214 7.91663 2.11102 11.1611 2.11102V3.55547Z" fill="#EB4335"/>
            </svg>
            {loading ? 'Loading...' : (tab === 'login' ? 'Login with Google' : 'Sign up with Google')}
          </button>
          
          <button 
            onClick={() => alert('Apple sign-in clicked')}
            style={{ 
              width: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: 10, 
              background: '#fff', 
              color: '#444', 
              border: '2px solid #924DAC',
              padding: '12px',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M17.5267 11.6373C17.5394 13.4533 18.3013 14.848 19.8188 15.8213C19.2314 16.928 18.5331 17.9267 17.7303 18.824C16.752 19.9307 15.7229 21.0373 14.1545 21.064C13.2908 21.0907 12.6779 20.8373 12.0395 20.5707C11.3757 20.304 10.6865 20.024 9.66947 20.024C8.60146 20.024 7.87412 20.3173 7.17228 20.5973C6.49593 20.8773 5.84507 21.1573 4.98138 21.1973C3.46291 21.264 2.33483 20.0373 1.34375 18.944C-0.726104 16.6507 -2.21732 11.8107 -0.0590916 8.42398C1.00892 6.73465 2.72198 5.70131 4.57062 5.66798C5.48334 5.64798 6.34703 6.00131 7.11044 6.31465C7.84878 6.62798 8.50065 6.90131 9.18249 6.90131C9.80191 6.90131 10.5148 6.60131 11.3266 6.26131C12.3691 5.82131 13.5736 5.31465 14.9012 5.44798C16.2416 5.58131 17.5648 6.11465 18.4393 7.08131C17.2728 7.86798 16.8123 8.84131 16.7742 10.064C16.7361 11.52 17.5267 12.624 18.5013 13.3173C18.6522 13.424 18.7777 13.504 18.8778 13.5707L17.5267 11.6373Z" fill="currentColor"/>
              <path d="M14.1545 0.424C14.1545 1.704 13.5736 2.904 12.7454 3.85067C11.7453 4.984 10.5275 5.68067 9.18249 5.56067C9.14439 5.40067 9.11995 5.22067 9.11995 5.024C9.11995 3.79733 9.75102 2.48067 10.6011 1.56067C11.025 1.09733 11.5872 0.704 12.2889 0.397333C12.9906 0.090667 13.6669 -0.0493333 14.3176 0.024C14.3557 0.157333 14.3812 0.290667 14.3939 0.424H14.1545Z" fill="currentColor"/>
            </svg>
            {tab === 'login' ? 'Login with Apple' : 'Sign up with Apple'}
          </button>
        </div>
      </div>
      
      <div style={{ marginTop: 20 }}>
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); signOut(); }} 
          style={{ color: '#924DAC', textDecoration: 'underline', fontWeight: 500 }}
        >
          Sign out
        </a>
      </div>
    </div>
  );
}
