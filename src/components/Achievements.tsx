'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Image from 'next/image';

const certificates = [
  { 
    src: '/advance webhook concepts.png', 
    alt: 'Advanced Webhook Concepts Certificate',
    description: 'Mastered advanced webhook concepts enabling robust real-time data synchronization between modern applications.'
  },
  { 
    src: '/advanced performance measurements.png', 
    alt: 'Advanced Performance Measurements Certificate',
    description: 'Achieved certification in enterprise performance measurements, focusing on high-speed application efficiency.'
  },
  { 
    src: '/CCAI frontend Integrations.png', 
    alt: 'CCAI Frontend Integrations Certificate',
    description: 'Proficient in CCAI Frontend Integrations, bridging artificial intelligence capabilities with user-centric interfaces.'
  },
  { 
    src: '/MLOPS.png', 
    alt: 'MLOPS Certificate',
    description: 'Expertise in MLOps workflows, streamlining the entire machine learning lifecycle from dev to deployment.'
  },
  { 
    src: '/MLOPS with vertex AI.png', 
    alt: 'MLOPS with Vertex AI Certificate',
    description: 'Specialized in MLOps using Vertex AI, managing high-scale machine learning models on Google Cloud.'
  },
  { 
    src: '/application modern.png', 
    alt: 'Application Modernization Certificate',
    description: 'Skilled in modernizing legacy architectures to improve overall performance, scalability, and security.'
  },
  { 
    src: '/Google Ads apps.png', 
    alt: 'Google Ads Apps Certificate',
    description: 'Certified in developing and integrating applications with Google Ads APIs for automated campaign management.'
  },
  { 
    src: '/aws.png', 
    alt: 'AWS Certificate',
    description: 'Proficient in deploying and managing scalable, fault-tolerant infrastructure on Amazon Web Services.'
  },
  { 
    src: '/Linkedin Content and creative design.png', 
    alt: 'LinkedIn Content and Creative Design Certificate',
    description: 'Adept at creating high-engagement technical content and visually appealing creative assets.'
  },
  { 
    src: '/Microsoft-azure-professional.png', 
    alt: 'Microsoft Azure Professional Certificate',
    description: 'Qualified to architect and manage secure, scalable enterprise solutions using Microsoft Azure cloud services.'
  },
];

const Achievements = () => {
  const [isPaused, setIsPaused] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  const handleTogglePause = () => {
    setIsPaused(prev => !prev);
  };
  
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
  
    const scrollerWidth = scroller.scrollWidth;
    const scrollableWidth = scrollerWidth / 2;
  
    const animate = () => {
      if (isPaused) {
        controls.stop();
      } else {
        const currentX = (scrollerRef.current as any)?._gsap?.x || 0;
        const remainingDistance = scrollableWidth + currentX;
        const remainingDuration = (remainingDistance / 100);

        controls.start({
          x: -scrollableWidth,
          transition: {
            duration: remainingDuration,
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'loop',
          },
        });
      }
    };
  
    animate();

    return () => controls.stop();
  }, [isPaused, controls]);

  return (
    <div 
      className="relative w-full py-12 overflow-hidden cursor-pointer" 
      onClick={handleTogglePause}
      title="Click to pause/resume"
    >
      <motion.div
        ref={scrollerRef}
        className="flex w-max"
        animate={controls}
        initial={{ x: 0 }}
      >
        {[...certificates, ...certificates].map((item, index) => (
          <div
            key={index}
            className="group relative flex-shrink-0 mx-2"
            style={{ width: '320px', height: '224px' }}
          >
            <div className="relative w-full h-full rounded-lg overflow-hidden transition-all duration-300 transform-gpu group-hover:scale-105">
              <Image
                src={item.src}
                alt={item.alt || ''}
                fill
                sizes="(max-width: 768px) 100vw, 320px"
                className="p-2 object-contain"
              />
              <div className="absolute inset-0 bg-cyber-dark/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                <p className="text-center text-sm text-frost-cyan leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Achievements;