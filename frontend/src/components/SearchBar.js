import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";  // Import the map icon
import "./Hero.css";

const indianCities = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad",
  "Chennai", "Kolkata", "Surat", "Pune", "Jaipur", "Lucknow"
];

const categories = {
  Electronics: ["Laptop", "Phone", "Headphones"],
  Furniture: ["Table", "Chair", "Lamp"],
  Stationery: ["Notebook", "Pen", "Pencil"]
};

const locationList = [
  { name: "Mumbai" },
  { name: "Delhi" },
  { name: "Bangalore" },
  { name: "Hyderabad" },
  { name: "Ahmedabad" },
  { name: "Chennai" },
  { name: "Kolkata" },
  { name: "Surat" },
  { name: "Pune" },
  { name: "Jaipur" },
  { name: "Lucknow" }
];

const Hero = () => {
  const [selectedLocation, setSelectedLocation] = useState("Select Location");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Handle location change
  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  // Handle search input change (for item/category search)
  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      const filtered = [...Object.values(categories).flat()].filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredItems(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setFilteredItems([]);
      setShowSuggestions(false);
    }
  };

  // Handle suggestion click (when a user selects an item from the suggestions)
  const handleSuggestionClick = (item) => {
    setSearchTerm(item);
    setShowSuggestions(false);
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Welcome to Exchange & Bidding Platform</h1>
        <p>Your ultimate destination for trading and auctions.</p>

        {/* Search Bar */}
        <div className="search-container">
          {/* Left: Location Dropdown */}
          <div className="left-search">
            <div className="location-selector">
              <FaMapMarkerAlt className="location-icon" />
              <select onChange={handleLocationChange} value={selectedLocation}>
                <option value="Select Location">Select Location</option>
                {locationList.map((loc, index) => (
                  <option key={index} value={loc.name}>{loc.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Right: Item Search */}
          <div className="right-search">
            <input
              type="text"
              className="search-bar"
              placeholder="Search items, categories, or features"
              value={searchTerm}
              onChange={handleInputChange}
              onFocus={() => setShowSuggestions(true)}
            />
            {showSuggestions && filteredItems.length > 0 && (
              <ul className="suggestions-dropdown">
                {filteredItems.map((item, index) => (
                  <li
                    key={index}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(item)}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="hero-buttons">
          <button className="btn-primary">Start Bidding</button>
          <button className="btn-secondary">Exchange</button>
          <button className="btn-tertiary">Buy/Sell</button>
        </div>
      </div>
    </section>
  );
};

export default Hero;