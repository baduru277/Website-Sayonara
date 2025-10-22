// "use client"; // REQUIRED to use React Hooks like useState, useEffect, etc.

// import { useState, useCallback, useMemo } from 'react';

// // --- START: Mocked Dependencies for Standalone Environment ---
// interface MockLinkProps {
//   href: string;
//   children: React.ReactNode;
//   target?: string;
//   className?: string;
// }
// const Link: React.FC<MockLinkProps> = ({ href, children, ...props }) => (
//   <a 
//     href={href} 
//     onClick={(e: React.MouseEvent<HTMLAnchorElement>) => { 
//       e.preventDefault(); 
//       console.log('Simulated Navigation to:', href); 
//     }} 
//     {...props}
//   >
//     {children}
//   </a>
// );
// const useRouter = () => ({ 
//   push: (path: string) => console.log('Simulated Redirect to:', path) 
// });
// const apiService = {
//   setAuthToken: (token: string) => {
//     console.log(`Token stored: ${token.substring(0, 20)}...`);
//   },
//   register: async (userData: any) => {
//     await new Promise(resolve => setTimeout(resolve, 1500));
//     return { 
//       token: 'mock-jwt-token-1234567890', 
//       message: 'User registered successfully.' 
//     };
//   },
//   login: async (credentials: any) => {
//     await new Promise(resolve => setTimeout(resolve, 1500));
//     return { 
//       token: 'mock-jwt-token-0987654321', 
//       message: 'Logged in successfully.' 
//     };
//   },
// };
// // --- END: Mocked Dependencies ---

// // --- TYPES ---
// interface FormData { firstName: string; lastName: string; email: string; location: string; password: string; confirmPassword: string; agreeToTerms: boolean; }
// interface LoginData { email: string; password: string; }
// type FormErrors = Record<keyof FormData | 'general' | 'loginEmail' | 'loginPassword', string>;

// // List of Indian States and Union Territories (as requested)
// const indianLocations = [
//   "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
//   "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", 
//   "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
//   "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", 
//   "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
//   "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", 
//   "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi (NCT)", 
//   "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
// ];

// // --- Sub-Component: Sign Up Form (Re-used Logic from previous iteration) ---
// interface SignUpFormProps {
//   isLoading: boolean;
//   errors: Partial<FormErrors>;
//   formData: FormData;
//   handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
//   handleSubmit: (e: React.FormEvent) => void;
//   passwordStrength: number;
//   showPassword: boolean;
//   setShowPassword: (show: boolean) => void;
//   showConfirmPassword: boolean;
//   setShowConfirmPassword: (show: boolean) => void;
// }

// const getPasswordStrengthColor = (strength: number) => {
//     if (strength === 0) return 'bg-gray-300';
//     if (strength <= 2) return 'bg-red-500';
//     if (strength <= 3) return 'bg-yellow-500';
//     if (strength <= 4) return 'bg-blue-500';
//     return 'bg-green-500';
// };

// const getPasswordStrengthText = (strength: number) => {
//     const texts = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
//     return texts[strength] || '';
// };

// const SignUpForm: React.FC<SignUpFormProps> = ({ 
//     isLoading, errors, formData, handleChange, handleSubmit, 
//     passwordStrength, showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword 
// }) => {
//     const strengthColor = useMemo(() => getPasswordStrengthColor(passwordStrength), [passwordStrength]);
//     const strengthText = useMemo(() => getPasswordStrengthText(passwordStrength), [passwordStrength]);

//     return (
//         <form onSubmit={handleSubmit} className="space-y-4 pt-4">
//             <div className="flex space-x-4">
//                 {/* First Name */}
//                 <div className="flex-1">
//                     <label className="block font-semibold text-gray-700 text-sm mb-1">First Name *</label>
//                     <input type="text" name="firstName" placeholder="Rohan" value={formData.firstName} onChange={handleChange} disabled={isLoading}
//                         className={`w-full px-4 py-3 rounded-lg bg-[#faf8fd] border-2 transition-all ${
//                             errors.firstName ? 'border-red-500' : 'border-[#f3eaff] focus:border-[#924DAC]'
//                         } text-gray-800 placeholder-gray-400 focus:outline-none disabled:opacity-50`}
//                     />
//                     {errors.firstName && <p className="text-red-500 text-xs mt-1 font-medium">{errors.firstName}</p>}
//                 </div>

