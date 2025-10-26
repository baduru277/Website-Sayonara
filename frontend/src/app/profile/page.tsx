"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import apiService from "@/services/api";
import LocationMap from "@/components/LocationMap";
import LocationDisplay from "@/components/LocationDisplay";

interface UserProfile {
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
}

interface Location {
  lat: number;
  lng: number;
  address: string;
}

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
  const [selected, setSelected] = useState<string>("dashboard");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = await apiService.getCurrentUser();
        setUserProfile(user);
      } catch (error: unknown) {
        console.error("Failed to fetch user profile:", error);
        if (error instanceof Error) {
          if (
            error.message.includes("Invalid token") ||
            error.message.includes("401") ||
            error.message.includes("No authentication token")
          ) {
            apiService.removeAuthToken();
            localStorage.removeItem("isLoggedIn");
            router.push("/"); // redirect to home/login
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const getUserDisplayName = (): string => {
    if (!userProfile) return "User";
    if (userProfile.firstName && userProfile.lastName)
      return `${userProfile.firstName} ${userProfile.lastName}`;
    if (userProfile.name) return userProfile.name;
    if (userProfile.firstName) return userProfile.firstName;
    if (userProfile.email) return userProfile.email.split("@")[0];
    return "User";
  };

  const getUserInitials = (): string => {
    if (!userProfile) return "U";
    return getUserDisplayName()
      .split(" ")
      .map((w: string) => w.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    apiService.removeAuthToken();
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
          onClick={() =>
            item.key === "logout" ? handleLogout() : setSelected(item.key)
          }
          style={{
            display: "block",
            width: "100%",
            textAlign: "left",
            padding: "16px 24px",
            background: selected === item.key ? "#f3eaff" : "#fff",
            color: selected === item.key ? "#924DAC" : "#444",
            fontWeight: selected === item.key ? 700 : 500,
            border: "none",
            borderLeft:
              selected === item.key
                ? "4px solid #924DAC"
                : "4px solid transparent",
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

  // Main content renderer
  const renderContent = () => {
    switch (selected) {
      case "dashboard":
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 28 }}>
              Welcome to your Dashboard!
            </h2>
            <p style={{ color: "#444", marginTop: 12 }}>
              Here you can manage your orders, notifications, subscriptions, and
              settings.
            </p>

            {/* Motivational Section */}
            <div
              style={{
                background: "linear-gradient(135deg, #f3eaff 0%, #e8f4fd 100%)",
                borderRadius: 16,
                padding: 32,
                marginTop: 32,
                border: "2px solid #e0e7ff",
              }}
            >
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <span
                  style={{ fontSize: 48, marginBottom: 16, display: "block" }}
                >
                  🌟
                </span>
                <h3
                  style={{
                    color: "#924DAC",
                    fontWeight: 700,
                    fontSize: 24,
                    marginBottom: 16,
                  }}
                >
                  Ready to Share Your Treasures?
                </h3>
                <p
                  style={{
                    color: "#666",
                    fontSize: 16,
                    lineHeight: 1.6,
                    marginBottom: 24,
                  }}
                >
                  One person's unused item is another's treasure. Start your
                  journey of giving items a second life!
                </p>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: 20,
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    background: "white",
                    padding: 20,
                    borderRadius: 12,
                    textAlign: "center",
                    boxShadow: "0 4px 12px rgba(146,77,172,0.1)",
                  }}
                >
                  <span
                    style={{ fontSize: 32, marginBottom: 12, display: "block" }}
                  >
                    📦
                  </span>
                  <h4
                    style={{
                      color: "#924DAC",
                      fontWeight: 600,
                      marginBottom: 8,
                    }}
                  >
                    Declutter & Earn
                  </h4>
                  <p style={{ color: "#666", fontSize: 14 }}>
                    Turn your unused items into cash while helping others find
                    what they need
                  </p>
                </div>
                <div
                  style={{
                    background: "white",
                    padding: 20,
                    borderRadius: 12,
                    textAlign: "center",
                    boxShadow: "0 4px 12px rgba(146,77,172,0.1)",
                  }}
                >
                  <span
                    style={{ fontSize: 32, marginBottom: 12, display: "block" }}
                  >
                    🤝
                  </span>
                  <h4
                    style={{
                      color: "#924DAC",
                      fontWeight: 600,
                      marginBottom: 8,
                    }}
                  >
                    Build Community
                  </h4>
                  <p style={{ color: "#666", fontSize: 14 }}>
                    Connect with like-minded people who value sustainability and
                    smart shopping
                  </p>
                </div>
                <div
                  style={{
                    background: "white",
                    padding: 20,
                    borderRadius: 12,
                    textAlign: "center",
                    boxShadow: "0 4px 12px rgba(146,77,172,0.1)",
                  }}
                >
                  <span
                    style={{ fontSize: 32, marginBottom: 12, display: "block" }}
                  >
                    🌱
                  </span>
                  <h4
                    style={{
                      color: "#924DAC",
                      fontWeight: 600,
                      marginBottom: 8,
                    }}
                  >
                    Go Green
                  </h4>
                  <p style={{ color: "#666", fontSize: 14 }}>
                    Reduce waste and contribute to a more sustainable future for
                    everyone
                  </p>
                </div>
              </div>

              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 12,
                    marginBottom: 16,
                  }}
                >
                  <span style={{ fontSize: 20, color: "#924DAC" }}>Click the</span>
                  <span style={{ fontSize: 24, color: "#924DAC", fontWeight: "bold" }}>
                    ↑
                  </span>
                  <span style={{ fontSize: 20, color: "#924DAC" }}>
                    Post button to upload your first item!
                  </span>
                </div>
                <p style={{ color: "#888", fontSize: 14, fontStyle: "italic" }}>
                  The best time to start was yesterday. The second best time is
                  now!
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 20,
                marginTop: 32,
              }}
            >
              {["Items Posted", "Total Views", "Total Likes", "Successful Trades"].map(
                (label, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "white",
                      padding: 24,
                      borderRadius: 12,
                      textAlign: "center",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  >
                    <div style={{ fontSize: 32, color: "#924DAC", fontWeight: 700 }}>
                      0
                    </div>
                    <div style={{ color: "#666", fontSize: 14 }}>{label}</div>
                  </div>
                )
              )}
            </div>
          </div>
        );

      // --------------------------------------------------------
      // Other sections: my-post-items, location, order-history,
      // notification, subscription, setting
      // --------------------------------------------------------
      case "my-post-items":
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 22, marginBottom: 18 }}>
              My Post Items
            </h2>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <p style={{ color: "#444" }}>
                Manage your posted items and track their performance
              </p>
            </div>
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

      case "location":
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 22, marginBottom: 18 }}>
              📍 Location Settings
            </h2>
            <p style={{ color: "#444", marginBottom: 24 }}>
              Set your location to help buyers find items near you
            </p>
            <div
              style={{
                background: "white",
                borderRadius: 12,
                padding: 24,
                boxShadow: "0 2px 12px rgba(146,77,172,0.06)",
                marginBottom: 24,
              }}
            >
              <h3 style={{ color: "#924DAC", fontWeight: 600, marginBottom: 16 }}>
                Select Your Location
              </h3>
              <LocationMap onLocationSelect={setSelectedLocation} height="400px" />
            </div>
            {selectedLocation && (
              <div
                style={{
                  background: "linear-gradient(135deg, #f3eaff 0%, #e8f4fd 100%)",
                  borderRadius: 12,
                  padding: 20,
                  border: "2px solid #e0e7ff",
                }}
              >
                <h4 style={{ color: "#924DAC", fontWeight: 600, marginBottom: 12 }}>
                  📍 Selected Location
                </h4>
                <div style={{ color: "#666", marginBottom: 8 }}>
                  <strong>Address:</strong> {selectedLocation.address}
                </div>
                <div style={{ color: "#666", marginBottom: 8 }}>
                  <strong>Coordinates:</strong> {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                </div>
                <button
                  className="sayonara-btn"
                  style={{ fontSize: 14, padding: "8px 16px", marginTop: 8 }}
                  onClick={() => alert("Location saved successfully!")}
                >
                  💾 Save Location
                </button>
              </div>
            )}
          </div>
        );

      case "order-history":
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 22, marginBottom: 18 }}>
              Order History
            </h2>
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
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 22, marginBottom: 18 }}>
              Notification
            </h2>
            <p style={{ color: "#666", fontSize: 14 }}>No new notifications</p>
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
              ].map(plan => (
                <div key={plan.name} style={{ background: plan.color, borderRadius: 12, boxShadow: "0 2px 8px rgba(146,77,172,0.04)", padding: 28, minWidth: 220, flex: "1 1 220px" }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#924DAC", marginBottom: 8 }}>{plan.name}</div>
                  <div style={{ color: "#444", marginBottom: 12 }}>{plan.duration}</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: "#924DAC", marginBottom: 16 }}>₹{plan.price}</div>
                  <ul style={{ color: "#666", fontSize: 14, marginBottom: 16 }}>
                    {plan.benefits.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                  <button style={{ background: "#924DAC", color: "#fff", borderRadius: 6, padding: "8px 16px", fontWeight: 600, cursor: "pointer" }}>Subscribe</button>
                </div>
              ))}
            </div>
          </div>
        );

      case "setting":
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 22, marginBottom: 18 }}>
              Account Settings
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontWeight: 600 }}>Full Name:</label>
                <input
                  style={{ marginTop: 6, padding: 8, borderRadius: 6, border: "1px solid #ccc", width: "100%" }}
                  value={getUserDisplayName()}
                  readOnly
                />
              </div>
              <div>
                <label style={{ fontWeight: 600 }}>Email:</label>
                <input
                  style={{ marginTop: 6, padding: 8, borderRadius: 6, border: "1px solid #ccc", width: "100%" }}
                  value={userProfile?.email || ""}
                  readOnly
                />
              </div>
            </div>
          </div>
        );

      default:
        return <div style={{ padding: 32 }}>Select a section</div>;
    }
  };

  if (loading) return <div style={{ padding: 32 }}>Loading...</div>;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8f8f8" }}>
      <Sidebar />
      <div style={{ flex: 1 }}>{renderContent()}</div>
    </div>
  );
}
