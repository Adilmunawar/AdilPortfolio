'use client';
import { useEffect, useRef, useState, type ReactNode, type SVGProps } from 'react';
import { ACCENT, AMBER, ANIM, GREEN, LINE, LINE_SOFT, NODE_FILL, NODE_FILL_2, TEXT, TEXT_MUTED } from './shared';

/* 240×120 glyphs for the services cards. Same vocabulary as the covers
   (panels, hairlines, one accent) at a smaller frame. Strokes are
   non-scaling so they stay 1.25px whatever width the card renders at. */

const NSS = 'non-scaling-stroke';
const cap: SVGProps<SVGTextElement> = { fontFamily: 'inherit', fontSize: 6.5, fontWeight: 500, letterSpacing: 0.2, fill: TEXT_MUTED };
const mono: SVGProps<SVGTextElement> = { fontFamily: 'var(--font-mono), ui-monospace, monospace', fontSize: 6, fontWeight: 500, fill: TEXT, fillOpacity: 0.9 };

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
  return <path d={d} fill="none" stroke={LINE} strokeWidth={1.25} strokeDasharray="3 3" markerEnd={`url(#${uid}-arrow)`} className={ANIM.flow} vectorEffect={NSS} />;
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
function Parcels({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {PARCELS.map((pts, i) => (
        <polygon key={i} points={pts} fill={i === 1 || i === 4 ? AMBER : GREEN} fillOpacity={PARCEL_ALPHA[i]} stroke={GREEN} strokeOpacity={0.6} strokeWidth={1} strokeLinejoin="round" vectorEffect={NSS} />
      ))}
    </g>
  );
}

/* ---------- 1. Satellite tile → segmentation model → parcel map ---------- */
const TILE_TONE = [GREEN, GREEN, AMBER, GREEN, GREEN, GREEN, GREEN, AMBER, AMBER, GREEN, GREEN, GREEN, GREEN, AMBER, GREEN, GREEN];
const TILE_ALPHA = [0.34, 0.22, 0.22, 0.16, 0.26, 0.4, 0.3, 0.18, 0.2, 0.24, 0.36, 0.28, 0.16, 0.26, 0.22, 0.32];

