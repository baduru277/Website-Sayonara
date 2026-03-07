'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import './Header.css';
import SayonaraLogo from './SayonaraLogo';
import AuthModal from './AuthModal';
import NotificationBell from './NotificationBell';
import apiService from '../services/api';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [location, setLocation] = useState('Detecting...'); // exact city/area
  const [stateLocation, setStateLocation] = useState('Andhra Pradesh'); // state for dropdown
  const [showAuth, setShowAuth] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [authDefaultTab, setAuthDefaultTab] = useState<'login' | 'signup'>('login');
  const [locating, setLocating] = useState(false);
  const [postLimitReached, setPostLimitReached] = useState(false);
  const [totalPosted, setTotalPosted] = useState(0);
  const FREE_LIMIT = 3;

  const checkPostLimit = async (token: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items/my/post-count`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTotalPosted(data.totalEverPosted || 0);
        setPostLimitReached(!data.isSubscribed && data.totalEverPosted >= FREE_LIMIT);
      }
    } catch {}
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      apiService.getCurrentUser()
        .then(response => {
          const userData = response?.user || response;
          setUser(userData);
          checkPostLimit(token);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
        });
    }

    // ── Auto-open auth modal if URL has ?auth=signup or ?auth=login ──
    const params = new URLSearchParams(window.location.search);
    const authParam = params.get('auth');
    if (authParam === 'signup') { setAuthDefaultTab('signup'); setShowAuth(true); }
    else if (authParam === 'login') { setAuthDefaultTab('login'); setShowAuth(true); }

    // ── Get location ──
    const savedCity = localStorage.getItem('userCity');
    const savedState = localStorage.getItem('userState');
    if (savedCity) {
      setLocation(savedCity);
      if (savedState) setStateLocation(savedState);
    } else {
      detectLocation();
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
        const userData = event.detail.userData?.user || event.detail.userData;
        setUser(userData);
      }
    };
    window.addEventListener('authStateChanged', handleAuthStateChange as EventListener);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('authStateChanged', handleAuthStateChange as EventListener);
    };
  }, []);

  const detectLocation = () => {
    setLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await res.json();
            const addr = data.address;
            const city =
              addr.city || addr.town || addr.village ||
              addr.suburb || addr.district || addr.county ||
              addr.state_district || addr.state || 'Andhra Pradesh';
            setLocation(city);
            localStorage.setItem('userCity', city);
            localStorage.setItem('userLat', String(latitude));
            localStorage.setItem('userLng', String(longitude));
          } catch { fallbackToIP(); }
          finally { setLocating(false); }
        },
        () => { fallbackToIP(); setLocating(false); },
        { timeout: 8000, maximumAge: 300000 }
      );
    } else {
      fallbackToIP();
      setLocating(false);
    }
  };

  const fallbackToIP = () => {
    fetch('https://ip-api.com/json')
      .then(res => res.json())
      .then(data => {
        if (data?.city) {
          setLocation(data.city);
          localStorage.setItem('userCity', data.city);
        } else {
          setLocation('Unknown Area');
        }
        if (data?.regionName) {
          setStateLocation(data.regionName);
          localStorage.setItem('userState', data.regionName);
        }
      })
      .catch(() => { setLocation('Unknown Area'); setStateLocation('Andhra Pradesh'); });
  };

  const handleRefreshLocation = () => {
    localStorage.removeItem('userCity');
    localStorage.removeItem('userLat');
    localStorage.removeItem('userLng');
    detectLocation();
  };

  const handleLogout = () => {
    apiService.logout();
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    setUser(null);
    setShowDropdown(false);
  };

  const getInitials = () => {
    if (!user) return 'U';
    if (user.name) {
      const parts = user.name.split(' ');
      return parts.length >= 2
        ? `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase()
        : user.name.charAt(0).toUpperCase();
    }
    const firstInitial = user.firstName?.charAt(0) || '';
    const lastInitial = user.lastName?.charAt(0) || '';
    return `${firstInitial}${lastInitial}`.toUpperCase() || 'U';
  };

  const getUserDisplayName = () => {
    if (!user) return 'User';
    if (user.name) return user.name;
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
    if (user.firstName) return user.firstName;
    return 'User';
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const handlePostClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) { setAuthDefaultTab('signup'); setShowAuth(true); return; }
    if (postLimitReached) {
      window.location.href = '/payment?plan=Premium&amount=99&duration=1%20Year';
      return;
    }
    window.location.href = '/add-item';
  };

  const handleGetStarted = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoggedIn) { window.location.href = '/add-item'; }
    else { setAuthDefaultTab('signup'); setShowAuth(true); }
  };

  return (
    <>
      {/* ── Subscribe Banner ── */}
      {!isLoggedIn && (
        <div style={{
          background: 'linear-gradient(90deg, #924DAC 0%, #b06fd4 100%)',
          color: '#fff', padding: '10px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 16, flexWrap: 'wrap', fontSize: 14,
        }}>
          <span style={{ fontSize: 18 }}>🎁</span>
          <span style={{ fontWeight: 500 }}>
            Join Sayonara free — post up to <strong>3 items</strong> or unlock unlimited for just <strong>₹99/year</strong>!
          </span>
          <button onClick={handleGetStarted} style={{
            background: '#fff', color: '#924DAC', fontWeight: 700,
            borderRadius: 20, padding: '5px 18px', fontSize: 13,
            border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
            boxShadow: '0 1px 4px rgba(0,0,0,0.10)'
          }}>
            Get Started →
          </button>
        </div>
      )}

      <header className="bg-white border-bottom sticky top-0 z-50 shadow" style={{ borderBottom: '2px solid #eee', minHeight: 80 }}>
        <div className="header-container" style={{ maxWidth: 1400, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 80 }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Link href="/" className="flex items-center h-full" style={{ textDecoration: 'none' }}>
              <SayonaraLogo size={56} />
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'flex-end', gap: 16 }}>

            {/* ── Location detector ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f9f3ff', borderRadius: 20, padding: '5px 14px', border: '1px solid #e0d0f5', cursor: 'pointer' }}
              onClick={handleRefreshLocation}
              title="Click to update your location">
              <span style={{ fontSize: 16 }}>{locating ? '⏳' : '📍'}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#924DAC', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {locating ? 'Detecting...' : location}
              </span>
              <span style={{ fontSize: 11, color: '#b06fd4' }}>▼</span>
            </div>

            {/* Manual state selector (fallback) */}
            <select
              style={{ fontSize: 14, padding: '4px 8px', borderRadius: 4, border: '1px solid #ccc', maxWidth: 140 }}
              value={stateLocation}
              onChange={e => {
                setStateLocation(e.target.value);
                localStorage.setItem('userState', e.target.value);
              }}
            >
              <option value={stateLocation}>{stateLocation}</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Arunachal Pradesh">Arunachal Pradesh</option>
              <option value="Assam">Assam</option>
              <option value="Bihar">Bihar</option>
              <option value="Chhattisgarh">Chhattisgarh</option>
              <option value="Goa">Goa</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Haryana">Haryana</option>
              <option value="Himachal Pradesh">Himachal Pradesh</option>
              <option value="Jharkhand">Jharkhand</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Kerala">Kerala</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Manipur">Manipur</option>
              <option value="Meghalaya">Meghalaya</option>
              <option value="Mizoram">Mizoram</option>
              <option value="Nagaland">Nagaland</option>
              <option value="Odisha">Odisha</option>
              <option value="Punjab">Punjab</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Sikkim">Sikkim</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Telangana">Telangana</option>
              <option value="Tripura">Tripura</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Uttarakhand">Uttarakhand</option>
              <option value="West Bengal">West Bengal</option>
              <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
              <option value="Chandigarh">Chandigarh</option>
              <option value="Delhi">Delhi</option>
              <option value="Jammu and Kashmir">Jammu and Kashmir</option>
              <option value="Ladakh">Ladakh</option>
              <option value="Puducherry">Puducherry</option>
            </select>

            {/* Post + Login/User */}
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button
                onClick={handlePostClick}
                className="sayonara-btn"
                style={{
                  marginRight: 4,
                  opacity: (isLoggedIn && postLimitReached) ? 0.5 : 1,
                  cursor: (isLoggedIn && postLimitReached) ? 'not-allowed' : 'pointer',
                  position: 'relative',
                }}
                title={isLoggedIn && postLimitReached ? `You've used all ${FREE_LIMIT} free listings. Upgrade to post more.` : ''}
              >
                {isLoggedIn && postLimitReached ? '🔒 Post' : 'Post'}
              </button>
              {/* Limit badge */}
              {isLoggedIn && postLimitReached && (
                <span style={{
                  position: 'absolute', top: -8, right: -4,
                  background: '#e53e3e', color: '#fff',
                  fontSize: 9, fontWeight: 700, borderRadius: 99,
                  padding: '1px 5px', whiteSpace: 'nowrap',
                  pointerEvents: 'none'
                }}>FULL</span>
              )}
            </div>

            {!isLoggedIn ? (
              <button className="sayonara-btn" onClick={() => { setAuthDefaultTab('login'); setShowAuth(true); }}>Login</button>
            ) : (
              user && (
                <>
                  <NotificationBell />
                  <div className="user-dropdown-container" style={{ position: 'relative' }}>
                    <div onClick={toggleDropdown}
                      style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#924DAC', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 600, cursor: 'pointer', border: '2px solid #eee', transition: 'all 0.2s ease' }}
                      onMouseEnter={(e) => (e.target as HTMLElement).style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => (e.target as HTMLElement).style.transform = 'scale(1)'}>
                      {getInitials()}
                    </div>

                    {showDropdown && (
                      <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 8, backgroundColor: 'white', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', border: '1px solid #e5e7eb', minWidth: 200, zIndex: 1000, overflow: 'hidden' }}>
                        <div style={{ padding: 16, borderBottom: '1px solid #f3f4f6', backgroundColor: '#f9fafb' }}>
                          <div style={{ fontWeight: 600, color: '#374151', fontSize: 14 }}>{getUserDisplayName()}</div>
                          <div style={{ color: '#6b7280', fontSize: 12, marginTop: 2 }}>{user.email || 'No email'}</div>
                          <div style={{ color: '#924DAC', fontSize: 12, marginTop: 2 }}>📍 {location}</div>
                        </div>
                        <div style={{ padding: '8px 0' }}>
                          <Link href="/profile" style={{ textDecoration: 'none' }}>
                            <div style={{ padding: '12px 16px', color: '#374151', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}
                              onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = '#f3f4f6'}
                              onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
                              onClick={() => setShowDropdown(false)}>
                              <span>📊</span> Dashboard
                            </div>
                          </Link>
                          <Link href="/messages" style={{ textDecoration: 'none' }}>
                            <div style={{ padding: '12px 16px', color: '#374151', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}
                              onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = '#f3f4f6'}
                              onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
                              onClick={() => setShowDropdown(false)}>
                              <span>💬</span> Messages
                            </div>
                          </Link>
                          <div style={{ height: 1, backgroundColor: '#e5e7eb', margin: '8px 0' }} />
                          <div onClick={handleLogout} style={{ padding: '12px 16px', color: '#dc2626', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}
                            onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = '#f3f4f6'}
                            onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}>
                            <span>🚪</span> Logout
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )
            )}
          </div>
        </div>
      </header>

      <AuthModal
        open={showAuth}
        defaultTab={authDefaultTab}
        onClose={() => setShowAuth(false)}
      />
    </>
  );
}
