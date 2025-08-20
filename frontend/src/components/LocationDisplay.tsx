'use client';

import React, { useState, useEffect } from 'react';

interface LocationDisplayProps {
  onLocationUpdate?: (location: string) => void;
  showUpdateButton?: boolean;
}

export default function LocationDisplay({ 
  onLocationUpdate, 
  showUpdateButton = true 
}: LocationDisplayProps) {
  const [location, setLocation] = useState<string>('Loading location...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to get location from localStorage first
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      setLocation(savedLocation);
      setLoading(false);
      return;
    }

    // Fallback to IP-based location
    fetch('https://ip-api.com/json')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        if (data && data.city) {
          const locationText = `${data.city}, ${data.country}`;
          setLocation(locationText);
          localStorage.setItem('userLocation', locationText);
          if (onLocationUpdate) {
            onLocationUpdate(locationText);
          }
        } else {
          setLocation('Location not available');
        }
      })
      .catch((error) => {
        console.warn('Location service error:', error);
        setLocation('Location not available');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [onLocationUpdate]);

  const updateLocation = () => {
    setLoading(true);
    setLocation('Updating location...');
    
    // Clear saved location to force refresh
    localStorage.removeItem('userLocation');
    
    fetch('https://ip-api.com/json')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        if (data && data.city) {
          const locationText = `${data.city}, ${data.country}`;
          setLocation(locationText);
          localStorage.setItem('userLocation', locationText);
          if (onLocationUpdate) {
            onLocationUpdate(locationText);
          }
        } else {
          setLocation('Location not available');
        }
      })
      .catch((error) => {
        console.warn('Location service error:', error);
        setLocation('Location not available');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px',
      fontSize: '14px',
      color: '#666'
    }}>
      <span style={{ fontSize: '16px' }}>📍</span>
      <span style={{ 
        color: loading ? '#999' : '#666',
        fontStyle: loading ? 'italic' : 'normal'
      }}>
        {location}
      </span>
      {showUpdateButton && !loading && (
        <button
          onClick={updateLocation}
          style={{
            background: 'none',
            border: 'none',
            color: '#924DAC',
            cursor: 'pointer',
            fontSize: '12px',
            textDecoration: 'underline',
            padding: '0',
            marginLeft: '4px'
          }}
          title="Update location"
        >
          🔄
        </button>
      )}
    </div>
  );
} 