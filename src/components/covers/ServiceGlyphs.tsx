'use client';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type SVGProps } from 'react';
import { ACCENT, AMBER, ANIM, GREEN, LINE, LINE_SOFT, NODE_FILL, NODE_FILL_2, TEXT, TEXT_MUTED } from './shared';

/* 240×120 glyphs for the services cards. Same vocabulary as the covers
   (panels, hairlines, one accent) at a smaller frame. Strokes are
   non-scaling so they stay 1.25px whatever width the card renders at. */

const NSS = 'non-scaling-stroke';
const cap: SVGProps<SVGTextElement> = { fontFamily: 'inherit', fontSize: 6.5, fontWeight: 500, letterSpacing: 0.2, fill: TEXT_MUTED };
const mono: SVGProps<SVGTextElement> = { fontFamily: 'var(--font-mono), ui-monospace, monospace', fontSize: 6, fontWeight: 500, fill: TEXT, fillOpacity: 0.9 };

/* One 8s loop per glyph. sg-go moves a pulse along its offset path in 0.48s,
   sg-go-long in 0.96s (edges about twice as long), sg-work breathes for 1.6s
   while a stage is active, sg-in is a one shot fade for produced output. */
const SG_CSS = `
.sg-go,.sg-go-long,.sg-work{opacity:0}
@media (hover: hover) and (min-width: 768px){
.cover-live .sg-go{animation:sg-go 8s linear infinite}
.cover-live .sg-go-long{animation:sg-go-long 8s linear infinite}
.cover-live .sg-work{animation:sg-work 8s ease-in-out infinite}
.cover-live .sg-in{animation:sg-in .5s cubic-bezier(.16,1,.3,1) both}
}
@media (prefers-reduced-motion: reduce){.sg-go,.sg-go-long,.sg-work,.sg-in{animation:none !important}}
@keyframes sg-go{0%{offset-distance:0%;opacity:0}1%,5%{opacity:1}6%,100%{offset-distance:100%;opacity:0}}
@keyframes sg-go-long{0%{offset-distance:0%;opacity:0}1%,11%{opacity:1}12%,100%{offset-distance:100%;opacity:0}}
@keyframes sg-work{0%,20%,100%{opacity:0}3%,17%{opacity:1}10%{opacity:.3}}
@keyframes sg-in{from{opacity:0}to{opacity:1}}
`;

const at = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` });

export interface GlyphProps {
  uid: string;
  className?: string;
}
export type GlyphComponent = (props: GlyphProps) => JSX.Element;

function useLive() {
  const ref = useRef<SVGSVGElement>(null);
  const [live, setLive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { rootMargin: '80px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, live };
}

function Frame({ uid, title, className, children }: GlyphProps & { title: string; children: ReactNode }) {
  const { ref, live } = useLive();
  return (
    <svg
      ref={ref}
      viewBox="0 0 240 120"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={title}
      className={`${live ? 'cover-live ' : ''}${className ?? ''}`.trim()}
    >
      <defs>
        <marker id={`${uid}-arrow`} viewBox="0 0 6 6" refX="5" refY="3" markerWidth="5" markerHeight="5" markerUnits="userSpaceOnUse" orient="auto">
          <path d="M0 0l6 3-6 3z" fill={LINE} />
        </marker>
      </defs>
      <style dangerouslySetInnerHTML={{ __html: SG_CSS }} />
      {children}
    </svg>
  );
}

type BoxProps = Omit<SVGProps<SVGRectElement>, 'x' | 'y' | 'width' | 'height'> & { x: number; y: number; w: number; h: number; r?: number };
function Box({ x, y, w, h, r = 4, fill = NODE_FILL, stroke = LINE, ...rest }: BoxProps) {
  return <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} stroke={stroke} strokeWidth={1.25} vectorEffect={NSS} {...rest} />;
}

function Hair({ x1, y1, x2, y2, soft = false }: { x1: number; y1: number; x2: number; y2: number; soft?: boolean }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={soft ? LINE_SOFT : LINE} strokeWidth={1.25} vectorEffect={NSS} />;
}

function Flow({ uid, d }: { uid: string; d: string }) {
  return <path d={d} fill="none" stroke={LINE} strokeWidth={1.25} strokeDasharray="3 3" markerEnd={`url(#${uid}-arrow)`} vectorEffect={NSS} />;
}

