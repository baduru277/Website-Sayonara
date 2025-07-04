'use client';

import { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Mock user data
const userData = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "/api/placeholder/100/100",
  location: "New York, NY",
  memberSince: "March 2023",
  rating: 4.8,
  totalTrades: 45,
  successfulTrades: 42,
  bio: "Passionate about sustainable trading and finding new homes for items I no longer need. Always looking for fair trades!",
  items: [
    {
      id: 1,
      title: "iPhone 13 Pro",
      image: "/api/placeholder/300/200",
      status: "active",
      views: 127,
      likes: 23
    },
    {
      id: 2,
      title: "Nike Air Jordan 1",
      image: "/api/placeholder/300/200",
      status: "pending",
      views: 89,
      likes: 15
    },
    {
      id: 3,
      title: "Guitar - Fender Stratocaster",
      image: "/api/placeholder/300/200",
      status: "traded",
      views: 156,
      likes: 31
    }
  ]
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    location: userData.location,
    bio: userData.bio
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    // Handle profile update
    console.log('Profile updated:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-8">
        <div className="container max-w-6xl">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-2xl font-bold">{userData.name[0]}</span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{userData.name}</h1>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="font-semibold">{userData.rating}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-3">
                  <span>📍 {userData.location}</span>
                  <span>Member since {userData.memberSince}</span>
                  <span>{userData.totalTrades} total trades</span>
                  <span>{userData.successfulTrades} successful</span>
                </div>
                
                <p className="text-gray-700">{userData.bio}</p>
              </div>
              
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-outline"
              >
                Edit Profile
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'profile', label: 'Profile', icon: '👤' },
                  { id: 'items', label: 'My Items', icon: '📦' },
                  { id: 'trades', label: 'Trades', icon: '🤝' },
                  { id: 'reviews', label: 'Reviews', icon: '⭐' },
                  { id: 'settings', label: 'Settings', icon: '⚙️' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                  
                  {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="input"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="input"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          className="input"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bio
                        </label>
                        <textarea
                          name="bio"
                          rows={4}
                          value={formData.bio}
                          onChange={handleChange}
                          className="input"
                        />
                      </div>
                      
                      <div className="flex gap-3">
                        <button type="submit" className="btn btn-primary">
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="btn btn-outline"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Contact Information</h3>
                        <div className="space-y-2 text-gray-600">
                          <p><strong>Name:</strong> {userData.name}</p>
                          <p><strong>Email:</strong> {userData.email}</p>
                          <p><strong>Location:</strong> {userData.location}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Trading Stats</h3>
                        <div className="space-y-2 text-gray-600">
                          <p><strong>Member since:</strong> {userData.memberSince}</p>
                          <p><strong>Total trades:</strong> {userData.totalTrades}</p>
                          <p><strong>Success rate:</strong> {Math.round((userData.successfulTrades / userData.totalTrades) * 100)}%</p>
                          <p><strong>Rating:</strong> ⭐ {userData.rating}/5</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'items' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">My Items</h2>
                    <button className="btn btn-primary">
                      + Add New Item
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userData.items.map((item) => (
                      <div key={item.id} className="card p-4">
                        <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                          <span className="text-gray-500">Item Image</span>
                        </div>
                        
                        <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                        
                        <div className="flex items-center justify-between mb-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            item.status === 'active' ? 'bg-green-100 text-green-800' :
                            item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </span>
                          <div className="text-sm text-gray-500">
                            👁️ {item.views} • ❤️ {item.likes}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button className="btn btn-primary text-sm flex-1">
                            Edit
                          </button>
                          <button className="btn btn-outline text-sm">
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'trades' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Trade History</h2>
                  <div className="space-y-4">
                    {[1, 2, 3].map((trade) => (
                      <div key={trade} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">Trade #{trade}</h3>
                          <span className="text-sm text-gray-500">2 days ago</span>
                        </div>
                        <p className="text-gray-600 mb-2">iPhone 13 Pro ↔ MacBook Air</p>
                        <div className="flex items-center gap-2">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                            Completed
                          </span>
                          <span className="text-sm text-gray-500">with TechTrader</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
                  <div className="space-y-4">
                    {[1, 2, 3].map((review) => (
                      <div key={review} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex text-yellow-500">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star}>⭐</span>
                            ))}
                          </div>
                          <span className="font-semibold text-gray-900">Great trade!</span>
                        </div>
                        <p className="text-gray-600 mb-2">
                          "Excellent communication and the item was exactly as described. Would trade again!"
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>by User{review}</span>
                          <span>1 week ago</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
                      <div className="space-y-3">
                        {[
                          'New trade offers',
                          'Messages from other users',
                          'Item views and likes',
                          'Weekly digest'
                        ].map((setting) => (
                          <div key={setting} className="flex items-center justify-between">
                            <span className="text-gray-700">{setting}</span>
                            <input type="checkbox" className="rounded" defaultChecked />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">Show my location to other users</span>
                          <input type="checkbox" className="rounded" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">Allow messages from all users</span>
                          <input type="checkbox" className="rounded" defaultChecked />
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <button className="btn btn-outline text-red-600 border-red-600 hover:bg-red-50">
                        Delete Account
                      </button>
                    </div>
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