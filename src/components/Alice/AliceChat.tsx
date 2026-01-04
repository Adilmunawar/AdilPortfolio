'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Cpu } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  reasoning_details?: any; 
}

interface AliceChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AliceChat = ({ isOpen, onClose }: AliceChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);
  
  useEffect(() => {
    if (isOpen) {
        document.body.style.overflow = 'hidden';
        if (messages.length === 0) {
          setIsLoading(true);
          fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: [] }),
          })
          .then(res => res.json())
          .then(data => {
            if (data.error) {
              setMessages([{ role: 'assistant', content: `Error: ${data.error}` }]);
            } else {
              setMessages([data]);
            }
          })
          .catch(error => {
            setMessages([{ role: 'assistant', content: `Error: ${error.message}` }]);
          })
          .finally(() => setIsLoading(false));
        }
    } else {
        document.body.style.overflow = 'auto';
    }
    return () => {
        document.body.style.overflow = 'auto';
    };
  }, [isOpen, messages.length]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

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

    } catch (error: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

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
                    {messages.map((msg, idx) => (
                    <div key={idx} className={cn("flex gap-3", msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}>
                        <div className={cn("w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center", msg.role === 'user' ? 'bg-cyan-700' : 'bg-cyber-gray/80')}>
                            {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                        </div>
                        <div className={cn(
                            "max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-md",
                            msg.role === 'user'
                            ? "bg-cyan-600 text-white rounded-br-sm"
                            : "bg-cyber-gray/50 border border-white/10 text-frost-white rounded-bl-sm"
                        )}>
                            <ReactMarkdown className="prose prose-sm prose-invert max-w-none prose-p:my-0">{msg.content}</ReactMarkdown>
                        </div>
                    </div>
                    ))}

                    {isLoading && messages.length > 0 && (
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
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="p-2 w-10 h-10 flex items-center justify-center bg-cyan-600 hover:bg-cyan-700 text-white rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        <Send size={16} className="group-hover:translate-x-0.5 transition-transform"/>
                    </button>
                    </form>
                    <p className="text-xs text-center text-cyan-400/40 mt-2">
                        Alice - Developed by Adil Munawar
                    </p>
                </div>
            </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
