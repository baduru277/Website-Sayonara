'use client';

import { useState } from 'react';

// Mock data
const conversations = [
  {
    id: 1,
    user: {
      name: "TechTrader",
      avatar: "/api/placeholder/50/50",
      online: true
    },
    lastMessage: "Hi! I'm interested in your iPhone 13 Pro. Would you trade for a MacBook Air?",
    timestamp: "2 min ago",
    unread: 2,
    item: "iPhone 13 Pro"
  },
  {
    id: 2,
    user: {
      name: "SneakerHead",
      avatar: "/api/placeholder/50/50",
      online: false
    },
    lastMessage: "Thanks for the trade! Everything looks great.",
    timestamp: "1 hour ago",
    unread: 0,
    item: "Nike Air Jordan 1"
  },
  {
    id: 3,
    user: {
      name: "MusicLover",
      avatar: "/api/placeholder/50/50",
      online: true
    },
    lastMessage: "Can we meet tomorrow at 3 PM?",
    timestamp: "3 hours ago",
    unread: 1,
    item: "Guitar - Fender Stratocaster"
  }
];

const messages = [
  {
    id: 1,
    sender: "TechTrader",
    content: "Hi! I'm interested in your iPhone 13 Pro. Would you trade for a MacBook Air?",
    timestamp: "2:30 PM",
    isOwn: false
  },
  {
    id: 2,
    sender: "You",
    content: "Hi! Yes, I'd be interested in a MacBook Air. What model and condition is it?",
    timestamp: "2:32 PM",
    isOwn: true
  },
  {
    id: 3,
    sender: "TechTrader",
    content: "It's a 2021 M1 MacBook Air, 8GB RAM, 256GB SSD. Excellent condition, barely used. Comes with original box and charger.",
    timestamp: "2:35 PM",
    isOwn: false
  },
  {
    id: 4,
    sender: "TechTrader",
    content: "Would you like to see some photos?",
    timestamp: "2:35 PM",
    isOwn: false
  }
];

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const filteredConversations = activeTab === 'all' 
    ? conversations 
    : conversations.filter(conv => activeTab === 'unread' ? conv.unread > 0 : true);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-gray-50 py-8">
        <div className="container max-w-6xl">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-3 h-[600px]">
              {/* Conversations List */}
              <div className="border-r border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Messages</h2>
                  
                  {/* Tabs */}
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => setActiveTab('all')}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        activeTab === 'all' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setActiveTab('unread')}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        activeTab === 'unread' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Unread
                    </button>
                  </div>
                </div>

                <div className="overflow-y-auto h-[500px]">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation.id)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                        selectedConversation === conversation.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 font-medium">
                              {conversation.user.name[0]}
                            </span>
                          </div>
                          {conversation.user.online && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {conversation.user.name}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {conversation.timestamp}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 truncate mb-1">
                            {conversation.lastMessage}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-blue-600">
                              {conversation.item}
                            </span>
                            {conversation.unread > 0 && (
                              <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">
                                {conversation.unread}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Area */}
              <div className="lg:col-span-2 flex flex-col">
                {selectedConversation ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 font-medium">T</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">TechTrader</h3>
                          <p className="text-sm text-gray-500">iPhone 13 Pro</p>
                        </div>
                        <div className="ml-auto flex items-center gap-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600">
                            📞
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600">
                            📹
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600">
                            ⚙️
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.isOwn
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.isOwn ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {message.timestamp}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t border-gray-200">
                      <form onSubmit={handleSendMessage} className="flex gap-3">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message..."
                          className="flex-1 input"
                        />
                        <button
                          type="submit"
                          className="btn btn-primary px-6"
                        >
                          Send
                        </button>
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">💬</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Select a conversation
                      </h3>
                      <p className="text-gray-600">
                        Choose a conversation from the list to start messaging
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 