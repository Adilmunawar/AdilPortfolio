'use client';
import type { CSSProperties } from 'react';
import { ACCENT, AMBER, ANIM, caption, CoverFrame, Edge, GREEN, label, LINE, LINE_SOFT, mono, NODE_FILL, NODE_FILL_2, Panel, ROSE, Tag, TEXT, TEXT_MUTED, type CoverComponent } from '../shared';

const INK = '#0b0f17';
const WHITE = '#f2f4f8';

/* Seven parcels tiling a 120x100 box, as closed path strings so ca-draw can trace them. */
const PARCELS = [
  'M4 4L52 6L48 44L4 40Z',
  'M52 6L116 4L116 40L48 44Z',
  'M4 40L48 44L44 72L4 68Z',
  'M48 44L116 40L116 70L84 74L44 72Z',
  'M4 68L44 72L40 96L4 96Z',
  'M44 72L84 74L88 96L40 96Z',
  'M84 74L116 70L116 96L88 96Z',
];
const VERTICES: [number, number][] = [[4, 4], [52, 6], [116, 4], [4, 40], [48, 44], [116, 40], [4, 68], [44, 72], [84, 74], [116, 70], [4, 96], [40, 96], [88, 96], [116, 96]];
const GPS_TRACK = 'M4 40L48 44L44 72L4 68Z';
const MODEL_MERGED = 'M48 44L116 40L116 70L84 74L88 96L40 96L44 72Z';

const pick = <T,>(v: T | T[], i: number): T => (Array.isArray(v) ? v[i % v.length] : v) as T;

interface ParcelsProps {
  x: number; y: number; s?: number;
  fill?: string | string[]; fillOpacity?: number | number[];
  stroke?: string; strokeOpacity?: number; dashed?: boolean; omit?: number[];
}
function Parcels({ x, y, s = 1, fill = 'none', fillOpacity = 0.2, stroke = LINE, strokeOpacity = 1, dashed, omit = [] }: ParcelsProps) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={stroke} strokeOpacity={strokeOpacity} strokeWidth={1.25} strokeLinejoin="round" strokeDasharray={dashed ? '3 3' : undefined}>
      {PARCELS.map((d, i) => (omit.includes(i) ? null : <path key={i} d={d} fill={pick(fill, i)} fillOpacity={pick(fillOpacity, i)} vectorEffect="non-scaling-stroke" />))}
    </g>
  );
}

function Cylinder({ cx, top, w = 56, h = 32 }: { cx: number; top: number; w?: number; h?: number }) {
  const rx = w / 2;
  return (
    <g fill={NODE_FILL} stroke={ACCENT} strokeOpacity={0.5} strokeWidth={1.25}>
      <path d={`M${cx - rx} ${top}v${h}q${rx} 10 ${w} 0V${top}`} />
      <ellipse cx={cx} cy={top} rx={rx} ry={5} />
    </g>
  );
}

function Doc({ x, y, w, h, f = 10 }: { x: number; y: number; w: number; h: number; f?: number }) {
  return (
    <g transform={`translate(${x} ${y})`} fill={NODE_FILL} stroke={LINE} strokeWidth={1.25} strokeLinejoin="round">
      <path d={`M0 0h${w - f}l${f} ${f}v${h - f}H0z`} />
      <path d={`M${w - f} 0v${f}h${f}`} fill="none" />
    </g>
  );
}