//                 {/* Last Name */}
//                 <div className="flex-1">
//                     <label className="block font-semibold text-gray-700 text-sm mb-1">Last Name *</label>
//                     <input type="text" name="lastName" placeholder="Sharma" value={formData.lastName} onChange={handleChange} disabled={isLoading}
//                         className={`w-full px-4 py-3 rounded-lg bg-[#faf8fd] border-2 transition-all ${
//                             errors.lastName ? 'border-red-500' : 'border-[#f3eaff] focus:border-[#924DAC]'
//                         } text-gray-800 placeholder-gray-400 focus:outline-none disabled:opacity-50`}
//                     />
//                     {errors.lastName && <p className="text-red-500 text-xs mt-1 font-medium">{errors.lastName}</p>}
//                 </div>
//             </div>

//             {/* Email */}
//             <div>
//                 <label className="block font-semibold text-gray-700 text-sm mb-1">Email Address *</label>
//                 <input type="email" name="email" placeholder="rohan.sharma@example.com" value={formData.email} onChange={handleChange} disabled={isLoading}
//                     className={`w-full px-4 py-3 rounded-lg bg-[#faf8fd] border-2 transition-all ${
//                         errors.email ? 'border-red-500' : 'border-[#f3eaff] focus:border-[#924DAC]'
//                     } text-gray-800 placeholder-gray-400 focus:outline-none disabled:opacity-50`}
//                 />
//                 {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
//             </div>

//             {/* Location */}
//             <div>
//                 <label className="block font-semibold text-gray-700 text-sm mb-1">State / Union Territory *</label>
//                 <select name="location" value={formData.location} onChange={handleChange} disabled={isLoading}
//                     className={`w-full px-4 py-3 rounded-lg bg-[#faf8fd] border-2 transition-all ${
//                         errors.location ? 'border-red-500' : 'border-[#f3eaff] focus:border-[#924DAC]'
//                     } text-gray-800 focus:outline-none disabled:opacity-50`}
//                 >
//                     <option value="">Select your state/UT</option>
//                     {indianLocations.map(location => (
//                         <option key={location} value={location}>{location}</option>
//                     ))}
//                 </select>
//                 {errors.location && <p className="text-red-500 text-xs mt-1 font-medium">{errors.location}</p>}
//             </div>

//             {/* Password */}
//             <div>
//                 <label className="block font-semibold text-gray-700 text-sm mb-1">Password *</label>
//                 <div className="relative">
//                     <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Create a strong password" value={formData.password} onChange={handleChange} disabled={isLoading}
//                         className={`w-full px-4 py-3 rounded-lg bg-[#faf8fd] border-2 transition-all pr-12 ${
//                             errors.password ? 'border-red-500' : 'border-[#f3eaff] focus:border-[#924DAC]'
//                         } text-gray-800 placeholder-gray-400 focus:outline-none disabled:opacity-50`}
//                     />
//                     <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={isLoading}
//                         className="absolute right-3 top-1/2 -translate-y-1/2 text-[#924DAC] text-lg hover:text-[#7F53AC] transition-colors disabled:opacity-50"
//                     >
//                         {showPassword ? '🙈' : '👁️'}
//                     </button>
//                 </div>
//                 {formData.password && (
//                     <div className="mt-2">
//                         <div className="flex gap-1 mb-1">
//                             {[1, 2, 3, 4, 5].map((level) => (
//                                 <div key={level} className={`h-1.5 flex-1 rounded-full transition-colors ${level <= passwordStrength ? strengthColor : 'bg-gray-200'}`} />
//                             ))}
//                         </div>
//                         <p className={`text-xs font-semibold ${passwordStrength <= 2 ? 'text-red-500' : passwordStrength === 3 ? 'text-yellow-500' : passwordStrength === 4 ? 'text-blue-500' : 'text-green-500'}`}>
//                             Strength: {strengthText}
//                         </p>
//                     </div>
//                 )}
//                 {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password}</p>}
//             </div>

