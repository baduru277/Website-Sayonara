"use client";

import { useState } from "react";

export default function LoginPage() {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(`${tab === "login" ? "Login" : "Signup"} form submitted!`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f9fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Quicksand, Montserrat, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 370,
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 4px 24px rgba(146,77,172,0.08)",
          padding: "32px 28px",
        }}
      >
        {/* Tabs */}
        <div
          style={{
            display: "flex",
            borderBottom: "2px solid #f3eaff",
            marginBottom: 28,
          }}
        >
          {["login", "signup"].map((type) => (
            <button
              key={type}
              style={{
                flex: 1,
                background: "none",
                border: "none",
                borderBottom:
                  tab === type ? "3px solid #924DAC" : "3px solid transparent",
                color: tab === type ? "#924DAC" : "#888",
                fontWeight: 700,
                fontSize: 18,
                padding: "8px 0",
                cursor: "pointer",
                transition: "color 0.2s, border 0.2s",
              }}
              onClick={() => setTab(type as "login" | "signup")}
            >
              {type === "login" ? "Log In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div
            style={{
              color: "red",
              background: "#fee",
              padding: "8px",
              borderRadius: 4,
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label
              style={{
                fontWeight: 600,
                color: "#444",
                fontSize: 15,
                display: "block",
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              required
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "2px solid #f3eaff",
                borderRadius: 8,
                fontSize: 16,
                marginTop: 6,
                outline: "none",
                color: "#924DAC",
                background: "#faf8fd",
              }}
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label
              style={{
                fontWeight: 600,
                color: "#444",
                fontSize: 15,
                display: "block",
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder={
                  tab === "login" ? "Enter your password" : "Create a password"
                }
                required
                style={{
                  width: "100%",
                  padding: "12px 44px 12px 14px",
                  border: "2px solid #f3eaff",
                  borderRadius: 8,
                  fontSize: 16,
                  marginTop: 6,
                  outline: "none",
                  color: "#924DAC",
                  background: "#faf8fd",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#924DAC",
                }}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              marginTop: 18,
              background: "#924DAC",
              color: "white",
              border: "none",
              padding: "14px",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 18,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {tab === "login" ? "SIGN IN" : "SIGN UP"}
          </button>
        </form>
      </div>
    </div>
  );
}