function Check({ x, y, tone = GREEN }: { x: number; y: number; tone?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={6} fill={tone} fillOpacity={0.14} stroke={tone} strokeOpacity={0.6} strokeWidth={1.25} />
      <path d={`M${x - 3} ${y}l2 2.5 4.5-5`} fill="none" stroke={tone} strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

/* Four source glyphs drawn inside a 48x40 box at the given origin. */
function SourceGlyph({ kind, x, y, s = 0.4 }: { kind: 'gps' | 'scan' | 'operator' | 'model'; x: number; y: number; s?: number }) {
  if (kind === 'gps') {
    return (
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <Parcels x={0} y={0} stroke={LINE_SOFT} />
        <path d={GPS_TRACK} fill={ACCENT} fillOpacity={0.15} stroke={ACCENT} strokeWidth={1.5} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        {[[4, 40], [48, 44], [44, 72], [4, 68], [26, 42], [46, 58], [24, 70], [4, 54]].map(([px, py]) => (
          <circle key={`${px}-${py}`} cx={px} cy={py} r={2 / s} fill={ACCENT} />
        ))}
      </g>
    );
  }
  if (kind === 'scan') {
    return (
      <g transform={`translate(${x} ${y}) scale(${s}) rotate(-7 60 50)`}>
        <rect x={-4} y={-4} width={128} height={108} fill={AMBER} fillOpacity={0.1} stroke={AMBER} strokeOpacity={0.5} strokeWidth={1.25} vectorEffect="non-scaling-stroke" />
        <Parcels x={0} y={0} stroke={AMBER} strokeOpacity={0.7} />
      </g>
    );
  }
  if (kind === 'operator') {
    return (
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <Parcels x={0} y={0} stroke={LINE_SOFT} />
        <Parcels x={5} y={4} stroke={TEXT} strokeOpacity={0.8} dashed omit={[3, 5]} />
      </g>
    );
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Parcels x={0} y={0} fill={GREEN} fillOpacity={[0.3, 0.18, 0.24, 0, 0.2, 0, 0.26]} stroke={GREEN} strokeOpacity={0.7} omit={[3, 5]} />
      <path d={MODEL_MERGED} fill={GREEN} fillOpacity={0.34} stroke={GREEN} strokeOpacity={0.7} strokeWidth={1.25} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </g>
  );
}

const travel = (path: string, ms: number): CSSProperties => ({ offsetPath: `path("${path}")`, offsetRotate: '0deg', animationDelay: `${ms}ms` });

function Pulse({ x, y, path, ms, tone = ACCENT }: { x: number; y: number; path: string; ms: number; tone?: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className={ANIM.travel} style={travel(path, ms)}>
        <circle r={2.4} fill={tone} />
        <circle r={5} fill={tone} fillOpacity={0.25} />
      </g>
    </g>
  );
}

const SOURCES: { kind: 'gps' | 'scan' | 'operator' | 'model'; name: string; note: string }[] = [
  { kind: 'gps', name: 'GPS survey tracks', note: 'walked, GNSS' },
  { kind: 'scan', name: 'Cadastral scans', note: 'GCP warped' },
  { kind: 'operator', name: 'Operator polygons', note: 'EPSG:3857' },
  { kind: 'model', name: 'Model boundaries', note: 'HRNet raster' },
];

/* Cover: four sources -> conflate -> review -> versioned parcel layer, PostGIS and client GIS. */
const Cover: CoverComponent = ({ uid, title, className }) => {
  const rows = [68, 116, 164, 212];
  const targets = [140, 152, 168, 180];
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[340, 168, 220]}>
      <text {...caption} x={40} y={44}>Four sources</text>
      <text {...caption} x={600} y={44} textAnchor="end">Versioned parcels</text>

      {SOURCES.map((s, i) => (
        <g key={s.kind}>
          <Panel x={40} y={rows[i]} w={96} h={40} />
          <SourceGlyph kind={s.kind} x={47} y={rows[i] + 4} s={0.3} />
          <text {...mono} x={90} y={rows[i] + 24} fill={TEXT_MUTED}>{['GPS', 'Scan', 'Drawn', 'HRNet'][i]}</text>
          <Edge d={`M136 ${rows[i] + 20}L176 ${targets[i]}`} />
          <Pulse x={136} y={rows[i] + 20} path={`M0 0 L40 ${targets[i] - rows[i] - 20}`} ms={i * 350} />
        </g>
      ))}

      <Panel x={176} y={124} w={96} h={72} stroke={ACCENT} strokeOpacity={0.5} />
      <text {...label} x={224} y={150} textAnchor="middle">Conflate</text>
      <text {...caption} x={224} y={166} textAnchor="middle">IoU clusters</text>
      <text {...caption} x={224} y={180} textAnchor="middle">confidence</text>
      <Edge d="M272 160H304" uid={uid} />
      <Pulse x={272} y={160} path="M0 0 L32 0" ms={1400} />

      <Panel x={304} y={136} w={80} h={48} />
      <text {...label} x={336} y={164} textAnchor="middle">Review</text>
      <g className={ANIM.pulse}><Check x={368} y={160} tone={AMBER} /></g>
      <Edge d="M384 160H416" uid={uid} />
      <Pulse x={384} y={160} path="M0 0 L32 0" ms={1700} tone={GREEN} />

      <Panel x={416} y={68} w={184} h={152} />
      <Parcels x={430} y={78} s={1.2} fill={GREEN} fillOpacity={[0.26, 0.16, 0.22, 0.3, 0.14, 0.2, 0.24]} stroke={INK} strokeOpacity={0.8} />
      <g transform="translate(430 78) scale(1.2)" fill="none" stroke={ACCENT} strokeWidth={1.5} strokeLinejoin="round">
        {PARCELS.map((d, i) => <path key={d} d={d} pathLength={1} vectorEffect="non-scaling-stroke" className={ANIM.draw} style={{ animationDelay: `${i * 160}ms` }} />)}
      </g>
      <rect x={526} y={200} width={66} height={16} rx={4} fill={INK} stroke={LINE_SOFT} />
      <text {...mono} x={559} y={211} textAnchor="middle" fill={WHITE}>P-0412 v2</text>

      <Edge d="M452 220V240" uid={uid} />
      <Cylinder cx={452} top={248} />
      <text {...caption} x={452} y={304} textAnchor="middle">PostGIS</text>
      <Edge d="M540 220V236" uid={uid} />
      <Doc x={520} y={240} w={40} h={44} />
      <text {...caption} x={540} y={304} textAnchor="middle">Client GIS</text>

      <Tag x={40} y={300} text="EPSG:32643" />
      <Tag x={116} y={300} text="IoU clusters" tone="accent" />
      <Tag x={203} y={300} text="Human review" tone="amber" />
      <Tag x={290} y={300} text="Stable IDs" tone="green" />
    </CoverFrame>
  );
};

