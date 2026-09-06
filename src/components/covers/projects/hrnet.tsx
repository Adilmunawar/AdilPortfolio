'use client';
import type { CSSProperties } from 'react';
import { ACCENT, AMBER, caption, CoverFrame, Edge, GREEN, LINE, LINE_SOFT, mono, NODE_FILL, Tag, TEXT_MUTED, type CoverComponent } from '../shared';

const V: Record<string, [number, number]> = {
  a: [0, 0], b: [60, 0], c: [144, 0],
  d: [0, 52], e: [52, 44], f: [96, 58], g: [144, 40],
  h: [0, 100], i: [40, 104], j: [88, 96], k: [144, 92],
  l: [0, 144], m: [56, 144], n: [104, 144], o: [144, 144],
};
const PARCELS = ['abed', 'bcgfe', 'deih', 'efji', 'fgkj', 'himl', 'ijnm', 'jkon'];
const TONES = [GREEN, AMBER, AMBER, GREEN, GREEN, AMBER, GREEN, AMBER];
const ALPHA = [0.3, 0.2, 0.16, 0.34, 0.22, 0.18, 0.26, 0.2];

const poly = (keys: string, ox: number, oy: number) =>
  keys.split('').map((k, idx) => `${idx ? 'L' : 'M'}${ox + V[k][0]} ${oy + V[k][1]}`).join('') + 'Z';

const COLS = [232, 296, 360, 424];
const ROWS = [92, 140, 188, 236];
const RES = ['1/4', '1/8', '1/16', '1/32'];
const NEURON = [-9, 0, 9];
const streamsAt = (stage: number) => ROWS.slice(0, stage + 1);

type Link = { x1: number; y1: number; x2: number; y2: number; fusion: boolean };
const LINKS: Link[] = [];
for (let stage = 0; stage < 3; stage++) {
  const from = streamsAt(stage);
  const to = streamsAt(stage + 1);
  from.forEach((ys) =>
    to.forEach((yt) =>
      NEURON.forEach((ns) =>
        NEURON.forEach((nt) =>
          LINKS.push({ x1: COLS[stage] + 10, y1: ys + ns, x2: COLS[stage + 1] - 10, y2: yt + nt, fusion: ys !== yt })
        )
      )
    )
  );
}

const LOOP = 10000;
// Every offset path is stretched to REACH px so one 1.5s keyframe slot gives one speed (112 px/s); the overrun is clipped by the nested svg.
const REACH = 168;
const WAVE = [2100, 3200, 4600];
const ACTIVE = [1800, 2800, 4300, 5800];
const COLLECT = 442;
const OUT_AT = 6500;
const DRAW_AT = 7500;

const STYLE = `
.hrn-pulse,.hrn-scan,.hrn-active{opacity:0}
@media (hover:hover) and (min-width:768px){
.hrn-draw{stroke-dasharray:1}
.cover-live .hrn-scan{animation:hrn-scan ${LOOP}ms linear infinite}
.cover-live .hrn-pulse{animation:hrn-travel ${LOOP}ms linear infinite}
.cover-live .hrn-active{animation:hrn-active ${LOOP}ms ease-in-out infinite}
.cover-live .hrn-draw{animation:hrn-draw ${LOOP}ms linear infinite both}
}
@media (prefers-reduced-motion:reduce){.hrn-scan,.hrn-pulse,.hrn-active,.hrn-draw{animation:none !important}}
@keyframes hrn-scan{0%{transform:translate3d(0,0,0);opacity:0}1%{opacity:1}14%{opacity:1}15%{transform:translate3d(0,139px,0);opacity:0}100%{transform:translate3d(0,139px,0);opacity:0}}
@keyframes hrn-travel{0%{offset-distance:0%;opacity:1}15%{offset-distance:100%;opacity:1}15.1%{opacity:0}100%{offset-distance:100%;opacity:0}}
@keyframes hrn-active{0%{opacity:0}2%{opacity:0.9}7%{opacity:0.45}12%{opacity:0.9}17%{opacity:0.45}20%{opacity:0}100%{opacity:0}}
@keyframes hrn-draw{0%{stroke-dashoffset:1;opacity:1}12%{stroke-dashoffset:0;opacity:1}25%{stroke-dashoffset:0;opacity:1}27%{stroke-dashoffset:0;opacity:0}100%{stroke-dashoffset:0;opacity:0}}
`;

