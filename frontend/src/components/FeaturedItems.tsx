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
    tradeFor: "MacBook Air or iPad Pro",
    views: 127,
    likes: 23
  },
  {
    id: 2,
    title: "Nike Air Jordan 1",
    description: "Retro High OG, Size 10, Like new",
    image: "/api/placeholder/300/200",
    category: "Fashion",
    owner: "SneakerHead",
    location: "Los Angeles, CA",
    tradeFor: "Yeezy 350 or cash",
    views: 89,
    likes: 45
  },
  {
    id: 3,
    title: "Guitar - Fender Stratocaster",
    description: "American Standard, Sunburst finish",
    image: "/api/placeholder/300/200",
    category: "Music",
    owner: "MusicLover",
    location: "Austin, TX",
    tradeFor: "Drum set or keyboard",
    views: 156,
    likes: 67
  },
  {
    id: 4,
    title: "Gaming PC Setup",
    description: "RTX 3080, Ryzen 7, 32GB RAM",
    image: "/api/placeholder/300/200",
    category: "Electronics",
    owner: "GamerPro",
    location: "Seattle, WA",
    tradeFor: "PS5 + games or cash",
    views: 234,
    likes: 89
  },
  {
    id: 5,
    title: "Vintage Camera Collection",
    description: "Leica M3, Canon AE-1, lenses included",
    image: "/api/placeholder/300/200",
    category: "Collectibles",
    owner: "PhotoBuff",
    location: "San Francisco, CA",
    tradeFor: "Vintage watches or art",
    views: 78,
    likes: 34
  },
  {
    id: 6,
    title: "Mountain Bike",
    description: "Trek Fuel EX 8, Carbon frame, 29er",
    image: "/api/placeholder/300/200",
    category: "Sports",
    owner: "BikeRider",
    location: "Denver, CO",
    tradeFor: "Road bike or camping gear",
    views: 145,
    likes: 56
  }
];

export default function FeaturedItems() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
            Trending Items
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Items
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Discover amazing items available for trade. From electronics to fashion, 
            find what you&#39;re looking for or list your own items.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredItems.map((item, index) => (
            <div 
              key={item.id} 
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative">
                <div className="w-full h-32 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center relative overflow-hidden">
                  <span className="text-gray-500 text-xs">Image Placeholder</span>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
                  {item.category}
                </div>
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-gray-600">
                  <span>👁️ {item.views}</span>
                </div>
                <div className="absolute bottom-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-lg">
                  ❤️
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors duration-300 line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-3 text-sm line-clamp-2">
                  {item.description}
                </p>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 text-xs font-bold">{item.owner[0]}</span>
                    </div>
                    <span className="text-sm text-gray-600 font-medium">
                      {item.owner}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    📍 {item.location}
                  </span>
                </div>

                <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <span className="text-xs font-semibold text-purple-700 uppercase tracking-wide">Trade for:</span>
                  <p className="text-xs text-purple-600 mt-1 line-clamp-2">{item.tradeFor}</p>
                </div>

                <div className="flex gap-2">
                  <Link 
                    href={`/item/${item.id}`}
                    className="group/btn flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center py-2 px-3 rounded-lg font-medium text-sm hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <span className="group-hover/btn:translate-x-1 transition-transform duration-300">View Details</span>
                  </Link>
                  <button className="group/chat bg-white border-2 border-purple-200 text-purple-600 px-3 py-2 rounded-lg hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all duration-300 transform hover:scale-105">
                    <span className="group-hover/chat:rotate-12 transition-transform duration-300">💬</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link 
            href="/browse" 
            className="group inline-flex items-center px-8 py-4 text-lg font-semibold text-purple-600 border-2 border-purple-600 rounded-xl hover:bg-purple-600 hover:text-white transition-all duration-300 transform hover:scale-105"
          >
            Browse All Items
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
} 