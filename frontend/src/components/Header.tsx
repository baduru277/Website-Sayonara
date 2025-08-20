'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import './Header.css';
import SayonaraLogo from './SayonaraLogo';
import AuthModal from './AuthModal';
import apiService from '../services/api';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [location, setLocation] = useState('Oguru');
  const [showAuth, setShowAuth] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [pendingPostAction, setPendingPostAction] = useState(false);

  useEffect(() => {
    // Check if user is logged in by looking for JWT token
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      // Fetch user data
      apiService.getCurrentUser()
        .then(userData => {
          setUser(userData);
        })
        .catch(error => {
          console.error('Failed to get user data:', error);
          // If token is invalid, clear it
          localStorage.removeItem('token');
          setIsLoggedIn(false);
        });
    }

    // Fetch city from ip-api.com
    fetch('https://ip-api.com/json')
      .then(res => res.json())
      .then(data => {
        if (data && data.city) {
          setLocation(data.city);
        }
      })
      .catch(() => setLocation('Oguru'));

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest('.user-dropdown-container')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    
    // Listen for auth state changes
    const handleAuthStateChange = (event: CustomEvent) => {
      if (event.detail.isLoggedIn) {
        setIsLoggedIn(true);
        setUser(event.detail.userData);
        // If user was trying to post, redirect them now
        if (pendingPostAction) {
          setPendingPostAction(false);
          setTimeout(() => {
            window.location.href = '/add-item';
          }, 500);
        }
      }
    };
    
    window.addEventListener('authStateChanged', handleAuthStateChange as EventListener);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('authStateChanged', handleAuthStateChange as EventListener);
    };
  }, [pendingPostAction]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    setUser(null);
    setShowDropdown(false);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const handlePostClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoggedIn) {
      // If logged in, navigate to add-item page
      window.location.href = '/add-item';
    } else {
      // If not logged in, show auth modal and set pending action
      setPendingPostAction(true);
      setShowAuth(true);
    }
  };

  return (
    <>
      <header className="bg-white border-bottom sticky top-0 z-50 shadow" style={{ borderBottom: '2px solid #eee', minHeight: 80 }}>
        <div className="header-container" style={{ maxWidth: 1400, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 80 }}>
          <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Link href="/" className="flex items-center h-full" style={{ textDecoration: 'none' }}>
              <SayonaraLogo size={56} />
            </Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button onClick={handlePostClick} className="sayonara-btn" style={{ marginRight: 8, textDecoration: 'none' }}>Post</button>
              {!isLoggedIn ? (
                <button className="sayonara-btn" onClick={() => setShowAuth(true)}>Login</button>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {user && (
                    <div className="user-dropdown-container" style={{ position: 'relative' }}>
                      <div 
                        onClick={toggleDropdown}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          backgroundColor: '#924DAC',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 16,
                          fontWeight: 600,
                          cursor: 'pointer',
                          border: '2px solid #eee',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => (e.target as HTMLElement).style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => (e.target as HTMLElement).style.transform = 'scale(1)'}
                      >
                        {getInitials(user.firstName, user.lastName)}
                      </div>
                      
                      {/* Dropdown Menu */}
                      {showDropdown && (
                        <div style={{
                          position: 'absolute',
                          top: '100%',
                          right: 0,
                          marginTop: 8,
                          backgroundColor: 'white',
                          borderRadius: 8,
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                          border: '1px solid #e5e7eb',
                          minWidth: 200,
                          zIndex: 1000,
                          overflow: 'hidden'
                        }}>
                          {/* User Info */}
                          <div style={{
                            padding: '16px',
                            borderBottom: '1px solid #f3f4f6',
                            backgroundColor: '#f9fafb'
                          }}>
                            <div style={{ fontWeight: 600, color: '#374151', fontSize: 14 }}>
                              {user.firstName} {user.lastName}
                            </div>
                            <div style={{ color: '#6b7280', fontSize: 12, marginTop: 2 }}>
                              {user.email}
                            </div>
                          </div>
                          
                          {/* Menu Items */}
                          <div style={{ padding: '8px 0' }}>
                            <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                              <div style={{
                                padding: '12px 16px',
                                color: '#374151',
                                fontSize: 14,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                transition: 'background-color 0.2s ease'
                              }}
                              onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                              onClick={() => setShowDropdown(false)}
                              >
                                <span style={{ fontSize: 16 }}>📊</span>
                                Dashboard
                              </div>
                            </Link>
                            
                            
                            
                            <Link href="/messages" style={{ textDecoration: 'none' }}>
                              <div style={{
                                padding: '12px 16px',
                                color: '#374151',
                                fontSize: 14,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                transition: 'background-color 0.2s ease'
                              }}
                              onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                              onClick={() => setShowDropdown(false)}
                              >
                                <span style={{ fontSize: 16 }}>💬</span>
                                Messages
                              </div>
                            </Link>
                            
                            <div style={{ height: 1, backgroundColor: '#e5e7eb', margin: '8px 0' }}></div>
                            
                            <div 
                              onClick={handleLogout}
                              style={{
                                padding: '12px 16px',
                                color: '#dc2626',
                                fontSize: 14,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                transition: 'background-color 0.2s ease'
                              }}
                              onMouseEnter={(e) => e.target.style.backgroundColor = '#fef2f2'}
                              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                              >
                              <span style={{ fontSize: 16 }}>🚪</span>
                              Logout
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div style={{ marginLeft: 24 }}>
              <select
                style={{ fontSize: 16, padding: '4px 12px', borderRadius: 4, border: '1px solid #ccc' }}
                value={location}
                onChange={e => setLocation(e.target.value)}
              >
                <option value={location}>{location}</option>
                <option value="Oguru">Oguru</option>
                <option value="Lagos">Lagos</option>
                <option value="Abuja">Abuja</option>
              </select>
            </div>
          </div>
        </div>
      </header>
      <AuthModal open={showAuth} onClose={() => {
        setShowAuth(false);
        // Clear pending action if user closes modal without logging in
        setPendingPostAction(false);
      }} />
    </>
  );
}