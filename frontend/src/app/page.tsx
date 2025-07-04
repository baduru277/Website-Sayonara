import Header from '../components/Header';
import Hero from '../components/Hero';
import FeaturedItems from '../components/FeaturedItems';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <FeaturedItems />
        
        {/* How It Works Section */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                How Sayonara Works
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Get started with sustainable trading in just a few simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  List Your Item
                </h3>
                <p className="text-gray-600">
                  Upload photos and describe what you&#39;re offering. Specify what you&#39;d like to trade for.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Find Matches
                </h3>
                <p className="text-gray-600">
                  Browse items from other users and find perfect trade matches for your items.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Trade & Connect
                </h3>
                <p className="text-gray-600">
                  Negotiate the trade, meet up safely, and complete your exchange.
                </p>
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
                Explore items by category and find exactly what you&#39;re looking for
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Electronics', icon: '📱', color: 'bg-blue-100 text-blue-600' },
                { name: 'Fashion', icon: '👕', color: 'bg-purple-100 text-purple-600' },
                { name: 'Sports', icon: '⚽', color: 'bg-green-100 text-green-600' },
                { name: 'Books', icon: '📚', color: 'bg-yellow-100 text-yellow-600' },
                { name: 'Home & Garden', icon: '🏠', color: 'bg-red-100 text-red-600' },
                { name: 'Music', icon: '🎵', color: 'bg-pink-100 text-pink-600' },
                { name: 'Collectibles', icon: '🎨', color: 'bg-indigo-100 text-indigo-600' },
                { name: 'Tools', icon: '🔧', color: 'bg-gray-100 text-gray-600' }
              ].map((category) => (
                <div key={category.name} className="card p-6 text-center hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mx-auto mb-3 text-2xl`}>
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Trading?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already trading sustainably on Sayonara
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/register" className="btn bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4">
                Get Started Free
              </a>
              <a href="/browse" className="btn border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4">
                Browse Items
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