/* Figure: four sources clustered by IoU and merged into one confidence-tinted parcel layer. */
const Conflation: CoverComponent = ({ uid, title, className }) => {
  const rows = [64, 128, 192, 256];
  const targets = [156, 168, 192, 204];
  const tones = [GREEN, GREEN, AMBER, GREEN, GREEN, ROSE, GREEN];
  const alphas = [0.28, 0.18, 0.26, 0.32, 0.16, 0.3, 0.22];
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[304, 180, 200]}>
      <text {...caption} x={32} y={44}>Candidates by source</text>
      <text {...caption} x={608} y={44} textAnchor="end">One parcel layer</text>

      {SOURCES.map((s, i) => (
        <g key={s.kind}>
          <Panel x={32} y={rows[i]} w={160} h={56} />
          <SourceGlyph kind={s.kind} x={40} y={rows[i] + 8} />
          <text {...caption} x={96} y={rows[i] + 24} fill={TEXT}>{s.name}</text>
          <text {...mono} x={96} y={rows[i] + 40} fill={TEXT_MUTED}>{s.note}</text>
          <Edge d={`M192 ${rows[i] + 28}L256 ${targets[i]}`} />
          <Pulse x={192} y={rows[i] + 28} path={`M0 0 L64 ${targets[i] - rows[i] - 28}`} ms={i * 400} />
        </g>
      ))}

      <Panel x={256} y={136} w={104} h={88} stroke={ACCENT} strokeOpacity={0.5} />
      <text {...label} x={308} y={160} textAnchor="middle">Conflate</text>
      <text {...mono} x={308} y={178} textAnchor="middle" fill={TEXT_MUTED}>IoU &gt;= 0.35</text>
      <text {...caption} x={308} y={194} textAnchor="middle">union-find</text>
      <text {...caption} x={308} y={208} textAnchor="middle">pick one, keep rest</text>
      <Edge d="M360 180H400" uid={uid} />
      <Pulse x={360} y={180} path="M0 0 L40 0" ms={1800} tone={GREEN} />

      <Panel x={400} y={64} w={208} h={208} />
      <Parcels x={412} y={74} s={1.55} fill={tones} fillOpacity={alphas} stroke={INK} strokeOpacity={0.8} />
      <g transform="translate(412 74) scale(1.55)" fill="none" stroke={ACCENT} strokeWidth={1.5} strokeLinejoin="round">
        {PARCELS.map((d, i) => <path key={d} d={d} pathLength={1} vectorEffect="non-scaling-stroke" className={ANIM.draw} style={{ animationDelay: `${i * 160}ms` }} />)}
      </g>
      <g className={ANIM.pulse}>
        <path d={MODEL_MERGED} transform="translate(412 74) scale(1.55)" fill="none" stroke={ROSE} strokeWidth={1.25} strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
      </g>
      {[[GREEN, 'high'], [AMBER, 'margin'], [ROSE, 'review']].map(([tone, name], i) => (
        <g key={name}>
          <rect x={412 + i * 64} y={248} width={12} height={8} rx={2} fill={tone} fillOpacity={0.6} />
          <text {...caption} x={430 + i * 64} y={256}>{name}</text>
        </g>
      ))}

      <Tag x={256} y={316} text="IoU clusters" tone="accent" />
      <Tag x={344} y={316} text="Source priors" />
      <Tag x={438} y={316} text="Alternates kept" tone="green" />
    </CoverFrame>
  );
};

