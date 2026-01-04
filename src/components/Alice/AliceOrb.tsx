'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import Image from 'next/image';

interface AliceOrbProps {
  onOpen: () => void;
}

export function AliceOrb({ onOpen }: AliceOrbProps) {
  return (
    <motion.button
      onClick={onOpen}
      className="fixed bottom-6 left-6 z-50 group"
      aria-label="Open AI Assistant"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      animate={{
        y: [0, -8, 0],
      }}
      style={{
        textShadow: '0 0 10px hsl(var(--primary))'
      }}
    >
      <motion.div 
        className="relative w-16 h-16 rounded-full glass-card flex items-center justify-center transition-all duration-300 group-hover:shadow-neon-cyan"
        animate={{
            y: [0, -5, 0],
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }}
      >
        <Image
          src="/testimonials/alice.png"
          alt="Alice Avatar"
          width={56}
          height={56}
          className="rounded-full object-cover border-2 border-white/20 group-hover:border-neon-cyan transition-colors"
        />
        {/* Status Dot */}
        <div className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-cyber-dark animate-pulse" />
        
        {/* Floating Icon */}
        <motion.div
            className="absolute -top-2 -right-2 p-1.5 bg-neon-cyan/80 rounded-full shadow-lg"
            animate={{
                y: [0, 3, 0],
                x: [0, -2, 0],
                rotate: [0, 10, 0],
            }}
            transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut'
            }}
        >
            <MessageCircle className="w-4 h-4 text-white" />
        </motion.div>
      </motion.div>
    </motion.button>
  );
}
