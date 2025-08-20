'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface ExchangeItem {
  id: string;
  title: string;
  description: string;
  image: string;
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
  sellerInfo: {
    name: string;
    avatar: string;
    joinDate: string;
    totalExchanges: number;
    responseRate: number;
    responseTime: string;
  };
}

const mockExchangeItems: ExchangeItem[] = [
  {
    id: '1',
    title: 'iPhone 14 Pro - 128GB - Space Black',
    description: 'Excellent condition iPhone 14 Pro, barely used. Comes with original box and accessories. No scratches or dents, perfect for someone looking for a premium smartphone.',
    image: 'https://via.placeholder.com/400x400/924DAC/FFFFFF?text=iPhone+14+Pro',
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
    sellerInfo: {
      name: 'Sarah Johnson',
      avatar: 'https://via.placeholder.com/60x60/924DAC/FFFFFF?text=SJ',
      joinDate: 'March 2023',
      totalExchanges: 23,
      responseRate: 98,
      responseTime: 'Usually responds within 2 hours'
    }
  },
  {
    id: '2',
    title: 'Nike Air Jordan 1 Retro High OG',
    description: 'Classic Air Jordan 1s in Chicago colorway. Size 10, worn only a few times. Original box included, perfect for sneaker collectors.',
    image: 'https://via.placeholder.com/400x400/924DAC/FFFFFF?text=Air+Jordan+1',
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
    sellerInfo: {
      name: 'Mike Chen',
      avatar: 'https://via.placeholder.com/60x60/924DAC/FFFFFF?text=MC',
      joinDate: 'January 2023',
      totalExchanges: 15,
      responseRate: 95,
      responseTime: 'Usually responds within 4 hours'
    }
  }
];

export default function ExchangeItemDetail() {
  const params = useParams();
  const itemId = params.id as string;
  const [item, setItem] = useState<ExchangeItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'seller',
      message: 'Hi! Thanks for your interest in my iPhone 14 Pro. What would you like to know about it?',
      timestamp: '2 hours ago'
    }
  ]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundItem = mockExchangeItems.find(i => i.id === itemId);
      setItem(foundItem || null);
      setLoading(false);
    }, 500);
  }, [itemId]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: chatMessages.length + 1,
        sender: 'buyer',
        message: message.trim(),
        timestamp: 'Just now'
      };
      setChatMessages([...chatMessages, newMessage]);
      setMessage('');
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading item details...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Item Not Found</h2>
          <p className="text-gray-600 mb-4">The item you're looking for doesn't exist.</p>
          <Link href="/exchange" className="btn bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg">
            Back to Exchange
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container py-4">
          <div className="flex items-center gap-4">
            <Link href="/exchange" className="text-purple-600 hover:text-purple-700">
              ← Back to Exchange
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{item.title}</h1>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Item Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Item Image */}
              <div className="relative h-96">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(item.priority)}`}>
                    {getPriorityText(item.priority)}
                  </span>
                </div>
              </div>

              {/* Item Info */}
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h2>
                
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm text-gray-600">Rating: {item.userRating} ({item.userReviews} reviews)</span>
                  <span className="text-sm text-gray-600">•</span>
                  <span className="text-sm text-gray-600">{item.location}</span>
                  <span className="text-sm text-gray-600">•</span>
                  <span className="text-sm text-gray-600">{item.postedDate}</span>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{item.description}</p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Looking For</h3>
                  <p className="text-purple-600 font-medium">{item.lookingFor}</p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Category</span>
                      <p className="font-medium">{item.category}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Condition</span>
                      <p className="font-medium">{item.condition}</p>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map(tag => (
                      <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seller Info & Chat */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Seller Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Seller Information</h3>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <Image
                      src={item.sellerInfo.avatar}
                      alt={item.sellerInfo.name}
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                    {item.isVerified && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{item.sellerInfo.name}</h4>
                    <p className="text-sm text-gray-600">Member since {item.sellerInfo.joinDate}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Exchanges</span>
                    <span className="font-medium">{item.sellerInfo.totalExchanges}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Response Rate</span>
                    <span className="font-medium">{item.sellerInfo.responseRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Response Time</span>
                    <span className="font-medium">{item.sellerInfo.responseTime}</span>
                  </div>
                </div>
              </div>

              {/* Chat Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Chat with Seller</h3>
                
                {/* Chat Messages */}
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'buyer' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs px-3 py-2 rounded-lg ${
                        msg.sender === 'buyer' 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{msg.message}</p>
                        <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 