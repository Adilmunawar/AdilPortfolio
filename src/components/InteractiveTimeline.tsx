'use client';

import { useEffect, useRef, useState } from 'react';
import { Sparkles, Users, Rocket, Orbit } from 'lucide-react';
import { cn } from '@/lib/utils';

const timelineEvents = [
  {
    icon: Sparkles,
    color: 'text-sky-400',
    bgColor: 'bg-sky-900/20',
    title: 'Spark of Curiosity',
    description: 'My journey began with a childhood fascination for technology. Entirely self-taught, I dove into the digital world, earning numerous certifications and competing in coding contests to sharpen my skills.',
    code: `function helloWorld() {
  console.log("Dream Big, Start Small");
}`,
  },
  {
    icon: Users,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-900/20',
    title: 'Building the Collective',
    description: 'Driven by a passion to create, I forged a dedicated team to build custom SaaS and web solutions. We started by making a mark on the local stage, delivering quality and innovation to our first clients.',
    code: `app.post('/api/solutions', (req, res) => {
  const { idea } = req.body;
  const solution = createSolution(idea);
  res.status(201).send(solution);
});`,
  },
  {
    icon: Rocket,
    color: 'text-purple-400',
    bgColor: 'bg-purple-900/20',
    title: 'Expanding Horizons',
    description: 'Our reputation for excellence allowed us to transition from local projects to the international arena, collaborating with a diverse range of overseas clients and tackling more complex challenges.',
    code: `const globalPresence = {
  animate: { scale: [1, 1.2, 1] },
  transition: { repeat: Infinity, duration: 5 },
  whileHover: { boxShadow: "0 0 20px #fff" }
};`,
  },
  {
    icon: Orbit,
    color: 'text-amber-400',
    bgColor: 'bg-amber-900/20',
    title: 'The Nexus Mission',
    description: "Today, as a co-founder of Nexus Orbits Pakistan, our mission is to provide cutting-edge digital services on a global scale. The journey is ongoing, and we're just getting started.",
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
  const lineRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const item = itemRef.current;
    const line = lineRef.current;
    if (!item || !line) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          line.style.animationPlayState = 'running';
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(item);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={itemRef} className={cn("relative", { 'pb-16': !isLast })}>
      <div className="flex items-start gap-8">
        <div className="z-10 relative flex-shrink-0">
          <div
            className={cn(
                'w-16 h-16 rounded-full flex items-center justify-center border-2 border-cyber-purple/30 transition-all duration-500',
                event.bgColor,
                { 'animate-pulse-glow': isVisible }
            )}
            >
            <event.icon className={cn('w-8 h-8 transition-all duration-500', event.color, { 'scale-110': isVisible })} />
          </div>
        </div>

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

      {!isLast && (
        <div 
          ref={lineRef}
          className="absolute top-16 left-8 h-full w-px"
          style={{ height: 'calc(100% - 4rem)' }}
        >
          <div className="absolute top-0 left-0 h-full w-px bg-cyber-purple/20" />
          <div
            className="absolute top-0 left-0 w-px bg-gradient-to-b from-cyber-purple via-cyber-blue to-emerald-400 animate-draw-line"
            style={{ 
              animationPlayState: 'paused',
              height: '100%'
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
          <div key={index} ref={(el) => {itemsRef.current[index] = el}} data-index={index}>
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
