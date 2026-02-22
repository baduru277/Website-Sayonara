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
  const [subscription, setSubscription] = useState<any>(null);
  const [myItems, setMyItems] = useState<any[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const router = useRouter();

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await apiService.getCurrentUser();
        console.log("Fetched response:", response);

        const user = response?.user || response;

        if (!user) {
          console.warn("No user data found, redirecting to home...");
          router.push("/");
          return;
        }

        setUserProfile(user);

        // Restore previously saved location
        if (user.location) {
          setSelectedLocation(user.location);
        } else {
          try {
            const saved = localStorage.getItem("userLocation");
            if (saved) setSelectedLocation(JSON.parse(saved));
          } catch (e) {
            console.warn("Could not parse saved location");
          }
        }

        // Fetch subscription data
        try {
          const subResponse = await apiService.getSubscription();
          console.log("Subscription response:", subResponse);
          setSubscription(subResponse?.subscription || null);
        } catch (err) {
          console.error("Error fetching subscription:", err);
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [router]);

  // ✅ NEW: Fetch user's items when "my-post-items" is selected
  useEffect(() => {
    if (selected === "my-post-items" && myItems.length === 0) {
      fetchMyItems();
    }
  }, [selected]);

  const fetchMyItems = async () => {
    try {
      setItemsLoading(true);
      const response = await apiService.getMyItems();
      setMyItems(response?.items || []);
    } catch (err) {
      console.error("Error fetching items:", err);
    } finally {
      setItemsLoading(false);
    }
  };

  const getUserDisplayName = () => {
    if (!userProfile) return "User";
    if (userProfile.name) return userProfile.name;
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

  // ✅ NEW: Handle subscription plan selection
  const handleSubscribePlan = (plan: any) => {
    // Check if user already has an active subscription
    if (subscription && subscription.status === 'active') {
      alert('You already have an active subscription. Please wait for it to expire or contact support to upgrade.');
      return;
    }

    if (subscription && subscription.status === 'pending') {
      alert('Your subscription is pending approval. Please complete the payment process or contact support.');
      return;
    }

    // Store selected plan and redirect to payment page
    setSelectedPlan(plan);
    // Navigate to payment page with plan info
    router.push(`/payment?plan=${plan.name}&amount=${plan.price}&duration=${plan.duration}`);
  };

  // ✅ IMPROVED: Function to get subscription display info with pending status
  const getSubscriptionDisplay = () => {
    if (!subscription) return { text: "Free", color: "#f0e7ff", status: "No active plan" };

    // ✅ Handle pending status
    if (subscription.status === 'pending') {
      return {
        text: "Pending",
        color: "#fff7e6",
        status: "Pending Approval",
        planName: subscription.planName || "Basic Plan",
        expiryDate: "N/A",
        daysRemaining: 0,
        message: "Contact admin for approval"
      };
    }

    const isExpired = subscription.isExpired || (subscription.expiryDate && new Date() > new Date(subscription.expiryDate));

    if (isExpired) {
      return { text: "Expired", color: "#ffe7e7", status: "Plan expired", planName: subscription.planName };
    }

    return {
      text: `₹${subscription.amount}`,
      color: "#e7ffe7",
      status: subscription.status === "active" ? "Active" : subscription.status,
      planName: subscription.planName || "Basic Plan",
      expiryDate: subscription.expiryDate ? new Date(subscription.expiryDate).toLocaleDateString() : "N/A",
      daysRemaining: subscription.daysRemaining || 0
    };
  };

  // Sidebar component
  const Sidebar = () => (
    <nav
      style={{
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 12px rgba(146,77,172,0.06)",
        padding: 0,
        minWidth: 200,
        marginRight: 32,
        marginTop: 24,
        marginBottom: 24,
        overflow: "hidden",
        maxHeight: "90vh",
        overflowY: "auto",
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
    const subDisplay = getSubscriptionDisplay();

    switch (selected) {
      case "profile":
        return (
          <div style={{ padding: 32 }}>
            <div style={{ marginBottom: 32 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                  background: "linear-gradient(135deg, #924DAC 0%, #d97ef6 100%)",
                  borderRadius: 16,
                  padding: 32,
                  color: "#fff",
                }}
              >
                <div
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 48,
                    fontWeight: 700,
                    border: "3px solid rgba(255,255,255,0.5)",
                  }}
                >
                  {getUserInitials()}
                </div>
                <div>
                  <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
                    Welcome, {getUserDisplayName()}!
                  </h1>
                  <p style={{ fontSize: 16, opacity: 0.95 }}>
                    Email: {userProfile?.email || "No email"}
                  </p>
                  <p style={{ fontSize: 14, opacity: 0.85, marginTop: 4 }}>
                    Member since {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : "Recently"}
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 24 }}>
              {[
                { icon: "📝", title: "My Posts", count: myItems.length || "0", color: "#f3eaff" },
                { icon: "📦", title: "Orders", count: "0", color: "#eafff3" },
                { icon: "🔔", title: "Notifications", count: "0", color: "#fff3ea" },
                { icon: "⭐", title: "Subscription", count: subDisplay.text, color: subDisplay.color },
              ].map((card) => (
                <div
                  key={card.title}
                  style={{
                    background: card.color,
                    borderRadius: 12,
                    padding: 24,
                    boxShadow: "0 2px 8px rgba(146,77,172,0.06)",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 32, marginBottom: 12 }}>{card.icon}</div>
                  <div style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>{card.title}</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: "#924DAC" }}>{card.count}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 32 }}>
              <p style={{ color: "#666", lineHeight: 1.6 }}>
                Manage your posts, orders, notifications, subscriptions, and settings from the sidebar menu.
              </p>
            </div>
          </div>
        );

      case "my-post-items":
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 22, marginBottom: 18 }}>My Post Items</h2>
            
            {itemsLoading ? (
              <div style={{ textAlign: "center", padding: 40, color: "#924DAC" }}>Loading items...</div>
            ) : (
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
                    <th style={{ padding: 12, textAlign: "left" }}>ITEM</th>
                    <th style={{ padding: 12, textAlign: "left" }}>TYPE</th>
                    <th style={{ padding: 12, textAlign: "left" }}>STATUS</th>
                    <th style={{ padding: 12, textAlign: "left" }}>VIEWS</th>
                    <th style={{ padding: 12, textAlign: "left" }}>LIKES</th>
                    <th style={{ padding: 12, textAlign: "left" }}>POSTED DATE</th>
                    <th style={{ padding: 12, textAlign: "left" }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {myItems.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: 12, textAlign: "center", color: "#666" }}>
                        No items have been posted
                      </td>
                    </tr>
                  ) : (
                    myItems.map((item) => (
                      <tr key={item.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                        <td style={{ padding: 12 }}>{item.title}</td>
                        <td style={{ padding: 12 }}>
                          <span style={{
                            background: item.type === 'bidding' ? '#e7f3ff' : item.type === 'exchange' ? '#fff3ea' : '#eafff3',
                            padding: '4px 8px',
                            borderRadius: 4,
                            fontSize: 12,
                            fontWeight: 600
                          }}>
                            {item.type}
                          </span>
                        </td>
                        <td style={{ padding: 12 }}>
                          <span style={{
                            background: item.status === 'available' ? '#e7ffe7' : '#ffe7e7',
                            padding: '4px 8px',
                            borderRadius: 4,
                            fontSize: 12,
                            fontWeight: 600
                          }}>
                            {item.status}
                          </span>
                        </td>
                        <td style={{ padding: 12 }}>{item.views || 0}</td>
                        <td style={{ padding: 12 }}>{item.likes || 0}</td>
                        <td style={{ padding: 12 }}>{new Date(item.createdAt).toLocaleDateString()}</td>
                        <td style={{ padding: 12 }}>
                          <button
                            onClick={() => router.push(`/items/${item.id}`)}
                            style={{
                              background: "#924DAC",
                              color: "#fff",
                              border: "none",
                              borderRadius: 4,
                              padding: "4px 12px",
                              fontSize: 12,
                              cursor: "pointer"
                            }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
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
                  <th style={{ padding: 12, textAlign: "left" }}>ORDER ID</th>
                  <th style={{ padding: 12, textAlign: "left" }}>STATUS</th>
                  <th style={{ padding: 12, textAlign: "left" }}>DATE</th>
                  <th style={{ padding: 12, textAlign: "left" }}>TOTAL</th>
                  <th style={{ padding: 12, textAlign: "left" }}>ACTION</th>
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

            {/* ✅ Current Subscription Status */}
            {subscription && (
              <div
                style={{
                  background: subDisplay.color,
                  borderRadius: 12,
                  padding: 24,
                  marginBottom: 32,
                  boxShadow: "0 2px 12px rgba(146,77,172,0.08)",
                  border: subscription.status === 'pending' ? '2px solid #ffd666' : 'none'
                }}
              >
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#924DAC", marginBottom: 12 }}>
                  Your Current Plan
                </h3>
                
                {/* ✅ Pending message */}
                {subscription.status === 'pending' && (
                  <div style={{
                    background: 'rgba(255,214,102,0.3)',
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 16,
                    fontSize: 14,
                    color: '#ad6800'
                  }}>
                    ⏳ Your subscription is pending admin approval. Please contact support with payment details.
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Plan Name</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#222" }}>{subDisplay.planName}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Amount</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#222" }}>₹{subscription.amount}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Status</div>
                    <div style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: subscription.status === "active" ? "#2d7a2d" : subscription.status === "pending" ? "#d46b08" : "#d32f2f"
                    }}>
                      {subDisplay.status}
                    </div>
                  </div>
                  {subscription.status === 'active' && (
                    <>
                      <div>
                        <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Expires On</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#222" }}>{subDisplay.expiryDate}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Days Remaining</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#222" }}>{subDisplay.daysRemaining} days</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#924DAC", marginBottom: 16 }}>
              Available Plans
            </h3>
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
                  <button
                    onClick={() => handleSubscribePlan(plan)}
                    style={{
                      fontSize: 14,
                      padding: "8px 16px",
                      background: "#924DAC",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer",
                      fontWeight: 600,
                      transition: "background 0.2s",
                    }}
                    onMouseOver={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "#7a3a8a";
                    }}
                    onMouseOut={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "#924DAC";
                    }}
                  >
                    Subscribe
                  </button>
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
            {selectedLocation && (
              <>
                <LocationDisplay location={selectedLocation} />
                <button
                  onClick={async () => {
                    try {
                      await apiService.updateProfile({ ...userProfile, location: selectedLocation });
                      try {
                        localStorage.setItem("userLocation", JSON.stringify(selectedLocation));
                      } catch (e) {
                        console.warn("Could not save to localStorage");
                      }
                      alert("Location saved successfully!");
                    } catch (err) {
                      console.error("Error saving location:", err);
                      alert("Failed to save location.");
                    }
                  }}
                  style={{
                    marginTop: 16,
                    padding: "10px 18px",
                    borderRadius: 6,
                    background: "#924DAC",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 600,
                    transition: "background 0.2s",
                  }}
                  onMouseOver={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "#7a3a8a";
                  }}
                  onMouseOut={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "#924DAC";
                  }}
                >
                  💾 Save Location
                </button>
              </>
            )}
          </div>
        );

      case "setting":
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Settings</h2>
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 2px 12px rgba(146,77,172,0.06)",
                padding: 24,
              }}
            >
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", color: "#666", fontSize: 14, marginBottom: 8, fontWeight: 600 }}>
                  Name
                </label>
                <input
                  type="text"
                  value={getUserDisplayName()}
                  onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                  style={{
                    width: "100%",
                    maxWidth: 400,
                    padding: 12,
                    borderRadius: 6,
                    border: "1px solid #ddd",
                    fontSize: 14,
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", color: "#666", fontSize: 14, marginBottom: 8, fontWeight: 600 }}>
                  Email
                </label>
                <input
                  type="text"
                  value={userProfile?.email || ""}
                  readOnly
                  style={{
                    width: "100%",
                    maxWidth: 400,
                    padding: 12,
                    borderRadius: 6,
                    border: "1px solid #ddd",
                    fontSize: 14,
                    background: "#f9f9f9",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <button
                onClick={async () => {
                  try {
                    await apiService.updateProfile(userProfile);
                    alert("Profile updated!");
                  } catch (err) {
                    alert("Failed to update profile");
                  }
                }}
                style={{
                  padding: "10px 24px",
                  borderRadius: 6,
                  background: "#924DAC",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 14,
                  transition: "background 0.2s",
                }}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#7a3a8a";
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#924DAC";
                }}
              >
                Update Profile
              </button>
            </div>
          </div>
        );

      default:
        return <div style={{ padding: 32 }}>Unknown section</div>;
    }
  };

  if (loading)
    return (
      <div style={{ padding: 32, textAlign: "center", color: "#924DAC", fontSize: 18 }}>
        Loading your profile...
      </div>
    );

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
      <div style={{ flex: 1, overflowY: "auto" }}>{renderContent()}</div>
    </div>
  );
}
