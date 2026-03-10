"use client";
import { useState, useEffect } from "react";

export default function ReferralPage() {
  const [user, setUser] = useState<any>(null);
  const [referralCode, setReferralCode] = useState("");
  const [referrals, setReferrals] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [inputCode, setInputCode] = useState("");
  const [applyMsg, setApplyMsg] = useState("");
  const [applyLoading, setApplyLoading] = useState(false);

  const getToken = () => typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const token = getToken();
    if (!token) { setLoading(false); return; }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/referral/my`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        setReferralCode(data.referralCode || "");
        setReferrals(data.referrals || []);
        setUser(data.user || null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const referralLink = typeof window !== "undefined"
    ? `${window.location.origin}/register?ref=${referralCode}`
    : `https://sayonaraa.com/register?ref=${referralCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareWhatsApp = () => {
    const msg = encodeURIComponent(
      `🎁 Join me on Sayonara — India's best barter & resell app!\n\nUse my referral link and we BOTH get 1 month FREE Premium:\n${referralLink}\n\n✅ Sell, Exchange & Bid on items near you!\nsayonaraa.com`
    );
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  const applyReferral = async () => {
    const token = getToken();
    if (!token || !inputCode.trim()) return;
    setApplyLoading(true);
    setApplyMsg("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/referral/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ code: inputCode.trim().toUpperCase() })
      });
      const data = await res.json();
      if (res.ok) setApplyMsg("✅ " + (data.message || "Referral applied! You got 1 month free Premium!"));
      else setApplyMsg("❌ " + (data.error || "Invalid or already used code."));
    } catch {
      setApplyMsg("❌ Something went wrong. Try again.");
    } finally {
      setApplyLoading(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: 40 }}>⏳</div>
    </div>
  );

  if (!getToken()) return (
    <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 24 }}>
      <div style={{ fontSize: 60 }}>🎁</div>
      <h2 style={{ color: "#924DAC", fontWeight: 800, fontSize: "1.8rem", textAlign: "center" }}>Login to Access Referral Program</h2>
      <p style={{ color: "#666", textAlign: "center" }}>Refer friends and earn free Premium for both of you!</p>
      <a href="/?auth=login" style={{ background: "linear-gradient(135deg,#7F53AC,#647DEE)", color: "#fff", padding: "12px 32px", borderRadius: 50, fontWeight: 700, textDecoration: "none", fontSize: 16 }}>Login Now</a>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Nunito','Poppins',sans-serif", background: "#faf5ff", minHeight: "100vh", paddingBottom: 60 }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .ref-card { animation: fadeUp 0.5s ease forwards; }
        .share-btn { transition: transform 0.2s, box-shadow 0.2s; }
        .share-btn:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
      `}</style>

      {/* Hero Banner */}
      <div style={{
        background: "linear-gradient(135deg, #7F53AC 0%, #647DEE 100%)",
        padding: "56px 24px 80px", textAlign: "center", position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 250, height: 250, borderRadius: "50%", background: "rgba(255,255,255,0.07)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, left: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
        <div style={{ fontSize: 64, marginBottom: 16 }}>🎁</div>
        <h1 style={{ color: "#fff", fontSize: "clamp(1.8rem,5vw,2.8rem)", fontWeight: 900, margin: "0 0 12px", letterSpacing: -1 }}>
          Refer & Earn Free Premium!
        </h1>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "clamp(1rem,2.5vw,1.2rem)", maxWidth: 500, margin: "0 auto", lineHeight: 1.6 }}>
          Invite a friend to Sayonara — <strong>both of you</strong> get <strong>1 month FREE Premium</strong> when they sign up!
        </p>
      </div>

      <div style={{ maxWidth: 720, margin: "-40px auto 0", padding: "0 16px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* How it works */}
        <div className="ref-card" style={{ background: "#fff", borderRadius: 20, padding: "28px", boxShadow: "0 4px 24px rgba(127,83,172,0.10)", border: "1px solid #f0e6ff" }}>
          <h2 style={{ color: "#924DAC", fontWeight: 800, fontSize: "1.2rem", marginBottom: 20 }}>How It Works</h2>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {[
              { step: "1", icon: "🔗", title: "Share Your Link", desc: "Send your unique referral link to friends via WhatsApp, Instagram or anywhere!" },
              { step: "2", icon: "👤", title: "Friend Signs Up", desc: "Your friend registers on Sayonara using your referral link." },
              { step: "3", icon: "🎉", title: "Both Get Rewarded", desc: "You both instantly get 1 month FREE Premium — unlimited listings!" },
            ].map((s, i) => (
              <div key={i} style={{ flex: "1 1 180px", display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#7F53AC,#647DEE)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 18, flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14, color: "#1a0533", marginBottom: 4 }}>Step {s.step} — {s.title}</div>
                  <div style={{ fontSize: 13, color: "#666", lineHeight: 1.5 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Your referral link */}
        <div className="ref-card" style={{ background: "#fff", borderRadius: 20, padding: "28px", boxShadow: "0 4px 24px rgba(127,83,172,0.10)", border: "1px solid #f0e6ff", animationDelay: "0.1s" }}>
          <h2 style={{ color: "#924DAC", fontWeight: 800, fontSize: "1.2rem", marginBottom: 6 }}>Your Referral Link</h2>
          <p style={{ color: "#888", fontSize: 13, marginBottom: 16 }}>Share this link with friends — every successful signup earns you both 1 free month!</p>

          {/* Referral code badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 13, color: "#666", fontWeight: 600 }}>Your Code:</span>
            <span style={{ background: "linear-gradient(135deg,#7F53AC,#647DEE)", color: "#fff", fontWeight: 900, fontSize: 16, padding: "4px 16px", borderRadius: 50, letterSpacing: 2 }}>
              {referralCode || "Loading..."}
            </span>
          </div>

          {/* Link box */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            <input readOnly value={referralLink} style={{ flex: 1, minWidth: 200, padding: "12px 16px", border: "1.5px solid #e0d0f0", borderRadius: 12, fontSize: 13, color: "#924DAC", fontWeight: 600, background: "#faf5ff", outline: "none" }} />
            <button onClick={copyLink} className="share-btn" style={{ background: copied ? "#16a34a" : "linear-gradient(135deg,#7F53AC,#647DEE)", color: "#fff", border: "none", borderRadius: 12, padding: "12px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer", whiteSpace: "nowrap" }}>
              {copied ? "✅ Copied!" : "📋 Copy"}
            </button>
          </div>

          {/* Share buttons */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={shareWhatsApp} className="share-btn" style={{ flex: "1 1 140px", background: "#25D366", color: "#fff", border: "none", borderRadius: 12, padding: "12px 16px", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Share on WhatsApp
            </button>
            <button onClick={() => { const msg = encodeURIComponent(`Join Sayonara — India's best barter app! Use my link: ${referralLink}`); window.open(`https://www.instagram.com/`, "_blank"); }} className="share-btn"
              style={{ flex: "1 1 140px", background: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)", color: "#fff", border: "none", borderRadius: 12, padding: "12px 16px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              📸 Share on Instagram
            </button>
            <button onClick={() => { const msg = encodeURIComponent(`Join Sayonara — India's best barter app! Use my referral link: ${referralLink}`); window.open(`https://twitter.com/intent/tweet?text=${msg}`, "_blank"); }} className="share-btn"
              style={{ flex: "1 1 120px", background: "#1DA1F2", color: "#fff", border: "none", borderRadius: 12, padding: "12px 16px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              🐦 Tweet It
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="ref-card" style={{ display: "flex", gap: 16, flexWrap: "wrap", animationDelay: "0.2s" }}>
          {[
            { icon: "👥", label: "Friends Referred", value: referrals.length },
            { icon: "✅", label: "Successful Signups", value: referrals.filter((r: any) => r.status === "completed").length },
            { icon: "🎁", label: "Free Months Earned", value: referrals.filter((r: any) => r.status === "completed").length },
          ].map((stat, i) => (
            <div key={i} style={{ flex: "1 1 160px", background: "#fff", borderRadius: 16, padding: "24px 20px", textAlign: "center", boxShadow: "0 4px 16px rgba(127,83,172,0.08)", border: "1px solid #f0e6ff" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{stat.icon}</div>
              <div style={{ fontSize: "2rem", fontWeight: 900, color: "#924DAC" }}>{stat.value}</div>
              <div style={{ fontSize: 13, color: "#888", marginTop: 4, fontWeight: 600 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Apply a referral code */}
        <div className="ref-card" style={{ background: "#fff", borderRadius: 20, padding: "28px", boxShadow: "0 4px 24px rgba(127,83,172,0.10)", border: "1px solid #f0e6ff", animationDelay: "0.3s" }}>
          <h2 style={{ color: "#924DAC", fontWeight: 800, fontSize: "1.2rem", marginBottom: 6 }}>Have a Friend's Referral Code?</h2>
          <p style={{ color: "#888", fontSize: 13, marginBottom: 16 }}>Enter their code below — both of you get 1 month free Premium!</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input
              value={inputCode}
              onChange={e => setInputCode(e.target.value.toUpperCase())}
              placeholder="Enter referral code e.g. RAVI123"
              style={{ flex: 1, minWidth: 180, padding: "12px 16px", border: "1.5px solid #e0d0f0", borderRadius: 12, fontSize: 15, fontWeight: 700, letterSpacing: 2, outline: "none", color: "#924DAC" }}
            />
            <button onClick={applyReferral} disabled={applyLoading || !inputCode.trim()} style={{ background: "linear-gradient(135deg,#7F53AC,#647DEE)", color: "#fff", border: "none", borderRadius: 12, padding: "12px 24px", fontWeight: 700, fontSize: 14, cursor: "pointer", opacity: !inputCode.trim() ? 0.6 : 1 }}>
              {applyLoading ? "Applying..." : "Apply Code 🎁"}
            </button>
          </div>
          {applyMsg && (
            <div style={{ marginTop: 12, padding: "10px 16px", borderRadius: 10, background: applyMsg.startsWith("✅") ? "#f0fff4" : "#fff5f5", color: applyMsg.startsWith("✅") ? "#16a34a" : "#e53e3e", fontWeight: 600, fontSize: 14 }}>
              {applyMsg}
            </div>
          )}
        </div>

        {/* Referral history */}
        {referrals.length > 0 && (
          <div className="ref-card" style={{ background: "#fff", borderRadius: 20, padding: "28px", boxShadow: "0 4px 24px rgba(127,83,172,0.10)", border: "1px solid #f0e6ff", animationDelay: "0.4s" }}>
            <h2 style={{ color: "#924DAC", fontWeight: 800, fontSize: "1.2rem", marginBottom: 16 }}>Your Referral History</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {referrals.map((r: any, i: number) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "#faf5ff", borderRadius: 12, gap: 12, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#7F53AC,#647DEE)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13 }}>
                      {(r.name || r.email || "?")[0].toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#1a0533" }}>{r.name || r.email}</div>
                      <div style={{ fontSize: 12, color: "#888" }}>{new Date(r.createdAt).toLocaleDateString("en-IN")}</div>
                    </div>
                  </div>
                  <span style={{
                    background: r.status === "completed" ? "#f0fff4" : "#fffbeb",
                    color: r.status === "completed" ? "#16a34a" : "#d97706",
                    fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 50,
                  }}>
                    {r.status === "completed" ? "✅ Rewarded" : "⏳ Pending"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}