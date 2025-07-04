'use client';

import { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Mock trade data
const trades = [
  {
    id: 1,
    type: 'received',
    status: 'pending',
    item: {
      title: 'iPhone 13 Pro',
      image: '/api/placeholder/100/100',
      owner: 'TechTrader'
    },
    offer: {
      title: 'MacBook Air M1',
      image: '/api/placeholder/100/100',
      owner: 'You'
    },
    message: 'Hi! I have a MacBook Air M1 in excellent condition. Would you be interested in trading?',
    timestamp: '2 hours ago',
    expires: '3 days'
  },
  {
    id: 2,
    type: 'sent',
    status: 'accepted',
    item: {
      title: 'Nike Air Jordan 1',
      image: '/api/placeholder/100/100',
      owner: 'SneakerHead'
    },
    offer: {
      title: 'Yeezy 350',
      image: '/api/placeholder/100/100',
      owner: 'You'
    },
    message: 'I have a pair of Yeezy 350s in great condition. Perfect trade for your Jordans!',
    timestamp: '1 day ago',
    meetingTime: 'Tomorrow at 3 PM'
  },
  {
    id: 3,
    type: 'received',
    status: 'declined',
    item: {
      title: 'Guitar - Fender Stratocaster',
      image: '/api/placeholder/100/100',
      owner: 'MusicLover'
    },
    offer: {
      title: 'Drum Set',
      image: '/api/placeholder/100/100',
      owner: 'You'
    },
    message: 'I have a complete drum set. Would you trade your guitar for it?',
    timestamp: '3 days ago',
    reason: 'Not interested in drums'
  }
];

const bids = [
  {
    id: 1,
    item: {
      title: 'iPhone 13 Pro',
      image: '/api/placeholder/100/100',
      currentBid: 750,
      yourBid: 800,
      totalBids: 12
    },
    status: 'leading',
    timeLeft: '2 hours',
    endTime: '2024-01-15T18:00:00Z'
  },
  {
    id: 2,
    item: {
      title: 'MacBook Pro 2021',
      image: '/api/placeholder/100/100',
      currentBid: 1200,
      yourBid: 1150,
      totalBids: 8
    },
    status: 'outbid',
    timeLeft: '1 day',
    endTime: '2024-01-16T12:00:00Z'
  }
];

export default function TradesPage() {
  const [activeTab, setActiveTab] = useState('trades');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBidStatusColor = (status: string) => {
    switch (status) {
      case 'leading': return 'bg-green-100 text-green-800';
      case 'outbid': return 'bg-red-100 text-red-800';
      case 'won': return 'bg-blue-100 text-blue-800';
      case 'lost': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-8">
        <div className="container max-w-6xl">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Trades & Bids
            </h1>
            <p className="text-gray-600">
              Manage your trade offers and bidding activities
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('trades')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'trades'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  🤝 Trade Offers
                </button>
                <button
                  onClick={() => setActiveTab('bids')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'bids'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  🎯 Active Bids
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'history'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  📋 History
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'trades' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">Trade Offers</h2>
                    <div className="flex gap-2">
                      <select className="input text-sm">
                        <option>All Status</option>
                        <option>Pending</option>
                        <option>Accepted</option>
                        <option>Declined</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {trades.map((trade) => (
                      <div key={trade.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                          {/* Your Item */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-gray-500 text-xs">Item</span>
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{trade.item.title}</h3>
                                <p className="text-sm text-gray-500">by {trade.item.owner}</p>
                              </div>
                            </div>
                          </div>

                          {/* Exchange Arrow */}
                          <div className="flex items-center text-gray-400">
                            <span className="text-2xl">↔️</span>
                          </div>

                          {/* Offered Item */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-gray-500 text-xs">Offer</span>
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{trade.offer.title}</h3>
                                <p className="text-sm text-gray-500">by {trade.offer.owner}</p>
                              </div>
                            </div>
                          </div>

                          {/* Status and Actions */}
                          <div className="text-right">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(trade.status)}`}>
                              {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
                            </span>
                            <p className="text-xs text-gray-500 mt-1">{trade.timestamp}</p>
                            
                            {trade.status === 'pending' && trade.type === 'received' && (
                              <div className="flex gap-2 mt-3">
                                <button className="btn btn-primary text-xs px-3 py-1">
                                  Accept
                                </button>
                                <button className="btn btn-outline text-xs px-3 py-1">
                                  Decline
                                </button>
                                <button className="btn btn-outline text-xs px-3 py-1">
                                  Counter
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-sm text-gray-600 mb-2">{trade.message}</p>
                          {trade.meetingTime && (
                            <p className="text-sm text-green-600">📅 Meeting scheduled: {trade.meetingTime}</p>
                          )}
                          {trade.reason && (
                            <p className="text-sm text-red-600">❌ Reason: {trade.reason}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'bids' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">Active Bids</h2>
                    <button className="btn btn-primary">
                      + Place New Bid
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {bids.map((bid) => (
                      <div key={bid.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start gap-4">
                          <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-500 text-xs">Item</span>
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-2">{bid.item.title}</h3>
                            
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-500">Current Bid:</span>
                                <span className="font-medium">${bid.item.currentBid}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Your Bid:</span>
                                <span className="font-medium">${bid.item.yourBid}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Total Bids:</span>
                                <span>{bid.item.totalBids}</span>
                              </div>
                            </div>

                            <div className="mt-3">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getBidStatusColor(bid.status)}`}>
                                {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                              </span>
                              <p className="text-xs text-gray-500 mt-1">Ends in {bid.timeLeft}</p>
                            </div>

                            <div className="mt-4 flex gap-2">
                              <button className="btn btn-primary text-xs px-3 py-1">
                                Increase Bid
                              </button>
                              <button className="btn btn-outline text-xs px-3 py-1">
                                View Item
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Trade History</h2>
                  <div className="space-y-4">
                    {trades.filter(t => t.status === 'completed' || t.status === 'declined').map((trade) => (
                      <div key={trade.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-gray-500 text-xs">Item</span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{trade.item.title}</h3>
                              <p className="text-sm text-gray-500">Traded with {trade.item.owner}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(trade.status)}`}>
                              {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
                            </span>
                            <p className="text-xs text-gray-500 mt-1">{trade.timestamp}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 