function Pulse({ x, y, path, ms, long = false, tone = ACCENT }: { x: number; y: number; path: string; ms: number; long?: boolean; tone?: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={2.4} fill={tone} className={long ? 'sg-go-long' : 'sg-go'} style={{ offsetPath: `path("${path}")`, offsetRotate: '0deg', animationDelay: `${ms}ms` }} />
    </g>
  );
}

function Halo({ cx, cy, r = 3.2, ms, tone = GREEN }: { cx: number; cy: number; r?: number; ms: number; tone?: string }) {
  return <circle cx={cx} cy={cy} r={r} fill="none" stroke={tone} strokeWidth={1} className="sg-work" style={at(ms)} vectorEffect={NSS} />;
}

function Chip({ x, y, text, tone = 'muted' }: { x: number; y: number; text: string; tone?: 'muted' | 'accent' | 'green' }) {
  const color = tone === 'accent' ? ACCENT : tone === 'green' ? GREEN : TEXT;
  const w = text.length * 3.6 + 8;
  return (
    <g>
      <rect x={x - w / 2} y={y - 5.5} width={w} height={11} rx={5.5} fill={color} fillOpacity={0.12} stroke={color} strokeOpacity={0.35} strokeWidth={1} vectorEffect={NSS} />
      <text x={x} y={y + 2.2} textAnchor="middle" {...mono} fill={color} fillOpacity={0.95}>{text}</text>
    </g>
  );
}

function Caption({ x, y, text }: { x: number; y: number; text: string }) {
  return <text x={x} y={y} textAnchor="middle" {...cap}>{text}</text>;
}

function Cylinder({ cx, cy, rx, ry, h }: { cx: number; cy: number; rx: number; ry: number; h: number }) {
  return (
    <g>
      <path d={`M${cx - rx} ${cy}v${h}a${rx} ${ry} 0 0 0 ${rx * 2} 0v${-h}z`} fill={NODE_FILL} stroke={LINE} strokeWidth={1.25} vectorEffect={NSS} />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={NODE_FILL_2} stroke={LINE} strokeWidth={1.25} vectorEffect={NSS} />
    </g>
  );
}

/* Five parcels tiling a 52×52 box; reused as tile, map and phone map. */
const PARCELS = ['0,0 26,0 24,20 0,18', '26,0 52,0 52,18 24,20', '0,18 24,20 22,40 0,38', '24,20 52,18 52,40 38,42 22,40', '0,38 22,40 38,42 52,40 52,52 0,52'];
const PARCEL_ALPHA = [0.3, 0.16, 0.22, 0.34, 0.14];
type ParcelAnim = { draw?: number; fade?: number };
function Parcels({ x, y, s = 1, anim = {} }: { x: number; y: number; s?: number; anim?: Record<number, ParcelAnim> }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {PARCELS.map((pts, i) => {
        const a = anim[i] ?? {};
        const draw = a.draw !== undefined;
        const poly = (
          <path
            key={i}
            d={`M${pts.replace(/ /g, 'L')}z`}
            fill={i === 1 || i === 4 ? AMBER : GREEN}
            fillOpacity={PARCEL_ALPHA[i]}
            stroke={GREEN}
            strokeOpacity={0.6}
            strokeWidth={1}
            strokeLinejoin="round"
            vectorEffect={NSS}
            pathLength={draw ? 1 : undefined}
            className={draw ? ANIM.draw : a.fade !== undefined ? 'sg-in' : undefined}
            style={draw ? at(a.draw as number) : a.fade !== undefined ? at(a.fade) : undefined}
          />
        );
        return draw && a.fade !== undefined ? <g key={i} className="sg-in" style={at(a.fade)}>{poly}</g> : poly;
      })}
    </g>
  );
}

