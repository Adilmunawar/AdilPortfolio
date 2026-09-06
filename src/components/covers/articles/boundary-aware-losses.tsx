'use client';
import type { CSSProperties } from 'react';
import { ACCENT, AMBER, ANIM, caption, CoverFrame, GREEN, label, LINE, LINE_SOFT, mono, NODE_FILL_2, Panel, ROSE, Tag, TEXT_MUTED, type CoverComponent } from '../shared';

const PAPER = '#f2f4f8';

const SHOW = 'bal-show';
const DRAW = 'bal-draw';
const TRACE = 'bal-trace';
const TRAVEL = 'bal-travel';

const CSS = `
.bal-travel{opacity:0}
@media (hover:hover) and (min-width:768px){
.cover-live .bal-show{animation:bal-show 10s linear infinite both}
.cover-live .bal-draw{stroke-dasharray:1;stroke-dashoffset:1;animation:bal-draw 10s linear infinite both}
.cover-live .bal-trace{stroke-dasharray:1;stroke-dashoffset:1;animation:bal-trace 10s linear infinite both}
.cover-live .bal-travel{animation:bal-travel 10s linear infinite both}
}
@media (prefers-reduced-motion:reduce){
.bal-show,.bal-draw,.bal-trace,.bal-travel{animation:none!important;stroke-dashoffset:0!important}
}
@keyframes bal-show{0%{opacity:0}6%{opacity:1}96%{opacity:1}100%{opacity:0}}
@keyframes bal-draw{0%{stroke-dashoffset:1;opacity:1}20%{stroke-dashoffset:0}96%{stroke-dashoffset:0;opacity:1}100%{stroke-dashoffset:0;opacity:0}}
@keyframes bal-trace{0%{stroke-dashoffset:1;opacity:1}40%{stroke-dashoffset:0}96%{stroke-dashoffset:0;opacity:1}100%{stroke-dashoffset:0;opacity:0}}
@keyframes bal-travel{0%{offset-distance:0%;opacity:0}2%{opacity:1}38%{opacity:1}40%{offset-distance:100%;opacity:0}100%{offset-distance:100%;opacity:0}}
`;

const Style = () => <style>{CSS}</style>;

const at = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` });

const travel = (path: string, ms = 0): CSSProperties => ({
  offsetPath: `path("${path}")`,
  offsetRotate: '0deg',
  animationDelay: `${ms}ms`,
});

/* Signed distance bands around a closed parcel: the zero level draws in first, then the bands grow outward from it. */
function SignedBands({ uid, d, panel, start }: { uid: string; d: string; panel: [number, number, number, number]; start: number }) {
  const [px, py, pw, ph] = panel;
  const widths: [number, number, number][] = [[72, 0.12, 2000], [48, 0.2, 1600], [24, 0.34, 1200]];
  return (
    <g>
      <defs>
        <clipPath id={`${uid}-in`}><path d={d} /></clipPath>
        <clipPath id={`${uid}-out`}><path d={`M${px} ${py}H${px + pw}V${py + ph}H${px}Z ${d}`} clipRule="evenodd" /></clipPath>
      </defs>
      <g clipPath={`url(#${uid}-in)`} fill="none" stroke={ACCENT} strokeLinejoin="round">
        {widths.map(([w, a, ms]) => <path key={w} d={d} strokeWidth={w} strokeOpacity={a} className={SHOW} style={at(start + ms)} />)}
      </g>
      <g clipPath={`url(#${uid}-out)`} fill="none" stroke={AMBER} strokeLinejoin="round">
        {widths.map(([w, a, ms]) => <path key={w} d={d} strokeWidth={w} strokeOpacity={a} className={SHOW} style={at(start + ms)} />)}
      </g>
      <path d={d} pathLength={1} fill="none" stroke={PAPER} strokeWidth={1.5} strokeLinejoin="round" className={DRAW} style={at(start)} />
    </g>
  );
}

