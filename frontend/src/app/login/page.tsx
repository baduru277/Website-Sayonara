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
          <span className="text-blue-600 font-semibold">Sign In</span>
        </nav>
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl px-8 py-8 flex flex-col items-center">
            {/* Tabs */}
            <div className="flex w-full mb-6 border-b border-gray-200">
              <button
                className={`flex-1 py-2 text-center font-bold text-lg transition-colors ${tab === 'login' ? 'text-black border-b-2 border-orange-500' : 'text-gray-400'}`}
                onClick={() => setTab('login')}
              >
                Log In
              </button>
              <button
                className={`flex-1 py-2 text-center font-bold text-lg transition-colors ${tab === 'signup' ? 'text-black border-b-2 border-orange-500' : 'text-gray-400'}`}
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
                  <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                    Forgot Password?
                  </Link>
                ) : <span />}
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-md font-bold text-white text-lg bg-[#8B2C32] hover:bg-[#6e2024] transition-colors shadow-md mb-4 flex items-center justify-center gap-2"
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
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  <img src="/google.svg" alt="Google" className="w-5 h-5" />
                  Login with Google
                </button>
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  <img src="/apple.svg" alt="Apple" className="w-5 h-5" />
                  Login with Apple
                </button>
              </div>
            </form>
            {tab === 'login' ? (
              <p className="mt-6 text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <button className="text-blue-600 font-semibold hover:underline" onClick={() => setTab('signup')}>
                  Sign Up
                </button>
              </p>
            ) : (
              <p className="mt-6 text-sm text-gray-600">
                Already have an account?{' '}
                <button className="text-blue-600 font-semibold hover:underline" onClick={() => setTab('login')}>
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