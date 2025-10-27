"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import apiService from "@/services/api";
import LocationMap from "@/components/LocationMap";
import LocationDisplay from "@/components/LocationDisplay";

const sidebarItems = [
  { key: "profile", label: "Profile" },
  { key: "my-post-items", label: "My Post Items" },
  { key: "location", label: "📍 Location" },
  { key: "order-history", label: "Order History" },
  { key: "notification", label: "Notification" },
  { key: "subscription", label: "Subscription" },
  { key: "setting", label: "Setting" },
  { key: "logout", label: "Log-out" },
];

export default function ProfilePage() {
  const [selected, setSelected] = useState("profile");
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);

  const router = useRouter();

  // Fetch user profile (safe fallback if no token)
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = await apiService.getCurrentUser();
        if (!user) {
          console.warn("No token found, redirecting to home...");
          router.push("/");
          return;
        }
        setUserProfile(user);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [router]);

  // Get user display name
  const getUserDisplayName = () => {
    if (!userProfile) return "User";
    if (userProfile.firstName && userProfile.lastName) return `${userProfile.firstName} ${userProfile.lastName}`;
    if (userProfile.name) return userProfile.name;
    if (userProfile.firstName) return userProfile.firstName;
    if (userProfile.email) return userProfile.email.split("@")[0];
    return "User";
  };

  const getUserInitials = () => {
  if (!userProfile) return "U";
  return getUserDisplayName()
    .split(" ")
    .map((w: string) => w.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

  const handleLogout = () => {
    apiService.logout();
    router.push("/");
    window.location.reload();
  };

  // Sidebar component
  const Sidebar = () => (
    <nav
      style={{
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 12px rgba(146,77,172,0.06)",
        padding: 0,
        minWidth: 180,
        marginRight: 32,
        marginTop: 24,
        marginBottom: 24,
        overflow: "hidden",
      }}
    >
      {sidebarItems.map((item) => (
        <button
          key={item.key}
          onClick={() => (item.key === "logout" ? handleLogout() : setSelected(item.key))}
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

  // Main content render
  const renderContent = () => {
    switch (selected) {
      case "profile":
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 28 }}>
              Welcome to your Profile, {getUserDisplayName()}!
            </h2>
            <p style={{ color: "#444", marginTop: 12 }}>
              Manage your posts, orders, notifications, subscriptions, and settings here.
            </p>
          </div>
        );

      case "my-post-items":
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 22, marginBottom: 18 }}>My Post Items</h2>
            <table
              style={{
                width: "100%",
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 2px 12px rgba(146,77,172,0.06)",
                overflow: "hidden",
              }}
            >
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
                  <td colSpan={6} style={{ padding: 12, textAlign: "center", color: "#666" }}>
                    No items have been posted
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );

      case "order-history":
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Order History</h2>
            <table
              style={{
                width: "100%",
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 2px 12px rgba(146,77,172,0.06)",
                overflow: "hidden",
              }}
            >
              <thead>
                <tr style={{ background: "#f3eaff", color: "#924DAC" }}>
                  <th style={{ padding: 12 }}>ORDER ID</th>
                  <th style={{ padding: 12 }}>STATUS</th>
                  <th style={{ padding: 12 }}>DATE</th>
                  <th style={{ padding: 12 }}>TOTAL</th>
                  <th style={{ padding: 12 }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={5} style={{ padding: 12, textAlign: "center", color: "#666" }}>
                    No orders yet
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );

      case "notification":
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Notification</h2>
            <div
              style={{
                background: "#fff7e6",
                borderRadius: 8,
                padding: 18,
                marginBottom: 14,
                color: "#b26a00",
                fontWeight: 500,
              }}
            >
              <span style={{ marginRight: 8 }}>🔔</span> You have no notifications.
            </div>
          </div>
        );

      case "subscription":
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 22, marginBottom: 18 }}>
              Subscription Plans
            </h2>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {[
                { name: "Starter", price: 99, duration: "1 Month", benefits: ["Post up to 5 items", "Exchange items", "Resell options", "Bid on items"], color: "#f3eaff" },
                { name: "Standard", price: 199, duration: "3 Months", benefits: ["Post up to 15 items", "Exchange items", "Resell options", "Bid on items", "Priority support"], color: "#eafff3" },
                { name: "Pro", price: 399, duration: "6 Months", benefits: ["Post up to 50 items", "Exchange items", "Resell options", "Bid on items", "Analytics & Insights"], color: "#fff3ea" },
                { name: "Premium", price: 699, duration: "12 Months", benefits: ["Unlimited posts", "Exchange items", "Resell options", "Bid on items", "Priority support", "Analytics & Insights", "Feature priority"], color: "#f0e7ff" },
              ].map((plan) => (
                <div
                  key={plan.name}
                  style={{
                    background: plan.color,
                    borderRadius: 12,
                    boxShadow: "0 2px 8px rgba(146,77,172,0.04)",
                    padding: 28,
                    minWidth: 220,
                    flex: "1 1 220px",
                  }}
                >
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#924DAC", marginBottom: 8 }}>
                    {plan.name}
                  </div>
                  <div style={{ color: "#444", marginBottom: 12 }}>{plan.duration}</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: "#222", marginBottom: 12 }}>
                    ₹{plan.price}
                  </div>
                  <ul style={{ fontSize: 14, color: "#666", marginBottom: 12, paddingLeft: 16 }}>
                    {plan.benefits.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                  <button style={{ fontSize: 14, padding: "8px 16px" }}>Subscribe</button>
                </div>
              ))}
            </div>
          </div>
        );

      case "location":
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Manage Location</h2>
            <LocationMap selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation} />
            {selectedLocation && <LocationDisplay location={selectedLocation} />}
          </div>
        );

      case "setting":
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Settings</h2>
            <div style={{ marginBottom: 16 }}>
              <label>Name:</label>
              <input
                type="text"
                value={getUserDisplayName()}
                onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc", marginLeft: 12 }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label>Email:</label>
              <input
                type="text"
                value={userProfile?.email || ""}
                readOnly
                style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc", marginLeft: 12 }}
              />
            </div>
            <button
              onClick={async () => {
                await apiService.updateProfile(userProfile);
                alert("Profile updated!");
              }}
              style={{ padding: "8px 16px", borderRadius: 6, background: "#924DAC", color: "#fff" }}
            >
              Update Profile
            </button>
          </div>
        );

      default:
        return <div style={{ padding: 32 }}>Unknown section</div>;
    }
  };

  if (loading) return <div style={{ padding: 32 }}>Loading...</div>;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f7f7f7",
        fontFamily: "sans-serif",
      }}
    >
      <Sidebar />
      <div style={{ flex: 1 }}>{renderContent()}</div>
    </div>
  );
}
