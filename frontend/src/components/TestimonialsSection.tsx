"use client";
import { useState, useEffect } from "react";

const TESTIMONIALS = [
  { name: "Ravi Kumar", city: "Hyderabad", text: "Sold my old phone within 2 days! Got ₹42,000 instantly.", rating: 5, avatar: "RK", color: "#7F53AC", tag: "Resell" },
  { name: "Priya Sharma", city: "Bangalore", text: "Exchanged my textbooks for a laptop bag — zero money spent!", rating: 5, avatar: "PS", color: "#E91E8C", tag: "Exchange" },
  { name: "Arjun Nair", city: "Chennai", text: "Won a PS5 controller for just ₹2,800 in auction. Best deal ever!", rating: 5, avatar: "AN", color: "#00BCD4", tag: "Bidding" },
  { name: "Divya Reddy", city: "Vijayawada", text: "Simple, safe and trustworthy. Listed my saree, got a buyer same day!", rating: 5, avatar: "DR", color: "#FF6B35", tag: "Resell" },
  { name: "Suresh Varma", city: "Visakhapatnam", text: "Exchanged my old cycle for gym equipment. Amazing feature!", rating: 5, avatar: "SV", color: "#4CAF50", tag: "Exchange" },
  { name: "Meera Goud", city: "Guntur", text: "Bid on an air purifier and won it ₹3,000 cheaper than retail!", rating: 5, avatar: "MG", color: "#9C27B0", tag: "Bidding" },
];

const TAG_COLORS: Record<string, { bg: string; color: string }> = {
  Resell: { bg: "#f0f4ff", color: "#3b82f6" },
  Exchange: { bg: "#f0fff4", color: "#16a34a" },
  Bidding: { bg: "#fff5f5", color: "#e53e3e" },
};

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(t);
  }, []);
  return (
    <section style={{ padding: "72px 24px", background: "linear-gradient(160deg, #1a0533 0%, #2d1060 60%, #4a1080 100%)", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ color: "#fff", fontSize: "clamp(1.6rem,4vw,2.2rem)", fontWeight: 800 }}>What Traders Say 💬</h2>
          <p style={{ color: "rgba(255,255,255,0.6)", marginTop: 8, fontSize: 15 }}>Thousands of happy users across India</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, marginBottom: 36 }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} onClick={() => setActive(i)} style={{
              background: i === active ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.07)",
              backdropFilter: "blur(16px)",
              border: `1.5px solid ${i === active ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.1)"}`,
              borderRadius: 20, padding: "24px", cursor: "pointer",
              transition: "all 0.35s", transform: i === active ? "translateY(-6px) scale(1.02)" : "none",
            }}>
              <div style={{ marginBottom: 12 }}>
                <span style={{ background: TAG_COLORS[t.tag].bg, color: TAG_COLORS[t.tag].color, fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 50 }}>{t.tag}</span>
              </div>
              <div style={{ color: "#f9d423", fontSize: 16, marginBottom: 10 }}>{"★".repeat(t.rating)}</div>
              <p style={{ color: "rgba(255,255,255,0.88)", fontSize: 14, lineHeight: 1.7, marginBottom: 20, fontStyle: "italic" }}>"{t.text}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: t.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13 }}>{t.avatar}</div>
                <div>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>📍 {t.city}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
          {TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={() => setActive(i)} style={{ width: i === active ? 24 : 8, height: 8, borderRadius: 99, background: i === active ? "#fff" : "rgba(255,255,255,0.3)", border: "none", cursor: "pointer", transition: "all 0.3s", padding: 0 }} />
          ))}
        </div>
      </div>
    </section>
  );
}
