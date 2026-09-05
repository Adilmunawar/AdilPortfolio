'use client';
import type { CSSProperties } from 'react';
import { ACCENT, AMBER, ANIM, caption, CoverFrame, Edge, GREEN, label, LINE, LINE_SOFT, mono, NODE_FILL, NODE_FILL_2, Panel, ROSE, Tag, TEXT_MUTED, type CoverComponent } from '../shared';

const SLUG = 'hrnet-kishtwar-boundaries';
const INK = '#0b0f17';
const PAPER = '#f2f4f8';

/* Ten terraces tiling a 128x128 box along a wavy central divide. */
const TERRACES = [
  '6,6 70,4 66,28 8,26',
  '70,4 122,8 120,30 66,28',
  '8,26 66,28 60,52 6,50',
  '66,28 120,30 118,54 60,52',
  '6,50 60,52 56,76 8,74',
  '60,52 118,54 122,80 56,76',
  '8,74 56,76 52,100 6,98',
  '56,76 122,80 118,102 52,100',
  '6,98 52,100 56,122 8,122',
  '52,100 118,102 120,122 56,122',
];
const TERRACE_TONES = [GREEN, AMBER, AMBER, GREEN, GREEN, AMBER, AMBER, GREEN, GREEN, AMBER];
const TERRACE_ALPHA = [0.3, 0.18, 0.2, 0.34, 0.16, 0.26, 0.3, 0.2, 0.24, 0.18];
const CENTROIDS: [number, number][] = [[37, 16], [95, 17], [35, 39], [91, 41], [32, 63], [89, 65], [30, 87], [87, 89], [30, 110], [86, 111]];
const VERTICES = Array.from(new Set(TERRACES.flatMap((p) => p.split(' ')))).map((v) => v.split(',').map(Number) as [number, number]);

const terracePath = (pts: string, ox: number, oy: number, s: number) =>
  pts.split(' ').map((p, i) => {
    const [x, y] = p.split(',').map(Number);
    return `${i ? 'L' : 'M'}${ox + x * s} ${oy + y * s}`;
  }).join('') + 'Z';

const pick = <T,>(v: T | T[], i: number): T => (Array.isArray(v) ? v[i % v.length] : v) as T;

interface TerracesProps {
  x: number; y: number; s?: number;
  fill?: string | string[]; fillOpacity?: number | number[];
  stroke?: string; strokeOpacity?: number; strokeWidth?: number;
}
function Terraces({ x, y, s = 1, fill = 'none', fillOpacity = 0.2, stroke = 'none', strokeOpacity = 1, strokeWidth = 1.25 }: TerracesProps) {
  return (
    <g stroke={stroke} strokeOpacity={strokeOpacity} strokeWidth={strokeWidth} strokeLinejoin="round">
      {TERRACES.map((pts, i) => (
        <path key={i} d={terracePath(pts, x, y, s)} fill={pick(fill, i)} fillOpacity={pick(fillOpacity, i)} />
      ))}
    </g>
  );
}

/* Terrace outlines that draw themselves in, one after another. */
function DrawnTerraces({ x, y, s = 1, stroke = ACCENT, step = 120 }: { x: number; y: number; s?: number; stroke?: string; step?: number }) {
  return (
    <g fill="none" stroke={stroke} strokeWidth={1.5} strokeLinejoin="round">
      {TERRACES.map((pts, i) => (
        <path key={i} d={terracePath(pts, x, y, s)} pathLength={1} className={ANIM.draw} style={{ animationDelay: `${i * step}ms` }} />
      ))}
    </g>
  );
}

const travel = (path: string, delayMs: number): CSSProperties => ({
  offsetPath: `path("${path}")`,
  offsetRotate: '0deg',
  animationDelay: `${delayMs}ms`,
});

function Pulse({ x, y, path, delayMs, tone = ACCENT }: { x: number; y: number; path: string; delayMs: number; tone?: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className={ANIM.travel} style={travel(path, delayMs)}>
        <circle r={2.4} fill={tone} />
        <circle r={5} fill={tone} fillOpacity={0.25} />
      </g>
    </g>
  );
}

