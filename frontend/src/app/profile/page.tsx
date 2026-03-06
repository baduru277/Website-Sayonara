"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import apiService from "@/services/api";
import LocationMap from "@/components/LocationMap";
import LocationDisplay from "@/components/LocationDisplay";
import SubscriptionSection from "@/components/SubscriptionSection";

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
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [totalEverPosted, setTotalEverPosted] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const FREE_LIMIT = 3;
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await apiService.getCurrentUser();
        const user = response?.user || response;
        if (!user) { router.push("/"); return; }
        setUserProfile(user);
        if (user.location) {
          setSelectedLocation(user.location);
        } else {
          try {
            const saved = localStorage.getItem("userLocation");
            if (saved) setSelectedLocation(JSON.parse(saved));
          } catch (e) {}
        }
        try {
          const subResponse = await apiService.getSubscription();
          setSubscription(subResponse?.subscription || null);
        } catch (err) {}
      } catch (err) {
        console.error("Error fetching user profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [router]);

  useEffect(() => {
    if (selected === "my-post-items" && myItems.length === 0) {
      fetchMyItems();
    }
  }, [selected]);

  const fetchMyItems = async () => {
    try {
      setItemsLoading(true);
      const token = localStorage.getItem("token");

      // Fetch active items
      const response = await apiService.getMyItems();
      setMyItems(response?.items || []);

      // Fetch total ever posted (including deleted) for limit check
      const countRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items/my/post-count`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (countRes.ok) {
        const countData = await countRes.json();
        setTotalEverPosted(countData.totalEverPosted || 0);
        setIsSubscribed(countData.isSubscribed || false);
      }
    } catch (err) {
      console.error("Error fetching items:", err);
    } finally {
      setItemsLoading(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setMyItems(prev => prev.filter(i => i.id !== itemId));
        setDeleteConfirm(null);
      } else {
        const d = await res.json();
        alert(`Failed to delete: ${d.error || "Unknown error"}`);
      }
    } catch {
      alert("Failed to delete item.");
    } finally {
      setDeleting(false);
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
    return getUserDisplayName().split(" ").map((w: string) => w.charAt(0)).join("").toUpperCase().slice(0, 2);
  };

  const handleLogout = () => {
    apiService.logout();
    router.push("/");
    window.location.reload();
  };

  const getSubscriptionDisplay = () => {
    if (!subscription) return { text: "Free", color: "#f0e7ff", status: "No active plan" };
    if (subscription.status === 'pending') {
      return { text: "Pending", color: "#fff7e6", status: "Pending Approval", planName: subscription.planName || "Basic Plan", expiryDate: "N/A", daysRemaining: 0 };
    }
    const isExpired = subscription.isExpired || (subscription.expiryDate && new Date() > new Date(subscription.expiryDate));
    if (isExpired) return { text: "Expired", color: "#ffe7e7", status: "Plan expired", planName: subscription.planName };
    return {
      text: `₹${subscription.amount}`, color: "#e7ffe7",
      status: subscription.status === "active" ? "Active" : subscription.status,
      planName: subscription.planName || "Basic Plan",
      expiryDate: subscription.expiryDate ? new Date(subscription.expiryDate).toLocaleDateString() : "N/A",
      daysRemaining: subscription.daysRemaining || 0
    };
  };

  const typeColor = (type: string) => type === 'bidding' ? '#e7f3ff' : type === 'exchange' ? '#fff3ea' : '#eafff3';

  const Sidebar = () => (
    <nav style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px rgba(146,77,172,0.06)", padding: 0, minWidth: 200, marginRight: 32, marginTop: 24, marginBottom: 24, overflow: "hidden", maxHeight: "90vh", overflowY: "auto" }}>
      {sidebarItems.map((item) => (
        <button key={item.key}
          onClick={() => (item.key === "logout" ? handleLogout() : setSelected(item.key))}
          style={{ display: "block", width: "100%", textAlign: "left", padding: "16px 24px", background: selected === item.key ? "#f3eaff" : "#fff", color: selected === item.key ? "#924DAC" : item.key === "logout" ? "#e74c3c" : "#444", fontWeight: selected === item.key ? 700 : 500, border: "none", borderLeft: selected === item.key ? "4px solid #924DAC" : "4px solid transparent", fontSize: 16, cursor: "pointer", outline: "none", transition: "background 0.2s, color 0.2s, border 0.2s" }}>
          {item.label}
        </button>
      ))}
    </nav>
  );

  const renderContent = () => {
    const subDisplay = getSubscriptionDisplay();
    switch (selected) {
      case "profile":
        return (
          <div style={{ padding: 32 }}>
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 24, background: "linear-gradient(135deg, #924DAC 0%, #d97ef6 100%)", borderRadius: 16, padding: 32, color: "#fff" }}>
                <div style={{ width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, fontWeight: 700, border: "3px solid rgba(255,255,255,0.5)" }}>
                  {getUserInitials()}
                </div>
                <div>
                  <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Welcome, {getUserDisplayName()}!</h1>
                  <p style={{ fontSize: 16, opacity: 0.95 }}>Email: {userProfile?.email || "No email"}</p>
                  <p style={{ fontSize: 14, opacity: 0.85, marginTop: 4 }}>Member since {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : "Recently"}</p>
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
                <div key={card.title} style={{ background: card.color, borderRadius: 12, padding: 24, boxShadow: "0 2px 8px rgba(146,77,172,0.06)", textAlign: "center" }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>{card.icon}</div>
                  <div style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>{card.title}</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: "#924DAC" }}>{card.count}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 32 }}>
              <p style={{ color: "#666", lineHeight: 1.6 }}>Manage your posts, orders, notifications, subscriptions, and settings from the sidebar menu.</p>
            </div>
          </div>
        );

      case "my-post-items":
        return (
          <div style={{ padding: 32 }}>
            {/* Delete confirm modal */}
            {deleteConfirm && (
              <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ background: "#fff", borderRadius: 16, padding: 36, maxWidth: 380, width: "100%", textAlign: "center", boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🗑️</div>
                  <h3 style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Delete this item?</h3>
                  <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>This cannot be undone.</p>
                  <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                    <button onClick={() => setDeleteConfirm(null)} style={{ background: "#f0f0f0", color: "#444", border: "none", borderRadius: 8, padding: "10px 24px", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                    <button onClick={() => handleDeleteItem(deleteConfirm)} disabled={deleting} style={{ background: "#e74c3c", color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontWeight: 700, cursor: "pointer" }}>
                      {deleting ? "Deleting..." : "Yes, Delete"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 22 }}>My Post Items</h2>
              {(!isSubscribed && totalEverPosted >= FREE_LIMIT) ? (
                <button
                  onClick={() => router.push("/profile#subscription")}
                  style={{ background: "#e53e3e", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontWeight: 600, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
                  🔒 Upgrade to Post More
                </button>
              ) : (
                <button onClick={() => router.push("/add-item")} style={{ background: "#924DAC", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>
                  + Add New Item
                </button>
              )}
            </div>

            {itemsLoading ? (
              <div style={{ textAlign: "center", padding: 40, color: "#924DAC" }}>Loading items...</div>
            ) : myItems.length === 0 ? (
              <div style={{ textAlign: "center", padding: 60, background: "#fff", borderRadius: 12, color: "#aaa" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>No items posted yet</div>
                {(!isSubscribed && totalEverPosted >= FREE_LIMIT) ? (
                  <div style={{ marginTop: 16, textAlign: "center" }}>
                    <div style={{ background: "#fff5f5", border: "1px solid #fed7d7", borderRadius: 10, padding: "16px 24px", marginBottom: 12 }}>
                      <div style={{ fontSize: 20, marginBottom: 6 }}>🔒</div>
                      <p style={{ color: "#c53030", fontWeight: 600, margin: 0, fontSize: 14 }}>
                        You've used all {FREE_LIMIT} free listings
                      </p>
                      <p style={{ color: "#888", fontSize: 13, marginTop: 4 }}>
                        Deleted items still count toward your free limit
                      </p>
                    </div>
                    <button
                      onClick={() => router.push("/profile#subscription")}
                      style={{ background: "#924DAC", color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontWeight: 600, cursor: "pointer" }}>
                      🚀 Upgrade for ₹99/year — Unlimited Posts
                    </button>
                  </div>
                ) : (
                  <button onClick={() => router.push("/add-item")} style={{ marginTop: 16, background: "#924DAC", color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontWeight: 600, cursor: "pointer" }}>Post Your First Item</button>
                )}
              </div>
            ) : (
              <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px rgba(146,77,172,0.06)", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f3eaff", color: "#924DAC" }}>
                      <th style={{ padding: 12, textAlign: "left", fontWeight: 700 }}>ITEM</th>
                      <th style={{ padding: 12, textAlign: "left", fontWeight: 700 }}>TYPE</th>
                      <th style={{ padding: 12, textAlign: "left", fontWeight: 700 }}>STATUS</th>
                      <th style={{ padding: 12, textAlign: "left", fontWeight: 700 }}>VIEWS</th>
                      <th style={{ padding: 12, textAlign: "left", fontWeight: 700 }}>LIKES</th>
                      <th style={{ padding: 12, textAlign: "left", fontWeight: 700 }}>POSTED DATE</th>
                      <th style={{ padding: 12, textAlign: "left", fontWeight: 700 }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myItems.map((item) => (
                      <tr key={item.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                        <td style={{ padding: 12, fontWeight: 600, maxWidth: 180 }}>
                          <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</div>
                        </td>
                        <td style={{ padding: 12 }}>
                          <span style={{ background: typeColor(item.type), padding: "4px 8px", borderRadius: 4, fontSize: 12, fontWeight: 600 }}>
                            {item.type}
                          </span>
                        </td>
                        <td style={{ padding: 12 }}>
                          <span style={{ background: item.status === "available" ? "#e7ffe7" : "#ffe7e7", padding: "4px 8px", borderRadius: 4, fontSize: 12, fontWeight: 600 }}>
                            {item.status}
                          </span>
                        </td>
                        <td style={{ padding: 12, color: "#666" }}>{item.views || 0}</td>
                        <td style={{ padding: 12, color: "#666" }}>{item.likes || 0}</td>
                        <td style={{ padding: 12, color: "#666", fontSize: 13 }}>{new Date(item.createdAt).toLocaleDateString()}</td>
                        <td style={{ padding: 12 }}>
                          <div style={{ display: "flex", gap: 6 }}>
                            {/* View button */}
                            <button
                              onClick={() => router.push(`/${item.type}/${item.id}`)}
                              style={{ background: "#924DAC", color: "#fff", border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 12, cursor: "pointer", fontWeight: 600 }}
                            >
                              👁 View
                            </button>
                            {/* Edit button */}
                            <button
                              onClick={() => router.push(`/add-item?edit=${item.id}`)}
                              style={{ background: "#f0e6fa", color: "#924DAC", border: "1.5px solid #924DAC", borderRadius: 6, padding: "6px 12px", fontSize: 12, cursor: "pointer", fontWeight: 600 }}
                            >
                              ✏️ Edit
                            </button>
                            {/* Delete button */}
                            <button
                              onClick={() => setDeleteConfirm(item.id)}
                              style={{ background: "#fff0f0", color: "#e74c3c", border: "1.5px solid #e74c3c", borderRadius: 6, padding: "6px 12px", fontSize: 12, cursor: "pointer", fontWeight: 600 }}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );

      case "order-history":
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Order History</h2>
            <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px rgba(146,77,172,0.06)", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
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
                  <tr><td colSpan={5} style={{ padding: 32, textAlign: "center", color: "#aaa" }}>No orders yet</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        );

      case "notification":
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Notification</h2>
            <div style={{ background: "#fff7e6", borderRadius: 8, padding: 18, color: "#b26a00", fontWeight: 500 }}>
              <span style={{ marginRight: 8 }}>🔔</span> You have no notifications.
            </div>
          </div>
        );

      case "subscription":
        return <SubscriptionSection subscription={subscription} />;

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
                      try { localStorage.setItem("userLocation", JSON.stringify(selectedLocation)); } catch (e) {}
                      alert("Location saved successfully!");
                    } catch (err) { alert("Failed to save location."); }
                  }}
                  style={{ marginTop: 16, padding: "10px 18px", borderRadius: 6, background: "#924DAC", color: "#fff", border: "none", cursor: "pointer", fontWeight: 600 }}
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
            <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px rgba(146,77,172,0.06)", padding: 24 }}>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", color: "#666", fontSize: 14, marginBottom: 8, fontWeight: 600 }}>Name</label>
                <input type="text" value={getUserDisplayName()} onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                  style={{ width: "100%", maxWidth: 400, padding: 12, borderRadius: 6, border: "1px solid #ddd", fontSize: 14, boxSizing: "border-box" }} />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", color: "#666", fontSize: 14, marginBottom: 8, fontWeight: 600 }}>Email</label>
                <input type="text" value={userProfile?.email || ""} readOnly
                  style={{ width: "100%", maxWidth: 400, padding: 12, borderRadius: 6, border: "1px solid #ddd", fontSize: 14, background: "#f9f9f9", boxSizing: "border-box" }} />
              </div>
              <button
                onClick={async () => {
                  try { await apiService.updateProfile(userProfile); alert("Profile updated!"); }
                  catch (err) { alert("Failed to update profile"); }
                }}
                style={{ padding: "10px 24px", borderRadius: 6, background: "#924DAC", color: "#fff", border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14 }}
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
    return <div style={{ padding: 32, textAlign: "center", color: "#924DAC", fontSize: 18 }}>Loading your profile...</div>;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f7f7f7", fontFamily: "sans-serif" }}>
      <Sidebar />
      <div style={{ flex: 1, overflowY: "auto" }}>{renderContent()}</div>
    </div>
  );
}
