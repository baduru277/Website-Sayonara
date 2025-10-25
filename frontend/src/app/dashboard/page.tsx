"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import apiService from '@/services/api';

const sidebarItems = [
  { key: "dashboard", label: "Dashboard" },
  { key: "my-post-items", label: "My Post Items" },
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
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Check if token exists
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        
        if (!token) {
          console.log('No token found, redirecting to login');
          router.push('/login');
          return;
        }

        // Try to get user from localStorage first
        const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUserProfile(parsedUser);
            setLoading(false);
          } catch (e) {
            console.error('Error parsing stored user:', e);
          }
        }

      } catch (error: unknown) {
        console.error('Failed to fetch user profile:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const getUserDisplayName = () => {
    if (!userProfile) return 'User';
    return userProfile.name || userProfile.email?.split('@')[0] || 'User';
  };

  const getUserInitials = () => {
    if (!userProfile) return 'U';
    const name = getUserDisplayName();
    return name
      .split(' ')
      .map((word: string) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    apiService.removeAuthToken();
    router.push("/login");
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
                  "One person's unused item is another person's treasure. Start your journey of giving items a second life!"
                </p>
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 24 }}>
                <div style={{ 
                  background: "white", 
                  padding: 20, 
                  borderRadius: 12, 
                  textAlign: "center",
                  boxShadow: "0 4px 12px rgba(146,77,172,0.1)"
                }}>
                  <span style={{ fontSize: 32, marginBottom: 12, display: "block" }}>📦</span>
                  <h4 style={{ color: "#924DAC", fontWeight: 600, marginBottom: 8 }}>Declutter & Earn</h4>
                  <p style={{ color: "#666", fontSize: 14 }}>Turn your unused items into cash while helping others find what they need</p>
                </div>
                
                <div style={{ 
                  background: "white", 
                  padding: 20, 
                  borderRadius: 12, 
                  textAlign: "center",
                  boxShadow: "0 4px 12px rgba(146,77,172,0.1)"
                }}>
                  <span style={{ fontSize: 32, marginBottom: 12, display: "block" }}>🤝</span>
                  <h4 style={{ color: "#924DAC", fontWeight: 600, marginBottom: 8 }}>Build Community</h4>
                  <p style={{ color: "#666", fontSize: 14 }}>Connect with like-minded people who value sustainability and smart shopping</p>
                </div>
                
                <div style={{ 
                  background: "white", 
                  padding: 20, 
                  borderRadius: 12, 
                  textAlign: "center",
                  boxShadow: "0 4px 12px rgba(146,77,172,0.1)"
                }}>
                  <span style={{ fontSize: 32, marginBottom: 12, display: "block" }}>🌱</span>
                  <h4 style={{ color: "#924DAC", fontWeight: 600, marginBottom: 8 }}>Go Green</h4>
                  <p style={{ color: "#666", fontSize: 14 }}>Reduce waste and contribute to a more sustainable future for everyone</p>
                </div>
              </div>
              
              <div style={{ textAlign: "center" }}>
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  gap: 12,
                  marginBottom: 16
                }}>
                  <span style={{ fontSize: 20, color: "#924DAC" }}>Click the</span>
                  <span style={{ fontSize: 24, color: "#924DAC", fontWeight: "bold" }}>↑</span>
                  <span style={{ fontSize: 20, color: "#924DAC" }}>Post button to upload your first item!</span>
                </div>
                
                <p style={{ color: "#888", fontSize: 14, fontStyle: "italic" }}>
                  "The best time to start was yesterday. The second best time is now!"
                </p>
              </div>
            </div>
            
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
              gap: 20, 
              marginTop: 32 
            }}>
              <div style={{ 
                background: "white", 
                padding: 24, 
                borderRadius: 12, 
                textAlign: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}>
                <div style={{ fontSize: 32, color: "#924DAC", fontWeight: 700 }}>0</div>
                <div style={{ color: "#666", fontSize: 14 }}>Items Posted</div>
              </div>
              
              <div style={{ 
                background: "white", 
                padding: 24, 
                borderRadius: 12, 
                textAlign: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}>
                <div style={{ fontSize: 32, color: "#924DAC", fontWeight: 700 }}>0</div>
                <div style={{ color: "#666", fontSize: 14 }}>Total Views</div>
              </div>
              
              <div style={{ 
                background: "white", 
                padding: 24, 
                borderRadius: 12, 
                textAlign: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}>
                <div style={{ fontSize: 32, color: "#924DAC", fontWeight: 700 }}>0</div>
                <div style={{ color: "#666", fontSize: 14 }}>Total Likes</div>
              </div>
              
              <div style={{ 
                background: "white", 
                padding: 24, 
                borderRadius: 12, 
                textAlign: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}>
                <div style={{ fontSize: 32, color: "#924DAC", fontWeight: 700 }}>0</div>
                <div style={{ color: "#666", fontSize: 14 }}>Successful Trades</div>
              </div>
            </div>
          </div>
        );
      
      case "my-post-items":
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 22, marginBottom: 18 }}>My Post Items</h2>
            <div style={{ 
              background: "#f8f9fa", 
              borderRadius: 12, 
              padding: 40,
              textAlign: "center"
            }}>
              <span style={{ fontSize: 64, marginBottom: 16, display: "block" }}>📦</span>
              <h3 style={{ color: "#924DAC", marginBottom: 12 }}>No Items Posted Yet</h3>
              <p style={{ color: "#666", marginBottom: 20 }}>Start posting your items to see them here!</p>
              <button 
                className="sayonara-btn"
                onClick={() => router.push('/post-item')}
              >
                Post Your First Item
              </button>
            </div>
          </div>
        );
      
      case "order-history":
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Order History</h2>
            <div style={{ 
              background: "#f8f9fa", 
              borderRadius: 12, 
              padding: 40,
              textAlign: "center"
            }}>
              <span style={{ fontSize: 64, marginBottom: 16, display: "block" }}>📋</span>
              <h3 style={{ color: "#924DAC", marginBottom: 12 }}>No Orders Yet</h3>
              <p style={{ color: "#666" }}>Your order history will appear here</p>
            </div>
          </div>
        );
      
      case "notification":
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Notifications</h2>
            <div style={{ 
              background: "#f8f9fa", 
              borderRadius: 12, 
              padding: 40,
              textAlign: "center"
            }}>
              <span style={{ fontSize: 64, marginBottom: 16, display: "block" }}>🔔</span>
              <h3 style={{ color: "#924DAC", marginBottom: 12 }}>No Notifications</h3>
              <p style={{ color: "#666" }}>You're all caught up!</p>
            </div>
          </div>
        );
      
      case "subscription":
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Subscription Plans</h2>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {[
                { name: "Basic Plan", price: 99, desc: "Basic features for casual users.", color: "#f3eaff" },
                { name: "Standard Plan", price: 299, desc: "Standard features for regular users.", color: "#eafff3" },
                { name: "Premium Plan", price: 499, desc: "All features for power users.", color: "#fff3ea" },
              ].map((plan) => (
                <div key={plan.name} style={{ background: plan.color, borderRadius: 12, boxShadow: "0 2px 8px rgba(146,77,172,0.04)", padding: 28, minWidth: 220, flex: 1 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#924DAC", marginBottom: 8 }}>{plan.name}</div>
                  <div style={{ color: "#444", marginBottom: 12 }}>{plan.desc}</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: "#222" }}>₹{plan.price}</div>
                  <div style={{ color: "#888", fontSize: 14, marginBottom: 16 }}>per month</div>
                  <button className="sayonara-btn" style={{ width: "100%", fontSize: 14 }}>
                    Subscribe
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      
      case "setting":
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Settings</h2>
            <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(146,77,172,0.04)", padding: 28, maxWidth: 500 }}>
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontWeight: 600, color: "#444", display: "block", marginBottom: 8 }}>Language</label>
                <select style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #e8e8e8" }}>
                  <option>English</option>
                  <option>Hindi</option>
                </select>
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                  <input type="checkbox" defaultChecked style={{ marginRight: 8 }} />
                  <span style={{ fontWeight: 600, color: "#444" }}>Message Notifications</span>
                </label>
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                  <input type="checkbox" defaultChecked style={{ marginRight: 8 }} />
                  <span style={{ fontWeight: 600, color: "#444" }}>Email Notifications</span>
                </label>
              </div>
              <button className="sayonara-btn" style={{ width: "100%" }}>
                Save Settings
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f9fa" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
          <div style={{ color: "#924DAC", fontWeight: 600 }}>Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa" }}>
      <div style={{ background: "#924DAC", padding: "24px 0", color: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 32 }}>🌟</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 20 }}>Welcome back, {getUserDisplayName()}!</div>
              <div style={{ fontSize: 14, color: "#e0e7ff", marginTop: 2 }}>Ready to discover amazing deals?</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 600 }}>{getUserDisplayName()}</div>
              <div style={{ fontSize: 13, color: "#eee" }}>{userProfile?.email || 'user@example.com'}</div>
            </div>
            <div style={{ width: 40, height: 40, background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#924DAC", fontWeight: 700, fontSize: 16 }}>
              {getUserInitials()}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", display: "flex", flexWrap: "wrap" }}>
        <Sidebar />
        <div style={{ flex: 1, marginTop: 24, marginBottom: 24, minWidth: 300 }}>{renderContent()}</div>
      </div>
    </div>
  );
}