/* Four HRNet streams as horizontal bars; each lower stream starts one stage later. */
interface StreamsProps { rows: number[]; starts: number[]; end: number; uid: string; res?: boolean }
function StreamBars({ rows, starts, end, res }: StreamsProps) {
  const crossings: string[] = [];
  starts.slice(1).forEach((sx, k) => {
    for (let j = 0; j <= k; j++) {
      crossings.push(`M${sx - 10} ${rows[j] + 5}L${sx + 10} ${rows[j + 1] - 5}`);
      if (j > 0) crossings.push(`M${sx - 10} ${rows[j] - 5}L${sx + 10} ${rows[j - 1] + 5}`);
    }
  });
  const names = ['1/4', '1/8', '1/16', '1/32'];
  return (
    <g>
      {rows.map((y, i) => (
        <rect key={y} x={starts[i]} y={y - 5} width={end - starts[i]} height={10} rx={3} fill={ACCENT} fillOpacity={0.6 - i * 0.12} />
      ))}
      <g className={ANIM.flow} fill="none" stroke={ACCENT} strokeOpacity={0.55} strokeWidth={1.25} strokeDasharray="3 3">
        {crossings.map((d) => <path key={d} d={d} />)}
      </g>
      {res && rows.map((y, i) => (
        <text key={y} {...mono} x={starts[i] + 14} y={y - 9}>{names[i]}</text>
      ))}
      {rows.map((y, i) => (
        <Pulse key={y} x={starts[i]} y={y} path={`M0 0 L${end - starts[i]} 0`} delayMs={i * 350} />
      ))}
    </g>
  );
}

/* Figure 1: input tile -> four resolution streams with exchange units -> concat head -> boundary map. */
const ROWS = [96, 140, 184, 228];
const STARTS = [196, 260, 324, 388];
const END = 452;

const Streams: CoverComponent = ({ uid, title, className }) => (
  <CoverFrame uid={uid} title={title} className={className} glow={[324, 160, 220]}>
    <defs>
      <clipPath id={`${uid}-in`}><rect x={32} y={64} width={128} height={128} rx={8} /></clipPath>
    </defs>
    <text {...caption} x={32} y={44}>Input tile</text>
    <text {...caption} x={324} y={44} textAnchor="middle">HRNet-W48: parallel streams, fused at every stage</text>
    <text {...caption} x={624} y={44} textAnchor="end">Boundary map</text>

    <Panel x={32} y={64} w={128} h={128} />
    <g clipPath={`url(#${uid}-in)`}>
      <Terraces x={32} y={64} fill={TERRACE_TONES} fillOpacity={TERRACE_ALPHA} stroke={INK} strokeOpacity={0.9} strokeWidth={1} />
      <g className={ANIM.scan} style={{ transformOrigin: '96px 64px' }}>
        <rect x={33} y={66} width={126} height={3} fill={ACCENT} fillOpacity={0.55} />
      </g>
    </g>
    <text {...caption} x={32} y={212}>orthorectified, 4 bands</text>

    <Edge d="M160 96 L190 96" uid={uid} />

    {STARTS.slice(1).map((x) => (
      <path key={x} d={`M${x} 78 V246`} stroke={LINE_SOFT} strokeWidth={1} strokeDasharray="2 4" />
    ))}
    {['stage 1', 'stage 2', 'stage 3', 'stage 4'].map((s, i) => (
      <text key={s} {...mono} x={(STARTS[i] + (STARTS[i + 1] ?? END)) / 2} y={262} textAnchor="middle" fill={TEXT_MUTED}>{s}</text>
    ))}
    <StreamBars rows={ROWS} starts={STARTS} end={END} uid={uid} res />
    <Pulse x={250} y={101} path="M0 0 L20 34" delayMs={700} tone={AMBER} />
    <Pulse x={314} y={179} path="M0 0 L20 -34" delayMs={1100} tone={GREEN} />

    <rect x={452} y={86} width={8} height={152} rx={2} fill={ACCENT} fillOpacity={0.35} stroke={LINE} strokeWidth={1} />
    <text {...mono} x={456} y={78} textAnchor="middle" fill={TEXT_MUTED}>concat</text>
    <Edge d="M460 128 L492 128" uid={uid} />
    <text {...mono} x={476} y={118} textAnchor="middle" fill={TEXT_MUTED}>up 4x</text>

    <Panel x={496} y={64} w={128} h={128} fill={NODE_FILL_2} />
    <Terraces x={496} y={64} stroke={LINE_SOFT} strokeWidth={1} />
    <DrawnTerraces x={496} y={64} />
    <text {...caption} x={624} y={212} textAnchor="end">per-pixel boundary probability</text>

    <Tag x={32} y={300} text="Full-res stream kept end to end" tone="accent" />
    <Tag x={232} y={300} text="Fusion at every stage" />
    <Tag x={378} y={300} text="Output at 1/4, upsampled" />
  </CoverFrame>
);

