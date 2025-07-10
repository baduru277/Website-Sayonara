"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const sidebarItems = [
  { key: "dashboard", label: "Dashboard" },
  { key: "order-history", label: "Order History" },
  { key: "notification", label: "Notification" },
  { key: "subscription", label: "Subscription" },
  { key: "setting", label: "Setting" },
  { key: "logout", label: "Log-out" },
];

export default function DashboardPage() {
  const [selected, setSelected] = useState("dashboard");
  const router = useRouter();

  // Handle logout
  const handleLogout = () => {
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

  // Main content for each section
  const renderContent = () => {
    switch (selected) {
      case "dashboard":
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 28 }}>Welcome to your Dashboard!</h2>
            <p style={{ color: "#444", marginTop: 12 }}>Here you can manage your orders, notifications, subscriptions, and settings.</p>
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
                {[1,2,3,4,5].map((i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: 12 }}>#9654{i}761</td>
                    <td style={{ padding: 12, color: i%3===0 ? "#e74c3c" : i%2===0 ? "#27ae60" : "#f39c12" }}>
                      {i%3===0 ? "CANCELED" : i%2===0 ? "COMPLETED" : "IN PROGRESS"}
                    </td>
                    <td style={{ padding: 12 }}>Dec 30, 2024 07:52</td>
                    <td style={{ padding: 12 }}>₹{i*80} ({i+4} Products)</td>
                    <td style={{ padding: 12 }}><button className="sayonara-btn" style={{ fontSize: 14, padding: "6px 18px" }}>View Details →</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "notification":
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Notification</h2>
            {[1,2,3].map((i) => (
              <div key={i} style={{ background: "#fff7e6", borderRadius: 8, padding: 18, marginBottom: 14, color: "#b26a00", fontWeight: 500 }}>
                <span style={{ marginRight: 8 }}>🔔</span> New listing submitted by [User Name] – MacBook Pro 2020. Awaiting review.
                <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>Requested 30 minutes ago</div>
              </div>
            ))}
          </div>
        );
      case "subscription":
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Set Subscription Plans</h2>
            <div style={{ display: "flex", gap: 24 }}>
              {[
                { name: "Basic Plan", price: 99, desc: "Basic features for casual users.", color: "#f3eaff" },
                { name: "Standard Plan", price: 299, desc: "Standard features for regular users.", color: "#eafff3" },
                { name: "Premium Plan", price: 499, desc: "All features for power users.", color: "#fff3ea" },
              ].map((plan, idx) => (
                <div key={plan.name} style={{ background: plan.color, borderRadius: 12, boxShadow: "0 2px 8px rgba(146,77,172,0.04)", padding: 28, minWidth: 220 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#924DAC", marginBottom: 8 }}>{plan.name}</div>
                  <div style={{ color: "#444", marginBottom: 12 }}>{plan.desc}</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: "#222" }}>₹{plan.price}</div>
                  <div style={{ color: "#888", fontSize: 14 }}>per month</div>
                </div>
              ))}
            </div>
          </div>
        );
      case "setting":
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ color: "#924DAC", fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Setting</h2>
            <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(146,77,172,0.04)", padding: 28, minWidth: 320 }}>
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontWeight: 600, color: "#444" }}>Language</div>
                <select style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #eee", marginTop: 6 }}>
                  <option>English</option>
                  <option>Hindi</option>
                </select>
              </div>
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontWeight: 600, color: "#444" }}>Message Notification</div>
                <input type="checkbox" checked readOnly style={{ marginLeft: 8 }} />
              </div>
              <div>
                <div style={{ fontWeight: 600, color: "#444" }}>Email Notifications</div>
                <input type="checkbox" checked readOnly style={{ marginLeft: 8 }} />
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
      {/* Header */}
      <div style={{ background: "#924DAC", padding: "24px 0 16px 0", color: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontWeight: 700, fontSize: 28, letterSpacing: 1 }}>Logo</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <input type="text" placeholder="Search Here" style={{ padding: "10px 18px", borderRadius: 8, border: "none", fontSize: 16, width: 260, color: "#924DAC" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontWeight: 600 }}>Mahi Sharma</div>
              <div style={{ fontSize: 13, color: "#eee" }}>mahisharma@gmail.com</div>
              <div style={{ width: 36, height: 36, background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#924DAC", fontWeight: 700, fontSize: 18 }}>M</div>
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