/* Figure: review queue -> reviewer decision -> version ledger, with the audit loop back to the queue. */
const ReviewVersioning: CoverComponent = ({ uid, title, className }) => {
  const queue: [string, string, 'accent' | 'amber' | 'rose' | 'muted'][] = [
    ['P-0412', 'margin 0.03', 'amber'],
    ['P-0417', '2 farmers', 'accent'],
    ['P-0433', 'invalid ring', 'rose'],
    ['P-0451', 'sliver', 'rose'],
    ['P-0466', 'no support', 'amber'],
    ['P-0470', 'audit diff', 'accent'],
  ];
  const ledger: [string, string, string][] = [
    ['P-0412', 'v1', 'conflate'],
    ['P-0412', 'v2', 'review'],
    ['P-0412', 'v3', 'split'],
    ['P-0910', 'v1', 'child'],
  ];
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[320, 168, 220]}>
      <defs>
        <clipPath id={`${uid}-queue`}><rect x={33} y={61} width={174} height={230} rx={8} /></clipPath>
      </defs>
      <text {...caption} x={32} y={44}>Review queue</text>
      <text {...caption} x={320} y={44} textAnchor="middle">Reviewer decision</text>
      <text {...caption} x={608} y={44} textAnchor="end">Version ledger</text>

      <Panel x={32} y={60} w={176} h={232} />
      <g clipPath={`url(#${uid}-queue)`}>
        <g className={ANIM.scan}>
          <rect x={33} y={61} width={174} height={30} fill={ACCENT} fillOpacity={0.12} />
        </g>
      </g>
      {queue.map(([id, reason, tone], i) => (
        <g key={id}>
          <text {...mono} x={44} y={88 + i * 36} fill={WHITE}>{id}</text>
          <Tag x={100} y={85 + i * 36} text={reason} tone={tone} />
          {i < queue.length - 1 && <path d={`M40 ${100 + i * 36}H200`} stroke={LINE_SOFT} />}
        </g>
      ))}

      <Edge d="M208 176H248" uid={uid} />
      <Pulse x={208} y={176} path="M0 0 L40 0" ms={0} />

      <Panel x={248} y={96} w={144} h={160} />
      <text {...label} x={260} y={116}>Reviewer</text>
      <Tag x={344} y={112} text="QGIS" tone="accent" />
      <g transform="translate(268 128) scale(0.9)">
        <path d={PARCELS[3]} fill={GREEN} fillOpacity={0.2} stroke={GREEN} strokeWidth={1.5} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        <path d={PARCELS[5]} fill={GREEN} fillOpacity={0.12} stroke={GREEN} strokeWidth={1.5} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        <path d={MODEL_MERGED} transform="translate(5 3)" fill="none" stroke={AMBER} strokeWidth={1.25} strokeDasharray="3 3" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      </g>
      <text {...caption} x={260} y={172} fill={GREEN}>survey</text>
      <text {...caption} x={260} y={186} fill={AMBER}>model</text>
      <g className={ANIM.pulse}><Check x={382} y={150} /></g>
      <text {...caption} x={320} y={242} textAnchor="middle">accept · switch · redraw</text>

      <Edge d="M392 176H432" uid={uid} />
      <Pulse x={392} y={176} path="M0 0 L40 0" ms={700} tone={GREEN} />

      <Panel x={432} y={60} w={176} h={232} />
      <text {...mono} x={444} y={80} fill={TEXT_MUTED}>parcel_id</text>
      <text {...mono} x={520} y={80} fill={TEXT_MUTED}>ver</text>
      <text {...mono} x={552} y={80} fill={TEXT_MUTED}>by</text>
      <path d="M440 88H600" stroke={LINE_SOFT} />
      {ledger.map(([id, ver, by], i) => (
        <g key={`${id}-${ver}`}>
          <text {...mono} x={444} y={106 + i * 22} fill={WHITE}>{id}</text>
          <text {...mono} x={520} y={106 + i * 22} fill={ACCENT}>{ver}</text>
          <text {...mono} x={552} y={106 + i * 22} fill={TEXT_MUTED}>{by}</text>
        </g>
      ))}
      <path d="M440 196H600" stroke={LINE_SOFT} />
      <text {...caption} x={444} y={214}>lineage</text>
      <g fill={NODE_FILL_2} stroke={ACCENT} strokeWidth={1.25}>
        <path d="M460 240H500M520 240H556M572 240L588 258M572 240L588 222" fill="none" stroke={LINE} className={ANIM.flow} strokeDasharray="4 4" />
        <circle cx={452} cy={240} r={6} />
        <circle cx={508} cy={240} r={6} />
        <circle cx={564} cy={240} r={6} />
        <circle cx={594} cy={222} r={5} stroke={GREEN} />
        <circle cx={594} cy={258} r={5} stroke={GREEN} />
      </g>
      <text {...mono} x={452} y={264} textAnchor="middle" fill={TEXT_MUTED}>v1</text>
      <text {...mono} x={508} y={264} textAnchor="middle" fill={TEXT_MUTED}>v2</text>
      <text {...mono} x={564} y={264} textAnchor="middle" fill={TEXT_MUTED}>v3</text>
      <text {...caption} x={520} y={284} textAnchor="middle">split: children get new ids</text>

      <Edge d="M520 292V318H120V296" uid={uid} dashed className={ANIM.flow} />
      <text {...caption} x={320} y={332} textAnchor="middle">field audit sample re-enters the queue</text>
    </CoverFrame>
  );
};