export const MlGlyph: GlyphComponent = ({ uid, className }) => (
  <Frame uid={uid} className={className} title="Satellite tile through a segmentation model to a parcel map">
    <Chip x={42} y={13} text="Sentinel-2" />
    <Box x={12} y={22} w={60} h={60} />
    {TILE_ALPHA.map((a, k) => (
      <rect key={k} x={16 + (k % 4) * 13} y={26 + Math.floor(k / 4) * 13} width={11} height={11} rx={1.5} fill={TILE_TONE[k]} fillOpacity={a} />
    ))}
    <Caption x={42} y={97} text="Satellite tile" />
    <Flow uid={uid} d="M72 52H86" />

    <Chip x={120} y={13} text="HRNet · U-Net" tone="accent" />
    <Box x={90} y={22} w={60} h={60} />
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={96 + i * 9} y={30 + i * 12} width={48 - i * 9} height={5} rx={1.5} fill={ACCENT} fillOpacity={0.65 - i * 0.13} />
    ))}
    <g className={ANIM.flow} fill="none" stroke={ACCENT} strokeOpacity={0.55} strokeWidth={1} strokeDasharray="2 2">
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M128 ${35 + i * 12}L136 ${42 + i * 12}M128 ${42 + i * 12}L136 ${35 + i * 12}`} vectorEffect={NSS} />
      ))}
    </g>
    <Caption x={120} y={97} text="Segmentation model" />
    <Flow uid={uid} d="M150 52H164" />

    <Chip x={198} y={13} text="GIS polygons" tone="green" />
    <Box x={168} y={22} w={60} h={60} />
    <Parcels x={172} y={26} />
    <g className={ANIM.pulse} fill={ACCENT} stroke={ACCENT} strokeWidth={1} strokeLinejoin="round">
      <path d="M196 46L194 66L212 66" fill="none" vectorEffect={NSS} />
      <circle cx={196} cy={46} r={1.6} />
      <circle cx={194} cy={66} r={1.6} />
      <circle cx={212} cy={66} r={1.6} />
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
const TOOLS: [string, number][] = [['docs', 174], ['db', 190.5], ['api', 207]];

export const RagGlyph: GlyphComponent = ({ uid, className }) => (
  <Frame uid={uid} className={className} title="Documents indexed into a vector store and queried by an agent with tools">
    <Sheet x={24} y={22} />
    <Sheet x={18} y={27} />
    <Sheet x={12} y={32} lines={4} />
    <Caption x={34} y={97} text="Your documents" />
    <Flow uid={uid} d="M58 52H86" />

    <Chip x={120} y={13} text="pgvector" tone="accent" />
    <Box x={90} y={22} w={60} h={60} />
    {POINTS.map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={1.6} fill={TEXT_MUTED} fillOpacity={0.7} />
    ))}
    {NEAR.map(([x, y], i) => (
      <line key={i} x1={132} y1={36} x2={x} y2={y} stroke={ACCENT} strokeOpacity={0.45} strokeWidth={1} vectorEffect={NSS} />
    ))}
    {NEAR.map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={1.8} fill={ACCENT} />
    ))}
    <circle cx={132} cy={36} r={2.4} fill={ACCENT} />
    <circle className={ANIM.pulse} cx={132} cy={36} r={10} fill="none" stroke={ACCENT} strokeOpacity={0.6} strokeWidth={1} strokeDasharray="2 2" vectorEffect={NSS} />
    <text x={120} y={77} textAnchor="middle" {...mono} fill={TEXT_MUTED}>hybrid · top-k</text>
    <Caption x={120} y={97} text="Vector index" />
    <Flow uid={uid} d="M150 52H164" />

    <Chip x={198} y={13} text="MCP tools" tone="accent" />
    <Box x={168} y={22} w={60} h={60} />
    <Box x={176} y={28} w={44} h={14} r={3} fill={NODE_FILL_2} />
    <circle className={ANIM.blink} cx={182} cy={35} r={1.6} fill={GREEN} />
    <text x={200} y={37.2} textAnchor="middle" {...mono}>agent</text>
    <path d="M198 42V50H181.5V56M198 42V56M198 42V50H214.5V56" fill="none" stroke={LINE} strokeWidth={1.25} vectorEffect={NSS} />
    {TOOLS.map(([t, x]) => (
      <g key={t}>
        <Box x={x} y={56} w={15} h={14} r={2.5} fill={NODE_FILL_2} />
        <text x={x + 7.5} y={65.2} textAnchor="middle" {...mono} fill={TEXT_MUTED}>{t}</text>
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
    <Parcels x={46} y={32} s={0.75} />
    {[30, 45, 60].map((y, i) => (
      <g key={y}>
        <rect x={90} y={y} width={17} height={13} rx={2} fill={NODE_FILL} />
        <rect x={93} y={y + 3} width={6} height={2} rx={1} fill={TEXT_MUTED} fillOpacity={0.6} />
        <rect x={93} y={y + 8} width={[11, 7, 12][i]} height={2} rx={1} fill={ACCENT} fillOpacity={0.7} />
      </g>
    ))}
    <Caption x={64} y={92} text="Next.js web app" />

    <Box x={124} y={42} w={30} h={64} r={5} />
    <Hair x1={134} y1={46.5} x2={144} y2={46.5} soft />
    <rect x={128} y={51} width={22} height={3} rx={1.5} fill={NODE_FILL_2} />
    <rect x={128} y={57} width={22} height={20} rx={2} fill={NODE_FILL_2} />
    <Parcels x={129} y={58} s={0.35} />
    {[82, 87, 92].map((y) => (
      <Hair key={y} x1={128} y1={y} x2={y === 92 ? 142 : 150} y2={y} />
    ))}
    <Hair x1={134} y1={101} x2={144} y2={101} />
    <Caption x={139} y={116} text="Responsive on mobile" />

    <Flow uid={uid} d="M116 36H180" />
    <Flow uid={uid} d="M154 70H180" />
    <Chip x={202} y={13} text="Supabase" tone="accent" />
    <Cylinder cx={202} cy={40} rx={18} ry={5} h={34} />
    {[52, 59, 66].map((y) => (
      <Hair key={y} x1={192} y1={y} x2={212} y2={y} soft />
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
    <path d="M30 51V43M30 51L36 55" fill="none" stroke={TEXT} strokeWidth={1.25} strokeLinecap="round" vectorEffect={NSS} />
    <circle cx={30} cy={51} r={1.3} fill={ACCENT} />
    <Caption x={30} y={94} text="Scheduler" />
    <Flow uid={uid} d="M50 51H68" />

    <Chip x={90} y={13} text="Docker" tone="accent" />
    <Box x={70} y={26} w={40} h={50} />
    {CONTAINERS.map(([x, y], i) => (
      <g key={i}>
        <Box x={x} y={y} w={13} h={13} r={2} fill={NODE_FILL_2} />
        <circle className={i === 1 ? ANIM.blink : undefined} cx={x + 10} cy={y + 3} r={1.2} fill={GREEN} fillOpacity={i === 3 ? 0.35 : 1} />
      </g>
    ))}
    <Caption x={90} y={94} text="Containers" />
    <Flow uid={uid} d="M110 51H128" />

    <Chip x={150} y={13} text="PostGIS" tone="green" />
    <Box x={130} y={26} w={40} h={50} />
    <Cylinder cx={150} cy={38} rx={14} ry={4} h={26} />
    <polygon points="142,48 150,45 158,49 156,58 145,59" fill={GREEN} fillOpacity={0.18} stroke={GREEN} strokeOpacity={0.7} strokeWidth={1} strokeLinejoin="round" vectorEffect={NSS} />
    <Caption x={150} y={94} text="Spatial database" />
    <Flow uid={uid} d="M170 51H188" />

    <Chip x={210} y={13} text="Monitoring" />
    <Box x={190} y={26} w={40} h={50} />
    <rect x={196} y={32} width={16} height={3} rx={1.5} fill={NODE_FILL_2} />
    {BARS.map((h, i) => (
      <rect key={i} x={197 + i * 6} y={68 - h} width={4} height={h} rx={1} fill={ACCENT} fillOpacity={0.35 + i * 0.12} />
    ))}
    <Hair x1={196} y1={68} x2={226} y2={68} soft />
    <Caption x={210} y={94} text="Dashboard" />
  </Frame>
);

export const serviceGlyphs = { ml: MlGlyph, rag: RagGlyph, product: ProductGlyph, data: DataGlyph } as const;
export type ServiceGlyphKey = keyof typeof serviceGlyphs;
