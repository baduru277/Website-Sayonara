import Hero from "../components/Hero";
import "../components/Header.css";
import HowItWorksSection from '@/components/HowItWorksSection';

export default function Home() {
  return (
    <main>
      <Hero />
      <HowItWorksSection />
    </main>
  );
}
