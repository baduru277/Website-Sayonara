"use client";
import { useState, useEffect, useRef } from "react";

const STATS = [
  { label: "Active Users", value: 12847, suffix: "+", icon: "👥" },
  { label: "Items Traded", value: 48293, suffix: "+", icon: "🔄" },
  { label: "Cities Covered", value: 284, suffix: "", icon: "📍" },
  { label: "Happy Traders", value: 9621, suffix: "+", icon: "⭐" },
];

function Counter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting && !started) setStarted(true); }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);
  useEffect(() => {
    if (!started) return;
    let n = 0; const step = target / (2000 / 16);
    const t = setInterval(() => { n += step; if (n >= target) { setCount(target); clearInterval(t); } else setCount(Math.floor(n)); }, 16);
    return () => clearInterval(t);
  }, [started, target]);
  return <span ref={ref}>{count.toLocaleString("en-IN")}</span>;
}

export default function StatsSection() {
  const [live, setLive] = useState(247);
  useEffect(() => {
    const t = setInterval(() => setLive(n => Math.max(230, Math.min(280, n + Math.floor(Math.random() * 5) - 2))), 2500);
    return () => clearInterval(t);
  }, []);
  return (
    <section style={{ background: "linear-gradient(135deg, #7F53AC 0%, #647DEE 100%)", padding: "64px 24px", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.15)", borderRadius: 50, padding: "7px 20px", marginBottom: 16 }}>
            <span style={{ width: 9, height: 9, background: "#22c55e", borderRadius: "50%", display: "inline-block" }} />
            <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>{live} people online right now</span>
          </div>
          <h2 style={{ color: "#fff", fontSize: "clamp(1.6rem,4vw,2.2rem)", fontWeight: 800, margin: 0 }}>Sayonara by the Numbers</h2>
          <p style={{ color: "rgba(255,255,255,0.7)", marginTop: 8, fontSize: 15 }}>Real trading activity happening across India</p>
        </div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ flex: "1 1 180px", maxWidth: 220, background: "rgba(255,255,255,0.12)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 20, padding: "32px 20px", textAlign: "center", transition: "transform 0.3s" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-6px)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "")}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>{s.icon}</div>
              <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#fff", letterSpacing: -1 }}><Counter target={s.value} />{s.suffix}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", marginTop: 8, fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
