'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Bot, User, Trash2, BrainCircuit } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { streamChat } from '@/app/actions/chat';

interface Message {
  id: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  reasoning_details?: string | null;
}

interface AliceChatProps {
  isOpen: boolean;
  onClose: () => void;
}

async function* readStream(stream: ReadableStream) {
    const reader = stream.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    while (true) {
        const { value, done } = await reader.read();
        if (done) {
            if (buffer.length > 0) yield buffer;
            break;
        }
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
            if (line.startsWith('data: ')) {
                yield line.substring(6);
            }
        }
    }
}


const TypingIndicator = () => (
  <div className="flex items-center gap-1.5">
    <motion.div
      className="w-2 h-2 bg-neon-cyan rounded-full"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div
      className="w-2 h-2 bg-neon-cyan rounded-full"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
    />
    <motion.div
      className="w-2 h-2 bg-neon-cyan rounded-full"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
    />
  </div>
);

export function AliceChat({ isOpen, onClose }: AliceChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleClearChat = () => {
    setMessages([]);
  };

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now(), role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    const assistantMessageId = Date.now() + 1;
    let currentContent = "";
    let reasoning = null;

    setMessages((prev) => [
        ...prev, 
        { id: assistantMessageId, role: 'assistant', content: "", reasoning_details: null }
    ]);
    
    try {
        const stream = await streamChat(newMessages.map(m => ({role: m.role, content: m.content, reasoning_details: m.reasoning_details})));
        
        for await (const chunk of readStream(stream)) {
            if (chunk.trim() === '[DONE]') {
                break;
            }
            try {
                const parsed = JSON.parse(chunk);
                if (parsed.reasoning_details && !reasoning) {
                    reasoning = parsed.reasoning_details;
                    setMessages(prev => prev.map(msg => 
                        msg.id === assistantMessageId ? { ...msg, reasoning_details: reasoning } : msg
                    ));
                }
                if (parsed.content) {
                    currentContent += parsed.content;
                    setMessages(prev => prev.map(msg => 
                        msg.id === assistantMessageId ? { ...msg, content: currentContent } : msg
                    ));
                }
            } catch(error) {
                console.error("Error parsing stream chunk:", error, "Chunk:", chunk);
            }
        }
    } catch (error) {
        console.error("Error streaming chat:", error);
        setMessages(prev => prev.map(msg => 
            msg.id === assistantMessageId ? { ...msg, content: "Sorry, I encountered an error." } : msg
        ));
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed bottom-24 left-4 right-4 md:left-6 md:right-auto z-50 w-auto max-w-md h-[70vh] flex flex-col glass-card border-2 border-white/10 rounded-xl shadow-2xl shadow-black/50"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center gap-3">
              <Image src="/testimonials/alice.png" alt="Alice" width={40} height={40} className="rounded-full border-2 border-neon-cyan/50" />
              <div>
                <h3 className="font-bold text-white">Alice</h3>
                <p className="text-xs text-green-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={handleClearChat}
                    className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    aria-label="Clear Chat"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
                <button
                    onClick={onClose}
                    className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    aria-label="Close Chat"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
          </div>

          {/* Message List */}
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-6">
            <AnimatePresence>
              {messages.filter(m => m.role !== 'system').map((msg) => (
                <motion.div
                  key={msg.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className={cn(
                    "flex items-start gap-3 w-full",
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {msg.role === 'assistant' && <Bot className="w-6 h-6 text-neon-cyan flex-shrink-0 mt-1" />}
                  <div className={cn(
                      "max-w-[80%] rounded-xl p-3 text-white",
                      msg.role === 'user' ? 'bg-gradient-to-br from-blue-600 to-cyan-500' : 'bg-secondary'
                  )}>
                    {msg.reasoning_details && (
                       <Accordion type="single" collapsible className="mb-2 -mx-1">
                          <AccordionItem value="item-1" className="border-b-0">
                            <AccordionTrigger className="text-xs text-white/50 hover:no-underline py-1 px-1 rounded hover:bg-white/5">
                               <div className="flex items-center gap-1.5">
                                   <BrainCircuit className="w-3 h-3" />
                                   Thought Process
                               </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-2">
                               <pre className="text-xs text-white/50 whitespace-pre-wrap font-mono italic bg-black/20 p-2 rounded-md">
                                   {msg.reasoning_details}
                               </pre>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                    )}
                    
                    {msg.content ? (
                        <ReactMarkdown 
                            remarkPlugins={[remarkGfm]} 
                            className="prose prose-sm prose-invert prose-p:text-white"
                            components={{
                                p: ({node, ...props}) => <p className="text-white" {...props} />,
                            }}
                        >
                            {msg.content}
                        </ReactMarkdown>
                    ) : (
                        msg.role === 'assistant' && <TypingIndicator />
                    )}

                  </div>
                  {msg.role === 'user' && <User className="w-6 h-6 text-blue-300 flex-shrink-0 mt-1" />}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Input Form */}
          <div className="p-4 border-t border-white/10">
            <form onSubmit={sendMessage} className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Alice anything..."
                disabled={isLoading}
                className="flex-1 bg-cyber-dark/80 border border-white/10 rounded-full px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-neon-cyan"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-neon-cyan text-white transition-colors hover:bg-neon-cyan/80 disabled:bg-gray-600 disabled:cursor-not-allowed"
                aria-label="Send Message"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
