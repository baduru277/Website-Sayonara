import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./AuthPage.css";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    language: "",
    idDocument: null,
    bankStatement: null,

  });

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleRegisterChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setRegisterData({
      ...registerData,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log("Login Data:", loginData);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    console.log("Registration Data:", registerData);
  };

  return (
    <div className="auth-page">
      <header className="page-header">
        <div className="logo">Sayonara</div>
        <nav className="navigation-links">
          <a href="/">Home</a>
          <a href="/help">Help</a>
        </nav>
      </header>

      {isLogin ? (
        <form className="auth-form" onSubmit={handleLoginSubmit}>
          <h1>Login to Your Account</h1>

          <label>Email/Username:</label>
          <input
            type="email"
            name="email"
            value={loginData.email}
            onChange={handleLoginChange}
            required
          />

          <label>Password:</label>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={loginData.password}
              onChange={handleLoginChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="toggle-password"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button type="submit" className="btn">Login</button>
          <p className="switch-form">
            Don't have an account?{" "}
            <span onClick={() => setIsLogin(false)}>Create Account</span>
          </p>
        </form>
      ) : (
        <form className="auth-form" onSubmit={handleRegisterSubmit}>
          <h1>Create Your Account</h1>

          <label>Full Name:</label>
          <input
            type="text"
            name="fullName"
            value={registerData.fullName}
            onChange={handleRegisterChange}
            required
          />

          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={registerData.email}
            onChange={handleRegisterChange}
            required
          />

          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={registerData.password}
            onChange={handleRegisterChange}
            required
          />

          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={registerData.confirmPassword}
            onChange={handleRegisterChange}
            required
          />

          <label>Phone Number (Optional):</label>
          <input
            type="tel"
            name="phoneNumber"
            value={registerData.phoneNumber}
            onChange={handleRegisterChange}
          />

          <label>Preferred Language:</label>
          <select
            name="language"
            value={registerData.language}
            onChange={handleRegisterChange}
            required
          >
            <option value="">Select</option>
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
          </select>

          <label>Government ID Upload (Optional):</label>
          <input type="file" name="idDocument" onChange={handleRegisterChange} />

          <label>Bank Statement Upload (Optional):</label>
          <input type="file" name="bankStatement" onChange={handleRegisterChange} />

         <button type="submit" className="btn">Register</button>
          <p className="switch-form">
            Already have an account?{" "}
            <span onClick={() => setIsLogin(true)}>Login</span>
          </p>
        </form>
      )}

      <footer className="page-footer">
        <p>Quick Links | Contact Info | Social Media Icons</p>
      </footer>
    </div>
  );
}

export default AuthPage;