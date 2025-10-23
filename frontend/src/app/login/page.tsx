"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// NOTE: Ensure this path is correct for your project
import apiService from "../../services/api"; 

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
  const [method, setMethod] = useState<"email" | "phone">("email"); 
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [state, setState] = useState("");
  
  // OTP States
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // --- Helper Functions ---
  
  const handleLoginSuccess = (token: string, user: any) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    }
    
    setSuccessMsg(
      tab === "login"
        ? "Login successful! Redirecting to dashboard..."
        : "Account created! Redirecting to dashboard..."
    );
    
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };
  
  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
    setState("");
    setPhone("");
    setOtp("");
    setOtpSent(false);
    setErrorMsg(null);
    setSuccessMsg(null);
  }

  const switchTab = (newTab: "login" | "signup") => {
    setTab(newTab);
    resetForm();
    setMethod("email"); 
  };
  
  // --- MOCK OTP Handlers (Client-Side Simulation) ---

  const handleOtpRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    
    try {
      if (!phone || !state || (tab === 'signup' && !name)) {
          throw new Error(`Phone, State${tab === 'signup' ? ', and Name' : ''} are required.`);
      }

      // 🛑 SIMULATION: No API call. Wait 1 second and proceed.
      console.log('SIMULATION: OTP request successful for:', phone);
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      
      setOtpSent(true);
      // NOTE: Tell the user the mock OTP to enter
      setSuccessMsg("OTP sent successfully! (Mock OTP is 123456)");
      
    } catch (error: any) {
      setErrorMsg(error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    
    try {
      if (!otp) {
        throw new Error("Please enter the received OTP.");
      }
      
      // 🛑 SIMULATION: No API call. Check against hardcoded OTP.
      console.log('SIMULATION: OTP verification attempt with OTP:', otp);
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      
      const MOCK_OTP = '123456';
      
      if (otp !== MOCK_OTP) { 
           throw new Error("Invalid OTP. The mock OTP is 123456.");
      }
      
      // Mock successful response (Assuming the user is already created/logged in on the backend)
      const mockUser = { id: 99, name: name || 'User', phone, location: state, email: null };
      const mockToken = 'mock-otp-token-12345';
      
      handleLoginSuccess(mockToken, mockUser);
      resetForm(); 
      
    } catch (error: any) {
      setErrorMsg(error.message || 'OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // --- Email/Password Handler (Uses existing API logic) ---
  
  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (tab === "login") {
        // LOGIN
        const response = await apiService.login({ email, password });
        if (response.token) {
          handleLoginSuccess(response.token, response.user);
        }
      } else {
        // SIGNUP
        if (password !== confirmPassword) {
          setErrorMsg("Passwords do not match.");
          setLoading(false);
          return;
        }
        if (!name || !email || !password || !state) {
            setErrorMsg("Name, email, password, and state are required.");
            setLoading(false);
            return;
        }

        const response = await apiService.register({ 
            name, 
            email, 
            password, 
            location: state 
        });
        
        if (response.token) {
          handleLoginSuccess(response.token, response.user);
          resetForm();
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      let errorMessage = error.message || error.error || 'An error occurred. Please try again.';
      setErrorMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  // --- JSX Form Content Rendering ---
  
  let formContent;

  if (method === 'phone' && !otpSent) {
      // Step 1: Collect Phone Number, Name, State
      formContent = (
          <form onSubmit={handleOtpRequest}>
              {/* Phone Input */}
              <div style={{ marginBottom: 20 }}>
                  <label style={{fontWeight: 600, color: "#444", fontSize: 14, display: "block", marginBottom: 8}}>
                      Phone Number <span style={{ color: "#e74c3c" }}>*</span>
                  </label>
                  <input
                      type="tel"
                      placeholder="e.g., 9876543210"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{ width: "100%", padding: "14px 16px", border: "2px solid #e8e8e8", borderRadius: 10, fontSize: 15, outline: "none", color: "#333", background: "#fafafa", boxSizing: "border-box" }}
                  />
              </div>
              
              {/* Name field (signup only) */}
              {tab === "signup" && (
                <div style={{ marginBottom: 20 }}>
                    <label style={{fontWeight: 600, color: "#444", fontSize: 14, display: "block", marginBottom: 8}}>
                        Full Name <span style={{ color: "#e74c3c" }}>*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Enter your full name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ width: "100%", padding: "14px 16px", border: "2px solid #e8e8e8", borderRadius: 10, fontSize: 15, outline: "none", color: "#333", background: "#fafafa", boxSizing: "border-box" }}
                    />
                </div>
              )}
              
              {/* Indian State Dropdown */}
              <div style={{ marginBottom: 24 }}>
                  <label style={{fontWeight: 600, color: "#444", fontSize: 14, display: "block", marginBottom: 8}}>
                      State/Region <span style={{ color: "#e74c3c" }}>*</span>
                  </label>
                  <select
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      style={{ width: "100%", padding: "14px 16px", border: "2px solid #e8e8e8", borderRadius: 10, fontSize: 15, outline: "none", color: state === "" ? "#888" : "#333", background: "#fafafa", boxSizing: "border-box", appearance: "none", backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path fill='gray' d='M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z'/></svg>\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px top 50%", paddingRight: "40px", }}
                  >
                      <option value="" disabled>Select your state</option>
                      {indianStates.map((s) => (<option key={s} value={s}>{s}</option>))}
                  </select>
              </div>
              
              <button type="submit" disabled={loading} style={{ width: "100%", padding: "16px", borderRadius: 12, fontWeight: 700, fontSize: 16, background: loading ? "#ccc" : "linear-gradient(135deg, #924DAC 0%, #b06ac9 100%)", color: "white", border: "none", cursor: loading ? "not-allowed" : "pointer", boxShadow: loading ? "none" : "0 4px 12px rgba(146,77,172,0.3)", transition: "all 0.3s ease", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {loading ? "⏳ Sending OTP..." : tab === 'signup' ? "Sign Up with OTP" : "Login with OTP"}
              </button>
          </form>
      );
  } else if (method === 'phone' && otpSent) {
      // Step 2: Enter OTP
      formContent = (
          <form onSubmit={handleOtpSubmit}>
              <div style={{ marginBottom: 20, textAlign: 'center' }}>
                  <p style={{ color: "#4CAF50", fontWeight: 600 }}>OTP sent to {phone}</p>
                  <label style={{fontWeight: 600, color: "#444", fontSize: 14, display: "block", marginBottom: 8}}>
                      Enter OTP <span style={{ color: "#e74c3c" }}>*</span>
                  </label>
                  <input
                      type="text"
                      placeholder="000000"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      style={{ width: "100%", padding: "14px 16px", border: "2px solid #e8e8e8", borderRadius: 10, fontSize: 15, outline: "none", color: "#333", background: "#fafafa", boxSizing: "border-box", textAlign: 'center' }}
                  />
              </div>
              
              <button type="submit" disabled={loading} style={{ width: "100%", padding: "16px", borderRadius: 12, fontWeight: 700, fontSize: 16, background: loading ? "#ccc" : "linear-gradient(135deg, #924DAC 0%, #b06ac9 100%)", color: "white", border: "none", cursor: loading ? "not-allowed" : "pointer", boxShadow: loading ? "none" : "0 4px 12px rgba(146,77,172,0.3)", transition: "all 0.3s ease", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {loading ? "⏳ Verifying..." : "Verify & Continue"}
              </button>
              <button 
                  type="button" 
                  onClick={() => setOtpSent(false)} 
                  style={{ marginTop: 10, width: "100%", padding: "10px", background: "none", border: "none", color: "#924DAC", fontWeight: 600, cursor: "pointer" }}
              >
                  Change Phone/Resend
              </button>
          </form>
      );
  } else {
      // Standard Email/Password form
      formContent = (
          <form onSubmit={handleEmailSubmit}>
              
              {/* Name field (signup only) */}
              {tab === "signup" && (
                <div style={{ marginBottom: 20 }}>
                    <label style={{fontWeight: 600, color: "#444", fontSize: 14, display: "block", marginBottom: 8}}>Full Name <span style={{ color: "#e74c3c" }}>*</span></label>
                    <input type="text" placeholder="Enter your full name" required value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", padding: "14px 16px", border: "2px solid #e8e8e8", borderRadius: 10, fontSize: 15, outline: "none", color: "#333", background: "#fafafa", boxSizing: "border-box" }} />
                </div>
              )}

              {/* Email */}
              <div style={{ marginBottom: 20 }}>
                  <label style={{fontWeight: 600, color: "#444", fontSize: 14, display: "block", marginBottom: 8}}>Email Address <span style={{ color: "#e74c3c" }}>*</span></label>
                  <input type="email" placeholder="Enter your email" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: "14px 16px", border: "2px solid #e8e8e8", borderRadius: 10, fontSize: 15, outline: "none", color: "#333", background: "#fafafa", boxSizing: "border-box" }} />
              </div>

              {/* Password */}
              <div style={{ marginBottom: 20 }}>
                  <label style={{fontWeight: 600, color: "#444", fontSize: 14, display: "block", marginBottom: 8}}>Password <span style={{ color: "#e74c3c" }}>*</span></label>
                  <div style={{ position: "relative" }}>
                      <input type={showPassword ? "text" : "password"} placeholder={tab === "login" ? "Enter your password" : "Create a strong password"} required value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", padding: "14px 50px 14px 16px", border: "2px solid #e8e8e8", borderRadius: 10, fontSize: 15, outline: "none", color: "#333", background: "#fafafa", boxSizing: "border-box" }} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 20, padding: 4 }}>{showPassword ? "🙈" : "👁️"}</button>
                  </div>
              </div>

              {/* Confirm Password (signup only) */}
              {tab === "signup" && (
                  <div style={{ marginBottom: 20 }}>
                      <label style={{fontWeight: 600, color: "#444", fontSize: 14, display: "block", marginBottom: 8}}>Confirm Password <span style={{ color: "#e74c3c" }}>*</span></label>
                      <div style={{ position: "relative" }}>
                          <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm your password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={{ width: "100%", padding: "14px 50px 14px 16px", border: "2px solid #e8e8e8", borderRadius: 10, fontSize: 15, outline: "none", color: "#333", background: "#fafafa", boxSizing: "border-box" }} />
                          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 20, padding: 4 }}>{showConfirmPassword ? "🙈" : "👁️"}</button>
                      </div>
                  </div>
              )}

              {/* Indian State Dropdown (signup only) */}
              {tab === "signup" && (
                  <div style={{ marginBottom: 24 }}>
                      <label style={{fontWeight: 600, color: "#444", fontSize: 14, display: "block", marginBottom: 8}}>State/Region <span style={{ color: "#e74c3c" }}>*</span></label>
                      <select required value={state} onChange={(e) => setState(e.target.value)} style={{ width: "100%", padding: "14px 16px", border: "2px solid #e8e8e8", borderRadius: 10, fontSize: 15, outline: "none", color: state === "" ? "#888" : "#333", background: "#fafafa", boxSizing: "border-box", appearance: "none", backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path fill='gray' d='M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z'/></svg>\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px top 50%", paddingRight: "40px", }}>
                          <option value="" disabled>Select your state</option>
                          {indianStates.map((s) => (<option key={s} value={s}>{s}</option>))}
                      </select>
                  </div>
              )}

              {/* Submit Button */}
              <button type="submit" disabled={loading} style={{ width: "100%", padding: "16px", borderRadius: 12, fontWeight: 700, fontSize: 16, background: loading ? "#ccc" : "linear-gradient(135deg, #924DAC 0%, #b06ac9 100%)", color: "white", border: "none", cursor: loading ? "not-allowed" : "pointer", boxShadow: loading ? "none" : "0 4px 12px rgba(146,77,172,0.3)", transition: "all 0.3s ease", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {loading ? "⏳ Processing..." : tab === "login" ? "Sign In" : "Create Account"}
              </button>
          </form>
      );
  }
  
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f7fa 0%, #e8eaf6 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Quicksand, Montserrat, sans-serif", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: 420, background: "#fff", borderRadius: 20, boxShadow: "0 8px 32px rgba(146,77,172,0.15)", padding: "40px 32px", position: "relative" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#924DAC", margin: 0, marginBottom: 8 }}>Sayonara</h1>
            <p style={{ fontSize: 14, color: "#888", margin: 0 }}>{tab === "login" ? "Welcome back!" : "Create your account"}</p>
        </div>

        {/* Tabs (Login/Signup) */}
        <div style={{ display: "flex", background: "#f8f5fc", borderRadius: 12, padding: 4, marginBottom: 28 }}>
            {["login", "signup"].map((type) => (
                <button
                    key={type}
                    style={{ flex: 1, background: tab === type ? "#924DAC" : "transparent", color: tab === type ? "#fff" : "#888", border: "none", fontWeight: 700, fontSize: 16, padding: "10px 0", borderRadius: 8, cursor: "pointer", transition: "all 0.3s ease" }}
                    onClick={() => switchTab(type as "login" | "signup")}
                >
                    {type === "login" ? "Log In" : "Sign Up"}
                </button>
            ))}
        </div>

        {/* Auth Method Selector (Email/Phone) */}
        {!otpSent && (
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                <button 
                    onClick={() => { setMethod("email"); resetForm(); }}
                    style={{ border: 'none', background: method === 'email' ? '#924DAC' : '#f0f0f0', color: method === 'email' ? 'white' : '#444', padding: '8px 16px', borderRadius: '6px 0 0 6px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s', outline: 'none' }}>
                    Email/Password
                </button>
                <button 
                    onClick={() => { setMethod("phone"); resetForm(); }}
                    style={{ border: 'none', background: method === 'phone' ? '#924DAC' : '#f0f0f0', color: method === 'phone' ? 'white' : '#444', padding: '8px 16px', borderRadius: '0 6px 6px 0', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s', outline: 'none' }}>
                    Mobile OTP
                </button>
            </div>
        )}

        {/* Messages */}
        {successMsg && (
          <div style={{ color: "#2ecc40", background: "#e8f8e8", padding: "14px", borderRadius: 10, marginBottom: 20, textAlign: "center", fontWeight: 600, border: "2px solid #2ecc40" }}>
            <span style={{ fontSize: 20, marginRight: 8 }}>✓</span> {successMsg}
          </div>
        )}
        {errorMsg && (
          <div style={{ color: "#e74c3c", background: "#ffe6e6", padding: "14px", borderRadius: 10, marginBottom: 20, textAlign: "center", fontWeight: 600, border: "2px solid #e74c3c" }}>
            <span style={{ fontSize: 20, marginRight: 8 }}>✕</span> {errorMsg}
          </div>
        )}

        {/* Dynamic Form Content */}
        {formContent}

        {/* Footer */}
        <div style={{ marginTop: 24, textAlign: "center", fontSize: 13, color: "#888" }}>
          {tab === "login" ? (
            <p>
              Don't have an account?{" "}
              <button
                onClick={() => switchTab("signup")}
                style={{ color: "#924DAC", background: "none", border: "none", cursor: "pointer", fontWeight: 600, textDecoration: "underline" }}
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                onClick={() => switchTab("login")}
                style={{ color: "#924DAC", background: "none", border: "none", cursor: "pointer", fontWeight: 600, textDecoration: "underline" }}
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
