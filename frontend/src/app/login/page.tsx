import React, { useState, useCallback } from "react";

// Mocking the necessary dependencies for a runnable component in this environment
// In a real app, this would be imported from 'next/navigation' and your services.
const useMockRouter = () => ({
  push: (path) => console.log(`[ROUTE] Redirecting to ${path}`),
});

const apiService = {
  login: async ({ email, password }) => {
    console.log("Attempting login...", { email, password });
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Simulate successful response
    if (password === "fail") throw new Error("Invalid credentials or user not found.");
    return { user: { id: "123", name: "Guest User" }, token: "mock-token-abc" };
  },
  register: async ({ name, email, password }) => {
    console.log("Attempting registration...", { name, email, password });
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Simulate successful response
    return { success: true };
  },
};


const GlassInput = ({ label, type, value, onChange, placeholder, isPassword, togglePassword }) => {
  const isMandatory = true; // All fields are mandatory

  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{
        fontWeight: 600,
        color: '#2a0a3b', // Deep purple text for labels
        fontSize: 14,
        display: "block",
        marginBottom: 8,
      }}>
        {label}
        {isMandatory && <span style={{ color: '#e74c3c', marginLeft: 4 }}> *</span>} {/* Red asterisk */}
      </label>
      <div style={{ position: "relative" }}>
        <input
          type={type}
          placeholder={placeholder}
          required
          value={value}
          onChange={onChange}
          style={{
            width: "100%",
            padding: "14px 16px",
            border: "1px solid rgba(146, 77, 172, 0.3)", // Subtle purple border
            borderRadius: 12,
            fontSize: 15,
            outline: "none",
            color: "#33004d", // Dark purple text in input
            background: "rgba(255, 255, 255, 0.75)", // More opaque white glossy
            transition: "all 0.3s ease",
            boxSizing: "border-box",
            backdropFilter: "blur(8px)", // Slightly more blur
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#924DAC"; // Primary purple focus border
            e.target.style.background = "rgba(255, 255, 255, 0.9)"; // More opaque on focus
            e.target.style.boxShadow = "0 4px 12px rgba(146, 77, 172, 0.3)"; // Purple glow
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "rgba(146, 77, 172, 0.3)";
            e.target.style.background = "rgba(255, 255, 255, 0.75)";
            e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
          }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={togglePassword}
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
              color: '#551a8b', // Dark purple icon
            }}
          >
            {type === "password" ? "👁️" : "🙈"}
          </button>
        )}
      </div>
    </div>
  );
};