//             {/* Confirm Password */}
//             <div>
//                 <label className="block font-semibold text-gray-700 text-sm mb-1">Confirm Password *</label>
//                 <div className="relative">
//                     <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} disabled={isLoading}
//                         className={`w-full px-4 py-3 rounded-lg bg-[#faf8fd] border-2 transition-all pr-12 ${
//                             errors.confirmPassword ? 'border-red-500' : 'border-[#f3eaff] focus:border-[#924DAC]'
//                         } text-gray-800 placeholder-gray-400 focus:outline-none disabled:opacity-50`}
//                     />
//                     <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} disabled={isLoading}
//                         className="absolute right-3 top-1/2 -translate-y-1/2 text-[#924DAC] text-lg hover:text-[#7F53AC] transition-colors disabled:opacity-50"
//                     >
//                         {showConfirmPassword ? '🙈' : '👁️'}
//                     </button>
//                 </div>
//                 {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 font-medium">{errors.confirmPassword}</p>}
//             </div>

//             {/* Terms & Conditions */}
//             <div className="pt-2">
//                 <label className="flex items-start space-x-3 cursor-pointer">
//                     <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} disabled={isLoading}
//                         className="w-5 h-5 mt-0.5 accent-[#924DAC] cursor-pointer disabled:opacity-50"
//                     />
//                     <span className="text-sm text-gray-600 leading-relaxed">
//                         I agree to the{' '}
//                         <Link href="/terms" target="_blank" className="text-[#924DAC] font-semibold hover:underline">Terms of Service</Link>{' '}
//                         and{' '}
//                         <Link href="/privacy" target="_blank" className="text-[#924DAC] font-semibold hover:underline">Privacy Policy</Link>
//                     </span>
//                 </label>
//                 {errors.agreeToTerms && <p className="text-red-500 text-xs mt-2 font-medium">{errors.agreeToTerms}</p>}
//             </div>

//             {/* Submit Button */}
//             <button type="submit" disabled={isLoading}
//                 className={`w-full py-3 mt-6 rounded-lg bg-gradient-to-r from-[#924DAC] to-[#7F53AC] text-white font-bold text-lg transition-all transform ${
//                     isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
//                 }`}
//             >
//                 {isLoading ? (
//                     <span className="flex items-center justify-center">
//                         <span className="inline-block w-4 h-4 border-2 border-white border-r-transparent rounded-full animate-spin mr-2"></span>
//                         SIGNING UP...
//                     </span>
//                 ) : ('SIGN UP')}
//             </button>
//         </form>
//     );
// };

// // --- Sub-Component: Log In Form (Placeholder) ---
// interface LogInFormProps {
//     isLoading: boolean;
//     errors: Partial<FormErrors>;
//     router: ReturnType<typeof useRouter>;
//     setErrors: React.Dispatch<React.SetStateAction<Partial<FormErrors>>>;
//     setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
// }

// const LogInForm: React.FC<LogInFormProps> = ({ isLoading, errors, router, setErrors, setSuccessMessage }) => {
//     const [loginData, setLoginData] = useState<LoginData>({ email: '', password: '' });
//     const [showPassword, setShowPassword] = useState(false);
    
//     const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target;
//         setLoginData(prev => ({ ...prev, [name]: value }));
//         setErrors(prev => ({ ...prev, [name]: '' }));
//     };

//     const handleLoginSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setErrors({});
//         setSuccessMessage('');
        
//         // Simple validation
//         const newErrors: Partial<FormErrors> = {};
//         if (!loginData.email) newErrors.loginEmail = 'Email is required';
//         if (!loginData.password) newErrors.loginPassword = 'Password is required';
        
//         if (Object.keys(newErrors).length > 0) {
//             setErrors(prev => ({ ...prev, ...newErrors }));
//             return;
//         }

//         // Simulating loading and API call
//         // (Note: We use the same central isLoading state from the parent component for simplicity)
//         // In a real app, you would pass down setIsLoading from the parent
//         console.log('Attempting login...');
        
//         // Simulating successful login and redirect
//         await new Promise(resolve => setTimeout(resolve, 1500));
//         apiService.setAuthToken('mock-login-token-xyz');
//         setSuccessMessage('Login successful! Redirecting...');
        
//         setTimeout(() => router.push('/dashboard'), 1500); 
//     };

