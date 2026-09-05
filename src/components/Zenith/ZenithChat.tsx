'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Volume2, VolumeX, Mail, MessageCircle, RotateCcw } from 'lucide-react';
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
}

const SPEECH_KEY = 'zenith-speech';
const WHATSAPP_URL = 'https://wa.me/923244965220';
const EMAIL_URL = 'mailto:adilmunawarx@gmail.com';

const SUGGESTIONS = [
  'What does Adil specialise in?',
  'Tell me about the HRNet field boundary work',
  'How can I hire Adil?',
  'Show me his AI products',
];

const ERROR_COPY: Record<string, string> = {
  rate_limited: 'You have sent a lot of messages in a short time. Please wait a few minutes, or reach Adil directly.',
  assistant_offline: 'Zenith is offline right now. Reach Adil directly and he will get back to you.',
  upstream: 'Zenith could not reach its brain just now. Try again in a moment, or reach Adil directly.',
};

const readSpeechPref = () => {
  try {
    return localStorage.getItem(SPEECH_KEY) === 'on';
  } catch {
    return false;
  }
};

const isTouchDevice = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: none), (pointer: coarse)').matches;

const stopSpeech = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
};

export const ZenithChat = ({ isOpen, onClose }: ZenithChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [speechOn, setSpeechOn] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastHistoryRef = useRef<Message[]>([]);
  const speechOnRef = useRef(false);
  const busy = isLoading || isStreaming;

  useEffect(() => {
    const pref = readSpeechPref();
    setSpeechOn(pref);
    speechOnRef.current = pref;
  }, []);

  const speak = (text: string) => {
    if (!('speechSynthesis' in window) || isTouchDevice()) return;
    stopSpeech();
    const clean = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1').replace(/[*_#`>]/g, '');
    const utterance = new SpeechSynthesisUtterance(clean);
    const voices = window.speechSynthesis.getVoices();
    const voice =
      voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('female')) ||
      voices.find(v => v.lang.startsWith('en'));
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  };

  const toggleSpeech = () => {
    const next = !speechOn;
    setSpeechOn(next);
    speechOnRef.current = next;
    if (!next) stopSpeech();
    try {
      localStorage.setItem(SPEECH_KEY, next ? 'on' : 'off');
    } catch {}
  };

  const streamResponse = useCallback(async (history: Message[]) => {
    lastHistoryRef.current = history;
    setError(null);
    setIsLoading(true);
    let appended = false;
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });

      if (!response.ok) {
        let code = 'upstream';
        try {
          const data = await response.json();
          if (typeof data?.error === 'string') code = data.error;
        } catch {}
        throw new Error(code);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('upstream');

      setIsLoading(false);
      setIsStreaming(true);
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
      appended = true;

      const decoder = new TextDecoder();
      let full = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        const snapshot = full;
        setMessages(prev => {
          const next = [...prev];
          next[next.length - 1] = { role: 'assistant', content: snapshot };
          return next;
        });
      }

      if (!full.trim()) throw new Error('upstream');
      if (speechOnRef.current) speak(full);
    } catch (err) {
      if (appended) {
        setMessages(prev => {
          const last = prev[prev.length - 1];
          return last?.role === 'assistant' && !last.content.trim() ? prev.slice(0, -1) : prev;
        });
      }
      const code = err instanceof Error ? err.message : 'upstream';
      setError(ERROR_COPY[code] ? code : 'upstream');
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = async (text: string) => {
    const content = text.trim();
    if (!content || busy) return;
    stopSpeech();
    const history = [...messages, { role: 'user' as const, content }];
    setMessages(history);
    setInput('');
    await streamResponse(history);
  };

  const retry = () => {
    if (busy) return;
    streamResponse(lastHistoryRef.current);
  };

  useEffect(() => {
    if (isOpen && messages.length === 0 && !busy && !error) streamResponse([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading, error]);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    if (!isTouchDevice()) inputRef.current?.focus();
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      stopSpeech();
    };
  }, [isOpen, onClose]);

  const showSuggestions = messages.length === 1 && messages[0].role === 'assistant' && !busy && !error;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 sm:p-4"
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Chat with Zenith"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="relative flex flex-col w-full h-[100dvh] sm:h-[640px] sm:max-h-[85vh] sm:max-w-2xl rounded-none sm:rounded-2xl border-0 sm:border border-white/10 bg-[#0b0d14] shadow-[0_0_40px_rgba(0,102,255,0.25)] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 sm:px-5 py-3 border-b border-white/10 bg-black/40 pt-[max(0.75rem,env(safe-area-inset-top))]">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-cyber-gray/80 flex-shrink-0">
                <Image src="/zenith-avatar.webp" alt="" width={36} height={36} className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-frost-white leading-tight">Zenith</p>
                <p className="text-xs text-blue-300/70 leading-tight truncate">Adil Munawar&apos;s assistant</p>
              </div>
              <button
                type="button"
                onClick={toggleSpeech}
                aria-pressed={speechOn}
                aria-label={speechOn ? 'Turn voice off' : 'Turn voice on'}
                title={speechOn ? 'Voice on' : 'Voice off'}
                className={cn(
                  'w-11 h-11 flex items-center justify-center rounded-full transition-colors',
                  speechOn ? 'text-blue-300 bg-blue-500/15 hover:bg-blue-500/25' : 'text-white/50 hover:text-white hover:bg-white/10'
                )}
              >
                {speechOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close chat"
                className="w-11 h-11 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={22} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-4 custom-scrollbar">
              <AnimatePresence initial={false}>
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className={cn('flex gap-2.5', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
                  >
                    <div
                      className={cn(
                        'w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden',
                        msg.role === 'user' ? 'bg-blue-700 text-white' : 'bg-cyber-gray/80'
                      )}
                    >
                      {msg.role === 'user' ? (
                        <User size={16} />
                      ) : (
                        <Image src="/zenith-avatar.webp" alt="" width={32} height={32} className="object-cover" />
                      )}
                    </div>
                    <div
                      className={cn(
                        'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-md break-words',
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white rounded-br-sm'
                          : 'bg-cyber-gray/50 border border-white/10 text-frost-white rounded-bl-sm'
                      )}
                    >
                      <ReactMarkdown className="prose prose-sm prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-a:text-blue-300 [overflow-wrap:anywhere]">
                        {msg.content || ' '}
                      </ReactMarkdown>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <div className="flex items-center gap-1 text-blue-300/70 text-xs ml-11 font-medium tracking-wide">
                  <span>Zenith is thinking</span>
                  {[0, 0.2, 0.4].map(delay => (
                    <motion.span
                      key={delay}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay }}
                    >
                      .
                    </motion.span>
                  ))}
                </div>
              )}

              {showSuggestions && (
                <div className="flex flex-wrap gap-2 sm:ml-11">
                  {SUGGESTIONS.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => sendMessage(s)}
                      className="min-h-[44px] px-4 py-2 rounded-full border border-blue-400/30 bg-blue-500/10 text-blue-100 text-sm text-left hover:bg-blue-500/20 hover:border-blue-400/60 active:scale-[0.98] transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4 text-sm text-frost-white"
                >
                  <p className="font-semibold mb-1">Zenith is offline right now &mdash; reach Adil directly</p>
                  <p className="text-white/70 mb-3">{ERROR_COPY[error]}</p>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full bg-green-600 hover:bg-green-500 text-white font-medium transition-colors"
                    >
                      <MessageCircle size={16} /> WhatsApp
                    </a>
                    <a
                      href={EMAIL_URL}
                      className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
                    >
                      <Mail size={16} /> Email
                    </a>
                    <button
                      type="button"
                      onClick={retry}
                      disabled={busy}
                      className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full border border-white/20 text-white/80 hover:bg-white/10 disabled:opacity-50 transition-colors"
                    >
                      <RotateCcw size={16} /> Retry
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input bar */}
            <div className="sticky bottom-0 border-t border-white/10 bg-black/40 px-3 sm:px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  sendMessage(input);
                }}
                className="flex items-center gap-2 bg-black/50 border border-white/10 rounded-full p-1.5 pl-3 focus-within:border-blue-400/50 transition-colors"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask about Adil's work, skills or availability..."
                  aria-label="Message Zenith"
                  autoComplete="off"
                  enterKeyHint="send"
                  maxLength={2000}
                  className="flex-1 min-w-0 bg-transparent border-none outline-none text-white text-[16px] placeholder:text-[#6f7888] py-2"
                />
                <motion.button
                  type="submit"
                  disabled={!input.trim() || busy}
                  aria-label="Send"
                  whileTap={{ scale: 0.92 }}
                  className="w-11 h-11 flex-shrink-0 flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                </motion.button>
              </form>
              <p className="text-[11px] text-center text-[#6f7888] mt-2">Zenith - developed by Adil Munawar</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