const f = (n: number) => Math.round(n * 10) / 10;

const along = (points: [number, number][], delay: number): CSSProperties => {
  let len = 0;
  for (let i = 1; i < points.length; i++) len += Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]);
  const [lx, ly] = points[points.length - 1];
  const [px, py] = points[points.length - 2];
  const seg = Math.hypot(lx - px, ly - py);
  const ext = REACH - len;
  const end: [number, number] = [lx + ((lx - px) / seg) * ext, ly + ((ly - py) / seg) * ext];
  const d = [...points.slice(0, -1), end].map(([x, y], i) => `${i ? 'L' : 'M'}${f(x)} ${f(y)}`).join(' ');
  return { offsetPath: `path("${d}")`, offsetRotate: '0deg', animationDelay: `${delay}ms` };
};

type Pulse = { points: [number, number][]; delay: number; tone: string };
const STAGE_PULSES: Pulse[][] = [0, 1, 2].map((stage) => {
  const out: Pulse[] = [];
  let pair = 0;
  streamsAt(stage).forEach((ys) =>
    streamsAt(stage + 1).forEach((yt) => {
      const cross = pair % 2 === 1;
      [0, 1].forEach((v) => {
        const ns = v ? 9 : -9;
        const nt = cross ? -ns : ns;
        out.push({
          points: [[0, ys + ns - 70], [44, yt + nt - 70]],
          delay: WAVE[stage] + v * 180,
          tone: yt === ys ? ACCENT : yt > ys ? AMBER : GREEN,
        });
      });
      pair++;
    })
  );
  return out;
});

const OUT_PULSES: Pulse[] = ROWS.map((y) => ({
  points: [[0, y - 80], [COLLECT - 434, y - 80], [COLLECT - 434, 84], [26, 84]],
  delay: OUT_AT,
  tone: ACCENT,
}));

const Dot = ({ p }: { p: Pulse }) => (
  <circle r={2.4} fill={p.tone} stroke={p.tone} strokeOpacity={0.25} strokeWidth={5} className="hrn-pulse" style={along(p.points, p.delay)} />
);

