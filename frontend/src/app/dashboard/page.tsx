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

// Sample available subscription plans
const availablePlans = [
  { id: 1, name: "Basic Plan", price: 99, desc: "Basic features for casual users." },
  { id: 2, name: "Standard Plan", price: 299, desc: "Standard features for regular users." },
  { id: 3, name: "Premium Plan", price: 499, desc: "All features for power users." },
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
      try {
        const user = await apiService.getCurrentUser();
        setUserProfile(user);
      } catch (error: unknown) {
        console.error('Failed to fetch user profile:', error);
        if (error instanceof Error) {
          if (error.message.includes('Invalid token') || error.message.includes('401')) {
            router.push('/');
          }
        }
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

  const handleSubscribe = async (plan: any) => {
    try {
      await apiService.subscribeToPlan(plan.id);
      alert(`Subscribed to ${plan.name} successfully!`);
      const user = await apiService.getCurrentUser();
      setUserProfile(user);
    } catch (err) {
      console.error(err);
      alert("Failed to subscribe. Please try again.");
    }
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
          onClick={() => {
            if (item.key === "logout") handleLogout();
            else setSelected(item.key);
          }}
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
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 28 }}>Welcome, {getUserDisplayName()}!</h2>
            <p style={{ color: "#444", marginTop: 12 }}>Manage your orders, notifications, subscriptions, and settings here.</p>

            {/* Motivational Section */}
            <div style={{
              background: "linear-gradient(135deg, #f3eaff 0%, #e8f4fd 100%)",
              borderRadius: 16,
              padding: 32,
              marginTop: 32,
              border: "2px solid #e0e7ff"
            }}>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <span style={{ fontSize: 48, marginBottom: 16, display: "block" }}>🌟</span>
                <h3 style={{ color: "#924DAC", fontWeight: 700, fontSize: 24, marginBottom: 16 }}>
                  Ready to Share Your Treasures?
                </h3>
                <p style={{ color: "#666", fontSize: 16, lineHeight: 1.6, marginBottom: 24 }}>
                  One person's unused item is another person's treasure. Start giving items a second life!
                </p>
              </div>

              {/* Stats */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 20,
                marginBottom: 24
              }}>
                <div style={{ background: "white", padding: 24, borderRadius: 12, textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                  <div style={{ fontSize: 32, color: "#924DAC", fontWeight: 700 }}>0</div>
                  <div style={{ color: "#666", fontSize: 14 }}>Items Posted</div>
                </div>
                <div style={{ background: "white", padding: 24, borderRadius: 12, textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                  <div style={{ fontSize: 32, color: "#924DAC", fontWeight: 700 }}>0</div>
                  <div style={{ color: "#666", fontSize: 14 }}>Total Views</div>
                </div>
                <div style={{ background: "white", padding: 24, borderRadius: 12, textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                  <div style={{ fontSize: 32, color: "#924DAC", fontWeight: 700 }}>0</div>
                  <div style={{ color: "#666", fontSize: 14 }}>Total Likes</div>
                </div>
                <div style={{ background: "white", padding: 24, borderRadius: 12, textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                  <div style={{ fontSize: 32, color: "#924DAC", fontWeight: 700 }}>0</div>
                  <div style={{ color: "#666", fontSize: 14 }}>Successful Trades</div>
                </div>
              </div>
            </div>
          </div>
        );

      case "subscription":
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 22, marginBottom: 18 }}>
              Your Subscription Plan
            </h2>

            {userProfile?.subscription ? (
              <div style={{ background: "#f3eaff", borderRadius: 12, padding: 28, maxWidth: 400, marginBottom: 32 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#924DAC", marginBottom: 8 }}>
                  Current Plan: {userProfile.subscription.planName}
                </div>
                <div style={{ color: "#444", marginBottom: 12 }}>
                  {userProfile.subscription.features.join(", ")}
                </div>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#222" }}>₹{userProfile.subscription.price}</div>
                <div style={{ color: "#888", fontSize: 14 }}>per month</div>
              </div>
            ) : (
              <p style={{ color: "#666", marginBottom: 32 }}>
                You don't have an active subscription yet. Choose a plan to enjoy full benefits!
              </p>
            )}

            <h3 style={{ color: "#924DAC", fontWeight: 700, marginBottom: 16 }}>Available Plans</h3>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {availablePlans.map((plan) => (
                <div key={plan.id} style={{
                  background: "#fff",
                  borderRadius: 12,
                  boxShadow: "0 2px 8px rgba(146,77,172,0.04)",
                  padding: 28,
                  minWidth: 220,
                  flex: "1 1 220px"
                }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#924DAC", marginBottom: 8 }}>{plan.name}</div>
                  <div style={{ color: "#444", marginBottom: 12 }}>{plan.desc}</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: "#222" }}>₹{plan.price}</div>
                  <div style={{ color: "#888", fontSize: 14, marginBottom: 12 }}>per month</div>
                  <button
                    style={{ padding: "8px 16px", borderRadius: 6, background: "#924DAC", color: "#fff", border: "none", cursor: "pointer" }}
                    onClick={() => handleSubscribe(plan)}
                  >
                    Subscribe
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      // Keep other cases (location, my-post-items, order-history, notification, setting) same as your existing code
      default: return null;
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
