import React, { useState } from "react"; // Import eye icons
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./LoginPage.css";
import { Link } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <div className="login-page">


      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Login to Your Account</h1>

        <label htmlFor="email">Email/Username:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password:</label>
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
      </form>

      <p>
        Don't have an account? <Link to="/register">Create Account</Link>
      </p>

    </div>
  );
}

export default LoginPage;