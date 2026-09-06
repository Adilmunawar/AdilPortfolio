'use client';
import type { CSSProperties } from 'react';
import { ACCENT, AMBER, ANIM, caption, CoverFrame, Edge, GREEN, label, LINE, LINE_SOFT, mono, NODE_FILL, NODE_FILL_2, Panel, ROSE, Tag, TEXT, TEXT_MUTED, type CoverComponent } from '../shared';

const SPEED = 60;
const LOOP_PX = SPEED * 9; // every erb-* animation below runs a 9 s loop
const CSS = `
@media (hover: hover) and (min-width: 768px) {
  .cover-live .erb-travel { animation: erb-travel 9s linear infinite both; }
  .cover-live .erb-work { animation: erb-work 9s ease-in-out infinite; }
  .cover-live .erb-hold { animation: erb-hold 9s ease-in-out infinite; }
  .cover-live .erb-grow { animation: erb-grow 9s cubic-bezier(0.16, 1, 0.3, 1) infinite both; }
}
@media (prefers-reduced-motion: reduce) { .erb-travel, .erb-work, .erb-hold, .erb-grow { animation: none !important; } }
.erb-grow { transform-box: fill-box; transform-origin: left center; }
@keyframes erb-travel { from { offset-distance: calc(0% - var(--erb-pre, 0px)); } to { offset-distance: calc(100% + var(--erb-post, 0px)); } }
@keyframes erb-work { 0%, 15%, 100% { opacity: 0; } 4%, 11% { opacity: 1; } 7.5% { opacity: 0.45; } }
@keyframes erb-hold { 0%, 74%, 100% { opacity: 0; } 3%, 70% { opacity: 1; } }
@keyframes erb-grow { 0% { transform: scaleX(0); } 10%, 100% { transform: scaleX(1); } }
`;

const at = (s: number): CSSProperties => ({ animationDelay: `${s}s` });

// --erb-pre/--erb-post pad the ride to LOOP_PX so every pulse moves at SPEED and parks (clamped) at the far end until the loop restarts
const ride = (path: string, len: number, startS: number, reverse = false): CSSProperties => ({
  offsetPath: `path("${path}")`,
  offsetRotate: '0deg',
  animationDelay: `${startS}s`,
  animationDirection: reverse ? 'reverse' : undefined,
  ['--erb-pre' as string]: reverse ? `${LOOP_PX - len}px` : '0px',
  ['--erb-post' as string]: reverse ? '0px' : `${LOOP_PX - len}px`,
});

function Pulse({ path, len, startS, tone = ACCENT }: { path: string; len: number; startS: number; tone?: string }) {
  return (
    <g className="erb-travel" style={ride(path, len, startS)}>
      <circle r={2.4} fill={tone} />
      <circle r={5} fill={tone} fillOpacity={0.25} />
    </g>
  );
}

function Work({ x, y, w, h, r = 4, startS, tone = ACCENT }: { x: number; y: number; w: number; h: number; r?: number; startS: number; tone?: string }) {
  return <rect x={x} y={y} width={w} height={h} rx={r} fill={tone} fillOpacity={0.14} stroke={tone} strokeOpacity={0.55} strokeWidth={1} opacity={0} className="erb-work" style={at(startS)} />;
}

function Flash({ cx, cy, tone, startS }: { cx: number; cy: number; tone: string; startS: number }) {
  return <circle cx={cx} cy={cy} r={5.5} fill="none" stroke={tone} strokeWidth={1.25} opacity={0} className="erb-work" style={at(startS)} />;
}

function Bar({ x, y, w, value, tone, tick, tickTone = LINE, delayMs = 0 }: { x: number; y: number; w: number; value: number; tone: string; tick?: number; tickTone?: string; delayMs?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={8} rx={2} fill={LINE_SOFT} />
      <rect x={x} y={y} width={w * value} height={8} rx={2} fill={tone} fillOpacity={0.75} className="erb-grow" style={{ animationDelay: `${delayMs}ms` }} />
      {tick !== undefined && <path d={`M${x + w * tick} ${y - 3}v14`} stroke={tickTone} strokeWidth={1.25} />}
    </g>
  );
}

/* Plot helpers for the recall curve: k 1..10 across 300px, recall 0..1 over 152px. */
const kx = (k: number) => 88 + k * 30;
const ry = (r: number) => 264 - r * 152;
const stepPath = (values: number[]) =>
  values.map((v, i) => (i === 0 ? `M${kx(1)} ${ry(v)}` : `H${kx(i + 1)}V${ry(v)}`)).join('');
