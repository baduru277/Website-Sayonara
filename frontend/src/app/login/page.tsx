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
      <main className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="w-full max-w-sm mx-auto">
          <div className="bg-white rounded-2xl shadow-xl px-8 py-8 flex flex-col items-center">
            {/* Tabs */}
            <div className="flex w-full mb-6 border-b border-gray-200">
              <button
                className={`flex-1 py-2 text-center font-semibold text-lg transition-colors ${tab === 'login' ? 'text-purple-700 border-b-2 border-purple-700' : 'text-gray-400'}`}
                onClick={() => setTab('login')}
              >
                Log In
              </button>
              <button
                className={`flex-1 py-2 text-center font-semibold text-lg transition-colors ${tab === 'signup' ? 'text-purple-700 border-b-2 border-purple-700' : 'text-gray-400'}`}
                onClick={() => setTab('signup')}
              >
                Sign Up
              </button>
            </div>

            <form className="w-full" onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your email"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your password"
                />
              </div>
              {tab === 'signup' && (
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Confirm your password"
                  />
                </div>
              )}
              <div className="flex items-center justify-between mb-4">
                {tab === 'login' ? (
                  <Link href="/forgot-password" className="text-sm text-purple-600 hover:underline">
                    Forgot Password?
                  </Link>
                ) : <span />}
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-lg font-bold text-white text-lg bg-purple-700 hover:bg-purple-800 transition-colors shadow-md mb-4"
              >
                {tab === 'login' ? 'SIGN IN' : 'SIGN UP'}
              </button>
              <div className="flex items-center my-4">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="mx-3 text-gray-400 text-sm">or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16.365 1.43c0 1.14-.93 2.07-2.07 2.07s-2.07-.93-2.07-2.07.93-2.07 2.07-2.07 2.07.93 2.07 2.07zm-2.07 3.6c-1.99 0-3.6 1.61-3.6 3.6 0 1.99 1.61 3.6 3.6 3.6s3.6-1.61 3.6-3.6c0-1.99-1.61-3.6-3.6-3.6zm0 6.6c-1.66 0-3 1.34-3 3v7.2c0 1.66 1.34 3 3 3s3-1.34 3-3v-7.2c0-1.66-1.34-3-3-3z" />
                  </svg>
                  Continue with Apple
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