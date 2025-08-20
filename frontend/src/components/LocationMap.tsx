'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface LocationMapProps {
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
  initialLocation?: { lat: number; lng: number };
  height?: string;
  width?: string;
}

export default function LocationMap({ 
  onLocationSelect, 
  initialLocation = { lat: 28.6139, lng: 77.2090 }, // Default to Delhi
  height = "300px",
  width = "100%"
}: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [currentLocation, setCurrentLocation] = useState(initialLocation);
  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const initMap = async () => {
      try {
        setLoading(true);
        setError('');

        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE',
          version: 'weekly',
          libraries: ['places']
        });

        const google = await loader.load();
        
        if (!mapRef.current) return;

        const mapInstance = new google.maps.Map(mapRef.current, {
          center: currentLocation,
          zoom: 13,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });

        const markerInstance = new google.maps.Marker({
          position: currentLocation,
          map: mapInstance,
          draggable: true,
          title: 'Your Location'
        });

        // Add click listener to map
        mapInstance.addListener('click', (event: google.maps.MapMouseEvent) => {
          const position = event.latLng;
          if (position) {
            markerInstance.setPosition(position);
            setCurrentLocation({ lat: position.lat(), lng: position.lng() });
            getAddressFromCoordinates(position.lat(), position.lng());
          }
        });

        // Add drag listener to marker
        markerInstance.addListener('dragend', (event: google.maps.MapMouseEvent) => {
          const position = event.latLng;
          if (position) {
            setCurrentLocation({ lat: position.lat(), lng: position.lng() });
            getAddressFromCoordinates(position.lat(), position.lng());
          }
        });

        setMap(mapInstance);
        setMarker(markerInstance);

        // Get current location if available
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              };
              mapInstance.setCenter(pos);
              markerInstance.setPosition(pos);
              setCurrentLocation(pos);
              getAddressFromCoordinates(pos.lat, pos.lng);
            },
            () => {
              // Fallback to default location
              getAddressFromCoordinates(currentLocation.lat, currentLocation.lng);
            }
          );
        } else {
          getAddressFromCoordinates(currentLocation.lat, currentLocation.lng);
        }

      } catch (err) {
        console.error('Error loading Google Maps:', err);
        setError('Failed to load map. Please check your internet connection.');
      } finally {
        setLoading(false);
      }
    };

    initMap();
  }, []);

  const getAddressFromCoordinates = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE'}`
      );
      const data = await response.json();
      
      if (data.results && data.results[0]) {
        const address = data.results[0].formatted_address;
        setAddress(address);
        
        if (onLocationSelect) {
          onLocationSelect({ lat, lng, address });
        }
      }
    } catch (err) {
      console.error('Error getting address:', err);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation && map) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          map.setCenter(pos);
          if (marker) {
            marker.setPosition(pos);
          }
          setCurrentLocation(pos);
          getAddressFromCoordinates(pos.lat, pos.lng);
        },
        (error) => {
          console.error('Error getting current location:', error);
          setError('Unable to get your current location. Please select manually.');
        }
      );
    }
  };

  if (loading) {
    return (
      <div style={{ 
        height, 
        width, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#f5f5f5',
        borderRadius: '8px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>🗺️</div>
          <div>Loading map...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        height, 
        width, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#f5f5f5',
        borderRadius: '8px',
        color: '#e74c3c'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚠️</div>
          <div>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width }}>
      <div style={{ marginBottom: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                 <button
           onClick={getCurrentLocation}
           className="sayonara-btn"
           style={{
             fontSize: '14px',
             padding: '8px 16px',
             display: 'flex',
             alignItems: 'center',
             gap: '6px'
           }}
         >
           📍 Get My Location
         </button>
        {address && (
          <div style={{ 
            fontSize: '14px', 
            color: '#666',
            flex: 1,
            padding: '8px 12px',
            background: '#f8f9fa',
            borderRadius: '6px',
            border: '1px solid #e9ecef'
          }}>
            📍 {address}
          </div>
        )}
      </div>
      <div 
        ref={mapRef} 
        style={{ 
          height, 
          width: '100%',
          borderRadius: '8px',
          border: '2px solid #e9ecef'
        }} 
      />
      <div style={{ 
        marginTop: '8px', 
        fontSize: '12px', 
        color: '#888',
        textAlign: 'center'
      }}>
        Click on the map or drag the marker to select your location
      </div>
    </div>
  );
} 