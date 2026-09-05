'use client';
import type { CSSProperties } from 'react';
import { ACCENT, AMBER, ANIM, caption, CoverFrame, Edge, GREEN, LINE, LINE_SOFT, mono, NODE_FILL, Tag, TEXT_MUTED, type CoverComponent } from '../shared';

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

const PULSES: { x: number; y: number; dx: number; dy: number; delay: number; tone: string }[] = [
  { x: 178, y: 156, dx: 46, dy: -64, delay: 0, tone: ACCENT },
  { x: 242, y: 92, dx: 44, dy: 0, delay: 300, tone: ACCENT },
  { x: 242, y: 92, dx: 44, dy: 48, delay: 600, tone: AMBER },
  { x: 306, y: 140, dx: 44, dy: 48, delay: 900, tone: AMBER },
  { x: 306, y: 92, dx: 44, dy: 0, delay: 1200, tone: ACCENT },
  { x: 370, y: 188, dx: 44, dy: -96, delay: 1500, tone: GREEN },
  { x: 370, y: 92, dx: 44, dy: 144, delay: 1800, tone: AMBER },
  { x: 370, y: 140, dx: 44, dy: -48, delay: 400, tone: GREEN },
  { x: 434, y: 92, dx: 38, dy: 64, delay: 1000, tone: ACCENT },
];

const travel = (dx: number, dy: number, delay: number): CSSProperties => ({
  offsetPath: `path("M0 0 L${dx} ${dy}")`,
  offsetRotate: '0deg',
  animationDelay: `${delay}ms`,
});

const HrnetW48: CoverComponent = ({ uid, title, className }) => (
  <CoverFrame uid={uid} title={title} className={className} glow={[328, 164, 210]}>
    <text {...caption} x={32} y={60}>Input tile</text>
    <text {...caption} x={232} y={60}>HRNet-W48 · four resolutions, fused at every stage</text>
    <text {...caption} x={608} y={60} textAnchor="end">Field boundaries</text>

    <g>
      <rect x={32} y={84} width={144} height={144} rx={6} fill={NODE_FILL} stroke={LINE} strokeWidth={1.25} />
      {PARCELS.map((p, i) => (
        <path key={p} d={poly(p, 32, 84)} fill={TONES[i]} fillOpacity={ALPHA[i]} stroke="#0b0f17" strokeWidth={1} />
      ))}
      <rect x={32} y={84} width={144} height={144} rx={6} fill="none" stroke={LINE} strokeWidth={1.25} />
      <g className={ANIM.scan} style={{ transformOrigin: '104px 84px' }}>
        <rect x={33} y={86} width={142} height={3} fill={ACCENT} fillOpacity={0.55} />
      </g>
    </g>

    <Edge d="M180 156 L218 156" uid={uid} />
    <Edge d="M454 164 L488 164" uid={uid} />

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

      {COLS.map((x, stage) =>
        streamsAt(stage).map((y) => (
          <g key={`${x}-${y}`}>
            <rect x={x - 10} y={y - 15} width={20} height={30} rx={5} fill={NODE_FILL} stroke={LINE} strokeWidth={1.25} />
            {NEURON.map((n) => (
              <circle key={n} cx={x} cy={y + n} r={2.6} fill={ACCENT} fillOpacity={0.9} />
            ))}
          </g>
        ))
      )}

      {COLS.map((x, stage) => (
        <text key={x} {...mono} x={x} y={272} textAnchor="middle" fill={TEXT_MUTED}>stage {stage + 1}</text>
      ))}
      <path d="M222 254 L434 254" stroke={LINE_SOFT} strokeWidth={1} />

      {PULSES.map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${p.y})`}>
          <g className={ANIM.travel} style={travel(p.dx, p.dy, p.delay)}>
            <circle r={2.4} fill={p.tone} />
            <circle r={5} fill={p.tone} fillOpacity={0.25} />
          </g>
        </g>
      ))}
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
          className={ANIM.draw}
          style={{ animationDelay: `${i * 140}ms` }}
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
