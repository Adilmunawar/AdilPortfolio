'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';

const certificates = [
  { src: '/advance webhook concepts.png', alt: 'Advanced Webhook Concepts Certificate' },
  { src: '/advanced performance measurements.png', alt: 'Advanced Performance Measurements Certificate' },
  { src: '/CCAI frontend Integrations.png', alt: 'CCAI Frontend Integrations Certificate' },
  { src: '/MLOPS.png', alt: 'MLOPS Certificate' },
  { src: '/MLOPS with vertex Al.png', alt: 'MLOPS with Vertex AI Certificate' },
  { src: '/application modern.png', alt: 'Application Modernization Certificate' },
  { src: '/Google Ads apps.png', alt: 'Google Ads Apps Certificate' },
  { src: '/aws.png', alt: 'AWS Certificate' },
];

// Duplicate for a seamless loop
const extendedCertificates = [...certificates, ...certificates];

const marqueeVariants = {
  animate: {
    x: [0, -200 * (certificates.length / 2) + '%'], // Adjusted for correct looping distance
    transition: {
      x: {
        repeat: Infinity,
        repeatType: 'loop',
        duration: 80, // Slower for smoother effect
        ease: 'linear',
      },
    },
  },
};


const Achievements = () => {
  return (
    <div className="relative w-full overflow-hidden py-12">
      <div className="absolute inset-0 z-0 bg-grid-pattern"></div>
      <div className="absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent"></div>
      <div className="absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent"></div>
      
      <motion.div
        className="flex"
        variants={marqueeVariants}
        animate="animate"
      >
        {extendedCertificates.map((cert, index) => (
          <motion.div
            key={index}
            className="group relative flex-shrink-0 mx-8" // Increased margin for spacing
            whileHover={{ scale: 1.05, zIndex: 20 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="relative w-80 h-56 rounded-lg overflow-hidden transition-all duration-300">
              <Image
                src={cert.src}
                alt={cert.alt}
                layout="fill"
                objectFit="contain"
                className="p-2 transition-transform duration-300 group-hover:scale-105"
              />
               <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            </div>
          </motion.div>
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
