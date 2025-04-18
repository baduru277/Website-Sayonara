import React, { useState, useEffect } from "react";
import axios from "axios";
import './BiddingPage.css'; // Your styles

const ProductCard = ({ product, placeBid }) => (
  <div className="product-card" key={product.id}>
    <h3>{product.name}</h3>
    <p>{product.description}</p>
    <p>Base Price: ${product.basePrice}</p>
    <button onClick={() => placeBid(product.id, product.basePrice, product.highestBid)}>
      Place Bid
    </button>
  </div>
);

const LoadingIndicator = () => (
  <div className="loading">
    <p>Loading products...</p>
    <div className="spinner"></div>
  </div>
);

const BiddingPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from backend or use dummy data
  useEffect(() => {
    // Simulate API call with dummy data
    setTimeout(() => {
      const dummyProducts = [
        {
          id: 1,
          name: "Vintage Watch",
          description: "A classic vintage watch, perfect for collectors.",
          basePrice: 100,
          highestBid: 120
        },
        {
          id: 2,
          name: "Leather Jacket",
          description: "Stylish leather jacket in perfect condition.",
          basePrice: 150,
          highestBid: 170
        },
        {
          id: 3,
          name: "Smartphone",
          description: "Latest smartphone with excellent features.",
          basePrice: 600,
          highestBid: 620
        },
      ];
      setProducts(dummyProducts);
      setLoading(false);
    }, 1500); // Simulate loading delay
  }, []);

  const placeBid = (productId, basePrice, highestBid) => {
    const bidAmount = prompt("Enter your bid:");

    if (!bidAmount || isNaN(bidAmount) || bidAmount <= 0) {
      alert("Please enter a valid bid amount.");
      return;
    }

    if (parseFloat(bidAmount) <= highestBid) {
      alert(`Your bid should be higher than the current highest bid of $${highestBid}.`);
      return;
    }

    // Mock sending the bid to backend
    alert(`Your bid of $${bidAmount} has been placed!`);
    // Optionally, update the highest bid locally
    setProducts(products.map(product =>
      product.id === productId
        ? { ...product, highestBid: bidAmount }
        : product
    ));
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="bidding-container">
      <h1>Bidding for Products</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="product-list">
        {products.map(product => (
          <ProductCard key={product.id} product={product} placeBid={placeBid} />
        ))}
      </div>
    </div>
  );
};

export default BiddingPage;