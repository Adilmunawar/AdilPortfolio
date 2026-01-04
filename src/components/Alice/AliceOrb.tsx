
'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles } from 'lucide-react';

interface AliceOrbProps {
  onClick: () => void;
  isOpen: boolean;
}

export const AliceOrb = ({ onClick, isOpen }: AliceOrbProps) => {
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
          className="fixed bottom-6 right-6 z-40 group"
        >
          <div className="relative flex items-center gap-3 pl-3 pr-5 py-3 rounded-full bg-black/60 backdrop-blur-lg border border-white/10 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all duration-300 hover:border-cyan-400/30">
            
            {/* Avatar Circle */}
            <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-cyber-purple to-cyber-blue flex items-center justify-center border-2 border-white/20 shadow-inner">
              <Bot className="text-white w-7 h-7" />
              <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 border-2 border-black rounded-full animate-pulse"></span>
            </div>

            {/* Text */}
            <div className="flex flex-col items-start">
              <span className="text-white font-semibold text-base tracking-wide flex items-center gap-1.5">
                Alice <Sparkles className="w-3 h-3 text-cyan-400" />
              </span>
              <span className="text-[11px] text-cyan-400/80 font-medium">Ask me anything</span>
            </div>
            
            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-full bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
