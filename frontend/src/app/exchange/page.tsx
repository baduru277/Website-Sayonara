'use client';

import { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Mock exchange data
const exchanges = [
  {
    id: 1,
    title: "iPhone 13 Pro ↔ MacBook Air",
    status: "pending",
    initiator: {
      name: "TechTrader",
      avatar: "/api/placeholder/50/50",
      rating: 4.8
    },
    recipient: {
      name: "MacUser",
      avatar: "/api/placeholder/50/50",
      rating: 4.9
    },
    items: {
      offered: {
        title: "iPhone 13 Pro",
        description: "256GB, Space Gray, Excellent condition",
        image: "/api/placeholder/100/100",
        value: 800
      },
      requested: {
        title: "MacBook Air M1",
        description: "8GB RAM, 256GB SSD, Like new",
        image: "/api/placeholder/100/100",
        value: 900
      }
    },
    message: "Hi! I have an iPhone 13 Pro in excellent condition. Would you be interested in trading for your MacBook Air?",
    timestamp: "2 hours ago",
    expires: "3 days"
  },
  {
    id: 2,
    title: "Nike Jordans ↔ Yeezy 350",
    status: "accepted",
    initiator: {
      name: "SneakerHead",
      avatar: "/api/placeholder/50/50",
      rating: 4.7
    },
    recipient: {
      name: "You",
      avatar: "/api/placeholder/50/50",
      rating: 4.8
    },
    items: {
      offered: {
        title: "Nike Air Jordan 1",
        description: "Retro High OG, Size 10, Chicago colorway",
        image: "/api/placeholder/100/100",
        value: 400
      },
      requested: {
        title: "Yeezy 350",
        description: "V2, Size 10, Black colorway",
        image: "/api/placeholder/100/100",
        value: 350
      }
    },
    message: "Perfect trade! Both shoes are in great condition and similar value.",
    timestamp: "1 day ago",
    meetingTime: "Tomorrow at 3 PM"
  }
];

const suggestedExchanges = [
  {
    id: 1,
    yourItem: {
      title: "Gaming PC Setup",
      image: "/api/placeholder/100/100",
      value: 1200
    },
    suggestedItem: {
      title: "PS5 + Games",
      image: "/api/placeholder/100/100",
      value: 1100,
      owner: "GamerPro"
    },
    matchScore: 95
  },
  {
    id: 2,
    yourItem: {
      title: "Guitar - Fender Stratocaster",
      image: "/api/placeholder/100/100",
      value: 800
    },
    suggestedItem: {
      title: "Drum Set",
      image: "/api/placeholder/100/100",
      value: 750,
      owner: "MusicLover"
    },
    matchScore: 88
  }
];

export default function ExchangePage() {
  const [activeTab, setActiveTab] = useState('exchanges');
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [selectedExchange, setSelectedExchange] = useState(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const proposeExchange = (suggestion: any) => {
    setSelectedExchange(suggestion);
    setShowExchangeModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-8">
        <div className="container max-w-6xl">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Exchange & Barter
            </h1>
            <p className="text-gray-600">
              Propose item-for-item trades and manage your exchanges
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('exchanges')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'exchanges'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  🤝 My Exchanges
                </button>
                <button
                  onClick={() => setActiveTab('suggestions')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'suggestions'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  💡 Suggested Trades
                </button>
                <button
                  onClick={() => setActiveTab('create')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'create'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  ➕ Create Exchange
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'exchanges' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">My Exchanges</h2>
                    <div className="flex gap-2">
                      <select className="input text-sm">
                        <option>All Status</option>
                        <option>Pending</option>
                        <option>Accepted</option>
                        <option>Declined</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {exchanges.map((exchange) => (
                      <div key={exchange.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">{exchange.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(exchange.status)}`}>
                            {exchange.status.charAt(0).toUpperCase() + exchange.status.slice(1)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
                          {/* Offered Item */}
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Offering</h4>
                            <div className="flex items-center gap-3">
                              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-gray-500 text-xs">Item</span>
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-900">{exchange.items.offered.title}</h5>
                                <p className="text-sm text-gray-600">{exchange.items.offered.description}</p>
                                <p className="text-sm text-green-600 font-medium">${exchange.items.offered.value}</p>
                              </div>
                            </div>
                          </div>

                          {/* Requested Item */}
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Requesting</h4>
                            <div className="flex items-center gap-3">
                              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-gray-500 text-xs">Item</span>
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-900">{exchange.items.requested.title}</h5>
                                <p className="text-sm text-gray-600">{exchange.items.requested.description}</p>
                                <p className="text-sm text-green-600 font-medium">${exchange.items.requested.value}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>by {exchange.initiator.name} • {exchange.timestamp}</span>
                              {exchange.meetingTime && (
                                <span className="text-green-600">📅 {exchange.meetingTime}</span>
                              )}
                            </div>
                          </div>
                          
                          <p className="text-gray-700 mb-4">{exchange.message}</p>

                          {exchange.status === 'pending' && (
                            <div className="flex gap-3">
                              <button className="btn btn-primary text-sm px-4 py-2">
                                Accept Exchange
                              </button>
                              <button className="btn btn-outline text-sm px-4 py-2">
                                Decline
                              </button>
                              <button className="btn btn-outline text-sm px-4 py-2">
                                Counter Offer
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'suggestions' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Suggested Trades</h2>
                  <p className="text-gray-600 mb-6">
                    Based on your items, here are some potential exchanges you might be interested in:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {suggestedExchanges.map((suggestion) => (
                      <div key={suggestion.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-gray-900">Suggested Exchange</h3>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                            {suggestion.matchScore}% Match
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="text-center">
                            <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-2">
                              <span className="text-gray-500 text-xs">Your Item</span>
                            </div>
                            <h4 className="font-medium text-gray-900 text-sm">{suggestion.yourItem.title}</h4>
                            <p className="text-sm text-green-600">${suggestion.yourItem.value}</p>
                          </div>

                          <div className="text-center">
                            <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-2">
                              <span className="text-gray-500 text-xs">Their Item</span>
                            </div>
                            <h4 className="font-medium text-gray-900 text-sm">{suggestion.suggestedItem.title}</h4>
                            <p className="text-sm text-green-600">${suggestion.suggestedItem.value}</p>
                            <p className="text-xs text-gray-500">by {suggestion.suggestedItem.owner}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => proposeExchange(suggestion)}
                          className="btn btn-primary w-full"
                        >
                          Propose Exchange
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'create' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Create New Exchange</h2>
                  
                  <div className="max-w-2xl">
                    <form className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          What are you offering?
                        </label>
                        <select className="input">
                          <option>Select your item</option>
                          <option>iPhone 13 Pro</option>
                          <option>Gaming PC Setup</option>
                          <option>Guitar - Fender Stratocaster</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          What would you like to trade for?
                        </label>
                        <input
                          type="text"
                          placeholder="Describe what you're looking for..."
                          className="input"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Message to potential traders
                        </label>
                        <textarea
                          rows={4}
                          placeholder="Explain why this would be a good trade..."
                          className="input"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Preferred meeting location
                        </label>
                        <input
                          type="text"
                          placeholder="City, State or specific location"
                          className="input"
                        />
                      </div>

                      <div className="flex gap-4">
                        <button type="submit" className="btn btn-primary">
                          Create Exchange
                        </button>
                        <button type="button" className="btn btn-outline">
                          Save Draft
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Exchange Modal */}
        {showExchangeModal && selectedExchange && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Propose Exchange</h3>
              
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Exchange Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Your Item:</span>
                    <span>{selectedExchange.yourItem.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Their Item:</span>
                    <span>{selectedExchange.suggestedItem.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Match Score:</span>
                    <span className="text-green-600">{selectedExchange.matchScore}%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message (optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Add a message explaining why this would be a good trade..."
                    className="input"
                  />
                </div>

                <div className="flex gap-3">
                  <button className="btn btn-primary flex-1">
                    Send Exchange Offer
                  </button>
                  <button
                    onClick={() => setShowExchangeModal(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
} 