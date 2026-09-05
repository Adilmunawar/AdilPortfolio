'use client';
import type { CSSProperties } from 'react';
import { ACCENT, AMBER, ANIM, caption, CoverFrame, Edge, GREEN, label, LINE, LINE_SOFT, mono, NODE_FILL_2, Panel, ROSE, Tag, TEXT, TEXT_MUTED, type CoverComponent } from '../shared';

const PAPER = '#f2f4f8';

type Pt = [number, number];

const travel = (path: string, ms = 0): CSSProperties => ({
  offsetPath: `path("${path}")`,
  offsetRotate: '0deg',
  animationDelay: `${ms}ms`,
});
const grow = (ms: number): CSSProperties => ({ transformOrigin: 'left center', animationDelay: `${ms}ms` });

/* Layer definitions: node x and a vertical offset from the layer's centre line. */
interface LayerDef { name: string; nodes: Pt[]; edges: [number, number][] }
const LAYERS: LayerDef[] = [
  {
    name: 'layer 0, every vector',
    nodes: [[60, 4], [88, -6], [110, 8], [132, -4], [156, 6], [180, -6], [200, 8], [214, -2], [240, 6], [268, -6], [284, 8], [300, -4], [316, 6], [328, -6], [344, 6], [352, -4], [362, 8], [372, -6], [384, 4]],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11], [11, 12], [12, 13], [13, 14], [14, 15], [15, 16], [16, 17], [17, 18], [1, 3], [4, 6], [8, 10], [12, 14], [13, 15], [14, 16], [15, 17]],
  },
  {
    name: 'layer 1',
    nodes: [[88, 6], [132, -8], [180, 8], [214, -6], [268, 6], [300, -8], [328, 6], [344, -4], [372, 8]],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [0, 2], [3, 5], [5, 7]],
  },
  {
    name: 'layer 2, entry layer',
    nodes: [[88, -8], [180, 4], [268, -6], [328, 2]],
    edges: [[0, 1], [1, 2], [2, 3]],
  },
];
/* Greedy route as [layer, node] pairs, top layer first; the beam at layer 0 returns the last three nodes. */
const ROUTE: [number, number][] = [[2, 0], [2, 1], [2, 2], [2, 3], [1, 6], [1, 7], [0, 14], [0, 15]];
const FOUND = [15, 16, 14];
const QX = 356;

function place(li: number, tops: number[], h: number, s: number): Pt[] {
  return LAYERS[li].nodes.map(([x, dy]) => [x, tops[li] + h / 2 + dy * s]);
}

/* The three layers stacked with the descent path; tops are panel y positions per layer index. */
function LayeredGraph({ tops, h, s = 1, showBeam = true }: { tops: number[]; h: number; s?: number; showBeam?: boolean }) {
  const pts = LAYERS.map((_, li) => place(li, tops, h, s));
  const route = ROUTE.map(([li, ni]) => pts[li][ni]);
  const [ox, oy] = route[0];
  const abs = route.map(([x, y]) => `${x} ${y}`).join(' L');
  const rel = route.map(([x, y]) => `${x - ox} ${y - oy}`).join(' L');
  const onRoute = new Set(ROUTE.map(([li, ni]) => `${li}-${ni}`));
  const [bx, by] = pts[0][15];
  return (
    <g>
      {LAYERS.map((layer, li) => (
        <g key={layer.name}>
          <Panel x={40} y={tops[li]} w={352} h={h} />
          <text {...caption} x={52} y={tops[li] + 14}>{layer.name}</text>
          <path d={`M${QX} ${tops[li] + 2}V${tops[li] + h - 2}`} stroke={ROSE} strokeOpacity={0.5} strokeWidth={1} strokeDasharray="2 3" />
          <g stroke={LINE_SOFT} strokeWidth={1}>
            {layer.edges.map(([a, b]) => <path key={`${a}-${b}`} d={`M${pts[li][a][0]} ${pts[li][a][1]}L${pts[li][b][0]} ${pts[li][b][1]}`} />)}
          </g>
          {pts[li].map(([x, y], ni) => {
            const hit = onRoute.has(`${li}-${ni}`);
            const found = li === 0 && FOUND.includes(ni);
            return (
              <g key={`${x}-${y}`}>
                {found && <circle cx={x} cy={y} r={7} fill="none" stroke={GREEN} strokeWidth={1.25} />}
                <circle cx={x} cy={y} r={hit ? 4 : 3.5} fill={hit ? ACCENT : NODE_FILL_2} stroke={hit ? ACCENT : TEXT_MUTED} strokeWidth={1} />
              </g>
            );
          })}
          {li === 2 && <circle cx={pts[2][0][0]} cy={pts[2][0][1]} r={8} fill="none" stroke={ACCENT} strokeWidth={1.25} className={ANIM.pulse} />}
        </g>
      ))}
      {showBeam && (
        <g>
          <circle cx={bx + 4} cy={by + 2} r={22} fill={ACCENT} fillOpacity={0.06} stroke={ACCENT} strokeOpacity={0.6} strokeWidth={1} strokeDasharray="3 3" className={ANIM.pulse} />
          <text {...caption} x={330} y={tops[0] + h - 4} textAnchor="end">beam of efSearch</text>
        </g>
      )}
      <path d={`M${abs}`} fill="none" stroke={ACCENT} strokeWidth={1.5} strokeOpacity={0.85} pathLength={1} className={ANIM.draw} />
      <g transform={`translate(${ox} ${oy})`}>
        <g className={ANIM.travel} style={travel(`M${rel}`, 200)}>
          <circle r={3} fill={PAPER} />
        </g>
      </g>
      <text {...mono} x={QX} y={tops[2] - 6} textAnchor="middle" fill={ROSE}>q</text>
    </g>
  );
}