/* Figure 2: a tile sliding over the raster with an overlap band, the ramp weights, and the seam before and after blending. */
const Tiling: CoverComponent = ({ uid, title, className }) => {
  const strips = Array.from({ length: 9 }, (_, i) => 80 + i * 26);
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[208, 180, 230]}>
      <defs>
        <clipPath id={`${uid}-raster`}><rect x={32} y={64} width={352} height={232} rx={8} /></clipPath>
      </defs>
      <text {...caption} x={32} y={44}>Region raster, read window by window</text>
      <text {...caption} x={608} y={44} textAnchor="end">Blend weights and the seam</text>

      <Panel x={32} y={64} w={352} h={232} />
      <g clipPath={`url(#${uid}-raster)`} fill="none" stroke={GREEN} strokeOpacity={0.35} strokeWidth={1}>
        {strips.map((y) => <path key={y} d={`M32 ${y} C120 ${y - 8} 200 ${y + 8} 384 ${y - 4}`} />)}
        {[110, 200, 290].map((x) => <path key={x} d={`M${x} 64 C${x + 6} 140 ${x - 6} 220 ${x} 296`} />)}
      </g>
      <g stroke={LINE_SOFT} strokeWidth={1}>
        {[88, 168, 248, 328].map((x) => <path key={x} d={`M${x} 64 V296`} />)}
        {[120, 200].map((y) => <path key={y} d={`M32 ${y} H384`} />)}
      </g>

      <rect x={64} y={96} width={128} height={128} fill={ACCENT} fillOpacity={0.06} stroke={ACCENT} strokeOpacity={0.9} strokeWidth={1.25} />
      <rect x={144} y={96} width={128} height={128} fill={AMBER} fillOpacity={0.05} stroke={AMBER} strokeOpacity={0.9} strokeWidth={1.25} />
      <rect x={144} y={96} width={48} height={128} fill={AMBER} fillOpacity={0.16} />
      <text {...mono} x={70} y={110} fill={ACCENT}>tile A</text>
      <text {...mono} x={266} y={110} textAnchor="end" fill={AMBER}>tile B</text>
      <text {...mono} x={168} y={238} textAnchor="middle" fill={AMBER}>overlap</text>
      <path d="M64 232 H88" stroke={LINE} strokeWidth={1} />
      <text {...mono} x={76} y={246} textAnchor="middle" fill={TEXT_MUTED}>halo</text>

      <g transform="translate(64 96)">
        <g className={ANIM.travel} style={travel('M0 0 L160 0', 0)}>
          <rect width={128} height={128} fill={ACCENT} fillOpacity={0.1} stroke={ACCENT} strokeWidth={1.5} />
        </g>
      </g>

      <Panel x={408} y={64} w={200} h={96} />
      <text {...caption} x={416} y={80}>Blend weight across the overlap</text>
      <rect x={480} y={86} width={48} height={58} fill={AMBER} fillOpacity={0.12} />
      <path d="M424 144 H592" stroke={LINE} strokeWidth={1.25} />
      <path d="M424 88 H480 C504 88 504 144 528 144" fill="none" stroke={ACCENT} strokeWidth={1.5} />
      <path d="M480 144 C504 144 504 88 528 88 H592" fill="none" stroke={AMBER} strokeWidth={1.5} />
      <text {...mono} x={428} y={104} fill={ACCENT}>tile A</text>
      <text {...mono} x={588} y={104} textAnchor="end" fill={AMBER}>tile B</text>
      <text {...caption} x={504} y={156} textAnchor="middle">weights sum to 1 everywhere</text>
      <Pulse x={424} y={88} path="M0 0 H56 C80 0 80 56 104 56" delayMs={0} />
      <Pulse x={480} y={144} path="M0 0 C24 0 24 -56 48 -56 H112" delayMs={1000} tone={AMBER} />

      <Panel x={408} y={184} w={200} h={112} />
      <path d="M508 192 V288" stroke={LINE_SOFT} strokeWidth={1} strokeDasharray="2 4" />
      <text {...caption} x={458} y={200} textAnchor="middle">hard crop</text>
      <text {...caption} x={558} y={200} textAnchor="middle">weighted blend</text>
      <path d="M458 212 V280" stroke={ROSE} strokeOpacity={0.5} strokeWidth={1} strokeDasharray="2 3" />
      <path d="M416 244 L458 238 M458 248 L500 242" fill="none" stroke={PAPER} strokeOpacity={0.85} strokeWidth={1.5} />
      <circle cx={458} cy={243} r={3} fill={ROSE} className={ANIM.blink} />
      <path d="M558 212 V280" stroke={LINE_SOFT} strokeWidth={1} strokeDasharray="2 3" />
      <path d="M516 246 C540 240 576 246 600 242" fill="none" stroke={GREEN} strokeWidth={1.5} />
      <Pulse x={516} y={246} path="M0 0 C24 -6 60 0 84 -4" delayMs={500} tone={GREEN} />
      <text {...caption} x={458} y={290} textAnchor="middle" fill={ROSE}>kink at the seam</text>
      <text {...caption} x={558} y={290} textAnchor="middle" fill={GREEN}>continuous edge</text>

      <Tag x={32} y={324} text="Halo wider than context" />
      <Tag x={188} y={324} text="Cosine ramp weights" tone="accent" />
      <Tag x={322} y={324} text="Divide by weight sum" />
      <Tag x={462} y={324} text="Fully convolutional" />
    </CoverFrame>
  );
};

