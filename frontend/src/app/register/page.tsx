'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import apiService from '@/services/api';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    // Client-side validation
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.email.includes('@')) newErrors.email = 'Enter a valid email';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to terms';

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
        password: formData.password,
      };

      const response = await apiService.register(userData);

      if (response.token) {
        apiService.setAuthToken(response.token);
        setSuccessMessage('Registration successful! Redirecting...');
        router.push('/dashboard');
      } else {
        setErrors({ general: response.message || 'Registration failed. Try again.' });
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Check your connection and try again.';
      setErrors({ general: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fa] font-quicksand">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-center text-2xl font-bold text-[#222] mb-7">Create Account</h2>

        {errors.general && <p className="text-red-500 text-sm text-center mb-2">{errors.general}</p>}
        {successMessage && <p className="text-green-500 text-sm text-center mb-2">{successMessage}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name */}
          <div>
            <label className="font-semibold text-[#444] text-sm">First Name</label>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className={`w-full p-3 mt-1 rounded-lg text-[#924DAC] font-medium bg-[#faf8fd] border-2 ${errors.firstName ? 'border-red-500' : 'border-[#f3eaff]'} focus:outline-none`}
            />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
          </div>

          {/* Last Name */}
          <div>
            <label className="font-semibold text-[#444] text-sm">Last Name</label>
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className={`w-full p-3 mt-1 rounded-lg text-[#924DAC] font-medium bg-[#faf8fd] border-2 ${errors.lastName ? 'border-red-500' : 'border-[#f3eaff]'} focus:outline-none`}
            />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="font-semibold text-[#444] text-sm">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 mt-1 rounded-lg text-[#924DAC] font-medium bg-[#faf8fd] border-2 ${errors.email ? 'border-red-500' : 'border-[#f3eaff]'} focus:outline-none`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <label className="font-semibold text-[#444] text-sm">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full p-3 mt-1 rounded-lg text-[#924DAC] font-medium bg-[#faf8fd] border-2 ${errors.password ? 'border-red-500' : 'border-[#f3eaff]'} focus:outline-none pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#924DAC] focus:outline-none"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="font-semibold text-[#444] text-sm">Confirm Password</label>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full p-3 mt-1 rounded-lg text-[#924DAC] font-medium bg-[#faf8fd] border-2 ${errors.confirmPassword ? 'border-red-500' : 'border-[#f3eaff]'} focus:outline-none pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#924DAC] focus:outline-none"
            >
              {showConfirmPassword ? '🙈' : '👁️'}
            </button>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Terms */}
          <div className="flex flex-col items-center mt-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-xs text-gray-600 max-w-[250px]">
                I agree to the{' '}
                <Link href="/terms" className="text-[#924DAC] underline">
                  Terms
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-[#924DAC] underline">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
            {errors.agreeToTerms && <p className="text-red-500 text-xs mt-1">{errors.agreeToTerms}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 mt-3 rounded-lg bg-[#924DAC] text-white font-bold text-lg ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'SIGNING UP...' : 'SIGN UP'}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-[#924DAC] underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
