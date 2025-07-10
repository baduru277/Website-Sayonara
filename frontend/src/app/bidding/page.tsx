'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import apiService from '@/services/api';

interface BiddingItem {
  id: string;
  title: string;
  description: string;
  image: string;
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

export default function BiddingPage() {
  const [biddingItems, setBiddingItems] = useState<BiddingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [sortBy, setSortBy] = useState('ending-soon');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<BiddingItem | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [showBidModal, setShowBidModal] = useState(false);
  const [submittingBid, setSubmittingBid] = useState(false);

  const categories = ['All', 'Electronics', 'Fashion', 'Luxury', 'Collectibles', 'Sports', 'Music'];
  const priorities = ['All', 'high', 'medium', 'low'];

  // Mock data for visuality
  const mockAuctions: BiddingItem[] = [
    {
      id: '1',
      title: 'Apple iPhone 14 Pro',
      description: 'Brand new, sealed box. 128GB, Deep Purple.',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
      category: 'Electronics',
      condition: 'New',
      currentBid: 950,
      startingBid: 800,
      buyNowPrice: 1200,
      timeLeft: '2d 5h',
      totalBids: 12,
      location: 'New York, NY',
      postedDate: 'Today',
      userRating: 4.8,
      userReviews: 120,
      isVerified: true,
      priority: 'high',
      auctionEndDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      bidHistory: [],
    },
    {
      id: '2',
      title: 'Vintage Guitar',
      description: 'Fender Stratocaster, 1972, excellent condition.',
      image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=400&q=80',
      category: 'Music',
      condition: 'Excellent',
      currentBid: 2200,
      startingBid: 1500,
      buyNowPrice: 3000,
      timeLeft: '1d 3h',
      totalBids: 8,
      location: 'Austin, TX',
      postedDate: '1 day ago',
      userRating: 4.6,
      userReviews: 45,
      isVerified: false,
      priority: 'medium',
      auctionEndDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
      bidHistory: [],
    },
    {
      id: '3',
      title: 'Designer Handbag',
      description: 'Louis Vuitton, gently used, with dust bag.',
      image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80',
      category: 'Fashion',
      condition: 'Very Good',
      currentBid: 600,
      startingBid: 400,
      buyNowPrice: 900,
      timeLeft: '5h',
      totalBids: 15,
      location: 'Los Angeles, CA',
      postedDate: 'Today',
      userRating: 4.9,
      userReviews: 200,
      isVerified: true,
      priority: 'high',
      auctionEndDate: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
      bidHistory: [],
    },
  ];

  // Fetch bidding items from API
  useEffect(() => {
    const fetchBiddingItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.getBiddingItems();
        
        // Transform API response to match our interface
        const transformedItems = response.items?.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          image: item.images?.[0] || '/api/placeholder/300/300',
          category: item.category,
          condition: item.condition,
          currentBid: parseFloat(item.currentBid) || parseFloat(item.startingBid),
          startingBid: parseFloat(item.startingBid),
          buyNowPrice: parseFloat(item.buyNowPrice) || 0,
          timeLeft: calculateTimeLeft(item.auctionEndDate),
          totalBids: item.totalBids || 0,
          location: item.location || 'Unknown',
          postedDate: formatPostedDate(item.createdAt),
          userRating: item.user?.rating || 4.5,
          userReviews: item.user?.reviewCount || 0,
          isVerified: item.user?.isVerified || false,
          priority: calculatePriority(item.auctionEndDate, item.totalBids),
          auctionEndDate: item.auctionEndDate,
          bidHistory: item.bids?.map((bid: any) => ({
            amount: parseFloat(bid.amount),
            user: bid.bidder?.username || 'Anonymous',
            time: formatBidTime(bid.createdAt)
          })) || []
        })) || [];
        
