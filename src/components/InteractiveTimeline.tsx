'use client';

import { useEffect, useRef, useState } from 'react';
import { Bot, Code, Cpu, GitCommit, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const timelineEvents = [
  {
    icon: Code,
    color: 'text-sky-400',
    bgColor: 'bg-sky-900/20',
    commitHash: 'b4a2d89',
    commitMessage: 'feat: Initialized Frontend Mastery',
    description: 'Began my journey by mastering the core principles of web development, building responsive and dynamic user interfaces with modern JavaScript frameworks.',
  },
  {
    icon: GitCommit,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-900/20',
    commitHash: 'f7c3e1a',
    commitMessage: 'build: Architecting Full-Stack Solutions',
    description: 'Expanded into backend development, learning to build robust server-side logic and manage data to create complete, end-to-end applications.',
  },
  {
    icon: Sparkles,
    color: 'text-purple-400',
    bgColor: 'bg-purple-900/20',
    commitHash: 'a1d0f6c',
    commitMessage: 'refactor: Elevating UI/UX with Animation',
    description: 'Focused on creating fluid and engaging user experiences by integrating advanced animation libraries and design principles.',
  },
  {
    icon: Cpu,
    color: 'text-amber-400',
    bgColor: 'bg-amber-900/20',
    commitHash: 'c9e8b4d',
    commitMessage: 'feat(AI): Developing for Humans',
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
  const [isVisible, setIsVisible] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );

    if (timelineRef.current) {
      observer.observe(timelineRef.current);
    }

    return () => {
      if (timelineRef.current) {
        observer.unobserve(timelineRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={timelineRef}
      className={cn(
        'relative p-6 border border-cyber-purple/20 bg-cyber-gray/20 backdrop-blur-xl rounded-2xl overflow-hidden',
        { 'is-visible': isVisible }
      )}
    >
      <div className="absolute top-0 left-1/2 w-px h-full">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-cyber-purple/60 via-cyber-blue/40 to-transparent animate-draw-line" />
      </div>

      <div className="space-y-12 relative z-10">
        {timelineEvents.map((event, index) => (
          <div
            key={index}
            className={cn('flex items-start gap-4 animate-timeline-item', {
              'opacity-0': !isVisible,
            })}
            style={{ animationDelay: `${index * 300}ms` }}
          >
            <div className="relative">
              <div
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center border-2 border-cyber-purple/30',
                  event.bgColor
                )}
              >
                <event.icon className={cn('w-6 h-6', event.color)} />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-cyber-purple rounded-full animate-pulse-glow" />
            </div>

            <div className="flex-1 pt-1.5">
              <div className="flex items-center gap-2 mb-2">
                <p className="font-mono text-xs text-gray-500 bg-gray-800/50 px-2 py-0.5 rounded">
                  {event.commitHash}
                </p>
                <h4 className="font-semibold text-gray-300">
                  {event.commitMessage}
                </h4>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-3">
                {event.description}
              </p>
              {event.isTyping && isVisible && <TypingAnimation />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InteractiveTimeline;
