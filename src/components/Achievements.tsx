'use client';
import { useState, useEffect, useRef } from 'react';
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
  { src: '/Linkedin Content and creative design.png', alt: 'LinkedIn Content and Creative Design Certificate' },
  { src: '/Microsoft-azure-professional.png', alt: 'Microsoft Azure Professional Certificate' },
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
    const scroller = scrollerRef.current;
    if (!scroller) return;
  
    const scrollerWidth = scroller.scrollWidth;
    const scrollableWidth = scrollerWidth / 2;
  
    const animate = () => {
      if (isPaused) {
        controls.stop();
      } else {
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
    };
  
    // Wait for images to load to get correct scrollWidth
    const images = scroller.querySelectorAll('img');
    let loadedImages = 0;
    const totalImages = images.length;
  
    if (totalImages === 0) {
      animate();
      return;
    }
  
    images.forEach(img => {
      if (img.complete) {
        loadedImages++;
      } else {
        img.onload = () => {
          loadedImages++;
          if (loadedImages === totalImages) {
            animate();
          }
        };
      }
    });
  
    if (loadedImages === totalImages) {
      animate();
    }
  
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
      >
        {[...certificates, ...certificates].map((item, index) => (
          <div
            key={index}
            className="group relative flex-shrink-0 mx-2"
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
    </div>
  );
};

export default Achievements;
