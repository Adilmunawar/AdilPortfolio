'use client';

import { useEffect, useRef, useState } from 'react';
import { Bot, Code, Cpu, GitCommit, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const timelineEvents = [
  {
    icon: Code,
    color: 'text-sky-400',
    bgColor: 'bg-sky-900/20',
    title: 'Frontend Mastery',
    description: 'Began my journey by mastering the core principles of web development, building responsive and dynamic user interfaces with modern JavaScript frameworks.',
  },
  {
    icon: GitCommit,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-900/20',
    title: 'Architecting Full-Stack Solutions',
    description: 'Expanded into backend development, learning to build robust server-side logic and manage data to create complete, end-to-end applications.',
  },
  {
    icon: Sparkles,
    color: 'text-purple-400',
    bgColor: 'bg-purple-900/20',
    title: 'Elevating UI/UX with Animation',
    description: 'Focused on creating fluid and engaging user experiences by integrating advanced animation libraries and design principles.',
  },
  {
    icon: Cpu,
    color: 'text-amber-400',
    bgColor: 'bg-amber-900/20',
    title: 'Developing for Humans',
    description: 'Currently exploring the intersection of AI and user interfaces, crafting intelligent, intuitive, and human-centered digital experiences.',
    isTyping: true,
  },
];

const TypingAnimation = () => {
  const code = `const createIntelligentUI = (user) => {
  const context = analyze(user.intent);
  return <AdaptiveComponent {...context} />;
};`;

  const [typedCode, setTypedCode] = useState('');

  useEffect(() => {
    if (typedCode.length < code.length) {
      const timeoutId = setTimeout(() => {
        setTypedCode(code.slice(0, typedCode.length + 1));
      }, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [typedCode, code]);

  return (
    <pre className="text-xs text-amber-300/80 p-3 bg-black/30 rounded-md overflow-x-auto">
      <code>
        {typedCode}
        <span className="animate-blink">|</span>
      </code>
    </pre>
  );
};

const InteractiveTimeline = () => {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const timelineRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            setVisibleItems((prev) => [...new Set([...prev, index])].sort());
          }
        });
      },
      { threshold: 0.5, rootMargin: '0px 0px -40% 0px' }
    );

    const currentItems = itemsRef.current;
    currentItems.forEach((item) => {
      if (item) observer.observe(item);
    });

    return () => {
      currentItems.forEach((item) => {
        if (item) observer.unobserve(item);
      });
    };
  }, []);

  return (
    <div ref={timelineRef} className="relative py-6">
      {/* Central Line */}
      <div
        className="absolute left-8 top-0 h-full w-px bg-cyber-purple/20"
      >
        <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-b from-cyber-purple via-cyber-blue to-emerald-400 animate-draw-line" />
      </div>
      
      <div className="space-y-16">
        {timelineEvents.map((event, index) => (
          <div
            key={index}
            ref={(el) => (itemsRef.current[index] = el)}
            data-index={index}
            className={cn('relative flex items-start gap-8 transition-opacity duration-700', {
              'opacity-100': visibleItems.includes(index),
              'opacity-40': !visibleItems.includes(index),
            })}
          >
            {/* Node Icon */}
            <div className="relative z-10 flex-shrink-0">
              <div
                className={cn(
                  'w-16 h-16 rounded-full flex items-center justify-center border-2 border-cyber-purple/30 transition-all duration-500',
                  event.bgColor,
                  { 
                    'border-cyber-blue shadow-lg animate-pulse-glow': visibleItems.includes(index),
                    'shadow-cyber-blue/30 scale-110': visibleItems.includes(index),
                  }
                )}
              >
                <event.icon className={cn('w-8 h-8 transition-all duration-500', event.color, { 'scale-110': visibleItems.includes(index) })} />
              </div>
            </div>

            {/* Content Card */}
            <div className={cn(
              "flex-1 pt-1 transition-all duration-500 delay-150",
              { 'opacity-100 translate-y-0': visibleItems.includes(index), 'opacity-0 translate-y-4': !visibleItems.includes(index) }
            )}>
              <div className="p-6 bg-cyber-gray/30 backdrop-blur-xl border border-cyber-purple/20 rounded-xl hover:border-cyber-purple/50 transition-colors duration-300">
                <h4 className="font-bold text-xl text-gray-200 mb-3">
                  {event.title}
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed mb-4">
                  {event.description}
                </p>
                {event.isTyping && visibleItems.includes(index) && <TypingAnimation />}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InteractiveTimeline;
