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
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const router = useRouter();

  // Fetch current user profile on page load
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        router.push("/"); // redirect to login if no token
        return;
      }

      try {
        const data = await apiService.getCurrentUser();
        console.log('Fetched user profile:', data);
        setUserProfile(data.user || data); // adapt based on backend response
      } catch (error: unknown) {
        console.error('Failed to fetch user profile:', error);
        apiService.removeAuthToken();
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  // User display helpers
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
      .map((w) => w.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Logout
  const handleLogout = () => {
    apiService.removeAuthToken();
    localStorage.removeItem("isLoggedIn");
    router.push("/");
    window.location.reload();
  };

  // Sidebar
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

  // Main content
  const renderContent = () => {
    switch (selected) {
      case "dashboard":
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 28 }}>Welcome, {getUserDisplayName()}!</h2>
            <p style={{ color: "#444", marginTop: 12 }}>Here you can manage your orders, notifications, subscriptions, and settings.</p>
          </div>
        );
      case "location":
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 22, marginBottom: 18 }}>📍 Location Settings</h2>
            <LocationMap onLocationSelect={setSelectedLocation} height="400px" />
            {selectedLocation && (
              <div>
                <p>Selected: {selectedLocation.address} ({selectedLocation.lat}, {selectedLocation.lng})</p>
              </div>
            )}
          </div>
        );
      default:
        return <p style={{ padding: 32 }}>Section under construction...</p>;
    }
  };

  if (loading) return <div style={{ padding: 32 }}>Loading user profile...</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa" }}>
      <div style={{ background: "#924DAC", padding: "24px 0 16px 0", color: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontWeight: 700, fontSize: 20 }}>Welcome back, {getUserDisplayName()}!</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div>{userProfile?.email}</div>
            <div style={{ width: 36, height: 36, background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#924DAC", fontWeight: 700 }}>{getUserInitials()}</div>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1, marginTop: 24, marginBottom: 24 }}>{renderContent()}</div>
      </div>
    </div>
  );
}
