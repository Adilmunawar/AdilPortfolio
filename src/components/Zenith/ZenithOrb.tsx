
'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ZenithOrbProps {
  onClick: () => void;
  isOpen: boolean;
}

const subtitles = [
  "Have a project?",
  "Collab with Adil?",
  "Let's connect!",
];

export const ZenithOrb = ({ onClick, isOpen }: ZenithOrbProps) => {
  const [currentSubtitle, setCurrentSubtitle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSubtitle((prev) => (prev + 1) % subtitles.length);
    }, 3000); // Change text every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.button
          onClick={onClick}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { delay: 1, type: 'spring' } }}
          exit={{ y: 100, opacity: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 left-6 z-40 group"
        >
          <div className="relative flex items-center gap-3 pl-3 pr-5 py-3 rounded-full bg-black/60 backdrop-blur-lg border border-white/10 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all duration-300 hover:border-cyan-400/30">
            
            {/* Avatar Circle */}
            <motion.div 
              className="relative w-14 h-14 rounded-full bg-gradient-to-br from-cyan-600 to-blue-800 flex items-center justify-center border-2 border-white/20 shadow-inner overflow-hidden group-hover:from-cyan-500 group-hover:to-blue-700 transition-colors"
            >
              <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="w-full h-full">
                <Image src="/zenith.png" alt="Zenith Avatar" width={56} height={56} className="object-cover" />
              </motion.div>
              <motion.span 
                className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-black rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>

            {/* Text */}
            <div className="flex flex-col items-start overflow-hidden">
              <span className="text-white font-semibold text-base tracking-wide flex items-center gap-1.5">
                Zenith
              </span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentSubtitle}
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  exit={{ y: '-100%', opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="text-[11px] text-cyan-400/80 font-medium block"
                >
                  {subtitles[currentSubtitle]}
                </motion.span>
              </AnimatePresence>
            </div>
            
            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-full bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
