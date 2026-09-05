'use client';
import type { CSSProperties } from 'react';
import { ACCENT, AMBER, ANIM, caption, CoverFrame, Edge, GREEN, label, LINE, LINE_SOFT, mono, NODE_FILL, NODE_FILL_2, Panel, ROSE, Tag, TEXT, TEXT_MUTED, type CoverComponent } from '../shared';

const INK = '#0b0f17';
const SEASON_DAYS = 365;
const ndviAt = (d: number) => 0.12 + 0.6 * Math.exp(-(((d-70) / 32) ** 2)) + 0.55 * Math.exp(-(((d-255) / 38) ** 2));

/* Day of year and quality of each raw acquisition: g clear, c cloud, s shadow. */
const RAW: [number, 'g' | 'c' | 's'][] = [
  [2, 'g'], [7, 'c'], [15, 'c'], [22, 'g'], [27, 'g'], [37, 'g'], [42, 's'], [52, 'g'], [57, 'g'], [67, 'g'], [77, 'g'], [82, 'g'],
  [92, 'g'], [102, 'g'], [107, 'c'], [117, 'g'], [127, 'g'], [132, 'g'], [142, 'g'], [152, 'g'], [157, 's'], [167, 'g'], [177, 'g'],
  [182, 'c'], [192, 'c'], [202, 'c'], [207, 'c'], [217, 'c'], [222, 's'], [232, 'c'], [242, 'c'], [247, 'c'], [257, 'g'], [267, 'c'],
  [272, 'g'], [282, 'g'], [292, 'g'], [302, 'g'], [307, 'g'], [317, 'g'], [327, 's'], [337, 'g'], [347, 'c'], [352, 'g'], [362, 'g'],
];
const rawValue = (d: number, q: 'g' | 'c' | 's') => (q === 'g' ? ndviAt(d) : q === 'c' ? ndviAt(d) * 0.3 : ndviAt(d) * 0.62);
const CLEAR = RAW.filter(([, q]) => q === 'g').map(([d]) => d);

const STEP = 10;
const MAX_GAP = 40;
type GridStep = { d: number; value: number; state: 'observed' | 'filled' | 'stale' };
const GRID: GridStep[] = Array.from({ length: SEASON_DAYS / STEP + 1 }, (_, i): GridStep => {
  const d = i * STEP;
  const prev = CLEAR.filter((c) => c <= d).pop();
  const next = CLEAR.find((c) => c >= d);
  const near = CLEAR.some((c) => Math.abs(c-d) <= STEP / 2);
  if (prev === undefined || next === undefined || d-prev > MAX_GAP) return { d, value: 0, state: 'stale' };
  const t = next === prev ? 0 : (d-prev) / (next-prev);
  return { d, value: ndviAt(prev) + t * (ndviAt(next)-ndviAt(prev)), state: near ? 'observed' : 'filled' };
});

const PLOT_X = 64;
const PLOT_W = 520;
const dayX = (d: number) => PLOT_X + (d / SEASON_DAYS) * PLOT_W;
const MONSOON: [number, number] = [182, 247];
const STATE_TONE = { observed: GREEN, filled: AMBER, stale: TEXT_MUTED } as const;

const travel = (dx: number, dy: number, delayMs: number): CSSProperties => ({
  offsetPath: `path("M0 0 L${dx} ${dy}")`,
  offsetRotate: '0deg',
  animationDelay: `${delayMs}ms`,
});

