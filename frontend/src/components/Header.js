import React, { useState, useEffect } from 'react';
import './Header.css';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Header = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Select Location');

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  useEffect(() => {
    // Any additional logic for the header (e.g., fetching data) can go here
  }, []);

  return (
    <header className="header">
      <div className="container">
        <div className="website-name">
          <Link to="/" className="home-link" aria-label="Go to Home">
            Sayonara   We are underdevelopment
          </Link>
        </div>
        <nav className="nav-menu">
          <div className="post-btn">
            <Link to="/post" className="btn-post">
              Post
            </Link>
          </div>

          <div className="location-selector">
            <FaMapMarkerAlt className="location-icon"/>
            <select onChange={handleLocationChange} value={selectedLocation}>
              <option value="Select Location">Select Location</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Bangalore">Bangalore</option>
            </select>
          </div>

          <div className="language-selector">
            <select onChange={handleLanguageChange} value={selectedLanguage}>
              <option value="">Select a Language</option>
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="te">తెలుగు</option>
            </select>
          </div>

          <div className="user-auth">
            <Link to="/login" className="btn-login">
              Login
            </Link>
          </div>
          <div className="user-profileh">
            <Link to="/dashboard" className="btn-Dashboard">
              Dashboard
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;