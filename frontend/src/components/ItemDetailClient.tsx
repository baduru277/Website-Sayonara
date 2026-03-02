'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Seller {
  id: string;
  name: string;
  rating: number;
  totalReviews: number;
  isVerified: boolean;
  isPrime: boolean;
  location?: string;
}

interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  type: 'exchange' | 'bidding' | 'resell';
  images: string[];
  tags: string[];
  location: string;
  views: number;
  createdAt: string;
  seller?: Seller;
  lookingFor?: string;
  startingBid?: number;
  currentBid?: number;
  buyNowPrice?: number;
  auctionEndDate?: string;
  totalBids?: number;
  price?: number;
  originalPrice?: number;
  discount?: number;
  stock?: number;
  shipping?: string;
  isPrime?: boolean;
  fastShipping?: boolean;
  warrantyStatus?: string;
  damageInfo?: string;
  usageHistory?: string;
  originalBox?: string;
}

interface Props {
  item: Item;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';

function fixImageUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${BASE_URL}${url}`;
}

export default function ItemDetailClient({ item }: Props) {
  const router = useRouter();
  const [mainImg, setMainImg] = useState(0);
  const [tab, setTab] = useState('description');
  const [imgError, setImgError] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [showBidInput, setShowBidInput] = useState(false);
  const [bidError, setBidError] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [ownerError, setOwnerError] = useState('');

  const images = (item.images || []).map(fixImageUrl).filter(Boolean);

  // Get logged in user id from token
  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const payload = JSON.parse(atob(token.split('.')[1]));
      setCurrentUserId(payload.id || payload.userId || payload.sub || null);
    } catch {}
  }, []);

  const isOwner = currentUserId && item.seller?.id && currentUserId === item.seller.id;

  const checkOwner = (action: string): boolean => {
    if (isOwner) {
      setOwnerError(`❌ You cannot ${action} your own item.`);
      setTimeout(() => setOwnerError(''), 3000);
      return true;
    }
    return false;
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR',
      minimumFractionDigits: 0, maximumFractionDigits: 0,
    }).format(price);
  };

  const getTimeLeft = (endDate?: string) => {
    if (!endDate) return 'N/A';
    const diff = new Date(endDate).getTime() - Date.now();
    if (diff <= 0) return 'Auction ended';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
  };

  const handleChatWithSeller = () => {
    if (checkOwner('chat with yourself')) return;
    if (!item.seller?.id) return;
    router.push(`/messages?sellerId=${item.seller.id}&itemId=${item.id}`);
  };

  const handlePlaceBid = async () => {
    if (checkOwner('bid on')) return;
    if (!showBidInput) {
      setShowBidInput(true);
      return;
    }
    const amount = parseFloat(bidAmount);
    const minBid = (item.currentBid || item.startingBid || 0);
    if (!amount || amount <= minBid) {
      setBidError(`Bid must be higher than ${formatPrice(minBid)}`);
      return;
    }
    setBidError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setBidError('Please login to place a bid.');
        return;
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items/${item.id}/bid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount })
      });
      const data = await res.json();
      if (res.ok) {
        alert(`✅ Bid of ${formatPrice(amount)} placed successfully!`);
        setShowBidInput(false);
        setBidAmount('');
        window.location.reload();
      } else {
        setBidError(data.error || 'Failed to place bid. Please login first.');
      }
    } catch {
      setBidError('Failed to place bid. Please login first.');
    }
  };

  const handleBuyNow = () => {
    if (checkOwner('buy')) return;
    router.push(`/payment?itemId=${item.id}&amount=${item.price}&type=resell`);
  };

  const handleProposeExchange = () => {
    if (checkOwner('exchange with yourself')) return;
    if (!item.seller?.id) return;
    router.push(`/messages?sellerId=${item.seller.id}&itemId=${item.id}`);
  };

  const typeColor = item.type === 'bidding' ? '#f39c12' : item.type === 'exchange' ? '#3498db' : '#2ecc40';
  const typeLabel = item.type === 'bidding' ? '🔨 Auction' : item.type === 'exchange' ? '🔄 Exchange' : '🛒 Resell';

  return (
    <div style={{ background: '#f7f7fa', minHeight: '100vh', padding: '32px 16px' }}>
      <style>{`
        .img-thumb { transition: border 0.2s, transform 0.2s; }
        .img-thumb:hover { transform: scale(1.05); }
        .action-btn { transition: opacity 0.2s, transform 0.1s; }
        .action-btn:hover { opacity: 0.88; transform: scale(1.02); }
        .tab-item { transition: color 0.2s; }
        .tab-item:hover { color: #924DAC !important; }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .owner-error { animation: slideDown 0.3s ease; }
      `}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Owner error toast */}
        {ownerError && (
          <div className="owner-error" style={{
            background: '#fff0f0', border: '1.5px solid #ffcccc',
            color: '#e74c3c', borderRadius: 10, padding: '12px 20px',
            marginBottom: 20, fontWeight: 600, fontSize: 15,
            display: 'flex', alignItems: 'center', gap: 10
          }}>
            {ownerError}
          </div>
        )}

        {/* Owner banner */}
        {isOwner && (
          <div style={{
            background: '#f0e6fa', border: '1.5px solid #d4a8e8',
            color: '#924DAC', borderRadius: 10, padding: '12px 20px',
            marginBottom: 20, fontWeight: 600, fontSize: 14,
            display: 'flex', alignItems: 'center', gap: 10
          }}>
            👤 This is your listing. You cannot bid, buy, or exchange your own item.
          </div>
        )}

        {/* Breadcrumb */}
        <div style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>
          <a href="/" style={{ color: '#924DAC', textDecoration: 'none' }}>Home</a>
          {' / '}
          <a href={`/${item.type}`} style={{ color: '#924DAC', textDecoration: 'none', textTransform: 'capitalize' }}>{item.type}</a>
          {' / '}
          <span>{item.title}</span>
        </div>

        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'flex-start' }}>

          {/* ── Left: Image Gallery ── */}
          <div style={{ flex: 1, minWidth: 300, maxWidth: 480 }}>
            <div style={{
              background: '#fff', borderRadius: 14,
              boxShadow: '0 2px 16px rgba(146,77,172,0.08)',
              padding: 12, marginBottom: 12,
              height: 380, display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', position: 'relative'
            }}>
              {images.length > 0 && !imgError ? (
                <img
                  src={images[mainImg]}
                  alt={item.title}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 8 }}
                  onError={() => setImgError(true)}
                />
              ) : (
                <div style={{ textAlign: 'center', color: '#ccc' }}>
                  <div style={{ fontSize: 56 }}>📦</div>
                  <div style={{ fontSize: 13, marginTop: 8 }}>No image available</div>
                </div>
              )}
              <div style={{
                position: 'absolute', top: 14, left: 14,
                background: typeColor, color: '#fff',
                fontSize: 12, fontWeight: 700,
                padding: '4px 12px', borderRadius: 20
              }}>
                {typeLabel}
              </div>
            </div>

            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="img-thumb"
                    onClick={() => { setMainImg(idx); setImgError(false); }}
                    style={{
                      width: 60, height: 60, borderRadius: 8, overflow: 'hidden', cursor: 'pointer',
                      border: mainImg === idx ? '2.5px solid #924DAC' : '1.5px solid #e0d0f0',
                      background: '#f5f0fa'
                    }}
                  >
                    <img src={img} alt={`thumb-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Product Info ── */}
          <div style={{ flex: 2, minWidth: 300 }}>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1a1a2e', margin: 0, lineHeight: 1.3, flex: 1 }}>
                {item.title}
              </h1>
              {item.seller?.isVerified && (
                <span style={{ background: '#e8f8f0', color: '#2ecc71', fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                  ✓ Verified
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#888', marginBottom: 18, flexWrap: 'wrap' }}>
              <span>📂 {item.category}</span>
              <span>📍 {item.location}</span>
              <span>👁 {item.views} views</span>
              <span style={{
                background: item.condition === 'New' ? '#e8f8f0' : '#fff3cd',
                color: item.condition === 'New' ? '#2ecc71' : '#856404',
                fontWeight: 600, padding: '2px 8px', borderRadius: 10
              }}>
                {item.condition}
              </span>
            </div>

            {/* Pricing Block */}
            <div style={{ background: '#fff', borderRadius: 12, padding: 20, marginBottom: 18, boxShadow: '0 1px 8px rgba(146,77,172,0.07)', border: '1.5px solid #f0e6fa' }}>
              {item.type === 'resell' && (
                <div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#924DAC' }}>{formatPrice(item.price)}</div>
                  {item.originalPrice && item.originalPrice > (item.price || 0) && (
                    <div style={{ marginTop: 4 }}>
                      <span style={{ color: '#aaa', textDecoration: 'line-through', fontSize: 16 }}>{formatPrice(item.originalPrice)}</span>
                      {item.discount && <span style={{ color: '#2ecc40', fontWeight: 700, marginLeft: 8 }}>{item.discount}% OFF</span>}
                    </div>
                  )}
                </div>
              )}
              {item.type === 'bidding' && (
                <div>
                  <div style={{ fontSize: 13, color: '#888', marginBottom: 2 }}>Current Bid</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#924DAC', marginBottom: 8 }}>
                    {formatPrice(item.currentBid || item.startingBid)}
                  </div>
                  <div style={{ display: 'flex', gap: 20, fontSize: 14, color: '#666', flexWrap: 'wrap' }}>
                    <span>Starting: <b>{formatPrice(item.startingBid)}</b></span>
                    <span>Bids: <b>{item.totalBids || 0}</b></span>
                    <span style={{ color: '#e74c3c', fontWeight: 600 }}>⏱ {getTimeLeft(item.auctionEndDate)}</span>
                  </div>
                </div>
              )}
              {item.type === 'exchange' && (
                <div>
                  <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>Looking to exchange for</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#924DAC' }}>{item.lookingFor}</div>
                </div>
              )}
            </div>

            {/* Bid input */}
            {showBidInput && item.type === 'bidding' && (
              <div style={{ background: '#fff', borderRadius: 12, padding: 16, marginBottom: 18, border: '1.5px solid #f0e6fa' }}>
                <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>
                  Enter your bid (minimum: {formatPrice((item.currentBid || item.startingBid || 0) + 1)})
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={e => setBidAmount(e.target.value)}
                    placeholder="Enter amount in ₹"
                    style={{
                      flex: 1, padding: '10px 14px', borderRadius: 8,
                      border: '1.5px solid #e0d0f0', fontSize: 15, outline: 'none'
                    }}
                  />
                  <button
                    onClick={() => setShowBidInput(false)}
                    style={{ padding: '10px 14px', borderRadius: 8, border: '1.5px solid #e0d0f0', background: '#fff', cursor: 'pointer', color: '#888' }}
                  >
                    Cancel
                  </button>
                </div>
                {bidError && <div style={{ color: '#e74c3c', fontSize: 13, marginTop: 6 }}>{bidError}</div>}
              </div>
            )}

            {/* Item Details Grid */}
            <div style={{ background: '#fff', borderRadius: 12, padding: 18, marginBottom: 18, boxShadow: '0 1px 8px rgba(146,77,172,0.07)', border: '1.5px solid #f0e6fa' }}>
              <div style={{ fontWeight: 700, marginBottom: 12, color: '#333', fontSize: 15 }}>Item Details</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, fontSize: 14 }}>
                {[
                  { label: 'Condition', value: item.condition },
                  { label: 'Warranty', value: item.warrantyStatus },
                  { label: 'Usage', value: item.usageHistory },
                  { label: 'Box/Accessories', value: item.originalBox },
                  { label: 'Shipping', value: item.shipping },
                ].filter(d => d.value).map(d => (
                  <div key={d.label} style={{ background: '#faf8fd', borderRadius: 8, padding: '8px 12px' }}>
                    <div style={{ color: '#888', fontSize: 12, marginBottom: 2 }}>{d.label}</div>
                    <div style={{ fontWeight: 600, color: '#333' }}>{d.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {item.damageInfo && (
              <div style={{ background: '#fff8e6', border: '1.5px solid #ffd666', borderRadius: 10, padding: 14, marginBottom: 18 }}>
                <div style={{ fontWeight: 700, color: '#856404', marginBottom: 4 }}>⚠️ Damage Information</div>
                <div style={{ fontSize: 14, color: '#856404' }}>{item.damageInfo}</div>
              </div>
            )}

            {/* ── Action Buttons ── */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 18 }}>
              {!isOwner && (
                <button
                  className="action-btn"
                  onClick={handleChatWithSeller}
                  style={{
                    flex: 1, minWidth: 140, padding: '12px 16px',
                    background: 'linear-gradient(135deg, #924DAC, #b06fd4)',
                    color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 15
                  }}
                >
                  💬 Chat with Seller
                </button>
              )}

              {item.type === 'bidding' && (
                <button
                  className="action-btn"
                  onClick={handlePlaceBid}
                  disabled={!!isOwner}
                  style={{
                    flex: 1, minWidth: 140, padding: '12px 16px',
                    background: isOwner ? '#ddd' : '#f39c12',
                    color: isOwner ? '#999' : '#fff',
                    border: 'none', borderRadius: 8,
                    cursor: isOwner ? 'not-allowed' : 'pointer',
                    fontWeight: 700, fontSize: 15
                  }}
                >
                  {showBidInput ? '✅ Confirm Bid' : '🔨 Place Bid'}
                </button>
              )}

              {item.type === 'exchange' && (
                <button
                  className="action-btn"
                  onClick={handleProposeExchange}
                  disabled={!!isOwner}
                  style={{
                    flex: 1, minWidth: 140, padding: '12px 16px',
                    background: isOwner ? '#ddd' : '#3498db',
                    color: isOwner ? '#999' : '#fff',
                    border: 'none', borderRadius: 8,
                    cursor: isOwner ? 'not-allowed' : 'pointer',
                    fontWeight: 700, fontSize: 15
                  }}
                >
                  🔄 Propose Exchange
                </button>
              )}

              {item.type === 'resell' && (
                <button
                  className="action-btn"
                  onClick={handleBuyNow}
                  disabled={!!isOwner}
                  style={{
                    flex: 1, minWidth: 140, padding: '12px 16px',
                    background: isOwner ? '#ddd' : '#2ecc40',
                    color: isOwner ? '#999' : '#fff',
                    border: 'none', borderRadius: 8,
                    cursor: isOwner ? 'not-allowed' : 'pointer',
                    fontWeight: 700, fontSize: 15
                  }}
                >
                  🛒 Buy Now
                </button>
              )}

              {/* Edit button for owner */}
              {isOwner && (
                <button
                  className="action-btn"
                  onClick={() => router.push(`/add-item?edit=${item.id}`)}
                  style={{
                    flex: 1, minWidth: 140, padding: '12px 16px',
                    background: 'linear-gradient(135deg, #924DAC, #b06fd4)',
                    color: '#fff', border: 'none', borderRadius: 8,
                    cursor: 'pointer', fontWeight: 700, fontSize: 15
                  }}
                >
                  ✏️ Edit Listing
                </button>
              )}
            </div>

            {/* Seller Info */}
            {item.seller && (
              <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 1px 8px rgba(146,77,172,0.07)', border: '1.5px solid #f0e6fa' }}>
                <div style={{ fontWeight: 700, marginBottom: 10, color: '#333' }}>Seller Information</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #924DAC, #b06fd4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 18 }}>
                    {item.seller.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#333' }}>
                      {item.seller.name}
                      {isOwner && <span style={{ color: '#924DAC', marginLeft: 6, fontSize: 12, fontWeight: 600 }}>(You)</span>}
                      {item.seller.isVerified && <span style={{ color: '#2ecc71', marginLeft: 6, fontSize: 13 }}>✓ Verified</span>}
                    </div>
                    <div style={{ fontSize: 13, color: '#888' }}>
                      ★ {item.seller.rating?.toFixed(1)} · {item.seller.totalReviews} reviews
                      {item.seller.location && ` · ${item.seller.location}`}
                    </div>
                  </div>
                  {!isOwner && (
                    <button
                      onClick={handleChatWithSeller}
                      style={{
                        marginLeft: 'auto', background: '#f0e6fa', color: '#924DAC',
                        border: 'none', borderRadius: 8, padding: '8px 14px',
                        fontSize: 13, fontWeight: 600, cursor: 'pointer'
                      }}
                    >
                      💬 Message
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Tabs ── */}
        <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 12px rgba(146,77,172,0.07)', padding: 28, marginTop: 32 }}>
          <div style={{ display: 'flex', gap: 28, borderBottom: '2px solid #f0e6fa', marginBottom: 20 }}>
            {['description', 'specification', 'reviews'].map(t => (
              <span
                key={t}
                className="tab-item"
                onClick={() => setTab(t)}
                style={{
                  fontWeight: 700, fontSize: 14,
                  color: tab === t ? '#924DAC' : '#aaa',
                  borderBottom: tab === t ? '3px solid #924DAC' : '3px solid transparent',
                  paddingBottom: 10, cursor: 'pointer',
                  textTransform: 'uppercase', letterSpacing: 0.5
                }}
              >
                {t}
              </span>
            ))}
          </div>

          <div style={{ color: '#444', fontSize: 15, minHeight: 80, lineHeight: 1.8 }}>
            {tab === 'description' && (
              <div>
                <p style={{ margin: '0 0 16px', whiteSpace: 'pre-wrap' }}>{item.description}</p>
                {item.tags && item.tags.length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <strong style={{ color: '#333' }}>Tags:</strong>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                      {item.tags.map(tag => (
                        <span key={tag} style={{
                          background: '#f0e6fa', color: '#924DAC',
                          padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 500
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {tab === 'specification' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                {[
                  { label: 'Category', value: item.category },
                  { label: 'Condition', value: item.condition },
                  { label: 'Type', value: item.type.charAt(0).toUpperCase() + item.type.slice(1) },
                  { label: 'Location', value: item.location },
                  { label: 'Warranty', value: item.warrantyStatus },
                  { label: 'Usage History', value: item.usageHistory },
                  { label: 'Box/Accessories', value: item.originalBox },
                  { label: 'Shipping', value: item.shipping },
                ].filter(s => s.value).map(s => (
                  <div key={s.label} style={{ background: '#faf8fd', borderRadius: 8, padding: '10px 14px' }}>
                    <div style={{ fontSize: 12, color: '#888', marginBottom: 2 }}>{s.label}</div>
                    <div style={{ fontWeight: 600, color: '#333' }}>{s.value}</div>
                  </div>
                ))}
              </div>
            )}
            {tab === 'reviews' && (
              <div style={{ textAlign: 'center', color: '#aaa', padding: '40px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>⭐</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#888' }}>No reviews yet</div>
                <div style={{ fontSize: 14, marginTop: 4 }}>Be the first to review this item!</div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
