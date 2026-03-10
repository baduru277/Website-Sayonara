"use client";
import { useState, useEffect } from "react";

const FAKE_ACTIVITY = [
  { name: "Ravi K.", city: "Hyderabad", action: "just sold", item: "iPhone 13 Pro", price: "₹42,000", avatar: "RK", color: "#7F53AC" },
  { name: "Priya M.", city: "Vijayawada", action: "won a bid on", item: "Sony Headphones", price: "₹3,200", avatar: "PM", color: "#E91E8C" },
  { name: "Arjun S.", city: "Bangalore", action: "exchanged", item: "PS5 Controller", price: "", avatar: "AS", color: "#00BCD4" },
  { name: "Lakshmi T.", city: "Chennai", action: "listed", item: "Vintage Watch", price: "₹8,500", avatar: "LT", color: "#FF6B35" },
  { name: "Kiran B.", city: "Pune", action: "just sold", item: "Dell Laptop", price: "₹35,000", avatar: "KB", color: "#4CAF50" },
  { name: "Sneha R.", city: "Visakhapatnam", action: "won a bid on", item: "Canon Camera", price: "₹12,000", avatar: "SR", color: "#9C27B0" },
  { name: "Aditya N.", city: "Mumbai", action: "exchanged", item: "Gaming Chair", price: "", avatar: "AN", color: "#FF5722" },
  { name: "Divya P.", city: "Tirupati", action: "listed", item: "Gold Earrings", price: "₹6,000", avatar: "DP", color: "#2196F3" },
  { name: "Suresh V.", city: "Nellore", action: "just sold", item: "Hero Cycle", price: "₹4,500", avatar: "SV", color: "#009688" },
  { name: "Meera G.", city: "Guntur", action: "won a bid on", item: "Air Purifier", price: "₹5,800", avatar: "MG", color: "#F44336" },
  { name: "Vikram R.", city: "Warangal", action: "just sold", item: "Samsung TV 55\"", price: "₹38,000", avatar: "VR", color: "#7F53AC" },
  { name: "Ananya K.", city: "Kochi", action: "listed", item: "Silk Saree", price: "₹4,200", avatar: "AK", color: "#E91E8C" },
];

export default function ActivityToast() {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(FAKE_ACTIVITY[0]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Show first toast after 3 seconds
    const initial = setTimeout(() => {
      setCurrent(FAKE_ACTIVITY[0]);
      setVisible(true);
      setTimeout(() => setVisible(false), 4500);
    }, 3000);

    // Then show every 7 seconds
    const interval = setInterval(() => {
      setIndex(i => {
        const next = (i + 1) % FAKE_ACTIVITY.length;
        setCurrent(FAKE_ACTIVITY[next]);
        setVisible(true);
        setTimeout(() => setVisible(false), 4500);
        return next;
      });
    }, 7000);

    return () => { clearTimeout(initial); clearInterval(interval); };
  }, []);

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes toastSlideIn {
          from { transform: translateX(-110%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes toastSlideOut {
          from { transform: translateX(0);    opacity: 1; }
          to   { transform: translateX(-110%); opacity: 0; }
        }
        .toast-box {
          animation: toastSlideIn 0.45s cubic-bezier(.17,.67,.35,1.2) forwards;
        }
      `}</style>
      <div
        className="toast-box"
        style={{
          position: "fixed", bottom: 28, left: 24, zIndex: 9999,
          background: "#fff", borderRadius: 18, padding: "14px 18px",
          boxShadow: "0 8px 40px rgba(127,83,172,0.18)",
          border: "1.5px solid #f0e6ff",
          display: "flex", alignItems: "center", gap: 12,
          maxWidth: 320, minWidth: 260,
        }}
      >
        {/* Avatar */}
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          background: `linear-gradient(135deg, ${current.color}, ${current.color}99)`,
          color: "#fff", display: "flex", alignItems: "center",
          justifyContent: "center", fontWeight: 800, fontSize: 14, flexShrink: 0,
          boxShadow: `0 4px 12px ${current.color}44`,
        }}>
          {current.avatar}
        </div>

        {/* Text */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1a0533" }}>
            {current.name}{" "}
            <span style={{ color: "#888", fontWeight: 500 }}>from {current.city}</span>
          </div>
          <div style={{ fontSize: 12, color: "#555", marginTop: 3, lineHeight: 1.4 }}>
            {current.action}{" "}
            <strong style={{ color: current.color }}>{current.item}</strong>
            {current.price && (
              <span style={{ color: "#16a34a", fontWeight: 700 }}> {current.price}</span>
            )}
          </div>
        </div>

        {/* Close */}
        <button
          onClick={() => setVisible(false)}
          style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer", fontSize: 18, padding: 0, flexShrink: 0 }}
        >×</button>

        {/* Progress bar */}
        <div style={{
          position: "absolute", bottom: 0, left: 0,
          height: 3, background: `linear-gradient(90deg, ${current.color}, ${current.color}66)`,
          borderRadius: "0 0 18px 18px",
          animation: "progressBar 4.5s linear forwards",
          width: "100%",
        }} />
        <style>{`
          @keyframes progressBar { from { width: 100%; } to { width: 0%; } }
        `}</style>
      </div>
    </>
  );
}
