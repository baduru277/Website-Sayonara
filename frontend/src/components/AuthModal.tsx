import React, { useState, useEffect } from "react";
// Using Lucide React icons
import { X, Eye, EyeOff } from 'lucide-react'; 

// =================================================================
// NOTE: These API Service placeholders MUST be replaced with your 
// actual API service (e.g., Axios calls to your backend endpoints).
// =================================================================
interface ApiService {
  login: (credentials: any) => Promise<any>;
  register: (data: any) => Promise<any>;
}
const apiService: ApiService = {
    login: (credentials) => {
        console.warn("API Service Login is a mock placeholder.");
        // Mock successful token response with a short delay
        return new Promise(resolve => setTimeout(() => resolve({ token: 'mock-token', user: { email: credentials.email } }), 500));
    },
    register: (data) => {
        console.warn("API Service Register is a mock placeholder.");
        // Mock successful user creation response with a short delay
        return new Promise(resolve => setTimeout(() => resolve({ token: 'mock-token', user: { email: data.email } }), 500));
    }
};
// =================================================================

type AuthModalProps = {
  // `open` controls the visibility of the modal
  open: boolean;
  // `onClose` is called when the user closes the modal
  onClose: () => void;
  // `onSuccess` is called after successful auth to trigger parent state/redirect
  onSuccess: (message: string) => void;
};

// --- Custom Tailwind Styling Variables for Sayonara Purple ---
const PRIMARY_PURPLE = '#A052D9'; 
const PRIMARY_HOVER = '#8C48C2'; 
const PURPLE_TEXT = `text-[${PRIMARY_PURPLE}]`; 
const PURPLE_BG = `bg-[${PRIMARY_PURPLE}]`;
const PURPLE_HOVER_BG = `hover:bg-[${PRIMARY_HOVER}]`;
const FOCUS_GLOW = `focus:ring-0 focus:border-[${PRIMARY_PURPLE}] focus:shadow-[0_0_0_3px_rgba(160,82,217,0.1)] focus:bg-[#fefdff]`;

/**
 * Main Authentication Modal Component
 * Handles Login and Signup tabs, form submission, and integration 
 * with a placeholder API service.
 * NOTE: Exported as 'App' for required React environment structure.
 */
