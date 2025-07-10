'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle forgot password logic here
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="w-full max-w-sm mx-auto">
          <div className="bg-white rounded-2xl shadow-xl px-8 py-8 flex flex-col items-center">
            <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">Forgot Password</h2>
            {submitted ? (
              <div className="text-center text-green-600 font-medium">
                If an account with that email exists, a password reset link has been sent.
              </div>
            ) : (
              <form className="w-full" onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your email"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-lg font-bold text-white text-lg bg-purple-700 hover:bg-purple-800 transition-colors shadow-md mb-4"
                >
                  Send Reset Link
                </button>
              </form>
            )}
            <p className="mt-6 text-sm text-gray-600">
              Remembered your password?{' '}
              <Link href="/login" className="text-purple-700 font-semibold hover:underline">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 