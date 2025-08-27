'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import apiService from '@/services/api';
import ProductGrid from '@/components/ProductGrid';

interface BiddingItem {
  id: string;
  title: string;
  description: string;
  image: string;
  images: string[];
  category: string;
  condition: string;
  currentBid: number;
  startingBid: number;
  buyNowPrice: number;
  timeLeft: string;
  totalBids: number;
  location: string;
  postedDate: string;
  userRating: number;
  userReviews: number;
  isVerified: boolean;
  priority: 'high' | 'medium' | 'low';
  auctionEndDate: string;
  bidHistory: Array<{
    amount: number;
    user: string;
    time: string;
  }>;
}

// Mock data for bidding items
const mockBiddingItems: BiddingItem[] = [
  {
    id: '1',
    title: 'iPhone 15 Pro Max - 256GB - Natural Titanium',
    description: 'Brand new iPhone 15 Pro Max, sealed in box. Latest model with A17 Pro chip and titanium design.',
    image: 'https://via.placeholder.com/320x320/924DAC/FFFFFF?text=iPhone+15+Pro+Max',
    images: ['https://via.placeholder.com/320x320/924DAC/FFFFFF?text=iPhone+15+Pro+Max'],
    category: 'Electronics',
    condition: 'New',
    currentBid: 85000,
    startingBid: 75000,
    buyNowPrice: 95000,
    timeLeft: '2h 15m',
    totalBids: 12,
    location: 'Mumbai, India',
    postedDate: '2 days ago',
    userRating: 4.8,
    userReviews: 156,
    isVerified: true,
    priority: 'high',
    auctionEndDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    bidHistory: [
      { amount: 85000, user: 'TechBidder2024', time: '5 minutes ago' },
      { amount: 82000, user: 'MobileLover', time: '12 minutes ago' },
      { amount: 80000, user: 'AppleFan', time: '25 minutes ago' },
      { amount: 78000, user: 'TechBidder2024', time: '1 hour ago' },
      { amount: 76000, user: 'MobileLover', time: '2 hours ago' }
    ]
  },
  {
    id: '2',
    title: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Premium noise-cancelling headphones with 30-hour battery life. Perfect condition with original box.',
    image: 'https://via.placeholder.com/320x320/924DAC/FFFFFF?text=Sony+WH-1000XM5',
    images: ['https://via.placeholder.com/320x320/924DAC/FFFFFF?text=Sony+WH-1000XM5'],
    category: 'Electronics',
    condition: 'Like New',
    currentBid: 18000,
    startingBid: 15000,
    buyNowPrice: 25000,
    timeLeft: '5h 30m',
    totalBids: 8,
    location: 'Delhi, India',
    postedDate: '1 day ago',
    userRating: 4.6,
    userReviews: 89,
    isVerified: true,
    priority: 'medium',
    auctionEndDate: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(), // 5 hours from now
    bidHistory: [
      { amount: 18000, user: 'AudioEnthusiast', time: '10 minutes ago' },
      { amount: 17500, user: 'MusicLover', time: '30 minutes ago' },
      { amount: 17000, user: 'AudioEnthusiast', time: '1 hour ago' },
      { amount: 16500, user: 'SoundMaster', time: '2 hours ago' }
    ]
  },
  {
    id: '3',
    title: 'Nike Air Jordan 1 Retro High OG - Chicago',
    description: 'Limited edition Air Jordan 1 in Chicago colorway. Size 10, deadstock condition.',
    image: 'https://via.placeholder.com/320x320/924DAC/FFFFFF?text=Air+Jordan+1+Chicago',
    images: ['https://via.placeholder.com/320x320/924DAC/FFFFFF?text=Air+Jordan+1+Chicago'],
    category: 'Fashion',
    condition: 'New',
    currentBid: 45000,
    startingBid: 35000,
    buyNowPrice: 60000,
    timeLeft: '1d 3h',
    totalBids: 15,
    location: 'Bangalore, India',
    postedDate: '3 days ago',
    userRating: 4.9,
    userReviews: 234,
    isVerified: true,
    priority: 'high',
    auctionEndDate: new Date(Date.now() + 27 * 60 * 60 * 1000).toISOString(), // 27 hours from now
    bidHistory: [
      { amount: 45000, user: 'SneakerHead', time: '2 minutes ago' },
      { amount: 44000, user: 'JordanCollector', time: '15 minutes ago' },
      { amount: 43000, user: 'SneakerHead', time: '1 hour ago' },
      { amount: 42000, user: 'StreetStyle', time: '2 hours ago' }
    ]
  }
];

