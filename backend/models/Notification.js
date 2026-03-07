'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface Notification {
  id: string;
  type: 'message' | 'bid' | 'exchange' | 'system' | 'sale';
  title: string;
  message: string;
  link?: string;
  fromUserName?: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  const getToken = () => localStorage.getItem('token');

  const fetchNotifications = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);

        // Browser push notification for new unread
        if (data.unreadCount > unreadCount && unreadCount !== 0) {
          triggerBrowserNotification(data.notifications[0]);
        }
      }
    } catch {}
  };

  const triggerBrowserNotification = (notif: Notification) => {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      new Notification(`Sayonara — ${notif.title}`, {
        body: notif.message,
        icon: '/favicon.ico',
      });
    }
  };

  const requestBrowserPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    requestBrowserPermission();
    fetchNotifications();

    // Poll every 15 seconds for new notifications
    pollRef.current = setInterval(fetchNotifications, 15000);

    // Click outside to close
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const markAllRead = async () => {
    const token = getToken();
    if (!token) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/mark-all-read`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    });
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const markOneRead = async (id: string) => {
    const token = getToken();
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/${id}/read`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    });
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleNotifClick = (notif: Notification) => {
    markOneRead(notif.id);
    setShowDropdown(false);
    if (notif.link) router.push(notif.link);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'message': return '💬';
      case 'bid': return '🔨';
      case 'exchange': return '🔄';
      case 'sale': return '💰';
      default: return '🔔';
    }
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const token = getToken();
  if (!token) return null;

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>

      {/* Bell Button */}
      <button
        onClick={() => { setShowDropdown(!showDropdown); if (!showDropdown) fetchNotifications(); }}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          position: 'relative', padding: '4px 8px', fontSize: 22,
          display: 'flex', alignItems: 'center'
        }}
        title="Notifications"
      >
        🔔
        {/* Unread badge */}
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: 0, right: 0,
            background: '#e53e3e', color: '#fff',
            fontSize: 10, fontWeight: 700,
            borderRadius: 99, minWidth: 16, height: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 4px', border: '2px solid #fff'
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div style={{
          position: 'absolute', top: '100%', right: 0, marginTop: 8,
          background: '#fff', borderRadius: 12,
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          border: '1px solid #e5e7eb',
          width: 340, maxHeight: 480,
          overflow: 'hidden', zIndex: 2000,
          display: 'flex', flexDirection: 'column'
        }}>

          {/* Header */}
          <div style={{
            padding: '14px 16px', borderBottom: '1px solid #f3f4f6',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: '#faf5ff'
          }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#924DAC' }}>
              🔔 Notifications {unreadCount > 0 && (
                <span style={{ background: '#924DAC', color: '#fff', borderRadius: 99, fontSize: 11, padding: '1px 7px', marginLeft: 6 }}>
                  {unreadCount} new
                </span>
              )}
            </span>
            {unreadCount > 0 && (
              <button onClick={markAllRead} style={{
                background: 'none', border: 'none', color: '#924DAC',
                fontSize: 12, cursor: 'pointer', fontWeight: 600
              }}>
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {notifications.length === 0 ? (
              <div style={{ padding: 32, textAlign: 'center', color: '#aaa' }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🔕</div>
                <p style={{ margin: 0, fontSize: 14 }}>No notifications yet</p>
              </div>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => handleNotifClick(notif)}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #f9f9f9',
                    cursor: notif.link ? 'pointer' : 'default',
                    background: notif.isRead ? '#fff' : '#faf5ff',
                    display: 'flex', gap: 12, alignItems: 'flex-start',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f3e8ff')}
                  onMouseLeave={e => (e.currentTarget.style.background = notif.isRead ? '#fff' : '#faf5ff')}
                >
                  <span style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>
                    {getIcon(notif.type)}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: notif.isRead ? 500 : 700, fontSize: 13, color: '#222' }}>
                        {notif.title}
                      </span>
                      <span style={{ fontSize: 11, color: '#aaa', flexShrink: 0, marginLeft: 8 }}>
                        {timeAgo(notif.createdAt)}
                      </span>
                    </div>
                    <p style={{ margin: '2px 0 0', fontSize: 12, color: '#666', lineHeight: 1.4,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {notif.fromUserName && <strong>{notif.fromUserName}: </strong>}
                      {notif.message}
                    </p>
                  </div>
                  {!notif.isRead && (
                    <span style={{ width: 8, height: 8, background: '#924DAC', borderRadius: '50%', flexShrink: 0, marginTop: 6 }} />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div style={{ padding: '10px 16px', borderTop: '1px solid #f3f4f6', textAlign: 'center' }}>
              <a href="/profile" style={{ color: '#924DAC', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                View all in Dashboard →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
