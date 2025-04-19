import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import axios from 'axios';

const Header = () => {
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
    <header className="header">
      <div className="container">
        <Link to="/" className="website-name">
          Sayonara
        </Link>

        <div className="nav-menu">
          <button className="btn-post">Post</button>

          <div className="location-selector">
            <span className="location-icon">📍</span>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">Choose Location</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Bangalore">Bangalore</option>
              {userCity && <option value={userCity}>{userCity}</option>}
            </select>
          </div>

          <div className="user-auth">
            {!isLoggedIn ? (
              <Link className="btn-login" to="/login" onClick={handleLogin}>
                Login
              </Link>
            ) : (
              <>
                <Link className="btn-login" to="/dashboard">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="btn-logout">
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;