/* Cover: the layered graph with the descent, and recall against efSearch on the right. */
const Cover: CoverComponent = ({ uid, title, className }) => (
  <CoverFrame uid={uid} title={title} className={className} glow={[220, 160, 220]}>
    <LayeredGraph tops={[192, 124, 56]} h={56} s={0.6} showBeam={false} />

    <Panel x={424} y={56} w={176} h={192} />
    <path d="M444 216H584M444 216V76" stroke={LINE} strokeWidth={1} />
    <path d="M444 212L584 96" stroke={AMBER} strokeOpacity={0.8} strokeWidth={1.25} strokeDasharray="4 3" pathLength={1} className={ANIM.draw} />
    <path d="M444 208C470 110 500 88 584 82" fill="none" stroke={GREEN} strokeWidth={1.5} pathLength={1} className={ANIM.draw} />
    <g transform="translate(444 208)">
      <g className={ANIM.travel} style={travel('M0 0C26 -98 56 -120 140 -126', 300)}>
        <circle r={2.6} fill={PAPER} />
      </g>
    </g>
    <text {...caption} x={584} y={74} textAnchor="end" fill={GREEN}>recall@k</text>
    <text {...caption} x={508} y={184} fill={AMBER}>latency</text>
    <text {...caption} x={514} y={234} textAnchor="middle">efSearch</text>

    <Tag x={40} y={280} text="greedy descent" tone="accent" />
    <Tag x={144} y={280} text="M links per node" />
    <Tag x={256} y={280} text="efSearch beam" tone="green" />
    <Tag x={360} y={280} text="tombstones" tone="rose" />
    <Tag x={444} y={280} text="filtered search" tone="amber" />
    <text {...mono} x={40} y={316}>recall rises with efSearch and latency rises with it: measure, then pick the knee</text>
  </CoverFrame>
);

/* Figure 1: descent through three layers on the left, the procedure written out on the right. */
const LayeredDescent: CoverComponent = ({ uid, title, className }) => (
  <CoverFrame uid={uid} title={title} className={className} glow={[220, 180, 220]}>
    <LayeredGraph tops={[224, 140, 56]} h={72} />

    <Panel x={424} y={56} w={176} h={240} />
    <text {...label} x={440} y={80}>Greedy descent</text>
    {[
      'start at the entry point',
      'of the top layer',
      'hop to the neighbour',
      'closest to q; when no',
      'neighbour is closer, drop',
      'one layer at that node',
      'at layer 0 keep a beam',
      'of efSearch candidates',
    ].map((line, i) => (
      <text key={line} {...caption} x={440} y={100 + i * 14}>{line}</text>
    ))}
    <text {...mono} x={440} y={232}>level = floor(-ln u * mL)</text>
    <text {...mono} x={440} y={246}>mL = 1 / ln(M)</text>
    <text {...caption} x={440} y={272}>upper layers hold few nodes,</text>
    <text {...caption} x={440} y={286}>so their links are long</text>

    <Tag x={40} y={324} text="entry point" tone="accent" />
    <Tag x={124} y={324} text="greedy hop" />
    <Tag x={202} y={324} text="beam at layer 0" tone="green" />
    <Tag x={308} y={324} text="query q" tone="rose" />
  </CoverFrame>
);

