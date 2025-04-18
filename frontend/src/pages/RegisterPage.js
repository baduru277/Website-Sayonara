import React, { useState } from "react";
import "./RegisterPage.css";

function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    language: "",
    idDocument: null,
    bankStatement: null,
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const progress = ((currentStep + 1) / 7) * 100;

  // Custom motivational messages, proverbs, and greetings
  const stepMessages = [
    "🚀 Time is money—let’s get you started!",
    "🛠️ A fair exchange begins with a fair profile!",
    "💪 You’re doing great! A strong password protects your success.",
    "📱 The best deals are just a click away. Verify your contact info.",
    "🌍 The more languages you know, the more you trade!",
    "💼 Your trust is your currency. Upload documents for secure trading.",
    "🏆 You’re almost there—let’s complete your registration and start bidding!"
  ];

  const proverbMessages = [
    "💰 'A fair exchange is no robbery. Let’s get you trading!'",
    "🔑 'In the world of barter, trust is the true currency.'",
    "🎯 'The bid you don’t make is the one you lose.'",
    "🔄 'Trade is the art of giving and receiving—let’s complete your profile.'",
    "📊 'The more you bid, the more you gain—let’s get started!'"
  ];

  // Show a proverb or message after every few steps for engagement
  const showProverb = currentStep === 2 || currentStep === 4;

  return (
    <div className="register-page">
      <form className="register-form" onSubmit={handleSubmit}>
        <h1>Create Your Account</h1>

        {/* Progress Bar */}
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>

        <h2>Step {currentStep + 1} of 7</h2>

        {/* Display Motivational or Proverb Message */}
        <div className="motivational-message">
          <p>{stepMessages[currentStep]}</p>
        </div>

        {/* Display Proverb Messages at Certain Steps */}
        {showProverb && (
          <div className="motivational-message proverb">
            <p>{proverbMessages[Math.floor(Math.random() * proverbMessages.length)]}</p>
          </div>
        )}

        {/* Step 1: Full Name */}
        {currentStep === 0 && (
          <>
            <label htmlFor="fullName">Full Name:</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </>
        )}

        {/* Step 2: Email */}
        {currentStep === 1 && (
          <>
            <label htmlFor="email">Email/Username:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </>
        )}

        {/* Step 3: Password and Confirm Password */}
        {currentStep === 2 && (
          <>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Choose a strong password"
            />
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Re-enter your password"
            />
          </>
        )}

        {/* Step 4: Phone Number */}
        {currentStep === 3 && (
          <>
            <label htmlFor="phoneNumber">Phone Number:</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </>
        )}

        {/* Step 5: Preferred Language */}
        {currentStep === 4 && (
          <>
            <label htmlFor="language">Preferred Language:</label>
            <select
              id="language"
              name="language"
              value={formData.language}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
            </select>
          </>
        )}

        {/* Step 6: ID Document Upload */}
        {currentStep === 5 && (
          <>
            <label htmlFor="idDocument">Government ID Upload :</label>
            <input
              type="file"
              id="idDocument"
              name="idDocument"
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowModal(true)} // Trigger modal on click
              className="btn info-btn"
            >
              Why do we need this?
            </button>
          </>
        )}

        {/* Step 7: Bank Statement Upload */}
        {currentStep === 6 && (
          <>
            <label htmlFor="bankStatement">Bank Statement Upload :</label>
            <input
              type="file"
              id="bankStatement"
              name="bankStatement"
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowModal(true)} // Trigger modal on click
              className="btn info-btn"
            >
              Why do we need this?
            </button>
          </>
        )}

        <div className="navigation-buttons">
          {currentStep > 0 && (
            <button type="button" onClick={handleBack} className="btn">Back</button>
          )}
          {currentStep < 6 ? (
            <button type="button" onClick={handleNext} className="btn">Next</button>
          ) : (
            <button type="submit" className="btn">Register</button>
          )}
        </div>
      </form>

      {/* Modal for Important Documents */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-content">
              <h2>Important Documents Needed</h2>
              <p>
                To ensure your profile is fully verified and secure, please upload
                your government ID and bank statement. These documents help us provide
                a smooth and trustworthy experience when you start bidding and trading.
              </p>
              <div className="modal-buttons">
                <button onClick={handleCloseModal} className="btn">
                  Got it, thanks!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegisterPage;