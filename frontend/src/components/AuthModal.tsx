"use client";

import React, { useState, useEffect } from "react";
import apiService from '@/services/api';

export default function AuthModal({ open, onClose, defaultTab = "login" }: { open: boolean; onClose: () => void; defaultTab?: "login" | "signup" }) {
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
  const [mobileExists, setMobileExists] = useState(false);
  const [checkingMobile, setCheckingMobile] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  // ── Set tab from prop or URL param ──
  useEffect(() => {
    if (defaultTab) setTab(defaultTab);
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('auth') === 'signup') setTab('signup');
      else if (params.get('auth') === 'login') setTab('login');
    }
  }, [defaultTab]);

  if (!open) return null;

  const validatePassword = (pwd: string): string[] => {
    const errors: string[] = [];
    if (pwd.length < 8) errors.push('At least 8 characters');
    if (!/[A-Z]/.test(pwd)) errors.push('One uppercase letter');
    if (!/[a-z]/.test(pwd)) errors.push('One lowercase letter');
    if (!/[0-9]/.test(pwd)) errors.push('One number');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) errors.push('One special character (!@#$%^&*)');
    return errors;
  };

  const checkMobileExists = async (mobile: string) => {
    if (!mobile || mobile.length < 10) { setMobileExists(false); return; }
    setCheckingMobile(true);
    try {
      const response = await apiService.checkMobileExists(mobile);
      setMobileExists(response.exists || false);
      if (response.exists) setErrorMsg('This mobile number is already registered');
    } catch (err) {
      setMobileExists(false);
    } finally {
      setCheckingMobile(false);
    }
  };

  // ── Redirect helper after login/signup ──
  const handlePostAuthRedirect = () => {
    const redirectUrl = localStorage.getItem('redirectAfterLogin');
    if (redirectUrl) {
      localStorage.removeItem('redirectAfterLogin');
      window.location.href = redirectUrl;
    } else {
      window.location.reload();
    }
  };

  async function handleLogin(e?: React.FormEvent) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (!email || !password) { setErrorMsg('Please fill in all fields'); return; }
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await apiService.login({ email, password });
      if (res.token) {
        localStorage.setItem('isLoggedIn', 'true');
        setLoading(false);
        onClose();
        handlePostAuthRedirect(); // ← redirect to payment if needed
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

  async function handleSignup(e?: React.FormEvent) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (!name || !email || !password || !confirmPassword) { setErrorMsg('Please fill in all fields'); return; }
    if (!terms) { setErrorMsg('Please accept Terms & Privacy Policy'); return; }
    if (password !== confirmPassword) { setErrorMsg('Passwords do not match'); return; }
    const pwdErrors = validatePassword(password);
    if (pwdErrors.length > 0) { setErrorMsg('Password does not meet requirements'); setPasswordErrors(pwdErrors); return; }
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await apiService.register({ name, email, password });
      if (res.token || res.user) {
        setLoading(false);
        setStep('basic-info');
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
        .auth-modal input, .auth-modal select {
          box-sizing: border-box; width: 100%; padding: 12px 14px;
          border: 2px solid #f3eaff; border-radius: 8px; font-size: 16px;
          outline: none; color: #924DAC; font-weight: 500; background: #faf8fd;
          margin-top: 6px; margin-bottom: 14px; display: block;
        }
        .password-input-wrapper { position: relative; width: 100%; }
        .password-input-wrapper input { padding-right: 45px; }
        .eye-icon { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); cursor: pointer; font-size: 20px; color: #924DAC; user-select: none; }
        .password-requirements { background: #fff3ea; border: 1px solid #ffb366; border-radius: 8px; padding: 10px 12px; margin-top: -8px; margin-bottom: 12px; font-size: 12px; }
        .password-requirements ul { margin: 4px 0; padding-left: 20px; }
        .password-requirements li { color: #d46b08; margin: 2px 0; }
        .password-requirements li.valid { color: #2ecc40; text-decoration: line-through; }
        .mobile-status { font-size: 12px; margin-top: -8px; margin-bottom: 8px; }
        .mobile-status.checking { color: #888; }
        .mobile-status.exists { color: #d32f2f; }
        .mobile-status.available { color: #2ecc40; }
      `}</style>

      <div className="auth-modal" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 400, background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(146,77,172,0.12)', padding: '32px 28px', margin: '0 auto', position: 'relative' }}>
          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }} style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', fontSize: 22, color: '#924DAC', cursor: 'pointer' }}>
            &times;
          </button>

          {/* Step 1: Login/Signup */}
          {step === "login-signup" && (
            <>
              <div style={{ display: 'flex', borderBottom: '2px solid #f3eaff', marginBottom: 28 }}>
                <button style={{ flex: 1, background: 'none', border: 'none', borderBottom: tab === 'login' ? '3px solid #924DAC' : '3px solid transparent', color: tab === 'login' ? '#924DAC' : '#888', fontWeight: 700, fontSize: 18, padding: '8px 0', cursor: 'pointer' }}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setTab('login'); setErrorMsg(null); setPasswordErrors([]); }}>
                  Log In
                </button>
                <button style={{ flex: 1, background: 'none', border: 'none', borderBottom: tab === 'signup' ? '3px solid #924DAC' : '3px solid transparent', color: tab === 'signup' ? '#924DAC' : '#888', fontWeight: 700, fontSize: 18, padding: '8px 0', cursor: 'pointer' }}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setTab('signup'); setErrorMsg(null); setPasswordErrors([]); }}>
                  Sign Up
                </button>
              </div>

              {errorMsg && <div style={{ color: 'red', textAlign: 'center', marginBottom: 10, fontSize: 14 }}>{errorMsg}</div>}

              {tab === 'login' ? (
                <form onSubmit={handleLogin}>
                  <label>Email Address</label>
                  <input type="email" placeholder="Enter your email" value={email} onChange={e => { setEmail(e.target.value); setErrorMsg(null); }} required />
                  <label>Password</label>
                  <div className="password-input-wrapper">
                    <input type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={e => { setPassword(e.target.value); setErrorMsg(null); }} required />
                    <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "👁️" : "👁️‍🗨️"}</span>
                  </div>
                  <button type="submit" className="sayonara-btn" style={{ width: '100%', marginTop: 18, fontSize: 18 }} disabled={loading}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleLogin(); }}>
                    {loading ? 'Signing In...' : 'SIGN IN'}
                  </button>

                  {/* New user hint */}
                  <div style={{ textAlign: 'center', marginTop: 18, fontSize: 14, color: '#888' }}>
                    New to Sayonara?{' '}
                    <span
                      onClick={() => { setTab('signup'); setErrorMsg(null); }}
                      style={{ color: '#924DAC', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Create a free account
                    </span>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSignup}>
                  <label>Name <span style={{ color: 'red' }}>*</span></label>
                  <input type="text" placeholder="Enter your full name" value={name} onChange={e => { setName(e.target.value); setErrorMsg(null); }} required />
                  <label>Email Address <span style={{ color: 'red' }}>*</span></label>
                  <input type="email" placeholder="Enter your email" value={email} onChange={e => { setEmail(e.target.value); setErrorMsg(null); }} required />
                  <label>Password <span style={{ color: 'red' }}>*</span></label>
                  <div className="password-input-wrapper">
                    <input type={showPassword ? "text" : "password"} placeholder="Create a strong password" value={password}
                      onChange={e => { const pwd = e.target.value; setPassword(pwd); setPasswordErrors(validatePassword(pwd)); setErrorMsg(null); }} required />
                    <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "👁️" : "👁️‍🗨️"}</span>
                  </div>
                  {password && (
                    <div className="password-requirements">
                      <strong style={{ color: '#d46b08', fontSize: 13 }}>Password must contain:</strong>
                      <ul>
                        <li className={password.length >= 8 ? 'valid' : ''}>{password.length >= 8 ? '✓' : '○'} At least 8 characters</li>
                        <li className={/[A-Z]/.test(password) ? 'valid' : ''}>{/[A-Z]/.test(password) ? '✓' : '○'} One uppercase letter (A-Z)</li>
                        <li className={/[a-z]/.test(password) ? 'valid' : ''}>{/[a-z]/.test(password) ? '✓' : '○'} One lowercase letter (a-z)</li>
                        <li className={/[0-9]/.test(password) ? 'valid' : ''}>{/[0-9]/.test(password) ? '✓' : '○'} One number (0-9)</li>
                        <li className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'valid' : ''}>{/[!@#$%^&*(),.?":{}|<>]/.test(password) ? '✓' : '○'} One special character</li>
                      </ul>
                    </div>
                  )}
                  <label>Confirm Password <span style={{ color: 'red' }}>*</span></label>
                  <div className="password-input-wrapper">
                    <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm your password" value={confirmPassword} onChange={e => { setConfirmPassword(e.target.value); setErrorMsg(null); }} required />
                    <span className="eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? "👁️" : "👁️‍🗨️"}</span>
                  </div>
                  {confirmPassword && (
                    <div style={{ fontSize: 12, marginTop: -8, marginBottom: 12, color: password === confirmPassword ? '#2ecc40' : '#d32f2f' }}>
                      {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12, marginTop: 8 }}>
                    <input type="checkbox" checked={terms} onChange={e => { setTerms(e.target.checked); setErrorMsg(null); }} style={{ width: 18, height: 18, marginRight: 8, cursor: 'pointer', accentColor: '#924DAC' }} required />
                    <span style={{ fontSize: 13, color: '#666' }}>I agree to the <a href="#" style={{ color: '#924DAC', textDecoration: 'underline' }}>Terms</a> & <a href="#" style={{ color: '#924DAC', textDecoration: 'underline' }}>Privacy Policy</a></span>
                  </div>
                  <button type="submit" className="sayonara-btn" style={{ width: '100%', marginTop: 8, fontSize: 18 }} disabled={loading}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSignup(); }}>
                    {loading ? 'Signing Up...' : 'SIGN UP'}
                  </button>
                  <div style={{ marginTop: 16, padding: 12, background: '#e7ffe7', borderRadius: 8, fontSize: 13, color: '#2d7a2d', textAlign: 'center' }}>
                    🎉 <strong>Free Account:</strong> Post up to 3 items<br />
                    💎 Upgrade to ₹99/year for unlimited posts
                  </div>
                </form>
              )}
            </>
          )}

          {/* Step: Basic Info */}
          {step === "basic-info" && (
            <form onSubmit={e => {
              e.preventDefault();
              if (!contact || contact.length < 10) { setErrorMsg('Please enter a valid 10-digit mobile number'); return; }
              if (mobileExists) { setErrorMsg('This mobile number is already registered'); return; }
              setSuccessMsg('🎉 Your Sayonara account has been created! You can now post up to 3 items for free. Happy exchanging, bidding, and reselling!');
              setTimeout(() => {
                setSuccessMsg(null);
                localStorage.setItem('isLoggedIn', 'true');
                onClose();
                handlePostAuthRedirect(); // ← redirect to payment if needed
              }, 2500);
            }}>
              {successMsg && (
                <div style={{ background: '#e6f9f0', color: '#0f9d58', textAlign: 'center', padding: '12px 16px', borderRadius: 12, fontWeight: 600, marginBottom: 16 }}>
                  {successMsg}
                </div>
              )}
              {errorMsg && <div style={{ color: 'red', textAlign: 'center', marginBottom: 10, fontSize: 14 }}>{errorMsg}</div>}
              <h3 style={{ fontWeight: 700, fontSize: 20, color: '#222', marginBottom: 10 }}>Basic Information</h3>
              <p style={{ color: '#666', fontSize: 15, marginBottom: 18 }}>Complete your profile to continue</p>
              <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
              <input type="date" placeholder="Date of Birth" value={dob} onChange={e => setDob(e.target.value)} required />
              <select value={gender} onChange={e => setGender(e.target.value)} required>
                <option value="">Select Gender *</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <input type="tel" placeholder="Mobile Number (10 digits) *" value={contact}
                onChange={e => {
                  const mobile = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setContact(mobile); setErrorMsg(null);
                  if (mobile.length === 10) checkMobileExists(mobile);
                  else setMobileExists(false);
                }}
                pattern="[0-9]{10}" maxLength={10} required />
              {contact.length === 10 && (
                <div className={`mobile-status ${checkingMobile ? 'checking' : mobileExists ? 'exists' : 'available'}`}>
                  {checkingMobile ? '⏳ Checking...' : mobileExists ? '✗ Already registered' : '✓ Available'}
                </div>
              )}
              <input type="text" placeholder="Location (City, State)" value={location} onChange={e => setLocation(e.target.value)} required />
              <button type="submit" className="sayonara-btn" style={{ width: '100%', marginTop: 8, fontSize: 18, backgroundColor: successMsg ? '#c1e1c1' : '#924DAC', cursor: successMsg ? 'not-allowed' : 'pointer' }} disabled={!!successMsg || mobileExists}>
                CONTINUE
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
