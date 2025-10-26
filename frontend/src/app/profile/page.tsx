"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import apiService from '@/services/api';
import LocationMap from '@/components/LocationMap';
import LocationDisplay from '@/components/LocationDisplay';

const sidebarItems = [
  { key: "dashboard", label: "Dashboard" },
  { key: "my-post-items", label: "My Post Items" },
  { key: "location", label: "📍 Location" },
  { key: "order-history", label: "Order History" },
  { key: "notification", label: "Notification" },
  { key: "subscription", label: "Subscription" },
  { key: "setting", label: "Setting" },
  { key: "logout", label: "Log-out" },
];

export default function DashboardPage() {
  const [selected, setSelected] = useState("dashboard");
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/'); // redirect to login if no token
        return;
      }

      try {
        const user = await apiService.getCurrentUser();
        setUserProfile(user);
      } catch (error: unknown) {
        console.error('Failed to fetch user profile:', error);
        router.push('/'); // redirect to login if token invalid
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const getUserDisplayName = () => {
    if (!userProfile) return 'User';
    if (userProfile.firstName && userProfile.lastName) return `${userProfile.firstName} ${userProfile.lastName}`;
    if (userProfile.name) return userProfile.name;
    if (userProfile.firstName) return userProfile.firstName;
    if (userProfile.email) return userProfile.email.split('@')[0];
    return 'User';
  };

  const getUserInitials = () => {
    if (!userProfile) return 'U';
    return getUserDisplayName()
      .split(' ')
      .map((word: string) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    apiService.removeAuthToken();
    router.push("/");
    window.location.reload();
  };

  const Sidebar = () => (
    <nav style={{
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 2px 12px rgba(146,77,172,0.06)",
      padding: 0,
      minWidth: 180,
      marginRight: 32,
      marginTop: 24,
      marginBottom: 24,
      overflow: "hidden",
    }}>
      {sidebarItems.map((item) => (
        <button
          key={item.key}
          onClick={() => item.key === "logout" ? handleLogout() : setSelected(item.key)}
          style={{
            display: "block",
            width: "100%",
            textAlign: "left",
            padding: "16px 24px",
            background: selected === item.key ? "#f3eaff" : "#fff",
            color: selected === item.key ? "#924DAC" : "#444",
            fontWeight: selected === item.key ? 700 : 500,
            border: "none",
            borderLeft: selected === item.key ? "4px solid #924DAC" : "4px solid transparent",
            fontSize: 16,
            cursor: "pointer",
            outline: "none",
            transition: "background 0.2s, color 0.2s, border 0.2s",
          }}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );

  const renderContent = () => {
    switch (selected) {
      case "dashboard":
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 28 }}>Welcome to your Dashboard!</h2>
            <p style={{ color: "#444", marginTop: 12 }}>Manage your orders, notifications, subscriptions, and settings here.</p>
          </div>
        );

      case "location":
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 22, marginBottom: 18 }}>📍 Location Settings</h2>
            <div style={{ background: "white", borderRadius: 12, padding: 24, boxShadow: "0 2px 12px rgba(146,77,172,0.06)", marginBottom: 24 }}>
              <h3 style={{ color: "#924DAC", fontWeight: 600, marginBottom: 16 }}>Select Your Location</h3>
              <LocationMap onLocationSelect={setSelectedLocation} height="400px" />
            </div>
            {selectedLocation && (
              <div style={{ background: "linear-gradient(135deg, #f3eaff 0%, #e8f4fd 100%)", borderRadius: 12, padding: 20, border: "2px solid #e0e7ff" }}>
                <h4 style={{ color: "#924DAC", fontWeight: 600, marginBottom: 12 }}>📍 Selected Location</h4>
                <div style={{ color: "#666", marginBottom: 8 }}><strong>Address:</strong> {selectedLocation.address}</div>
                <div style={{ color: "#666", marginBottom: 8 }}><strong>Coordinates:</strong> {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}</div>
                <button className="sayonara-btn" style={{ fontSize: 14, padding: "8px 16px", marginTop: 8 }} onClick={() => alert('Location saved successfully!')}>💾 Save Location</button>
              </div>
            )}
          </div>
        );

      case "my-post-items":
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 22, marginBottom: 18 }}>My Post Items</h2>
            <p style={{ color: "#444" }}>Manage your posted items here.</p>
            <table style={{ width: "100%", background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px rgba(146,77,172,0.06)", overflow: "hidden" }}>
              <thead>
                <tr style={{ background: "#f3eaff", color: "#924DAC" }}>
                  <th style={{ padding: 12 }}>ITEM</th>
                  <th style={{ padding: 12 }}>STATUS</th>
                  <th style={{ padding: 12 }}>VIEWS</th>
                  <th style={{ padding: 12 }}>LIKES</th>
                  <th style={{ padding: 12 }}>POSTED DATE</th>
                  <th style={{ padding: 12 }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={6} style={{ padding: 12, textAlign: "center", color: "#666" }}>No items have been posted</td>
                </tr>
              </tbody>
            </table>
          </div>
        );

      case "order-history":
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Order History</h2>
            <p style={{ color: "#444" }}>Your order history will appear here.</p>
          </div>
        );

      case "notification":
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Notification</h2>
            <p style={{ color: "#444" }}>You have no new notifications.</p>
          </div>
        );

      case "subscription":
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Subscription Plans</h2>
            <p style={{ color: "#444" }}>View available subscription plans.</p>
          </div>
        );

      case "setting":
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Setting</h2>
            <p style={{ color: "#444" }}>Update your account settings here.</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa" }}>
      {/* Header */}
      <div style={{ background: "#924DAC", padding: "24px 0 16px 0", color: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 32, marginRight: 8 }}>🌟</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 20, letterSpacing: 1 }}>Welcome back!</div>
              <div style={{ fontSize: 14, color: "#e0e7ff", marginTop: 2 }}>Ready to discover amazing deals?</div>
              <div style={{ marginTop: 8 }}>
                <LocationDisplay showUpdateButton={false} />
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ fontWeight: 600 }}>{loading ? 'Loading...' : getUserDisplayName()}</div>
            <div style={{ fontSize: 13, color: "#eee" }}>{loading ? 'loading@email.com' : userProfile?.email || 'user@example.com'}</div>
            <div style={{ width: 36, height: 36, background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#924DAC", fontWeight: 700, fontSize: 18 }}>
              {loading ? 'L' : getUserInitials()}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1, marginTop: 24, marginBottom: 24 }}>{renderContent()}</div>
      </div>
    </div>
  );
}
