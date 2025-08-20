'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import apiService from '@/services/api';
import ItemComparison from '@/components/ItemComparison';
import ProductGrid from '@/components/ProductGrid';

interface ExchangeItem {
  id: string;
  title: string;
  description: string;
  image: string;
  images: string[];
  category: string;
  condition: string;
  lookingFor: string;
  location: string;
  postedDate: string;
  userRating: number;
  userReviews: number;
  isVerified: boolean;
  priority: 'high' | 'medium' | 'low';
  tags: string[];
  exchangeType: 'direct' | 'negotiable';
  preferredCategories: string[];
  itemValue: number;
  shipping: string;
  fastShipping: boolean;
}

const mockExchangeItems: ExchangeItem[] = [
  {
    id: '1',
    title: 'iPhone 14 Pro - 128GB - Space Black',
    description: 'Excellent condition iPhone 14 Pro, barely used. Comes with original box and accessories.',
    image: 'https://via.placeholder.com/300x300/924DAC/FFFFFF?text=iPhone+14+Pro',
    images: ['https://via.placeholder.com/300x300/924DAC/FFFFFF?text=iPhone+14+Pro'],
    category: 'Electronics',
    condition: 'Like New',
    lookingFor: 'MacBook Air, iPad Pro, or Gaming Laptop',
    location: 'New York, NY',
    postedDate: '2 hours ago',
    userRating: 4.8,
    userReviews: 127,
    isVerified: true,
    priority: 'high',
    tags: ['Smartphone', 'Apple', 'Premium'],
    exchangeType: 'negotiable',
    preferredCategories: ['Electronics', 'Computers', 'Gaming'],
    itemValue: 899.99,
    shipping: 'Free',
    fastShipping: true
  },
  {
    id: '2',
    title: 'Nike Air Jordan 1 Retro High OG',
    description: 'Classic Air Jordan 1s in Chicago colorway. Size 10, worn only a few times.',
    image: 'https://via.placeholder.com/300x300/924DAC/FFFFFF?text=Air+Jordan+1',
    images: ['https://via.placeholder.com/300x300/924DAC/FFFFFF?text=Air+Jordan+1'],
    category: 'Fashion',
    condition: 'Very Good',
    lookingFor: 'Yeezy 350, Air Force 1, or Designer Sneakers',
    location: 'Los Angeles, CA',
    postedDate: '5 hours ago',
    userRating: 4.6,
    userReviews: 89,
    isVerified: true,
    priority: 'high',
    tags: ['Sneakers', 'Nike', 'Limited Edition'],
    exchangeType: 'direct',
    preferredCategories: ['Fashion', 'Sneakers', 'Designer'],
    itemValue: 350.00,
    shipping: 'Free',
    fastShipping: true
  },
  {
    id: '3',
    title: 'PlayStation 5 Console + 2 Controllers',
    description: 'PS5 with DualSense controllers. Includes God of War Ragnarök and Spider-Man 2.',
    image: 'https://via.placeholder.com/300x300/924DAC/FFFFFF?text=PS5+Console',
    images: ['https://via.placeholder.com/300x300/924DAC/FFFFFF?text=PS5+Console'],
    category: 'Electronics',
    condition: 'Good',
    lookingFor: 'Xbox Series X, Gaming PC, or High-end Camera',
    location: 'Chicago, IL',
    postedDate: '1 day ago',
    userRating: 4.9,
    userReviews: 203,
    isVerified: true,
    priority: 'medium',
    tags: ['Gaming', 'Sony', 'Console'],
    exchangeType: 'negotiable',
    preferredCategories: ['Electronics', 'Gaming', 'Computers'],
    itemValue: 599.99,
    shipping: '$15.99',
    fastShipping: true
  },
  {
    id: '4',
    title: 'Canon EOS R6 Mark II Camera',
    description: 'Professional mirrorless camera with 24-105mm f/4L lens. Perfect for photography enthusiasts.',
    image: 'https://via.placeholder.com/300x300/924DAC/FFFFFF?text=Canon+EOS+R6',
    images: ['https://via.placeholder.com/300x300/924DAC/FFFFFF?text=Canon+EOS+R6'],
    category: 'Electronics',
    condition: 'Excellent',
    lookingFor: 'MacBook Pro, DJI Drone, or Professional Audio Equipment',
    location: 'Miami, FL',
    postedDate: '3 days ago',
    userRating: 4.7,
    userReviews: 156,
    isVerified: true,
    priority: 'medium',
    tags: ['Camera', 'Professional', 'Canon'],
    exchangeType: 'negotiable',
    preferredCategories: ['Electronics', 'Computers', 'Audio'],
    itemValue: 2499.99,
    shipping: 'Free',
    fastShipping: true
  },
  {
    id: '5',
    title: 'Apple MacBook Pro M2 - 14-inch',
    description: '2023 MacBook Pro with M2 chip, 16GB RAM, 512GB SSD. Perfect condition with AppleCare+ until 2025.',
    image: 'https://via.placeholder.com/300x300/924DAC/FFFFFF?text=MacBook+Pro+M2',
    images: ['https://via.placeholder.com/300x300/924DAC/FFFFFF?text=MacBook+Pro+M2'],
    category: 'Electronics',
    condition: 'Like New',
    lookingFor: 'iPhone 15 Pro Max, iPad Pro 12.9", or Gaming PC Setup',
    location: 'San Francisco, CA',
    postedDate: '1 day ago',
    userRating: 4.9,
    userReviews: 89,
    isVerified: true,
    priority: 'high',
    tags: ['Laptop', 'Apple', 'M2 Chip', 'Premium'],
    exchangeType: 'direct',
    preferredCategories: ['Electronics', 'Mobile', 'Gaming'],
    itemValue: 1999.99,
    shipping: 'Free',
    fastShipping: true
  }
];