/* ---------- 1. Satellite tile → segmentation model → parcel map ---------- */
const TILE_TONE = [GREEN, GREEN, AMBER, GREEN, GREEN, GREEN, GREEN, AMBER, AMBER, GREEN, GREEN, GREEN, GREEN, AMBER, GREEN, GREEN];
const TILE_ALPHA = [0.34, 0.22, 0.22, 0.16, 0.26, 0.4, 0.3, 0.18, 0.2, 0.24, 0.36, 0.28, 0.16, 0.26, 0.22, 0.32];
const SKIPS = [0, 1, 2].map((i) => `M128 ${35 + i * 12}L136 ${42 + i * 12}M128 ${42 + i * 12}L136 ${35 + i * 12}`);

export const MlGlyph: GlyphComponent = ({ uid, className }) => (
  <Frame uid={uid} className={className} title="Satellite tile through a segmentation model to a parcel map">
    <Chip x={42} y={13} text="Sentinel-2" />
    <Box x={12} y={22} w={60} h={60} />
    {TILE_ALPHA.map((a, k) => (
      <rect key={k} x={16 + (k % 4) * 13} y={26 + Math.floor(k / 4) * 13} width={11} height={11} rx={1.5} fill={TILE_TONE[k]} fillOpacity={a} className="sg-in" style={at(100 + Math.floor(k / 4) * 150)} />
    ))}
    <Caption x={42} y={97} text="Satellite tile" />
    <Flow uid={uid} d="M72 52H86" />
    <Pulse x={72} y={52} path="M0 0 L14 0" ms={1100} />

    <Chip x={120} y={13} text="HRNet · U-Net" tone="accent" />
    <Box x={90} y={22} w={60} h={60} />
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={96 + i * 9} y={30 + i * 12} width={48 - i * 9} height={5} rx={1.5} fill={ACCENT} fillOpacity={0.65 - i * 0.13} />
    ))}
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={96 + i * 9} y={30 + i * 12} width={48 - i * 9} height={5} rx={1.5} fill={ACCENT} fillOpacity={0.95} className="sg-work" style={at(1600 + i * 500)} />
    ))}
    <g fill="none" stroke={ACCENT} strokeOpacity={0.55} strokeWidth={1} strokeDasharray="2 2">
      {SKIPS.map((d, i) => (
        <path key={i} d={d} vectorEffect={NSS} />
      ))}
    </g>
    <g fill="none" stroke={ACCENT} strokeWidth={1} className="sg-work" style={at(3000)}>
      {SKIPS.map((d, i) => (
        <path key={i} d={d} vectorEffect={NSS} />
      ))}
    </g>
    <Caption x={120} y={97} text="Segmentation model" />
    <Flow uid={uid} d="M150 52H164" />
    <Pulse x={150} y={52} path="M0 0 L14 0" ms={4700} />

    <Chip x={198} y={13} text="GIS polygons" tone="green" />
    <Box x={168} y={22} w={60} h={60} />
    <g className="sg-in" style={at(5200)}>
      <Parcels x={172} y={26} anim={{ 0: { draw: 5200 }, 1: { draw: 5350 }, 2: { draw: 5500 }, 3: { draw: 5650 }, 4: { draw: 5800 } }} />
    </g>
    <g fill={ACCENT} stroke={ACCENT} strokeWidth={1} strokeLinejoin="round">
      <path d="M196 46L194 66L212 66" fill="none" pathLength={1} className={ANIM.draw} style={at(6600)} vectorEffect={NSS} />
      <circle cx={196} cy={46} r={1.6} className="sg-in" style={at(6600)} />
      <circle cx={194} cy={66} r={1.6} className="sg-in" style={at(7000)} />
      <circle cx={212} cy={66} r={1.6} className="sg-in" style={at(7400)} />
    </g>
    <Caption x={198} y={97} text="Parcel map" />
  </Frame>
);

/* ---------- 2. Documents → vector index → agent with tools ---------- */
function Sheet({ x, y, lines = 0 }: { x: number; y: number; lines?: number }) {
  const w = 32;
  const h = 40;
  const f = 8;
  return (
    <g>
      <path d={`M${x} ${y}h${w - f}l${f} ${f}v${h - f}h${-w}z`} fill={NODE_FILL} stroke={LINE} strokeWidth={1.25} strokeLinejoin="round" vectorEffect={NSS} />
      <path d={`M${x + w - f} ${y}v${f}h${f}`} fill="none" stroke={LINE} strokeWidth={1.25} strokeLinejoin="round" vectorEffect={NSS} />
      {Array.from({ length: lines }, (_, k) => (
        <Hair key={k} x1={x + 6} y1={y + 15 + k * 6} x2={x + w - (k === lines - 1 ? 14 : 6)} y2={y + 15 + k * 6} soft />
      ))}
    </g>
  );
}