/* Figure 2: the same graph searched with a narrow and a wide beam. Node coordinates are local to a 272x200 panel. */
const EF_NODES: Pt[] = [
  [24, 28], [60, 44], [96, 30], [140, 22], [190, 30], [236, 26], [250, 64], [232, 110], [250, 150], [214, 176],
  [170, 182], [120, 184], [76, 172], [36, 150], [30, 104], [48, 72], [84, 64], [196, 60], [208, 132], [152, 158],
  [96, 150], [70, 110], [188, 120], [128, 92], [146, 108], [122, 112], [172, 74], [98, 132],
];
const EF_Q: Pt = [136, 100];
const EF_PATH = [0, 16, 23];
const d2q = (p: Pt) => Math.hypot(p[0] - EF_Q[0], p[1] - EF_Q[1]);
const EF_TOP5 = EF_NODES.map((p, i) => [d2q(p), i] as [number, number]).sort((a, b) => a[0] - b[0]).slice(0, 5).map((v) => v[1]);
const visitedBy = (radius: number) => EF_NODES.map((p, i) => d2q(p) <= radius || EF_PATH.includes(i));
const EF_NARROW = 40;
const EF_WIDE = 90;
const count = (v: boolean[]) => v.filter(Boolean).length;

function Frontier({ x, y, radius, delayMs }: { x: number; y: number; radius: number; delayMs: number }) {
  const visited = visitedBy(radius);
  const path = EF_PATH.map((i) => EF_NODES[i]);
  const [ox, oy] = path[0];
  return (
    <g transform={`translate(${x} ${y})`}>
      <Panel x={0} y={0} w={272} h={200} />
      <circle cx={EF_Q[0]} cy={EF_Q[1]} r={radius} fill={ACCENT} fillOpacity={0.05} stroke={ACCENT} strokeOpacity={0.55} strokeWidth={1} strokeDasharray="3 3" className={ANIM.pulse} />
      <path d={`M${path.map(([px, py]) => `${px} ${py}`).join(' L')}`} fill="none" stroke={ACCENT} strokeWidth={1.25} pathLength={1} className={ANIM.draw} />
      <g transform={`translate(${ox} ${oy})`}>
        <g className={ANIM.travel} style={travel(`M${path.map(([px, py]) => `${px - ox} ${py - oy}`).join(' L')}`, delayMs)}>
          <circle r={2.6} fill={PAPER} />
        </g>
      </g>
      {EF_NODES.map(([px, py], i) => {
        const top = EF_TOP5.includes(i);
        const seen = visited[i];
        return (
          <g key={`${px}-${py}`}>
            {top && <circle cx={px} cy={py} r={7} fill="none" stroke={seen ? GREEN : ROSE} strokeWidth={1.25} strokeDasharray={seen ? undefined : '2 2'} />}
            <circle cx={px} cy={py} r={3.5} fill={seen ? ACCENT : NODE_FILL_2} stroke={seen ? ACCENT : TEXT_MUTED} strokeWidth={1} />
          </g>
        );
      })}
      <circle cx={EF_NODES[0][0]} cy={EF_NODES[0][1]} r={7} fill="none" stroke={ACCENT} strokeWidth={1.25} />
      <path d={`M${EF_Q[0] - 5} ${EF_Q[1]}h10M${EF_Q[0]} ${EF_Q[1] - 5}v10`} stroke={PAPER} strokeWidth={1.5} />
    </g>
  );
}

function Bars({ x, recallHits, visitedN, maxVisited, ms }: { x: number; recallHits: number; visitedN: number; maxVisited: number; ms: number }) {
  return (
    <g>
      <text {...mono} x={x} y={281} fill={TEXT_MUTED}>recall@5</text>
      <rect x={x + 64} y={273} width={(recallHits / 5) * 120} height={10} rx={2} fill={GREEN} fillOpacity={0.8} className={ANIM.grow} style={grow(ms)} />
      <text {...mono} x={x + 192} y={281}>{recallHits} of 5</text>
      <text {...mono} x={x} y={297} fill={TEXT_MUTED}>visited</text>
      <rect x={x + 64} y={289} width={(visitedN / maxVisited) * 120} height={10} rx={2} fill={AMBER} fillOpacity={0.8} className={ANIM.grow} style={grow(ms + 150)} />
      <text {...mono} x={x + 192} y={297}>{visitedN} nodes</text>
    </g>
  );
}

