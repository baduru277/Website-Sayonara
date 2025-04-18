// src/components/ListingCard.js
import React from 'react';

const ListingCard = ({ title, category, description, exchangeItem }) => (
  <div className="card">
    <h3 className="font-bold text-lg">{title}</h3>
    <p className="text-sm text-gray-500">{category}</p>
    <p>{description}</p>
    <p className="text-sm text-gray-700"><strong>Desired Exchange:</strong> {exchangeItem}</p>
  </div>
);

export default ListingCard;