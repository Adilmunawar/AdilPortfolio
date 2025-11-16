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

  const text = roles[index];

  const letterVariants = {
    initial: { y: 20, opacity: 0, rotateX: -90, transformOrigin: 'bottom center' },
    animate: (i: number) => ({
      y: 0,
      opacity: 1,
      rotateX: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
        delay: i * 0.05, // Stagger delay for each letter
      },
    }),
    exit: (i: number) => ({
      y: -20,
      opacity: 0,
      rotateX: 90,
      transition: {
        duration: 0.5,
        ease: 'easeIn',
        delay: i * 0.05, // Stagger delay for exit
      },
    }),
  };

  return (
    <div className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-200 drop-shadow-md h-12 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.h3
          key={text}
          className="whitespace-nowrap"
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ staggerChildren: 0.05 }}
        >
          {text.split('').map((char, i) => (
            <motion.span
              key={`${char}-${i}`}
              custom={i}
              variants={letterVariants}
              className="inline-block"
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.h3>
      </AnimatePresence>
    </div>
  );
};

export default TextRoller;
