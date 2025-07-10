'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import './Header.css';
import SayonaraLogo from './SayonaraLogo';
import AuthModal from './AuthModal';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [location, setLocation] = useState('Oguru');
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    // Fetch city from ip-api.com
    fetch('https://ip-api.com/json')
      .then(res => res.json())
      .then(data => {
        if (data && data.city) {
          setLocation(data.city);
        }
      })
      .catch(() => setLocation('Oguru'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
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
              <button className="sayonara-btn" style={{ marginRight: 8 }} onClick={() => setShowAuth(true)}>Post</button>
              {!isLoggedIn ? (
                <button className="sayonara-btn" onClick={() => setShowAuth(true)}>Login</button>
              ) : (
                <button onClick={handleLogout} className="sayonara-btn">Logout</button>
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
      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
}