// 🚀 NOTICE: No 'use client' here! This is now a Server Component.
import dynamic from 'next/dynamic';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import { NeonOrbs } from '@/components/ui/neon-orbs';

// ⚡ LAZY LOADING: These chunks of JavaScript will not load until the browser is idle
// or the user scrolls near them. This saves massive amounts of memory on low-end devices.
const AboutSection = dynamic(() => import('@/components/AboutSection'));
const StatsSection = dynamic(() => import('@/components/StatsSection'));
const SkillsSection = dynamic(() => import('@/components/SkillsSection'));
const ServicesSection = dynamic(() => import('@/components/ServicesSection'));
const CaseStudiesSection = dynamic(() => import('@/components/CaseStudiesSection'));
const ProjectsSection = dynamic(() => import('@/components/ProjectsSection'));
const TestimonialsSection = dynamic(() => import('@/components/TestimonialsSection'));
const BlogSection = dynamic(() => import('@/components/BlogSection'));
const ContactSection = dynamic(() => import('@/components/ContactSection'));

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <NeonOrbs />
      <Navigation />
      
      <main className="relative z-10">
        {/* The Hero loads instantly because it's in the initial HTML payload */}
        <HeroSection />
        
        {/* These load lazily in the background */}
        <AboutSection />
        <StatsSection />
        <SkillsSection />
        <ServicesSection />
        <CaseStudiesSection />
        <ProjectsSection />
        <TestimonialsSection />
        <BlogSection />
        <ContactSection />
      </main>
    </div>
  );
}
