
'use client';
import { useState } from 'react';
import { ZenithOrb } from './ZenithOrb';
import { ZenithChat } from './ZenithChat';

export default function ZenithAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [playGreeting, setPlayGreeting] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    setPlayGreeting(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setPlayGreeting(false); // Reset for next time
  }

  return (
    <>
      <ZenithOrb isOpen={isOpen} onClick={handleOpen} />
      <ZenithChat isOpen={isOpen} onClose={handleClose} playInitialGreeting={playGreeting} />
    </>
  );
}
