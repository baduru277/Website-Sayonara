"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import apiService from '@/services/api';
import LocationMap from '@/components/LocationMap';

interface UserProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  posts?: UserPost[];
}

interface UserPost {
  id: string;
  title: string;
  status: "Active" | "Pending" | "Inactive";
  views: number;
  likes: number;
  date: string;
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
  const [myPosts, setMyPosts] = useState<UserPost[]>([]);
  const router = useRouter();

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await apiService.request("get", "/users/dashboard");
        setUserProfile(res.user);
        if (res.user.posts) setMyPosts(res.user.posts);
      } catch (error: unknown) {
        console.error('Failed to fetch user profile:', error);
        if (error instanceof Error && (error.message.includes('Invalid token') || error.message.includes('401'))) {
          router.push('/');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [router]);

  // Helper functions
  const getUserDisplayName = (): string => {
    if (!userProfile) return 'User';
    return userProfile.firstName && userProfile.lastName
      ? `${userProfile.firstName} ${userProfile.lastName}`
      : userProfile.name || userProfile.firstName || userProfile.email.split('@')[0] || 'User';
  };

  const getUserInitials = (): string =>
    getUserDisplayName()
      .split(' ')
      .map((w: string) => w.charAt(0)) // fixed implicit any
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    apiService.removeAuthToken();
    router.push("/");
    window.location.reload();
  };

  // Sidebar
  const Sidebar = () => (
    <nav style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px rgba(146,77,172,0.06)", padding: 0, minWidth: 180, marginRight: 32, marginTop: 24, marginBottom: 24 }}>
      {sidebarItems.map(item => (
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
            transition: "all 0.2s",
          }}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );

  // Render content based on selected sidebar
  const renderContent = () => {
    switch (selected) {
      case "dashboard":
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 28 }}>Welcome, {getUserDisplayName()}!</h2>
            <p style={{ color: "#444", marginTop: 12 }}>Manage your activities, notifications, and settings here.</p>
            {/* Dashboard motivational & quick stats section */}
            <div style={{ background: "linear-gradient(135deg, #f3eaff 0%, #e8f4fd 100%)", borderRadius: 16, padding: 32, marginTop: 32, border: "2px solid #e0e7ff" }}>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <span style={{ fontSize: 48 }}>🌟</span>
                <h3 style={{ color: "#924DAC", fontWeight: 700, fontSize: 24, marginBottom: 16 }}>Ready to Share Your Treasures?</h3>
                <p style={{ color: "#666", fontSize: 16, lineHeight: 1.6, marginBottom: 24 }}>
                  One person's unused item is another's treasure. Start your journey of giving items a second life!
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 24 }}>
                {[{ icon: "📦", title: "Declutter & Earn", desc: "Turn your unused items into cash" },
                  { icon: "🤝", title: "Build Community", desc: "Connect with like-minded people" },
                  { icon: "🌱", title: "Go Green", desc: "Reduce waste and help the environment" }].map(item => (
                  <div key={item.title} style={{ background: "white", padding: 20, borderRadius: 12, textAlign: "center", boxShadow: "0 4px 12px rgba(146,77,172,0.1)" }}>
                    <span style={{ fontSize: 32, marginBottom: 12 }}>{item.icon}</span>
                    <h4 style={{ color: "#924DAC", fontWeight: 600, marginBottom: 8 }}>{item.title}</h4>
                    <p style={{ color: "#666", fontSize: 14 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <span style={{ fontSize: 20, color: "#924DAC" }}>Click the</span>
                  <span style={{ fontSize: 24, fontWeight: "bold", color: "#924DAC" }}>↑</span>
                  <span style={{ fontSize: 20, color: "#924DAC" }}>Post button to upload your first item!</span>
                </div>
                <p style={{ color: "#888", fontSize: 14, fontStyle: "italic" }}>The best time to start was yesterday. The second best time is now!</p>
              </div>
            </div>
          </div>
        );

      case "subscription":
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Subscription Plans</h2>
            {/* Subscription cards section (unchanged) */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
              {[{ title: "Basic Plan", price: "Rs 99/month", features: ["Post up to 5 items", "Basic support"] },
                { title: "Pro Plan", price: "Rs 399/6month", features: ["Post up to 50 items", "Priority support", "Analytics"] },
                { title: "Premium Plan", price: "Rs 699/12month", features: ["Unlimited items", "24/7 support", "Advanced analytics", "Feature priority"] }].map(plan => (
                <div key={plan.title} style={{ background: "#fff", padding: 24, borderRadius: 12, boxShadow: "0 2px 12px rgba(146,77,172,0.06)" }}>
                  <h3 style={{ color: "#924DAC", fontWeight: 600, fontSize: 18, marginBottom: 12 }}>{plan.title}</h3>
                  <p style={{ color: "#444", fontSize: 16, marginBottom: 12 }}>{plan.price}</p>
                  <ul style={{ color: "#666", fontSize: 14, marginBottom: 12, paddingLeft: 16 }}>
                    {plan.features.map(f => <li key={f}>{f}</li>)}
                  </ul>
                  <button className="sayonara-btn" style={{ fontSize: 14, padding: "8px 16px" }}>Subscribe</button>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return <div style={{ padding: 32 }}>Content coming soon...</div>;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1, marginTop: 24, marginBottom: 24 }}>
          {loading ? <div style={{ padding: 32 }}>Loading...</div> : renderContent()}
        </div>
      </div>
    </div>
  );
}
