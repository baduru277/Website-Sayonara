"use client";

import React, { useState } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import AuthModal from "@/components/AuthModal";

export default function Header() {
  const [location, setLocation] = useState("Andhra Pradesh");
  const [authOpen, setAuthOpen] = useState(false);

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;

    if (selected !== "Andhra Pradesh") {
      toast.error("We are currently available only in Andhra Pradesh.");
      setTimeout(() => setLocation("Andhra Pradesh"), 1500);
    } else {
      setLocation(selected);
    }
  };

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 24px",
        background: "#fff",
        borderBottom: "1px solid #ddd",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <Link href="/" style={{ fontSize: 20, fontWeight: 600, color: "#333", textDecoration: "none" }}>
          Sayonaraa
        </Link>

        {/* Location Selector */}
        <div style={{ marginLeft: 24 }}>
          <select
            style={{
              fontSize: 16,
              padding: "4px 12px",
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
            value={location}
            onChange={handleLocationChange}
          >
            {[
              "Andhra Pradesh",
              "Arunachal Pradesh",
              "Assam",
              "Bihar",
              "Chhattisgarh",
              "Goa",
              "Gujarat",
              "Haryana",
              "Himachal Pradesh",
              "Jharkhand",
              "Karnataka",
              "Kerala",
              "Madhya Pradesh",
              "Maharashtra",
              "Manipur",
              "Meghalaya",
              "Mizoram",
              "Nagaland",
              "Odisha",
              "Punjab",
              "Rajasthan",
              "Sikkim",
              "Tamil Nadu",
              "Telangana",
              "Tripura",
              "Uttar Pradesh",
              "Uttarakhand",
              "West Bengal",
            ].map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right Side */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <Link href="/browse" style={{ color: "#333", fontSize: 16, textDecoration: "none" }}>
          Browse
        </Link>
        <Link href="/add-item" style={{ color: "#333", fontSize: 16, textDecoration: "none" }}>
          Add Item
        </Link>
        <button
          style={{
            background: "#0070f3",
            color: "#fff",
            padding: "6px 14px",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => setAuthOpen(true)}
        >
          Login / Signup
        </button>
      </div>

      {/* Auth Modal */}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />

      {/* Toast Notifications */}
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#333",
            color: "#fff",
            fontSize: 14,
            padding: "10px 16px",
          },
        }}
      />
    </header>
  );
}
