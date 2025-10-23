"use client";

import React, { useState } from "react";
// Assuming apiService is correctly implemented for login and register
import apiService from '@/services/api'; 
import { Eye, EyeOff, User, Mail, Lock, Check, MapPin, X, Loader2 } from 'lucide-react'; // Using lucide-react for icons

type AuthModalProps = {
  open: boolean;
  onClose: () => void;
};

// Custom Input Component for better styling and icon support
const InputField = ({ icon: Icon, type, placeholder, value, onChange, required, className = '', children }) => (
  <div className={`relative w-full ${className}`}>
    {Icon && (
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <Icon size={18} />
      </span>
    )}
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className={`w-full border border-gray-300 bg-gray-50 text-gray-800 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out ${Icon ? 'pl-10' : 'pl-3'}`}
    />
    {children}
  </div>
);

// Custom Button Component for consistency
const Button = ({ children, onClick, type = 'button', loading = false, disabled = false, className = '' }) => (
  <button
    type={type}
    onClick={onClick}
    className={`w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-200 ease-in-out shadow-lg transform active:scale-95 ${disabled || loading ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}
    disabled={disabled || loading}
  >
    {loading ? <Loader2 className="animate-spin h-5 w-5 mx-auto" /> : children}
  </button>
);


export default function AuthModal({ open, onClose }: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [state, setState] = useState("");
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Validation States for Signup
  const isPasswordMatch = password === confirmPassword;
  const isPasswordValid = password.length >= 8;
  const isSignupFormValid = isPasswordMatch && isPasswordValid && name && email && state && terms;

  const indianStates = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
    "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
    "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
    "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
    "Uttar Pradesh","Uttarakhand","West Bengal","Andaman and Nicobar Islands",
    "Chandigarh","Dadra and Nagar Haveli and Daman and Diu","Delhi",
    "Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry"
  ];

  if (!open) return null;

  /**
   * Clears form states when changing tabs.
   */
  const changeTab = (newTab: 'login' | 'signup') => {
    setTab(newTab);
    setErrorMsg(null);
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setState('');
    setTerms(false);
    setLoading(false);
  }

  // Login handler
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setErrorMsg(null);
    try {
      // Simulate API call delay for better UX
      // await new Promise(resolve => setTimeout(resolve, 1000)); 

      const res = await apiService.login({ email, password });
      
      if (res.token) {
        localStorage.setItem('isLoggedIn', 'true');
        onClose();
        // A clean way to force re-render/re-fetch data for auth status
        window.location.reload(); 
      } else {
        setErrorMsg(res.error || res.message || 'Invalid credentials. Please try again.');
      }
    } catch (err: unknown) {
      let errorMessage = 'An unexpected error occurred during login.';
      if (err instanceof Error) errorMessage = err.message;
      setErrorMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  // Signup handler
  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (loading || !isSignupFormValid) return; // Prevent submission if invalid

    setLoading(true);
    setErrorMsg(null);
    try {
      // Simulate API call delay for better UX
      // await new Promise(resolve => setTimeout(resolve, 1000)); 

      const res = await apiService.register({ name, email, password, state });
      
      if (res.token || res.user) {
        // Automatically log in user after successful signup
        localStorage.setItem('isLoggedIn', 'true');
        alert("Registration successful! You are now logged in.");
        onClose();
        window.location.reload();
      } else {
        setErrorMsg(res.error || res.message || 'Signup failed. Please check your details.');
      }
    } catch (err: unknown) {
      let errorMessage = 'An unexpected error occurred during signup.';
      if (err instanceof Error) errorMessage = err.message;
      setErrorMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  // Reusable password field for both tabs
  const PasswordField = ({ value, onChange, placeholder, autoFocus = false }) => (
    <InputField
      icon={Lock}
      type={showPassword ? "text" : "password"}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
      className="relative"
      autoFocus={autoFocus}
    >
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </InputField>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 transition-opacity duration-300 ease-out" 
         aria-modal="true" 
         role="dialog"
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 p-8 relative transform transition-all duration-300 ease-out scale-100 opacity-100" // Modal content with animation
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition duration-150 p-1 rounded-full bg-gray-100 hover:bg-red-50"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
          {tab === 'login' ? 'Welcome Back!' : 'Create Account'}
        </h2>

        {/* Tab Selector */}
        <div className="flex justify-center border-b border-gray-200 mb-8">
          <button
            className={`flex-1 py-3 px-2 text-center font-semibold text-lg transition duration-200 ease-in-out ${tab === 'login' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => changeTab('login')}
          >
            Login
          </button>
          <button
            className={`flex-1 py-3 px-2 text-center font-semibold text-lg transition duration-200 ease-in-out ${tab === 'signup' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => changeTab('signup')}
          >
            Sign Up
          </button>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4 text-sm text-center">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <InputField
              icon={Mail}
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            
            <PasswordField
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            
            <Button type="submit" loading={loading} className="mt-8">
              {loading ? "Logging in..." : "Login"}
            </Button>
            
            <p className="text-center text-sm text-gray-500 hover:text-blue-600 cursor-pointer transition">
              Forgot Password?
            </p>
          </form>
        ) : (
          /* Signup Form */
          <form onSubmit={handleSignup} className="space-y-6">
            <InputField
              icon={User}
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <InputField
              icon={Mail}
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            
            {/* Password Field */}
            <div className="space-y-1">
              <PasswordField
                placeholder="Password (min 8 chars)"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              {!isPasswordValid && password.length > 0 && (
                <p className="text-xs text-red-500">Password must be at least 8 characters long.</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1">
              <InputField
                icon={Lock}
                type="password" // Always hide for Confirm Password
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
              {!isPasswordMatch && confirmPassword.length > 0 && (
                <p className="text-xs text-red-500">Passwords do not match.</p>
              )}
            </div>
            
            {/* State Dropdown */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <MapPin size={18} />
              </span>
              <select
                value={state}
                onChange={e => setState(e.target.value)}
                required
                className="w-full border border-gray-300 bg-gray-50 text-gray-800 p-3 rounded-lg pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              >
                <option value="" disabled className="text-gray-400">Select State</option>
                {indianStates.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-start">
              <input 
                id="terms-checkbox"
                type="checkbox" 
                checked={terms} 
                onChange={e => setTerms(e.target.checked)} 
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="terms-checkbox" className="ml-2 text-sm text-gray-600 cursor-pointer">
                I agree to the <span className="text-blue-600 font-medium hover:underline">Terms of Service</span> and <span className="text-blue-600 font-medium hover:underline">Privacy Policy</span>.
              </label>
            </div>
            
            <Button type="submit" loading={loading} disabled={!isSignupFormValid} className="mt-8">
              {loading ? "Signing up..." : "Create Account"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
