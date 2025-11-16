'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TextRollerProps {
  roles: string[];
  interval?: number;
}

const TextRoller: React.FC<TextRollerProps> = ({ roles, interval = 3000 }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % roles.length);
    }, interval);

    return () => clearInterval(timer);
  }, [roles.length, interval]);

  return (
    <div className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-200 drop-shadow-md">
      <AnimatePresence mode="wait">
        <motion.h3
          key={roles[index]}
          initial={{ y: 20, opacity: 0, rotateX: -90, transformOrigin: 'bottom center' }}
          animate={{ y: 0, opacity: 1, rotateX: 0, transition: { duration: 0.5, ease: 'easeOut' } }}
          exit={{ y: -20, opacity: 0, rotateX: 90, transition: { duration: 0.5, ease: 'easeIn' } }}
          className="whitespace-nowrap"
        >
          {roles[index]}
        </motion.h3>
      </AnimatePresence>
    </div>
  );
};

export default TextRoller;
