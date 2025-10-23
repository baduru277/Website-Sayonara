"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import apiService from '@/services/api';

export default function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter(); // for redirect
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
        window.location.reload(); // To update header state
      } else {
        setErrorMsg(res.error || res.message || 'Login failed.');
        setLoading(false);
      }
    } catch (err: unknown) {
      let errorMessage = 'Login failed.';
      if (err instanceof Error) errorMessage = err.message;
      else if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { error?: string } } };
        if (axiosError.response?.data?.error) errorMessage = axiosError.response.data.error;
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
        setLoading(false);
        localStorage.setItem('isLoggedIn', 'true');
        onClose();
        router.push('/dashboard'); // redirect to dashboard
      } else {
        setErrorMsg(res.error || res.message || 'Signup failed.');
        setLoading(false);
      }
    } catch (err: unknown) {
      let errorMessage = 'Signup failed.';
      if (err instanceof Error) errorMessage = err.message;
      else if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { error?: string } } };
        if (axiosError.response?.data?.error) errorMessage = axiosError.response.data.error;
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
              {errorMsg && <div style={{ color: 'red', textAlign: 'center', marginBottom: 10 }}>{errorMsg}</div>}

              {tab === 'login' ? (
                <form onSubmit={handleLogin}>
                  {/* ... login form (unchanged) */}
                </form>
              ) : (
                <form onSubmit={handleSignup}>
                  {/* ... signup form (unchanged) */}
                </form>
              )}
            </>
          )}

          {/* Step 2: Forgot Password */}
          {step === "forgot-password" && (
            <form onSubmit={e => { e.preventDefault(); setStep('reset-password'); }}>
              {/* ... forgot password form (unchanged) */}
            </form>
          )}

          {/* Step 3: Reset Password */}
          {step === "reset-password" && (
            <form onSubmit={e => { e.preventDefault(); setStep('login-signup'); }}>
              {/* ... reset password form (unchanged) */}
            </form>
          )}

          {/* Removed Step 4: Email Verification */}

          {/* Step 5: Basic Info */}
          {step === "basic-info" && (
            <form onSubmit={e => { e.preventDefault(); onClose(); }}>
              {/* ... basic info form (unchanged) */}
            </form>
          )}
        </div>
      </div>
    </>
  );
}