/* Cover: signed distance around a parcel on the left, the loss weight schedule on the right. */
const Cover: CoverComponent = ({ uid, title, className }) => (
  <CoverFrame uid={uid} title={title} className={className} glow={[300, 160, 220]}>
    <Style />
    <text {...caption} x={40} y={44}>Signed distance around a parcel</text>
    <text {...caption} x={600} y={44} textAnchor="end">Loss schedule</text>

    <Panel x={40} y={56} w={280} h={200} />
    <SignedBands uid={uid} d="M88 96L200 80L296 120L284 220L176 244L64 200Z" panel={[41, 57, 278, 198]} start={0} />
    <g className={SHOW} style={at(2400)}>
      <text {...label} x={180} y={166} textAnchor="middle" fill={ACCENT}>phi below 0</text>
      <text {...caption} x={52} y={76} fill={AMBER}>phi above 0</text>
    </g>

    <Panel x={352} y={56} w={248} h={200} />
    <text {...caption} x={372} y={70}>loss weights over training</text>
    <path d="M372 80H584M372 148H584" stroke={LINE_SOFT} strokeWidth={1} />
    <path d="M372 216H584" stroke={LINE} strokeWidth={1.25} />
    <path d="M472 216V220" stroke={LINE} strokeWidth={1.25} />
    <path d="M372 80L472 134H584" pathLength={1} fill="none" stroke={ACCENT} strokeWidth={1.5} className={TRACE} style={at(3000)} />
    <path d="M372 216L472 162H584" pathLength={1} fill="none" stroke={AMBER} strokeWidth={1.5} className={TRACE} style={at(3000)} />
    <text {...mono} x={584} y={126} textAnchor="end" fill={ACCENT}>(1-alpha) CE + Dice</text>
    <text {...mono} x={584} y={176} textAnchor="end" fill={AMBER}>alpha boundary loss</text>
    <text {...mono} x={372} y={232}>0</text>
    <text {...mono} x={472} y={232} textAnchor="middle">ramp end</text>
    <text {...mono} x={584} y={232} textAnchor="end">epoch</text>
    <g transform="translate(372 216)">
      <g className={TRAVEL} style={travel('M0 0 L212 0', 3000)}>
        <path d="M0 -136V0" stroke={PAPER} strokeOpacity={0.25} strokeWidth={1} />
      </g>
      <g className={TRAVEL} style={travel('M0 -136 L100 -82 L212 -82', 3000)}>
        <circle r={3} fill={ACCENT} />
      </g>
      <g className={TRAVEL} style={travel('M0 0 L100 -54 L212 -54', 3000)}>
        <circle r={3} fill={AMBER} />
      </g>
    </g>

    <g className={SHOW} style={at(3000)}><Tag x={40} y={300} text="Distance-weighted CE" /></g>
    <g className={SHOW} style={at(3300)}><Tag x={172} y={300} text="Dice" /></g>
    <g className={SHOW} style={at(3600)}><Tag x={216} y={300} text="Boundary loss" tone="amber" /></g>
    <g className={SHOW} style={at(2400)}><Tag x={310} y={300} text="Signed distance map" tone="accent" /></g>
    <g className={SHOW} style={at(7400)}><Tag x={438} y={300} text="Boundary F score" tone="green" /></g>
  </CoverFrame>
);

