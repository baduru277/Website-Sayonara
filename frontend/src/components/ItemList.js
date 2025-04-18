import React from 'react';
import './ItemList.css';

const ItemList = () => {
  const items = [
    { id: 1, name: 'Vintage Watch', description: 'A timeless classic.', category: 'Bid' },
    { id: 2, name: 'Handmade Wooden Chair', description: 'Perfect for any living room.', category: 'Exchange' },
    { id: 3, name: 'Leather Wallet', description: 'Sleek and durable.', category: 'Buy/Sell' },
    { id: 4, name: 'Wireless Headphones', description: 'High-quality sound and comfort.', category: 'Bid' },
  ];

  return (
    <section className="item-list">
      <h2>Featured Items</h2>
      <div className="items">
        {items.map((item) => (
          <div key={item.id} className="item-card">
            <img src={`https://via.placeholder.com/150?text=${item.name}`} alt={item.name} />
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <span className="item-category">{item.category}</span>
            <button className="btn-view">View Item</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ItemList;
