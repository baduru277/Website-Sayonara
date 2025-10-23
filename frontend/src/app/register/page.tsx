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
    agreeToTerms: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});
    setSuccessMessage('');

    // Basic validation
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.email.includes('@')) newErrors.email = 'Please enter a valid email';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const userData = {
        name: `${formData.firstName} ${formData.lastName}`,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      };

      console.log('Registering user:', userData);
      const response = await apiService.register(userData);

      console.log('Registration response:', response);

      if (response.token) {
        // Store the token
        apiService.setAuthToken(response.token);

        setSuccessMessage('Registration successful! Redirecting to dashboard...');

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setErrors({ general: 'Registration failed. Please try again.' });
      }
    } catch (error: unknown) {
      console.error('Registration error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Registration failed. Please check your connection and try again.';
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8f9fa',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Quicksand, Montserrat, sans-serif',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 370,
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(146,77,172,0.08)',
        padding: '32px 28px',
        margin: '0 auto',
      }}>
        <h2 style={{ fontWeight: 700, fontSize: 24, color: '#222', marginBottom: 28, textAlign: 'center' }}>
          Create Account
        </h2>

        {errors.general && (
          <div style={{ color: 'red', textAlign: 'center', marginBottom: 10, fontSize: 14 }}>
            {errors.general}
          </div>
        )}

        {successMessage && (
          <div style={{ color: 'green', textAlign: 'center', marginBottom: 10, fontSize: 14 }}>
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontWeight: 600, color: '#444', fontSize: 15 }}>First Name</label>
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: errors.firstName ? '2px solid #ff4444' : '2px solid #f3eaff',
                borderRadius: 8,
                fontSize: 16,
                marginTop: 6,
                outline: 'none',
                color: '#924DAC',
                fontWeight: 500,
                background: '#faf8fd',
              }}
            />
            {errors.firstName && (
              <div style={{ color: 'red', fontSize: 12, marginTop: 4 }}>{errors.firstName}</div>
            )}
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ fontWeight: 600, color: '#444', fontSize: 15 }}>Last Name</label>
            <input
              type="text"
              name="lastName"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: errors.lastName ? '2px solid #ff4444' : '2px solid #f3eaff',
                borderRadius: 8,
                fontSize: 16,
                marginTop: 6,
                outline: 'none',
                color: '#924DAC',
                fontWeight: 500,
                background: '#faf8fd',
              }}
            />
            {errors.lastName && (
              <div style={{ color: 'red', fontSize: 12, marginTop: 4 }}>{errors.lastName}</div>
            )}
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ fontWeight: 600, color: '#444', fontSize: 15 }}>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: errors.email ? '2px solid #ff4444' : '2px solid #f3eaff',
                borderRadius: 8,
                fontSize: 16,
                marginTop: 6,
                outline: 'none',
                color: '#924DAC',
                fontWeight: 500,
                background: '#faf8fd',
              }}
            />
            {errors.email && (
              <div style={{ color: 'red', fontSize: 12, marginTop: 4 }}>{errors.email}</div>
            )}
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ fontWeight: 600, color: '#444', fontSize: 15 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  paddingRight: '45px',
                  border: errors.password ? '2px solid #ff4444' : '2px solid #f3eaff',
                  borderRadius: 8,
                  fontSize: 16,
                  marginTop: 6,
                  outline: 'none',
                  color: '#924DAC',
                  fontWeight: 500,
                  background: '#faf8fd',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#924DAC',
                  fontSize: '18px',
                  padding: '4px',
                }}
              >
                {showPassword ? (
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                    <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                    <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <div style={{ color: 'red', fontSize: 12, marginTop: 4 }}>{errors.password}</div>
            )}
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ fontWeight: 600, color: '#444', fontSize: 15 }}>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  paddingRight: '45px',
                  border: errors.confirmPassword ? '2px solid #ff4444' : '2px solid #f3eaff',
                  borderRadius: 8,
                  fontSize: 16,
                  marginTop: 6,
                  outline: 'none',
                  color: '#924DAC',
                  fontWeight: 500,
                  background: '#faf8fd',
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#924DAC',
                  fontSize: '18px',
                  padding: '4px',
                }}
              >
                {showConfirmPassword ? (
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                    <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                    <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                  </svg>
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <div style={{ color: 'red', fontSize: 12, marginTop: 4 }}>{errors.confirmPassword}</div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                style={{ marginRight: 8 }}
              />
            </div>
            <span style={{ fontSize: 13, color: '#666', textAlign: 'center', marginTop: 4, lineHeight: 1.5, maxWidth: 260 }}>
              Are you agree to <a href="#" style={{ color: '#924DAC', textDecoration: 'underline' }}>Sayonara Terms of Condition</a> and <a href="#" style={{ color: '#924DAC', textDecoration: 'underline' }}>Privacy Policy</a>.
            </span>
            {errors.agreeToTerms && (
              <div style={{ color: 'red', fontSize: 12, marginTop: 4 }}>{errors.agreeToTerms}</div>
            )}
          </div>

          <button
            type="submit"
            className="sayonara-btn"
            style={{
              width: '100%',
              marginTop: 8,
              fontSize: 18,
              opacity: isLoading ? 0.6 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
            disabled={isLoading}
          >
            {isLoading ? 'SIGNING UP...' : 'SIGN UP'}
          </button>
        </form>

        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 14, color: '#666' }}>
          Already have an account? <Link href="/login" style={{ color: '#924DAC', textDecoration: 'underline' }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
}