'use client';

import { useState } from 'react';

// --- START: Mocked Dependencies for Standalone Environment ---
// The original 'next/link' and 'next/navigation' imports are replaced 
// by mock components/hooks to make the file runnable outside of a Next.js environment.

// Mock Link component
const Link = ({ href, children, ...props }) => (
  <a 
    href={href} 
    onClick={(e) => { 
      e.preventDefault(); 
      console.log('Simulated Navigation to:', href); 
    }} 
    {...props}
  >
    {children}
  </a>
);

// Mock useRouter hook
const useRouter = () => ({ 
  push: (path) => console.log('Simulated Redirect to Onboarding:', path) 
});

// Mock apiService (replace with your actual API logic when integrated into your Next.js project)
const apiService = {
  setAuthToken: (token) => {
    // In a real app, this stores the token (e.g., in localStorage or cookies)
    console.log(`Token stored: ${token.substring(0, 20)}...`);
  },
  register: async (userData) => {
    console.log('API: Attempting registration with data:', userData.email);
    // Simulate a successful API response after a delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { 
      token: 'mock-jwt-token-1234567890', 
      message: 'User registered successfully.' 
    };
  },
};
// --- END: Mocked Dependencies ---

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    location: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Calculate password strength
    if (name === 'password') {
      calculatePasswordStrength(value);
    }

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const calculatePasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z\d]/.test(pwd)) strength++;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-300';
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    if (passwordStrength <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    const texts = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    return texts[passwordStrength] || '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    // Client-side validation
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Enter a valid email';
    }
    if (!formData.location) {
      newErrors.location = 'Please select a location';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to terms and conditions';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const userData = {
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        location: formData.location,
        password: formData.password,
      };

      // Call your API
      const response = await apiService.register(userData);

      if (response.token) {
        apiService.setAuthToken(response.token);
        
        // *** FIX APPLIED HERE: Redirect to the Onboarding/Basic Info page. ***
        setSuccessMessage('Account created! Redirecting to profile setup...');
        
        // Use '/onboarding' for the Basic Information step. Adjust this route as needed.
        setTimeout(() => router.push('/onboarding'), 2000); 
        // *******************************************************************
        
      } else if (response.message) {
        setErrors({ general: response.message });
      } else {
        setErrors({ general: 'Registration failed. Please try again.' });
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please check your connection and try again.';
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#7F53AC] to-[#647DEE] font-quicksand py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#924DAC] mb-2">SAYONARA</h1>
          <h2 className="text-xl font-semibold text-gray-700">Create Account</h2>
          <p className="text-sm text-gray-500 mt-1">Join the trading community</p>
        </div>

        {/* Messages */}
        {errors.general && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded">
            <p className="text-sm font-semibold">{errors.general}</p>
          </div>
        )}
        {successMessage && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 mb-4 rounded">
            <p className="text-sm font-semibold">{successMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name */}
          <div>
            <label className="block font-semibold text-gray-700 text-sm mb-2">First Name *</label>
            <input
              type="text"
              name="firstName"
              placeholder="John"
              value={formData.firstName}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full px-4 py-3 rounded-lg bg-[#faf8fd] border-2 transition-all ${
                errors.firstName ? 'border-red-500 focus:border-red-600' : 'border-[#f3eaff] focus:border-[#924DAC]'
              } text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#924DAC] focus:ring-opacity-20 disabled:opacity-50 disabled:cursor-not-allowed`}
            />
            {errors.firstName && <p className="text-red-500 text-xs mt-1 font-medium">{errors.firstName}</p>}
          </div>

          {/* Last Name */}
          <div>
            <label className="block font-semibold text-gray-700 text-sm mb-2">Last Name *</label>
            <input
              type="text"
              name="lastName"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full px-4 py-3 rounded-lg bg-[#faf8fd] border-2 transition-all ${
                errors.lastName ? 'border-red-500 focus:border-red-600' : 'border-[#f3eaff] focus:border-[#924DAC]'
              } text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#924DAC] focus:ring-opacity-20 disabled:opacity-50 disabled:cursor-not-allowed`}
            />
            {errors.lastName && <p className="text-red-500 text-xs mt-1 font-medium">{errors.lastName}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block font-semibold text-gray-700 text-sm mb-2">Email Address *</label>
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full px-4 py-3 rounded-lg bg-[#faf8fd] border-2 transition-all ${
                errors.email ? 'border-red-500 focus:border-red-600' : 'border-[#f3eaff] focus:border-[#924DAC]'
              } text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#924DAC] focus:ring-opacity-20 disabled:opacity-50 disabled:cursor-not-allowed`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
          </div>

          {/* Location */}
          <div>
            <label className="block font-semibold text-gray-700 text-sm mb-2">Location *</label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full px-4 py-3 rounded-lg bg-[#faf8fd] border-2 transition-all ${
                errors.location ? 'border-red-500 focus:border-red-600' : 'border-[#f3eaff] focus:border-[#924DAC]'
              } text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#924DAC] focus:ring-opacity-20 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <option value="">Select your location</option>
              <option value="Oguru">Oguru</option>
              <option value="Lagos">Lagos</option>
              <option value="Abuja">Abuja</option>
              <option value="Other">Other</option>
            </select>
            {errors.location && <p className="text-red-500 text-xs mt-1 font-medium">{errors.location}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block font-semibold text-gray-700 text-sm mb-2">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full px-4 py-3 rounded-lg bg-[#faf8fd] border-2 transition-all pr-12 ${
                  errors.password ? 'border-red-500 focus:border-red-600' : 'border-[#f3eaff] focus:border-[#924DAC]'
                } text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#924DAC] focus:ring-opacity-20 disabled:opacity-50 disabled:cursor-not-allowed`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#924DAC] text-lg hover:text-[#7F53AC] transition-colors disabled:opacity-50"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        level <= passwordStrength ? getPasswordStrengthColor() : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <p className={`text-xs font-semibold ${
                  passwordStrength <= 2 ? 'text-red-500' : 
                  passwordStrength === 3 ? 'text-yellow-500' : 
                  passwordStrength === 4 ? 'text-blue-500' : 'text-green-500'
                }`}>
                  Password Strength: {getPasswordStrengthText()}
                </p>
              </div>
            )}
            {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block font-semibold text-gray-700 text-sm mb-2">Confirm Password *</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full px-4 py-3 rounded-lg bg-[#faf8fd] border-2 transition-all pr-12 ${
                  errors.confirmPassword ? 'border-red-500 focus:border-red-600' : 'border-[#f3eaff] focus:border-[#924DAC]'
                } text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#924DAC] focus:ring-opacity-20 disabled:opacity-50 disabled:cursor-not-allowed`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#924DAC] text-lg hover:text-[#7F53AC] transition-colors disabled:opacity-50"
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 font-medium">{errors.confirmPassword}</p>}
          </div>

          {/* Terms & Conditions */}
          <div className="pt-2">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                disabled={isLoading}
                className="w-5 h-5 mt-0.5 accent-[#924DAC] cursor-pointer disabled:opacity-50"
              />
              <span className="text-sm text-gray-600 leading-relaxed">
                I agree to the{' '}
                <Link href="/terms" target="_blank" className="text-[#924DAC] font-semibold hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" target="_blank" className="text-[#924DAC] font-semibold hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.agreeToTerms && <p className="text-red-500 text-xs mt-2 font-medium">{errors.agreeToTerms}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 mt-6 rounded-lg bg-gradient-to-r from-[#924DAC] to-[#7F53AC] text-white font-bold text-lg transition-all transform ${
              isLoading
                ? 'opacity-70 cursor-not-allowed'
                : 'hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <span className="inline-block w-4 h-4 border-2 border-white border-r-transparent rounded-full animate-spin mr-2"></span>
                CREATING ACCOUNT...
              </span>
            ) : (
              'CREATE ACCOUNT'
            )}
          </button>
        </form>

        {/* Sign In Link */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-[#924DAC] font-semibold hover:underline transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