//     return (
//         <form onSubmit={handleLoginSubmit} className="space-y-4 pt-4">
//             {/* Email */}
//             <div>
//                 <label className="block font-semibold text-gray-700 text-sm mb-1">Email Address</label>
//                 <input type="email" name="email" placeholder="sarika@example.com" value={loginData.email} onChange={handleLoginChange} disabled={isLoading}
//                     className={`w-full px-4 py-3 rounded-lg bg-[#faf8fd] border-2 transition-all ${
//                         errors.loginEmail ? 'border-red-500' : 'border-[#f3eaff] focus:border-[#924DAC]'
//                     } text-gray-800 placeholder-gray-400 focus:outline-none disabled:opacity-50`}
//                 />
//                 {errors.loginEmail && <p className="text-red-500 text-xs mt-1 font-medium">{errors.loginEmail}</p>}
//             </div>

//             {/* Password */}
//             <div>
//                 <label className="block font-semibold text-gray-700 text-sm mb-1">Password</label>
//                 <div className="relative">
//                     <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Enter your password" value={loginData.password} onChange={handleLoginChange} disabled={isLoading}
//                         className={`w-full px-4 py-3 rounded-lg bg-[#faf8fd] border-2 transition-all pr-12 ${
//                             errors.loginPassword ? 'border-red-500' : 'border-[#f3eaff] focus:border-[#924DAC]'
//                         } text-gray-800 placeholder-gray-400 focus:outline-none disabled:opacity-50`}
//                     />
//                     <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={isLoading}
//                         className="absolute right-3 top-1/2 -translate-y-1/2 text-[#924DAC] text-lg hover:text-[#7F53AC] transition-colors disabled:opacity-50"
//                     >
//                         {showPassword ? '🙈' : '👁️'}
//                     </button>
//                 </div>
//                 <div className="text-right mt-1">
//                     <Link href="/forgot-password" className="text-xs font-semibold text-gray-500 hover:text-[#924DAC]">
//                         Forgot Password?
//                     </Link>
//                 </div>
//                 {errors.loginPassword && <p className="text-red-500 text-xs mt-1 font-medium">{errors.loginPassword}</p>}
//             </div>

//             {/* Submit Button */}
//             <button type="submit" disabled={isLoading}
//                 className={`w-full py-3 mt-6 rounded-lg bg-gradient-to-r from-[#7F53AC] to-[#647DEE] text-white font-bold text-lg transition-all transform ${
//                     isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
//                 }`}
//             >
//                 {isLoading ? (
//                     <span className="flex items-center justify-center">
//                         <span className="inline-block w-4 h-4 border-2 border-white border-r-transparent rounded-full animate-spin mr-2"></span>
//                         LOGGING IN...
//                     </span>
//                 ) : ('LOG IN')}
//             </button>
//         </form>
//     );
// };

// // --- Main Component: Tabbed Auth Modal ---
// interface RegisterPageProps {
//   initialTab?: 'login' | 'signup';
// }

// export default function RegisterPage({ initialTab = 'signup' }: RegisterPageProps) {
//   const router = useRouter();
//   // Initialize state with the prop value
//   const [activeTab, setActiveTab] = useState<'login' | 'signup'>(initialTab); 
//   const [isLoading, setIsLoading] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [errors, setErrors] = useState<Partial<FormErrors>>({});

//   // --- Sign Up State & Logic ---
//   const [formData, setFormData] = useState<FormData>({
//     firstName: '', lastName: '', email: '', location: '', password: '', 
//     confirmPassword: '', agreeToTerms: false,
//   });
//   const [showSignUpPassword, setShowSignUpPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [passwordStrength, setPasswordStrength] = useState(0);

//   const calculatePasswordStrength = useCallback((pwd: string) => {
//     let strength = 0;
//     if (pwd.length >= 8) strength++;
//     if (pwd.length >= 12) strength++;
//     if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
//     if (/\d/.test(pwd)) strength++;
//     if (/[^a-zA-Z\d]/.test(pwd)) strength++;
//     setPasswordStrength(strength);
//   }, []);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value, type } = e.target;
//     const checked = (e.target as HTMLInputElement).checked;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));

//     if (name === 'password') calculatePasswordStrength(value);

//     // Clear specific Sign Up errors
//     if (errors[name as keyof FormErrors]) setErrors((prev) => ({ ...prev, [name]: '' }));
//     // Clear general login/signup errors when typing
//     if (errors.general) setErrors(prev => ({...prev, general: ''}));
//   };
  
