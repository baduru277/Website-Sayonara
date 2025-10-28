'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import apiService from '@/services/api';

interface SellerInfo {
  id: string;
  name: string;
  rating: number;
  totalReviews: number;
  isVerified: boolean;
  isPrime: boolean;
}

interface ResellItem {
  id: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  condition: string;
  type: string;
  priority: string;
  location: string;
  isActive: boolean;
  isFeatured: boolean;
  views: number;
  price: number;
  originalPrice: number | null;
  discount: number | null;
  stock: number;
  shipping: string | null;
  isPrime: boolean;
  fastShipping: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  userId: string;
  seller: SellerInfo;
}

export default function ResellPage() {
  const [items, setItems] = useState<ResellItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ResellItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await apiService.getItems({ type: 'resell', limit: 50 });
        const fetchedItems = response.items || [];
        setItems(fetchedItems);
        if (fetchedItems.length > 0) setSelectedItem(fetchedItems[0]);
      } catch (err) {
        console.error('Error fetching items:', err);
        setError('Failed to load items');
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const handleChatClick = () => {
    if (selectedItem?.seller?.id) {
      router.push(`/messages?sellerId=${selectedItem.seller.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading items...</p>
      </div>
    );
  }

  if (error || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-bold text-gray-900 mb-2">No Items Available</h3>
          <p className="text-gray-600">{error || 'No resell items found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Direct Purchase</h1>
              <p className="text-gray-600 text-sm">Buy directly from verified sellers</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">{items.length} items available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {selectedItem && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Left: Product Images */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
                {/* Main Image */}
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4 flex items-center justify-center">
                  {selectedItem.images && selectedItem.images.length > 0 ? (
                    <Image
                      src={selectedItem.images[0]}
                      alt={selectedItem.title}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/500x500/e5e7eb/6b7280?text=No+Image';
                      }}
                    />
                  ) : (
                    <div className="text-center">
                      <p className="text-gray-400 text-xs">📷 No image available</p>
                      <p className="text-gray-300 text-xs mt-1">Image not uploaded</p>
                    </div>
                  )}
                  {selectedItem.discount && selectedItem.discount > 0 && (
                    <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full font-bold text-sm">
                      -{selectedItem.discount}%
                    </div>
                  )}
                  {selectedItem.isFeatured && (
                    <div className="absolute top-3 left-3 bg-yellow-600 text-white px-3 py-1 rounded-full font-bold text-xs">
                      ⭐ Featured
                    </div>
                  )}
                </div>

                {/* Thumbnail Images */}
                {selectedItem.images && selectedItem.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {selectedItem.images.slice(0, 4).map((img, idx) => (
                      <div key={idx} className="flex-shrink-0 w-16 h-16 rounded border border-gray-300 overflow-hidden cursor-pointer hover:border-purple-500 bg-gray-100">
                        <Image
                          src={img}
                          alt={`Thumbnail ${idx}`}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Views Counter */}
                <div className="text-xs text-gray-500 mt-2">
                  👁️ {selectedItem.views} views
                </div>
              </div>
            </div>

            {/* Center: Product Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                {/* Rating & Reviews */}
                <div className="flex items-center gap-2 mb-3 pb-3 border-b">
                  <div className="flex text-yellow-400">
                    {selectedItem.seller.rating > 0 ? (
                      '★★★★★'.split('').slice(0, Math.round(selectedItem.seller.rating)).map((star, i) => (
                        <span key={i}>{star}</span>
                      ))
                    ) : (
                      <span className="text-gray-400">★ New Seller</span>
                    )}
                  </div>
                  <span className="text-sm text-gray-600">
                    {selectedItem.seller.rating > 0 ? `${selectedItem.seller.rating.toFixed(1)}` : 'No'} ({selectedItem.seller.totalReviews} reviews)
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedItem.title}
                </h1>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {selectedItem.description}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">
                    {selectedItem.category}
                  </span>
                  <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">
                    {selectedItem.condition}
                  </span>
                  {selectedItem.fastShipping && (
                    <span className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full font-medium">
                      ⚡ Fast Shipping
                    </span>
                  )}
                  {selectedItem.seller.isVerified && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full font-medium">
                      ✓ Verified Seller
                    </span>
                  )}
                  {selectedItem.isPrime && (
                    <span className="bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full font-medium">
                      Prime
                    </span>
                  )}
                </div>

                {/* Tags */}
                {selectedItem.tags && selectedItem.tags.length > 0 && (
                  <div className="mb-4 pb-4 border-b">
                    <p className="text-xs text-gray-500 mb-2 font-semibold">Tags:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.tags.map(tag => (
                        <span key={tag} className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 pb-4 border-b">
                  <span>📍</span>
                  <span>{selectedItem.location}</span>
                </div>

                {/* Posted Date */}
                <div className="text-xs text-gray-500">
                  Posted: {new Date(selectedItem.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>

            {/* Right: Price & Action */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                {/* Price Section */}
                <div className="mb-6 pb-6 border-b">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-4xl font-bold text-gray-900">
                      ₹{selectedItem.price.toLocaleString()}
                    </span>
                  </div>
                </div>



                {/* Shipping Info */}
                <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-700 mb-1">🚚 <strong>Shipping</strong></p>
                  <p className="text-sm text-blue-900">
                    {selectedItem.shipping || 'Standard Shipping'}
                  </p>
                  <p className="text-xs text-blue-700 mt-1">Estimated delivery: 3-5 business days</p>
                </div>

                {/* Priority Badge */}
                <div className="mb-6 p-3 bg-purple-50 border border-purple-200 rounded-lg text-center">
                  <p className="text-xs text-purple-700">Priority: <strong>{selectedItem.priority}</strong></p>
                </div>

                {/* Action Button */}
                <button
                  onClick={handleChatClick}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors text-lg"
                >
                  💬 Chat with Seller
                </button>

                {/* Seller Info */}
                <div className="border-t mt-6 pt-4">
                  <p className="text-xs text-gray-600 mb-3">Sold by</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900">{selectedItem.seller.name}</p>
                      <p className="text-xs text-gray-600">
                        {selectedItem.seller.totalReviews} transactions
                      </p>
                      {selectedItem.seller.isVerified && (
                        <p className="text-xs text-green-600 font-medium mt-1">✓ Verified</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Related Products / More Items */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">More Items for Sale</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {items.map(item => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                {/* Image */}
                <div className="relative w-full aspect-square bg-gray-100 overflow-hidden flex items-center justify-center">
                  {item.images && item.images.length > 0 ? (
                    <Image
                      src={item.images[0]}
                      alt={item.title}
                      fill
                      className="object-cover hover:scale-110 transition-transform"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/300x300/e5e7eb/6b7280?text=No+Image';
                      }}
                    />
                  ) : (
                    <p className="text-gray-400 text-xs">📷 No image</p>
                  )}
                  {item.discount && item.discount > 0 && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                      -{item.discount}%
                    </div>
                  )}
                  {item.stock === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-bold text-xs">Out of Stock</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-2">
                    {item.title}
                  </h3>
                  
                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="font-bold text-gray-900">
                      ₹{item.price.toLocaleString()}
                    </span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="text-xs text-gray-500 line-through">
                        ₹{item.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Location */}
                  <p className="text-xs text-gray-600 mb-2">📍 {item.location}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 text-xs">
                    {item.seller.rating > 0 ? (
                      <>
                        <span className="text-yellow-400">★</span>
                        <span className="text-gray-600">
                          {item.seller.rating.toFixed(1)} ({item.seller.totalReviews})
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-600">New seller</span>
                    )}
                  </div>

                  {/* Stock Status */}
                  <p className="text-xs mt-2 font-medium" style={{
                    color: item.stock > 0 ? '#16a34a' : '#dc2626'
                  }}>
                    {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