/* Raw acquisitions with cloud and shadow dips flagged, then the same parcel on a regular grid with fills and stale steps marked. */
const MaskingResampling: CoverComponent = ({ uid, title, className }) => {
  const rawBase = 152;
  const gridBase = 296;
  const scale = 100;
  const rawPath = RAW.map(([d, q], i) => `${i ? 'L' : 'M'}${dayX(d).toFixed(1)} ${(rawBase-rawValue(d, q) * scale).toFixed(1)}`).join('');
  const gridPath = GRID.map((g, i) => `${i ? 'L' : 'M'}${dayX(g.d).toFixed(1)} ${(gridBase-g.value * scale).toFixed(1)}`).join('');
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[320, 180, 240]}>
      <defs>
        <clipPath id={`${uid}-raw`}><rect x={41} y={57} width={558} height={110} /></clipPath>
      </defs>
      <text {...caption} x={40} y={44}>Raw L2A acquisitions, parcel median NDVI</text>
      <text {...caption} x={600} y={44} textAnchor="end">SCL + U-Net mask</text>

      <Panel x={40} y={56} w={560} h={112} />
      <rect x={dayX(MONSOON[0])} y={57} width={dayX(MONSOON[1])-dayX(MONSOON[0])} height={110} fill={ROSE} fillOpacity={0.06} />
      <path d={`M${PLOT_X} ${rawBase}H${PLOT_X + PLOT_W}`} stroke={LINE_SOFT} strokeWidth={1.25} />
      <path d={rawPath} fill="none" stroke="#ffffff" strokeOpacity={0.14} strokeWidth={1.25} strokeLinejoin="round" />
      {RAW.map(([d, q]) => {
        const cx = dayX(d);
        const cy = rawBase-rawValue(d, q) * scale;
        if (q === 'g') return <circle key={d} cx={cx} cy={cy} r={2.4} fill={GREEN} />;
        const tone = q === 'c' ? ROSE : AMBER;
        return (
          <g key={d} className={ANIM.blink} style={{ animationDelay: `${(d % 7) * 200}ms` }}>
            <circle cx={cx} cy={cy} r={2.6} fill={NODE_FILL} stroke={tone} strokeWidth={1.25} />
            <path d={`M${cx} ${cy-9}v4`} stroke={tone} strokeWidth={1.25} />
          </g>
        );
      })}
      <g clipPath={`url(#${uid}-raw)`}>
        <g transform={`translate(${PLOT_X} 0)`}>
          <g className={ANIM.travel} style={travel(PLOT_W, 0, 0)}>
            <line x1={0} y1={58} x2={0} y2={166} stroke={ACCENT} strokeOpacity={0.7} strokeWidth={1.25} />
          </g>
        </g>
      </g>

      <Edge d="M104 168V196" uid={uid} />
      <g transform="translate(104 168)">
        <g className={ANIM.travel} style={travel(0, 26, 600)}>
          <circle r={2.4} fill={ACCENT} />
        </g>
      </g>
      <text {...caption} x={120} y={186}>10-day grid, linear fill, age channel</text>
      <Tag x={344} y={183} text="monsoon gap" tone="rose" />

      <Panel x={40} y={200} w={560} h={112} />
      <rect x={dayX(MONSOON[0])} y={201} width={dayX(MONSOON[1])-dayX(MONSOON[0])} height={110} fill={ROSE} fillOpacity={0.06} />
      <path d={`M${PLOT_X} ${gridBase}H${PLOT_X + PLOT_W}`} stroke={LINE_SOFT} strokeWidth={1.25} />
      <path d={gridPath} pathLength={1} fill="none" stroke={ACCENT} strokeOpacity={0.9} strokeWidth={1.25} strokeLinejoin="round" className={ANIM.draw} />
      {GRID.map((g) => {
        const cx = dayX(g.d);
        const cy = gridBase-g.value * scale;
        return (
          <g key={g.d}>
            {g.state === 'observed' && <circle cx={cx} cy={cy} r={2.2} fill={GREEN} />}
            {g.state === 'filled' && <circle cx={cx} cy={cy} r={2.2} fill={NODE_FILL} stroke={AMBER} strokeWidth={1.25} />}
            {g.state === 'stale' && <path d={`M${cx} ${cy-3}v6`} stroke={TEXT_MUTED} strokeWidth={1.25} />}
            <rect x={cx-5} y={301} width={10} height={5} rx={1} fill={STATE_TONE[g.state]} fillOpacity={g.state === 'observed' ? 0.7 : 0.55} />
          </g>
        );
      })}
      {['Jan', 'Apr', 'Jul', 'Oct'].map((m, i) => (
        <text key={m} {...mono} x={dayX(i * 91)} y={326} textAnchor="middle">{m}</text>
      ))}

      <Tag x={40} y={344} text="clear" tone="green" />
      <Tag x={92} y={344} text="cloud" tone="rose" />
      <Tag x={148} y={344} text="shadow" tone="amber" />
      <Tag x={212} y={344} text="linear fill" tone="amber" />
      <Tag x={294} y={344} text="stale, zeroed" />
      <Tag x={600-("observed flag + age".length * 5.6 + 12)} y={344} text="observed flag + age" tone="accent" />
    </CoverFrame>
  );
};

