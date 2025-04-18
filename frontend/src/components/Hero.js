import React, { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa"; // You can remove this import as well
import { Link } from "react-router-dom"; // Import Link for navigation
import "./Hero.css";

const categories = {
  Electronics: ["Laptop", "Phone", "Headphones"],
  Furniture: ["Table", "Chair", "Lamp"],
  Stationery: ["Notebook", "Pen", "Pencil"]
};

const Hero = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Handle search input change (for item/category search)
  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      // Flatten the categories into a list of items with their category names
      const filtered = Object.entries(categories)
        .flatMap(([category, items]) =>
          items.map(item => ({
            category,
            item
          }))
        )
        .filter(({ item }) => item.toLowerCase().includes(value.toLowerCase()))
        .map(({ item }) => item);  // We only need the item name

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
          {/* Removed Location Selector */}
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

          {/* Link to Exchange Page while keeping the button nature */}
          <Link to="/exchange">
            <button className="btn-secondary">Exchange</button>
          </Link>

          <button className="btn-tertiary">Buy/Sell</button>
        </div>
      </div>
    </section>
  );
};

export default Hero;