const HrnetW48: CoverComponent = ({ uid, title, className }) => (
  <CoverFrame uid={uid} title={title} className={className} glow={[328, 164, 210]}>
    <style>{STYLE}</style>
    <text {...caption} x={32} y={60}>Input tile</text>
    <text {...caption} x={232} y={60}>HRNet-W48 · four resolutions, fused at every stage</text>
    <text {...caption} x={608} y={60} textAnchor="end">Field boundaries</text>

    <g>
      <rect x={32} y={84} width={144} height={144} rx={6} fill={NODE_FILL} stroke={LINE} strokeWidth={1.25} />
      {PARCELS.map((p, i) => (
        <path key={p} d={poly(p, 32, 84)} fill={TONES[i]} fillOpacity={ALPHA[i]} stroke="#0b0f17" strokeWidth={1} />
      ))}
      <rect x={32} y={84} width={144} height={144} rx={6} fill="none" stroke={LINE} strokeWidth={1.25} />
      <svg x={33} y={85} width={142} height={142} overflow="hidden">
        <rect className="hrn-scan" x={0} y={1} width={142} height={3} fill={ACCENT} fillOpacity={0.55} />
      </svg>
    </g>

    <Edge d="M180 156 L218 156" uid={uid} />
    <svg x={176} y={140} width={46} height={32} overflow="hidden">
      <Dot p={{ points: [[4, 16], [42, 16]], delay: 1500, tone: ACCENT }} />
    </svg>

    <g>
      {ROWS.map((y, r) => (
        <g key={y}>
          <line x1={COLS[r] - 10} y1={y} x2={COLS[3] + 10} y2={y} stroke={LINE_SOFT} strokeWidth={1} />
          <text {...mono} x={COLS[r] - 18} y={y + 3} textAnchor="end" fill={TEXT_MUTED}>{RES[r]}</text>
        </g>
      ))}

      {LINKS.map((l, i) => (
        <line
          key={i}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke={l.fusion ? ACCENT : '#ffffff'}
          strokeOpacity={l.fusion ? 0.16 : 0.1}
          strokeWidth={0.75}
        />
      ))}

      {ROWS.map((y) => (
        <path key={y} d={`M434 ${y} L${COLLECT} ${y}`} stroke={LINE} strokeWidth={1.25} />
      ))}
      <path d={`M${COLLECT} 92 L${COLLECT} 236`} stroke={LINE} strokeWidth={1.25} fill="none" />
      <Edge d={`M${COLLECT} 164 L460 164`} uid={uid} />

      {COLS.map((x, stage) =>
        streamsAt(stage).map((y) => (
          <g key={`${x}-${y}`}>
            <rect x={x - 10} y={y - 15} width={20} height={30} rx={5} fill={NODE_FILL} stroke={LINE} strokeWidth={1.25} />
            {NEURON.map((n) => (
              <circle key={n} cx={x} cy={y + n} r={2.6} fill={ACCENT} fillOpacity={0.9} />
            ))}
            <rect className="hrn-active" style={{ animationDelay: `${ACTIVE[stage]}ms` }} x={x - 12} y={y - 17} width={24} height={34} rx={6} fill={ACCENT} fillOpacity={0.14} stroke={ACCENT} strokeOpacity={0.8} strokeWidth={1} />
          </g>
        ))
      )}

      {COLS.map((x, stage) => (
        <text key={x} {...mono} x={x} y={272} textAnchor="middle" fill={TEXT_MUTED}>stage {stage + 1}</text>
      ))}
      {COLS.map((x, stage) => (
        <text key={`a-${x}`} {...mono} className="hrn-active" style={{ animationDelay: `${ACTIVE[stage]}ms` }} x={x} y={272} textAnchor="middle" fill={ACCENT}>stage {stage + 1}</text>
      ))}
      <path d="M222 254 L434 254" stroke={LINE_SOFT} strokeWidth={1} />

      {STAGE_PULSES.map((pulses, stage) => (
        <svg key={stage} x={COLS[stage] + 10} y={70} width={44} height={190} overflow="hidden">
          {pulses.map((p, i) => <Dot key={i} p={p} />)}
        </svg>
      ))}
      <svg x={434} y={80} width={27} height={168} overflow="hidden">
        {OUT_PULSES.map((p, i) => <Dot key={i} p={p} />)}
      </svg>
    </g>

    <g>
      <rect x={464} y={84} width={144} height={144} rx={6} fill={NODE_FILL} stroke={LINE} strokeWidth={1.25} />
      {PARCELS.map((p) => (
        <path key={p} d={poly(p, 464, 84)} fill="none" stroke={LINE_SOFT} strokeWidth={1} />
      ))}
      {PARCELS.map((p, i) => (
        <path
          key={`d-${p}`}
          d={poly(p, 464, 84)}
          pathLength={1}
          fill="none"
          stroke={ACCENT}
          strokeWidth={1.5}
          strokeLinejoin="round"
          className="hrn-draw"
          style={{ animationDelay: `${DRAW_AT + i * 100}ms` }}
        />
      ))}
      {Object.entries(V).map(([k, [vx, vy]]) => (
        <circle key={k} cx={464 + vx} cy={84 + vy} r={1.8} fill="#f2f4f8" fillOpacity={0.8} />
      ))}
    </g>

    <Tag x={32} y={302} text="Boundary-aware loss" />
    <Tag x={176} y={302} text="Tiled inference" />
    <Tag x={290} y={302} text="Overlap stitching" tone="accent" />
    <Tag x={416} y={302} text="Vectorised" tone="green" />
    <Tag x={506} y={302} text="GeoJSON" tone="green" />
  </CoverFrame>
);

export const HRNET_COVER: Record<string, CoverComponent> = { 'hrnet-w48-kishtwar': HrnetW48 };
