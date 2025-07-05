import Link from 'next/link';
import Header from '../components/Header';
import Hero from '../components/Hero';
import FeaturedItems from '../components/FeaturedItems';
import ExchangeSection from '../components/ExchangeSection';
import BiddingSection from '../components/BiddingSection';
import ResellSection from '../components/ResellSection';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        
        {/* Priority-Based Sections */}
        <div className="bg-white">
          {/* High Priority - Exchange Section */}
          <ExchangeSection />
          
          {/* Medium Priority - Bidding Section */}
          <BiddingSection />
          
          {/* Low Priority - Resell Section */}
          <ResellSection />
        </div>

        {/* Featured Items Section */}
        <FeaturedItems />
        
        {/* How It Works Section */}
        <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                How Sayonara Works
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Choose your preferred way to trade: Exchange, Bid, or Buy directly
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Exchange Items
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Trade your items directly with other users. No money involved, just fair exchanges based on value.
                </p>
                <div className="mt-4">
                  <span className="inline-block bg-purple-100 text-purple-800 text-xs font-medium px-3 py-1 rounded-full">
                    High Priority
                  </span>
                </div>
              </div>

              <div className="text-center group">
                <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Bid on Auctions
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Participate in live auctions for exclusive items. Place bids and compete with other users.
                </p>
                <div className="mt-4">
                  <span className="inline-block bg-orange-100 text-orange-800 text-xs font-medium px-3 py-1 rounded-full">
                    Medium Priority
                  </span>
                </div>
              </div>

              <div className="text-center group">
                <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Buy Directly
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Purchase items directly from verified sellers with secure payments and fast shipping.
                </p>
                <div className="mt-4">
                  <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                    Low Priority
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Popular Categories
              </h2>
                              <p className="text-gray-600 max-w-2xl mx-auto">
                  Explore items by category and find exactly what you&apos;re looking for
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: 'Electronics', icon: '📱', color: 'bg-blue-100 text-blue-600', count: '2,847' },
                { name: 'Fashion', icon: '👕', color: 'bg-purple-100 text-purple-600', count: '1,923' },
                { name: 'Sports', icon: '⚽', color: 'bg-green-100 text-green-600', count: '1,456' },
                { name: 'Books', icon: '📚', color: 'bg-yellow-100 text-yellow-600', count: '892' },
                { name: 'Home & Garden', icon: '🏠', color: 'bg-red-100 text-red-600', count: '1,234' },
                { name: 'Music', icon: '🎵', color: 'bg-pink-100 text-pink-600', count: '567' },
                { name: 'Collectibles', icon: '🎨', color: 'bg-indigo-100 text-indigo-600', count: '789' },
                { name: 'Tools', icon: '🔧', color: 'bg-gray-100 text-gray-600', count: '634' }
              ].map((category) => (
                <div key={category.name} className="group cursor-pointer">
                  <div className="card p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 hover:border-purple-300">
                    <div className={`w-16 h-16 ${category.color} rounded-xl flex items-center justify-center mx-auto mb-4 text-3xl group-hover:scale-110 transition-transform duration-300`}>
                      {category.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500">{category.count} items</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gradient-to-r from-purple-600 to-purple-700 text-white">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div className="group">
                <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                  50K+
                </div>
                <div className="text-purple-200">Active Users</div>
              </div>
              <div className="group">
                <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                  100K+
                </div>
                <div className="text-purple-200">Items Listed</div>
              </div>
              <div className="group">
                <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                  25K+
                </div>
                <div className="text-purple-200">Successful Trades</div>
              </div>
              <div className="group">
                <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                  4.8★
                </div>
                <div className="text-purple-200">User Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Start Trading?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-600">
              Join thousands of users who are already trading sustainably on Sayonara
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/register" 
                className="btn bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 py-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Get Started Free
              </Link>
              <Link 
                href="/browse" 
                className="btn border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white text-lg px-8 py-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
              >
                Browse Items
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