//   const handleSignUpSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setErrors({});
//     setSuccessMessage('');

//     const newErrors: Partial<FormErrors> = {};
//     if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
//     if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
//     if (!formData.email.trim()) newErrors.email = 'Email is required'; 
//     else if (!formData.email.includes('@')) newErrors.email = 'Enter a valid email';
//     if (!formData.location) newErrors.location = 'Please select a location';
//     if (!formData.password) newErrors.password = 'Password is required'; 
//     else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
//     if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
//     if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to terms and conditions';

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const userData = {
//         firstName: formData.firstName.trim(),
//         lastName: formData.lastName.trim(),
//         email: formData.email.trim().toLowerCase(),
//         location: formData.location,
//         password: formData.password,
//       };

//       const response = await apiService.register(userData);

//       if (response.token) {
//         apiService.setAuthToken(response.token);
//         setSuccessMessage('Account created! Redirecting to profile setup...');
//         setTimeout(() => router.push('/onboarding'), 2000); 
//       } else if (response.message) {
//         setErrors({ general: response.message });
//       } else {
//         setErrors({ general: 'Registration failed. Please try again.' });
//       }
//     } catch (error: unknown) {
//       const errorMessage = error instanceof Error ? error.message : 'Something went wrong.';
//       setErrors({ general: errorMessage });
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   // --- End Sign Up Logic ---


//   // --- Tab Styling ---
//   const tabClass = "flex-1 text-center py-3 font-semibold transition-colors duration-300 cursor-pointer";
//   const activeTabClass = "text-[#924DAC] border-b-2 border-[#924DAC]";
//   const inactiveTabClass = "text-gray-500 hover:text-[#7F53AC]";

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#7F53AC] to-[#647DEE] font-inter py-8">
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        
//         {/* Tab Header */}
//         <div className="flex justify-between mb-6 border-b border-gray-200">
//           <div 
//             className={`${tabClass} ${activeTab === 'login' ? activeTabClass : inactiveTabClass}`}
//             onClick={() => { setActiveTab('login'); setErrors({}); setSuccessMessage(''); }}
//           >
//             Log In
//           </div>
//           <div 
//             className={`${tabClass} ${activeTab === 'signup' ? activeTabClass : inactiveTabClass}`}
//             onClick={() => { setActiveTab('signup'); setErrors({}); setSuccessMessage(''); }}
//           >
//             Sign Up
//           </div>
//         </div>
        
//         {/* Close Button Placeholder */}
//         <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hidden">
//           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
//         </button>

//         {/* Messages */}
//         {errors.general && (
//           <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded">
//             <p className="text-sm font-semibold">{errors.general}</p>
//           </div>
//         )}
//         {successMessage && (
//           <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 mb-4 rounded">
//             <p className="text-sm font-semibold">{successMessage}</p>
//           </div>
//         )}

//         {/* Tab Content */}
//         {activeTab === 'signup' ? (
//           <SignUpForm
//             isLoading={isLoading}
//             errors={errors}
//             formData={formData}
//             handleChange={handleChange}
//             handleSubmit={handleSignUpSubmit}
//             passwordStrength={passwordStrength}
//             showPassword={showSignUpPassword}
//             setShowPassword={setShowSignUpPassword}
//             showConfirmPassword={showConfirmPassword}
//             setShowConfirmPassword={setShowConfirmPassword}
//           />
//         ) : (
//           <LogInForm
//             isLoading={isLoading}
//             errors={errors}
//             router={router}
//             setErrors={setErrors}
//             setSuccessMessage={setSuccessMessage}
//           />
//         )}

//         {/* Switch Link (Optional, kept for completeness if this were a standalone form) */}
//         <p className="text-center text-gray-600 text-sm mt-6">
//           {activeTab === 'signup' ? 'Already have an account? ' : 'Don\'t have an account? '}
//           <button 
//             type="button" 
//             onClick={() => setActiveTab(activeTab === 'signup' ? 'login' : 'signup')}
//             className="text-[#924DAC] font-semibold hover:underline transition-colors"
//           >
//             {activeTab === 'signup' ? 'Log In' : 'Sign Up'}
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// }
