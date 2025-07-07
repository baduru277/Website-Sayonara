'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Header() {
  const [userCity, setUserCity] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Simulate login state with localStorage (for demo)
  useEffect(() => {
    const authStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(authStatus);
  }, []);

  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  // Get user location
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const location = res.data.address;
            const city = location.city || location.town || location.village || '';
            setUserCity(city);
            setSelectedLocation(city);
          } catch (err) {
            console.error('Error fetching location:', err);
          }
        },
        (err) => {
          console.error('Geolocation error:', err);
        }
      );
    }
  }, []);

  return (
    <header className="bg-white border-b border-purple-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo as website name, perfectly aligned */}
          <Link href="/" className="flex items-center h-full">
            <span className="text-5xl font-extrabold text-purple-700 drop-shadow-lg rounded-full px-4 py-1 hover:text-purple-800 transition-colors duration-300">Sayonara</span>
          </Link>

          {/* Right-side buttons */}
          <div className="flex items-center gap-6">
            <Link
              href="/add-item"
              className="px-7 py-2 border-2 border-purple-500 text-purple-700 font-bold rounded-full bg-white hover:bg-purple-100 hover:text-purple-900 transition-all duration-200 text-xl shadow-none focus:outline-none"
            >
              Post
            </Link>
            
            {/* Location selector with icon */}
            <div className="flex items-center gap-2">
              <span className="text-purple-600 text-xl">📍</span>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-7 py-2 border-2 border-purple-500 text-purple-700 font-bold rounded-full bg-white hover:bg-purple-100 hover:text-purple-900 transition-all duration-200 text-xl shadow-none focus:outline-none appearance-none"
              >
                <option value="">Choose Location</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Chennai">Chennai</option>
                <option value="Kolkata">Kolkata</option>
                {userCity && <option value={userCity}>{userCity}</option>}
              </select>
            </div>

            {/* Authentication buttons */}
            <div className="flex items-center gap-3">
              {!isLoggedIn ? (
                <Link
                  href="/login"
                  onClick={handleLogin}
                  className="px-7 py-2 border-2 border-purple-500 text-purple-700 font-bold rounded-full bg-white hover:bg-purple-100 hover:text-purple-900 transition-all duration-200 text-xl shadow-none focus:outline-none"
                >
                  Login
                </Link>
              ) : (
                <>
                  <Link
                    href="/dashboard"
                    className="px-7 py-2 border-2 border-purple-500 text-purple-700 font-bold rounded-full bg-white hover:bg-purple-100 hover:text-purple-900 transition-all duration-200 text-xl shadow-none focus:outline-none"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-7 py-2 border-2 border-red-500 text-red-700 font-bold rounded-full bg-white hover:bg-red-100 hover:text-red-900 transition-all duration-200 text-xl shadow-none focus:outline-none"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}