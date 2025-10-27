"use client";

import React from "react";

interface LocationDisplayProps {
  location: { lat: number; lng: number; address: string } | null;
}

export default function LocationDisplay({ location }: LocationDisplayProps) {
  if (!location) {
    return null;
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
        Selected Location Details
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
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
            }}
          >
            {location.lng}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
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
          }}
        >
          {location.address}
        </div>
      </div>
    </div>
  );
}
