import FeaturedItems from "../components/FeaturedItems";
import Hero from "../components/Hero";
import "../components/Header.css";
import HowItWorksSection from '@/components/HowItWorksSection';

export default function Home() {
  return (
    <main>
      <Hero />
      <HowItWorksSection />
      <div style={{ background: '#f5f6fa', padding: '32px 16px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24, color: '#222', textAlign: 'center' }}>Featured Items</h2>
          <FeaturedItems />
        </div>
      </div>
    </main>
  );
}