/* Figure 3: probability raster -> skeleton with a closed gap and a pruned spur -> watershed basins -> simplified polygons. */
const STEPS = [32, 184, 336, 488];
const STEP_Y = 88;

const Vectorise: CoverComponent = ({ uid, title, className }) => (
  <CoverFrame uid={uid} title={title} className={className} glow={[320, 160, 240]}>
    {['1  Boundary probability', '2  Skeleton', '3  Watershed instances', '4  Parcel polygons'].map((t, i) => (
      <text key={t} {...caption} x={STEPS[i]} y={76}>{t}</text>
    ))}
    {STEPS.map((x, i) => <Panel key={x} x={x} y={STEP_Y} w={128} h={128} fill={i === 0 ? NODE_FILL_2 : NODE_FILL} />)}
    <g className={ANIM.flow}>
      {STEPS.slice(0, 3).map((x) => <Edge key={x} uid={uid} d={`M${x + 130} 152 H${x + 150}`} dashed />)}
    </g>

    <g className={ANIM.pulse}>
      <Terraces x={STEPS[0]} y={STEP_Y} stroke={ACCENT} strokeOpacity={0.18} strokeWidth={6} />
    </g>
    <Terraces x={STEPS[0]} y={STEP_Y} stroke={ACCENT} strokeOpacity={0.85} strokeWidth={1.5} />

    <Terraces x={STEPS[1]} y={STEP_Y} stroke={PAPER} strokeOpacity={0.8} strokeWidth={1} />
    <circle cx={STEPS[1] + 63} cy={STEP_Y + 40} r={7} fill={NODE_FILL} />
    <path d={`M${STEPS[1] + 65} ${STEP_Y + 34} L${STEPS[1] + 61} ${STEP_Y + 46}`} pathLength={1} fill="none" stroke={GREEN} strokeWidth={1.5} className={ANIM.draw} style={{ animationDelay: '600ms' }} />
    <text {...mono} x={STEPS[1] + 76} y={STEP_Y + 42} fill={GREEN}>gap closed</text>
    <path d={`M${STEPS[1] + 56} ${STEP_Y + 76} L${STEPS[1] + 44} ${STEP_Y + 88}`} stroke={ROSE} strokeWidth={1.25} className={ANIM.blink} />
    <text {...mono} x={STEPS[1] + 8} y={STEP_Y + 108} fill={ROSE}>spur pruned</text>

    <Terraces x={STEPS[2]} y={STEP_Y} fill={[GREEN, AMBER, ACCENT, GREEN, AMBER, GREEN, ACCENT, AMBER, GREEN, ACCENT]} fillOpacity={0.38} stroke={INK} strokeOpacity={0.9} strokeWidth={1} />
    {CENTROIDS.map(([cx, cy], i) => (
      <circle key={i} cx={STEPS[2] + cx} cy={STEP_Y + cy} r={2.4} fill={PAPER} className={ANIM.pulse} style={{ animationDelay: `${i * 180}ms` }} />
    ))}

    <Terraces x={STEPS[3]} y={STEP_Y} fill={GREEN} fillOpacity={0.08} stroke={LINE_SOFT} strokeWidth={1} />
    <DrawnTerraces x={STEPS[3]} y={STEP_Y} stroke={GREEN} step={100} />
    {VERTICES.map(([vx, vy]) => (
      <circle key={`${vx}-${vy}`} cx={STEPS[3] + vx} cy={STEP_Y + vy} r={1.6} fill={PAPER} fillOpacity={0.85} />
    ))}

    {['sigmoid + hysteresis', 'thin, prune, close', 'markers, flood ridges', 'arcs, simplify, faces'].map((t, i) => (
      <text key={t} {...mono} x={STEPS[i]} y={236} fill={TEXT_MUTED}>{t}</text>
    ))}

    <Tag x={32} y={300} text="GeoJSON, EPSG:4326" tone="green" />
    <Tag x={160} y={300} text="Shared arcs simplified once" tone="accent" />
    <Tag x={334} y={300} text="Slivers merged" />
    <Tag x={440} y={300} text="Dangles dropped" />
  </CoverFrame>
);

