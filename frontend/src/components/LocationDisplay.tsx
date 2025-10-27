"use client";

import React from "react";

interface LocationDisplayProps {
  location?: { lat: number; lng: number; address: string } | null;
  showUpdateButton?: boolean;
}

export default function LocationDisplay({ 
  location, 
  showUpdateButton = true 
}: LocationDisplayProps) {
  if (!location) {
    return (
      <div
        style={{
          background: "#fff3cd",
          borderRadius: 8,
          padding: 16,
          color: "#856404",
          fontSize: 14,
          border: "1px solid #ffeaa7",
          marginBottom: 16,
        }}
      >
        <span style={{ marginRight: 8 }}>📍</span>
        No location selected yet
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 12px rgba(146,77,172,0.06)",
        padding: 24,
        marginBottom: 18,
      }}
    >
      <h3 style={{ color: "#924DAC", fontWeight: 700, marginBottom: 16, fontSize: 18 }}>
        📍 Your Location Details
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 16,
        }}
      >
        <div>
          <label style={{ display: "block", color: "#666", fontSize: 12, marginBottom: 4, fontWeight: 600 }}>
            Latitude
          </label>
          <div
            style={{
              padding: 12,
              background: "#f9f9f9",
              borderRadius: 6,
              color: "#222",
              fontFamily: "monospace",
              fontSize: 14,
            }}
          >
            {location.lat}
          </div>
        </div>

        <div>
          <label style={{ display: "block", color: "#666", fontSize: 12, marginBottom: 4, fontWeight: 600 }}>
            Longitude
          </label>
          <div
            style={{
              padding: 12,
              background: "#f9f9f9",
              borderRadius: 6,
              color: "#222",
              fontFamily: "monospace",
              fontSize: 14,
            }}
          >
            {location.lng}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", color: "#666", fontSize: 12, marginBottom: 4, fontWeight: 600 }}>
          Address
        </label>
        <div
          style={{
            padding: 12,
            background: "#f9f9f9",
            borderRadius: 6,
            color: "#222",
            wordBreak: "break-word",
            fontSize: 14,
          }}
        >
          {location.address}
        </div>
      </div>

      {showUpdateButton && (
        <div
          style={{
            background: "#f3eaff",
            borderRadius: 8,
            padding: 12,
            marginTop: 16,
            fontSize: 13,
            color: "#666",
            borderLeft: "4px solid #924DAC",
          }}
        >
          ✓ Location saved. You can update it anytime from the Location section.
        </div>
      )}
    </div>
  );
}
