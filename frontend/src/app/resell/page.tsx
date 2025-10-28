'use client';

import { useState, useEffect } from 'react';
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

// Dummy data for preview
const DUMMY_ITEMS: ResellItem[] = [
  {
    id: 'dummy1',
    title: 'iPhone 13 Pro Max - Silver',
    description: 'Barely used iPhone 13 Pro Max in perfect condition. Original box and accessories included. No scratches or damage.',
    images: ['https://images.unsplash.com/photo-1592286927505-1def25115558?w=800', 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=800'],
    category: 'Smartphones',
    condition: 'Like New',
    type: 'resell',
    priority: 'high',
    location: 'Mumbai, Maharashtra',
    isActive: true,
    isFeatured: true,
    views: 245,
    price: 75000,
    originalPrice: 99999,
    discount: 25,
    stock: 1,
    shipping: 'Free Standard Shipping',
    isPrime: true,
    fastShipping: true,
    tags: ['Apple', 'Smartphone', 'Premium'],
    createdAt: '2025-10-20T10:30:00Z',
    updatedAt: '2025-10-20T10:30:00Z',
    userId: 'seller1',
    seller: {
      id: 'seller1',
      name: 'Tech Store Mumbai',
      rating: 4.8,
      totalReviews: 324,
      isVerified: true,
      isPrime: true
    }
  },
  {
    id: 'dummy2',
    title: 'MacBook Air M1 - Space Gray',
    description: '8GB RAM, 256GB SSD. Very light usage, screen protector applied. Includes charger.',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'],
    category: 'Computers',
    condition: 'Excellent',
    type: 'resell',
    priority: 'high',
    location: 'Bangalore, Karnataka',
    isActive: true,
    isFeatured: false,
    views: 189,
    price: 65000,
    originalPrice: 89999,
    discount: 27,
    stock: 1,
    shipping: 'Free Shipping',
    isPrime: true,
    fastShipping: true,
    tags: ['Apple', 'Laptop', 'M1'],
    createdAt: '2025-10-22T14:20:00Z',
    updatedAt: '2025-10-22T14:20:00Z',
    userId: 'seller2',
    seller: {
      id: 'seller2',
      name: 'ElectroHub',
      rating: 4.6,
      totalReviews: 156,
      isVerified: true,
      isPrime: false
    }
  },
];

export default function ResellPage() {
  const [items, setItems] = useState<ResellItem[]>(DUMMY_ITEMS);
  const [selectedItem, setSelectedItem] = useState<ResellItem | null>(DUMMY_ITEMS[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        // TODO: Comment out dummy data and uncomment API call below
        // const response = await apiService.getItems({ type: 'resell', limit: 50 });
        // const fetchedItems = response.items || [];
        // setItems(fetchedItems);
        // if (fetchedItems.length > 0) setSelectedItem(fetchedItems[0]);
        
        // For now, using dummy data
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (err) {
        console.error('Error fetching items:', err);
        setError('Failed to load items');
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

  if (error || !items.length) {
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
          <h1 className="text-3xl font-bold text-gray-900">Direct Purchase</h1>
          <p className="text-gray-600 text-sm">Buy directly from verified sellers</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {selectedItem && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Left: Product Images */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-4 sticky top-24">
                {/* Main Image */}
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
                  <Image
                    src={selectedItem.images[0]}
                    alt={selectedItem.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  {selectedItem.isFeatured && (
                    <div className="absolute top-3 left-3 bg-yellow-500 text-white px-3 py-1 rounded-full font-bold text-xs">
                      ⭐ Featured
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {selectedItem.images.length > 1 && (
                  <div className="flex gap-2">
                    {selectedItem.images.map((img, idx) => (
                      <div key={idx} className="w-16 h-16 rounded border-2 border-gray-200 overflow-hidden cursor-pointer hover:border-blue-500 transition">
                        <Image
                          src={img}
                          alt={`View ${idx + 1}`}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Center: Product Details */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-900 mb-3">{selectedItem.title}</h1>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-lg ${i < Math.round(selectedItem.seller.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {selectedItem.seller.rating} ({selectedItem.seller.totalReviews} reviews)
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-4">{selectedItem.description}</p>

                {/* Tags */}
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    {selectedItem.category}
                  </span>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    {selectedItem.condition}
                  </span>
                  {selectedItem.fastShipping && (
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                      ⚡ Fast Shipping
                    </span>
                  )}
                </div>

                {/* Product Tags */}
                <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b">
                  {selectedItem.tags.map(tag => (
                    <span key={tag} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Location & Date */}
                <div className="text-sm text-gray-600">
                  <p className="mb-2">📍 {selectedItem.location}</p>
                  <p>📅 Posted on {new Date(selectedItem.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Right: Price & Action */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-24">
                {/* Price */}
                <div className="mb-6 pb-6 border-b">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    ₹{selectedItem.price.toLocaleString()}
                  </div>
                  {selectedItem.originalPrice && selectedItem.discount && (
                    <p className="text-sm text-gray-600">
                      <span className="line-through">₹{selectedItem.originalPrice.toLocaleString()}</span>
                      <span className="ml-2 text-green-600 font-semibold">{selectedItem.discount}% off</span>
                    </p>
                  )}
                </div>

                {/* Shipping */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-semibold text-blue-900 mb-1">🚚 Shipping</p>
                  <p className="text-sm text-blue-800">{selectedItem.shipping || 'Standard Shipping'}</p>
                  <p className="text-xs text-blue-700 mt-1">Estimated: 3-5 business days</p>
                </div>

                {/* Priority */}
                <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Priority:</span> <span className="capitalize font-medium">{selectedItem.priority}</span>
                  </p>
                </div>

                {/* Chat Button */}
                <button
                  onClick={handleChatClick}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition mb-4 text-lg"
                >
                  💬 Chat with Seller
                </button>

                {/* Seller Info */}
                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-600 mb-3">Sold by</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900">{selectedItem.seller.name}</p>
                      <p className="text-xs text-gray-600">{selectedItem.seller.totalReviews} transactions</p>
                      {selectedItem.seller.isVerified && (
                        <p className="text-xs text-green-600 font-semibold mt-1">✓ Verified Seller</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* More Items Grid */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">More Items ({items.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {items.map(item => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
                  <Image
                    src={item.images[0]}
                    alt={item.title}
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Info */}
                <div className="p-3">
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2">
                    {item.title}
                  </h3>

                  <div className="text-lg font-bold text-gray-900 mb-2">
                    ₹{item.price.toLocaleString()}
                  </div>

                  <div className="text-xs text-gray-600 mb-2">
                    📍 {item.location}
                  </div>

                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-yellow-400">★</span>
                    <span className="text-gray-600">{item.seller.rating} ({item.seller.totalReviews})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
