"use client";
import { useState, useEffect } from "react";

const TYPE_COLORS: any = {
  bidding: { bg: '#fff3e0', color: '#e65100', label: 'Bidding' },
  exchange: { bg: '#e8f5e9', color: '#2e7d32', label: 'Exchange' },
  resell: { bg: '#e3f2fd', color: '#1565c0', label: 'Resell' },
};

export default function FeaturedItemsSection() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNearby, setIsNearby] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [radius, setRadius] = useState(50);

  useEffect(() => {
    // Try to get user's saved location from localStorage first
    const savedLat = localStorage.getItem('userLat');
    const savedLng = localStorage.getItem('userLng');

    if (savedLat && savedLng) {
      const lat = parseFloat(savedLat);
      const lng = parseFloat(savedLng);
      setUserLocation({ lat, lng });
      fetchNearbyItems(lat, lng, 50);
    } else {
      // Try browser geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            localStorage.setItem('userLat', String(lat));
            localStorage.setItem('userLng', String(lng));
            setUserLocation({ lat, lng });
            fetchNearbyItems(lat, lng, 50);
            // Save to backend if logged in
            saveLocationToBackend(lat, lng);
          },
          () => fetchAllItems() // fallback
        );
      } else {
        fetchAllItems();
      }
    }
  }, []);

  const saveLocationToBackend = async (lat: number, lng: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/location`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ lat, lng })
      });
    } catch {}
  };

  const fetchNearbyItems = async (lat: number, lng: number, r: number) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items/nearby?lat=${lat}&lng=${lng}&radius=${r}&limit=8`);
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        setItems(data.items);
        setIsNearby(true);
        setRadius(r);
      } else if (r < 200) {
        // Expand radius if nothing found nearby
        fetchNearbyItems(lat, lng, r * 2);
      } else {
        fetchAllItems();
      }
    } catch {
      fetchAllItems();
    } finally {
      setLoading(false);
    }
  };

  const fetchAllItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items?limit=8`);
      const data = await res.json();
      setItems(data.items || []);
      setIsNearby(false);
    } catch {} finally {
      setLoading(false);
    }
  };

  const getImage = (item: any) => {
    const img = item.images?.[0];
    if (!img) return null;
    if (img.startsWith('http')) return img;
    return `https://sayonaraa.com${img}`;
  };

  const getPrice = (item: any) => {
    if (item.type === 'bidding') return `Rs.${(item.currentBid || item.startingBid || 0).toLocaleString('en-IN')}`;
    if (item.type === 'resell') return `Rs.${(item.price || 0).toLocaleString('en-IN')}`;
    return 'Exchange';
  };

  if (loading) return (
    <div style={{ padding: '40px 16px', textAlign: 'center', color: '#924DAC', fontWeight: 600 }}>
      {userLocation ? 'Finding items near you...' : 'Loading items...'}
    </div>
  );

  if (!items.length) return null;

  return (
    <section style={{ background: '#faf5ff', padding: '48px 16px', fontFamily: 'Quicksand, Montserrat, sans-serif' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1a0533', margin: 0 }}>
              {isNearby ? '📍 Items Near You' : '🔥 Latest Listings'}
            </h2>
            <p style={{ color: '#888', fontSize: 14, margin: '4px 0 0' }}>
              {isNearby
                ? `Showing items within ${radius}km of your location`
                : 'Fresh items listed by people near you'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            {isNearby && (
              <div style={{ display: 'flex', gap: 6 }}>
                {[10, 25, 50, 100].map(r => (
                  <button key={r} onClick={() => userLocation && fetchNearbyItems(userLocation.lat, userLocation.lng, r)}
                    style={{ background: radius === r ? '#924DAC' : '#fff', color: radius === r ? '#fff' : '#924DAC', border: '1.5px solid #924DAC', borderRadius: 50, padding: '4px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                    {r}km
                  </button>
                ))}
              </div>
            )}
            {!isNearby && (
              <button onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(pos => {
                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;
                    localStorage.setItem('userLat', String(lat));
                    localStorage.setItem('userLng', String(lng));
                    setUserLocation({ lat, lng });
                    fetchNearbyItems(lat, lng, 50);
                    saveLocationToBackend(lat, lng);
                  });
                }
              }} style={{ background: '#924DAC', color: '#fff', border: 'none', borderRadius: 50, padding: '8px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                Use My Location
              </button>
            )}
            <a href="/browse" style={{ background: 'linear-gradient(135deg,#7F53AC,#647DEE)', color: '#fff', padding: '10px 22px', borderRadius: 50, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
              View All
            </a>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 18 }}>
          {items.map((item) => {
            const typeStyle = TYPE_COLORS[item.type] || TYPE_COLORS.resell;
            const img = getImage(item);
            return (
              <a key={item.id} href={`/${item.type}/${item.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(127,83,172,0.08)', border: '1px solid #f0e6ff', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 28px rgba(127,83,172,0.18)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(127,83,172,0.08)'; }}
                >
                  <div style={{ width: '100%', height: 160, background: '#f3e8ff', position: 'relative', overflow: 'hidden' }}>
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
                    {item.distanceKm !== null && item.distanceKm !== undefined && (
                      <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.65)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 50 }}>
                        {item.distanceKm < 1 ? '< 1km' : `${item.distanceKm}km`}
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#1a0533', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
                    <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>📍 {item.location || 'Andhra Pradesh'}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontWeight: 800, fontSize: 15, color: '#924DAC' }}>{getPrice(item)}</div>
                      <div style={{ fontSize: 11, color: '#aaa' }}>{item.condition === 'Used' ? '🔧 Used' : '✨ New'}</div>
                    </div>
                    <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #f0e6ff', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg,#7F53AC,#647DEE)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
                        {(item.seller?.name || '?')[0].toUpperCase()}
                      </div>
                      <div style={{ fontSize: 11, color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.seller?.name || 'User'}{item.seller?.isVerified && <span style={{ color: '#16a34a', marginLeft: 4 }}>✓</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

cd /root/Website-Sayonara/frontend && npm run build && pm2 restart sayonara-frontend