export default function ExchangePage() {
  const router = useRouter();
  const [exchangeItems, setExchangeItems] = useState<ExchangeItem[]>(mockExchangeItems);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ExchangeItem | null>(mockExchangeItems[0]);

  // Fetch exchange items from API
  useEffect(() => {
    const fetchExchangeItems = async () => {
      try {
        setLoading(true);
        const response = await apiService.getExchangeItems();
        const items = Array.isArray(response) ? response : (response?.items || []);
        
        if (items.length === 0) {
          setExchangeItems(mockExchangeItems);
          setSelectedItem(mockExchangeItems[0]);
        } else {
          setExchangeItems(items);
          setSelectedItem(items[0]);
        }
      } catch (error) {
        console.error('Failed to fetch exchange items:', error);
        setExchangeItems(mockExchangeItems);
        setSelectedItem(mockExchangeItems[0]);
      } finally {
        setLoading(false);
      }
    };

    fetchExchangeItems();
  }, []);

  // Get 3 suggested items (excluding the selected item)
  const getSuggestedItems = (currentItem: ExchangeItem) => {
    return exchangeItems
      .filter(item => item.id !== currentItem.id)
      .slice(0, 3);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!selectedItem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No items available</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Exchange Items</h1>
          <p className="text-gray-600 mt-1">Trade your items with other users</p>
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

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Looking for:</p>
                <p className="text-sm text-purple-600">
                  {selectedItem.lookingFor}
                </p>
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

              <div className="text-xs text-gray-500">
                Posted {selectedItem.postedDate}
              </div>
            </div>
          </div>

          {/* Right Side - Suggested Items */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Suggested Exchanges</h3>
            
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
                      
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        Looking for: {item.lookingFor}
                      </p>
                      
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
                <p>No suggestions available</p>
              </div>
            )}
          </div>
        </div>

                 {/* Product Grid */}
         <div className="mt-8">
           <h3 className="text-lg font-semibold text-gray-900 mb-6">All Available Items</h3>
           <ProductGrid
             items={exchangeItems.map(item => ({
               ...item,
               type: 'exchange' as const,
               isPrime: item.fastShipping,
               deliveryDate: 'Monday 11 August',
               limitedTimeDeal: item.priority === 'high'
             }))}
             onItemClick={(selectedItem) => {
               setSelectedItem(selectedItem as any);
             }}
           />
         </div>

         {/* Item Comparison Section */}
         <div className="mt-8">
           <ItemComparison
             currentItem={{
               id: selectedItem.id,
               title: selectedItem.title,
               description: selectedItem.description,
               image: selectedItem.image,
               images: selectedItem.images,
               category: selectedItem.category,
               condition: selectedItem.condition,
               location: selectedItem.location,
               postedDate: selectedItem.postedDate,
               userRating: selectedItem.userRating,
               userReviews: selectedItem.userReviews,
               isVerified: selectedItem.isVerified,
               priority: selectedItem.priority,
               tags: selectedItem.tags,
               type: 'exchange',
               lookingFor: selectedItem.lookingFor,
               exchangeType: selectedItem.exchangeType,
               preferredCategories: selectedItem.preferredCategories,
               itemValue: selectedItem.itemValue,
               shipping: selectedItem.shipping,
               fastShipping: selectedItem.fastShipping
             }}
             recommendations={suggestedItems.map(item => ({
               id: item.id,
               title: item.title,
               description: item.description,
               image: item.image,
               images: item.images,
               category: item.category,
               condition: item.condition,
               location: item.location,
               postedDate: item.postedDate,
               userRating: item.userRating,
               userReviews: item.userReviews,
               isVerified: item.isVerified,
               priority: item.priority,
               tags: item.tags,
               type: 'exchange' as const,
               lookingFor: item.lookingFor,
               exchangeType: item.exchangeType,
               preferredCategories: item.preferredCategories,
               itemValue: item.itemValue,
               shipping: item.shipping,
               fastShipping: item.fastShipping
             }))}
             onItemSelect={(selectedItem) => {
               setSelectedItem(selectedItem as any);
             }}
           />
         </div>
       </div>
     </div>
   );
 } 