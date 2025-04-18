import React from "react";
import "./ProfileOverview.css";

// StatItem component to render individual stats
const StatItem = ({ label, value }) => (
  <div className="stat-item">
    <h4>{value}</h4>
    <p>{label}</p>
  </div>
);

const ProfileOverview = () => {
  // Example user data (Replace with actual user data from API or state)
  const user = {
    name: "John Doe",
    email: "johndoe@example.com",
    profilePic: "https://via.placeholder.com/100", // Placeholder image
    listings: 5,
    bids: 10,
    transactions: 3,
    isActive: true, // New field to indicate activity status
  };

  return (
    <section className="profile-overview">
      <header className="profile-header">
        <img
          src={user.profilePic || "https://via.placeholder.com/100"}
          alt="User Profile"
          className="profile-pic"
        />
        <div className="profile-info">
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <span className={`status-badge ${user.isActive ? "active" : "inactive"}`}>
            {user.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </header>

      <section className="profile-stats">
        <StatItem label="Listings" value={user.listings} />
        <StatItem label="Bids" value={user.bids} />
        <StatItem label="Transactions" value={user.transactions} />
      </section>
    </section>
  );
};

export default ProfileOverview;