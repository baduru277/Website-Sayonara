"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import apiService from "../../services/api"; // Assuming the path is correct

// List of Indian States for the dropdown
const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "signup">("signup");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // New state for confirm password visibility
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // 🔑 NEW STATE
  const [name, setName] = useState("");
  const [state, setState] = useState(""); // 🔑 NEW STATE (for Indian States)

  // NOTE: registrationComplete state is removed since verification is removed.

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (tab === "login") {
        // LOGIN
        const response = await apiService.login({ email, password });
        
        if (response.token) {
          // Store token and user
          if (typeof window !== "undefined") {
            localStorage.setItem("token", response.token);
            localStorage.setItem("user", JSON.stringify(response.user));
          }
          
          setSuccessMsg("Login successful! Redirecting to dashboard...");
          
          setTimeout(() => {
            router.push("/dashboard");
          }, 1500);
        }
      } else {
        // SIGNUP 🔑 ADDING CLIENT-SIDE VALIDATION FOR PASSWORD MATCH
        if (password !== confirmPassword) {
          setErrorMsg("Passwords do not match.");
          setLoading(false);
          return;
        }

        // Include 'state' in the register call
        const response = await apiService.register({ name, email, password, location: state });
        
        if (response.token) {
          // 🔑 NEW: Store token and user immediately after successful registration
          if (typeof window !== "undefined") {
            localStorage.setItem("token", response.token);
            localStorage.setItem("user", JSON.stringify(response.user));
          }
          
          setSuccessMsg("Account created successfully! Redirecting to dashboard...");
          
          // Clear form fields after successful registration
          setName("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          setState("");

          // Redirect to dashboard immediately
          setTimeout(() => {
            router.push("/dashboard");
          }, 1500);
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      
      let errorMessage = "An error occurred. Please try again.";
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.error) {
        errorMessage = error.error;
      }
      
      setErrorMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (newTab: "login" | "signup") => {
    setTab(newTab);
    setErrorMsg(null);
    setSuccessMsg(null);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
    setState("");
  };

  return (
    <div
      style={{
        // ... (existing styles for full screen container)
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #e8eaf6 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Quicksand, Montserrat, sans-serif",
        padding: "20px",
      }}
    >
      <div
        style={{
          // ... (existing styles for form card)
          width: "100%",
          maxWidth: 420,
          background: "#fff",
          borderRadius: 20,
          boxShadow: "0 8px 32px rgba(146,77,172,0.15)",
          padding: "40px 32px",
          position: "relative",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#924DAC",
              margin: 0,
              marginBottom: 8,
            }}
          >
            Sayonara
          </h1>
          <p style={{ fontSize: 14, color: "#888", margin: 0 }}>
            {tab === "login" ? "Welcome back!" : "Create your account"}
          </p>
        </div>

        {/* Tabs */}
        <div
          style={{
            // ... (existing tab styles)
            display: "flex",
            background: "#f8f5fc",
            borderRadius: 12,
            padding: 4,
            marginBottom: 28,
          }}
        >
          {["login", "signup"].map((type) => (
            <button
              key={type}
              style={{
                // ... (existing tab button styles)
                flex: 1,
                background: tab === type ? "#924DAC" : "transparent",
                color: tab === type ? "#fff" : "#888",
                border: "none",
                fontWeight: 700,
                fontSize: 16,
                padding: "10px 0",
                borderRadius: 8,
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onClick={() => switchTab(type as "login" | "signup")}
            >
              {type === "login" ? "Log In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Success Message */}
        {successMsg && (
          <div
            style={{
              // ... (existing success message styles)
              color: "#2ecc40",
              background: "#e8f8e8",
              padding: "14px",
              borderRadius: 10,
              marginBottom: 20,
              textAlign: "center",
              fontWeight: 600,
              border: "2px solid #2ecc40",
            }}
          >
            <span style={{ fontSize: 20, marginRight: 8 }}>✓</span>
            {successMsg}
          </div>
        )}

        {/* Error Message */}
        {errorMsg && (
          <div
            style={{
              // ... (existing error message styles)
              color: "#e74c3c",
              background: "#ffe6e6",
              padding: "14px",
              borderRadius: 10,
              marginBottom: 20,
              textAlign: "center",
              fontWeight: 600,
              border: "2px solid #e74c3c",
            }}
          >
            <span style={{ fontSize: 20, marginRight: 8 }}>✕</span>
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Name field (signup only) */}
          {tab === "signup" && (
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  // ... (label styles)
                  fontWeight: 600,
                  color: "#444",
                  fontSize: 14,
                  display: "block",
                  marginBottom: 8,
                }}
              >
                Full Name <span style={{ color: "#e74c3c" }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  // ... (input styles)
                  width: "100%",
                  padding: "14px 16px",
                  border: "2px solid #e8e8e8",
                  borderRadius: 10,
                  fontSize: 15,
                  outline: "none",
                  color: "#333",
                  background: "#fafafa",
                  boxSizing: "border-box",
                }}
              />
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                // ... (label styles)
                fontWeight: 600,
                color: "#444",
                fontSize: 14,
                display: "block",
                marginBottom: 8,
              }}
            >
              Email Address <span style={{ color: "#e74c3c" }}>*</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                // ... (input styles)
                width: "100%",
                padding: "14px 16px",
                border: "2px solid #e8e8e8",
                borderRadius: 10,
                fontSize: 15,
                outline: "none",
                color: "#333",
                background: "#fafafa",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                // ... (label styles)
                fontWeight: 600,
                color: "#444",
                fontSize: 14,
                display: "block",
                marginBottom: 8,
              }}
            >
              Password <span style={{ color: "#e74c3c" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder={
                  tab === "login"
                    ? "Enter your password"
                    : "Create a strong password"
                }
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  // ... (input styles)
                  width: "100%",
                  padding: "14px 50px 14px 16px",
                  border: "2px solid #e8e8e8",
                  borderRadius: 10,
                  fontSize: 15,
                  outline: "none",
                  color: "#333",
                  background: "#fafafa",
                  boxSizing: "border-box",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  // ... (show/hide button styles)
                  position: "absolute",
                  right: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 20,
                  padding: 4,
                }}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Confirm Password (signup only) 🔑 NEW FIELD */}
          {tab === "signup" && (
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  fontWeight: 600,
                  color: "#444",
                  fontSize: 14,
                  display: "block",
                  marginBottom: 8,
                }}
              >
                Confirm Password <span style={{ color: "#e74c3c" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "14px 50px 14px 16px",
                    border: "2px solid #e8e8e8",
                    borderRadius: 10,
                    fontSize: 15,
                    outline: "none",
                    color: "#333",
                    background: "#fafafa",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: "absolute",
                    right: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 20,
                    padding: 4,
                  }}
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
          )}

          {/* Indian State Dropdown (signup only) 🔑 NEW FIELD */}
          {tab === "signup" && (
            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  fontWeight: 600,
                  color: "#444",
                  fontSize: 14,
                  display: "block",
                  marginBottom: 8,
                }}
              >
                State/Region <span style={{ color: "#e74c3c" }}>*</span>
              </label>
              <select
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  border: "2px solid #e8e8e8",
                  borderRadius: 10,
                  fontSize: 15,
                  outline: "none",
                  color: state === "" ? "#888" : "#333",
                  background: "#fafafa",
                  boxSizing: "border-box",
                  appearance: "none", // Remove default arrow
                  backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path fill='gray' d='M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z'/></svg>\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 10px top 50%",
                  paddingRight: "40px",
                }}
              >
                <option value="" disabled>Select your state</option>
                {indianStates.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )}


          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              // ... (existing button styles)
              width: "100%",
              background: loading
                ? "#ccc"
                : "linear-gradient(135deg, #924DAC 0%, #b06ac9 100%)",
              color: "white",
              border: "none",
              padding: "16px",
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 16,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading
                ? "none"
                : "0 4px 12px rgba(146,77,172,0.3)",
              transition: "all 0.3s ease",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {loading ? (
              <span>
                <span
                  style={{
                    display: "inline-block",
                    marginRight: 8,
                  }}
                >
                  ⏳
                </span>
                Processing...
              </span>
            ) : tab === "login" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Footer */}
        <div
          style={{
            // ... (existing footer styles)
            marginTop: 24,
            textAlign: "center",
            fontSize: 13,
            color: "#888",
          }}
        >
          {tab === "login" ? (
            <p>
              Don't have an account?{" "}
              <button
                onClick={() => switchTab("signup")}
                style={{
                  // ... (link button styles)
                  color: "#924DAC",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                  textDecoration: "underline",
                }}
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                onClick={() => switchTab("login")}
                style={{
                  // ... (link button styles)
                  color: "#924DAC",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                  textDecoration: "underline",
                }}
              >
                Log in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