export default function BiddingPage() {
  const [biddingItems, setBiddingItems] = useState<BiddingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<BiddingItem | null>(null);

  // Fetch bidding items from API
  useEffect(() => {
    const fetchBiddingItems = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching bidding items...');
        const response = await apiService.getBiddingItems();
        console.log('API response:', response);
        
        // Handle both direct array and object with items property
        const items = Array.isArray(response) ? response : (response?.items || []);
        console.log('Response items:', items);
        console.log('Response items length:', items?.length);
        
        // If no items from API, use mock data
        if (!items || items.length === 0) {
          console.log('No items from API, using mock data');
          setBiddingItems(mockBiddingItems);
          setSelectedItem(mockBiddingItems[0]);
          return;
        }
        
        // Transform API response to match our interface
        let transformedItems = items?.map((item: {
          id: string;
          title: string;
          description: string;
          images?: string[];
          category: string;
          condition: string;
          currentBid: string;
          startingBid: string;
          buyNowPrice?: string;
          totalBids?: number;
          location?: string;
          createdAt: string;
          auctionEndDate: string;
          user?: {
            rating?: number;
            reviewCount?: number;
            isVerified?: boolean;
          };
          bids?: Array<{
            amount: string;
            bidder?: {
              username?: string;
            };
            createdAt: string;
          }>;
        }) => {
          console.log('Processing item:', item.title, 'Images:', item.images);
          console.log('Image array type:', Array.isArray(item.images));
          console.log('Image array length:', item.images?.length);
          console.log('First image:', item.images?.[0]);
          
          // Ensure we have a valid image array
          const imageArray = Array.isArray(item.images) && item.images.length > 0 
            ? item.images 
            : ['https://via.placeholder.com/320x320/cccccc/666666?text=No+Image'];
          
          return {
            id: item.id,
            title: item.title,
            description: item.description,
            image: imageArray[0],
            images: imageArray,
            category: item.category,
            condition: item.condition,
            currentBid: parseFloat(item.currentBid || item.startingBid || '10'),
            startingBid: parseFloat(item.startingBid || '10'),
            buyNowPrice: parseFloat(item.buyNowPrice || '0'),
            timeLeft: item.auctionEndDate ? calculateTimeLeft(item.auctionEndDate) : '7 days',
            totalBids: item.totalBids || 0,
            location: 'India',
            postedDate: formatPostedDate(item.createdAt),
            userRating: item.user?.rating || 4.5,
            userReviews: item.user?.reviewCount || 0,
            isVerified: item.user?.isVerified || false,
            priority: item.auctionEndDate ? calculatePriority(item.auctionEndDate, item.totalBids || 0) : 'medium',
            auctionEndDate: item.auctionEndDate || '',
            bidHistory: item.bids?.map((bid: {
              amount: string;
              bidder?: {
                username?: string;
              };
              createdAt: string;
            }) => ({
              amount: parseFloat(bid.amount),
              user: bid.bidder?.username || 'Anonymous',
              time: formatBidTime(bid.createdAt)
            })) || []
          };
        }) || [];
        
        console.log('Transformed items:', transformedItems);
        console.log('Transformed items length:', transformedItems.length);
        setBiddingItems(transformedItems);
        if (transformedItems.length > 0) {
          setSelectedItem(transformedItems[0]);
        }
      } catch (err) {
        console.error('Failed to fetch bidding items:', err);
        console.log('Using mock data due to API error');
        setBiddingItems(mockBiddingItems);
        setSelectedItem(mockBiddingItems[0]);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBiddingItems();
  }, []);

  // Helper functions
  const calculateTimeLeft = (auctionEndDate: string) => {
    const end = new Date(auctionEndDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ended';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h`;
    return 'Ending Soon!';
  };

  const calculatePriority = (auctionEndDate: string, totalBids: number) => {
    const end = new Date(auctionEndDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 3 || totalBids > 20) return 'high';
    if (hours < 12 || totalBids > 10) return 'medium';
    return 'low';
  };

  const formatPostedDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };

  const formatBidTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  const formatIndianCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get 3 suggested items (excluding the selected item)
  const getSuggestedItems = (currentItem: BiddingItem) => {
    return biddingItems
      .filter(item => item.id !== currentItem.id)
      .slice(0, 3);
  };

  console.log('Bidding page render - loading:', loading, 'error:', error, 'items count:', biddingItems.length);
  
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading auctions...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Auctions</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!selectedItem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No auctions available</h3>
          <p className="text-gray-600">There are currently no items available for bidding.</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Live Auctions</h1>
          <p className="text-gray-600 mt-1">Bid on exclusive items and win amazing deals</p>
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
                <div className="absolute top-4 right-4">
                  <div className="px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white">
                    {selectedItem.timeLeft}
                  </div>
                </div>
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
                  {selectedItem.totalBids} bids
                </span>
              </div>

              <div className="mb-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {formatIndianCurrency(selectedItem.currentBid)}
                  </span>
                  <span className="text-sm text-gray-600">Current Bid</span>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Starting: {formatIndianCurrency(selectedItem.startingBid)}
                </div>
                {selectedItem.buyNowPrice > 0 && (
                  <div className="text-sm font-medium text-green-600">
                    Buy Now: {formatIndianCurrency(selectedItem.buyNowPrice)}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>Rating: {selectedItem.userRating} ({selectedItem.userReviews} reviews)</span>
                <span>{selectedItem.location}</span>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Place Bid
                </button>
                {selectedItem.buyNowPrice > 0 && (
                  <button className="flex-1 border border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    Buy Now
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Suggested Items */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Other Auctions</h3>
            
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
                      <div className="absolute top-1 right-1">
                        <div className="px-1 py-0.5 rounded text-xs font-bold bg-red-600 text-white">
                          {item.timeLeft}
                        </div>
                      </div>
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
                          {formatIndianCurrency(item.currentBid)}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">({item.totalBids} bids)</span>
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
                <p>No other auctions available</p>
              </div>
            )}
          </div>
        </div>

        {/* Product Grid */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">All Available Auctions</h3>
         <ProductGrid
          items={biddingItems.map(item => ({
            ...item,
            type: 'bidding' as const,
            isPrime: true,
            tags: [],   // 👈 add this
          }))}
        />

        </div>
      </div>
    </div>
  );
} 