const BASELINE = [0.38, 0.52, 0.6, 0.66, 0.7, 0.74, 0.77, 0.8, 0.82, 0.84];
const CANDIDATE = [0.4, 0.58, 0.68, 0.75, 0.8, 0.84, 0.87, 0.9, 0.91, 0.92];

/* Card cover: golden set, pipeline stages, scoreboard. */
const RagCover: CoverComponent = ({ uid, title, className }) => {
  const ids = ['q_014', 'q_015', 'q_016', 'q_017'];
  const stages = ['hybrid retrieval', 'cross-encoder rerank', 'generate with citations', 'LLM judge'];
  const scores: [string, number, string][] = [['recall@5', 0.78, GREEN], ['MRR', 0.66, GREEN], ['faithfulness', 0.7, ACCENT], ['citation precision', 0.62, ACCENT]];
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[320, 160, 220]}>
      <style>{CSS}</style>
      <text {...caption} x={40} y={52}>Golden set</text>
      <text {...caption} x={320} y={52} textAnchor="middle">Pipeline under test</text>
      <text {...caption} x={600} y={52} textAnchor="end">Scoreboard</text>

      <Edge uid={uid} d="M176 160H228" />
      <Edge uid={uid} d="M408 160H460" />
      <g transform="translate(176 160)"><Pulse path="M-10 0 L66 0" len={76} startS={0.5} /></g>
      <g transform="translate(408 160)"><Pulse path="M-10 0 L66 0" len={76} startS={5.2} tone={GREEN} /></g>

      <Panel x={40} y={72} w={136} h={176} />
      {ids.map((id, i) => (
        <g key={id}>
          <text {...mono} x={56} y={104 + i * 26} fill={ACCENT}>{id}</text>
          <rect x={104} y={97 + i * 26} width={36 + (i % 2) * 16} height={6} rx={2} fill={GREEN} fillOpacity={0.55} />
        </g>
      ))}
      <Work x={48} y={92} w={120} h={18} r={3} startS={0} />
      <text {...caption} x={56} y={232} fill={TEXT_MUTED}>labelled by two people</text>

      <Panel x={232} y={72} w={176} h={176} />
      {stages.map((s, i) => (
        <g key={s}>
          <rect x={248} y={88 + i * 34} width={144} height={22} rx={4} fill={NODE_FILL_2} stroke={LINE_SOFT} strokeWidth={1} />
          <text {...caption} x={320} y={103 + i * 34} textAnchor="middle">{s}</text>
          <Work x={248} y={88 + i * 34} w={144} h={22} startS={1.7 + i * 0.8} />
        </g>
      ))}
      <text {...caption} x={320} y={236} textAnchor="middle" fill={TEXT_MUTED}>same seed, same k</text>

      <Panel x={464} y={72} w={136} h={176} />
      {scores.map(([name, v, tone], i) => (
        <g key={name}>
          <text {...caption} x={476} y={100 + i * 38}>{name}</text>
          <Bar x={476} y={106 + i * 38} w={112} value={v} tone={tone} delayMs={6400 + i * 150} />
        </g>
      ))}

      <Tag x={40} y={292} text="pgvector" />
      <Tag x={116} y={292} text="hybrid + rerank" tone="accent" />
      <Tag x={228} y={292} text="calibrated judge" />
      <Tag x={352} y={292} text="CI regression gate" tone="green" />
    </CoverFrame>
  );
};

