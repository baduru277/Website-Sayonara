"use client";

import Link from 'next/link';
import Image from 'next/image';

const featuredItems = [
  {
    id: 1,
    title: "iPhone 13 Pro",
    description: "Excellent condition, 256GB, Space Gray",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80",
    category: "Electronics",
    owner: "TechTrader",
    location: "New York, NY",
    tradeFor: "MacBook Air or iPad Pro",
    price: 85000,
    views: 127,
    likes: 23,
    action: "Bid"
  },
  {
    id: 2,
    title: "Nike Air Jordan 1",
    description: "Retro High OG, Size 10, Like new",
    image: "https://images.unsplash.com/photo-1517263904808-5dc0d6e1ad21?auto=format&fit=crop&w=400&q=80",
    category: "Fashion",
    owner: "SneakerHead",
    location: "Los Angeles, CA",
    tradeFor: "Yeezy 350 or cash",
    price: 15000,
    views: 89,
    likes: 45,
    action: "Exchange"
  },
  {
    id: 3,
    title: "Guitar - Fender Stratocaster",
    description: "American Standard, Sunburst finish",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=400&q=80",
    category: "Music",
    owner: "MusicLover",
    location: "Austin, TX",
    tradeFor: "Drum set or keyboard",
    price: 50000,
    views: 156,
    likes: 67,
    action: "Buy/Sell"
  },
  {
    id: 4,
    title: "Gaming PC Setup",
    description: "RTX 3080, Ryzen 7, 32GB RAM",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80",
    category: "Electronics",
    owner: "GamerPro",
    location: "Seattle, WA",
    tradeFor: "PS5 + games or cash",
    price: 120000,
    views: 234,
    likes: 89,
    action: "Bid"
  },
  {
    id: 5,
    title: "Vintage Camera Collection",
    description: "Leica M3, Canon AE-1, lenses included",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    category: "Collectibles",
    owner: "PhotoBuff",
    location: "San Francisco, CA",
    tradeFor: "Vintage watches or art",
    price: 25000,
    views: 78,
    likes: 34,
    action: "Exchange"
  },
  {
    id: 6,
    title: "Mountain Bike",
    description: "Trek Fuel EX 8, Carbon frame, 29er",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    category: "Sports",
    owner: "BikeRider",
    location: "Denver, CO",
    tradeFor: "Road bike or camping gear",
    price: 80000,
    views: 145,
    likes: 56,
    action: "Exchange"
  },
  {
    id: 7,
    title: "Dell Optiplex 7040 All-in-One Computer",
    description: "With 24in Monitor, Windows 10 Pro",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80",
    category: "Computers",
    owner: "OfficeDeals",
    location: "Chicago, IL",
    tradeFor: "Laptop or cash",
    price: 40000,
    views: 120,
    likes: 22,
    action: "Buy/Sell"
  },
  {
    id: 8,
    title: "4K UHD LED Smart TV with Chromecast",
    description: "Brand new, 55in, warranty included",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    category: "Electronics",
    owner: "HomeTech",
    location: "Houston, TX",
    tradeFor: "Soundbar or cash",
    price: 60000,
    views: 99,
    likes: 18,
    action: "Bid"
  }
];

export default function FeaturedItems() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap', margin: '0 auto', maxWidth: 1200 }}>
      {featuredItems.slice(0, 4).map((item) => (
        <div
          key={item.id}
          style={{
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
            width: 300,
            margin: '16px 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          <div className="grid-image-wrapper" style={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
            <Image
              src={item.image}
              alt={item.title}
              fill
              style={{ objectFit: 'cover', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
            />
          </div>
          <div style={{ padding: 20, width: '100%', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
            <div style={{ color: '#b0b0b0', fontSize: 15, marginBottom: 4 }}>{item.category}</div>
            <div style={{ fontWeight: 700, fontSize: 19, marginBottom: 4 }}>{item.title}</div>
            <div style={{ color: '#444', fontSize: 15, marginBottom: 8 }}>{item.description}</div>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{item.action}</div>
            <Link href={`/item/${item.id}`} style={{ color: '#222', fontWeight: 600, fontSize: 15, textDecoration: 'underline', marginTop: 'auto', display: 'inline-block' }}>
              View Item
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

/* Add this to your global CSS or Tailwind config for hide-scrollbar:
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
*/ 