/* Figure 1: one label row, the votes each pixel gets under plain and distance weighted cross-entropy. */
const PixelImbalance: CoverComponent = ({ uid, title, className }) => {
  const n = 24;
  const edge = [11, 12];
  const px = (i: number) => 56 + i * 10;
  const dist = (i: number) => Math.min(...edge.map((e) => Math.abs(i-e)));
  const isEdge = (i: number) => edge.includes(i);
  const weighted = (i: number) => 4 + 30 * Math.exp(-(dist(i) ** 2) / 8);
  const idx = Array.from({ length: n }, (_, i) => i);
  const reach = (i: number) => Math.round((4000 * i) / (n-1));
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[220, 180, 220]}>
      <Style />
      <text {...caption} x={40} y={44}>One row of the label raster</text>
      <text {...caption} x={600} y={44} textAnchor="end">Why it gets worse with size</text>

      <Panel x={40} y={56} w={352} h={256} />
      <text {...caption} x={56} y={78}>label row</text>
      {idx.map((i) => (
        <rect key={i} x={px(i)} y={84} width={10} height={18} fill={isEdge(i) ? ROSE : NODE_FILL_2} fillOpacity={isEdge(i) ? 0.8 : 1} stroke={LINE_SOFT} strokeWidth={1} />
      ))}
      <g transform="translate(61 93)">
        <g className={TRAVEL} style={travel('M0 0 L230 0', 0)}>
          <circle r={6} fill="none" stroke={ACCENT} strokeWidth={1.5} />
        </g>
      </g>

      <text {...caption} x={56} y={124}>cross-entropy: one vote per pixel</text>
      {idx.map((i) => (
        <rect key={i} x={px(i) + 1} y={142} width={8} height={14} fill={isEdge(i) ? ROSE : TEXT_MUTED} fillOpacity={isEdge(i) ? 0.8 : 0.45} className={SHOW} style={at(reach(i))} />
      ))}

      <text {...caption} x={56} y={178}>distance-weighted: votes concentrate at the line</text>
      {idx.map((i) => {
        const h = weighted(i);
        return <rect key={i} x={px(i) + 1} y={228-h} width={8} height={h} fill={isEdge(i) ? ROSE : ACCENT} fillOpacity={isEdge(i) ? 0.8 : 0.5} className={SHOW} style={at(reach(i) + 150)} />;
      })}

      <text {...caption} x={56} y={250}>summed vote, plain cross-entropy</text>
      <path d="M58 263H274" pathLength={1} stroke={TEXT_MUTED} strokeOpacity={0.6} strokeWidth={10} strokeLinecap="round" className={DRAW} style={at(4400)} />
      <text {...mono} x={284} y={266.5} className={SHOW} style={at(4600)}>background x22</text>
      <path d="M58 281H74" pathLength={1} stroke={ROSE} strokeOpacity={0.8} strokeWidth={10} strokeLinecap="round" className={DRAW} style={at(5000)} />
      <text {...mono} x={84} y={284.5} fill={ROSE} className={SHOW} style={at(5200)}>boundary x2</text>
      <text {...mono} x={56} y={302} fill={TEXT_MUTED} className={SHOW} style={at(6000)}>22 votes say background, 2 say boundary</text>

      <Panel x={424} y={56} w={176} h={176} />
      <rect x={456} y={80} width={112} height={112} fill={GREEN} fillOpacity={0.15} className={SHOW} style={at(6400)} />
      <rect x={456} y={80} width={112} height={112} pathLength={1} fill="none" stroke={ROSE} strokeOpacity={0.85} strokeWidth={3} className={DRAW} style={at(6800)} />
      <text {...label} x={512} y={140} textAnchor="middle" className={SHOW} style={at(6400)}>interior n squared</text>
      <text {...caption} x={512} y={212} textAnchor="middle" fill={ROSE} className={SHOW} style={at(7000)}>boundary 4n</text>
      <text {...mono} x={424} y={252} className={SHOW} style={at(7800)}>boundary share is about 4/n</text>
      <text {...mono} x={424} y={268} className={SHOW} style={at(8100)}>n = 64 gives about 6 %</text>
      <text {...mono} x={424} y={284} fill={TEXT_MUTED} className={SHOW} style={at(8400)}>a minority at any parcel size</text>

      <g className={SHOW} style={at(8800)}><Tag x={40} y={334} text="argmax: all background" tone="rose" /></g>
      <g className={SHOW} style={at(9200)}><Tag x={180} y={334} text="loss looks fine" tone="amber" /></g>
    </CoverFrame>
  );
};

