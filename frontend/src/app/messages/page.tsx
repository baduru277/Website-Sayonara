'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import apiService from '@/services/api';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

function fixUrl(url: string) {
  if (!url) return '';
  return url.startsWith('http') ? url : `${BASE_URL}${url}`;
}

interface OtherUser {
  id: string;
  name: string;
  avatar?: string;
  online?: boolean;
  isVerified?: boolean;
}

interface ItemInfo {
  id: string;
  title: string;
  image?: string;
  type?: string;
  price?: number;
}

interface Conversation {
  id: string;
  otherUser: OtherUser;
  item?: ItemInfo;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content?: string;
  imageUrl?: string;
  messageType: 'text' | 'image' | 'item_share';
  itemSnapshot?: any;
  isRead: boolean;
  createdAt: string;
  sender?: { id: string; name: string; avatar?: string };
}

export default function MessagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sellerId = searchParams.get('sellerId');
  const itemId = searchParams.get('itemId');

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [otherUser, setOtherUser] = useState<OtherUser | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [currentUserId, setCurrentUserId] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollingRef = useRef<NodeJS.Timeout>();

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  useEffect(() => {
    loadCurrentUser();
    loadConversations();
  }, []);

  useEffect(() => {
    if (sellerId) {
      startConversationWith(sellerId, itemId || undefined);
    }
  }, [sellerId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Poll for new messages every 5s
  useEffect(() => {
    if (selectedConv) {
      pollingRef.current = setInterval(() => {
        loadMessages(selectedConv.otherUser.id, selectedConv.item?.id);
      }, 5000);
    }
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, [selectedConv]);

  const loadCurrentUser = async () => {
    try {
      const user = await apiService.getCurrentUser();
      setCurrentUserId(user?.id || user?.user?.id || '');
    } catch {}
  };

  const loadConversations = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/messages/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setConversations(data.conversations || []);
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (otherUserId: string, convItemId?: string) => {
    try {
      const url = `${API_URL}/messages/${otherUserId}${convItemId ? `?itemId=${convItemId}` : ''}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setMessages(data.messages || []);
      if (data.otherUser) setOtherUser(data.otherUser);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  const startConversationWith = async (userId: string, convItemId?: string) => {
    const existing = conversations.find(c =>
      c.otherUser.id === userId && (!convItemId || c.item?.id === convItemId)
    );
    if (existing) {
      selectConversation(existing);
    } else {
      // Create a temp conversation
      try {
        const res = await fetch(`${API_URL}/messages/${userId}${convItemId ? `?itemId=${convItemId}` : ''}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.otherUser) {
          const tempConv: Conversation = {
            id: `${userId}_${convItemId || 'general'}`,
            otherUser: data.otherUser,
            item: convItemId ? { id: convItemId, title: 'Item' } : undefined,
            lastMessage: '',
            lastMessageTime: new Date().toISOString(),
            unreadCount: 0
          };
          setSelectedConv(tempConv);
          setOtherUser(data.otherUser);
          setMessages(data.messages || []);
        }
      } catch {}
    }
  };

  const selectConversation = async (conv: Conversation) => {
    setSelectedConv(conv);
    await loadMessages(conv.otherUser.id, conv.item?.id);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConv || sending) return;
    setSending(true);
    try {
      const res = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverId: selectedConv.otherUser.id,
          content: newMessage.trim(),
          itemId: selectedConv.item?.id || null
        })
      });
      const data = await res.json();
      if (data.message) {
        setMessages(prev => [...prev, data.message]);
        setNewMessage('');
        loadConversations();
      }
    } catch (err) {
      console.error('Send failed:', err);
    } finally {
      setSending(false);
    }
  };

  const sendImage = async (file: File) => {
    if (!selectedConv) return;
    setSending(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('receiverId', selectedConv.otherUser.id);
      if (selectedConv.item?.id) formData.append('itemId', selectedConv.item.id);

      const res = await fetch(`${API_URL}/messages/image`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (data.message) {
        setMessages(prev => [...prev, data.message]);
        loadConversations();
      }
    } catch (err) {
      console.error('Image send failed:', err);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  };

  const filteredConvs = activeTab === 'unread'
    ? conversations.filter(c => c.unreadCount > 0)
    : conversations;

  return (
    <div style={{ minHeight: '100vh', background: '#f7f7fa' }}>
      <style>{`
        .msg-input:focus { outline: none; border-color: #924DAC; }
        .conv-item:hover { background: #f9f5ff; }
        .send-btn:hover { background: #7a3a8a !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e0d0f0; border-radius: 4px; }
      `}</style>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1a1a2e', marginBottom: 20 }}>💬 Messages</h1>

        <div style={{
          display: 'grid', gridTemplateColumns: '320px 1fr',
          gap: 0, background: '#fff', borderRadius: 16,
          boxShadow: '0 2px 20px rgba(146,77,172,0.1)',
          border: '1.5px solid #f0e6fa', overflow: 'hidden', height: 620
        }}>

          {/* ── Left: Conversations ── */}
          <div style={{ borderRight: '1.5px solid #f0e6fa', display: 'flex', flexDirection: 'column' }}>
            {/* Tabs */}
            <div style={{ padding: '16px 16px 0', borderBottom: '1.5px solid #f0e6fa' }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                {(['all', 'unread'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: '6px 16px', borderRadius: 20, border: 'none', cursor: 'pointer',
                      fontWeight: 600, fontSize: 13,
                      background: activeTab === tab ? '#924DAC' : '#f0e6fa',
                      color: activeTab === tab ? '#fff' : '#924DAC',
                    }}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {tab === 'unread' && conversations.filter(c => c.unreadCount > 0).length > 0 && (
                      <span style={{ marginLeft: 6, background: '#e74c3c', color: '#fff', borderRadius: 10, padding: '1px 6px', fontSize: 11 }}>
                        {conversations.filter(c => c.unreadCount > 0).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation List */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {loading ? (
                <div style={{ padding: 24, textAlign: 'center', color: '#924DAC' }}>Loading...</div>
              ) : filteredConvs.length === 0 ? (
                <div style={{ padding: 32, textAlign: 'center', color: '#aaa' }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>💬</div>
                  <div style={{ fontSize: 14 }}>No conversations yet</div>
                </div>
              ) : (
                filteredConvs.map(conv => (
                  <div
                    key={conv.id}
                    className="conv-item"
                    onClick={() => selectConversation(conv)}
                    style={{
                      padding: '14px 16px', cursor: 'pointer',
                      borderBottom: '1px solid #f9f5ff',
                      background: selectedConv?.id === conv.id ? '#f9f5ff' : '#fff',
                      borderLeft: selectedConv?.id === conv.id ? '3px solid #924DAC' : '3px solid transparent',
                    }}
                  >
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      {/* Avatar */}
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: '50%',
                          background: 'linear-gradient(135deg, #924DAC, #b06fd4)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff', fontWeight: 700, fontSize: 18, overflow: 'hidden'
                        }}>
                          {conv.otherUser.avatar
                            ? <img src={fixUrl(conv.otherUser.avatar)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : conv.otherUser.name.charAt(0).toUpperCase()
                          }
                        </div>
                        {conv.otherUser.online && (
                          <div style={{
                            position: 'absolute', bottom: 0, right: 0,
                            width: 12, height: 12, borderRadius: '50%',
                            background: '#2ecc71', border: '2px solid #fff'
                          }} />
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                          <span style={{ fontWeight: 700, fontSize: 14, color: '#1a1a2e' }}>
                            {conv.otherUser.name}
                          </span>
                          <span style={{ fontSize: 11, color: '#aaa' }}>
                            {formatTime(conv.lastMessageTime)}
                          </span>
                        </div>
                        {conv.item && (
                          <div style={{ fontSize: 11, color: '#924DAC', fontWeight: 600, marginBottom: 2 }}>
                            📦 {conv.item.title}
                          </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 12, color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>
                            {conv.lastMessage || 'Start a conversation'}
                          </span>
                          {conv.unreadCount > 0 && (
                            <span style={{
                              background: '#924DAC', color: '#fff',
                              fontSize: 11, fontWeight: 700,
                              padding: '2px 7px', borderRadius: 10
                            }}>
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ── Right: Chat Area ── */}
          {selectedConv && otherUser ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Chat Header */}
              <div style={{ padding: '14px 20px', borderBottom: '1.5px solid #f0e6fa', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #924DAC, #b06fd4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 700, fontSize: 16, overflow: 'hidden', flexShrink: 0
                }}>
                  {otherUser.avatar
                    ? <img src={fixUrl(otherUser.avatar)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : otherUser.name.charAt(0).toUpperCase()
                  }
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: '#1a1a2e', fontSize: 15 }}>
                    {otherUser.name}
                    {otherUser.isVerified && <span style={{ color: '#2ecc71', fontSize: 12, marginLeft: 6 }}>✓</span>}
                  </div>
                  {selectedConv.item && (
                    <div style={{ fontSize: 12, color: '#924DAC', fontWeight: 600 }}>
                      📦 {selectedConv.item.title}
                    </div>
                  )}
                </div>
              </div>

              {/* Item Card in Chat (if linked to item) */}
              {selectedConv.item && (
                <div style={{
                  margin: '12px 16px 0',
                  background: '#f9f5ff', borderRadius: 10, padding: 12,
                  border: '1.5px solid #e8d5f5', display: 'flex', gap: 12, alignItems: 'center'
                }}>
                  {selectedConv.item.image && (
                    <img src={fixUrl(selectedConv.item.image)} alt={selectedConv.item.title}
                      style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} />
                  )}
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#924DAC' }}>{selectedConv.item.title}</div>
                    {selectedConv.item.price && (
                      <div style={{ fontSize: 12, color: '#666' }}>
                        ₹{Number(selectedConv.item.price).toLocaleString('en-IN')}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => router.push(`/${selectedConv.item?.type || 'resell'}/${selectedConv.item?.id}`)}
                    style={{
                      marginLeft: 'auto', background: '#924DAC', color: '#fff',
                      border: 'none', borderRadius: 6, padding: '6px 12px',
                      fontSize: 12, fontWeight: 600, cursor: 'pointer'
                    }}
                  >
                    View Item
                  </button>
                </div>
              )}

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {messages.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#aaa', marginTop: 60 }}>
                    <div style={{ fontSize: 40, marginBottom: 8 }}>👋</div>
                    <div>Say hello to {otherUser.name}!</div>
                  </div>
                ) : (
                  messages.map(msg => {
                    const isOwn = msg.senderId === currentUserId;
                    return (
                      <div key={msg.id} style={{ display: 'flex', justifyContent: isOwn ? 'flex-end' : 'flex-start' }}>
                        <div style={{
                          maxWidth: '70%',
                          background: isOwn ? 'linear-gradient(135deg, #924DAC, #b06fd4)' : '#f0e6fa',
                          color: isOwn ? '#fff' : '#1a1a2e',
                          borderRadius: isOwn ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                          padding: '10px 14px',
                        }}>
                          {/* Image message */}
                          {msg.messageType === 'image' && msg.imageUrl && (
                            <img
                              src={fixUrl(msg.imageUrl)}
                              alt="Shared image"
                              style={{ maxWidth: 200, borderRadius: 8, display: 'block', marginBottom: msg.content ? 6 : 0 }}
                            />
                          )}

                          {/* Item share */}
                          {msg.messageType === 'item_share' && msg.itemSnapshot && (
                            <div style={{
                              background: isOwn ? 'rgba(255,255,255,0.15)' : '#fff',
                              borderRadius: 8, padding: 10, marginBottom: 6,
                              display: 'flex', gap: 10, alignItems: 'center',
                              cursor: 'pointer'
                            }}
                              onClick={() => router.push(`/${msg.itemSnapshot.type}/${msg.itemSnapshot.id}`)}
                            >
                              {msg.itemSnapshot.image && (
                                <img src={fixUrl(msg.itemSnapshot.image)} alt={msg.itemSnapshot.title}
                                  style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }} />
                              )}
                              <div>
                                <div style={{ fontSize: 12, fontWeight: 700, color: isOwn ? '#fff' : '#924DAC' }}>
                                  {msg.itemSnapshot.title}
                                </div>
                                {msg.itemSnapshot.price && (
                                  <div style={{ fontSize: 11, color: isOwn ? 'rgba(255,255,255,0.8)' : '#666' }}>
                                    ₹{Number(msg.itemSnapshot.price).toLocaleString('en-IN')}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Text */}
                          {msg.content && msg.messageType !== 'item_share' && (
                            <div style={{ fontSize: 14, lineHeight: 1.5 }}>{msg.content}</div>
                          )}

                          <div style={{ fontSize: 11, opacity: 0.7, marginTop: 4, textAlign: 'right' }}>
                            {formatTime(msg.createdAt)}
                            {isOwn && <span style={{ marginLeft: 4 }}>{msg.isRead ? '✓✓' : '✓'}</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div style={{ padding: '12px 16px', borderTop: '1.5px solid #f0e6fa', display: 'flex', gap: 10, alignItems: 'center' }}>
                {/* Image upload */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) sendImage(file);
                    e.target.value = '';
                  }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    width: 38, height: 38, borderRadius: '50%', border: 'none',
                    background: '#f0e6fa', color: '#924DAC', fontSize: 18,
                    cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                  title="Send image"
                >
                  📷
                </button>

                <input
                  className="msg-input"
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder="Type a message..."
                  style={{
                    flex: 1, padding: '10px 14px', borderRadius: 20,
                    border: '1.5px solid #e0d0f0', fontSize: 14,
                    background: '#faf8fd'
                  }}
                />

                <button
                  className="send-btn"
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || sending}
                  style={{
                    width: 38, height: 38, borderRadius: '50%', border: 'none',
                    background: newMessage.trim() ? '#924DAC' : '#e0d0f0',
                    color: '#fff', fontSize: 18, cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                    flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 0.2s'
                  }}
                >
                  {sending ? '⏳' : '➤'}
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#aaa' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>💬</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: '#666' }}>Select a conversation</div>
              <div style={{ fontSize: 14, marginTop: 6 }}>Choose from the list or chat with a seller</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
