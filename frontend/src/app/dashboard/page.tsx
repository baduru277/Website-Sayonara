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
  const [myPosts, setMyPosts] = useState<any[]>([]); // Track user posts
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await apiService.request("get", "/users/dashboard");
        console.log('User profile received:', res.user);
        setUserProfile(res.user);
        if (res.user.posts) setMyPosts(res.user.posts);
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
      .map(word => word.charAt(0))
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
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 28 }}>Welcome to your Dashboard!</h2>
            <p style={{ color: "#444", marginTop: 12 }}>Here you can manage your orders, notifications, subscriptions, and settings.</p>
            {/* Dashboard motivational & quick stats section */}
            <div style={{ 
              background: "linear-gradient(135deg, #f3eaff 0%, #e8f4fd 100%)", 
              borderRadius: 16, padding: 32, marginTop: 32, border: "2px solid #e0e7ff"
            }}>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <span style={{ fontSize: 48, display: "block" }}>🌟</span>
                <h3 style={{ color: "#924DAC", fontWeight: 700, fontSize: 24, marginBottom: 16 }}>Ready to Share Your Treasures?</h3>
                <p style={{ color: "#666", fontSize: 16, lineHeight: 1.6, marginBottom: 24 }}>
                  "One person's unused item is another person's treasure. Start your journey of giving items a second life!"
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 24 }}>
                {[
                  { icon: "📦", title: "Declutter & Earn", desc: "Turn your unused items into cash while helping others find what they need" },
                  { icon: "🤝", title: "Build Community", desc: "Connect with like-minded people who value sustainability and smart shopping" },
                  { icon: "🌱", title: "Go Green", desc: "Reduce waste and contribute to a more sustainable future for everyone" }
                ].map(item => (
                  <div key={item.title} style={{ background: "white", padding: 20, borderRadius: 12, textAlign: "center", boxShadow: "0 4px 12px rgba(146,77,172,0.1)" }}>
                    <span style={{ fontSize: 32, display: "block", marginBottom: 12 }}>{item.icon}</span>
                    <h4 style={{ color: "#924DAC", fontWeight: 600, marginBottom: 8 }}>{item.title}</h4>
                    <p style={{ color: "#666", fontSize: 14 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
                  <span style={{ fontSize: 20, color: "#924DAC" }}>Click the</span>
                  <span style={{ fontSize: 24, color: "#924DAC", fontWeight: "bold" }}>↑</span>
                  <span style={{ fontSize: 20, color: "#924DAC" }}>Post button to upload your first item!</span>
                </div>
                <p style={{ color: "#888", fontSize: 14, fontStyle: "italic" }}>
                  "The best time to start was yesterday. The second best time is now!"
                </p>
              </div>
            </div>
            {/* Quick Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginTop: 32 }}>
              {[
                { value: 0, label: "Items Posted" },
                { value: 0, label: "Total Views" },
                { value: 0, label: "Total Likes" },
                { value: 0, label: "Successful Trades" }
              ].map(stat => (
                <div key={stat.label} style={{ background: "white", padding: 24, borderRadius: 12, textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                  <div style={{ fontSize: 32, color: "#924DAC", fontWeight: 700 }}>{stat.value}</div>
                  <div style={{ color: "#666", fontSize: 14 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case "location":
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 22, marginBottom: 18 }}>📍 Location Settings</h2>
            <p style={{ color: "#444", marginBottom: 24 }}>Set your location to help buyers find items near you</p>
            <div style={{ background: "white", borderRadius: 12, padding: 24, boxShadow: "0 2px 12px rgba(146,77,172,0.06)", marginBottom: 24 }}>
              <h3 style={{ color: "#924DAC", fontWeight: 600, marginBottom: 16 }}>Select Your Location</h3>
              <LocationMap onLocationSelect={setSelectedLocation} height="400px" />
            </div>
            {selectedLocation && (
              <div style={{ background: "linear-gradient(135deg, #f3eaff 0%, #e8f4fd 100%)", borderRadius: 12, padding: 20, border: "2px solid #e0e7ff" }}>
                <h4 style={{ color: "#924DAC", fontWeight: 600, marginBottom: 12 }}>📍 Selected Location</h4>
                <div style={{ color: "#666", marginBottom: 8 }}><strong>Address:</strong> {selectedLocation.address}</div>
                <div style={{ color: "#666", marginBottom: 8 }}><strong>Coordinates:</strong> {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}</div>
                <button className="sayonara-btn" style={{ fontSize: 14, padding: "8px 16px", marginTop: 8 }} onClick={() => alert('Location saved successfully!')}>
                  💾 Save Location
                </button>
              </div>
            )}
            <div style={{ background: "#fff7e6", borderRadius: 8, padding: 16, marginTop: 24, border: "1px solid #ffeaa7" }}>
              <div style={{ color: "#b26a00", fontWeight: 600, marginBottom: 8 }}>💡 Location Tips</div>
              <ul style={{ color: "#b26a00", fontSize: 14, margin: 0, paddingLeft: 20 }}>
                <li>Setting your location helps buyers find items near you</li>
                <li>You can update your location anytime</li>
                <li>Your exact address is never shared publicly</li>
                <li>Only your city/area is shown to other users</li>
              </ul>
            </div>
          </div>
        );

      case "my-post-items":
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 22, marginBottom: 18 }}>My Post Items</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <p style={{ color: "#444" }}>Manage your posted items and track their performance</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#924DAC", fontSize: 14 }}>
                <span>Click the</span>
                <span style={{ fontSize: 18, fontWeight: "bold" }}>↑</span>
                <span>Post button to add new items</span>
              </div>
            </div>
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
                {myPosts.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: 20, textAlign: "center", color: "#888" }}>
                      No items have been posted
                    </td>
                  </tr>
                ) : (
                  myPosts.map((item) => (
                    <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: 12, fontWeight: 500 }}>{item.title}</td>
                      <td style={{ padding: 12 }}>
                        <span style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: 600,
                          color: item.status === "Active" ? "#27ae60" : item.status === "Pending" ? "#f39c12" : "#e74c3c",
                          backgroundColor: item.status === "Active" ? "#d4edda" : item.status === "Pending" ? "#fff3cd" : "#f8d7da"
                        }}>
                          {item.status}
                        </span>
                      </td>
                      <td style={{ padding: 12, color: "#666" }}>{item.views}</td>
                      <td style={{ padding: 12, color: "#666" }}>{item.likes}</td>
                      <td style={{ padding: 12, color: "#666" }}>{item.date}</td>
                      <td style={{ padding: 12 }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="sayonara-btn" style={{ fontSize: 12, padding: "4px 8px" }}>Edit</button>
                          <button className="sayonara-btn" style={{ fontSize: 12, padding: "4px 8px" }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        );

      case "order-history":
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Order History</h2>
            <table style={{ width: "100%", background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px rgba(146,77,172,0.06)", overflow: "hidden" }}>
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
                  <td colSpan={5} style={{ padding: 20, textAlign: "center", color: "#888" }}>
                    No order history available
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );

      case "notification":
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Notifications</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ background: "#f3eaff", padding: 16, borderRadius: 12, color: "#444" }}>
                You have no notifications yet.
              </div>
            </div>
          </div>
        );

      case "subscription":
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Subscription Plans</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
              {[
                { title: "Basic Plan", price: "$0/month", features: ["Post up to 5 items", "Basic support"] },
                { title: "Pro Plan", price: "$9.99/month", features: ["Post up to 50 items", "Priority support", "Analytics"] },
                { title: "Premium Plan", price: "$19.99/month", features: ["Unlimited items", "24/7 support", "Advanced analytics", "Feature priority"] }
              ].map(plan => (
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

      case "setting":
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Settings</h2>
            <div style={{ display: "grid", gap: 16 }}>
              <div style={{ background: "#fff", padding: 24, borderRadius: 12, boxShadow: "0 2px 12px rgba(146,77,172,0.06)" }}>
                <h3 style={{ color: "#924DAC", fontWeight: 600 }}>Profile</h3>
                <p style={{ color: "#666" }}>Update your profile information here.</p>
              </div>
              <div style={{ background: "#fff", padding: 24, borderRadius: 12, boxShadow: "0 2px 12px rgba(146,77,172,0.06)" }}>
                <h3 style={{ color: "#924DAC", fontWeight: 600 }}>Password</h3>
                <p style={{ color: "#666" }}>Change your password regularly to keep your account secure.</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1, marginTop: 24, marginBottom: 24 }}>{renderContent()}</div>
      </div>
    </div>
  );
}
