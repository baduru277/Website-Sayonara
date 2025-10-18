// components/ItemDetailClient.tsx
'use client'; // This is a Client Component

import React from 'react';

// Define the expected shape of the item prop
interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  type: 'resell' | 'exchange' | 'bid';
  images: string[];
  tags: string[];
  location: string;
  views: number;
  createdAt: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

interface ItemDetailClientProps {
  item: Item;
}

const ItemDetailClient: React.FC<ItemDetailClientProps> = ({ item }) => {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">{item.title}</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Item Images */}
        <div className="md:w-1/2">
          {item.images && item.images.length > 0 ? (
            <img
              src={item.images[0]} // Display the first image
              alt={item.title}
              className="w-full h-96 object-cover rounded-lg shadow-md"
            />
          ) : (
            <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-lg text-gray-500">
              No Image Available
            </div>
          )}
          {/* Add a gallery for multiple images if needed */}
        </div>

        {/* Item Details */}
        <div className="md:w-1/2 flex flex-col justify-between">
          <div>
            <p className="text-gray-700 mb-4">{item.description}</p>
            <p className="text-lg">
              <strong>Category:</strong> {item.category}
            </p>
            <p className="text-lg">
              <strong>Condition:</strong> {item.condition}
            </p>
            <p className="text-lg">
              <strong>Type:</strong> {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            </p>
            {/* Display type-specific details */}
            {item.type === 'resell' && (
              <p className="text-lg text-green-600 font-semibold">
                <strong>Price:</strong> ₹{item.price?.toFixed(2)}
              </p>
            )}
            {item.type === 'exchange' && (
              <p className="text-lg">
                <strong>Exchange For:</strong> {item.exchangeFor}
              </p>
            )}
            {item.type === 'bid' && (
              <p className="text-lg">
                <strong>Min Bid:</strong> ₹{item.minBid?.toFixed(2)}
              </p>
            )}
            <p className="text-lg">
              <strong>Location:</strong> {item.location}
            </p>
            <p className="text-lg">
              <strong>Views:</strong> {item.views}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Posted on: {new Date(item.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Seller Information */}
          <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-inner">
            <h3 className="text-xl font-semibold mb-2">Seller Information</h3>
            <p>
              <strong>Username:</strong> {item.user.username}
            </p>
            <p>
              <strong>Email:</strong> {item.user.email}
            </p>
            {/* Add contact button or link to seller profile */}
            <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Contact Seller
            </button>
          </div>
        </div>
      </div>

      {/* Tags */}
      {item.tags && item.tags.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetailClient;
