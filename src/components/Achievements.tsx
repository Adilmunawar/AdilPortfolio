'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';

const certificates = [
  { src: '/advance webhook concepts.png', alt: 'Advanced Webhook Concepts Certificate' },
  { src: '/advanced performance measurements.png', alt: 'Advanced Performance Measurements Certificate' },
  { src: '/CCAI frontend Integrations.png', alt: 'CCAI Frontend Integrations Certificate' },
  { src: '/MLOPS.png', alt: 'MLOPS Certificate' },
  { src: '/MLOPS with vertex AI.png', alt: 'MLOPS with Vertex AI Certificate' },
  { src: '/application modern.png', alt: 'Application Modernization Certificate' },
  { src: '/Google Ads apps.png', alt: 'Google Ads Apps Certificate' },
  { src: '/aws.png', alt: 'AWS Certificate' },
];

const Achievements = () => {
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  const handleTogglePause = () => {
    setIsPaused(prev => !prev);
  };
  
  useEffect(() => {
    if (isPaused) {
      controls.stop();
    } else {
      const scrollerWidth = scrollerRef.current?.scrollWidth ?? 0;
      const scrollableWidth = scrollerWidth / 2;

      controls.start({
        x: -scrollableWidth,
        transition: {
          duration: (scrollableWidth / 100), // Adjust speed here
          ease: 'linear',
          repeat: Infinity,
          repeatType: 'loop',
        },
      });
    }
  }, [isPaused, controls]);

  useEffect(() => {
    // Initial animation start
    const scrollerWidth = scrollerRef.current?.scrollWidth ?? 0;
    const scrollableWidth = scrollerWidth / 2;

    if (scrollableWidth > 0) {
      controls.start({
        x: -scrollableWidth,
        transition: {
          duration: (scrollableWidth / 100), // Adjust speed here
          ease: 'linear',
          repeat: Infinity,
          repeatType: 'loop',
        },
      });
    }
  }, [controls]);
  

  return (
    <div className="relative w-full py-12 overflow-hidden" onClick={handleTogglePause}>
      <motion.div
        ref={scrollerRef}
        className="flex w-max"
        animate={controls}
      >
        {[...certificates, ...certificates].map((item, index) => (
          <div
            key={index}
            className="group relative flex-shrink-0 mx-4"
            style={{ width: '320px', height: '224px' }}
          >
            <div className="relative w-full h-full rounded-lg overflow-hidden transition-all duration-300 transform-gpu group-hover:scale-105">
              <img
                src={item.src}
                alt={item.alt || ''}
                className="p-2 object-contain w-full h-full"
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-50 transition-all duration-300"></div>
            </div>
          </div>
        ))}
      </motion.div>
      
      <div className="text-center mt-12 relative z-10">
        <h3 className="text-3xl font-bold text-gradient-slow">
          Achievements
        </h3>
      </div>
    </div>
  );
};

export default Achievements;