/* Figure: golden items flow through the pipeline; each stage reports into the scoreboard. */
const HarnessFlow: CoverComponent = ({ uid, title, className }) => {
  const ids = ['q_014', 'q_015', 'q_016'];
  const stages: [number, string, string, number][] = [
    [80, 'hybrid retrieval', 'dense plus keyword', 2.0],
    [132, 'cross-encoder rerank', 'top candidates', 3.6],
    [184, 'generate with citations', 'k passages in context', 5.2],
    [236, 'LLM judge', 'strict output schema', 6.8],
  ];
  const metrics: [number, string, string, number][] = [
    [136, 'recall@k', GREEN, 4.1],
    [168, 'MRR, nDCG', GREEN, 5.6],
    [200, 'cost, p95 latency', AMBER, 7.1],
    [232, 'faithfulness', ACCENT, 8.8],
    [264, 'citation precision', ACCENT, 8.7],
  ];
  const reports: [number, number, number, number, string][] = [
    [98, 35, 86, 2.7, GREEN],
    [150, 15, 75, 4.3, GREEN],
    [202, -5, 72, 5.9, AMBER],
    [254, -25, 80, 7.5, ACCENT],
    [254, 7, 73, 7.5, ACCENT],
  ];
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[320, 176, 220]}>
      <style>{CSS}</style>
      <text {...caption} x={40} y={56}>Inputs</text>
      <text {...caption} x={320} y={56} textAnchor="middle">Pipeline under test</text>
      <text {...caption} x={600} y={56} textAnchor="end">Scoreboard</text>

      <Edge uid={uid} d="M320 116V128" />
      <Edge uid={uid} d="M320 168V180" />
      <Edge uid={uid} d="M320 220V232" />
      <Edge uid={uid} d="M184 150C212 150 212 98 236 98" dashed />
      <Edge uid={uid} d="M184 210C212 210 212 254 236 254" dashed />
      <Edge uid={uid} d="M400 98C428 98 428 133 452 133" dashed />
      <Edge uid={uid} d="M400 150C428 150 428 165 452 165" dashed />
      <Edge uid={uid} d="M400 202C428 202 428 197 452 197" dashed />
      <Edge uid={uid} d="M400 254C428 254 428 229 452 229" dashed />
      <Edge uid={uid} d="M400 254C428 254 428 261 452 261" dashed />
      <text {...caption} x={210} y={86} textAnchor="middle" fill={TEXT_MUTED}>questions</text>
      <text {...caption} x={210} y={276} textAnchor="middle" fill={TEXT_MUTED}>labels</text>

      <g transform="translate(184 150)"><Pulse path="M-10 0 L0 0 C28 0 28 -52 52 -52 L64 -52" len={100} startS={0.4} /></g>
      <g transform="translate(184 210)"><Pulse path="M-10 0 L0 0 C28 0 28 44 52 44 L64 44" len={94} startS={5.3} tone={GREEN} /></g>
      <g transform="translate(320 116)"><Pulse path="M0 -8 L0 22" len={30} startS={3.1} /></g>
      <g transform="translate(320 168)"><Pulse path="M0 -8 L0 22" len={30} startS={4.7} /></g>
      <g transform="translate(320 220)"><Pulse path="M0 -8 L0 22" len={30} startS={6.3} /></g>
      {reports.map(([y, dy, len, startS, tone]) => (
        <g key={`${y}-${dy}`} transform={`translate(400 ${y})`}>
          <Pulse path={`M-8 0 L0 0 C28 0 28 ${dy} 52 ${dy} L64 ${dy}`} len={len} startS={startS} tone={tone} />
        </g>
      ))}

      <Panel x={40} y={80} w={144} h={200} />
      <text {...label} x={56} y={104}>Golden set</text>
      {ids.map((id, i) => (
        <g key={id}>
          <text {...mono} x={56} y={136 + i * 32} fill={ACCENT}>{id}</text>
          <rect x={100} y={130 + i * 32} width={36 + (i % 2) * 8} height={6} rx={2} fill={GREEN} fillOpacity={0.55} />
          <rect x={148} y={130 + i * 32} width={24} height={6} rx={2} fill={ACCENT} fillOpacity={0.55} />
        </g>
      ))}
      <Work x={48} y={124} w={130} h={18} r={3} startS={0} />
      <rect x={56} y={234} width={10} height={6} rx={2} fill={GREEN} fillOpacity={0.55} />
      <text {...caption} x={72} y={240}>relevant spans</text>
      <rect x={56} y={252} width={10} height={6} rx={2} fill={ACCENT} fillOpacity={0.55} />
      <text {...caption} x={72} y={258}>reference answer</text>

      {stages.map(([y, name, sub, startS]) => (
        <g key={name}>
          <Panel x={240} y={y} w={160} h={36} />
          <text {...label} x={320} y={y + 15} textAnchor="middle">{name}</text>
          <text {...caption} x={320} y={y + 29} textAnchor="middle" fill={TEXT_MUTED}>{sub}</text>
          <Work x={240} y={y} w={160} h={36} r={8} startS={startS} />
        </g>
      ))}

      <Panel x={456} y={80} w={144} h={200} />
      <text {...label} x={472} y={104}>Scoreboard</text>
      {metrics.map(([y, name, tone, startS]) => (
        <g key={name}>
          <circle cx={468} cy={y - 3} r={2.5} fill={tone} fillOpacity={0.9} />
          <text {...caption} x={478} y={y}>{name}</text>
          <Flash cx={468} cy={y - 3} tone={tone} startS={startS} />
        </g>
      ))}

      <Tag x={40} y={316} text="versioned with the index snapshot" />
      <Tag x={256} y={316} text="per-slice reporting" tone="accent" />
      <Tag x={392} y={316} text="judge frozen per version" tone="green" />
    </CoverFrame>
  );
};

