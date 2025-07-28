"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { initGoogleSignIn, onSignIn, signOut, GoogleUser } from "@/utils/googleAuth";

export default function LoginPage() {
  const [tab, setTab] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    // Initialize Google Sign-In when component mounts
    const timer = setTimeout(() => {
      initGoogleSignIn();
    }, 1000); // Wait for Google API to load

    return () => clearTimeout(timer);
  }, []);

  const handleGoogleSignIn = () => {
    if (typeof window !== 'undefined' && window.gapi) {
      const auth2 = window.gapi.auth2.getAuthInstance();
      if (auth2) {
        auth2.signIn().then((googleUser: GoogleUser) => {
          onSignIn(googleUser);
        }).catch((error: Error) => {
          console.error('Google Sign-In failed:', error);
        });
      }
    }
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
            className={tab === 'login' ? 'sayonara-btn' : ''}
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
            className={tab === 'signup' ? 'sayonara-btn' : ''}
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
        {/* Form */}
        {tab === 'login' ? (
          <form>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontWeight: 600, color: '#444', fontSize: 15 }}>Email Address</label>
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
                }}
              />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label style={{ fontWeight: 600, color: '#444', fontSize: 15 }}>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
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
                }}
              />
              <div style={{ textAlign: 'right', marginTop: 4 }}>
                <Link href="/forgot-password" style={{ color: '#924DAC', fontSize: 13, textDecoration: 'underline', fontWeight: 500 }}>
                  Forgot Password?
                </Link>
              </div>
            </div>
            <button type="submit" className="sayonara-btn" style={{ width: '100%', marginTop: 18, fontSize: 18 }}>
              SIGN IN
            </button>
            <div style={{ textAlign: 'center', margin: '18px 0 10px', color: '#aaa', fontWeight: 500 }}>or</div>
            
            {/* Google Sign-In Button */}
            <div className="g-signin2" data-onsuccess="onSignIn" style={{ marginBottom: 10 }}></div>
            <button 
              type="button" 
              className="sayonara-btn" 
              onClick={handleGoogleSignIn}
              style={{ 
                width: '100%', 
                marginBottom: 10, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: 10, 
                background: '#fff', 
                color: '#444', 
                border: '2px solid #924DAC' 
              }}
            >
              <Image src="/google.svg" alt="Google" width={22} height={22} /> Login with Google
            </button>
            
            <button type="button" className="sayonara-btn" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: '#fff', color: '#444', border: '2px solid #924DAC' }}>
              <Image src="/apple.svg" alt="Apple" width={22} height={22} /> Login with Apple
            </button>
          </form>
        ) : (
          <form>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontWeight: 600, color: '#444', fontSize: 15 }}>Email Address</label>
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
                }}
              />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontWeight: 600, color: '#444', fontSize: 15 }}>Password</label>
              <input
                type="password"
                placeholder="Create a password"
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
                }}
              />
            </div>
            <button type="submit" className="sayonara-btn" style={{ width: '100%', marginTop: 18, fontSize: 18 }}>
              SIGN UP
            </button>
            <div style={{ textAlign: 'center', margin: '18px 0 10px', color: '#aaa', fontWeight: 500 }}>or</div>
            
            {/* Google Sign-Up Button */}
            <button 
              type="button" 
              className="sayonara-btn" 
              onClick={handleGoogleSignIn}
              style={{ 
                width: '100%', 
                marginBottom: 10, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: 10, 
                background: '#fff', 
                color: '#444', 
                border: '2px solid #924DAC' 
              }}
            >
              <Image src="/google.svg" alt="Google" width={22} height={22} /> Sign up with Google
            </button>
            
            <button type="button" className="sayonara-btn" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: '#fff', color: '#444', border: '2px solid #924DAC' }}>
              <Image src="/apple.svg" alt="Apple" width={22} height={22} /> Sign up with Apple
            </button>
          </form>
        )}
      </div>
      
      {/* Sign Out Link for Testing */}
      <div style={{ marginTop: 20 }}>
        <a href="#" onClick={(e) => { e.preventDefault(); signOut(); }} style={{ color: '#924DAC', textDecoration: 'underline' }}>
          Sign out
        </a>
      </div>
    </div>
  );
} 