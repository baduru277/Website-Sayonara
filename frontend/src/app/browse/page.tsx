import Header from '../../components/Header';
import Footer from '../../components/Footer';

const items = [
  {
    id: 1,
    title: "iPhone 13 Pro",
    description: "Excellent condition, 256GB, Space Gray",
    image: "/api/placeholder/300/200",
    category: "Electronics",
    owner: "TechTrader",
    location: "New York, NY",
    tradeFor: "MacBook Air or iPad Pro",
    condition: "Excellent",
    postedDate: "2 days ago"
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
    condition: "Like New",
    postedDate: "1 day ago"
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
    condition: "Good",
    postedDate: "3 days ago"
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
    condition: "Excellent",
    postedDate: "5 days ago"
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
    condition: "Good",
    postedDate: "1 week ago"
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
    condition: "Very Good",
    postedDate: "4 days ago"
  },
  {
    id: 7,
    title: "MacBook Pro 2021",
    description: "M1 Pro, 16GB RAM, 512GB SSD",
    image: "/api/placeholder/300/200",
    category: "Electronics",
    owner: "TechEnthusiast",
    location: "Boston, MA",
    tradeFor: "iPad Pro + Apple Watch or cash",
    condition: "Excellent",
    postedDate: "1 day ago"
  },
  {
    id: 8,
    title: "Designer Handbag",
    description: "Louis Vuitton Neverfull, Authentic",
    image: "/api/placeholder/300/200",
    category: "Fashion",
    owner: "Fashionista",
    location: "Miami, FL",
    tradeFor: "Chanel bag or luxury items",
    condition: "Like New",
    postedDate: "2 days ago"
  }
];

const categories = [
  "All Categories",
  "Electronics",
  "Fashion",
  "Sports",
  "Music",
  "Collectibles",
  "Books",
  "Home & Garden",
  "Tools"
];

const conditions = [
  "All Conditions",
  "Like New",
  "Excellent",
  "Very Good",
  "Good",
  "Fair"
];

export default function BrowsePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="container py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Browse Items
            </h1>
            <p className="text-gray-600">
              Discover amazing items available for trade in your area
            </p>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Items
                </label>
                <input
                  type="text"
                  placeholder="Search for items..."
                  className="input"
                />
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select className="input">
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Condition Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition
                </label>
                <select className="input">
                  {conditions.map((condition) => (
                    <option key={condition} value={condition}>
                      {condition}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Additional Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Enter city or zip code"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Distance
                </label>
                <select className="input">
                  <option>Any distance</option>
                  <option>Within 5 miles</option>
                  <option>Within 10 miles</option>
                  <option>Within 25 miles</option>
                  <option>Within 50 miles</option>
                </select>
              </div>
              <div className="flex items-end">
                <button className="btn btn-primary w-full">
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Showing {items.length} items
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select className="text-sm border border-gray-300 rounded px-2 py-1">
                <option>Newest First</option>
                <option>Oldest First</option>
                <option>Distance</option>
                <option>Condition</option>
              </select>
            </div>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.id} className="card p-4 hover:shadow-lg transition-all duration-300">
                <div className="relative mb-4">
                  <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">Image Placeholder</span>
                  </div>
                  <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                    {item.category}
                  </div>
                  <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
                    {item.condition}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
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

                <div className="mb-3">
                  <span className="text-sm font-medium text-gray-700">Trade for:</span>
                  <p className="text-sm text-gray-600 mt-1">{item.tradeFor}</p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {item.postedDate}
                  </span>
                  <div className="flex gap-2">
                    <button className="btn btn-primary text-sm px-3 py-1">
                      View
                    </button>
                    <button className="btn btn-outline text-sm px-3 py-1">
                      💬
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="btn btn-outline text-lg px-8 py-3">
              Load More Items
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 