"use client";

import React, { useState } from "react";
import Image from "next/image";
import apiService from '@/services/api';

export default function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!open) return null;

  // Login handler
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    
    try {
      const res = await apiService.login({ email, password });
      if (res.token) {
        localStorage.setItem('isLoggedIn', 'true');
        setSuccessMsg('Login successful! Redirecting...');
        
        // Trigger a custom event to notify the header about the login
        window.dispatchEvent(new CustomEvent('authStateChanged', { 
          detail: { isLoggedIn: true, userData: res.user } 
        }));
        
        setTimeout(() => {
          onClose();
          // Don't reload the page, let the header update naturally
        }, 1500);
      } else {
        setErrorMsg(res.error || res.message || 'Login failed.');
      }
    } catch (err: unknown) {
      let errorMessage = 'Login failed.';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { error?: string } } };
        if (axiosError.response?.data?.error) {
          errorMessage = axiosError.response.data.error;
        }
      }
      
      setErrorMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  // Signup handler
  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    
    try {
      const userData = {
        name: `${firstName} ${lastName}`,
        firstName,
        lastName,
        email,
        password
      };
      
      const res = await apiService.register(userData);
      if (res.token || res.user) {
        setSuccessMsg('Registration successful! You can now login.');
        setTab('login');
        // Clear form
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setErrorMsg(res.error || res.message || 'Registration failed.');
      }
    } catch (err: unknown) {
      let errorMessage = 'Registration failed.';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { error?: string } } };
        if (axiosError.response?.data?.error) {
          errorMessage = axiosError.response.data.error;
        }
      }
      
      setErrorMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  const validateForm = () => {
    if (tab === 'signup') {
      if (!firstName.trim()) return 'First name is required';
      if (!lastName.trim()) return 'Last name is required';
      if (!email.trim()) return 'Email is required';
      if (!email.includes('@')) return 'Please enter a valid email';
      if (password.length < 6) return 'Password must be at least 6 characters';
      if (password !== confirmPassword) return 'Passwords do not match';
    } else {
      if (!email.trim()) return 'Email is required';
      if (!password) return 'Password is required';
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }
    
    if (tab === 'login') {
      handleLogin(e);
    } else {
      handleSignup(e);
    }
  };

  return (
    <>
      <style jsx global>{`
        .auth-modal input,
        .auth-modal select,
        .auth-modal textarea {
          box-sizing: border-box;
          width: 100%;
          padding: 12px 14px;
          border: 2px solid #f3eaff;
          border-radius: 8px;
          font-size: 16px;
          outline: none;
          color: #924DAC;
          font-weight: 500;
          background: #faf8fd;
          margin-top: 6px;
          margin-bottom: 14px;
          display: block;
        }
      `}</style>
      <div className="auth-modal" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.18)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          width: '100%',
          maxWidth: 400,
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(146,77,172,0.12)',
          padding: '32px 28px',
          margin: '0 auto',
          position: 'relative',
        }}>
          <button onClick={onClose} style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', fontSize: 22, color: '#924DAC', cursor: 'pointer' }}>&times;</button>
          
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
              onClick={() => {
                setTab('login');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
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
              onClick={() => {
                setTab('signup');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
            >
              Sign Up
            </button>
          </div>

          {errorMsg && <div style={{ color: 'red', textAlign: 'center', marginBottom: 10, fontSize: 14 }}>{errorMsg}</div>}
          {successMsg && <div style={{ color: 'green', textAlign: 'center', marginBottom: 10, fontSize: 14 }}>{successMsg}</div>}

          <form onSubmit={handleSubmit}>
            {tab === 'signup' && (
              <>
                <div style={{ marginBottom: 18 }}>
                  <label style={{ fontWeight: 600, color: '#444', fontSize: 15 }}>First Name</label>
                  <input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div style={{ marginBottom: 18 }}>
                  <label style={{ fontWeight: 600, color: '#444', fontSize: 15 }}>Last Name</label>
                  <input
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </>
            )}

            <div style={{ marginBottom: 18 }}>
              <label style={{ fontWeight: 600, color: '#444', fontSize: 15 }}>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={{ fontWeight: 600, color: '#444', fontSize: 15 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={tab === 'login' ? 'Enter your password' : 'Create a password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    paddingRight: '45px',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#924DAC',
                    fontSize: '18px',
                    padding: '4px',
                  }}
                >
                  {showPassword ? (
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                      <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {tab === 'signup' && (
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontWeight: 600, color: '#444', fontSize: 15 }}>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{
                      paddingRight: '45px',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#924DAC',
                      fontSize: '18px',
                      padding: '4px',
                    }}
                  >
                    {showConfirmPassword ? (
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                        <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                        <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              className="sayonara-btn" 
              style={{ 
                width: '100%', 
                marginTop: 8, 
                fontSize: 18,
                opacity: loading ? 0.6 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }} 
              disabled={loading}
            >
              {loading 
                ? (tab === 'login' ? 'SIGNING IN...' : 'SIGNING UP...') 
                : (tab === 'login' ? 'SIGN IN' : 'SIGN UP')
              }
            </button>
          </form>
        </div>
      </div>
    </>
  );
} 