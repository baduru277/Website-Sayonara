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
    images: ['https://images.unsplash.com/photo-1592286927505-1def25115558?w=500', 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=500'],
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
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500'],
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
  {
    id: 'dummy3',
    title: 'Samsung Galaxy S21 Ultra',
    description: '12GB RAM, 256GB storage. Minor screen scratches only. All accessories included.',
    images: ['https://images.unsplash.com/photo-1511454612769-005b144b2b13?w=500'],
    category: 'Smartphones',
    condition: 'Good',
    type: 'resell',
    priority: 'medium',
    location: 'Delhi, Delhi',
    isActive: true,
    isFeatured: false,
    views: 156,
    price: 45000,
    originalPrice: 65000,
    discount: 31,
    stock: 1,
    shipping: 'Standard Shipping',
    isPrime: false,
    fastShipping: false,
    tags: ['Samsung', 'Smartphone'],
    createdAt: '2025-10-21T09:15:00Z',
    updatedAt: '2025-10-21T09:15:00Z',
    userId: 'seller3',
    seller: {
      id: 'seller3',
      name: 'Mobile Solutions',
      rating: 4.3,
      totalReviews: 89,
      isVerified: true,
      isPrime: false
    }
  },
];

export default function ResellPage() {
  const [items, setItems] = useState<ResellItem[]>(DUMMY_ITEMS);
  const [selectedItem, setSelectedItem] = useState<ResellItem | null>(DUMMY_ITEMS[0]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        // TODO: Uncomment to use real API
        // const response = await apiService.getItems({ type: 'resell', limit: 50 });
        // const fetchedItems = response.items || [];
        // setItems(fetchedItems);
        // if (fetchedItems.length > 0) setSelectedItem(fetchedItems[0]);
        
        setTimeout(() => setLoading(false), 300);
      } catch (err) {
        console.error('Error fetching items:', err);
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
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p>Loading...</p></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Direct Purchase</h1>
          <p className="text-gray-600 text-sm">Buy directly from verified sellers</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Product Detail Section */}
        {selectedItem && (
          <div className="bg-white rounded-lg shadow mb-8 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Left: Images */}
              <div className="lg:col-span-1">
                <div className="bg-gray-100 rounded-lg p-4 mb-4">
                  <div className="relative w-full aspect-square rounded overflow-hidden">
                    <Image
                      src={selectedItem.images[0]}
                      alt={selectedItem.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
                {selectedItem.images.length > 1 && (
                  <div className="flex gap-2">
                    {selectedItem.images.map((img, idx) => (
                      <div key={idx} className="w-14 h-14 rounded border border-gray-300 overflow-hidden cursor-pointer">
                        <Image src={img} alt={`View ${idx}`} width={56} height={56} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Middle: Info */}
              <div className="lg:col-span-1">
                <h1 className="text-xl font-bold text-gray-900 mb-3">{selectedItem.title}</h1>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-yellow-400">★★★★★</span>
                  <span className="text-sm text-gray-600">{selectedItem.seller.rating} ({selectedItem.seller.totalReviews})</span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{selectedItem.description}</p>
                <div className="flex gap-2 mb-4">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{selectedItem.category}</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">{selectedItem.condition}</span>
                </div>
                <p className="text-xs text-gray-600 mb-2">📍 {selectedItem.location}</p>
              </div>

              {/* Right: Price & Action */}
              <div className="lg:col-span-1 border-l border-gray-200 pl-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">₹{selectedItem.price.toLocaleString()}</div>
                {selectedItem.originalPrice && (
                  <p className="text-sm text-gray-600 mb-4">
                    <span className="line-through">₹{selectedItem.originalPrice.toLocaleString()}</span>
                    {selectedItem.discount && <span className="ml-2 text-green-600 font-semibold">{selectedItem.discount}% off</span>}
                  </p>
                )}
                <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4 text-xs">
                  <p className="font-semibold text-blue-900">🚚 FREE Shipping</p>
                  <p className="text-blue-800">Delivery in 3-5 days</p>
                </div>
                <button
                  onClick={handleChatClick}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm transition mb-2"
                >
                  💬 Chat with Seller
                </button>
                <div className="text-xs bg-gray-100 rounded p-3">
                  <p className="font-semibold text-gray-900 mb-1">Sold by: {selectedItem.seller.name}</p>
                  {selectedItem.seller.isVerified && <p className="text-green-600">✓ Verified Seller</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid - Amazon Style */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">More Items ({items.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {items.map(item => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow group"
              >
                {/* Image */}
                <div className="relative w-full aspect-square bg-gray-100 rounded overflow-hidden mb-2">
                  <Image
                    src={item.images[0]}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                {/* Title */}
                <h3 className="text-xs font-semibold text-gray-900 line-clamp-2 mb-2 h-8">
                  {item.title}
                </h3>

                {/* Price */}
                <div className="mb-1">
                  <span className="text-sm font-bold text-gray-900">₹{item.price.toLocaleString()}</span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 text-xs mb-2">
                  <span className="text-yellow-400">★</span>
                  <span className="text-gray-600">{item.seller.rating}</span>
                  <span className="text-gray-500">({item.seller.totalReviews})</span>
                </div>

                {/* Location */}
                <p className="text-xs text-gray-600 truncate">📍 {item.location}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
