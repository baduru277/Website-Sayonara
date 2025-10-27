"use client";

import React, { useState, useEffect } from "react";

interface LocationMapProps {
  selectedLocation: { lat: number; lng: number; address: string } | null;
  setSelectedLocation: React.Dispatch<
    React.SetStateAction<{ lat: number; lng: number; address: string } | null>
  >;
}

export default function LocationMap({
  selectedLocation,
  setSelectedLocation,
}: LocationMapProps) {
  const [mapError, setMapError] = useState<string | null>(null);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Simulated map click handler
    // In production, integrate with Google Maps or Mapbox
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Simulate coordinates (replace with actual map library)
    const lat = 17.3569 + (x - rect.width / 2) / 10000;
    const lng = 78.4753 + (y - rect.height / 2) / 10000;

    setSelectedLocation({
      lat: parseFloat(lat.toFixed(4)),
      lng: parseFloat(lng.toFixed(4)),
      address: `Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
    });
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSelectedLocation({
            lat: parseFloat(latitude.toFixed(4)),
            lng: parseFloat(longitude.toFixed(4)),
            address: `Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          });
        },
        (error) => {
          setMapError(`Error getting location: ${error.message}`);
        }
      );
    } else {
      setMapError("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div>
      <div
        onClick={handleMapClick}
        style={{
          width: "100%",
          height: 400,
          background: "#e8f5e9",
          borderRadius: 12,
          marginBottom: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#666",
          fontSize: 14,
          cursor: "crosshair",
          position: "relative",
          border: "2px solid #924DAC",
          overflow: "hidden",
        }}
      >
        {mapError ? (
          <div style={{ color: "#d32f2f", textAlign: "center" }}>
            <p>{mapError}</p>
          </div>
        ) : selectedLocation ? (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: 32,
            }}
          >
            📍
          </div>
        ) : (
          <p>Click on the map to select a location or use current location</p>
        )}
      </div>

      <button
        onClick={handleCurrentLocation}
        style={{
          padding: "10px 18px",
          borderRadius: 6,
          background: "#4CAF50",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          marginBottom: 18,
          fontSize: 14,
          fontWeight: 500,
        }}
      >
        📍 Use Current Location
      </button>

      {selectedLocation && (
        <div
          style={{
            background: "#f3eaff",
            borderRadius: 12,
            padding: 16,
            marginBottom: 18,
            color: "#924DAC",
            fontSize: 14,
          }}
        >
          <p>
            <strong>Latitude:</strong> {selectedLocation.lat}
          </p>
          <p>
            <strong>Longitude:</strong> {selectedLocation.lng}
          </p>
          <p>
            <strong>Address:</strong> {selectedLocation.address}
          </p>
        </div>
      )}
    </div>
  );
}
