'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';

function fixImageUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${BASE_URL}${url}`;
}

const TYPE_COLORS: any = {
  bidding: { bg: '#fff3e0', color: '#e65100', label: 'Bidding' },
  exchange: { bg: '#e8f5e9', color: '#2e7d32', label: 'Exchange' },
  resell: { bg: '#e3f2fd', color: '#1565c0', label: 'Resell' },
};

const CONDITIONS = ['All', 'New', 'Like New', 'Excellent', 'Very Good', 'Good', 'Fair'];
const TYPES = ['All', 'bidding', 'exchange', 'resell'];
const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Newest First' },
  { value: 'views', label: 'Most Viewed' },
  { value: 'likes', label: 'Most Liked' },
  { value: 'price', label: 'Price' },
];

export default function BrowsePage() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');
  const [condition, setCondition] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('DESC');

  const fetchItems = async (p = 1, reset = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(p),
        limit: '12',
        sortBy,
        order,
        ...(type !== 'All' && { type }),
        ...(condition !== 'All' && { condition }),
        ...(search && { search }),
      });
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items?${params}`);
      const data = await res.json();
      const newItems = data.items || [];
      setItems(reset ? newItems : (p === 1 ? newItems : [...items, ...newItems]));
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
      setPage(p);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(1, true); }, [type, condition, sortBy, order]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchItems(1, true);
  };

  const getPrice = (item: any) => {
    if (item.type === 'bidding') return `Rs.${(item.currentBid || item.startingBid || 0).toLocaleString('en-IN')}`;
    if (item.type === 'resell') return `Rs.${(item.price || 0).toLocaleString('en-IN')}`;
    return 'Exchange';
  };

  const getLink = (item: any) => `/${item.type}/${item.id}`;

  return (
    <div style={{ minHeight: '100vh', background: '#faf5ff', fontFamily: 'Quicksand, Montserrat, sans-serif' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#7F53AC,#647DEE)', padding: '40px 24px 60px', textAlign: 'center' }}>
        <h1 style={{ color: '#fff', fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 900, margin: '0 0 8px' }}>
          Browse All Listings
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, margin: 0 }}>
          {total} items available across India
        </p>
      </div>

      <div style={{ maxWidth: 1200, margin: '-30px auto 0', padding: '0 16px 48px' }}>

        {/* Search & Filters */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', boxShadow: '0 4px 24px rgba(127,83,172,0.12)', marginBottom: 24 }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search items by name or description..."
              style={{ flex: 1, minWidth: 200, padding: '10px 16px', border: '1.5px solid #e0d0f0', borderRadius: 50, fontSize: 14, outline: 'none', color: '#333' }}
            />
            <button type="submit" style={{ background: 'linear-gradient(135deg,#7F53AC,#647DEE)', color: '#fff', border: 'none', borderRadius: 50, padding: '10px 24px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
              Search
            </button>
          </form>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Type filter */}
            <div style={{ display: 'flex', gap: 6 }}>
              {TYPES.map(t => (
                <button key={t} onClick={() => setType(t)}
                  style={{ background: type === t ? '#924DAC' : '#f3e8ff', color: type === t ? '#fff' : '#924DAC', border: 'none', borderRadius: 50, padding: '6px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                  {t === 'All' ? 'All Types' : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            <div style={{ height: 24, width: 1, background: '#e0d0f0' }} />

            {/* Condition */}
            <select value={condition} onChange={e => setCondition(e.target.value)}
              style={{ padding: '6px 12px', border: '1.5px solid #e0d0f0', borderRadius: 50, fontSize: 13, fontWeight: 600, color: '#924DAC', outline: 'none', cursor: 'pointer' }}>
              {CONDITIONS.map(c => <option key={c} value={c}>{c === 'All' ? 'All Conditions' : c}</option>)}
            </select>

            {/* Sort */}
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              style={{ padding: '6px 12px', border: '1.5px solid #e0d0f0', borderRadius: 50, fontSize: 13, fontWeight: 600, color: '#924DAC', outline: 'none', cursor: 'pointer' }}>
              {SORT_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>

            <button onClick={() => setOrder(o => o === 'DESC' ? 'ASC' : 'DESC')}
              style={{ background: '#f3e8ff', color: '#924DAC', border: 'none', borderRadius: 50, padding: '6px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              {order === 'DESC' ? 'Newest First' : 'Oldest First'}
            </button>

            <span style={{ marginLeft: 'auto', fontSize: 13, color: '#888', fontWeight: 600 }}>
              {total} results
            </span>
          </div>
        </div>

        {/* Items Grid */}
        {loading && items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#924DAC', fontWeight: 600, fontSize: 16 }}>
            Loading items...
          </div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
            <div style={{ fontWeight: 700, fontSize: 20, color: '#333', marginBottom: 8 }}>No items found</div>
            <div style={{ color: '#888', fontSize: 14 }}>Try adjusting your filters or search query</div>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
              {items.map(item => {
                const typeStyle = TYPE_COLORS[item.type] || TYPE_COLORS.resell;
                const img = item.images?.[0] ? fixImageUrl(item.images[0]) : null;
                return (
                  <a key={item.id} href={getLink(item)} style={{ textDecoration: 'none', display: 'block' }}>
                    <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(127,83,172,0.08)', border: '1px solid #f0e6ff', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 28px rgba(127,83,172,0.18)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(127,83,172,0.08)'; }}>

                      {/* Image */}
                      <div style={{ width: '100%', height: 180, background: '#f3e8ff', position: 'relative', overflow: 'hidden' }}>
                        {img ? (
                          <img src={img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, color: '#d0b0e8' }}>
                            {item.type === 'bidding' ? '🏷️' : item.type === 'exchange' ? '🔄' : '💰'}
                          </div>
                        )}
                        <div style={{ position: 'absolute', top: 8, left: 8, background: typeStyle.bg, color: typeStyle.color, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 50 }}>
                          {typeStyle.label}
                        </div>
                        <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(255,255,255,0.9)', color: '#555', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 50 }}>
                          {item.condition}
                        </div>
                      </div>

                      {/* Content */}
                      <div style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 700, fontSize: 15, color: '#1a0533', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
                        <div style={{ fontSize: 12, color: '#888', marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          📍 {item.location}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                          <div style={{ fontWeight: 800, fontSize: 16, color: '#924DAC' }}>{getPrice(item)}</div>
                          <div style={{ fontSize: 11, color: '#aaa' }}>👁 {item.views}</div>
                        </div>
                        {item.type === 'bidding' && item.auctionEndDate && (
                          <div style={{ fontSize: 12, color: '#e74c3c', fontWeight: 600, marginBottom: 8 }}>
                            ⏱ {new Date(item.auctionEndDate) > new Date()
                              ? `Ends ${new Date(item.auctionEndDate).toLocaleDateString('en-IN')}`
                              : 'Auction Ended'}
                          </div>
                        )}
                        <div style={{ paddingTop: 10, borderTop: '1px solid #f0e6ff', display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg,#7F53AC,#647DEE)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                            {(item.seller?.name || '?')[0].toUpperCase()}
                          </div>
                          <div style={{ fontSize: 12, color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.seller?.name || 'User'}
                            {item.seller?.isVerified && <span style={{ color: '#16a34a', marginLeft: 4 }}>✓</span>}
                          </div>
                          <div style={{ marginLeft: 'auto', fontSize: 11, color: '#aaa' }}>
                            {new Date(item.createdAt).toLocaleDateString('en-IN')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Load More */}
            {page < totalPages && (
              <div style={{ textAlign: 'center', marginTop: 36 }}>
                <button onClick={() => fetchItems(page + 1)}
                  disabled={loading}
                  style={{ background: 'linear-gradient(135deg,#7F53AC,#647DEE)', color: '#fff', border: 'none', borderRadius: 50, padding: '12px 36px', fontWeight: 700, fontSize: 15, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Loading...' : `Load More (${total - items.length} remaining)`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
