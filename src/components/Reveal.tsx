'use client';
import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

interface RevealProps {
  as?: 'div' | 'section' | 'h2' | 'p' | 'article';
  className?: string;
  delay?: number;
  variant?: 'up' | 'scale' | 'none';
  style?: CSSProperties;
  children?: ReactNode;
  onClick?: () => void;
}

export function Reveal({ as = 'div', className = '', delay = 0, variant = 'up', style, children, onClick }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const show = () => el.classList.add('is-visible');
    const rect = el.getBoundingClientRect();
    if (!('IntersectionObserver' in window) || rect.top < window.innerHeight * 0.95) {
      show();
      return;
    }

    el.classList.add('reveal-armed');
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show();
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);
    const fallback = window.setTimeout(show, 6000);
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  const Tag = as as 'div';
  const mergedStyle = delay ? { ...style, transitionDelay: `${delay}ms` } : style;

  return (
    <Tag ref={ref} className={`reveal reveal-${variant} ${className}`.trim()} style={mergedStyle} onClick={onClick}>
      {children}
    </Tag>
  );
}