/* Figure: recall at k stepping up for baseline and candidate, with the served k marked. */
const RecallCurve: CoverComponent = ({ uid, title, className }) => {
  const hides: [number, string, string, string][] = [[120, 'recall@k', 'ignores order', GREEN], [168, 'MRR', 'ignores later hits', AMBER], [216, 'nDCG', 'ignores coverage', ACCENT]];
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[228, 180, 220]}>
      <style>{CSS}</style>
      <text {...caption} x={40} y={52}>recall at k</text>
      <text {...caption} x={600} y={52} textAnchor="end">What each metric hides</text>

      <Panel x={40} y={64} w={376} h={232} />
      <g fill="none" strokeLinejoin="round">
        <path d={stepPath(BASELINE)} stroke={TEXT} strokeWidth={1.25} />
        <path d={stepPath(CANDIDATE)} stroke={ACCENT} strokeWidth={1.5} />
      </g>
      <svg x={88} y={112} width={300} height={152}>
        <g className="erb-travel" style={ride('M302 0 L0 0', 302, 0.5, true)}>
          <rect width={300} height={152} fill={NODE_FILL} />
          <path d="M0 0V152" stroke={ACCENT} strokeOpacity={0.8} strokeWidth={1.25} />
        </g>
      </svg>
      <path d={`M${kx(5)} 112H${kx(10)}V264H${kx(5)}Z`} fill="#fff" fillOpacity={0.03} />
      <path d="M88 112H388M88 188H388" stroke={LINE_SOFT} strokeWidth={1.25} />
      <path d="M88 112V264H388" fill="none" stroke={LINE} strokeWidth={1.25} />
      <text {...mono} x={80} y={116} textAnchor="end">1.0</text>
      <text {...mono} x={80} y={192} textAnchor="end">0.5</text>
      <text {...mono} x={80} y={268} textAnchor="end">0</text>
      {Array.from({ length: 10 }, (_, i) => (
        <g key={i}>
          <path d={`M${kx(i + 1)} 264v4`} stroke={LINE} strokeWidth={1.25} />
          <text {...mono} x={kx(i + 1)} y={282} textAnchor="middle">{i + 1}</text>
        </g>
      ))}
      <text {...caption} x={404} y={282} fill={TEXT_MUTED}>k</text>

      <path d="M96 84H116" stroke={TEXT} strokeWidth={1.25} />
      <text {...caption} x={122} y={88}>baseline</text>
      <path d="M196 84H216" stroke={ACCENT} strokeWidth={1.5} />
      <text {...caption} x={222} y={88}>candidate</text>

      <path d={`M${kx(5)} 112V264`} stroke={AMBER} strokeOpacity={0.8} strokeWidth={1.25} strokeDasharray="4 4" />
      <text {...caption} x={kx(5)} y={106} textAnchor="middle" fill={AMBER}>k served</text>
      <Work x={214} y={97} w={48} h={13} r={3} startS={2.9} tone={AMBER} />
      <text {...caption} x={313} y={252} textAnchor="middle" fill={TEXT_MUTED}>gains here never reach the model</text>
      <Work x={232} y={243} w={162} h={13} r={3} startS={3.8} tone={AMBER} />

      <Panel x={456} y={64} w={144} h={232} />
      {hides.map(([y, name, sub, tone], i) => (
        <g key={name}>
          <text {...label} x={472} y={y} fill={tone}>{name}</text>
          <text {...caption} x={472} y={y + 16}>{sub}</text>
          <Work x={464} y={y - 13} w={128} h={37} startS={6 + i * 0.9} tone={tone} />
        </g>
      ))}
      <text {...caption} x={472} y={276} fill={TEXT_MUTED}>report all three</text>

      <Tag x={40} y={324} text="chunk level" tone="green" />
      <Tag x={132} y={324} text="document level" />
      <Tag x={240} y={324} text="span overlap" tone="accent" />
    </CoverFrame>
  );
};

