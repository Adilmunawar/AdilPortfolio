'use client';

import { useEffect, useRef, useState } from 'react';
import { Bot, Code, Cpu, GitCommit, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const timelineEvents = [
  {
    icon: Code,
    color: 'text-sky-400',
    bgColor: 'bg-sky-900/20',
    title: 'init: Frontend Foundations',
    description: '// Deployed core web APIs. Mastered DOM manipulation & state management with modern JS frameworks to build responsive, dynamic user interfaces.',
  },
  {
    icon: GitCommit,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-900/20',
    title: 'feat: Full-Stack Architecture',
    description: '// Scaled up. Engineered robust server-side logic, managed distributed data streams, and built RESTful APIs for end-to-end application services.',
  },
  {
    icon: Sparkles,
    color: 'text-purple-400',
    bgColor: 'bg-purple-900/20',
    title: 'refactor: UI/UX & Motion',
    description: '// Optimized for human interaction. Integrated advanced animation libraries and design principles to compile fluid, engaging user experiences.',
  },
  {
    icon: Cpu,
    color: 'text-amber-400',
    bgColor: 'bg-amber-900/20',
    title: 'build: Human-Centered AI',
    description: '// Exploring the next commit. Currently developing intelligent interfaces and human-centered digital experiences at the intersection of AI and UI.',
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

const TimelineItem = ({ event, index, isVisible, isLast }: { event: (typeof timelineEvents)[0], index: number, isVisible: boolean, isLast: boolean }) => {
  const lineRef = useRef<HTMLDivElement>(null);
  const [isLineVisible, setIsLineVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsLineVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );

    const currentLine = lineRef.current;
    if (currentLine) {
      observer.observe(currentLine);
    }

    return () => {
      if (currentLine) {
        observer.unobserve(currentLine);
      }
    };
  }, []);

  return (
    <div
      className={cn('relative flex items-start gap-8 transition-opacity duration-700', {
        'opacity-100': isVisible,
        'opacity-40': !isVisible,
      })}
    >
      {/* Node and Connecting Line */}
      <div className="relative flex flex-col items-center flex-shrink-0">
        {/* Node Icon */}
        <div
          className={cn(
            'z-10 w-16 h-16 rounded-full flex items-center justify-center border-2 border-cyber-purple/30 transition-all duration-500',
            event.bgColor,
            { 
              'animate-pulse-glow': isVisible,
            }
          )}
        >
          <event.icon className={cn('w-8 h-8 transition-all duration-500', event.color, { 'scale-110': isVisible })} />
        </div>

        {/* Line Segment */}
        {!isLast && (
           <div ref={lineRef} className="flex-grow w-px bg-cyber-purple/20 mt-4 h-32 relative">
            <div
              className={cn('h-full w-full bg-gradient-to-b from-cyber-purple via-cyber-blue to-emerald-400 absolute top-0 left-0 animate-draw-line', {
                'animate-draw-line': isLineVisible,
              })}
              style={{
                transformOrigin: 'top',
                animationPlayState: isLineVisible ? 'running' : 'paused',
                animationFillMode: 'forwards',
                animationDuration: '1.5s', // Slower, more deliberate draw
              }}
            />
          </div>
        )}
      </div>

      {/* Content Card */}
      <div className={cn(
        "flex-1 pt-1 transition-all duration-500 delay-150 -translate-y-4",
        { 'opacity-100 translate-y-0': isVisible, 'opacity-0': !isVisible }
      )}>
        <div className="p-6 bg-cyber-gray/30 backdrop-blur-xl border border-cyber-purple/20 rounded-xl hover:border-cyber-purple/50 transition-colors duration-300">
          <h4 className="font-bold text-xl text-gray-200 mb-3">
            {event.title}
          </h4>
          <p className="text-sm text-gray-400 leading-relaxed mb-4 font-mono">
            {event.description}
          </p>
          {event.isTyping && isVisible && <TypingAnimation />}
        </div>
      </div>
    </div>
  )
}

const InteractiveTimeline = () => {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
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
    currentItems.forEach((item, index) => {
      const el = itemsRef.current[index];
      if (el) observer.observe(el);
    });

    return () => {
      currentItems.forEach((item, index) => {
        const el = itemsRef.current[index];
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  return (
    <div className="relative py-6">
      <div className="space-y-4">
        {timelineEvents.map((event, index) => (
          <div key={index} ref={(el) => (itemsRef.current[index] = el)} data-index={index}>
            <TimelineItem
              event={event}
              index={index}
              isVisible={visibleItems.includes(index)}
              isLast={index === timelineEvents.length - 1}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default InteractiveTimeline;
