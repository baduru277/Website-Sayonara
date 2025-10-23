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
  const [location, setLocation] = useState(''); // <-- initially empty
  const [showAuth, setShowAuth] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [pendingPostAction, setPendingPostAction] = useState(false);

  const indianStates = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
    "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
    "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
    "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
    "Uttar Pradesh","Uttarakhand","West Bengal","Andaman and Nicobar Islands",
    "Chandigarh","Dadra and Nagar Haveli and Daman and Diu","Delhi",
    "Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry"
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      apiService.getCurrentUser()
        .then(userData => setUser(userData))
        .catch(() => {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
        });
    }

    // Only fetch geolocation if user has not logged in / no selected state
    if (!token && !location) {
      fetch('https://ip-api.com/json')
        .then(res => res.json())
        .then(data => setLocation(data?.city || 'Oguru'))
        .catch(() => setLocation('Oguru'));
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest('.user-dropdown-container')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);

    const handleAuthStateChange = (event: CustomEvent) => {
      if (event.detail.isLoggedIn) {
        setIsLoggedIn(true);
        setUser(event.detail.userData);
        if (event.detail.selectedState) setLocation(event.detail.selectedState);

        if (pendingPostAction) {
          setPendingPostAction(false);
          window.location.href = '/add-item';
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
      window.location.href = '/add-item';
    } else {
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
                                onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = '#f3f4f6'}
                                onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
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
                                onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = '#f3f4f6'}
                                onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
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
                              onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = '#f3f4f6'}
                              onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
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

            {/* Location Select */}
            <div style={{ marginLeft: 24 }}>
              <select
                style={{ fontSize: 16, padding: '4px 12px', borderRadius: 4, border: '1px solid #ccc' }}
                value={location}
                onChange={e => setLocation(e.target.value)}
              >
                {indianStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        open={showAuth}
        onClose={() => {
          setShowAuth(false);
          setPendingPostAction(false);
        }}
        onSuccess={(message: string, selectedState?: string) => {
          console.log(message);
          setShowAuth(false);
          setIsLoggedIn(true);
          if (selectedState) setLocation(selectedState);

          if (pendingPostAction) {
            setPendingPostAction(false);
            window.location.href = '/add-item';
          }
        }}
      />
    </>
  );
}
