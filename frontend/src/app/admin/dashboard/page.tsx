'use client';

import { useState } from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

// Mock admin data
const stats = {
  totalUsers: 12450,
  activeUsers: 8920,
  totalItems: 45670,
  activeListings: 34200,
  totalTrades: 23450,
  successfulTrades: 22100,
  revenue: 45600,
  growth: 12.5
};

const recentActivities = [
  {
    id: 1,
    type: 'user_registration',
    user: 'john.doe@example.com',
    action: 'New user registered',
    timestamp: '2 minutes ago',
    status: 'success'
  },
  {
    id: 2,
    type: 'item_reported',
    user: 'item_123',
    action: 'Item reported for inappropriate content',
    timestamp: '15 minutes ago',
    status: 'pending'
  },
  {
    id: 3,
    type: 'trade_completed',
    user: 'trade_456',
    action: 'Trade completed successfully',
    timestamp: '1 hour ago',
    status: 'success'
  },
  {
    id: 4,
    type: 'payment_processed',
    user: 'payment_789',
    action: 'Premium subscription payment',
    timestamp: '2 hours ago',
    status: 'success'
  }
];

const topCategories = [
  { name: 'Electronics', items: 12470, trades: 8900, growth: 15.2 },
  { name: 'Fashion', items: 8920, trades: 6700, growth: 8.7 },
  { name: 'Sports', items: 4560, trades: 3400, growth: 12.1 },
  { name: 'Books', items: 5670, trades: 4200, growth: 5.3 },
  { name: 'Home & Garden', items: 7890, trades: 5800, growth: 9.8 }
];

const userReports = [
  {
    id: 1,
    type: 'inappropriate_content',
    item: 'iPhone 13 Pro',
    reporter: 'user123',
    reportedUser: 'seller456',
    status: 'pending',
    timestamp: '1 hour ago'
  },
  {
    id: 2,
    type: 'fraud',
    item: 'MacBook Pro',
    reporter: 'user789',
    reportedUser: 'seller101',
    status: 'investigating',
    timestamp: '3 hours ago'
  }
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedReport, setSelectedReport] = useState(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-8">
        <div className="container max-w-7xl">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Manage platform operations, users, and content
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-xl">👥</span>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600">+{stats.growth}% from last month</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Listings</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeListings.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-xl">📦</span>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600">+8.2% from last month</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Successful Trades</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.successfulTrades.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 text-xl">🤝</span>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600">+15.7% from last month</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.revenue.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-600 text-xl">💰</span>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600">+22.3% from last month</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'overview', label: 'Overview', icon: '📊' },
                  { id: 'users', label: 'Users', icon: '👥' },
                  { id: 'content', label: 'Content', icon: '📝' },
                  { id: 'reports', label: 'Reports', icon: '🚨' },
                  { id: 'analytics', label: 'Analytics', icon: '📈' },
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

            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Recent Activity */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      {recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className={`w-2 h-2 rounded-full ${
                            activity.status === 'success' ? 'bg-green-500' : 'bg-yellow-500'
                          }`}></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                            <p className="text-xs text-gray-500">{activity.user} • {activity.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Categories */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Categories</h3>
                    <div className="space-y-3">
                      {topCategories.map((category) => (
                        <div key={category.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{category.name}</p>
                            <p className="text-sm text-gray-500">{category.items} items • {category.trades} trades</p>
                          </div>
                          <span className="text-sm text-green-600">+{category.growth}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'users' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Search users..."
                        className="input"
                      />
                      <select className="input">
                        <option>All Users</option>
                        <option>Active</option>
                        <option>Suspended</option>
                        <option>Premium</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Items
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Trades
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {[1, 2, 3, 4, 5].map((user) => (
                          <tr key={user}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                  <span className="text-gray-600 text-sm">U</span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">User {user}</div>
                                  <div className="text-sm text-gray-500">user{user}@example.com</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                Active
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {Math.floor(Math.random() * 20) + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {Math.floor(Math.random() * 50) + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                              <button className="text-red-600 hover:text-red-900">Suspend</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'reports' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">User Reports</h3>
                  <div className="space-y-4">
                    {userReports.map((report) => (
                      <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              report.status === 'investigating' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                            </span>
                            <span className="text-sm text-gray-500">{report.timestamp}</span>
                          </div>
                          <button
                            onClick={() => setSelectedReport(report)}
                            className="btn btn-primary text-sm px-3 py-1"
                          >
                            Review
                          </button>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm"><strong>Type:</strong> {report.type.replace('_', ' ')}</p>
                          <p className="text-sm"><strong>Item:</strong> {report.item}</p>
                          <p className="text-sm"><strong>Reporter:</strong> {report.reporter}</p>
                          <p className="text-sm"><strong>Reported User:</strong> {report.reportedUser}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Platform Analytics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">User Growth</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">This Month</span>
                          <span className="text-sm font-medium">+1,234 users</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Last Month</span>
                          <span className="text-sm font-medium">+987 users</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Growth Rate</span>
                          <span className="text-sm text-green-600 font-medium">+25.1%</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Trade Success Rate</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Successful Trades</span>
                          <span className="text-sm font-medium">22,100</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Total Trades</span>
                          <span className="text-sm font-medium">23,450</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Success Rate</span>
                          <span className="text-sm text-green-600 font-medium">94.2%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Platform Settings</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">General Settings</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Maintenance Mode</span>
                          <input type="checkbox" className="rounded" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Auto-approve Items</span>
                          <input type="checkbox" className="rounded" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Email Notifications</span>
                          <input type="checkbox" className="rounded" defaultChecked />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Security Settings</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Two-Factor Authentication</span>
                          <input type="checkbox" className="rounded" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Content Moderation</span>
                          <input type="checkbox" className="rounded" defaultChecked />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button className="btn btn-primary">Save Settings</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Report Review Modal */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Review Report</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
                  <select className="input">
                    <option>Dismiss Report</option>
                    <option>Warn User</option>
                    <option>Suspend User</option>
                    <option>Remove Item</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Add notes about this decision..."
                    className="input"
                  />
                </div>

                <div className="flex gap-3">
                  <button className="btn btn-primary flex-1">
                    Take Action
                  </button>
                  <button
                    onClick={() => setSelectedReport(null)}
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