/* Twelve grid steps read by forward and backward GRU passes, pooled by attention into class confidences. */
const STEPS = [0.15, 0.18, 0.28, 0.45, 0.62, 0.72, 0.7, 0.58, 0.4, 0.25, 0.18, 0.15];
const OBSERVED = [true, true, false, true, true, false, false, true, true, true, false, true];
const ATTN = [0.02, 0.03, 0.08, 0.14, 0.18, 0.2, 0.14, 0.1, 0.06, 0.03, 0.01, 0.01];
const CLASSES: [string, number, string][] = [['wheat', 0.78, GREEN], ['rice', 0.1, ACCENT], ['sugarcane', 0.06, AMBER], ['other', 0.06, TEXT_MUTED]];
const STEP_X0 = 96;
const STEP_DX = 40;
const STEP_W = 30;
const stepX = (i: number) => STEP_X0 + i * STEP_DX;
const stepCx = (i: number) => stepX(i) + STEP_W / 2;

const TemporalModel: CoverComponent = ({ uid, title, className }) => {
  const fwdY = 140;
  const bwdY = 176;
  const first = stepCx(0);
  const last = stepCx(STEPS.length-1);
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[330, 170, 230]}>
      <text {...caption} x={40} y={44}>Resampled sequence, one column per 10-day step</text>
      <text {...caption} x={600} y={44} textAnchor="end">BiGRU + attention pooling</text>

      <text {...caption} x={40} y={86}>input</text>
      <text {...caption} x={40} y={fwdY + 3}>forward</text>
      <text {...caption} x={40} y={bwdY + 3}>backward</text>
      <text {...caption} x={40} y={228}>attention</text>

      {STEPS.map((v, i) => {
        const x = stepX(i);
        const h = v * 32;
        return (
          <g key={i}>
            <line x1={stepCx(i)} y1={102} x2={stepCx(i)} y2={bwdY} stroke={LINE_SOFT} strokeWidth={1} />
            <rect x={x} y={62} width={STEP_W} height={40} rx={4} fill={NODE_FILL} stroke={LINE} strokeWidth={1.25} />
            <rect x={x + 4} y={100-h} width={22} height={h} rx={1} fill={ACCENT} fillOpacity={0.6} />
            {OBSERVED[i]
              ? <circle cx={x + 25} cy={67} r={2} fill={GREEN} />
              : <circle cx={x + 25} cy={67} r={2} fill={NODE_FILL} stroke={AMBER} strokeWidth={1} />}
          </g>
        );
      })}

      <Edge d={`M${first} ${fwdY}H${last + 12}`} uid={uid} />
      <Edge d={`M${last} ${bwdY}H${first-12}`} uid={uid} />
      {STEPS.map((_, i) => (
        <g key={i}>
          <circle cx={stepCx(i)} cy={fwdY} r={5} fill={NODE_FILL_2} stroke={ACCENT} strokeWidth={1.25} />
          <circle cx={stepCx(i)} cy={bwdY} r={5} fill={NODE_FILL_2} stroke={ACCENT} strokeWidth={1.25} />
        </g>
      ))}
      <g transform={`translate(${first} ${fwdY})`}>
        <g className={ANIM.travel} style={travel(last-first, 0, 0)}>
          <circle r={2.6} fill={ACCENT} />
          <circle r={6} fill={ACCENT} fillOpacity={0.25} />
        </g>
      </g>
      <g transform={`translate(${last} ${bwdY})`}>
        <g className={ANIM.travel} style={travel(first-last, 0, 1000)}>
          <circle r={2.6} fill={ACCENT} />
          <circle r={6} fill={ACCENT} fillOpacity={0.25} />
        </g>
      </g>

      {ATTN.map((w, i) => {
        const h = Math.max(2, w * 120);
        return (
          <rect
            key={i}
            x={stepX(i) + 8}
            y={236-h}
            width={14}
            height={h}
            rx={1.5}
            fill={AMBER}
            fillOpacity={0.75}
            className={w >= 0.14 ? ANIM.pulse : undefined}
            style={{ animationDelay: `${i * 120}ms` }}
          />
        );
      })}
      <path d={`M${first} 246H${last}`} stroke={LINE_SOFT} strokeWidth={1.25} />
      <Edge d="M331 246V262" uid={uid} />

      <Panel x={250} y={264} w={162} h={40} stroke={ACCENT} strokeOpacity={0.5} />
      <text {...label} x={331} y={281} textAnchor="middle">context vector</text>
      <text {...caption} x={331} y={295} textAnchor="middle">weighted sum over steps</text>
      <Edge d="M412 284H440" uid={uid} />

      <Panel x={444} y={252} w={156} h={96} />
      {CLASSES.map(([name, p, tone], i) => {
        const y = 266 + i * 17;
        return (
          <g key={name}>
            <text {...caption} x={452} y={y + 3}>{name}</text>
            <rect x={508} y={y-4} width={84} height={8} rx={2} fill={LINE_SOFT} />
            <rect x={508} y={y-4} width={84 * p} height={8} rx={2} fill={tone} fillOpacity={0.85} className={ANIM.grow} style={{ transformOrigin: 'left center', animationDelay: `${300 + i * 120}ms` }} />
          </g>
        );
      })}
      <text {...caption} x={452} y={341}>softmax over classes</text>
    </CoverFrame>
  );
};