const POINTS: [number, number][] = [[100, 34], [108, 30], [112, 44], [104, 50], [98, 60], [110, 64], [118, 54], [126, 66], [140, 60], [144, 50], [118, 36]];
const NEAR: [number, number][] = [[124, 34], [130, 28], [136, 40], [142, 32]];
const TOOLS: [string, number, string, boolean, number][] = [
  ['docs', 174, 'M0 0 V8 H-16.5 V14', true, 5600],
  ['db', 190.5, 'M0 0 V14', false, 5900],
  ['api', 207, 'M0 0 V8 H16.5 V14', true, 6200],
];

export const RagGlyph: GlyphComponent = ({ uid, className }) => (
  <Frame uid={uid} className={className} title="Documents indexed into a vector store and queried by an agent with tools">
    <Sheet x={24} y={22} />
    <Sheet x={18} y={27} />
    <Sheet x={12} y={32} lines={4} />
    <Caption x={34} y={97} text="Your documents" />
    <Flow uid={uid} d="M58 52H86" />
    {[0, 400, 800].map((ms) => (
      <Pulse key={ms} x={58} y={52} path="M0 0 L28 0" ms={ms} long />
    ))}

    <Chip x={120} y={13} text="pgvector" tone="accent" />
    <Box x={90} y={22} w={60} h={60} />
    {POINTS.map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={1.6} fill={TEXT_MUTED} fillOpacity={0.7} className="sg-in" style={at(1000 + i * 120)} />
    ))}
    {NEAR.map(([x, y], i) => (
      <path key={i} d={`M132 36L${x} ${y}`} stroke={ACCENT} strokeOpacity={0.45} strokeWidth={1} pathLength={1} className={ANIM.draw} style={at(3300 + i * 150)} vectorEffect={NSS} />
    ))}
    {NEAR.map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={1.8} fill={ACCENT} className="sg-in" style={at(3500 + i * 150)} />
    ))}
    <circle cx={132} cy={36} r={2.4} fill={ACCENT} className="sg-in" style={at(2900)} />
    <circle cx={132} cy={36} r={10} fill="none" stroke={ACCENT} strokeOpacity={0.35} strokeWidth={1} strokeDasharray="2 2" vectorEffect={NSS} />
    <Halo cx={132} cy={36} r={10} ms={3000} tone={ACCENT} />
    <text x={120} y={77} textAnchor="middle" {...mono} fill={TEXT_MUTED}>hybrid · top-k</text>
    <Caption x={120} y={97} text="Vector index" />
    <Flow uid={uid} d="M150 52H164" />
    <Pulse x={150} y={52} path="M0 0 L14 0" ms={4600} />

    <Chip x={198} y={13} text="MCP tools" tone="accent" />
    <Box x={168} y={22} w={60} h={60} />
    <Box x={176} y={28} w={44} h={14} r={3} fill={NODE_FILL_2} />
    <circle cx={182} cy={35} r={1.6} fill={GREEN} />
    <Halo cx={182} cy={35} ms={5100} />
    <text x={200} y={37.2} textAnchor="middle" {...mono}>agent</text>
    <path d="M198 42V50H181.5V56M198 42V56M198 42V50H214.5V56" fill="none" stroke={LINE} strokeWidth={1.25} vectorEffect={NSS} />
    {TOOLS.map(([t, x, path, long, ms]) => (
      <g key={t}>
        <Box x={x} y={56} w={15} h={14} r={2.5} fill={NODE_FILL_2} />
        <Box x={x} y={56} w={15} h={14} r={2.5} fill={ACCENT} fillOpacity={0.18} stroke={ACCENT} className="sg-work" style={at(ms + (long ? 900 : 500))} />
        <text x={x + 7.5} y={65.2} textAnchor="middle" {...mono} fill={TEXT_MUTED}>{t}</text>
        <Pulse x={198} y={42} path={path} ms={ms} long={long} />
      </g>
    ))}
    <Caption x={198} y={97} text="Agent with tools" />
  </Frame>
);

