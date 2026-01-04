
'use client';
import { useState } from 'react';
import { ZenithOrb } from './ZenithOrb';
import { ZenithChat } from './ZenithChat';

export default function ZenithAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ZenithOrb isOpen={isOpen} onClick={() => setIsOpen(true)} />
      <ZenithChat isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
