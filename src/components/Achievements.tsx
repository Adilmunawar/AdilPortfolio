'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

const certificates = [
  { 
    src: '/advance webhook concepts.png', 
    alt: 'Advanced Webhook Concepts Certificate for Adil Munawar',
    description: 'Adil Munawar mastered advanced webhook concepts, enabling robust real-time data synchronization between applications.'
  },
  { 
    src: '/advanced performance measurements.png', 
    alt: 'Advanced Performance Measurements Certificate for Adil Munawar',
    description: 'Adil Munawar is certified in advanced performance measurements, skilled in optimizing application speed and efficiency.'
  },
  { 
    src: '/CCAI frontend Integrations.png', 
    alt: 'CCAI Frontend Integrations Certificate for Adil Munawar',
    description: 'Adil Munawar is proficient in CCAI Frontend Integrations, connecting powerful AI capabilities with user-friendly interfaces.'
  },
  { 
    src: '/MLOPS.png', 
    alt: 'MLOPS Certificate for Adil Munawar',
    description: 'Adil Munawar demonstrates expertise in MLOps, streamlining the machine learning lifecycle from development to production.'
  },
  { 
    src: '/MLOPS with vertex AI.png', 
    alt: 'MLOPS with Vertex AI Certificate for Adil Munawar',
    description: 'Adil Munawar specializes in MLOps with Vertex AI, managing and deploying machine learning models on Google Cloud.'
  },
  { 
    src: '/application modern.png', 
    alt: 'Application Modernization Certificate for Adil Munawar',
    description: 'Adil Munawar is skilled in modernizing legacy applications to improve performance, scalability, and maintainability.'
  },
  { 
    src: '/Google Ads apps.png', 
    alt: 'Google Ads Apps Certificate for Adil Munawar',
    description: 'Adil Munawar is certified in developing and integrating applications with the Google Ads API for campaign management.'
  },
  { 
    src: '/aws.png', 
    alt: 'AWS Certificate for Adil Munawar',
    description: 'Adil Munawar is proficient in deploying, managing, and operating scalable and fault-tolerant systems on Amazon Web Services.'
  },
  { 
    src: '/Linkedin Content and creative design.png', 
    alt: 'LinkedIn Content and Creative Design Certificate for Adil Munawar',
    description: 'Adil Munawar is adept at creating engaging content and visually appealing designs tailored for the LinkedIn platform.'
  },
  { 
    src: '/Microsoft-azure-professional.png', 
    alt: 'Microsoft Azure Professional Certificate for Adil Munawar',
    description: 'Adil Munawar is qualified to design, build, and manage secure and scalable solutions using Microsoft Azure services.'
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
              <img
                src={item.src}
                alt={item.alt || ''}
                className="p-2 object-contain w-full h-full"
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
