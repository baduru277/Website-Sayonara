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
  const [registrationComplete, setRegistrationComplete] = useState(false);

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
        // Login
        const response = await apiService.login({ email, password });
        setSuccessMsg("Login successful! Redirecting to dashboard...");
        
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(response.user));
          localStorage.setItem("token", response.token);
        }
        
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        // Signup
        const response = await apiService.register({ name, email, password });
        
        // Show registration success
        setRegistrationComplete(true);
        setSuccessMsg("Thank you for signing up! Registration successful. Please log in to continue.");
        
        // Clear signup form
        setName("");
        setPassword("");
        
        // Switch to login tab after 3 seconds
        setTimeout(() => {
          setTab("login");
          setRegistrationComplete(false);
          setSuccessMsg("Please log in with your credentials");
        }, 3000);
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      setErrorMsg(error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #f5f7fa 0%, #e8eaf6 100%)", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      fontFamily: "Quicksand, Montserrat, sans-serif",
      padding: "20px"
    }}>
      <div style={{ 
        width: "100%", 
        maxWidth: 420, 
        background: "#fff", 
        borderRadius: 20, 
        boxShadow: "0 8px 32px rgba(146,77,172,0.15)", 
        padding: "40px 32px",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Header with Logo/Title */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{ 
            fontSize: 28, 
            fontWeight: 800, 
            color: "#924DAC", 
            margin: 0,
            marginBottom: 8
          }}>
            Sayonara
          </h1>
          <p style={{ 
            fontSize: 14, 
            color: "#888", 
            margin: 0 
          }}>
            {tab === "login" ? "Welcome back!" : "Create your account"}
          </p>
        </div>

        {/* Tabs */}
        <div style={{ 
          display: "flex", 
          background: "#f8f5fc",
          borderRadius: 12,
          padding: 4,
          marginBottom: 28 
        }}>
          {["login", "signup"].map((type) => (
            <button
              key={type}
              disabled={registrationComplete}
              style={{ 
                flex: 1, 
                background: tab === type ? "#924DAC" : "transparent",
                color: tab === type ? "#fff" : "#888",
                border: "none",
                fontWeight: 700, 
                fontSize: 16, 
                padding: "10px 0",
                borderRadius: 8,
                cursor: registrationComplete ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                opacity: registrationComplete ? 0.5 : 1
              }}
              onClick={() => { 
                if (!registrationComplete) {
                  setTab(type as "login" | "signup"); 
                  setErrorMsg(null); 
                  setSuccessMsg(null);
                  setEmail("");
                  setPassword("");
                  setName("");
                }
              }}
            >
              {type === "login" ? "Log In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Registration Complete Success */}
        {registrationComplete && (
          <div style={{ 
            background: "linear-gradient(135deg, #2ecc40 0%, #27ae60 100%)",
            color: "white",
            padding: "24px",
            borderRadius: 12,
            marginBottom: 24,
            textAlign: "center",
            animation: "slideIn 0.5s ease"
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✓</div>
            <h3 style={{ margin: 0, marginBottom: 8, fontSize: 18 }}>
              Thank You for Signing Up!
            </h3>
            <p style={{ margin: 0, fontSize: 14, opacity: 0.95 }}>
              Registration successful. Redirecting to login...
            </p>
          </div>
        )}

        {/* Success Message */}
        {successMsg && !registrationComplete && (
          <div style={{ 
            color: "#2ecc40", 
            background: "#e8f8e8", 
            padding: "14px", 
            borderRadius: 10, 
            marginBottom: 20, 
            textAlign: "center", 
            fontWeight: 600,
            border: "2px solid #2ecc40",
            animation: "fadeIn 0.3s ease"
          }}>
            <span style={{ fontSize: 20, marginRight: 8 }}>✓</span>
            {successMsg}
          </div>
        )}

        {/* Error Message */}
        {errorMsg && (
          <div style={{ 
            color: "#e74c3c", 
            background: "#ffe6e6", 
            padding: "14px", 
            borderRadius: 10, 
            marginBottom: 20, 
            textAlign: "center", 
            fontWeight: 600,
            border: "2px solid #e74c3c",
            animation: "shake 0.5s ease"
          }}>
            <span style={{ fontSize: 20, marginRight: 8 }}>✕</span>
            {errorMsg}
          </div>
        )}

        {/* Form */}
        {!registrationComplete && (
          <form onSubmit={handleSubmit}>
            {tab === "signup" && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ 
                  fontWeight: 600, 
                  color: "#444", 
                  fontSize: 14, 
                  display: "block",
                  marginBottom: 8
                }}>
                  Full Name <span style={{ color: "#e74c3c" }}>*</span>
                </label>
                <input 
                  type="text" 
                  placeholder="Enter your full name" 
                  required 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  style={{ 
                    width: "100%", 
                    padding: "14px 16px", 
                    border: "2px solid #e8e8e8", 
                    borderRadius: 10, 
                    fontSize: 15, 
                    outline: "none", 
                    color: "#333", 
                    background: "#fafafa",
                    transition: "all 0.3s ease",
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#924DAC"}
                  onBlur={(e) => e.target.style.borderColor = "#e8e8e8"}
                />
              </div>
            )}

            <div style={{ marginBottom: 20 }}>
              <label style={{ 
                fontWeight: 600, 
                color: "#444", 
                fontSize: 14, 
                display: "block",
                marginBottom: 8
              }}>
                Email Address <span style={{ color: "#e74c3c" }}>*</span>
              </label>
              <input 
                type="email" 
                placeholder="Enter your email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                style={{ 
                  width: "100%", 
                  padding: "14px 16px", 
                  border: "2px solid #e8e8e8", 
                  borderRadius: 10, 
                  fontSize: 15, 
                  outline: "none", 
                  color: "#333", 
                  background: "#fafafa",
                  transition: "all 0.3s ease",
                  boxSizing: "border-box"
                }}
                onFocus={(e) => e.target.style.borderColor = "#924DAC"}
                onBlur={(e) => e.target.style.borderColor = "#e8e8e8"}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ 
                fontWeight: 600, 
                color: "#444", 
                fontSize: 14, 
                display: "block",
                marginBottom: 8
              }}>
                Password <span style={{ color: "#e74c3c" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder={tab === "login" ? "Enter your password" : "Create a strong password"} 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  style={{ 
                    width: "100%", 
                    padding: "14px 50px 14px 16px", 
                    border: "2px solid #e8e8e8", 
                    borderRadius: 10, 
                    fontSize: 15, 
                    outline: "none", 
                    color: "#333", 
                    background: "#fafafa",
                    transition: "all 0.3s ease",
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#924DAC"}
                  onBlur={(e) => e.target.style.borderColor = "#e8e8e8"}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  style={{ 
                    position: "absolute", 
                    right: 14, 
                    top: "50%", 
                    transform: "translateY(-50%)", 
                    background: "none", 
                    border: "none", 
                    cursor: "pointer", 
                    fontSize: 20,
                    padding: 4
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
                background: loading ? "#ccc" : "linear-gradient(135deg, #924DAC 0%, #b06ac9 100%)",
                color: "white", 
                border: "none", 
                padding: "16px", 
                borderRadius: 12, 
                fontWeight: 700, 
                fontSize: 16, 
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 4px 12px rgba(146,77,172,0.3)",
                transition: "all 0.3s ease",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(146,77,172,0.4)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(146,77,172,0.3)";
              }}
            >
              {loading ? (
                <span>
                  <span style={{ 
                    display: "inline-block", 
                    animation: "spin 1s linear infinite",
                    marginRight: 8
                  }}>⏳</span>
                  Processing...
                </span>
              ) : (
                tab === "login" ? "Sign In" : "Create Account"
              )}
            </button>
          </form>
        )}

        {/* Footer */}
        <div style={{ 
          marginTop: 24, 
          textAlign: "center", 
          fontSize: 13, 
          color: "#888" 
        }}>
          {tab === "login" ? (
            <p>Don't have an account? <button onClick={() => setTab("signup")} style={{ color: "#924DAC", background: "none", border: "none", cursor: "pointer", fontWeight: 600, textDecoration: "underline" }}>Sign up</button></p>
          ) : (
            <p>Already have an account? <button onClick={() => setTab("login")} style={{ color: "#924DAC", background: "none", border: "none", cursor: "pointer", fontWeight: 600, textDecoration: "underline" }}>Log in</button></p>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
