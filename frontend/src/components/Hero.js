import React, { useState } from "react";
import { Link } from "react-router-dom";
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

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      const matchedItems = Object.entries(categories)
        .flatMap(([category, items]) =>
          items.map((item) => ({
            category,
            item
          }))
        )
        .filter(({ item }) => item.toLowerCase().includes(value.toLowerCase()));

      setFilteredItems(matchedItems);
      setShowSuggestions(matchedItems.length > 0);
    } else {
      setFilteredItems([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (item) => {
    setSearchTerm(item);
    setShowSuggestions(false);
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Welcome to Exchange & Bidding Platform</h1>
        <p>Your ultimate destination for trading and auctions.</p>

        <div className="search-container">
          <div className="right-search">
            {/* Mirror text underneath input */}
            <div className="search-bar-wrapper">
              {searchTerm && (
                <div className="search-bar-mirror">
                  🔍 {searchTerm}
                </div>
              )}
              <input
                type="text"
                className="search-bar"
                placeholder="Search items like 'phone', 'chair', or 'pen'"
                value={searchTerm}
                onChange={handleInputChange}
                onFocus={() => setShowSuggestions(true)}
              />
            </div>

            {showSuggestions && (
              <ul className={`suggestions-dropdown ${filteredItems.length ? "show" : ""}`}>
                {filteredItems.map(({ item, category }, index) => (
                  <li
                    key={index}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(item)}
                  >
                    {item} <span className="category-label">({category})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="hero-buttons">
          <button className="btn-primary">Start Bidding</button>
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