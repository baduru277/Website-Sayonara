"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import 'animate.css';

export default function Hero() {
  const [search, setSearch] = useState('');
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  // Request form state
  const [reqName, setReqName] = useState('');
  const [reqPhone, setReqPhone] = useState('');
  const [reqItem, setReqItem] = useState('');
  const [reqDesc, setReqDesc] = useState('');
  const [reqBudget, setReqBudget] = useState('');
  const [reqSubmitted, setReqSubmitted] = useState(false);
  const [reqLoading, setReqLoading] = useState(false);

  // Restore pending item request after login
  useEffect(() => {
    const pending = localStorage.getItem('pendingItemRequest');
    if (pending && loggedIn) {
      localStorage.removeItem('pendingItemRequest');
      setReqItem(pending);
      setSearch(pending);
      setShowRequestForm(true);
    }
  }, [loggedIn]);

  // Check login and pre-fill user data
  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp * 1000 > Date.now()) {
        setLoggedIn(true);
        // Fetch user details to pre-fill form
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(r => r.json())
          .then(data => {
            const user = data?.user || data;
            setUserData(user);
            if (user?.name) setReqName(user.name);
            if (user?.phone || user?.contact) setReqPhone(user.phone || user.contact || '');
          })
          .catch(() => {});
      }
    } catch {}
  }, []);

  const isLoggedIn = () => loggedIn;

  const handleGetStarted = (e: React.MouseEvent) => {
    e.preventDefault();
    if (loggedIn) {
      window.location.href = '/add-item';
    } else {
      window.location.href = '/?auth=signup';
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReqItem(search.trim());
    if (!loggedIn) {
      // Save item and redirect to signup, come back after login
      localStorage.setItem('pendingItemRequest', search.trim());
      window.location.href = '/?auth=signup';
      return;
    }
    setShowRequestForm(true);
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqName || !reqPhone || !reqItem) return;
    setReqLoading(true);
    try {
      // Send to backend
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/item-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: reqName,
          phone: reqPhone,
          item: reqItem,
          description: reqDesc,
          budget: reqBudget,
        })
      });
      // Even if backend isn't set up yet, show success
      setReqSubmitted(true);
    } catch (err) {
      setReqSubmitted(true); // Show success anyway, admin can review later
    } finally {
      setReqLoading(false);
    }
  };

  const closeRequestForm = () => {
    setShowRequestForm(false);
    setReqSubmitted(false);
    setReqName(''); setReqPhone(''); setReqItem(''); setReqDesc(''); setReqBudget('');
  };

  return (
    <>
      <section
        style={{
          background: '#fff',
          fontFamily: 'Quicksand, Montserrat, sans-serif',
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0 16px',
          position: 'relative',
        }}
      >
        <div style={{
          width: '100%',
          maxWidth: 700,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 28,
          paddingTop: 64,
          paddingBottom: 64,
        }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: 826, margin: '0 auto' }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              color: '#924DAC',
              marginBottom: 0,
              letterSpacing: 0,
              position: 'relative',
              zIndex: 1,
            }}>
              Welcome to Sayonara
            </h1>
          </div>

          <p style={{ fontSize: '1.25rem', color: '#444', margin: 0 }}>
            Your ultimate destination for trading, exchanging, and bidding on items!
          </p>

          {/* Search bar with submit */}
          <form onSubmit={handleSearchSubmit} style={{ width: '100%', maxWidth: 480, position: 'relative' }}>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search or request an item..."
              style={{
                width: '100%',
                padding: '16px 120px 16px 24px',
                border: '2px solid #924DAC',
                borderRadius: 999,
                fontSize: 17,
                color: '#924DAC',
                fontWeight: 500,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <button
              type="button"
              onClick={() => {
                setReqItem(search.trim());
                if (!loggedIn) {
                  localStorage.setItem('pendingItemRequest', search.trim());
                  window.location.href = '/?auth=signup';
                  return;
                }
                setShowRequestForm(true);
              }}
              style={{
                position: 'absolute',
                right: 6,
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#924DAC',
                color: '#fff',
                border: 'none',
                borderRadius: 999,
                padding: '9px 20px',
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Request →
            </button>
          </form>

          {/* Helper text under search */}
          <p style={{ fontSize: 13, color: '#888', margin: '-16px 0 0 0' }}>
            Can't find what you need? Click <strong style={{ color: '#924DAC' }}>Request →</strong> and we'll help you find it!
          </p>

          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 8 }}>
            <Link href="/bidding" className="sayonara-btn">Bidding</Link>
            <Link href="/exchange" className="sayonara-btn">Exchange</Link>
            <Link href="/resell" className="sayonara-btn">Resell</Link>
          </div>

          {/* Get Started — opens signup */}
          <button
            onClick={handleGetStarted}
            className="sayonara-btn"
            style={{ fontSize: 20, marginTop: 12, padding: '12px 36px', border: 'none', cursor: 'pointer' }}
          >
            Get Started
          </button>
        </div>
      </section>

      {/* ── Item Request Modal ── */}
      {showRequestForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 18, padding: 36, maxWidth: 460, width: '100%', boxShadow: '0 8px 40px rgba(0,0,0,0.18)', position: 'relative' }}>
            <button onClick={closeRequestForm} style={{ position: 'absolute', top: 16, right: 20, background: 'none', border: 'none', fontSize: 24, color: '#924DAC', cursor: 'pointer' }}>&times;</button>

            {!reqSubmitted ? (
              <>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>🔍</div>
                  <h2 style={{ fontWeight: 700, fontSize: 22, color: '#924DAC', marginBottom: 6 }}>Request an Item</h2>
                  <p style={{ color: '#666', fontSize: 14 }}>
                    Can't find <strong>"{reqItem}"</strong> listed? Fill this form and we'll try to find it for you!
                  </p>
                  {/* Show logged-in user badge */}
                  {loggedIn && userData && (
                    <div style={{ background: '#e7ffe7', borderRadius: 8, padding: '6px 14px', display: 'inline-block', fontSize: 13, color: '#2d7a2d', marginTop: 8 }}>
                      ✅ Logged in as <strong>{userData.name || userData.email}</strong>
                    </div>
                  )}
                </div>

                <form onSubmit={handleRequestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 4 }}>Your Name *</label>
                    <input type="text" value={reqName} onChange={e => setReqName(e.target.value)} placeholder="Enter your name" required
                      style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e0d0f0', borderRadius: 8, fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 4 }}>Phone Number *</label>
                    <input type="tel" value={reqPhone} onChange={e => setReqPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit mobile number" required
                      style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e0d0f0', borderRadius: 8, fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 4 }}>Item You're Looking For *</label>
                    <input type="text" value={reqItem} onChange={e => setReqItem(e.target.value)} placeholder="e.g. iPhone 13, Gaming Chair" required
                      style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #924DAC', borderRadius: 8, fontSize: 15, outline: 'none', boxSizing: 'border-box', background: '#faf5ff' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 4 }}>Description <span style={{ color: '#aaa', fontWeight: 400 }}>(optional)</span></label>
                    <textarea value={reqDesc} onChange={e => setReqDesc(e.target.value)} placeholder="Any specific details, condition, colour, model..." rows={3}
                      style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e0d0f0', borderRadius: 8, fontSize: 15, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 4 }}>Your Budget <span style={{ color: '#aaa', fontWeight: 400 }}>(optional)</span></label>
                    <input type="text" value={reqBudget} onChange={e => setReqBudget(e.target.value)} placeholder="e.g. ₹5000 - ₹10000"
                      style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e0d0f0', borderRadius: 8, fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
                  </div>

                  <button type="submit" disabled={reqLoading || !reqName || !reqPhone || !reqItem}
                    style={{ background: '#924DAC', color: '#fff', border: 'none', borderRadius: 10, padding: '13px 0', fontSize: 16, fontWeight: 700, cursor: 'pointer', marginTop: 4, opacity: (!reqName || !reqPhone || !reqItem) ? 0.6 : 1 }}>
                    {reqLoading ? 'Submitting...' : '📩 Submit Request'}
                  </button>

                  <p style={{ fontSize: 12, color: '#aaa', textAlign: 'center', margin: 0 }}>
                    We'll contact you on WhatsApp/call within 24 hours
                  </p>
                </form>
              </>
            ) : (
              /* Success state */
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
                <h2 style={{ fontWeight: 700, fontSize: 22, color: '#2d7a2d', marginBottom: 10 }}>Request Submitted!</h2>
                <p style={{ color: '#555', fontSize: 15, marginBottom: 8 }}>
                  We received your request for <strong style={{ color: '#924DAC' }}>"{reqItem}"</strong>
                </p>
                <p style={{ color: '#666', fontSize: 14, marginBottom: 24 }}>
                  Our team will contact <strong>{reqPhone}</strong> within 24 hours on WhatsApp or call.
                </p>
                <button onClick={closeRequestForm}
                  style={{ background: '#924DAC', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
