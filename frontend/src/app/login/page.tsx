"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
// Assuming apiService has `login`, `register`, and a new `forgotPassword` method
import apiService from "../../services/api";

// --- Data for Indian States ---
const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", 
  "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", 
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", 
  "West Bengal",
  // Union Territories
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", 
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

// --- Input Component for Reusability ---
interface InputFieldProps {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  required?: boolean;
  isSelect?: boolean;
  options?: string[];
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
  showPassword?: boolean;
  marginBottom?: number;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  placeholder,
  value,
  onChange,
  required = false,
  isSelect = false,
  options = [],
  showPasswordToggle = false,
  onTogglePassword,
  showPassword,
  marginBottom = 20,
}) => {
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 16px",
    border: "2px solid #e8e8e8",
    borderRadius: 10,
    fontSize: 15,
    outline: "none",
    color: "#333",
    background: "#fafafa",
    boxSizing: "border-box",
    transition: "border-color 0.2s ease",
  };

  const labelStyle: React.CSSProperties = {
    fontWeight: 600,
    color: "#444",
    fontSize: 14,
    display: "block",
    marginBottom: 8,
  };
  
  const passwordInputStyle: React.CSSProperties = showPasswordToggle ? 
    {...inputStyle, paddingRight: "50px"} : inputStyle;

  return (
    <div style={{ marginBottom }}>
      <label style={labelStyle}>
        {label} {required && <span style={{ color: "#e74c3c" }}>*</span>}
      </label>
      {isSelect ? (
        <div style={{ position: "relative" }}>
          <select
            required={required}
            value={value}
            onChange={onChange}
            style={{ ...inputStyle, appearance: 'none', paddingRight: '30px' }}
          >
            <option value="" disabled>{placeholder}</option>
            {options.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {/* Simple dropdown arrow indicator for style */}
          <div style={{ position: 'absolute', right: 15, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#888' }}>
            ▼
          </div>
        </div>
      ) : (
        <div style={{ position: "relative" }}>
          <input
            type={showPasswordToggle ? (showPassword ? "text" : "password") : type}
            placeholder={placeholder}
            required={required}
            value={value}
            onChange={onChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
            style={passwordInputStyle}
          />
          {showPasswordToggle && onTogglePassword && (
            <button
              type="button"
              onClick={onTogglePassword}
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
              {showPassword ? "🙈" : "👁️"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};


// --- Main Component ---
export default function LoginPage() {
  const router = useRouter();
  // Tab state now includes "forgot"
  const [tab, setTab] = useState<"login" | "signup" | "forgot">("signup"); 
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  // New State Field for India
  const [state, setState] = useState(""); 
  // State for Forgot Password flow
  const [forgotEmail, setForgotEmail] = useState("");

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
      } else if (tab === "signup") {
        // SIGNUP - Added 'state' to the registration payload
        const response = await apiService.register({ name, email, password, state }); 
        
        if (response.token) {
          // Registration successful
          setRegistrationComplete(true);
          setSuccessMsg("Thank you for signing up! Registration successful.");
          
          // Clear form
          setName("");
          setEmail(""); 
          setPassword("");
          setState("");
          
          // Switch to login after 3 seconds
          setTimeout(() => {
            setTab("login");
            setRegistrationComplete(false);
            setSuccessMsg("Please log in with your new credentials");
          }, 3000);
        }
      } else if (tab === "forgot") {
        // FORGOT PASSWORD
        // NOTE: Ensure your apiService.forgotPassword accepts and handles the email
        const response = await apiService.forgotPassword({ email: forgotEmail });

        setSuccessMsg(response.message || "Password reset instructions sent! Check your email.");
        setForgotEmail(""); // Clear email after submission
        
        setTimeout(() => {
          setTab("login");
          // Clear success message when switching back, or set a temporary one
          setSuccessMsg(null); 
        }, 3000);
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      
      // Handle different error formats
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

  const switchTab = useCallback((newTab: "login" | "signup" | "forgot") => {
    if (!registrationComplete) {
      setTab(newTab);
      setErrorMsg(null);
      setSuccessMsg(null);
      setEmail("");
      setPassword("");
      setName("");
      setState("");
      setForgotEmail("");
      setShowPassword(false);
    }
  }, [registrationComplete]);

  // Determine header text based on current tab
  const headerText = useMemo(() => {
    switch (tab) {
      case "login":
        return "Welcome back!";
      case "signup":
        return "Create your account";
      case "forgot":
        return "Reset your password";
      default:
        return "";
    }
  }, [tab]);

  // Determine button text based on current tab and loading state
  const buttonText = useMemo(() => {
    if (loading) return "⏳ Processing...";
    switch (tab) {
      case "login":
        return "Sign In";
      case "signup":
        return "Create Account";
      case "forgot":
        return "Send Reset Link";
      default:
        return "";
    }
  }, [tab, loading]);


  // Determine if the main form (login/signup) or forgot password form should be shown
  const isMainForm = tab === "login" || tab === "signup";
  
  return (
    <div
      style={{
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
            {headerText}
          </p>
        </div>

        {/* Tabs (Only for Login/Signup) */}
        <div
          style={{
            display: "flex",
            background: "#f8f5fc",
            borderRadius: 12,
            padding: 4,
            marginBottom: 28,
            // Hide tabs when on forgot password view
            visibility: isMainForm ? 'visible' : 'hidden',
            height: isMainForm ? 'auto' : 0,
            overflow: 'hidden',
          }}
        >
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
                opacity: registrationComplete ? 0.5 : 1,
              }}
              onClick={() => switchTab(type as "login" | "signup")}
            >
              {type === "login" ? "Log In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Registration Complete Message */}
        {registrationComplete && (
          <div
            style={{
              background: "linear-gradient(135deg, #2ecc40 0%, #27ae60 100%)",
              color: "white",
              padding: "24px",
              borderRadius: 12,
              marginBottom: 24,
              textAlign: "center",
            }}
          >
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
          <div
            style={{
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
        {!registrationComplete && (
          <form onSubmit={handleSubmit}>
            
            {/* --- SIGNUP & LOGIN FORMS --- */}
            {isMainForm && (
              <>
                {/* Name field (signup only) */}
                {tab === "signup" && (
                  <InputField
                    label="Full Name"
                    type="text"
                    placeholder="Enter your full name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                )}

                {/* State Selection (signup only) */}
                {tab === "signup" && (
                  <InputField
                    label="State"
                    type="select"
                    placeholder="Select your State/UT"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    isSelect
                    options={INDIAN_STATES} // Using INDIAN_STATES
                  />
                )}
                
                {/* Email (login/signup) */}
                <InputField
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                {/* Password (login/signup) */}
                <InputField
                  label="Password"
                  type="password"
                  placeholder={tab === "login" ? "Enter your password" : "Create a strong password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  showPasswordToggle
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                  marginBottom={tab === 'login' ? 8 : 24} // Smaller margin for login to place the forgot password link
                />
              </>
            )}
            
            {/* --- FORGOT PASSWORD FORM --- */}
            {tab === "forgot" && (
              <>
                <p style={{ fontSize: 14, color: "#666", marginBottom: 20, textAlign: 'center' }}>
                    Enter the email associated with your account and we'll send you a link to reset your password.
                </p>
                <InputField
                  label="Email Address"
                  type="email"
                  placeholder="Enter your registered email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  marginBottom={24}
                />
              </>
            )}

            {/* Forgot Password Link (Only on login tab) */}
            {tab === "login" && (
                <div style={{ textAlign: 'right', marginBottom: 24 }}>
                    <button 
                        type="button" 
                        onClick={() => switchTab("forgot")}
                        style={{
                            color: "#924DAC",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: 600,
                            fontSize: 13,
                            padding: 0,
                            textDecoration: "underline",
                        }}
                    >
                        Forgot Password?
                    </button>
                </div>
            )}


            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
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
              {buttonText}
            </button>
          </form>
        )}

        {/* Footer */}
        <div
          style={{
            marginTop: 24,
            textAlign: "center",
            fontSize: 13,
            color: "#888",
          }}
        >
            {/* Show login/signup switch in footer if not on forgot password tab */}
            {isMainForm && (
                <p>
                    {tab === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button
                        onClick={() => switchTab(tab === "login" ? "signup" : "login")}
                        style={{
                            color: "#924DAC",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: 600,
                            textDecoration: "underline",
                        }}
                        disabled={registrationComplete}
                    >
                        {tab === "login" ? "Sign up" : "Log in"}
                    </button>
                </p>
            )}

            {/* Back to Login link on Forgot Password tab */}
            {tab === "forgot" && (
                <p>
                    <button
                        onClick={() => switchTab("login")}
                        style={{
                            color: "#924DAC",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: 600,
                            textDecoration: "underline",
                        }}
                    >
                        ← Back to Log In
                    </button>
                </p>
            )}
        </div>
      </div>
    </div>
  );
}
