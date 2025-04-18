import React from 'react';
import './FeaturedListings.css';

const FeaturedListings = () => (
  <section className="featured-listings">
    <h2>Exchange & Bidding Highlights</h2>
    <div className="listing-grid">
      {/* Dynamic barter and bidding items */}
      <div className="listing-item">
        <img src="item1.jpg" alt="Item 1" />
        <h3>Vintage Guitar</h3>
        <p>Starting Bid: $150 | Open for Barter</p>
        <p>Condition: Excellent</p>
      </div>
      <div className="listing-item">
        <img src="item2.jpg" alt="Item 2" />
        <h3>Antique Clock</h3>
        <p>Starting Bid: $75 | Willing to Trade for Electronics</p>
        <p>Condition: Good</p>
      </div>
      <div className="listing-item">
        <img src="item3.jpg" alt="Item 3" />
        <h3>Mountain Bike</h3>
        <p>Starting Bid: $200 | Looking for Outdoor Gear</p>
        <p>Condition: Like New</p>
      </div>
      {/* Add more items as needed */}
    </div>
  </section>
);

export default FeaturedListings;