/* Figure 2: signed distance bands around a parcel; the integrand phi times s along a transect on the right. */
const SignedDistance: CoverComponent = ({ uid, title, className }) => (
  <CoverFrame uid={uid} title={title} className={className} glow={[240, 180, 220]}>
    <Style />
    <text {...caption} x={40} y={44}>Signed distance map</text>
    <text {...caption} x={600} y={44} textAnchor="end">Integrand along a transect</text>

    <Panel x={40} y={64} w={280} h={232} />
    <SignedBands uid={uid} d="M96 120L200 100L272 140L256 240L160 264L80 220Z" panel={[41, 65, 278, 230]} start={0} />
    <g className={SHOW} style={at(2400)}>
      <text {...label} x={176} y={188} textAnchor="middle" fill={ACCENT}>phi below 0 inside</text>
      <text {...caption} x={56} y={96} fill={AMBER}>phi above 0 outside</text>
    </g>
    <text {...caption} x={304} y={288} textAnchor="end" fill={PAPER} className={SHOW} style={at(1200)}>phi = 0 on the boundary</text>
    {/* Transect at y 206 crosses the right edge of the parcel at x 261, so it is centred on the boundary like the chart. */}
    <path d="M208 206H314" pathLength={1} stroke={PAPER} strokeOpacity={0.55} strokeWidth={1} className={DRAW} style={at(3000)} />
    <g transform="translate(208 206)">
      <g className={TRAVEL} style={travel('M0 0 L106 0', 3400)}>
        <circle r={3} fill={PAPER} />
      </g>
    </g>

    <Panel x={352} y={64} w={248} h={232} />
    <text {...caption} x={368} y={84}>phi times s across the edge</text>
    <rect x={476} y={104} width={56} height={152} fill={ROSE} fillOpacity={0.1} className={SHOW} style={at(5400)} />
    <text {...caption} x={504} y={98} textAnchor="middle" fill={ROSE} className={SHOW} style={at(5800)}>s above 0 while phi above 0</text>
    <path d="M368 180H584" stroke={LINE} strokeWidth={1.25} />
    <path d="M476 100V262" stroke={LINE} strokeWidth={1} strokeDasharray="3 3" />
    <path d="M368 112H460C484 112 508 248 532 248H584" pathLength={1} fill="none" stroke={GREEN} strokeWidth={1.25} className={DRAW} style={at(2600)} />
    <path d="M368 236L476 180" pathLength={1} fill="none" stroke={ACCENT} strokeWidth={1.5} className={DRAW} style={at(3400)} />
    <path d="M476 180L584 124" pathLength={1} fill="none" stroke={AMBER} strokeWidth={1.5} className={DRAW} style={at(5400)} />
    <g transform="translate(368 236)">
      <g className={TRAVEL} style={travel('M0 0 L216 -112', 3400)}>
        <circle r={3} fill={PAPER} />
      </g>
    </g>
    <text {...mono} x={368} y={196}>inside</text>
    <text {...mono} x={584} y={196} textAnchor="end">outside</text>
    <text {...caption} x={476} y={276} textAnchor="middle">true boundary</text>

    <g className={SHOW} style={at(7800)}><Tag x={40} y={316} text="L = mean over pixels of phi times s" tone="accent" /></g>
    <g className={SHOW} style={at(2000)}><Tag x={352} y={316} text="phi signed distance" tone="amber" /></g>
    <g className={SHOW} style={at(2600)}><Tag x={476} y={316} text="s softmax" tone="green" /></g>
    <g className={SHOW} style={at(5800)}><Tag x={546} y={316} text="penalised" tone="rose" /></g>
  </CoverFrame>
);

