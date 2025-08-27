'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProductGrid from '@/components/ProductGrid';

interface ResellItem {
  id: string;
  title: string;
  description: string;
  image: string;
  images: string[];
  category: string;
  condition: string;
  price: number;
  originalPrice: number;
  discount: number;
  shipping: string;
  location: string;
  postedDate: string;
  userRating: number;
  userReviews: number;
  isVerified: boolean;
  priority: 'high' | 'medium' | 'low';
  fastShipping: boolean;
  tags: string[];
}

const mockResellItems: ResellItem[] = [
  {
    id: '4',
    title: 'The Legend of Zelda: Tears of the Kingdom (Nintendo Switch)',
    description: 'Brand new, sealed copy of the latest Zelda game for Nintendo Switch.',
    image: '/images/zelda.jpg',
    images: ['/images/zelda.jpg', '/images/zelda-2.jpg'],
    category: 'Games',
    condition: 'New',
    price: 59.99,
    originalPrice: 69.99,
    discount: 15,
    shipping: 'Free Shipping',
    location: 'Tokyo, Japan',
    postedDate: '2025-08-25',
    userRating: 4.9,
    userReviews: 120,
    isVerified: true,
    priority: 'high',
    fastShipping: true,
    tags: ['Game', 'Nintendo', 'Switch'],
  }, // 👈 comma if more items follow; remove if it's the only one
  // { ...another item... },
];
export default function ResellPage() {
  const [resellItems, setResellItems] = useState<ResellItem[]>(mockResellItems);
  const [selectedItem, setSelectedItem] = useState<ResellItem | null>(mockResellItems[0]);

  // Get 3 suggested items (excluding the selected item)
  const getSuggestedItems = (currentItem: ResellItem) => {
    return resellItems
      .filter(item => item.id !== currentItem.id)
      .slice(0, 3);
  };

  if (!selectedItem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No items available</h3>
          <p className="text-gray-600">There are currently no items available for purchase.</p>
        </div>
      </div>
    );
  }

  const suggestedItems = getSuggestedItems(selectedItem);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Direct Purchase</h1>
          <p className="text-gray-600 mt-1">Buy items directly from verified sellers</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Main Item */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4">
                <Image
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/300x300/924DAC/FFFFFF?text=Item+Image';
                  }}
                />
                {selectedItem.discount > 0 && (
                  <div className="absolute top-4 right-4">
                    <div className="px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white">
                      -{selectedItem.discount}%
                    </div>
                  </div>
                )}
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {selectedItem.title}
              </h2>
              
              <p className="text-gray-600 text-sm mb-4">
                {selectedItem.description}
              </p>

              <div className="flex items-center gap-4 mb-4">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {selectedItem.category}
                </span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  {selectedItem.condition}
                </span>
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                  {selectedItem.priority} priority
                </span>
              </div>

              <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-2xl font-bold text-gray-900">
                    ${selectedItem.price.toFixed(2)}
                  </span>
                  {selectedItem.originalPrice > selectedItem.price && (
                    <span className="text-sm text-gray-500 line-through">
                      ${selectedItem.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {selectedItem.shipping === 'Free' ? '🚚 Free shipping' : `🚚 ${selectedItem.shipping} shipping`}
                </div>
                {selectedItem.fastShipping && (
                  <div className="text-sm font-medium text-green-600">
                    ⚡ Fast delivery
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>Rating: {selectedItem.userRating} ({selectedItem.userReviews} reviews)</span>
                <span>{selectedItem.location}</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {selectedItem.tags.map(tag => (
                  <span key={tag} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <Link
                  href="/messages"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-center"
                >
                  Chat with Seller
                </Link>
                <Link
                  href={`/resell/${selectedItem.id}`}
                  className="flex-1 border border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-4 py-2 rounded-lg font-medium transition-colors text-center"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>

          {/* Right Side - Suggested Items */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Similar Items</h3>
            
            <div className="space-y-4">
              {suggestedItems.map((item) => (
                <div 
                  key={item.id} 
                  className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="flex gap-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/300x300/924DAC/FFFFFF?text=Item+Image';
                        }}
                      />
                      {item.discount > 0 && (
                        <div className="absolute top-1 right-1">
                          <div className="px-1 py-0.5 rounded text-xs font-bold bg-red-600 text-white">
                            -{item.discount}%
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">
                        {item.title}
                      </h4>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {item.category}
                        </span>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          {item.condition}
                        </span>
                      </div>
                      
                      <div className="mb-2">
                        <span className="text-sm font-bold text-gray-900">
                          ${item.price.toFixed(2)}
                        </span>
                        {item.originalPrice > item.price && (
                          <span className="text-xs text-gray-500 line-through ml-1">
                            ${item.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Rating: {item.userRating}</span>
                        <span>{item.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {suggestedItems.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No similar items available</p>
              </div>
            )}
          </div>
        </div>

                 {/* Product Grid */}
         <div className="mt-8">
           <h3 className="text-lg font-semibold text-gray-900 mb-6">All Available Items</h3>
           <ProductGrid
             items={resellItems.map(item => ({
               ...item,
               type: 'resell' as const,
               isPrime: item.fastShipping,
               deliveryDate: 'Monday 11 August',
               limitedTimeDeal: item.discount > 30
             }))}
             onItemClick={(selectedItem) => {
               setSelectedItem(selectedItem as any);
             }}
           />
         </div>
      </div>
    </div>
  );
} 