export default function App({ open, onClose, onSuccess }: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [state, setState] = useState("");
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Reset error messages when switching tabs
  useEffect(() => {
    setErrorMsg(null);
  }, [tab]);

  // List of Indian states for the signup dropdown
  const indianStates = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
    "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
    "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
    "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
    "Uttar Pradesh","Uttarakhand","West Bengal","Andaman and Nicobar Islands",
    "Chandigarh","Dadra and Nagar Haveli and Daman and Diu","Delhi",
    "Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry"
  ];

  if (!open) return null;

  // --- HANDLERS ---

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await apiService.login({ email, password });
      if (res.token) {
        setLoading(false);
        // SUCCESS: Notify parent and close modal immediately
        onSuccess("Login successful! Redirecting to dashboard...");
        onClose(); 
      } else {
        setErrorMsg(res.error || res.message || 'Login failed. Please check your credentials.');
        setLoading(false);
      }
    } catch (err: unknown) {
      let errorMessage = 'Login failed. Could not connect to the server.';
      if (err instanceof Error) errorMessage = err.message;
      setErrorMsg(errorMessage);
      setLoading(false);
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    if (password !== confirmPassword) {
        setErrorMsg("Passwords do not match.");
        setLoading(false);
        return;
    }
    if (!terms) {
        setErrorMsg("You must agree to the Terms & Privacy to sign up.");
        setLoading(false);
        return;
    }

    try {
      const res = await apiService.register({ name, email, password, state });
      if (res.token || res.user) {
        setLoading(false);
        
        // Clear inputs after successful registration
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setState("");
        setTerms(false);
        
        // SUCCESS: Notify parent and close modal immediately
        onSuccess("Registration successful! Redirecting to dashboard...");
        onClose();

      } else {
        setErrorMsg(res.error || res.message || 'Signup failed.');
        setLoading(false);
      }
    } catch (err: unknown) {
      let errorMessage = 'Signup failed. Could not connect to the server.';
      if (err instanceof Error) errorMessage = err.message;
      setErrorMsg(errorMessage);
      setLoading(false);
    }
  }

  // Helper function to render password input with eye toggle
  const renderPasswordInput = (value: string, setter: (val: string) => void, placeholder: string) => (
    <div className="relative">
        <input
            type={showPassword ? "text" : "password"}
            placeholder={placeholder}
            value={value}
            onChange={e => setter(e.target.value)}
            required
            className={`w-full border p-3 rounded-xl transition-all duration-200 bg-[#faf7ff] ${FOCUS_GLOW}`}
        />
        <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
        >
             {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
    </div>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4 transition-opacity duration-300 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6 relative">
          <button
            className={`flex-1 py-3 text-lg font-semibold transition duration-200 ${tab === 'login' ? `${PURPLE_TEXT}` : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setTab('login')}
          >
            Log In
          </button>
          <button
            className={`flex-1 py-3 text-lg font-semibold transition duration-200 ${tab === 'signup' ? `${PURPLE_TEXT}` : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setTab('signup')}
          >
            Sign Up
          </button>
          {/* Animated Indicator */}
          <div 
                className={`absolute bottom-0 h-0.5 w-1/2 ${PURPLE_BG} transition-transform duration-300`}
                style={{ transform: `translateX(${tab === 'login' ? '0%' : '100%'})` }}
            ></div>
        </div>
        
        {/* Messages */}
        {errorMsg && <div className={`text-red-500 mb-4 text-center font-medium p-2 bg-red-50 rounded-lg border border-red-200`}>{errorMsg}</div>}
        
        {/* Forms */}
        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className={`w-full border p-3 rounded-xl transition-all duration-200 bg-[#faf7ff] ${FOCUS_GLOW}`}
            />
            {renderPasswordInput(password, setPassword, "Password")}
            
            <button
              type="submit"
              className={`w-full ${PURPLE_BG} text-white py-3 rounded-xl font-semibold text-lg transition duration-200 shadow-lg shadow-purple-400/30 ${PURPLE_HOVER_BG}`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "LOG IN"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="space-y-6">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className={`w-full border p-3 rounded-xl transition-all duration-200 bg-[#faf7ff] ${FOCUS_GLOW}`}
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className={`w-full border p-3 rounded-xl transition-all duration-200 bg-[#faf7ff] ${FOCUS_GLOW}`}
            />
            {renderPasswordInput(password, setPassword, "Create Password")}
            
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              className={`w-full border p-3 rounded-xl transition-all duration-200 bg-[#faf7ff] ${FOCUS_GLOW}`}
            />
            <select
              value={state}
              onChange={e => setState(e.target.value)}
              required
              className={`w-full border p-3 rounded-xl transition-all duration-200 bg-[#faf7ff] ${FOCUS_GLOW} appearance-none cursor-pointer`}
            >
              <option value="" disabled>Select State (India)</option>
              {indianStates.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            
            <div className="flex items-start mt-6 text-center justify-center">
                <div className="flex items-center h-5">
                    <input id="terms-checkbox" type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} required
                        className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 cursor-pointer" />
                </div>
                <div className="ml-2 text-sm text-gray-500 text-left">
                    I agree to the <a href="#" className={`${PURPLE_TEXT} hover:underline font-medium`}>Terms of Condition</a> and <a href="#" className={`${PURPLE_TEXT} hover:underline font-medium`}>Privacy Policy</a>.
                </div>
            </div>

            <button
              type="submit"
              className={`w-full ${PURPLE_BG} text-white py-3 rounded-xl font-semibold text-lg transition duration-200 shadow-lg shadow-purple-400/30 ${PURPLE_HOVER_BG}`}
              disabled={loading || !terms}
            >
              {loading ? "Signing up..." : "SIGN UP"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
