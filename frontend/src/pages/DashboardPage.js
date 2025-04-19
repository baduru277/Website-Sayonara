import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./DashboardPage.css";

const Dashboard = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // New state for success message
  const [itemData, setItemData] = useState({
    name: "",
    description: "",
    purchaseDate: "",
    warranty: "No",
    durability: "Medium",
    category: "Exchange",
  });

  // Handle Image Upload
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  // Handle Input Changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setItemData({ ...itemData, [name]: value });
  };

  // Handle Form Submission
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Item Submitted:", itemData);

    // Show success message
    setSuccessMessage("🔥 Boom! Your item is live. Time to trade!");

    // Hide form
    setShowForm(false);

    // Clear success message after 3 seconds
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div className="dashboard-container">
      {/* Profile Card - Stays on Left */}
      <div className="profile-card">
        <div className="profile-image-container">
          <img
            src={profileImage || "https://via.placeholder.com/100"}
            alt="Profile"
            className="profile-image"
          />
          <label htmlFor="upload-photo" className="edit-photo-btn">📷 Edit Photo</label>
          <input
            type="file"
            id="upload-photo"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>

        <h2>Yo, avdpr! 👋</h2>
        <p>OG since 4 days ago 🚀</p>
        <p>0 Followers | 0 Following</p>
        <p>Verified Flex ✅</p>

        <Link to="/dashboard/profile" className="btn-edit">Edit Profile</Link>
        <button className="btn-share">Share Profile</button>
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-content">
        <h1 className="welcome-message">🚀 Wassup, warrior! Time to dominate the barter game. Let’s make some fire deals! 🔥💰</h1>

        <div className="add-item-container">
          {/* Centered Add Button with Hint */}
          {!showForm && (
            <div className="button-container">
              <p className="hint-text">🚀 Ready to make some fire trades? Click below to start! 🔥</p>
              <button className="btn-add-item" onClick={() => setShowForm(true)}>🔥 Drop your fire trade</button>
            </div>
          )}

          {/* Add Item Form (Appears Below Button) */}
          {showForm && (
            <div className="add-item-form">
              <button className="btn-close" onClick={() => setShowForm(false)}>✖</button>
              <h2>Add Item</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Item Name"
                  value={itemData.name}
                  onChange={handleInputChange}
                  required
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={itemData.description}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="date"
                  name="purchaseDate"
                  value={itemData.purchaseDate}
                  onChange={handleInputChange}
                  required
                />
                <select name="warranty" value={itemData.warranty} onChange={handleInputChange}>
                  <option value="Yes">✅ Warranty Available</option>
                  <option value="No">❌ No Warranty</option>
                </select>
                <select name="durability" value={itemData.durability} onChange={handleInputChange}>
                  <option value="Low">🔴 Low Durability</option>
                  <option value="Medium">🟡 Medium Durability</option>
                  <option value="High">🟢 High Durability</option>
                </select>
                <select name="category" value={itemData.category} onChange={handleInputChange}>
                  <option value="Exchange">🔄 Exchange</option>
                  <option value="Bid">🏆 Bid</option>
                  <option value="Resell">💰 Resell</option>
                </select>
                <button type="submit" className="btn-submit">Add Item</button>
              </form>
            </div>
          )}

          {/* Success Message (Appears after submission) */}
          {successMessage && <p className="success-message">{successMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;