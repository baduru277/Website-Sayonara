"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import apiService from '@/services/api';
import { initGoogleSignIn, triggerGoogleSignIn, isGoogleSignInReady, GoogleUser } from "@/utils/googleAuth";

export default function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState("login-signup");
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [contact, setContact] = useState("");
  const [location, setLocation] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      // Initialize Google Sign-In when modal opens
      initGoogleSignIn().catch(error => {
        console.error('Failed to initialize Google Sign-In:', error);
        setErrorMsg('Failed to initialize Google Sign-In. Please refresh the page.');
      });
    }
  }, [open]);

  if (!open) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);
    
    try {
      // Check if Google Sign-In is ready
      if (!isGoogleSignInReady()) {
        // Try to initialize if not ready
        await initGoogleSignIn();
      }
      
      // Trigger the sign-in
      await triggerGoogleSignIn();
      onClose(); // Close modal after successful sign-in
    } catch (error: any) {
      console.error('Google Sign-In failed:', error);
      setErrorMsg(error.message || 'Google Sign-In failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Login handler
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await apiService.login({ email, password });
      if (res.token) {
        localStorage.setItem('isLoggedIn', 'true');
        setLoading(false);
        onClose();
        window.location.reload(); // To update header state
      } else {
        setErrorMsg(res.error || res.message || 'Login failed.');
        setLoading(false);
      }
    } catch (err: unknown) {
      // Try to extract backend error message
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
      setLoading(false);
    }
  }

  // Signup handler
  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await apiService.register({ name, email, password });
      if (res.token || res.user) {
        // Optionally, auto-login or go to verify-email step
        setLoading(false);
        setStep('verify-email');
      } else {
        setErrorMsg(res.error || res.message || 'Signup failed.');
        setLoading(false);
      }
    } catch (err: unknown) {
      // Try to extract backend error message
      let errorMessage = 'Signup failed.';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { error?: string } } };
        if (axiosError.response?.data?.error) {
          errorMessage = axiosError.response.data.error;
        }
      }
      
      setErrorMsg(errorMessage);
      setLoading(false);
    }
  }

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
          {/* Step 1: Login/Sign Up */}
          {step === "login-signup" && (
            <>
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
              {errorMsg && <div style={{ color: 'red', textAlign: 'center', marginBottom: 10 }}>{errorMsg}</div>}
              {tab === 'login' ? (
                <form onSubmit={handleLogin}>
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ fontWeight: 600, color: '#444', fontSize: 15 }}>Email Address</label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <label style={{ fontWeight: 600, color: '#444', fontSize: 15 }}>Password</label>
                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                    <div style={{ textAlign: 'right', marginTop: 4 }}>
                      <button type="button" style={{ color: '#924DAC', fontSize: 13, textDecoration: 'underline', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setStep('forgot-password')}>
                        Forgot Password?
                      </button>
                    </div>
                  </div>
                  <button type="submit" className="sayonara-btn" style={{ width: '100%', marginTop: 18, fontSize: 18 }} disabled={loading}>
                    {loading ? 'Signing In...' : 'SIGN IN'}
                  </button>
                  <div style={{ textAlign: 'center', margin: '18px 0 10px', color: '#aaa', fontWeight: 500 }}>or</div>
                  
                  {/* Google Sign-In Button */}
                  <div className="g-signin2" data-onsuccess="onSignIn" style={{ marginBottom: 10 }}></div>
                  <button 
                    type="button" 
                    className="sayonara-btn" 
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
                      opacity: loading ? 0.6 : 1,
                      cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <Image src="/google.svg" alt="Google" width={22} height={22} /> 
                    {loading ? 'Signing in...' : 'Login with Google'}
                  </button>
                  
                  <button type="button" className="sayonara-btn" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: '#fff', color: '#444', border: '2px solid #924DAC' }}>
                    <Image src="/apple.svg" alt="Apple" width={22} height={22} /> Login with Apple
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSignup}>
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ fontWeight: 600, color: '#444', fontSize: 15 }}>Name</label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ fontWeight: 600, color: '#444', fontSize: 15 }}>Email Address</label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ fontWeight: 600, color: '#444', fontSize: 15 }}>Password</label>
                    <input
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </div>
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ fontWeight: 600, color: '#444', fontSize: 15 }}>Confirm Password</label>
                    <input
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} style={{ marginRight: 8 }} />
                    </div>
                    <span style={{ fontSize: 13, color: '#666', textAlign: 'center', marginTop: 4, lineHeight: 1.5, maxWidth: 260 }}>
                      Are you agree to <a href="#" style={{ color: '#924DAC', textDecoration: 'underline' }}>Sayonara Terms of Condition</a> and <a href="#" style={{ color: '#924DAC', textDecoration: 'underline' }}>Privacy Policy</a>.
                    </span>
                  </div>
                  <button type="submit" className="sayonara-btn" style={{ width: '100%', marginTop: 8, fontSize: 18 }} disabled={loading}>
                    {loading ? 'Signing Up...' : 'SIGN UP'}
                  </button>
                  <div style={{ textAlign: 'center', margin: '18px 0 10px', color: '#aaa', fontWeight: 500 }}>or</div>
                  
                  {/* Google Sign-Up Button */}
                  <button 
                    type="button" 
                    className="sayonara-btn" 
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
                      opacity: loading ? 0.6 : 1,
                      cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <Image src="/google.svg" alt="Google" width={22} height={22} /> 
                    {loading ? 'Signing up...' : 'Sign up with Google'}
                  </button>
                  
                  <button type="button" className="sayonara-btn" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: '#fff', color: '#444', border: '2px solid #924DAC' }}>
                    <Image src="/apple.svg" alt="Apple" width={22} height={22} /> Sign up with Apple
                  </button>
                </form>
              )}
            </>
          )}
          {/* Step 2: Forgot Password */}
          {step === "forgot-password" && (
            <form onSubmit={e => { e.preventDefault(); setStep('reset-password'); }}>
              <h3 style={{ fontWeight: 700, fontSize: 20, color: '#222', marginBottom: 10 }}>Forget Password</h3>
              <p style={{ color: '#666', fontSize: 15, marginBottom: 18 }}>Enter your registered email to receive a password reset link</p>
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontWeight: 600, color: '#444', fontSize: 15 }}>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
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
              <button type="submit" className="sayonara-btn" style={{ width: '100%', marginTop: 8, fontSize: 18 }}>
                SEND CODE
              </button>
              <div style={{ marginTop: 16, fontSize: 14, color: '#666' }}>
                Already have account? <button type="button" style={{ color: '#924DAC', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => setStep('login-signup')}>Sign In</button><br />
                Don&apos;t have account? <button type="button" style={{ color: '#924DAC', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => { setTab('signup'); setStep('login-signup'); }}>Sign Up</button>
              </div>
              <div style={{ marginTop: 10, fontSize: 13, color: '#888' }}>
                You may contact <a href="#" style={{ color: '#924DAC', textDecoration: 'underline' }}>Customer Service</a> for help restoring access to your account.
              </div>
            </form>
          )}
          {/* Step 3: Reset Password */}
          {step === "reset-password" && (
            <form onSubmit={e => { e.preventDefault(); setStep('login-signup'); }}>
              <h3 style={{ fontWeight: 700, fontSize: 20, color: '#222', marginBottom: 10 }}>Reset Password</h3>
              <p style={{ color: '#666', fontSize: 15, marginBottom: 18 }}>Set a new password to access your account</p>
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontWeight: 600, color: '#444', fontSize: 15 }}>Password</label>
                <input
                  type="password"
                  placeholder="8+ characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
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
                <label style={{ fontWeight: 600, color: '#444', fontSize: 15 }}>Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
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
              <button type="submit" className="sayonara-btn" style={{ width: '100%', marginTop: 8, fontSize: 18 }}>
                RESET PASSWORD
              </button>
            </form>
          )}
          {/* Step 4: Email Verification */}
          {step === "verify-email" && (
            <form onSubmit={e => { e.preventDefault(); setStep('basic-info'); }}>
              <h3 style={{ fontWeight: 700, fontSize: 20, color: '#222', marginBottom: 10 }}>Verify Your Email Address</h3>
              <p style={{ color: '#666', fontSize: 15, marginBottom: 18 }}>
                We&apos;ve sent a verification to <span style={{ color: '#924DAC', fontWeight: 600 }}>{email || 'your email'}</span> to verify your email address and activate your account.
              </p>
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontWeight: 600, color: '#444', fontSize: 15 }}>Verification Code</label>
                <input
                  type="text"
                  placeholder="Enter code"
                  value={verificationCode}
                  onChange={e => setVerificationCode(e.target.value)}
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
                  <button type="button" style={{ color: '#924DAC', fontSize: 13, textDecoration: 'underline', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => alert('Code resent!')}>
                    Resend Code
                  </button>
                </div>
              </div>
              <button type="submit" className="sayonara-btn" style={{ width: '100%', marginTop: 8, fontSize: 18 }}>
                VERIFY ME
              </button>
            </form>
          )}
          {/* Step 5: Basic Info */}
          {step === "basic-info" && (
            <form onSubmit={e => { e.preventDefault(); onClose(); }}>
              <h3 style={{ fontWeight: 700, fontSize: 20, color: '#222', marginBottom: 10 }}>Basic Information</h3>
              <p style={{ color: '#666', fontSize: 15, marginBottom: 18 }}>Let&apos;s Start with the Basics info</p>
              <div style={{ marginBottom: 14 }}>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '2px solid #f3eaff',
                    borderRadius: 8,
                    fontSize: 16,
                    marginTop: 0,
                    outline: 'none',
                    color: '#924DAC',
                    fontWeight: 500,
                    background: '#faf8fd',
                  }}
                />
              </div>
              <div style={{ marginBottom: 14 }}>
                <input
                  type="date"
                  placeholder="Date of Birth"
                  value={dob}
                  onChange={e => setDob(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '2px solid #f3eaff',
                    borderRadius: 8,
                    fontSize: 16,
                    marginTop: 0,
                    outline: 'none',
                    color: '#924DAC',
                    fontWeight: 500,
                    background: '#faf8fd',
                  }}
                />
              </div>
              <div style={{ marginBottom: 14 }}>
                <select
                  value={gender}
                  onChange={e => setGender(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '2px solid #f3eaff',
                    borderRadius: 8,
                    fontSize: 16,
                    marginTop: 0,
                    outline: 'none',
                    color: '#924DAC',
                    fontWeight: 500,
                    background: '#faf8fd',
                  }}
                >
                  <option value="">Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div style={{ marginBottom: 14 }}>
                <input
                  type="text"
                  placeholder="Contact Number"
                  value={contact}
                  onChange={e => setContact(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '2px solid #f3eaff',
                    borderRadius: 8,
                    fontSize: 16,
                    marginTop: 0,
                    outline: 'none',
                    color: '#924DAC',
                    fontWeight: 500,
                    background: '#faf8fd',
                  }}
                />
              </div>
              <div style={{ marginBottom: 18 }}>
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '2px solid #f3eaff',
                    borderRadius: 8,
                    fontSize: 16,
                    marginTop: 0,
                    outline: 'none',
                    color: '#924DAC',
                    fontWeight: 500,
                    background: '#faf8fd',
                  }}
                />
              </div>
              <button type="submit" className="sayonara-btn" style={{ width: '100%', marginTop: 8, fontSize: 18 }}>
                SIGN IN
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
} 