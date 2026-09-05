'use client';
import type { CSSProperties } from 'react';
import { ACCENT, AMBER, ANIM, caption, CoverFrame, GREEN, label, LINE, LINE_SOFT, mono, Panel, ROSE, Tag, TEXT, TEXT_MUTED, type CoverComponent } from '../shared';

const INK = '#0b0f17';
const PAPER = '#f2f4f8';

/* Nine terraced parcels tiling a 352x232 box, in local coordinates. */
const FIELDS: [string, string, number][] = [
  ['0,0 90,0 84,60 0,52', GREEN, 0.22],
  ['90,0 200,0 196,48 84,60', AMBER, 0.16],
  ['200,0 352,0 352,70 196,48', GREEN, 0.28],
  ['0,52 84,60 76,140 0,132', AMBER, 0.14],
  ['84,60 196,48 190,130 76,140', GREEN, 0.3],
  ['196,48 352,70 352,150 190,130', AMBER, 0.2],
  ['0,132 76,140 70,232 0,232', GREEN, 0.2],
  ['76,140 190,130 184,232 70,232', AMBER, 0.16],
  ['190,130 352,150 352,232 184,232', GREEN, 0.26],
];

function Fields({ x, y, sx = 1, sy = 1 }: { x: number; y: number; sx?: number; sy?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${sx} ${sy})`}>
      {FIELDS.map(([pts, fill, a]) => (
        <polygon key={pts} points={pts} fill={fill} fillOpacity={a} stroke={INK} strokeWidth={1} vectorEffect="non-scaling-stroke" />
      ))}
    </g>
  );
}

const travel = (dx: number, dy: number, ms = 0): CSSProperties => ({
  offsetPath: `path("M0 0 L${dx} ${dy}")`,
  offsetRotate: '0deg',
  animationDelay: `${ms}ms`,
});

/* One read window: dashed halo around a solid core, drawn at the local origin. */
function Win({ core, halo }: { core: number; halo: number }) {
  const w = core + halo * 2;
  return (
    <g>
      <rect x={0} y={0} width={w} height={w} fill={ACCENT} fillOpacity={0.06} stroke={ACCENT} strokeOpacity={0.55} strokeWidth={1.25} strokeDasharray="3 3" />
      <rect x={halo} y={halo} width={core} height={core} fill={ACCENT} fillOpacity={0.16} stroke={ACCENT} strokeWidth={1.5} />
    </g>
  );
}

/* Raster with the window grid: processed cores are tinted, one window is current, the next slides on. */
function WindowGrid({ uid, x, y, w, h, core, halo, cols, rows, done, current, slide }: {
  uid: string; x: number; y: number; w: number; h: number; core: number; halo: number; cols: number; rows: number;
  done: [number, number][]; current: [number, number]; slide: number;
}) {
  const stride = core;
  const cx = (c: number) => x + halo + c * stride;
  const cy = (r: number) => y + halo + r * stride;
  return (
    <g>
      <defs>
        <clipPath id={`${uid}-raster`}><rect x={x} y={y} width={w} height={h} rx={8} /></clipPath>
      </defs>
      <Panel x={x} y={y} w={w} h={h} />
      <g clipPath={`url(#${uid}-raster)`}>
        <Fields x={x} y={y} sx={w / 352} sy={h / 232} />
        {done.map(([c, r]) => (
          <rect key={`${c}-${r}`} x={cx(c)} y={cy(r)} width={core} height={core} fill={ACCENT} fillOpacity={0.14} />
        ))}
        <g stroke={LINE_SOFT} strokeWidth={1} strokeDasharray="2 3">
          {Array.from({ length: cols + 1 }, (_, i) => <path key={`v${i}`} d={`M${cx(i)} ${cy(0)}V${cy(rows)}`} />)}
          {Array.from({ length: rows + 1 }, (_, i) => <path key={`h${i}`} d={`M${cx(0)} ${cy(i)}H${cx(cols)}`} />)}
        </g>
        <g transform={`translate(${cx(current[0])-halo} ${cy(current[1])-halo})`}>
          <Win core={core} halo={halo} />
          <g className={ANIM.travel} style={travel(slide * stride, 0)}>
            <Win core={core} halo={halo} />
          </g>
        </g>
      </g>
      <Panel x={x} y={y} w={w} h={h} fill="none" />
    </g>
  );
}

