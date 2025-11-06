'use client';
import { Card } from '@/components/ui/card';
import ProfileCard from './ProfileCard';
import { useState, useEffect, useRef } from 'react';
import InteractiveTimeline from './InteractiveTimeline';

const dynamicTexts = [
  "Passionate Developer",
  "Web Developer",
  "Problem Solver",
  "Innovation Driver"
];

const AboutSection = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % dynamicTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const aboutSection = sectionRef.current;
    if (!aboutSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(aboutSection);
        }
      },
      { threshold: 0.2 } // Trigger when 20% is visible
    );

    observer.observe(aboutSection);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="min-h-screen py-20 px-4 relative overflow-hidden bg-transparent">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Clean, professional title section */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-5xl md:text-7xl font-bold mb-6 text-gradient-slow">
            About Me
          </h2>
          
          <div className="h-10 mb-8">
            <h3 className="text-2xl md:text-3xl font-medium text-gray-400">
              {dynamicTexts[currentTextIndex]}
            </h3>
          </div>
        </div>

        {/* Clean, balanced layout */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Animated ProfileCard */}
          <div className={`flex justify-center transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            <ProfileCard
              name="Adil Munawar"
              title="Web Developer"
              handle="Adil Munawar"
              status="Online"
              contactText="Contact Me"
              avatarUrl="/lovable-uploads/eaf50e40-682a-4730-ac3c-407cf3e4896e.png"
              miniAvatarUrl="/lovable-uploads/eaf50e40-682a-4730-ac3c-407cf3e4896e.png"
              showUserInfo={true}
              enableTilt={true}
              onContactClick={() => console.log('Contact clicked')}
            />
          </div>

          {/* Interactive Timeline */}
          <div className={`space-y-8 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <InteractiveTimeline />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