/* Figure: scanned sheet pinned by GCPs and warped, every source reprojected to EPSG:32643. */
const CrsAlignment: CoverComponent = ({ uid, title, className }) => {
  const gcp: [number, number][] = [[76, 122], [187, 110], [196, 198], [85, 210]];
  const target: [number, number][] = [[80, 116], [192, 116], [192, 204], [80, 204]];
  const inputs: [string, string][] = [['4326', 'GPS tracks'], ['3857', 'operator'], ['affine', 'GeoTIFF']];
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[320, 168, 220]}>
      <text {...caption} x={32} y={44}>Scanned sheet, ground control points</text>
      <text {...caption} x={608} y={44} textAnchor="end">Aligned in EPSG:32643</text>

      <Panel x={32} y={64} w={208} h={192} />
      <g transform="rotate(-6 136 160)">
        <rect x={64} y={100} width={144} height={120} fill={AMBER} fillOpacity={0.08} stroke={AMBER} strokeOpacity={0.5} strokeWidth={1.25} />
        <Parcels x={76} y={110} stroke={AMBER} strokeOpacity={0.7} />
      </g>
      {gcp.map(([x, y], i) => (
        <g key={i}>
          <path d={`M${x - 5} ${y}h10M${x} ${y - 5}v10`} stroke={AMBER} strokeWidth={1.25} />
          <path d={`M${x} ${y}L${target[i][0]} ${target[i][1]}`} pathLength={1} stroke={ACCENT} strokeWidth={1.25} className={ANIM.draw} style={{ animationDelay: `${i * 200}ms` }} />
          <circle cx={target[i][0]} cy={target[i][1]} r={3} fill={ACCENT} className={ANIM.pulse} />
        </g>
      ))}
      <text {...mono} x={44} y={244} fill={TEXT_MUTED}>gdalwarp -tps</text>
      <text {...caption} x={228} y={244} textAnchor="end">residuals per sheet</text>

      <Edge d="M240 160H272" uid={uid} />
      <Pulse x={240} y={160} path="M0 0 L32 0" ms={0} tone={AMBER} />

      <Panel x={272} y={104} w={128} h={112} stroke={ACCENT} strokeOpacity={0.5} />
      <text {...label} x={336} y={124} textAnchor="middle">One working CRS</text>
      {inputs.map(([code, name], i) => (
        <g key={code}>
          <text {...mono} x={284} y={148 + i * 18} fill={TEXT_MUTED}>{code}</text>
          <text {...caption} x={324} y={148 + i * 18}>{name}</text>
        </g>
      ))}
      <path d="M284 194H388" stroke={LINE_SOFT} />
      <text {...mono} x={336} y={208} textAnchor="middle" fill={ACCENT}>UTM 43N, metres</text>

      <Edge d="M400 160H432" uid={uid} />
      <Pulse x={400} y={160} path="M0 0 L32 0" ms={900} tone={GREEN} />

      <Panel x={432} y={64} w={176} h={192} />
      <g stroke={LINE_SOFT} strokeWidth={1}>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => <path key={`v${i}`} d={`M${448 + i * 24} 72V248`} />)}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => <path key={`h${i}`} d={`M440 ${80 + i * 24}H600`} />)}
      </g>
      <Parcels x={452} y={84} s={1.2} stroke={AMBER} strokeOpacity={0.45} />
      <Parcels x={452} y={84} s={1.2} stroke={TEXT} strokeOpacity={0.5} dashed omit={[3, 5]} />
      <g transform="translate(452 84) scale(1.2)" fill="none" stroke={GREEN} strokeWidth={1.5} strokeLinejoin="round">
        {PARCELS.map((d, i) => <path key={d} d={d} pathLength={1} vectorEffect="non-scaling-stroke" className={ANIM.draw} style={{ animationDelay: `${600 + i * 140}ms` }} />)}
      </g>
      <path d={GPS_TRACK} transform="translate(452 84) scale(1.2)" fill={ACCENT} fillOpacity={0.14} stroke={ACCENT} strokeWidth={1.5} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      {VERTICES.map(([vx, vy]) => <circle key={`${vx}-${vy}`} cx={452 + vx * 1.2} cy={84 + vy * 1.2} r={1.6} fill={WHITE} fillOpacity={0.8} />)}
      <text {...caption} x={444} y={240} fill={ACCENT}>GPS</text>
      <text {...caption} x={476} y={240} fill={TEXT}>operator</text>
      <text {...caption} x={528} y={240} fill={GREEN}>model</text>
      <text {...caption} x={596} y={240} textAnchor="end" fill={AMBER}>sheet</text>

      <Tag x={32} y={288} text="Ground control points" tone="amber" />
      <Tag x={170} y={288} text="Thin plate spline" />
      <Tag x={285} y={288} text="Metric CRS for area" tone="accent" />
      <Tag x={411} y={288} text="Residual check" tone="green" />
    </CoverFrame>
  );
};

export const COVER: CoverComponent = Cover;

export const FIGURES: Record<string, CoverComponent> = {
  'farm-digitisation-pipeline/conflation': Conflation,
  'farm-digitisation-pipeline/review-versioning': ReviewVersioning,
  'farm-digitisation-pipeline/crs-alignment': CrsAlignment,
};
