
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
  const [initialMessage, setInitialMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpen = async () => {
    setIsOpen(true);
    if (!initialMessage) {
      setIsLoading(true);
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: [] }),
        });
        const data = await res.json();
        
        if (data.error) {
          setInitialMessage({ role: 'assistant', content: `Error: ${data.error}` });
        } else {
          setInitialMessage(data);
        }
      } catch (error: any) {
        setInitialMessage({ role: 'assistant', content: `Error: ${error.message}` });
      } finally {
        setIsLoading(false);
      }
    }
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
        initialMessage={initialMessage}
        isInitiallyLoading={isLoading}
      />
    </>
  );
}
