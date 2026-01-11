
'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ZenithChatProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage: Message | null;
  isInitiallyLoading: boolean;
}

export const ZenithChat = ({ isOpen, onClose, initialMessage, isInitiallyLoading }: ZenithChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    // The voices are loaded asynchronously. We need to listen for the voiceschanged event.
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
      }
    };
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices(); // Initial call
  }, []);
  
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      // Strip Markdown links to avoid reading the URL
      const cleanText = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');

      const utterance = new SpeechSynthesisUtterance(cleanText);
      // Find a suitable female English voice
      const femaleVoice = voices.find(
        voice => voice.lang.startsWith('en') && voice.name.toLowerCase().includes('female')
      ) || voices.find(voice => voice.lang.startsWith('en')); // Fallback to any English voice
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      
      utterance.pitch = 1;
      utterance.rate = 1;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    }
  };


  useEffect(() => {
    if (initialMessage && messages.length === 0) {
      setMessages([initialMessage]);
      // Speak the initial message when it arrives
      if (voices.length > 0) {
        speak(initialMessage.content);
      }
    }
  }, [initialMessage, messages.length, voices]);
  
  useEffect(() => {
    // If voices load after the initial message is set, speak it.
    if (initialMessage && messages.length === 1 && voices.length > 0) {
      const isInitialMessagePresent = messages.some(msg => msg.content === initialMessage.content);
      if (isInitialMessagePresent) {
        speak(initialMessage.content);
      }
    }
  }, [voices, initialMessage, messages]);


  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
    // Cleanup function to stop speech synthesis when the component is closed or unmounted
    return () => {
        document.body.style.overflow = 'auto';
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    };
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    // Stop any currently playing speech
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'The AI is taking a break. Please try again later.');
      }
      
      const data = await response.json();
      setMessages(prev => [...prev, data]);
      speak(data.content);

    } catch (error: any) {
       setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const currentLoadingState = isInitiallyLoading || isLoading;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="relative w-full max-w-2xl h-[600px] max-h-[85vh] flex flex-col rounded-3xl border border-white/10 bg-black/90 shadow-2xl shadow-cyan-500/20 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors z-20">
                    <X size={20} />
                </button>
                
                {/* Chat Area */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar pt-12">
                    <AnimatePresence initial={false}>
                        {messages.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            layout
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className={cn("flex gap-3", msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
                        >
                            <motion.div 
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className={cn("w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center cursor-pointer overflow-hidden", msg.role === 'user' ? 'bg-cyan-700' : 'bg-cyber-gray/80')}
                            >
                                {msg.role === 'user' ? <User size={18} /> : <Image src="/zenith.png" alt="Zenith Avatar" width={32} height={32} className="object-cover" />}
                            </motion.div>
                            <div className={cn(
                                "max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-md",
                                msg.role === 'user'
                                ? "bg-cyan-600 text-white rounded-br-sm"
                                : "bg-cyber-gray/50 border border-white/10 text-frost-white rounded-bl-sm"
                            )}>
                                <ReactMarkdown className="prose prose-sm prose-invert max-w-none prose-p:my-0">{msg.content}</ReactMarkdown>
                            </div>
                        </motion.div>
                        ))}
                    </AnimatePresence>

                    {currentLoadingState && (
                    <div className="flex items-center gap-2 text-white/40 text-xs ml-11">
                        <motion.span animate={{ y: [0, -2, 0] }} transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}>●</motion.span>
                        <motion.span animate={{ y: [0, -2, 0] }} transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}>●</motion.span>
                        <motion.span animate={{ y: [0, -2, 0] }} transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}>●</motion.span>
                    </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 pt-2">
                    <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex items-center gap-2 bg-black/50 border border-white/10 rounded-full p-2 focus-within:border-cyan-400/50 transition-all duration-300"
                    >
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about web development or design projects..."
                        className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder:text-white/30 px-3"
                    />
                    <motion.button
                        type="submit"
                        disabled={!input.trim() || currentLoadingState}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 w-10 h-10 flex items-center justify-center bg-cyan-600 hover:bg-cyan-700 text-white rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        <Send size={16} className="group-hover:translate-x-0.5 transition-transform"/>
                    </motion.button>
                    </form>
                    <p className="text-xs text-center text-cyan-400/40 mt-2">
                        Zenith - Developed by Adil Munawar
                    </p>
                </div>
            </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
