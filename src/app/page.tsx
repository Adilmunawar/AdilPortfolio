
'use client';
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import SkillsSection from '@/components/SkillsSection';
import ServicesSection from '@/components/ServicesSection';
import ProjectsSection from '@/components/ProjectsSection';
import ContactSection from '@/components/ContactSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import { NeonOrbs } from '@/components/ui/neon-orbs';
import StatsSection from '@/components/StatsSection';

export default function Home() {

  return (
    <div className="relative min-h-screen">
      <NeonOrbs />
      <Navigation />
      
      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <StatsSection />
        <SkillsSection />
        <ServicesSection />
        <ProjectsSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
    </div>
  );
}