/* ---------- 3. Browser + phone frames backed by Supabase / Postgres ---------- */
export const ProductGlyph: GlyphComponent = ({ uid, className }) => (
  <Frame uid={uid} className={className} title="Browser and phone frames backed by a Postgres database">
    <Box x={12} y={14} w={104} h={64} />
    <Hair x1={12} y1={25} x2={116} y2={25} soft />
    {[19, 24, 29].map((x) => (
      <circle key={x} cx={x} cy={19.5} r={1.3} fill={TEXT_MUTED} />
    ))}
    <rect x={36} y={16.5} width={48} height={6} rx={3} fill={NODE_FILL_2} />
    <rect x={17} y={30} width={20} height={43} rx={2} fill={NODE_FILL_2} />
    {[36, 42, 48, 54].map((y) => (
      <Hair key={y} x1={21} y1={y} x2={y === 36 ? 33 : 30} y2={y} />
    ))}
    <rect x={42} y={30} width={69} height={43} rx={2} fill={NODE_FILL_2} />
    <Parcels x={46} y={32} s={0.75} anim={{ 3: { draw: 300, fade: 300 }, 4: { fade: 5000 } }} />
    {[30, 45, 60].map((y, i) => (
      <g key={y}>
        <rect x={90} y={y} width={17} height={13} rx={2} fill={NODE_FILL} />
        <rect x={93} y={y + 3} width={6} height={2} rx={1} fill={TEXT_MUTED} fillOpacity={0.6} />
        <rect x={93} y={y + 8} width={[11, 7, 12][i]} height={2} rx={1} fill={ACCENT} fillOpacity={0.7} />
      </g>
    ))}
    <rect x={90} y={60} width={17} height={13} rx={2} fill={ACCENT} fillOpacity={0.18} stroke={ACCENT} strokeWidth={1} className="sg-work" style={at(5800)} vectorEffect={NSS} />
    <Caption x={64} y={92} text="Next.js web app" />

    <Box x={124} y={42} w={30} h={64} r={5} />
    <Hair x1={134} y1={46.5} x2={144} y2={46.5} soft />
    <rect x={128} y={51} width={22} height={3} rx={1.5} fill={NODE_FILL_2} />
    <rect x={128} y={57} width={22} height={20} rx={2} fill={NODE_FILL_2} />
    <Parcels x={129} y={58} s={0.35} anim={{ 3: { fade: 2500 }, 4: { draw: 3400, fade: 3400 } }} />
    {[82, 87, 92].map((y) => (
      <Hair key={y} x1={128} y1={y} x2={y === 92 ? 142 : 150} y2={y} />
    ))}
    <Hair x1={134} y1={101} x2={144} y2={101} />
    <Caption x={139} y={116} text="Responsive on mobile" />

    <Flow uid={uid} d="M116 36H180" />
    <Flow uid={uid} d="M154 70H180" />
    <Pulse x={116} y={36} path="M0 0 L64 0" ms={1000} long />
    <Pulse x={154} y={70} path="M0 0 L26 0" ms={4000} />
    <Pulse x={116} y={36} path="M0 0 L64 0" ms={6200} long />
    <Chip x={202} y={13} text="Supabase" tone="accent" />
    <Cylinder cx={202} cy={40} rx={18} ry={5} h={34} />
    {[52, 59, 66].map((y) => (
      <Hair key={y} x1={192} y1={y} x2={212} y2={y} soft />
    ))}
    {[[52, 2000], [59, 4500], [66, 7200]].map(([y, ms]) => (
      <line key={y} x1={192} y1={y} x2={212} y2={y} stroke={ACCENT} strokeOpacity={0.8} strokeWidth={1.25} className="sg-in" style={at(ms)} vectorEffect={NSS} />
    ))}
    <Caption x={202} y={92} text="Postgres" />
  </Frame>
);

