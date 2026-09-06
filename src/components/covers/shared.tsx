'use client';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type SVGProps } from 'react';

export const ACCENT = '#5c9dff';
export const ACCENT_DEEP = '#0066ff';
export const NODE_FILL = '#171d2b';
export const NODE_FILL_2 = '#1e2536';
export const LINE = 'rgba(255,255,255,0.18)';
export const LINE_SOFT = 'rgba(255,255,255,0.08)';
export const TEXT = '#a4adbe';
export const TEXT_MUTED = '#6f7888';
export const GREEN = '#34d399';
export const AMBER = '#f5b544';
export const ROSE = '#f4627a';

export const label: SVGProps<SVGTextElement> = {
  fontFamily: 'inherit',
  fontSize: 10,
  fontWeight: 500,
  letterSpacing: 0.4,
  fill: TEXT,
  fillOpacity: 0.9,
};
export const caption: SVGProps<SVGTextElement> = { ...label, fontSize: 9, fill: TEXT_MUTED, fillOpacity: 1 };
export const mono: SVGProps<SVGTextElement> = { ...label, fontFamily: 'var(--font-mono), ui-monospace, monospace', fontSize: 9 };

/* Animation classes. They only run while the frame is on screen on a pointer
   device at md+ (see .cover-live rules in globals.css); static otherwise. */
export const ANIM = {
  flow: 'ca-flow',      // stroke-dashoffset drift; set strokeDasharray on the element
  pulse: 'ca-pulse',    // opacity pulse
  drift: 'ca-drift',    // horizontal translate loop (±6px)
  rise: 'ca-rise',      // vertical float loop (±4px)
  spin: 'ca-spin',      // slow rotation about the element's own centre
  scan: 'ca-scan',      // vertical sweep from top to bottom, loops
  blink: 'ca-blink',    // quick on/off, like a cursor or status dot
  grow: 'ca-grow',      // scaleX from 0 to 1 once (bars); set transform-origin via style
  travel: 'ca-travel',  // moves along a CSS offset-path set via style; hidden when idle
  draw: 'ca-draw',      // strokes draw in once; element needs pathLength={1}
} as const;

export const delay = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` });

export interface CoverProps {
  uid: string;
  title: string;
  className?: string;
}
export type CoverComponent = (props: CoverProps) => JSX.Element;

interface FrameProps extends CoverProps {
  glow?: [number, number, number];
  children: ReactNode;
}

export function CoverFrame({ uid, title, className, glow = [320, 180, 220], children }: FrameProps) {
  const ref = useRef<SVGSVGElement>(null);
  const [live, setLive] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const [gx, gy, gr] = glow;

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { rootMargin: '80px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* `slice` fills the plate by cropping whatever overflows. On a phone the
     plate is far narrower than the 16:9 artwork, so that crop threw away the
     sides and left only the middle of each scene. Below sm, fit the whole
     drawing instead and let it letterbox against the matching plate colour. */
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 640 360"
      width="100%"
      height="100%"
      preserveAspectRatio={narrow ? 'xMidYMid meet' : 'xMidYMid slice'}
      role="img"
      aria-label={title}
      className={`${live ? 'cover-live ' : ''}${className ?? ''}`.trim()}
    >
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0b0f17" />
          <stop offset="1" stopColor="#111a2b" />
        </linearGradient>
        <radialGradient id={`${uid}-glow`}>
          <stop offset="0" stopColor={ACCENT_DEEP} stopOpacity="0.14" />
          <stop offset="1" stopColor={ACCENT_DEEP} stopOpacity="0" />
        </radialGradient>
        <pattern id={`${uid}-grid`} width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M32 0H0v32" fill="none" stroke="#fff" strokeOpacity="0.035" />
        </pattern>
        <marker id={`${uid}-arrow`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" markerUnits="userSpaceOnUse" orient="auto">
          <path d="M0 0l8 4-8 4z" fill={LINE} />
        </marker>
      </defs>
      <rect width="640" height="360" fill={`url(#${uid}-bg)`} />
      <rect width="640" height="360" fill={`url(#${uid}-grid)`} />
      <circle cx={gx} cy={gy} r={gr} fill={`url(#${uid}-glow)`} />
      {children}
    </svg>
  );
}

/* Small reusable primitives so every cover shares one visual language. */
export function Panel({ x, y, w, h, r = 8, fill = NODE_FILL, stroke = LINE, ...rest }: SVGProps<SVGRectElement> & { x: number; y: number; w: number; h: number; r?: number }) {
  return <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} stroke={stroke} strokeWidth={1.25} {...rest} />;
}

export function Edge({ d, uid, dashed = false, className, style, opacity = 1 }: { d: string; uid?: string; dashed?: boolean; className?: string; style?: CSSProperties; opacity?: number }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={LINE}
      strokeWidth={1.25}
      strokeDasharray={dashed ? '4 4' : undefined}
      markerEnd={uid ? `url(#${uid}-arrow)` : undefined}
      className={className}
      style={style}
      opacity={opacity}
    />
  );
}

export function Tag({ x, y, text, tone = 'muted' }: { x: number; y: number; text: string; tone?: 'muted' | 'accent' | 'green' | 'amber' | 'rose' }) {
  const color = tone === 'accent' ? ACCENT : tone === 'green' ? GREEN : tone === 'amber' ? AMBER : tone === 'rose' ? ROSE : TEXT;
  const w = text.length * 5.6 + 12;
  return (
    <g>
      <rect x={x} y={y - 8} width={w} height={16} rx={8} fill={color} fillOpacity={0.12} stroke={color} strokeOpacity={0.35} strokeWidth={1} />
      <text x={x + w / 2} y={y + 3.5} textAnchor="middle" {...caption} fill={color} fillOpacity={0.95}>{text}</text>
    </g>
  );
}
