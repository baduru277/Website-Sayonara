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
}

interface ResellItem {
  id: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  condition: string;
  type: string;
  location: string;
  isActive: boolean;
  views: number;
  price: number;
  tags: string[];
  createdAt: string;
  seller: SellerInfo;
}

const DUMMY_ITEMS: ResellItem[] = [
  {
    id: 'dummy1',
    title: 'iPhone 15 (128 GB) - Green',
    description: 'Apple iPhone 15 in excellent condition. Perfect working order with original charger and accessories. Minor signs of use.',
    images: ['https://images.unsplash.com/photo-1592286927505-1def25115558?w=800', 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=800', 'https://images.unsplash.com/photo-1592286927505-1def25115558?w=800'],
    category: 'Smartphones',
    condition: 'Like New',
    type: 'resell',
    location: 'Mumbai, Maharashtra',
    isActive: true,
    views: 245,
    price: 50990,
    tags: ['Apple', 'Smartphone', 'iPhone'],
    createdAt: '2025-10-20T10:30:00Z',
    seller: {
      id: 'seller1',
      name: 'Tech Store Mumbai',
      rating: 4.5,
      totalReviews: 324,
      isVerified: true
    }
  },
];

export default function ResellPage() {
  const [items, setItems] = useState<ResellItem[]>(DUMMY_ITEMS);
  const [selectedItem, setSelectedItem] = useState<ResellItem | null>(DUMMY_ITEMS[0]);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState(0);
  const router = useRouter();

  useEffect(() => {
    setLoading(false);
    // TODO: Uncomment for real API
    // const response = await apiService.getItems({ type: 'resell', limit: 50 });
    // setItems(response.items || []);
  }, []);

  const handleChatClick = () => {
    if (selectedItem?.seller?.id) {
      router.push(`/messages?sellerId=${selectedItem.seller.id}`);
    }
  };

  if (!selectedItem) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-3 border-b text-sm text-gray-600">
        <span>Electronics › Mobiles › Smartphones</span>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Images */}
          <div className="lg:col-span-1">
            {/* Main Image */}
            <div className="bg-gray-100 rounded-lg p-4 mb-4 sticky top-4">
              <div className="relative w-full aspect-square bg-gray-50 rounded overflow-hidden flex items-center justify-center">
                <Image
                  src={selectedItem.images[mainImage]}
                  alt={selectedItem.title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2">
              {selectedItem.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(idx)}
                  className={`w-16 h-16 rounded border-2 overflow-hidden ${
                    mainImage === idx ? 'border-blue-600' : 'border-gray-300'
                  }`}
                >
                  <Image src={img} alt={`View ${idx}`} width={64} height={64} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Center: Product Details */}
          <div className="lg:col-span-1">
            {/* Title & Rating */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedItem.title}</h1>
            
            <div className="flex items-center gap-3 mb-6 pb-6 border-b">
              <div className="flex text-yellow-400">
                {'★'.repeat(Math.round(selectedItem.seller.rating)).padEnd(5, '☆')}
              </div>
              <span className="text-blue-600 cursor-pointer hover:underline text-sm">
                {selectedItem.seller.rating} ({selectedItem.seller.totalReviews} reviews)
              </span>
              <span className="text-gray-600 text-sm">| Search this page</span>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-gray-900 font-semibold mb-2">About this item</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{selectedItem.description}</p>
            </div>

            {/* Key Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Key Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Condition:</span>
                  <span className="font-semibold text-gray-900">{selectedItem.condition}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-semibold text-gray-900">{selectedItem.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-semibold text-gray-900">📍 {selectedItem.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Posted:</span>
                  <span className="font-semibold text-gray-900">{new Date(selectedItem.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Views:</span>
                  <span className="font-semibold text-gray-900">{selectedItem.views}</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {selectedItem.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedItem.tags.map(tag => (
                  <span key={tag} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right: Price & Action */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-4 border border-gray-200">
              {/* Price */}
              <div className="mb-6">
                <div className="text-sm text-gray-600 mb-1">Price</div>
                <div className="text-4xl font-bold text-gray-900">₹{selectedItem.price.toLocaleString()}</div>
              </div>

              {/* Seller Info */}
              <div className="mb-6 pb-6 border-b">
                <div className="text-sm text-gray-600 mb-3">Sold by</div>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">{selectedItem.seller.name}</div>
                    {selectedItem.seller.isVerified && (
                      <div className="text-green-600 text-sm font-semibold flex items-center gap-1 mt-1">
                        ✓ Verified Seller
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Verification Status */}
              <div className="mb-6 pb-6 border-b bg-white rounded p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🔍</span>
                  <span className="font-semibold text-gray-900">Verification Status</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {selectedItem.seller.isVerified 
                    ? 'This seller is verified. Product details confirmed.'
                    : 'Verify product details with seller before purchase.'}
                </p>
                <div className="text-xs text-gray-500">
                  Always communicate through our platform for your safety
                </div>
              </div>

              {/* Chat Button */}
              <button
                onClick={handleChatClick}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition mb-3 text-lg"
              >
                💬 Chat with Seller
              </button>

              {/* Info Box */}
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-xs text-gray-700">
                <p className="font-semibold mb-1">💡 Tip</p>
                <p>Ask seller about product condition, defects, warranty, and original accessories before making a decision.</p>
              </div>
            </div>
          </div>
        </div>

        {/* More Items Grid */}
        <div className="mt-12 pt-8 border-t">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">More Items for Sale</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {items.map(item => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedItem(item);
                  setMainImage(0);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition"
              >
                <div className="relative w-full aspect-square bg-gray-100">
                  <Image src={item.images[0]} alt={item.title} fill className="object-cover" />
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2">{item.title}</h3>
                  <div className="text-lg font-bold text-gray-900 mb-1">₹{item.price.toLocaleString()}</div>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <span className="text-yellow-400">★</span>
                    <span>{item.seller.rating}</span>
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