/* Six by eight blocks dealt into five folds; fold 2 is the test fold. Right side shows the season split and the fold rotation. */
const FOLD_TONE = [ACCENT, GREEN, ROSE, AMBER, TEXT];
const TEST_FOLD = 2;
const FOLDS = [
  [0, 3, 1, 4, 2, 0, 3, 1],
  [2, 1, 4, 0, 3, 2, 1, 4],
  [3, 0, 2, 1, 4, 3, 0, 2],
  [1, 4, 3, 2, 0, 1, 4, 3],
  [4, 2, 0, 3, 1, 4, 2, 0],
  [0, 3, 1, 4, 2, 0, 3, 1],
];
const BLOCK = 40;
const MAP_X = 40;
const MAP_Y = 60;
const PARCEL_SHAPES: [number, number, number, number][] = [[5, 5, 13, 9], [21, 7, 12, 11], [7, 20, 15, 10], [25, 23, 9, 10]];

const SpatialBlocks: CoverComponent = ({ uid, title, className }) => (
  <CoverFrame uid={uid} title={title} className={className} glow={[200, 180, 230]}>
    <text {...caption} x={40} y={44}>District cut into square blocks, parcels inherit the block's fold</text>
    <text {...caption} x={600} y={44} textAnchor="end">Blocked folds, held-out season</text>

    <Panel x={MAP_X} y={MAP_Y} w={BLOCK * 8} h={BLOCK * 6} r={6} />
    {FOLDS.map((row, r) =>
      row.map((f, c) => {
        const x = MAP_X + c * BLOCK;
        const y = MAP_Y + r * BLOCK;
        const tone = FOLD_TONE[f];
        return (
          <g key={`${r}-${c}`}>
            <rect x={x} y={y} width={BLOCK} height={BLOCK} fill={tone} fillOpacity={f === TEST_FOLD ? 0.16 : 0.07} stroke={LINE_SOFT} strokeWidth={1} />
            {PARCEL_SHAPES.map(([px, py, pw, ph]) => (
              <rect key={px} x={x + px} y={y + py} width={pw} height={ph} rx={1} fill={tone} fillOpacity={f === TEST_FOLD ? 0.6 : 0.35} stroke={INK} strokeWidth={0.75} />
            ))}
            {f === TEST_FOLD && (
              <rect x={x + 1} y={y + 1} width={BLOCK-2} height={BLOCK-2} fill="none" stroke={ROSE} strokeWidth={1.25} className={ANIM.pulse} style={{ animationDelay: `${TEST_FOLD * 480}ms` }} />
            )}
          </g>
        );
      })
    )}
    <rect x={MAP_X} y={MAP_Y} width={BLOCK * 8} height={BLOCK * 6} rx={6} fill="none" stroke={LINE} strokeWidth={1.25} />

    <Panel x={384} y={60} w={216} h={84} />
    <text {...label} x={396} y={80}>Seasons kept apart</text>
    <Tag x={396} y={104} text="train" tone="green" />
    <rect x={460} y={100} width={128} height={8} rx={2} fill={GREEN} fillOpacity={0.5} />
    <Tag x={396} y={128} text="held out" tone="rose" />
    <rect x={460} y={124} width={128} height={8} rx={2} fill={ROSE} fillOpacity={0.5} />
    {[460, 492, 524, 556, 588].map((x) => <path key={x} d={`M${x} 110v3M${x} 134v3`} stroke={LINE} strokeWidth={1} />)}

    <Panel x={384} y={160} w={216} h={140} />
    <text {...label} x={396} y={180}>Five folds by block</text>
    {FOLD_TONE.map((_, k) => {
      const y = 194 + k * 20;
      return (
        <g key={k}>
          {FOLD_TONE.map((tone, j) => (
            <rect
              key={j}
              x={396 + j * 18}
              y={y}
              width={14}
              height={14}
              rx={2}
              fill={j === k ? ROSE : tone}
              fillOpacity={j === k ? 0.85 : 0.25}
              className={j === k ? ANIM.pulse : undefined}
              style={j === k ? { animationDelay: `${k * 480}ms` } : undefined}
            />
          ))}
          <text {...caption} x={496} y={y + 10}>{`fold ${k} is test`}</text>
        </g>
      );
    })}

    <Tag x={40} y={330} text="Split by block" />
    <Tag x={144} y={330} text="Buffer at fold edges" tone="amber" />
    <Tag x={284} y={330} text="Held-out season" tone="rose" />
    <Tag x={396} y={330} text="Scores on unseen blocks" tone="green" />
  </CoverFrame>
);