        setBiddingItems(transformedItems);
      } catch (err) {
        console.error('Failed to fetch bidding items:', err);
        setError('Failed to load auctions. Please try again later.');
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

  const filteredItems = biddingItems.filter(item => {
    const categoryMatch = selectedCategory === 'All' || item.category === selectedCategory;
    const priorityMatch = selectedPriority === 'All' || item.priority === selectedPriority;
    const searchMatch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return categoryMatch && priorityMatch && searchMatch;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'ending-soon') {
      // Sort by time left (simplified)
      const timeA = parseInt(a.timeLeft.split('h')[0]) || 0;
      const timeB = parseInt(b.timeLeft.split('h')[0]) || 0;
      return timeA - timeB;
    }
    if (sortBy === 'highest-bid') {
      return b.currentBid - a.currentBid;
    }
    if (sortBy === 'most-bids') {
      return b.totalBids - a.totalBids;
    }
    return 0;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'High Priority';
      case 'medium': return 'Medium Priority';
      case 'low': return 'Low Priority';
      default: return 'Priority';
    }
  };

  const formatTimeLeft = (timeLeft: string) => {
    if (timeLeft.includes('d')) {
      return timeLeft;
    }
    const hours = parseInt(timeLeft.split('h')[0]);
    if (hours < 1) {
      return 'Ending Soon!';
    }
    return timeLeft;
  };

  const getTimeColor = (timeLeft: string) => {
    if (timeLeft.includes('Ending Soon!') || timeLeft.includes('h') && parseInt(timeLeft.split('h')[0]) < 3) {
      return 'text-red-600 bg-red-100';
    }
    if (timeLeft.includes('h') && parseInt(timeLeft.split('h')[0]) < 12) {
      return 'text-yellow-600 bg-yellow-100';
    }
    return 'text-green-600 bg-green-100';
  };

  const handleBid = (item: BiddingItem) => {
    setSelectedItem(item);
    setBidAmount((item.currentBid + 10).toString());
    setShowBidModal(true);
  };

  const submitBid = async () => {
    if (!selectedItem || !bidAmount) return;
    
    const amount = parseInt(bidAmount);
    if (amount <= selectedItem.currentBid) {
      alert('Bid must be higher than current bid');
      return;
    }

    try {
      setSubmittingBid(true);
      await apiService.placeBid(selectedItem.id, amount);
      
      // Update the item in the list
      setBiddingItems(prev => prev.map(item => 
        item.id === selectedItem.id 
          ? { ...item, currentBid: amount, totalBids: item.totalBids + 1 }
          : item
      ));
      
      setShowBidModal(false);
      setSelectedItem(null);
      setBidAmount('');
      alert('Bid placed successfully!');
    } catch (err) {
      console.error('Failed to place bid:', err);
      alert('Failed to place bid. Please try again.');
    } finally {
      setSubmittingBid(false);
    }
  };

  // Use mock data if error or no items
  const displayItems = error || biddingItems.length === 0 ? mockAuctions : sortedItems;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
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
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Auctions</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="sayonara-btn"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Live Auctions</h1>
              <p className="text-gray-600 mt-1">Bid on exclusive items and win amazing deals</p>
            </div>
            <Link
              href="/add-item?type=auction"
              className="sayonara-btn"
            >
              Create Auction
            </Link>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search auctions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {priorities.map(priority => (
                  <option key={priority} value={priority}>
                    {priority === 'All' ? 'All Priorities' : priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="ending-soon">Ending Soon</option>
                <option value="highest-bid">Highest Bid</option>
                <option value="most-bids">Most Bids</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-gray-600">
            {displayItems.length} auctions active
          </span>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            <span>Ending Soon</span>
            <span className="w-3 h-3 bg-yellow-500 rounded-full ml-4"></span>
            <span>Ending Today</span>
            <span className="w-3 h-3 bg-green-500 rounded-full ml-4"></span>
            <span>Ending Later</span>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {displayItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              {/* Item Image */}
              <div className="relative h-48 bg-gray-100">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={300}
                  height={300}
                  className="object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                    {getPriorityText(item.priority)}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  {item.isVerified && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <div className={`px-3 py-1 rounded-lg text-sm font-medium ${getTimeColor(item.timeLeft)}`}>
                    ⏰ {formatTimeLeft(item.timeLeft)}
                  </div>
                </div>
              </div>

              {/* Item Details */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {item.title}
                  </h3>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-gray-500">{item.condition}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-xs text-gray-500">{item.category}</span>
                </div>

                {/* Bidding Info */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Current Bid:</span>
                    <span className="text-lg font-bold text-orange-600">${item.currentBid.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">Starting Bid:</span>
                    <span className="text-sm text-gray-600">${item.startingBid.toLocaleString()}</span>
                  </div>
                  {item.buyNowPrice > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Buy Now:</span>
                      <span className="text-sm font-medium text-green-600">${item.buyNowPrice.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(item.userRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-1">
                      {item.userRating} ({item.userReviews})
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">{item.totalBids} bids</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{item.location}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBid(item)}
                      className="sayonara-btn"
                    >
                      Place Bid
                    </button>
                    {item.buyNowPrice > 0 && (
                      <Link
                        href={`/item/${item.id}?buyNow=true`}
                        className="sayonara-btn border border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                      >
                        Buy Now
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {displayItems.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No auctions found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedPriority('All');
                setSearchQuery('');
              }}
              className="sayonara-btn"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Bid Modal */}
      {showBidModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Place Your Bid</h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">{selectedItem.title}</p>
              <p className="text-lg font-bold text-orange-600">Current Bid: ${selectedItem.currentBid.toLocaleString()}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Bid Amount ($)</label>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                min={selectedItem.currentBid + 1}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum bid: ${(selectedItem.currentBid + 1).toLocaleString()}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowBidModal(false)}
                disabled={submittingBid}
                className="flex-1 sayonara-btn border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={submitBid}
                disabled={submittingBid || !bidAmount || parseInt(bidAmount) <= selectedItem.currentBid}
                className="flex-1 sayonara-btn bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 flex items-center justify-center"
              >
                {submittingBid ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Placing Bid...
                  </>
                ) : (
                  'Place Bid'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 