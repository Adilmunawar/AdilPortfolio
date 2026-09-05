import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import DeferredSections from '@/components/DeferredSections';
import { NeonOrbs } from '@/components/ui/neon-orbs';

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <NeonOrbs />
      <Navigation />

      <main className="relative z-10">
        {/* The hero is the only section whose JavaScript ships up front. */}
        <HeroSection />

        {/* Everything below is server-rendered HTML whose JS loads on scroll. */}
        <DeferredSections />
      </main>
    </div>
  );
}
