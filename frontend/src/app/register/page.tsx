'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import apiService from '@/services/api';
import toast, { Toaster } from 'react-hot-toast';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.email.includes('@')) newErrors.email = 'Please enter a valid email';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
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
        password: formData.password,
      };

      const response = await apiService.register(userData);

      if (response.token) {
        // Registration success
        toast.success('Registration successful! Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setErrors({ general: 'Registration failed. Please try again.' });
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Registration failed. Please check your connection and try again.';
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f8f9fa',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Quicksand, Montserrat, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 370,
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(146,77,172,0.08)',
          padding: '32px 28px',
          margin: '0 auto',
        }}
      >
        <h2
          style={{
            fontWeight: 700,
            fontSize: 24,
            color: '#222',
            marginBottom: 28,
            textAlign: 'center',
          }}
        >
          Create Account
        </h2>

        {errors.general && (
          <div style={{ color: 'red', textAlign: 'center', marginBottom: 10, fontSize: 14 }}>
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* All your current form fields remain unchanged */}
          {/* firstName, lastName, email, password, confirmPassword, agreeToTerms */}
          {/* ...same as your existing code... */}
        </form>

        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 14, color: '#666' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#924DAC', textDecoration: 'underline' }}>
            Sign In
          </Link>
        </div>
      </div>
      <Toaster position="bottom-center" />
    </div>
  );
}