/* Cover: masked NDVI series -> BiGRU with attention -> parcels coloured by predicted crop. */
const COVER_PARCELS = [
  '6,6 70,6 66,50 6,44',
  '70,6 150,6 150,44 66,50',
  '6,44 66,50 58,104 6,98',
  '66,50 150,44 150,98 106,106 58,104',
  '6,98 58,104 54,154 6,154',
  '58,104 106,106 110,154 54,154',
  '106,106 150,98 150,154 110,154',
];
const COVER_TONES = [GREEN, ACCENT, GREEN, AMBER, ACCENT, GREEN, AMBER];
const COVER_RAW = RAW.filter(([d]) => d >= 20 && d <= 170);

const Cover: CoverComponent = ({ uid, title, className }) => {
  const base = 232;
  const x0 = 56;
  const w = 184;
  const cx = (d: number) => x0 + ((d-20) / 150) * w;
  const curve = COVER_RAW.filter(([, q]) => q === 'g').map(([d], i) => `${i ? 'L' : 'M'}${cx(d).toFixed(1)} ${(base-ndviAt(d) * 130).toFixed(1)}`).join('');
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[320, 170, 220]}>
      <text {...caption} x={40} y={44}>Masked NDVI per parcel</text>
      <text {...caption} x={600} y={44} textAnchor="end">Crop per parcel</text>

      <Panel x={40} y={72} w={216} h={176} />
      <path d={`M${x0} ${base}H${x0 + w}`} stroke={LINE_SOFT} strokeWidth={1.25} />
      <path d={curve} pathLength={1} fill="none" stroke={GREEN} strokeWidth={1.25} strokeLinejoin="round" className={ANIM.draw} />
      {COVER_RAW.map(([d, q]) => {
        const px = cx(d);
        const py = base-rawValue(d, q) * 130;
        if (q === 'g') return <circle key={d} cx={px} cy={py} r={2.2} fill={GREEN} />;
        return <circle key={d} cx={px} cy={py} r={2.4} fill={NODE_FILL} stroke={q === 'c' ? ROSE : AMBER} strokeWidth={1.25} className={ANIM.blink} style={{ animationDelay: `${(d % 5) * 200}ms` }} />;
      })}
      <text {...mono} x={x0} y={244}>rabi</text>
      <text {...mono} x={x0 + w} y={244} textAnchor="end">10-day grid</text>

      <g className={ANIM.flow}>
        <Edge uid={uid} d="M256 160H284" dashed />
        <Edge uid={uid} d="M404 160H432" dashed />
      </g>

      <Panel x={288} y={104} w={112} h={112} stroke={ACCENT} strokeOpacity={0.5} />
      <text {...label} x={344} y={126} textAnchor="middle">BiGRU</text>
      {[0.05, 0.1, 0.2, 0.28, 0.2, 0.1].map((a, i) => (
        <rect key={i} x={302 + i * 16} y={170-a * 110} width={10} height={a * 110} rx={1.5} fill={AMBER} fillOpacity={0.75} className={i === 3 ? ANIM.pulse : undefined} />
      ))}
      <text {...caption} x={344} y={186} textAnchor="middle">attention</text>
      <text {...caption} x={344} y={204} textAnchor="middle">pooling</text>

      <Panel x={436} y={72} w={164} h={176} />
      <g transform="translate(440 80)" stroke={INK} strokeWidth={1} strokeLinejoin="round">
        {COVER_PARCELS.map((pts, i) => (
          <polygon key={i} points={pts} fill={COVER_TONES[i]} fillOpacity={0.45} />
        ))}
        {COVER_PARCELS.map((pts, i) => (
          <polygon key={`o${i}`} points={pts} pathLength={1} fill="none" stroke={COVER_TONES[i]} strokeOpacity={0.9} strokeWidth={1.25} className={ANIM.draw} style={{ animationDelay: `${i * 140}ms` }} />
        ))}
      </g>

      <Tag x={40} y={288} text="Sentinel-2 L2A" tone="accent" />
      <Tag x={144} y={288} text="SCL + U-Net mask" />
      <Tag x={264} y={288} text="Spatial CV by block" tone="amber" />
      <Tag x={400} y={288} text="Per-parcel layer" tone="green" />
      <Tag x={512} y={288} text="PostGIS" tone="green" />
    </CoverFrame>
  );
};

export const COVER: CoverComponent = Cover;
export const FIGURES: Record<string, CoverComponent> = {
  'sentinel2-crop-timeseries/masking-resampling': MaskingResampling,
  'sentinel2-crop-timeseries/temporal-model': TemporalModel,
  'sentinel2-crop-timeseries/spatial-blocks': SpatialBlocks,
};