/* Card cover: overlap tiles over the raster -> four streams -> parcels drawing in. */
const Cover: CoverComponent = ({ uid, title, className }) => (
  <CoverFrame uid={uid} title={title} className={className} glow={[320, 160, 230]}>
    <defs>
      <clipPath id={`${uid}-left`}><rect x={32} y={72} width={176} height={176} rx={8} /></clipPath>
    </defs>
    <text {...caption} x={32} y={52}>Kishtwar raster, overlap tiles</text>
    <text {...caption} x={608} y={52} textAnchor="end">GeoJSON parcels</text>

    <Panel x={32} y={72} w={176} h={176} />
    <g clipPath={`url(#${uid}-left)`}>
      <Terraces x={32} y={72} s={1.375} fill={TERRACE_TONES} fillOpacity={TERRACE_ALPHA} stroke={INK} strokeOpacity={0.9} strokeWidth={1} />
      <rect x={40} y={80} width={80} height={80} fill="none" stroke={ACCENT} strokeOpacity={0.5} strokeWidth={1.25} />
      <rect x={96} y={80} width={80} height={80} fill="none" stroke={AMBER} strokeOpacity={0.5} strokeWidth={1.25} />
      <rect x={96} y={80} width={24} height={80} fill={AMBER} fillOpacity={0.16} />
      <g transform="translate(40 80)">
        <g className={ANIM.travel} style={travel('M0 0 L88 0 L88 88', 0)}>
          <rect width={80} height={80} fill={ACCENT} fillOpacity={0.12} stroke={ACCENT} strokeWidth={1.5} />
        </g>
      </g>
    </g>

    <Edge d="M208 160 L236 160" uid={uid} />
    <text {...label} x={240} y={92}>HRNet-W48</text>
    <StreamBars rows={[112, 140, 168, 196]} starts={[240, 276, 312, 348]} end={396} uid={uid} />
    <rect x={396} y={102} width={8} height={104} rx={2} fill={ACCENT} fillOpacity={0.35} stroke={LINE} strokeWidth={1} />
    <text {...caption} x={320} y={226} textAnchor="middle">4 streams, fused every stage</text>
    <Edge d="M404 160 L428 160" uid={uid} />

    <Panel x={432} y={72} w={176} h={176} />
    <Terraces x={432} y={72} s={1.375} stroke={LINE_SOFT} strokeWidth={1} />
    <DrawnTerraces x={432} y={72} s={1.375} stroke={GREEN} />

    <Tag x={32} y={290} text="Boundary-aware loss" />
    <Tag x={166} y={290} text="Overlap stitching" tone="accent" />
    <Tag x={290} y={290} text="Watershed" />
    <Tag x={368} y={290} text="Topology clean" tone="green" />
  </CoverFrame>
);

export const COVER: CoverComponent = Cover;
export const FIGURES: Record<string, CoverComponent> = {
  [`${SLUG}/streams`]: Streams,
  [`${SLUG}/tiling`]: Tiling,
  [`${SLUG}/vectorise`]: Vectorise,
};
