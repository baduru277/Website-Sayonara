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
  status?: string;
}

interface Props { item: Item; }

const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';

function fixImageUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${BASE_URL}${url}`;
}

export default function ItemDetailClient({ item: initialItem }: Props) {
  const router = useRouter();
  const [item, setItem] = useState(initialItem);
  const [mainImg, setMainImg] = useState(0);
  const [tab, setTab] = useState('description');
  const [imgError, setImgError] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [showBidInput, setShowBidInput] = useState(false);
  const [bidError, setBidError] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [ownerError, setOwnerError] = useState('');
  const [auctionExpired, setAuctionExpired] = useState(false);
  const [showAuctionOptions, setShowAuctionOptions] = useState(false);
  const [resellPrice, setResellPrice] = useState('');
  const [extendDays, setExtendDays] = useState('7');
  const [auctionActionLoading, setAuctionActionLoading] = useState(false);
  const [auctionActionMsg, setAuctionActionMsg] = useState('');

  const images = (item.images || []).map(fixImageUrl).filter(Boolean);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const payload = JSON.parse(atob(token.split('.')[1]));
      setCurrentUserId(payload.id || payload.userId || payload.sub || null);
    } catch {}
  }, []);

  useEffect(() => {
    if (item.type === 'bidding' && item.auctionEndDate) {
      const check = () => setAuctionExpired(new Date() > new Date(item.auctionEndDate!));
      check();
      const interval = setInterval(check, 10000);
      return () => clearInterval(interval);
    }
  }, [item.type, item.auctionEndDate]);

  const isOwner = !!(currentUserId && item.seller?.id && currentUserId === item.seller.id);
  const hasNoBids = (item.totalBids || 0) === 0;

  const checkOwner = (action: string): boolean => {
    if (isOwner) {
      setOwnerError(`You cannot ${action} your own item.`);
      setTimeout(() => setOwnerError(''), 3000);
      return true;
    }
    return false;
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(price);
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

  const handlePlaceBid = async () => {
    if (checkOwner('bid on')) return;
    if (!showBidInput) { setShowBidInput(true); return; }
    const amount = parseFloat(bidAmount);
    const minBid = (item.currentBid || item.startingBid || 0);
    if (!amount || amount <= minBid) { setBidError(`Bid must be higher than ${formatPrice(minBid)}`); return; }
    setBidError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) { setBidError('Please login to place a bid.'); return; }
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items/${item.id}/bid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount })
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Bid of ${formatPrice(amount)} placed successfully!`);
        setShowBidInput(false); setBidAmount('');
        window.location.reload();
      } else {
        setBidError(data.error || 'Failed to place bid.');
      }
    } catch { setBidError('Failed to place bid. Please login first.'); }
  };

  const handleAuctionAction = async (action: string) => {
    setAuctionActionLoading(true);
    setAuctionActionMsg('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items/${item.id}/auction-end`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          action,
          newPrice: action === 'convert_resell' ? parseFloat(resellPrice) : undefined,
          extendDays: action === 'relist' ? parseInt(extendDays) : undefined
        })
      });
      const data = await res.json();
      if (res.ok) {
        setAuctionActionMsg('✅ ' + data.message);
        if (data.item) setItem(data.item);
        setShowAuctionOptions(false);
        setTimeout(() => {
          if (action === 'cancel') router.push('/bidding');
          else window.location.reload();
        }, 1500);
      } else {
        setAuctionActionMsg('❌ ' + (data.error || 'Failed'));
      }
    } catch { setAuctionActionMsg('❌ Something went wrong'); }
    finally { setAuctionActionLoading(false); }
  };

  const typeColor = item.type === 'bidding' ? '#f39c12' : item.type === 'exchange' ? '#3498db' : '#2ecc40';
  const typeLabel = item.type === 'bidding' ? 'Auction' : item.type === 'exchange' ? 'Exchange' : 'Resell';

  return (
    <div style={{ background: '#f7f7fa', minHeight: '100vh', padding: '32px 16px' }}>
      <style>{`
        .img-thumb { transition: border 0.2s, transform 0.2s; }
        .img-thumb:hover { transform: scale(1.05); }
        .action-btn { transition: opacity 0.2s, transform 0.1s; }
        .action-btn:hover { opacity: 0.88; transform: scale(1.02); }
      `}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {ownerError && (
          <div style={{ background: '#fff0f0', border: '1.5px solid #ffcccc', color: '#e74c3c', borderRadius: 10, padding: '12px 20px', marginBottom: 20, fontWeight: 600 }}>
            {ownerError}
          </div>
        )}

        {isOwner && (
          <div style={{ background: '#f0e6fa', border: '1.5px solid #d4a8e8', color: '#924DAC', borderRadius: 10, padding: '12px 20px', marginBottom: 20, fontWeight: 600, fontSize: 14 }}>
            This is your listing. You cannot bid, buy, or exchange your own item.
          </div>
        )}

        {/* Auction Expired Banner */}
        {item.type === 'bidding' && auctionExpired && (
          <div style={{ background: hasNoBids ? '#fff3cd' : '#e8f8f0', border: `1.5px solid ${hasNoBids ? '#ffc107' : '#2ecc71'}`, borderRadius: 14, padding: '20px 24px', marginBottom: 24 }}>
            {hasNoBids ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <span style={{ fontSize: 28 }}>⏰</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 17, color: '#856404' }}>Auction Ended — No Bids Received</div>
                    <div style={{ fontSize: 13, color: '#a07800', marginTop: 2 }}>Your item did not receive any bids. Choose what to do next:</div>
                  </div>
                </div>
                {isOwner && (
                  <button onClick={() => setShowAuctionOptions(o => !o)}
                    style={{ background: '#924DAC', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
                    {showAuctionOptions ? 'Hide Options' : 'Manage Listing'}
                  </button>
                )}
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 28 }}>🎉</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 17, color: '#166534' }}>Auction Ended — Highest Bidder Won!</div>
                  <div style={{ fontSize: 13, color: '#15803d', marginTop: 2 }}>Final bid: <strong>{formatPrice(item.currentBid)}</strong> with {item.totalBids} total bids</div>
                </div>
              </div>
            )}

            {showAuctionOptions && isOwner && hasNoBids && (
              <div style={{ marginTop: 20, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 200px', background: '#fff', borderRadius: 12, padding: 18, border: '1.5px solid #e0d0f0' }}>
                  <div style={{ fontWeight: 700, color: '#924DAC', marginBottom: 8 }}>Relist Auction</div>
                  <p style={{ fontSize: 13, color: '#666', marginBottom: 12 }}>Restart auction with same starting bid.</p>
                  <select value={extendDays} onChange={e => setExtendDays(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', border: '1.5px solid #e0d0f0', borderRadius: 8, fontSize: 14, marginBottom: 10 }}>
                    {[3, 5, 7, 10, 14, 30].map(d => <option key={d} value={d}>{d} days</option>)}
                  </select>
                  <button onClick={() => handleAuctionAction('relist')} disabled={auctionActionLoading}
                    style={{ width: '100%', background: '#924DAC', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 0', fontWeight: 700, cursor: 'pointer' }}>
                    {auctionActionLoading ? 'Processing...' : 'Relist Now'}
                  </button>
                </div>

                <div style={{ flex: '1 1 200px', background: '#fff', borderRadius: 12, padding: 18, border: '1.5px solid #e0d0f0' }}>
                  <div style={{ fontWeight: 700, color: '#2ecc40', marginBottom: 8 }}>Convert to Resell</div>
                  <p style={{ fontSize: 13, color: '#666', marginBottom: 12 }}>Set a fixed price and sell directly.</p>
                  <input type="number" value={resellPrice} onChange={e => setResellPrice(e.target.value)}
                    placeholder={`e.g. ${item.startingBid || 1000}`}
                    style={{ width: '100%', padding: '8px 10px', border: '1.5px solid #e0d0f0', borderRadius: 8, fontSize: 14, marginBottom: 10, boxSizing: 'border-box' }} />
                  <button onClick={() => handleAuctionAction('convert_resell')} disabled={auctionActionLoading || !resellPrice}
                    style={{ width: '100%', background: '#2ecc40', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 0', fontWeight: 700, cursor: 'pointer', opacity: !resellPrice ? 0.6 : 1 }}>
                    {auctionActionLoading ? 'Processing...' : 'Convert to Resell'}
                  </button>
                </div>

                <div style={{ flex: '1 1 200px', background: '#fff', borderRadius: 12, padding: 18, border: '1.5px solid #ffe0e0' }}>
                  <div style={{ fontWeight: 700, color: '#e74c3c', marginBottom: 8 }}>Cancel Listing</div>
                  <p style={{ fontSize: 13, color: '#666', marginBottom: 12 }}>Remove this item from the platform.</p>
                  <button onClick={() => handleAuctionAction('cancel')} disabled={auctionActionLoading}
                    style={{ width: '100%', background: '#fff', color: '#e74c3c', border: '2px solid #e74c3c', borderRadius: 8, padding: '10px 0', fontWeight: 700, cursor: 'pointer' }}>
                    {auctionActionLoading ? 'Processing...' : 'Cancel Listing'}
                  </button>
                </div>
              </div>
            )}

            {auctionActionMsg && (
              <div style={{ marginTop: 12, padding: '10px 16px', borderRadius: 8, background: auctionActionMsg.startsWith('✅') ? '#f0fff4' : '#fff5f5', color: auctionActionMsg.startsWith('✅') ? '#16a34a' : '#e53e3e', fontWeight: 600 }}>
                {auctionActionMsg}
              </div>
            )}
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

          {/* Image Gallery */}
          <div style={{ flex: 1, minWidth: 300, maxWidth: 480 }}>
            <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 16px rgba(146,77,172,0.08)', padding: 12, marginBottom: 12, height: 380, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
              {images.length > 0 && !imgError ? (
                <img src={images[mainImg]} alt={item.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 8 }} onError={() => setImgError(true)} />
              ) : (
                <div style={{ textAlign: 'center', color: '#ccc' }}>
                  <div style={{ fontSize: 56 }}>📦</div>
                  <div style={{ fontSize: 13, marginTop: 8 }}>No image available</div>
                </div>
              )}
              <div style={{ position: 'absolute', top: 14, left: 14, background: typeColor, color: '#fff', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20 }}>
                {typeLabel}
              </div>
              {auctionExpired && item.type === 'bidding' && (
                <div style={{ position: 'absolute', top: 14, right: 14, background: '#e74c3c', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>ENDED</div>
              )}
            </div>
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {images.map((img, idx) => (
                  <div key={idx} className="img-thumb" onClick={() => { setMainImg(idx); setImgError(false); }}
                    style={{ width: 60, height: 60, borderRadius: 8, overflow: 'hidden', cursor: 'pointer', border: mainImg === idx ? '2.5px solid #924DAC' : '1.5px solid #e0d0f0' }}>
                    <img src={img} alt={`thumb-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div style={{ flex: 2, minWidth: 300 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1a1a2e', margin: 0, lineHeight: 1.3, flex: 1 }}>{item.title}</h1>
              {item.seller?.isVerified && (
                <span style={{ background: '#e8f8f0', color: '#2ecc71', fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>Verified</span>
              )}
            </div>

            <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#888', marginBottom: 18, flexWrap: 'wrap' }}>
              <span>📂 {item.category}</span>
              <span>📍 {item.location}</span>
              <span>👁 {item.views} views</span>
              <span style={{ background: item.condition === 'New' ? '#e8f8f0' : '#fff3cd', color: item.condition === 'New' ? '#2ecc71' : '#856404', fontWeight: 600, padding: '2px 8px', borderRadius: 10 }}>
                {item.condition}
              </span>
            </div>

            {/* Pricing */}
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
                  <div style={{ fontSize: 13, color: '#888', marginBottom: 2 }}>{auctionExpired ? 'Final Bid' : 'Current Bid'}</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: auctionExpired ? '#e74c3c' : '#924DAC', marginBottom: 8 }}>
                    {formatPrice(item.currentBid || item.startingBid)}
                  </div>
                  <div style={{ display: 'flex', gap: 20, fontSize: 14, color: '#666', flexWrap: 'wrap' }}>
                    <span>Starting: <b>{formatPrice(item.startingBid)}</b></span>
                    <span>Bids: <b>{item.totalBids || 0}</b></span>
                    <span style={{ color: '#e74c3c', fontWeight: 600 }}>
                      {auctionExpired ? 'Auction Ended' : `⏱ ${getTimeLeft(item.auctionEndDate)}`}
                    </span>
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
            {showBidInput && item.type === 'bidding' && !auctionExpired && (
              <div style={{ background: '#fff', borderRadius: 12, padding: 16, marginBottom: 18, border: '1.5px solid #f0e6fa' }}>
                <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>
                  Minimum: {formatPrice((item.currentBid || item.startingBid || 0) + 1)}
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input type="number" value={bidAmount} onChange={e => setBidAmount(e.target.value)} placeholder="Enter amount in Rs."
                    style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1.5px solid #e0d0f0', fontSize: 15, outline: 'none' }} />
                  <button onClick={() => setShowBidInput(false)}
                    style={{ padding: '10px 14px', borderRadius: 8, border: '1.5px solid #e0d0f0', background: '#fff', cursor: 'pointer', color: '#888' }}>
                    Cancel
                  </button>
                </div>
                {bidError && <div style={{ color: '#e74c3c', fontSize: 13, marginTop: 6 }}>{bidError}</div>}
              </div>
            )}

            {/* Item Details */}
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
                <div style={{ fontWeight: 700, color: '#856404', marginBottom: 4 }}>Damage Information</div>
                <div style={{ fontSize: 14, color: '#856404' }}>{item.damageInfo}</div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 18 }}>
              {!isOwner && (
                <button className="action-btn" onClick={() => router.push(`/messages?sellerId=${item.seller?.id}&itemId=${item.id}`)}
                  style={{ flex: 1, minWidth: 140, padding: '12px 16px', background: 'linear-gradient(135deg,#924DAC,#b06fd4)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 15 }}>
                  Chat with Seller
                </button>
              )}

              {item.type === 'bidding' && !auctionExpired && (
                <button className="action-btn" onClick={handlePlaceBid} disabled={!!isOwner}
                  style={{ flex: 1, minWidth: 140, padding: '12px 16px', background: isOwner ? '#ddd' : '#f39c12', color: isOwner ? '#999' : '#fff', border: 'none', borderRadius: 8, cursor: isOwner ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 15 }}>
                  {showBidInput ? 'Confirm Bid' : 'Place Bid'}
                </button>
              )}

              {item.type === 'bidding' && auctionExpired && !isOwner && (
                <div style={{ flex: 1, minWidth: 140, padding: '12px 16px', background: '#f5f5f5', color: '#aaa', border: '1.5px solid #ddd', borderRadius: 8, fontWeight: 700, fontSize: 15, textAlign: 'center' }}>
                  Auction Ended
                </div>
              )}

              {item.type === 'exchange' && (
                <button className="action-btn" onClick={() => { if (checkOwner('exchange')) return; router.push(`/messages?sellerId=${item.seller?.id}&itemId=${item.id}`); }} disabled={!!isOwner}
                  style={{ flex: 1, minWidth: 140, padding: '12px 16px', background: isOwner ? '#ddd' : '#3498db', color: isOwner ? '#999' : '#fff', border: 'none', borderRadius: 8, cursor: isOwner ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 15 }}>
                  Propose Exchange
                </button>
              )}

              {item.type === 'resell' && (
                <button className="action-btn" onClick={() => { if (checkOwner('buy')) return; router.push(`/payment?itemId=${item.id}&amount=${item.price}&type=resell`); }} disabled={!!isOwner}
                  style={{ flex: 1, minWidth: 140, padding: '12px 16px', background: isOwner ? '#ddd' : '#2ecc40', color: isOwner ? '#999' : '#fff', border: 'none', borderRadius: 8, cursor: isOwner ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 15 }}>
                  Buy Now
                </button>
              )}

              {isOwner && (
                <button className="action-btn" onClick={() => router.push(`/add-item?edit=${item.id}`)}
                  style={{ flex: 1, minWidth: 140, padding: '12px 16px', background: 'linear-gradient(135deg,#924DAC,#b06fd4)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 15 }}>
                  Edit Listing
                </button>
              )}
            </div>

            {/* Seller Info */}
            {item.seller && (
              <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 1px 8px rgba(146,77,172,0.07)', border: '1.5px solid #f0e6fa' }}>
                <div style={{ fontWeight: 700, marginBottom: 10, color: '#333' }}>Seller Information</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#924DAC,#b06fd4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 18 }}>
                    {item.seller.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#333' }}>
                      {item.seller.name}
                      {isOwner && <span style={{ color: '#924DAC', marginLeft: 6, fontSize: 12 }}>(You)</span>}
                      {item.seller.isVerified && <span style={{ color: '#2ecc71', marginLeft: 6, fontSize: 13 }}>Verified</span>}
                    </div>
                    <div style={{ fontSize: 13, color: '#888' }}>
                      {item.seller.rating?.toFixed(1)} rating · {item.seller.totalReviews} reviews
                      {item.seller.location && ` · ${item.seller.location}`}
                    </div>
                  </div>
                  {!isOwner && (
                    <button onClick={() => router.push(`/messages?sellerId=${item.seller?.id}&itemId=${item.id}`)}
                      style={{ marginLeft: 'auto', background: '#f0e6fa', color: '#924DAC', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                      Message
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 12px rgba(146,77,172,0.07)', padding: 28, marginTop: 32 }}>
          <div style={{ display: 'flex', gap: 28, borderBottom: '2px solid #f0e6fa', marginBottom: 20 }}>
            {['description', 'specification', 'reviews'].map(t => (
              <span key={t} onClick={() => setTab(t)} style={{ fontWeight: 700, fontSize: 14, color: tab === t ? '#924DAC' : '#aaa', borderBottom: tab === t ? '3px solid #924DAC' : '3px solid transparent', paddingBottom: 10, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 0.5 }}>
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
                    <strong>Tags:</strong>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                      {item.tags.map(tag => <span key={tag} style={{ background: '#f0e6fa', color: '#924DAC', padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 500 }}>{tag}</span>)}
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
                  { label: 'Type', value: item.type },
                  { label: 'Location', value: item.location },
                  { label: 'Warranty', value: item.warrantyStatus },
                  { label: 'Usage History', value: item.usageHistory },
                  { label: 'Box/Accessories', value: item.originalBox },
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
