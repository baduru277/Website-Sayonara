import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ExchangePage.css'; // Your styles

const initialItems = [
  {
    title: 'Vintage Guitar',
    category: 'Musical Instruments',
    description: 'A classic acoustic guitar in excellent condition.',
    desiredExchange: 'Smartphone',
    imageUrl: 'https://via.placeholder.com/150',
    contact: 'user1@example.com'
  },
  {
    title: 'Mountain Bike',
    category: 'Sports & Outdoors',
    description: 'A well-maintained mountain bike, perfect for rough terrains.',
    desiredExchange: 'Laptop',
    imageUrl: 'https://via.placeholder.com/150',
    contact: 'user2@example.com'
  },
  {
    title: 'Gaming Console',
    category: 'Electronics',
    description: 'A latest-gen gaming console with controllers.',
    desiredExchange: 'Camera',
    imageUrl: 'https://via.placeholder.com/150',
    contact: 'user3@example.com'
  }
];

const ExchangePage = ({ isLoggedIn }) => {
  const [items] = useState(initialItems);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Handle the category change
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  // Filter items based on selected category
  const filteredItems = selectedCategory === 'All' ? items : items.filter(item => item.category === selectedCategory);

  return (
    <div className="exchange-page">
      <h1>Exchange Marketplace</h1>
      <p>Browse and trade items with others.</p>

      {/* Conditionally render the Add New Item link based on login status */}
      {isLoggedIn ? (
        <Link to="/listing-form" className="add-item-link">Add a New Item</Link>
      ) : (
        <p>Please <Link to="/login">Login</Link> or <Link to="/register">Register</Link> to add items.</p>
      )}

      {/* Search and Filter Section */}
      <div className="search-filter">
        <input type="text" placeholder="Search for items..." />
        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="All">All Categories</option>
          <option value="Musical Instruments">Musical Instruments</option>
          <option value="Sports & Outdoors">Sports & Outdoors</option>
          <option value="Electronics">Electronics</option>
        </select>
      </div>

      {/* Listings Grid */}
      {filteredItems.length > 0 ? (
        <div className="item-grid">
          {filteredItems.map((item, index) => (
            <div key={index} className="item-card">
              <img src={item.imageUrl} alt={item.title} className="item-image" />
              <div className="item-details">
                <h3 className="item-title">{item.title}</h3>
                <p className="item-category">{item.category}</p>
                <p className="item-description">{item.description}</p>
                <p className="item-exchange"><strong>Looking for:</strong> {item.desiredExchange}</p>
                <p className="item-contact"><strong>Contact:</strong> <a href={`mailto:${item.contact}`}>{item.contact}</a></p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-items">No items listed yet. Be the first to post!</p>
      )}
    </div>
  );
};

export default ExchangePage;