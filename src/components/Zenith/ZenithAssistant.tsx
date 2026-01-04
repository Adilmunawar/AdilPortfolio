
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
  const [initialAudioUrl, setInitialAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateSpeech = async (text: string): Promise<string | null> => {
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (response.ok) {
        const { audioDataUrl } = await response.json();
        return audioDataUrl;
      }
    } catch (error) {
      console.error("Error generating speech:", error);
    }
    return null;
  };

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
          const audioUrl = await generateSpeech(data.content);
          if (audioUrl) {
            setInitialAudioUrl(audioUrl);
          }
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
        initialAudioUrl={initialAudioUrl}
        isInitiallyLoading={isLoading}
      />
    </>
  );
}
