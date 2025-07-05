import Header from '../components/Header';
import Hero from '../components/Hero';
import FeaturedItems from '../components/FeaturedItems';
import LikedItems from '../components/LikedItems';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <div className="bg-white">
          <FeaturedItems />
          <LikedItems />
        </div>
        {/* Remove ad/promo sections. Keep only clean, aligned sections. */}
        {/* Other sections (How it Works, Categories, etc.) can be added below if needed */}
      </main>
      <Footer />
    </div>
  );
}