/* Figure 3: prediction against the tolerance band around the reference; precision, recall and F on the right. */
const ToleranceBand: CoverComponent = ({ uid, title, className }) => {
  const gt: [number, number][] = [[64, 200], [88, 160], [112, 134], [136, 140], [160, 184], [184, 226], [208, 244], [232, 232], [252, 196], [276, 166], [300, 148], [324, 140], [344, 144]];
  const pred: [number, number][] = [[64, 208], [88, 168], [112, 142], [136, 148], [160, 192], [184, 234], [200, 268], [214, 272], [232, 240], [252, 204], [276, 172], [300, 154], [324, 146], [344, 150]];
  const outside = new Set([6, 7]);
  const pts = (p: [number, number][]) => p.map(([x, y]) => `${x},${y}`).join(' ');
  const cum = pred.reduce<number[]>((acc, [x, y], i) => {
    if (i === 0) return [0];
    const [qx, qy] = pred[i-1];
    return [...acc, acc[i-1] + Math.hypot(x-qx, y-qy)];
  }, []);
  const total = cum[cum.length-1];
  const reach = (i: number) => 2400 + Math.round((4000 * cum[i]) / total);
  const scores: [string, string, number, string, number][] = [
    ['precision', '12 / 14', 151, GREEN, 6600],
    ['recall', '12 / 13', 162, GREEN, 7000],
    ['F', '0.89', 156, ACCENT, 7400],
  ];
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[220, 180, 220]}>
      <Style />
      <text {...caption} x={40} y={44}>Prediction against a tolerance band</text>
      <text {...caption} x={600} y={44} textAnchor="end">What the numbers say</text>

      <Panel x={40} y={64} w={320} h={232} />
      <polyline points={pts(gt)} fill="none" stroke={ACCENT} strokeOpacity={0.14} strokeWidth={28} strokeLinejoin="round" strokeLinecap="round" className={SHOW} style={at(1400)} />
      <polyline points={pts(gt)} pathLength={1} fill="none" stroke={PAPER} strokeOpacity={0.85} strokeWidth={1.5} strokeLinejoin="round" className={DRAW} style={at(0)} />
      <polyline points={pts(pred)} pathLength={1} fill="none" stroke={GREEN} strokeWidth={1.5} strokeLinejoin="round" className={TRACE} style={at(2400)} />
      {pred.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={outside.has(i) ? 3 : 2.5} fill={outside.has(i) ? ROSE : GREEN} className={SHOW} style={at(reach(i))} />
      ))}
      <g className={SHOW} style={at(reach(7) + 200)}>
        <circle cx={208} cy={244} r={4.5} fill="none" stroke={ROSE} strokeWidth={1.25} className={ANIM.pulse} />
      </g>
      <g className={SHOW} style={at(600)}><Tag x={40} y={316} text="ground truth" /></g>
      <g className={SHOW} style={at(1600)}><Tag x={128} y={316} text="tolerance band" tone="accent" /></g>
      <g className={SHOW} style={at(2600)}><Tag x={228} y={316} text="prediction" tone="green" /></g>
      <g className={SHOW} style={at(reach(6) + 300)}><Tag x={304} y={316} text="outside band" tone="rose" /></g>

      <Panel x={392} y={64} w={208} h={232} />
      <text {...label} x={408} y={88}>Boundary F score at tau</text>
      {scores.map(([name, value, w, fill, ms], i) => {
        const y = 112 + i * 30;
        return (
          <g key={name}>
            <text {...caption} x={408} y={y}>{name}</text>
            <text {...mono} x={584} y={y} textAnchor="end" className={SHOW} style={at(ms + 200)}>{value}</text>
            <path d={`M412 ${y + 10}H${404 + w}`} pathLength={1} stroke={fill} strokeOpacity={0.8} strokeWidth={8} strokeLinecap="round" className={DRAW} style={at(ms)} />
          </g>
        );
      })}
      <path d="M408 200H584" stroke={LINE_SOFT} strokeWidth={1} />
      <text {...caption} x={408} y={216}>1 px line, shifted by 1 px</text>
      <g className={SHOW} style={at(7800)}>
        {Array.from({ length: 10 }, (_, i) => (
          <rect key={`g${i}`} x={408 + i * 10} y={222} width={10} height={10} fill={PAPER} fillOpacity={0.7} stroke={LINE_SOFT} strokeWidth={1} />
        ))}
      </g>
      <g className={SHOW} style={at(8200)}>
        {Array.from({ length: 10 }, (_, i) => (
          <rect key={`p${i}`} x={408 + i * 10} y={234} width={10} height={10} fill={GREEN} fillOpacity={0.6} stroke={LINE_SOFT} strokeWidth={1} />
        ))}
      </g>
      <text {...mono} x={408} y={266} fill={ROSE} className={SHOW} style={at(8600)}>IoU = 0</text>
      <text {...mono} x={408} y={282} fill={GREEN} className={SHOW} style={at(9000)}>boundary F at tau = 2 px: 1.0</text>
    </CoverFrame>
  );
};

export const COVER: CoverComponent = Cover;

export const FIGURES: Record<string, CoverComponent> = {
  'boundary-aware-losses/pixel-imbalance': PixelImbalance,
  'boundary-aware-losses/signed-distance': SignedDistance,
  'boundary-aware-losses/tolerance-band': ToleranceBand,
};