const AuthPage = () => {
  const router = useMockRouter();
  const [tab, setTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const resetMessages = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
  }

  const changeTab = (newTab) => {
    if (registrationComplete) return;
    setTab(newTab);
    setEmail("");
    setPassword("");
    setName("");
    resetMessages();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    resetMessages();

    try {
      if (tab === "login") {
        await apiService.login({ email, password });
        setSuccessMsg("Login successful! Redirecting...");
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify({ id: "123", name: "User" }));
          localStorage.setItem("token", "mock-token-xyz");
        }
        setTimeout(() => router.push("/dashboard"), 1500);
      } else {
        await apiService.register({ name, email, password });
        setRegistrationComplete(true);
        setSuccessMsg("Account created! Please log in below.");
        setName("");
        setPassword("");
        setTimeout(() => {
          changeTab("login");
          setRegistrationComplete(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Auth error:", error);
      setErrorMsg(error.message || "An authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      // Richer, deeper purple background gradient
      background: "linear-gradient(135deg, #6a1b9a 0%, #ab47bc 100%)", 
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Inter, sans-serif",
      padding: "20px",
      position: "relative",
      overflow: 'hidden'
    }}>
      {/* Background Orbs with enhanced colors and movement */}
      <div style={{
        position: "absolute",
        width: 350,
        height: 350,
        background: "rgba(186, 104, 200, 0.4)", // Lighter purple orb
        borderRadius: "50%",
        top: '10%',
        left: '10%',
        filter: "blur(120px)",
        animation: "moveOrb1 18s infinite alternate ease-in-out"
      }}></div>
      <div style={{
        position: "absolute",
        width: 450,
        height: 450,
        background: "rgba(236, 64, 122, 0.3)", // Pinkish purple orb
        borderRadius: "50%",
        bottom: '5%',
        right: '5%',
        filter: "blur(150px)",
        animation: "moveOrb2 22s infinite alternate ease-in-out"
      }}></div>

      {/* Main Card (White Glossy Glass Effect) */}
      <div style={{
        width: "100%",
        maxWidth: 450,
        background: "rgba(255, 255, 255, 0.35)", // Slightly more opaque for better legibility
        borderRadius: 25,
        border: "1px solid rgba(255, 255, 255, 0.6)", // Sharper white border
        boxShadow: "0 10px 40px 0 rgba(0, 0, 0, 0.25)", // Stronger, more defined shadow
        backdropFilter: "blur(15px)", // Increased blur for more depth
        padding: "40px 35px",
        position: "relative",
        zIndex: 10,
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{
            fontSize: 36, // Increased size for emphasis
            fontWeight: 900,
            color: "#4a148c", // Vibrant deep purple
            textShadow: "0 4px 6px rgba(0,0,0,0.2)", // Stronger shadow for pop
            margin: 0,
            marginBottom: 8
          }}>
            Welcome to Sayonara
          </h1>
          <p style={{
            fontSize: 16,
            color: '#551a8b', // Lighter purple for subtitle
            margin: 0
          }}>
            {/* UPDATED SUBTITLE */}
            {tab === "login" ? "Log in to your private universe" : "Start your journey now"}
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex",
          background: "rgba(255, 255, 255, 0.2)", // Translucent white for tab background
          borderRadius: 15,
          padding: 6,
          marginBottom: 28,
          border: "1px solid rgba(255, 255, 255, 0.7)" // Clearer border
        }}>
          {["login", "signup"].map((type) => (
            <button
              key={type}
              disabled={loading || registrationComplete}
              style={{
                flex: 1,
                // Primary purple gradient for active tab
                background: tab === type ? "linear-gradient(45deg, #924DAC 0%, #b06ac9 100%)" : "transparent", 
                color: tab === type ? "#fff" : '#4a148c', // Dark purple text for inactive tab
                border: "none",
                fontWeight: 700,
                fontSize: 16,
                padding: "12px 0",
                borderRadius: 10,
                cursor: (loading || registrationComplete) ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                // Stronger shadow for active tab
                boxShadow: tab === type ? "0 5px 15px rgba(146, 77, 172, 0.5)" : "none", 
                opacity: (loading || registrationComplete) ? 0.7 : 1,
              }}
              // Enhanced hover effect for tabs
              onMouseEnter={(e) => {
                if (!(loading || registrationComplete) && tab !== type) {
                  e.currentTarget.style.background = "rgba(146, 77, 172, 0.2)";
                }
              }}
              onMouseLeave={(e) => {
                if (!(loading || registrationComplete) && tab !== type) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
              onClick={() => changeTab(type)}
            >
              {type === "login" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Status Messages (Adapted for Light Glossy Background) */}
        {(successMsg || errorMsg) && (
          <div style={{
            padding: "14px",
            borderRadius: 12,
            marginBottom: 20,
            textAlign: "center",
            fontWeight: 600,
            transition: "all 0.3s ease",
            animation: "fadeIn 0.5s ease",
            ...(errorMsg ? {
              color: "#c00000",
              background: "rgba(255, 0, 0, 0.15)",
              border: "1px solid #ff5f5f"
            } : {
              color: "#008000",
              background: "rgba(0, 255, 0, 0.15)",
              border: "1px solid #00ff00"
            })
          }}>
            {errorMsg ? '⚠️ ' : '✅ '}
            {successMsg || errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {tab === "signup" && (
            <GlassInput
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <GlassInput
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <GlassInput
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder={tab === "login" ? "Enter your password" : "Create a password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isPassword={true}
            togglePassword={() => setShowPassword(!showPassword)}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              // Primary purple gradient for submit button
              background: loading ? "rgba(255, 255, 255, 0.4)" : "linear-gradient(45deg, #924DAC 0%, #b06ac9 100%)", 
              color: "white",
              border: "none",
              padding: "16px",
              marginTop: 20,
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 16,
              cursor: loading ? "not-allowed" : "pointer",
              // Stronger initial shadow
              boxShadow: loading ? "none" : "0 8px 25px rgba(146, 77, 172, 0.4)", 
              transition: "all 0.3s ease",
              textTransform: "uppercase",
              letterSpacing: "0.8px", // Slightly increased letter spacing
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(-2px) scale(1.01)"; // Lift and slightly scale
                e.currentTarget.style.boxShadow = "0 12px 30px rgba(146, 77, 172, 0.6)"; // More intense glow
              }
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(146, 77, 172, 0.4)";
            }}
          >
            {loading ? (
              <span>
                <span style={{
                  display: "inline-block",
                  animation: "spin 1s linear infinite",
                  marginRight: 10,
                  fontSize: 20, // Larger spinner
                  lineHeight: 0,
                  verticalAlign: "middle"
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
                  </svg>
                </span>
                Authenticating...
              </span>
            ) : (
              tab === "login" ? "Sign In" : "Register Account"
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div style={{
          marginTop: 24,
          textAlign: "center",
          fontSize: 14,
          color: '#551a8b' // Dark purple for footer link context
        }}>
          <button onClick={() => changeTab(tab === "login" ? "signup" : "login")} style={{ color: "#924DAC", background: "none", border: "none", cursor: "pointer", fontWeight: 600, textDecoration: "underline" }}>
            {tab === "login" ? "Need an account? Sign Up" : "Back to Sign In"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes moveOrb1 {
            0% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(150px, 120px) scale(1.1); }
            100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes moveOrb2 {
            0% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(-180px, -140px) scale(0.9); }
            100% { transform: translate(0, 0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default AuthPage;
