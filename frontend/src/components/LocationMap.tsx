"use client";

import React, { useState } from "react";

interface LocationMapProps {
  onLocationSelect: React.Dispatch<
    React.SetStateAction<{ lat: number; lng: number; address: string } | null>
  >;
  height?: string;
}

export default function LocationMap({
  onLocationSelect,
  height = "400px",
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

    onLocationSelect({
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
          onLocationSelect({
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
          height: height,
          background: "linear-gradient(135deg, #e8f5e9 0%, #f3eaff 100%)",
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
          boxShadow: "0 2px 12px rgba(146,77,172,0.1)",
        }}
      >
        {mapError ? (
          <div style={{ color: "#d32f2f", textAlign: "center" }}>
            <p>{mapError}</p>
          </div>
        ) : (
          <>
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: 32,
                opacity: 0.5,
              }}
            >
              📍
            </div>
            <p style={{ position: "relative", zIndex: 1 }}>Click on the map to select a location</p>
          </>
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
          transition: "background 0.2s",
        }}
        onMouseOver={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "#45a049";
        }}
        onMouseOut={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "#4CAF50";
        }}
      >
        📍 Use Current Location
      </button>
    </div>
  );
}
