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
        window.location.reload(); // Refresh UI
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

  // Signup handler (direct to basic info now)
  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await apiService.register({ name, email, password });
      if (res.token || res.user) {
        setLoading(false);
        setStep('basic-info'); // directly go to basic info
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
                  <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} />
                  <label>Password</label>
                  <input type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} />
                  <button type="submit" className="sayonara-btn" style={{ width: '100%', marginTop: 18, fontSize: 18 }} disabled={loading}>
                    {loading ? 'Signing In...' : 'SIGN IN'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSignup}>
                  <label>Name</label>
                  <input type="text" placeholder="Enter your name" value={name} onChange={e => setName(e.target.value)} />
                  <label>Email Address</label>
                  <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} />
                  <label>Password</label>
                  <input type="password" placeholder="Create a password" value={password} onChange={e => setPassword(e.target.value)} />
                  <label>Confirm Password</label>
                  <input type="password" placeholder="Confirm your password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 12 }}>
                    <input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} style={{ marginRight: 8 }} />
                    <span style={{ fontSize: 13, color: '#666', textAlign: 'center' }}>
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

          {/* Step: Basic Info (directly after signup) */}
          {step === "basic-info" && (
            <form onSubmit={e => {
              e.preventDefault();
              setSuccessMsg('🎉 Your Sayonara account has been created! Happy exchanging, bidding, and reselling.');
              setTimeout(() => {
                setSuccessMsg(null);
                setStep('login-signup');
                setTab('login');
              }, 2500); // show message 2.5s
            }}>
              {successMsg && (
                <div style={{
                  background: '#e6f9f0',
                  color: '#0f9d58',
                  textAlign: 'center',
                  padding: '12px 16px',
                  borderRadius: 12,
                  fontWeight: 600,
                  marginBottom: 16,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
                }}>
                  {successMsg}
                </div>
              )}
              <h3 style={{ fontWeight: 700, fontSize: 20, color: '#222', marginBottom: 10 }}>Basic Information</h3>
              <p style={{ color: '#666', fontSize: 15, marginBottom: 18 }}>Let's start with the basics</p>
              <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
              <input type="date" placeholder="Date of Birth" value={dob} onChange={e => setDob(e.target.value)} />
              <select value={gender} onChange={e => setGender(e.target.value)}>
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <input type="text" placeholder="Contact Number" value={contact} onChange={e => setContact(e.target.value)} />
              <input type="text" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
              <button type="submit" className="sayonara-btn" style={{ 
                width: '100%', 
                marginTop: 8, 
                fontSize: 18, 
                backgroundColor: successMsg ? '#c1e1c1' : '#924DAC',
                cursor: successMsg ? 'not-allowed' : 'pointer'
              }} disabled={!!successMsg}>
                CONTINUE
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
