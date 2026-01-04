'use client';
import { useState } from 'react';
import { AliceOrb } from './AliceOrb';
import { AliceChat } from './AliceChat';

export default function AliceAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AliceOrb isOpen={isOpen} onClick={() => setIsOpen(true)} />
      <AliceChat isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
