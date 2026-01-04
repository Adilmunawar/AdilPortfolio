'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import remarkGfm from 'remark-gfm';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  reasoning_details?: string | null; // Store the hidden reasoning
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

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

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
        body: JSON.stringify({ 
          messages: [...messages, userMsg],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Network response was not ok');
      }
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.content,
        reasoning_details: data.reasoning_details
      }]);

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "I'm having trouble connecting right now. Please try again.";
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${errorMessage}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-24 left-6 z-50 w-[90vw] max-w-md h-[600px] max-h-[70vh] flex flex-col rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl shadow-2xl overflow-hidden font-sans"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyber-purple to-cyber-blue flex items-center justify-center overflow-hidden border border-white/20">
                   <Bot className="text-white w-6 h-6" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full animate-pulse"></span>
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Alice AI</h3>
                <p className="text-xs text-frost-cyan/60 flex items-center gap-1">
                  <Sparkles size={10} /> Assistant
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Chat Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center text-white/40 space-y-4">
                <Bot size={48} className="opacity-20" />
                <p className="text-sm">Hi! I'm Alice. How can I help with your project?</p>
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                
                {msg.role === 'assistant' && msg.reasoning_details && (
                  <ReasoningAccordion reasoning={msg.reasoning_details} />
                )}

                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                    msg.role === 'user'
                      ? "bg-cyber-blue text-white rounded-br-sm"
                      : "bg-cyber-gray/50 border border-white/5 text-frost-white rounded-bl-sm"
                  )}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose prose-invert prose-sm max-w-none">
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-white/40 text-xs ml-2">
                <span className="animate-bounce">●</span>
                <span className="animate-bounce delay-75">●</span>
                <span className="animate-bounce delay-150">●</span>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/10 bg-white/5">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex items-center gap-2 bg-black/50 border border-white/10 rounded-full px-4 py-2 focus-within:border-cyber-cyan/50 transition-colors"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder:text-white/30"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2 bg-cyber-blue hover:bg-cyber-blue/80 text-white rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ReasoningAccordion = ({ reasoning }: { reasoning: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-1 max-w-[85%]">
        <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/40 hover:text-cyber-cyan transition-colors px-1"
        >
            <Sparkles size={10} />
            {isExpanded ? "Hide Thought Process" : "View Thought Process"}
            {isExpanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
        </button>
        
        <AnimatePresence>
            {isExpanded && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                >
                    <div className="mt-1 p-3 bg-black/40 rounded-lg border-l-2 border-cyber-purple/50 text-xs text-white/60 font-mono leading-relaxed whitespace-pre-wrap">
                        {reasoning}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
};