const EfSearch: CoverComponent = ({ uid, title, className }) => {
  const narrow = visitedBy(EF_NARROW);
  const wide = visitedBy(EF_WIDE);
  const hits = (v: boolean[]) => EF_TOP5.filter((i) => v[i]).length;
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[320, 160, 240]}>
      <text {...caption} x={40} y={44}>Small efSearch: a narrow frontier</text>
      <text {...caption} x={600} y={44} textAnchor="end">Large efSearch: a wide frontier</text>
      <Frontier x={40} y={56} radius={EF_NARROW} delayMs={0} />
      <Frontier x={328} y={56} radius={EF_WIDE} delayMs={600} />
      <Bars x={40} recallHits={hits(narrow)} visitedN={count(narrow)} maxVisited={count(wide)} ms={0} />
      <Bars x={328} recallHits={hits(wide)} visitedN={count(wide)} maxVisited={count(wide)} ms={200} />
      <Tag x={40} y={328} text="visited by the beam" tone="accent" />
      <Tag x={172} y={328} text="true top 5" tone="green" />
      <Tag x={254} y={328} text="missed" tone="rose" />
      <Tag x={312} y={328} text="query" />
    </CoverFrame>
  );
};

/* Figure 3: post filtering empties the result, pre filtering restricts first and then orders. */
const POST_ROWS = ['#1  tenant A', '#2  tenant A', '#3  tenant A', '#4  tenant A', '#5  tenant A', '#6  tenant A', '#7  tenant A', '#8  tenant A', '#9  tenant A', '#10 tenant A'];
const PRE_IDS = ['B  #1032', 'B  #0417', 'B  #2210', 'B  #0088', 'B  #1975', 'B  #0640', 'B  #3301', 'B  #0152', 'B  #2764', 'B  #0919'];
const PRE_RANKED = ['#1  0.12', '#2  0.15', '#3  0.19', '#4  0.21', '#5  0.24', '#6  0.26', '#7  0.30', '#8  0.31', '#9  0.35', '#10 0.38'];

function Rows({ x, y, w, rows, tone, ms }: { x: number; y: number; w: number; rows: string[]; tone: string; ms: number }) {
  return (
    <g>
      {rows.map((r, i) => (
        <g key={r} className={ANIM.grow} style={grow(ms + i * 70)}>
          <rect x={x} y={y + i * 19} width={w} height={16} rx={3} fill={tone} fillOpacity={0.14} stroke={tone} strokeOpacity={0.5} strokeWidth={1} />
          <text {...mono} x={x + 6} y={y + i * 19 + 11.5} fill={tone === TEXT_MUTED ? TEXT : tone}>{r}</text>
        </g>
      ))}
    </g>
  );
}

const FilterTrap: CoverComponent = ({ uid, title, className }) => (
  <CoverFrame uid={uid} title={title} className={className} glow={[320, 170, 240]}>
    <text {...caption} x={40} y={44}>Post filter: nearest ten, then WHERE</text>
    <text {...caption} x={600} y={44} textAnchor="end">Pre filter: WHERE first, then order by distance</text>

    <Panel x={40} y={56} w={272} h={240} />
    <text {...caption} x={56} y={74}>ORDER BY distance LIMIT 10</text>
    <Rows x={56} y={88} w={116} rows={POST_ROWS} tone={TEXT_MUTED} ms={0} />
    <Edge d="M178 181H194" uid={uid} />
    <rect x={200} y={88} width={96} height={187} rx={4} fill={ROSE} fillOpacity={0.04} stroke={ROSE} strokeOpacity={0.6} strokeWidth={1} strokeDasharray="3 3" />
    <text {...mono} x={248} y={104} textAnchor="middle" fill={TEXT_MUTED}>tenant = 'B'</text>
    <text {...mono} x={248} y={185} textAnchor="middle" fill={ROSE} className={ANIM.blink}>0 rows</text>

    <Panel x={328} y={56} w={272} h={240} />
    <text {...caption} x={344} y={74}>bitmap of tenant = 'B', then distance</text>
    <Rows x={344} y={88} w={116} rows={PRE_IDS} tone={GREEN} ms={0} />
    <Edge d="M466 181H482" uid={uid} />
    <Rows x={488} y={88} w={96} rows={PRE_RANKED} tone={ACCENT} ms={700} />

    <Tag x={40} y={328} text="post filter empties" tone="rose" />
    <Tag x={168} y={328} text="over-fetch: raise ef_search and LIMIT" />
    <Tag x={400} y={328} text="pre filter when selective" tone="green" />
  </CoverFrame>
);

export const COVER: CoverComponent = Cover;

export const FIGURES: Record<string, CoverComponent> = {
  'hnsw-vector-index-internals/layered-descent': LayeredDescent,
  'hnsw-vector-index-internals/ef-search': EfSearch,
  'hnsw-vector-index-internals/filter-trap': FilterTrap,
};
