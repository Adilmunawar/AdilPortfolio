
'use client';
import { useState } from 'react';
import { ZenithOrb } from './ZenithOrb';
import { ZenithChat } from './ZenithChat';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ZenithAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  }

  return (
    <>
      <ZenithOrb isOpen={isOpen} onClick={handleOpen} />
      <ZenithChat 
        isOpen={isOpen} 
        onClose={handleClose} 
      />
    </>
  );
}
