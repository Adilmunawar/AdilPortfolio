'use client';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import SkillsSection from '@/components/SkillsSection';
import ServicesSection from '@/components/ServicesSection';
import ProjectsSection from '@/components/ProjectsSection';
import ContactSection from '@/components/ContactSection';
import FloatingLines from '@/components/FloatingLines';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-cyber-dark">
      <FloatingLines 
        mixBlendMode='screen'
        animationSpeed={0.5}
        interactive={true}
        lineCount={10}
        lineDistance={0.3}
      />
      <Navigation />
      
      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ServicesSection />
        <ProjectsSection />
        <ContactSection />
      </main>
    </div>
  );
}
