'use client';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

interface AliceOrbProps {
  onClick: () => void;
  isOpen: boolean;
}

export const AliceOrb = ({ onClick, isOpen }: AliceOrbProps) => {
  if (isOpen) return null; // Hide orb when chat is open

  return (
    <motion.button
      onClick={onClick}
      initial={{ y: 0 }}
      animate={{ y: [0, -6, 0] }}
      transition={{ 
        duration: 4, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 left-6 z-50 group"
    >
      <div className="relative flex items-center gap-3 pl-2 pr-5 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 shadow-lg hover:shadow-neon transition-all duration-300 hover:border-cyber-cyan/30">
        
        {/* Avatar Circle */}
        <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-cyber-purple to-cyber-blue flex items-center justify-center border border-white/20">
          <Bot className="text-white w-6 h-6" />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-black rounded-full animate-pulse"></span>
        </div>

        {/* Text */}
        <div className="flex flex-col items-start">
          <span className="text-white font-semibold text-sm tracking-wide">Alice</span>
          <span className="text-[10px] text-cyber-cyan/80 font-medium">Talk to me</span>
        </div>
        
        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-full bg-cyber-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-md"></div>
      </div>
    </motion.button>
  );
};
