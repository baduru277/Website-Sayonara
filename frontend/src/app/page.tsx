import Hero from "../components/Hero";
import "../components/Header.css";
import HowItWorksSection from '@/components/HowItWorksSection';
import StatsSection from '@/components/StatsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import ActivityToast from '@/components/ActivityToast';

export default function Home() {
  return (
    <main>
      <Hero />
      <StatsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <ActivityToast />
    </main>
  );
}