/* ---------- 4. Scheduler → containers → PostGIS → dashboard ---------- */
const CONTAINERS: [number, number][] = [[76, 33], [93, 33], [76, 50], [93, 50]];
const BARS = [10, 16, 12, 20, 24];

export const DataGlyph: GlyphComponent = ({ uid, className }) => (
  <Frame uid={uid} className={className} title="Scheduler, containers, PostGIS and a dashboard in a pipeline">
    <Chip x={30} y={13} text="Airflow" tone="accent" />
    <Box x={10} y={26} w={40} h={50} />
    <circle cx={30} cy={51} r={13} fill={NODE_FILL_2} stroke={LINE} strokeWidth={1.25} vectorEffect={NSS} />
    {[0, 90, 180, 270].map((a) => (
      <line key={a} x1={30} y1={40} x2={30} y2={42} transform={`rotate(${a} 30 51)`} stroke={TEXT_MUTED} strokeWidth={1} vectorEffect={NSS} />
    ))}
    <path d="M30 51L36 55" fill="none" stroke={TEXT} strokeWidth={1.25} strokeLinecap="round" vectorEffect={NSS} />
    <path d="M30 51V43" fill="none" stroke={TEXT} strokeWidth={1.25} strokeLinecap="round" className={ANIM.spin} style={{ transformBox: 'view-box', transformOrigin: '30px 51px' }} vectorEffect={NSS} />
    <circle cx={30} cy={51} r={1.3} fill={ACCENT} />
    <Halo cx={30} cy={51} r={3.4} ms={0} tone={ACCENT} />
    <Caption x={30} y={94} text="Scheduler" />
    <Flow uid={uid} d="M50 51H68" />
    <Pulse x={50} y={51} path="M0 0 L18 0" ms={300} />

    <Chip x={90} y={13} text="Docker" tone="accent" />
    <Box x={70} y={26} w={40} h={50} />
    {CONTAINERS.map(([x, y], i) => (
      <g key={i}>
        <Box x={x} y={y} w={13} h={13} r={2} fill={NODE_FILL_2} />
        <circle cx={x + 10} cy={y + 3} r={1.2} fill={GREEN} />
        <Halo cx={x + 10} cy={y + 3} r={2.8} ms={900 + i * 400} />
      </g>
    ))}
    <Caption x={90} y={94} text="Containers" />
    <Flow uid={uid} d="M110 51H128" />
    <Pulse x={110} y={51} path="M0 0 L18 0" ms={3000} />
    <Pulse x={110} y={51} path="M0 0 L18 0" ms={3400} />

    <Chip x={150} y={13} text="PostGIS" tone="green" />
    <Box x={130} y={26} w={40} h={50} />
    <Cylinder cx={150} cy={38} rx={14} ry={4} h={26} />
    <g className="sg-in" style={at(3500)}>
      <path d="M142 48L150 45L158 49L156 58L145 59z" fill={GREEN} fillOpacity={0.18} stroke={GREEN} strokeOpacity={0.7} strokeWidth={1} strokeLinejoin="round" pathLength={1} className={ANIM.draw} style={at(3500)} vectorEffect={NSS} />
    </g>
    <Caption x={150} y={94} text="Spatial database" />
    <Flow uid={uid} d="M170 51H188" />
    <Pulse x={170} y={51} path="M0 0 L18 0" ms={5600} />

    <Chip x={210} y={13} text="Monitoring" />
    <Box x={190} y={26} w={40} h={50} />
    <rect x={196} y={32} width={16} height={3} rx={1.5} fill={NODE_FILL_2} />
    {BARS.map((h, i) => (
      <path key={i} d={`M${199 + i * 6} 68V${68 - h}`} stroke={ACCENT} strokeOpacity={0.35 + i * 0.12} strokeWidth={4} pathLength={1} className={ANIM.draw} style={at(6100 + i * 200)} />
    ))}
    <Hair x1={196} y1={68} x2={226} y2={68} soft />
    <Caption x={210} y={94} text="Dashboard" />
  </Frame>
);

export const serviceGlyphs = { ml: MlGlyph, rag: RagGlyph, product: ProductGlyph, data: DataGlyph } as const;
export type ServiceGlyphKey = keyof typeof serviceGlyphs;
