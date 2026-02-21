"use client";

import React, { useState } from "react";
import apiService from '@/services/api';

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
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState<any>(null);

  if (!open) return null;

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
        window.location.reload();
      } else {
        setErrorMsg(res.error || res.message || 'Login failed.');
        setLoading(false);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || err.message || 'Login failed.';
      setErrorMsg(msg);
      setLoading(false);
    }
  }

  // Signup handler with validation
  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    // ✅ NEW: Password validation
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const res = await apiService.register({ name, email, password });
      if (res.token || res.user) {
        setSubscriptionInfo(res.subscription);
        setLoading(false);
        setStep('subscription-pending');
      } else {
        setErrorMsg(res.error || res.message || 'Signup failed.');
        setLoading(false);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || err.message || 'Signup failed.';
      setErrorMsg(msg);
      setLoading(false);
    }
  }

  return (
    <>
      <style jsx global>{`
        .auth-modal input,
        .auth-modal select {
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

          {/* Step 1: Login/Signup */}
          {step === "login-signup" && (
            <>
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
                  }}
                  onClick={() => setTab('signup')}
                >
                  Sign Up
                </button>
              </div>

              {errorMsg && <div style={{ color: 'red', textAlign: 'center', marginBottom: 10 }}>{errorMsg}</div>}

              {tab === 'login' ? (
                <form onSubmit={handleLogin}>
                  <label>Email Address</label>
                  <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required />
                  <label>Password</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Enter your password" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)}
                      style={{ paddingRight: '45px' }}
                      required
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
                        fontSize: '18px',
                        color: '#924DAC',
                        padding: '4px 8px'
                      }}
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  <button type="submit" className="sayonara-btn" style={{ width: '100%', marginTop: 18, fontSize: 18 }} disabled={loading}>
                    {loading ? 'Signing In...' : 'SIGN IN'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSignup}>
                  <label>Name</label>
                  <input type="text" placeholder="Enter your name" value={name} onChange={e => setName(e.target.value)} required />
                  <label>Email Address</label>
                  <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required />
                  <label>Password</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Create a password" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      required
                      style={{ paddingRight: '45px' }}
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
                        fontSize: '18px',
                        color: '#924DAC',
                        padding: '4px 8px'
                      }}
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  <label>Confirm Password</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      placeholder="Confirm your password" 
                      value={confirmPassword} 
                      onChange={e => setConfirmPassword(e.target.value)} 
                      required
                      style={{ paddingRight: '45px' }}
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
                        fontSize: '18px',
                        color: '#924DAC',
                        padding: '4px 8px'
                      }}
                    >
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12, gap: 8 }}>
                    <input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} required />
                    <span style={{ fontSize: 13, color: '#666' }}>
                      I agree to the <a href="#" style={{ color: '#924DAC' }}>Terms</a> & <a href="#" style={{ color: '#924DAC' }}>Privacy Policy</a>.
                    </span>
                  </div>
                  <button type="submit" className="sayonara-btn" style={{ width: '100%', marginTop: 8, fontSize: 18 }} disabled={loading}>
                    {loading ? 'Signing Up...' : 'SIGN UP'}
                  </button>
                </form>
              )}
            </>
          )}

          {/* Subscription Pending Step */}
          {step === "subscription-pending" && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
              <h3 style={{ fontWeight: 700, fontSize: 22, color: '#924DAC', marginBottom: 12 }}>
                Account Created Successfully!
              </h3>
              <p style={{ color: '#666', fontSize: 15, marginBottom: 24, lineHeight: 1.6 }}>
                Welcome to Sayonara! Your account has been created.
              </p>

              <div style={{
                background: '#fff7e6',
                border: '2px solid #ffd666',
                borderRadius: 12,
                padding: 20,
                marginBottom: 24
              }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>⏳</div>
                <h4 style={{ fontSize: 16, fontWeight: 700, color: '#d46b08', marginBottom: 8 }}>
                  Subscription Pending Approval
                </h4>
                <p style={{ fontSize: 14, color: '#ad6800', marginBottom: 12 }}>
                  {subscriptionInfo?.message || 'Please contact admin for payment approval'}
                </p>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: 12,
                  marginTop: 16,
                  fontSize: 13
                }}>
                  <div style={{ background: 'rgba(255,255,255,0.5)', padding: 10, borderRadius: 8 }}>
                    <div style={{ color: '#666', marginBottom: 4 }}>Plan</div>
                    <div style={{ fontWeight: 700, color: '#924DAC' }}>
                      {subscriptionInfo?.planName || 'Basic Plan'}
                    </div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.5)', padding: 10, borderRadius: 8 }}>
                    <div style={{ color: '#666', marginBottom: 4 }}>Amount</div>
                    <div style={{ fontWeight: 700, color: '#924DAC' }}>
                      ₹{subscriptionInfo?.amount || 99}
                    </div>
                  </div>
                </div>
              </div>

              <p style={{ fontSize: 13, color: '#999', marginBottom: 20 }}>
                💡 Contact support with your payment details to activate your subscription
              </p>

              <button 
                onClick={() => {
                  localStorage.setItem('isLoggedIn', 'true');
                  onClose();
                  window.location.reload();
                }}
                className="sayonara-btn" 
                style={{ width: '100%', fontSize: 16 }}
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
