'use client';
import { useState, useEffect, useCallback } from 'react';

interface TextRollerProps {
  roles: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

const TextRoller: React.FC<TextRollerProps> = ({ 
  roles, 
  typingSpeed = 100, 
  deletingSpeed = 50, 
  pauseDuration = 2000 
}) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState('');

  const tick = useCallback(() => {
    const currentRole = roles[index];
    
    // Typing logic
    if (!isDeleting && subIndex < currentRole.length) {
      setText(prev => prev + currentRole[subIndex]);
      setSubIndex(prev => prev + 1);
    }

    // Pause at end of typing
    if (!isDeleting && subIndex === currentRole.length) {
      setTimeout(() => setIsDeleting(true), pauseDuration);
    }

    // Deleting logic
    if (isDeleting && subIndex > 0) {
      setText(prev => prev.slice(0, -1));
      setSubIndex(prev => prev - 1);
    }

    // Switch to next role
    if (isDeleting && subIndex === 0) {
      setIsDeleting(false);
      setIndex(prev => (prev + 1) % roles.length);
    }
  }, [subIndex, isDeleting, index, roles, pauseDuration]);

  useEffect(() => {
    const timer = setTimeout(tick, isDeleting ? deletingSpeed : typingSpeed);
    return () => clearTimeout(timer);
  }, [tick, text, isDeleting, deletingSpeed, typingSpeed]);

  return (
    <div className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-200 drop-shadow-md h-12 flex items-center justify-center">
      <h3 className="whitespace-nowrap">
        {text}
        <span className="typing-cursor"></span>
      </h3>
    </div>
  );
};

export default TextRoller;