/* Cover: district raster with the sliding window, then blend, rolling buffer and seam check on the right. */
const Cover: CoverComponent = ({ uid, title, className }) => (
  <CoverFrame uid={uid} title={title} className={className} glow={[240, 160, 220]}>
    <text {...caption} x={40} y={44}>District raster</text>
    <text {...caption} x={600} y={44} textAnchor="end">Blend, buffer, verify</text>

    <WindowGrid uid={uid} x={40} y={56} w={320} h={200} core={56} halo={14} cols={5} rows={3}
      done={[[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [0, 1], [1, 1]]} current={[2, 1]} slide={2} />

    <Panel x={392} y={56} w={208} h={64} />
    <text {...caption} x={404} y={70}>cross-fade weights in the overlap</text>
    <path d="M404 80H448C472 80 480 104 504 104H588" fill="none" stroke={ACCENT} strokeWidth={1.25} />
    <path d="M404 104H448C472 104 480 80 504 80H588" fill="none" stroke={GREEN} strokeWidth={1.25} />
    <g transform="translate(404 92)">
      <g className={ANIM.travel} style={travel(184, 0, 400)}>
        <circle r={2.4} fill={PAPER} />
      </g>
    </g>

    <Panel x={392} y={132} w={208} h={64} />
    <text {...caption} x={404} y={146}>rolling buffer, two tiles tall</text>
    <rect x={404} y={152} width={120} height={9} rx={2} fill={GREEN} fillOpacity={0.4} />
    <rect x={404} y={165} width={120} height={9} rx={2} fill={ACCENT} fillOpacity={0.35} />
    <rect x={404} y={178} width={120} height={9} rx={2} fill={ACCENT} fillOpacity={0.15} className={ANIM.pulse} />
    <text {...mono} x={532} y={159.5} fill={GREEN}>written</text>
    <text {...mono} x={532} y={172.5}>in buffer</text>
    <text {...mono} x={532} y={185.5} fill={TEXT_MUTED}>next row</text>

    <Panel x={392} y={208} w={208} h={48} />
    <text {...caption} x={404} y={222}>gradient on edges vs control</text>
    <rect x={404} y={228} width={100} height={7} rx={2} fill={ROSE} fillOpacity={0.8} className={ANIM.grow} style={{ transformOrigin: 'left center' }} />
    <rect x={404} y={241} width={40} height={7} rx={2} fill={TEXT_MUTED} fillOpacity={0.7} className={ANIM.grow} style={{ transformOrigin: 'left center', animationDelay: '150ms' }} />
    <text {...mono} x={532} y={234.5} fill={ROSE}>edges</text>
    <text {...mono} x={532} y={247.5} fill={TEXT_MUTED}>control</text>

    <Tag x={40} y={300} text="Overlapping windows" />
    <Tag x={168} y={300} text="Gaussian weights" tone="accent" />
    <Tag x={280} y={300} text="TTA" />
    <Tag x={320} y={300} text="Windowed write" tone="green" />
    <Tag x={420} y={300} text="Seam detector" tone="rose" />
  </CoverFrame>
);

/* Figure 1: window with halo sliding over the raster; window anatomy on the right. */
const HaloWindow: CoverComponent = ({ uid, title, className }) => (
  <CoverFrame uid={uid} title={title} className={className} glow={[220, 180, 220]}>
    <text {...caption} x={40} y={44}>District raster, windows in read order</text>
    <text {...caption} x={600} y={44} textAnchor="end">Window anatomy</text>

    <WindowGrid uid={uid} x={40} y={64} w={352} h={232} core={64} halo={16} cols={5} rows={3}
      done={[[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [0, 1]]} current={[1, 1]} slide={3} />

    <Panel x={424} y={64} w={176} h={200} />
    <rect x={444} y={84} width={136} height={136} fill={ACCENT} fillOpacity={0.05} stroke={ACCENT} strokeOpacity={0.55} strokeWidth={1.25} strokeDasharray="3 3" />
    <rect x={468} y={108} width={88} height={88} fill={ACCENT} fillOpacity={0.14} stroke={ACCENT} strokeWidth={1.5} />
    <text {...caption} x={512} y={99} textAnchor="middle">halo</text>
    <text {...label} x={512} y={156} textAnchor="middle">core</text>
    <circle cx={468} cy={152} r={24} fill="none" stroke={AMBER} strokeOpacity={0.8} strokeWidth={1.25} strokeDasharray="3 3" className={ANIM.pulse} />
    <circle cx={468} cy={152} r={2} fill={AMBER} />
    <text {...caption} x={468} y={186} textAnchor="middle" fill={AMBER}>receptive field</text>
    <path d="M436 84H440M436 108H440M438 84V108" stroke={LINE} strokeWidth={1} />
    <text {...mono} x={433} y={99} textAnchor="end">h</text>
    <path d="M444 232V236M580 232V236M444 234H580" stroke={LINE} strokeWidth={1} />
    <text {...mono} x={512} y={252} textAnchor="middle">W = core + 2h</text>

    <Tag x={40} y={316} text="halo h: half the effective receptive field" />
    <Tag x={296} y={316} text="stride = core" tone="accent" />
    <Tag x={390} y={316} text="halo down-weighted or dropped" />
  </CoverFrame>
);

/* Figure 2: weight of window A across the overlap for plain averaging and Gaussian weighting; 2D map on the right. */
const WeightBlend: CoverComponent = ({ uid, title, className }) => (
  <CoverFrame uid={uid} title={title} className={className} glow={[226, 180, 220]}>
    <defs>
      <radialGradient id={`${uid}-gw`} cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor={ACCENT} stopOpacity="0.75" />
        <stop offset="0.5" stopColor={ACCENT} stopOpacity="0.35" />
        <stop offset="1" stopColor={ACCENT} stopOpacity="0.04" />
      </radialGradient>
      <clipPath id={`${uid}-sq`}><rect x={440} y={80} width={144} height={144} /></clipPath>
    </defs>
    <text {...caption} x={40} y={44}>Two windows, one overlap</text>
    <text {...caption} x={600} y={44} textAnchor="end">2D weight map</text>

    <rect x={72} y={64} width={188} height={36} rx={4} fill={ACCENT} fillOpacity={0.12} stroke={ACCENT} strokeOpacity={0.5} strokeWidth={1.25} />
    <rect x={192} y={64} width={188} height={36} rx={4} fill={GREEN} fillOpacity={0.12} stroke={GREEN} strokeOpacity={0.5} strokeWidth={1.25} />
    <rect x={192} y={64} width={68} height={36} fill="#fff" fillOpacity={0.06} />
    <text {...label} x={132} y={86} textAnchor="middle" fill={ACCENT}>window A</text>
    <text {...caption} x={226} y={86} textAnchor="middle">overlap</text>
    <text {...label} x={320} y={86} textAnchor="middle" fill={GREEN}>window B</text>

    <Panel x={40} y={112} w={352} h={144} />
    <g stroke={LINE_SOFT} strokeWidth={1}>
      <path d="M72 132H380M72 180H380M72 228H380" />
    </g>
    <text {...mono} x={64} y={135} textAnchor="end">1</text>
    <text {...mono} x={64} y={183} textAnchor="end">0.5</text>
    <text {...mono} x={64} y={231} textAnchor="end">0</text>
    <path d="M192 124V236M260 124V236" stroke={LINE} strokeWidth={1} strokeDasharray="3 3" />
    <path d="M72 132H192V180H260V228H380" fill="none" stroke={ROSE} strokeOpacity={0.9} strokeWidth={1.25} />
    <circle cx={192} cy={180} r={3} fill={ROSE} />
    <circle cx={260} cy={228} r={3} fill={ROSE} />
    <path d="M72 228H192C214 228 238 132 260 132H380" fill="none" stroke={GREEN} strokeOpacity={0.6} strokeWidth={1.25} />
    <path d="M72 132H192C214 132 238 228 260 228H380" fill="none" stroke={ACCENT} strokeWidth={1.5} />
    <g transform="translate(72 124)">
      <g className={ANIM.travel} style={travel(308, 0)}>
        <path d="M0 0V112" stroke={ACCENT} strokeOpacity={0.5} strokeWidth={1} />
        <circle r={2.5} fill={PAPER} />
      </g>
    </g>
    <text {...caption} x={380} y={248} textAnchor="end">weight of window A across the overlap</text>

    <Tag x={40} y={274} text="plain average" tone="rose" />
    <Tag x={136} y={274} text="Gaussian weight" tone="accent" />
    <Tag x={244} y={274} text="window B" tone="green" />
    <text {...caption} x={40} y={302}>A step in the weight is a step in the output: that is the seam.</text>

    <Panel x={424} y={64} w={176} h={192} />
    <rect x={440} y={80} width={144} height={144} fill={`url(#${uid}-gw)`} stroke={LINE} strokeWidth={1.25} />
    <circle cx={512} cy={152} r={24} fill="none" stroke={LINE_SOFT} strokeWidth={1} strokeDasharray="2 3" />
    <circle cx={512} cy={152} r={48} fill="none" stroke={LINE_SOFT} strokeWidth={1} strokeDasharray="2 3" />
    <g clipPath={`url(#${uid}-sq)`}>
      <g className={ANIM.scan} style={{ transformOrigin: '512px 80px' }}>
        <rect x={441} y={81} width={142} height={2} fill={PAPER} fillOpacity={0.5} />
      </g>
    </g>
    <text {...mono} x={512} y={155} textAnchor="middle" fill={PAPER}>1.0</text>
    <text {...mono} x={578} y={218} textAnchor="end" fill={TEXT}>near 0</text>
    <text {...caption} x={512} y={244} textAnchor="middle">Gaussian, sigma = W / 8</text>
    <Tag x={424} y={274} text="per-pixel weight" />
    <Tag x={532} y={274} text="floor 1e-3" />
  </CoverFrame>
);

/* Figure 3: window edges over the probability map on the left; gradient on edges vs control lines on the right. */
const SeamDetector: CoverComponent = ({ uid, title, className }) => {
  const edgesX = [108, 116, 180, 188];
  const edgesY = [132, 140, 204, 212];
  const ctrlX = [74, 148, 222];
  const ctrlY = [98, 172, 246];
  const bars: [number, number, string, number][] = [
    [102, 152, ROSE, 0],
    [124, 56, TEXT_MUTED, 150],
    [192, 62, ACCENT, 300],
    [214, 56, TEXT_MUTED, 450],
  ];
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[300, 170, 220]}>
      <defs>
        <clipPath id={`${uid}-map`}><rect x={40} y={64} width={216} height={216} rx={8} /></clipPath>
      </defs>
      <text {...caption} x={40} y={44}>Probability map with window edges</text>
      <text {...caption} x={600} y={44} textAnchor="end">Gradient on edges vs control lines</text>

      <Panel x={40} y={64} w={216} h={216} />
      <g clipPath={`url(#${uid}-map)`}>
        <Fields x={40} y={64} sx={216 / 352} sy={216 / 232} />
        <rect x={104} y={64} width={16} height={216} fill={ROSE} fillOpacity={0.08} />
        <rect x={176} y={64} width={16} height={216} fill={ROSE} fillOpacity={0.08} />
        <rect x={40} y={128} width={216} height={16} fill={ROSE} fillOpacity={0.08} />
        <rect x={40} y={200} width={216} height={16} fill={ROSE} fillOpacity={0.08} />
        <g stroke={ROSE} strokeOpacity={0.7} strokeWidth={1} strokeDasharray="3 3">
          {edgesX.map((x) => <path key={x} d={`M${x} 64V280`} />)}
          {edgesY.map((y) => <path key={y} d={`M40 ${y}H256`} />)}
        </g>
        <g stroke={LINE} strokeOpacity={0.6} strokeWidth={1} strokeDasharray="1 3">
          {ctrlX.map((x) => <path key={x} d={`M${x} 64V280`} />)}
          {ctrlY.map((y) => <path key={y} d={`M40 ${y}H256`} />)}
        </g>
        <g className={ANIM.scan} style={{ transformOrigin: '148px 64px' }}>
          <rect x={41} y={66} width={214} height={3} fill={ACCENT} fillOpacity={0.55} />
        </g>
      </g>
      <Tag x={40} y={300} text="window edges" tone="rose" />
      <Tag x={128} y={300} text="control lines" />

      <Panel x={288} y={64} w={312} h={192} />
      <text {...label} x={304} y={88}>plain average</text>
      <text {...label} x={304} y={178}>Gaussian weight</text>
      <text {...caption} x={404} y={110} textAnchor="end">on edges</text>
      <text {...caption} x={404} y={132} textAnchor="end">control</text>
      <text {...caption} x={404} y={200} textAnchor="end">on edges</text>
      <text {...caption} x={404} y={222} textAnchor="end">control</text>
      {bars.map(([y, w, fill, ms]) => (
        <rect key={y} x={416} y={y} width={w} height={10} rx={2} fill={fill} fillOpacity={0.8} className={ANIM.grow} style={{ transformOrigin: 'left center', animationDelay: `${ms}ms` }} />
      ))}
      <text {...mono} x={416} y={152} fill={ROSE}>ratio well above 1: seam</text>
      <text {...mono} x={416} y={242} fill={ACCENT}>ratio close to 1: clean</text>

      <text {...mono} x={288} y={278}>score = mean grad on edge bands / mean grad on control bands</text>
      <Tag x={288} y={300} text="Sobel on p" />
      <Tag x={364} y={300} text="band 2 px" />
      <Tag x={436} y={300} text="run per stripe" tone="accent" />
    </CoverFrame>
  );
};

export const COVER: CoverComponent = Cover;

export const FIGURES: Record<string, CoverComponent> = {
  'tiled-inference-large-rasters/halo-window': HaloWindow,
  'tiled-inference-large-rasters/weight-blend': WeightBlend,
  'tiled-inference-large-rasters/seam-detector': SeamDetector,
};