/* Figure: a pull request runs the harness; retrieval rises, faithfulness falls, the gate blocks. */
const CiGate: CoverComponent = ({ uid, title, className }) => {
  const rows: [number, string, number, number, string, number?][] = [
    [128, 'recall@8', 0.74, 0.62, GREEN],
    [168, 'MRR', 0.61, 0.58, GREEN],
    [208, 'faithfulness', 0.72, 0.86, ROSE, 0.82],
    [248, 'p95 latency', 0.7, 0.5, AMBER, 0.75],
  ];
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[324, 168, 220]}>
      <style>{CSS}</style>
      <text {...caption} x={40} y={56}>Change</text>
      <text {...caption} x={324} y={56} textAnchor="middle">Harness against the main baseline</text>
      <text {...caption} x={600} y={56} textAnchor="end">Gate</text>

      <Edge uid={uid} d="M176 148H220" />
      <Edge uid={uid} d="M424 168H468" />
      <g transform="translate(176 148)"><Pulse path="M-10 0 L64 0" len={74} startS={0.3} /></g>
      <g transform="translate(424 168)"><Pulse path="M-10 0 L60 0" len={70} startS={5.9} tone={ROSE} /></g>

      <Panel x={40} y={88} w={136} h={120} />
      <text {...caption} x={56} y={112}>pull request</text>
      <text {...mono} x={56} y={140} fill={ACCENT}>top_k: 5 to 8</text>
      <text {...mono} x={56} y={162} fill={ACCENT}>query expansion</text>
      <text {...mono} x={56} y={184} fill={TEXT_MUTED}>chunker: same</text>
      <Work x={48} y={126} w={120} h={66} startS={0} />

      <Panel x={224} y={72} w={200} h={216} />
      <text {...label} x={240} y={96}>harness run</text>
      {rows.map(([y, name, value, base, tone, floor], i) => (
        <g key={name}>
          <text {...caption} x={240} y={y + 4}>{name}</text>
          <Bar x={316} y={y - 4} w={96} value={value} tone={tone} tick={base} delayMs={1800 + i * 1000} />
          {floor !== undefined && <path d={`M${316 + 96 * floor} ${y - 8}v16`} stroke={ROSE} strokeWidth={1.25} strokeDasharray="2 2" />}
          <Work x={232} y={y - 12} w={184} h={24} startS={1.6 + i} />
        </g>
      ))}
      <path d="M240 268v8" stroke={LINE} strokeWidth={1.25} />
      <text {...caption} x={248} y={276}>baseline</text>
      <path d="M312 268v8" stroke={ROSE} strokeWidth={1.25} strokeDasharray="2 2" />
      <text {...caption} x={320} y={276}>gate floor</text>

      <Panel x={472} y={112} w={128} h={112} stroke={ROSE} strokeOpacity={0.5} />
      <text {...label} x={488} y={136}>merge gate</text>
      <text {...mono} x={488} y={164} fill={ROSE}>BLOCKED</text>
      <circle cx={580} cy={160} r={3} fill={ROSE} className={ANIM.blink} />
      <text {...caption} x={488} y={188}>faithfulness fell</text>
      <text {...caption} x={488} y={204}>below the floor</text>
      <g className="erb-hold" opacity={0} style={at(0.7)}>
        <Panel x={472} y={112} w={128} h={112} stroke={AMBER} strokeOpacity={0.5} />
        <text {...label} x={488} y={136}>merge gate</text>
        <text {...mono} x={488} y={164} fill={AMBER}>PENDING</text>
        <circle cx={580} cy={160} r={3} fill={AMBER} className={ANIM.blink} />
        <text {...caption} x={488} y={188}>waiting for the</text>
        <text {...caption} x={488} y={204}>harness to finish</text>
      </g>

      <Tag x={40} y={320} text="tolerance from run-to-run variance" />
      <Tag x={260} y={320} text="nightly full set" tone="accent" />
      <Tag x={380} y={320} text="cost and latency gate too" tone="green" />
    </CoverFrame>
  );
};

export const COVER: CoverComponent = RagCover;

export const FIGURES: Record<string, CoverComponent> = {
  'evaluating-rag-before-tuning/harness-flow': HarnessFlow,
  'evaluating-rag-before-tuning/recall-curve': RecallCurve,
  'evaluating-rag-before-tuning/ci-gate': CiGate,
};
