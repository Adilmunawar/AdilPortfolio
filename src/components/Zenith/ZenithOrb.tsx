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
    }, 4000); // Slower interval for less distraction

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.button
          onClick={onClick}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { delay: 0.5, type: 'spring', stiffness: 200, damping: 20 } }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 z-40 group origin-bottom-left"
        >
          {/* Main Tab Container */}
          <div className="relative flex items-center gap-3 pl-4 pr-6 py-2.5 bg-cyber-dark/90 backdrop-blur-md border-t border-r border-vivid-blue/30 shadow-[4px_-4px_20px_rgba(0,102,255,0.15)] hover:shadow-[8px_-8px_30px_rgba(0,102,255,0.3)] transition-all duration-500 hover:border-vivid-blue/60 rounded-tr-3xl hover:pr-8 overflow-hidden group">
            
            {/* Cyber Scanline Effect on Hover */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-vivid-blue/10 to-transparent translate-y-[-100%] group-hover:animate-scanline pointer-events-none opacity-50"></div>

            {/* Avatar Focus Circle */}
            <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-cyber-gray to-black flex items-center justify-center border border-white/10 overflow-visible group-hover:border-vivid-blue/50 transition-colors duration-500 z-10">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800">
                 <Image src="/zenith.png" alt="Zenith Avatar" width={40} height={40} className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
              </div>
              
              {/* Pure CSS Ping Indicator for Performance */}
              <div className="absolute top-0 right-0 flex h-3.5 w-3.5 items-center justify-center transform translate-x-1/4 -translate-y-1/4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500 border border-white"></span>
              </div>
            </div>

            {/* Text Area (Fixed Dimensions to Prevent Layout Shift) */}
            <div className="flex flex-col items-start w-32 text-left z-10">
              <span className="text-frost-white font-bold text-sm tracking-tight flex items-center gap-1.5 group-hover:text-vivid-blue transition-colors duration-300 group-hover:animate-text-glow">
                Zenith AI
              </span>
              <div className="h-4 relative w-full overflow-hidden mt-0.5">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentSubtitle}
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: '0%', opacity: 1 }}
                    exit={{ y: '-100%', opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute text-[11px] text-vivid-blue/80 font-medium whitespace-nowrap"
                  >
                    {subtitles[currentSubtitle]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
            
            {/* Interactive Inner Glow */}
            <div className="absolute inset-0 rounded-tr-3xl bg-vivid-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            
            {/* Subtle Top Shine */}
            <div className="absolute top-0 left-0 right-4 h-[1px] bg-gradient-to-r from-transparent via-vivid-blue/50 to-transparent opacity-50"></div>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
