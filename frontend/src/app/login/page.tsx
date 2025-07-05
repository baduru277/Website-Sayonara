'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function LoginPage() {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login/signup logic here
    if (tab === 'login') {
      // Login logic
      console.log('Login:', formData);
    } else {
      // Signup logic
      console.log('Signup:', formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center bg-gray-50 py-12 px-4">
        {/* Breadcrumbs */}
        <nav className="w-full max-w-md mx-auto mb-8 text-sm text-gray-500 flex items-center gap-2">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-1">&gt;</span>
          <span>User Account</span>
          <span className="mx-1">&gt;</span>
          <span className="text-purple-700 font-semibold">Sign In</span>
        </nav>
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl px-8 py-8 flex flex-col items-center">
            {/* Tabs */}
            <div className="flex w-full mb-6 border-b border-gray-200">
              <button
                className={`flex-1 py-2 text-center font-bold text-lg transition-colors ${tab === 'login' ? 'text-purple-700 border-b-2 border-purple-700' : 'text-gray-400'}`}
                onClick={() => setTab('login')}
              >
                Log In
              </button>
              <button
                className={`flex-1 py-2 text-center font-bold text-lg transition-colors ${tab === 'signup' ? 'text-purple-700 border-b-2 border-purple-700' : 'text-gray-400'}`}
                onClick={() => setTab('signup')}
              >
                Sign Up
              </button>
            </div>
            <form className="w-full" onSubmit={handleSubmit} autoComplete="off">
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none"
                  placeholder="Enter your email"
                />
              </div>
              <div className="mb-4 relative">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-8 transform -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.875-4.575A9.956 9.956 0 0122 9c0 5.523-4.477 10-10 10a9.956 9.956 0 01-4.575-1.125" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm2.121-2.121A8.962 8.962 0 0121 12c0 4.418-3.582 8-8 8a8.962 8.962 0 01-4.879-1.464M4.222 4.222l15.556 15.556" /></svg>
                  )}
                </button>
              </div>
              {tab === 'signup' && (
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-800 mb-1">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none"
                    placeholder="Confirm your password"
                  />
                </div>
              )}
              <div className="flex items-center justify-end mb-4">
                {tab === 'login' ? (
                  <Link href="/forgot-password" className="text-sm text-purple-700 hover:underline">
                    Forgot Password?
                  </Link>
                ) : <span />}
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-full font-bold text-white text-lg bg-purple-700 hover:bg-purple-800 transition-colors shadow-md mb-4 flex items-center justify-center gap-2"
              >
                {tab === 'login' ? 'SIGN IN' : 'SIGN UP'}
                <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </button>
              <div className="flex items-center my-4">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="mx-3 text-gray-400 text-sm">or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 border-2 border-purple-500 text-purple-700 font-bold rounded-full bg-white hover:bg-purple-50 transition-colors"
                  onClick={() => alert('Google sign-in placeholder')}
                >
                  <svg className="w-5 h-5" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.9 33.1 30.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.4l6.4-6.4C33.5 5.1 28.1 3 24 3c-7.2 0-13.4 3.1-17.7 8.1z"/><path fill="#34A853" d="M6.3 14.7l7 5.1C15.1 17.1 19.2 14 24 14c2.7 0 5.2.9 7.2 2.4l6.4-6.4C33.5 5.1 28.1 3 24 3c-7.2 0-13.4 3.1-17.7 8.1z"/><path fill="#FBBC05" d="M24 44c5.8 0 10.7-1.9 14.3-5.1l-6.6-5.4C29.7 35.1 27 36 24 36c-6.2 0-10.9-2.9-13.7-7.1l-7 5.4C7.1 40.9 14.1 44 24 44z"/><path fill="#EA4335" d="M44.5 20H24v8.5h11.7c-1.1 3.1-4.2 5.5-7.7 5.5-4.6 0-8.4-3.8-8.4-8.5s3.8-8.5 8.4-8.5c2.1 0 4 .7 5.5 2.1l6.4-6.4C33.5 5.1 28.1 3 24 3c-7.2 0-13.4 3.1-17.7 8.1z"/></g></svg>
                  Login with Google
                </button>
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 border-2 border-purple-500 text-purple-700 font-bold rounded-full bg-white hover:bg-purple-50 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="black" d="M16.365 1.43c0 1.14-.93 2.07-2.07 2.07s-2.07-.93-2.07-2.07.93-2.07 2.07-2.07 2.07.93 2.07 2.07zm-2.07 3.6c-1.99 0-3.6 1.61-3.6 3.6 0 1.99 1.61 3.6 3.6 3.6s3.6-1.61 3.6-3.6c0-1.99-1.61-3.6-3.6-3.6zm0 6.6c-1.66 0-3 1.34-3 3v7.2c0 1.66 1.34 3 3 3s3-1.34 3-3v-7.2c0-1.66-1.34-3-3-3z"/></svg>
                  Login with Apple
                </button>
              </div>
            </form>
            {tab === 'login' ? (
              <p className="mt-6 text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <button className="text-purple-700 font-semibold hover:underline" onClick={() => setTab('signup')}>
                  Sign Up
                </button>
              </p>
            ) : (
              <p className="mt-6 text-sm text-gray-600">
                Already have an account?{' '}
                <button className="text-purple-700 font-semibold hover:underline" onClick={() => setTab('login')}>
                  Log In
                </button>
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 