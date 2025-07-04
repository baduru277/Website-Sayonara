import Link from 'next/link';

const featuredItems = [
  {
    id: 1,
    title: "iPhone 13 Pro",
    description: "Excellent condition, 256GB, Space Gray",
    image: "/api/placeholder/300/200",
    category: "Electronics",
    owner: "TechTrader",
    location: "New York, NY",
    tradeFor: "MacBook Air or iPad Pro"
  },
  {
    id: 2,
    title: "Nike Air Jordan 1",
    description: "Retro High OG, Size 10, Like new",
    image: "/api/placeholder/300/200",
    category: "Fashion",
    owner: "SneakerHead",
    location: "Los Angeles, CA",
    tradeFor: "Yeezy 350 or cash"
  },
  {
    id: 3,
    title: "Guitar - Fender Stratocaster",
    description: "American Standard, Sunburst finish",
    image: "/api/placeholder/300/200",
    category: "Music",
    owner: "MusicLover",
    location: "Austin, TX",
    tradeFor: "Drum set or keyboard"
  },
  {
    id: 4,
    title: "Gaming PC Setup",
    description: "RTX 3080, Ryzen 7, 32GB RAM",
    image: "/api/placeholder/300/200",
    category: "Electronics",
    owner: "GamerPro",
    location: "Seattle, WA",
    tradeFor: "PS5 + games or cash"
  },
  {
    id: 5,
    title: "Vintage Camera Collection",
    description: "Leica M3, Canon AE-1, lenses included",
    image: "/api/placeholder/300/200",
    category: "Collectibles",
    owner: "PhotoBuff",
    location: "San Francisco, CA",
    tradeFor: "Vintage watches or art"
  },
  {
    id: 6,
    title: "Mountain Bike",
    description: "Trek Fuel EX 8, Carbon frame, 29er",
    image: "/api/placeholder/300/200",
    category: "Sports",
    owner: "BikeRider",
    location: "Denver, CO",
    tradeFor: "Road bike or camping gear"
  }
];

export default function FeaturedItems() {
  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Items
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover amazing items available for trade. From electronics to fashion, 
            find what you're looking for or list your own items.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredItems.map((item) => (
            <div key={item.id} className="card p-6 hover:shadow-lg transition-all duration-300">
              <div className="relative mb-4">
                <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Image Placeholder</span>
                </div>
                <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-sm font-medium">
                  {item.category}
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 mb-3">
                {item.description}
              </p>

              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">
                  by {item.owner}
                </span>
                <span className="text-sm text-gray-500">
                  📍 {item.location}
                </span>
              </div>

              <div className="mb-4">
                <span className="text-sm font-medium text-gray-700">Trade for:</span>
                <p className="text-sm text-gray-600 mt-1">{item.tradeFor}</p>
              </div>

              <div className="flex gap-2">
                <Link 
                  href={`/item/${item.id}`}
                  className="btn btn-primary flex-1 text-center"
                >
                  View Details
                </Link>
                <button className="btn btn-outline px-4">
                  💬
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/browse" className="btn btn-outline text-lg px-8 py-3">
            Browse All Items
          </Link>
        </div>
      </div>
    </section>
  );
} 