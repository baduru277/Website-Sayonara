const categories = [
  {
    name: 'Electronics',
    icon: '📱',
    color: 'bg-blue-100 text-blue-600',
    itemCount: 1247,
    description: 'Phones, laptops, cameras, and more'
  },
  {
    name: 'Fashion',
    icon: '👕',
    color: 'bg-purple-100 text-purple-600',
    itemCount: 892,
    description: 'Clothing, shoes, accessories'
  },
  {
    name: 'Sports',
    icon: '⚽',
    color: 'bg-green-100 text-green-600',
    itemCount: 456,
    description: 'Equipment, gear, and athletic wear'
  },
  {
    name: 'Music',
    icon: '🎵',
    color: 'bg-pink-100 text-pink-600',
    itemCount: 234,
    description: 'Instruments, audio equipment'
  },
  {
    name: 'Books',
    icon: '📚',
    color: 'bg-yellow-100 text-yellow-600',
    itemCount: 567,
    description: 'Fiction, non-fiction, textbooks'
  },
  {
    name: 'Home & Garden',
    icon: '🏠',
    color: 'bg-red-100 text-red-600',
    itemCount: 789,
    description: 'Furniture, decor, tools'
  },
  {
    name: 'Collectibles',
    icon: '🎨',
    color: 'bg-indigo-100 text-indigo-600',
    itemCount: 123,
    description: 'Art, antiques, rare items'
  },
  {
    name: 'Tools',
    icon: '🔧',
    color: 'bg-gray-100 text-gray-600',
    itemCount: 345,
    description: 'Hand tools, power tools, equipment'
  },
  {
    name: 'Toys & Games',
    icon: '🎮',
    color: 'bg-orange-100 text-orange-600',
    itemCount: 234,
    description: 'Board games, video games, toys'
  },
  {
    name: 'Automotive',
    icon: '🚗',
    color: 'bg-teal-100 text-teal-600',
    itemCount: 156,
    description: 'Car parts, accessories, maintenance'
  },
  {
    name: 'Health & Beauty',
    icon: '💄',
    color: 'bg-rose-100 text-rose-600',
    itemCount: 189,
    description: 'Cosmetics, skincare, wellness'
  },
  {
    name: 'Other',
    icon: '📦',
    color: 'bg-slate-100 text-slate-600',
    itemCount: 432,
    description: 'Miscellaneous items'
  }
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-gray-50 py-8">
        <div className="container">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Browse by Category
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find exactly what you&#39;re looking for by exploring our organized categories
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div key={category.name} className="card p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <div className="text-center">
                  <div className={`w-16 h-16 ${category.color} rounded-lg flex items-center justify-center mx-auto mb-4 text-3xl group-hover:scale-110 transition-transform duration-200`}>
                    {category.icon}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {category.itemCount.toLocaleString()} items
                    </span>
                    <span className="text-blue-600 group-hover:text-blue-700 transition-colors">
                      Browse →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Popular Categories Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Popular Categories
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.slice(0, 3).map((category) => (
                <div key={category.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center text-2xl`}>
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-500">{category.itemCount} items</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">
                    {category.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Active listings</span>
                      <span className="font-medium">{Math.floor(category.itemCount * 0.8)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">This week</span>
                      <span className="font-medium">{Math.floor(category.itemCount * 0.1)}</span>
                    </div>
                  </div>
                  
                  <button className="btn btn-primary w-full mt-4">
                    Browse {category.name}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* How to Use Categories */}
          <div className="mt-16 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              How to Use Categories
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Browse Categories</h3>
                <p className="text-gray-600">
                  Click on any category to see all items in that category
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Filter & Search</h3>
                <p className="text-gray-600">
                  Use filters to narrow down your search within categories
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Trading</h3>
                <p className="text-gray-600">
                  Find what you want and propose a trade with the owner
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Can&#39;t find what you&#39;re looking for?
            </h2>
            <p className="text-gray-600 mb-6">
              Try browsing all items or add your own item to trade
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-primary text-lg px-8 py-3">
                Browse All Items
              </button>
              <button className="btn btn-outline text-lg px-8 py-3">
                Add Your Item
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 