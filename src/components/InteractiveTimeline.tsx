'use client';

import { useEffect, useRef, useState } from 'react';
import { Code, Cpu, GitCommit, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const timelineEvents = [
  {
    icon: Code,
    color: 'text-sky-400',
    bgColor: 'bg-sky-900/20',
    title: 'init: Frontend Foundations',
    description: 'Deployed core web APIs. Mastered DOM manipulation & state management with modern JS frameworks to build responsive, dynamic user interfaces.',
    code: `const UIEngine = () => (
  <div className="responsive-ui">
    <h1>Hello, World!</h1>
  </div>
);`,
  },
  {
    icon: GitCommit,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-900/20',
    title: 'feat: Full-Stack Architecture',
    description: 'Scaled up. Engineered robust server-side logic, managed distributed data streams, and built RESTful APIs for end-to-end application services.',
    code: `app.get('/api/data', async (req, res) => {
  const data = await db.fetchData();
  res.status(200).json(data);
});`,
  },
  {
    icon: Sparkles,
    color: 'text-purple-400',
    bgColor: 'bg-purple-900/20',
    title: 'refactor: UI/UX & Motion',
    description: 'Optimized for human interaction. Integrated advanced animation libraries and design principles to compile fluid, engaging user experiences.',
    code: `const cardAnimation = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  transition: { type: 'spring', stiffness: 100 }
};`,
  },
  {
    icon: Cpu,
    color: 'text-amber-400',
    bgColor: 'bg-amber-900/20',
    title: 'build: Human-Centered AI',
    description: 'Exploring the next commit. Currently developing intelligent interfaces and human-centered digital experiences at the intersection of AI and UI.',
    code: `const createIntelligentUI = (user) => {
  const context = analyze(user.intent);
  return <AdaptiveComponent {...context} />;
};`,
  },
];

const TypingAnimation = ({ code }: { code: string }) => {
  const [typedCode, setTypedCode] = useState('');

  useEffect(() => {
    if (typedCode.length < code.length) {
      const timeoutId = setTimeout(() => {
        setTypedCode(code.slice(0, typedCode.length + 1));
      }, 40); // Adjusted speed for better feel
      return () => clearTimeout(timeoutId);
    }
  }, [typedCode, code]);

  return (
    <pre className="text-xs text-sky-300 p-3 bg-black/30 rounded-md overflow-x-auto mt-3 font-mono">
      <code>
        {typedCode}
        <span className="animate-blink">|</span>
      </code>
    </pre>
  );
};

const TimelineItem = ({ event, index, isVisible, isLast }: { event: (typeof timelineEvents)[0], index: number, isVisible: boolean, isLast: boolean }) => {
  return (
    <div className="relative">
      <div className={cn(
        "flex items-start gap-8",
        { 'pb-12': !isLast }
      )}>
        {/* Node Icon */}
        <div className="z-10 relative">
            <div
            className={cn(
                'w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center border-2 border-cyber-purple/30 transition-all duration-500 relative',
                event.bgColor,
                { 'animate-pulse-glow': isVisible }
            )}
            >
            <event.icon className={cn('w-8 h-8 transition-all duration-500', event.color, { 'scale-110': isVisible })} />
            </div>
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
            
            <p className="text-sm text-gray-400 font-mono">{event.description}</p>
            
            {isVisible && <TypingAnimation code={event.code} />}
          </div>
        </div>
      </div>

      {/* Connecting Line Segment */}
      {!isLast && (
         <div 
          className="absolute top-8 left-8 h-full w-px"
          style={{ height: 'calc(100% - 2rem)' }}
        >
          {/* Static track for the line */}
          <div className="absolute top-8 left-0 h-full w-px bg-cyber-purple/20" style={{ height: 'calc(100% - 4rem)' }} />
          {/* Animated line that draws on scroll */}
          <div
            className="absolute top-8 left-0 w-px bg-gradient-to-b from-cyber-purple via-cyber-blue to-emerald-400 animate-draw-line"
            style={{ 
              animationPlayState: isVisible ? 'running' : 'paused',
              height: 'calc(100% - 4rem)'
             }}
          />
        </div>
      )}
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
            setVisibleItems((prev) => Array.from(new Set([...prev, index])).sort());
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
      <div className="flex flex-col">
        {timelineEvents.map((event, index) => (
          <div key={index} ref={(el) => { itemsRef.current[index] = el; }} data-index={index}>
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
