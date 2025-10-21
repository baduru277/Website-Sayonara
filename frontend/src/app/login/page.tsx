"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import apiService from "../../services/api";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (tab === "login") {
        const response = await apiService.login({ email, password });
        setSuccessMsg("Login successful! Redirecting...");
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(response.user));
        }
        setTimeout(() => router.push("/"), 1000);
      } else {
        const response = await apiService.register({ name, email, password });
        setSuccessMsg("Account created successfully! Redirecting...");
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(response.user));
        }
        setTimeout(() => router.push("/"), 1000);
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      setErrorMsg(error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Quicksand, Montserrat, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 370, background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px rgba(146,77,172,0.08)", padding: "32px 28px" }}>
        <div style={{ display: "flex", borderBottom: "2px solid #f3eaff", marginBottom: 28 }}>
          {["login", "signup"].map((type) => (
            <button
              key={type}
              style={{ flex: 1, background: "none", border: "none", borderBottom: tab === type ? "3px solid #924DAC" : "3px solid transparent", color: tab === type ? "#924DAC" : "#888", fontWeight: 700, fontSize: 18, padding: "8px 0", cursor: "pointer", transition: "color 0.2s, border 0.2s" }}
              onClick={() => { setTab(type as "login" | "signup"); setErrorMsg(null); setSuccessMsg(null); }}
            >
              {type === "login" ? "Log In" : "Sign Up"}
            </button>
          ))}
        </div>

        {successMsg && (
          <div style={{ color: "#2ecc40", background: "#e8f8e8", padding: "10px", borderRadius: 6, marginBottom: 16, textAlign: "center", fontWeight: 600 }}>
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div style={{ color: "#e74c3c", background: "#fee", padding: "10px", borderRadius: 6, marginBottom: 16, textAlign: "center", fontWeight: 600 }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {tab === "signup" && (
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontWeight: 600, color: "#444", fontSize: 15, display: "block" }}>Full Name</label>
              <input type="text" placeholder="Enter your name" required value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", padding: "12px 14px", border: "2px solid #f3eaff", borderRadius: 8, fontSize: 16, marginTop: 6, outline: "none", color: "#924DAC", background: "#faf8fd" }} />
            </div>
          )}

          <div style={{ marginBottom: 18 }}>
            <label style={{ fontWeight: 600, color: "#444", fontSize: 15, display: "block" }}>Email Address</label>
            <input type="email" placeholder="Enter your email" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: "12px 14px", border: "2px solid #f3eaff", borderRadius: 8, fontSize: 16, marginTop: 6, outline: "none", color: "#924DAC", background: "#faf8fd" }} />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ fontWeight: 600, color: "#444", fontSize: 15, display: "block" }}>Password</label>
            <div style={{ position: "relative" }}>
              <input type={showPassword ? "text" : "password"} placeholder={tab === "login" ? "Enter your password" : "Create a password"} required value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", padding: "12px 44px 12px 14px", border: "2px solid #f3eaff", borderRadius: 8, fontSize: 16, marginTop: 6, outline: "none", color: "#924DAC", background: "#faf8fd" }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#924DAC" }}>
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{ width: "100%", marginTop: 18, background: "#924DAC", color: "white", border: "none", padding: "14px", borderRadius: 8, fontWeight: 700, fontSize: 18, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}>
            {loading ? "Please wait..." : tab === "login" ? "SIGN IN" : "SIGN UP"}
          </button>
        </form>
      </div>
    </div>
  );
}
