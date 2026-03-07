'use client';

import { useState } from 'react';

export default function NotificationBell() {
  const [count] = useState(0);
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          position: 'relative',
          padding: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title="Notifications"
      >
        <span style={{ fontSize: 22 }}>🔔</span>
        {count > 0 && (
          <span style={{
            position: 'absolute',
            top: 0,
            right: 0,
            background: '#e53e3e',
            color: '#fff',
            fontSize: 10,
            fontWeight: 700,
            borderRadius: 99,
            padding: '1px 5px',
            minWidth: 16,
            textAlign: 'center',
            lineHeight: '16px',
          }}>
            {count}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: 8,
          backgroundColor: 'white',
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          border: '1px solid #e5e7eb',
          minWidth: 260,
          zIndex: 1000,
          overflow: 'hidden',
        }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6', backgroundColor: '#f9fafb' }}>
            <span style={{ fontWeight: 700, color: '#374151', fontSize: 14 }}>Notifications</span>
          </div>
          <div style={{ padding: 24, textAlign: 'center', color: '#aaa', fontSize: 14 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔔</div>
            No notifications yet
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {open && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 999 }}
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}
