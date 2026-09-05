'use client';
import type { CSSProperties } from 'react';
import { ACCENT, AMBER, ANIM, caption, CoverFrame, Edge, GREEN, LINE, LINE_SOFT, mono, NODE_FILL_2, Panel, ROSE, Tag, TEXT_MUTED, type CoverComponent } from '../shared';

const PAPER = '#f2f4f8';

const travel = (dx: number, dy: number, ms = 0): CSSProperties => ({
  offsetPath: `path("M0 0 L${dx} ${dy}")`,
  offsetRotate: '0deg',
  animationDelay: `${ms}ms`,
});
const grow = (ms: number): CSSProperties => ({ transformOrigin: 'left center', animationDelay: `${ms}ms` });

const PROMPT = ['The', 'KV', 'cac', 'he', 'is', 'read', 'each', 'step'];

/* A row of token boxes; with stagger set, boxes appear left to right. */
function TokenRow({ x, y, w, h, gap, tokens, tone = 'muted', stagger = 0 }: {
  x: number; y: number; w: number; h: number; gap: number; tokens: string[]; tone?: 'muted' | 'accent'; stagger?: number;
}) {
  const accent = tone === 'accent';
  return (
    <g>
      {tokens.map((t, i) => {
        const bx = x + i * (w + gap);
        return (
          <g key={`${t}-${i}`} className={stagger ? ANIM.grow : undefined} style={stagger ? grow(i * stagger) : undefined}>
            <rect x={bx} y={y} width={w} height={h} rx={3} fill={accent ? ACCENT : NODE_FILL_2} fillOpacity={accent ? 0.22 : 1} stroke={accent ? ACCENT : LINE} strokeOpacity={accent ? 0.7 : 1} strokeWidth={1} />
            <text {...mono} x={bx + w / 2} y={y + h / 2 + 3.5} textAnchor="middle">{t}</text>
          </g>
        );
      })}
    </g>
  );
}

/* Cache cells, rows are layers and columns are token positions; stagger fills columns left to right. */
function CacheGrid({ x, y, cols, rows, cw, ch, gx, gy, outline = false, stagger = 0, from = 0, opacity = 0.4 }: {
  x: number; y: number; cols: number; rows: number; cw: number; ch: number; gx: number; gy: number; outline?: boolean; stagger?: number; from?: number; opacity?: number;
}) {
  const cells: [number, number][] = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) cells.push([r, c]);
  return (
    <g>
      {cells.map(([r, c]) => (
        <rect
          key={`${r}-${c}`}
          x={x + c * (cw + gx)}
          y={y + r * (ch + gy)}
          width={cw}
          height={ch}
          rx={2}
          fill={outline ? 'none' : ACCENT}
          fillOpacity={outline ? undefined : opacity}
          stroke={outline ? LINE_SOFT : undefined}
          strokeWidth={outline ? 1 : undefined}
          className={stagger ? ANIM.grow : undefined}
          style={stagger ? grow(from + c * stagger) : undefined}
        />
      ))}
    </g>
  );
}

/* One sequence in a batch slot: a dark prefill segment then a lighter decode run. */
function Seq({ x, y, w, tone }: { x: number; y: number; w: number; tone: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={16} rx={3} fill={tone} fillOpacity={0.26} stroke={tone} strokeOpacity={0.55} strokeWidth={1} />
      <rect x={x} y={y} width={14} height={16} rx={3} fill={tone} fillOpacity={0.8} />
    </g>
  );
}

function Idle({ x, y, w }: { x: number; y: number; w: number }) {
  return <rect x={x} y={y} width={w} height={16} rx={3} fill={ROSE} fillOpacity={0.1} stroke={ROSE} strokeOpacity={0.5} strokeWidth={1} strokeDasharray="3 3" />;
}

/* Cover: cache filling on the left, batching slots and a verified draft on the right. */
const Cover: CoverComponent = ({ uid, title, className }) => (
  <CoverFrame uid={uid} title={title} className={className} glow={[240, 170, 220]}>
    <text {...caption} x={40} y={44}>Prefill fills the cache, decode reads it every step</text>
    <text {...caption} x={600} y={44} textAnchor="end">Slots and drafts</text>

    <Panel x={40} y={56} w={320} h={200} />
    <TokenRow x={56} y={70} w={30} h={18} gap={4} tokens={PROMPT} />
    <Edge d="M190 92V100" uid={uid} />
    <CacheGrid x={56} y={104} cols={8} rows={6} cw={30} ch={16} gx={4} gy={4} outline />
    <CacheGrid x={56} y={104} cols={8} rows={6} cw={30} ch={16} gx={4} gy={4} stagger={120} />
    <g transform="translate(56 104)">
      <g className={ANIM.travel} style={travel(238, 0, 1000)}>
        <rect width={30} height={116} fill={PAPER} fillOpacity={0.16} />
      </g>
    </g>
    <text {...caption} x={56} y={240}>per token: 2 x layers x kv heads x head dim x bytes</text>

    <Panel x={376} y={56} w={224} h={92} />
    <text {...mono} x={392} y={79.5} fill={TEXT_MUTED}>s0</text>
    <text {...mono} x={392} y={101.5} fill={TEXT_MUTED}>s1</text>
    <text {...mono} x={392} y={123.5} fill={TEXT_MUTED}>s2</text>
    <Seq x={412} y={68} w={176} tone={ACCENT} />
    <Seq x={412} y={90} w={80} tone={ACCENT} />
    <Seq x={496} y={90} w={92} tone={GREEN} />
    <Seq x={412} y={112} w={124} tone={ACCENT} />
    <Seq x={540} y={112} w={48} tone={GREEN} />
    <g transform="translate(412 68)">
      <g className={ANIM.travel} style={travel(176, 0)}>
        <path d="M0 0V60" stroke={PAPER} strokeOpacity={0.7} strokeWidth={1} />
      </g>
    </g>
    <text {...caption} x={392} y={140}>continuous batching: a freed slot is refilled</text>

    <Panel x={376} y={164} w={224} h={92} />
    <text {...caption} x={392} y={182}>draft tokens after one verify pass</text>
    {[
      ['the', GREEN, false],
      ['cache', GREEN, false],
      ['is', GREEN, false],
      ['at', AMBER, false],
      ['every', ROSE, true],
    ].map(([t, tone, dead], i) => (
      <g key={t as string}>
        <rect x={392 + i * 42} y={196} width={36} height={22} rx={3} fill={tone as string} fillOpacity={dead ? 0.05 : 0.22} stroke={tone as string} strokeOpacity={dead ? 0.5 : 0.75} strokeWidth={1} strokeDasharray={dead ? '3 3' : undefined} />
        <text {...mono} x={410 + i * 42} y={210.5} textAnchor="middle" fill={dead ? TEXT_MUTED : (tone as string)}>{t as string}</text>
      </g>
    ))}
    <text {...caption} x={392} y={240}>accept, accept, accept, resample, discard</text>

    <Tag x={40} y={290} text="KV cache" tone="accent" />
    <Tag x={108} y={290} text="paged blocks" />
    <Tag x={196} y={290} text="continuous batching" />
    <Tag x={324} y={290} text="speculative decoding" tone="green" />
    <Tag x={458} y={290} text="fp8 cache" tone="amber" />
    <text {...mono} x={40} y={322}>decode is memory bound: bytes moved per token set the latency floor</text>
  </CoverFrame>
);

/* Figure 1: prefill writes every column of the cache at once; decode reads all of them and appends one. */
const PrefillDecode: CoverComponent = ({ uid, title, className }) => (
  <CoverFrame uid={uid} title={title} className={className} glow={[320, 180, 220]}>
    <text {...caption} x={40} y={44}>Prefill: the whole prompt in one pass</text>
    <text {...caption} x={600} y={44} textAnchor="end">Decode: one token per step</text>

    <Panel x={40} y={56} w={272} h={240} />
    <TokenRow x={56} y={70} w={26} h={18} gap={4} tokens={PROMPT} />
    <Edge d="M174 92V110" uid={uid} />
    <text {...caption} x={182} y={104}>all positions at once</text>
    <CacheGrid x={56} y={116} cols={8} rows={6} cw={26} ch={14} gx={4} gy={4} outline />
    <CacheGrid x={56} y={116} cols={8} rows={6} cw={26} ch={14} gx={4} gy={4} stagger={120} />
    <text {...caption} x={56} y={236}>KV cache: one column of K and V per token</text>
    <Tag x={56} y={268} text="compute bound" tone="accent" />
    <Tag x={152} y={268} text="matrix x matrix" />

    <Panel x={328} y={56} w={272} h={240} />
    <TokenRow x={344} y={70} w={22} h={18} gap={5} tokens={PROMPT} />
    <g className={ANIM.blink}>
      <rect x={560} y={70} width={22} height={18} rx={3} fill={ACCENT} fillOpacity={0.25} stroke={ACCENT} strokeWidth={1} />
      <text {...mono} x={571} y={82.5} textAnchor="middle" fill={ACCENT}>new</text>
    </g>
    <Edge d="M571 110V94" uid={uid} />
    <CacheGrid x={344} y={116} cols={8} rows={6} cw={22} ch={14} gx={5} gy={4} outline />
    <CacheGrid x={344} y={116} cols={8} rows={6} cw={22} ch={14} gx={5} gy={4} />
    {Array.from({ length: 6 }, (_, r) => (
      <rect key={r} x={560} y={116 + r * 18} width={22} height={14} rx={2} fill={ACCENT} fillOpacity={0.18} stroke={ACCENT} strokeOpacity={0.7} strokeWidth={1} strokeDasharray="2 2" className={ANIM.blink} />
    ))}
    <g transform="translate(344 116)">
      <g className={ANIM.travel} style={travel(189, 0)}>
        <rect width={22} height={104} fill={PAPER} fillOpacity={0.18} />
      </g>
    </g>
    <text {...caption} x={344} y={236}>reads every column, writes one</text>
    <Tag x={344} y={268} text="memory bound" tone="rose" />
    <Tag x={432} y={268} text="matrix x vector" />

    <text {...mono} x={40} y={320}>FLOPs per byte moved: prefill reads a weight once per prompt, decode reads it once per token</text>
  </CoverFrame>
);

/* Figure 2: four slots under static batching, then the same four under continuous batching. */
const STATIC_1 = [240, 120, 180, 80];
const STATIC_2 = [220, 140, 236, 60];
const CONT: [number, number][][] = [
  [[104, 240], [348, 236]],
  [[104, 120], [228, 180], [412, 176]],
  [[104, 180], [288, 140], [432, 156]],
  [[104, 80], [188, 200], [392, 196]],
];

const ContinuousBatching: CoverComponent = ({ uid, title, className }) => (
  <CoverFrame uid={uid} title={title} className={className} glow={[320, 190, 240]}>
    <text {...caption} x={40} y={44}>Static batching: four slots, one batch at a time</text>
    <Panel x={40} y={56} w={560} h={112} />
    {STATIC_1.map((w, i) => {
      const y = 68 + i * 22;
      return (
        <g key={`s1-${i}`}>
          <text {...mono} x={52} y={y + 11.5} fill={TEXT_MUTED}>slot {i}</text>
          <Seq x={104} y={y} w={w} tone={ACCENT} />
          {w < 240 && <Idle x={104 + w + 4} y={y} w={240 - w - 4} />}
          <Seq x={352} y={y} w={STATIC_2[i]} tone={GREEN} />
          {STATIC_2[i] < 236 && <Idle x={352 + STATIC_2[i] + 4} y={y} w={236 - STATIC_2[i] - 4} />}
        </g>
      );
    })}
    <path d="M348 62V154" stroke={LINE} strokeWidth={1} strokeDasharray="3 3" />
    <g transform="translate(104 68)">
      <g className={ANIM.travel} style={travel(484, 0)}>
        <path d="M0 0V82" stroke={PAPER} strokeOpacity={0.7} strokeWidth={1} />
      </g>
    </g>
    <text {...caption} x={104} y={162}>the next batch starts only when the longest sequence of this one ends</text>

    <text {...caption} x={40} y={190}>Continuous batching: the scheduler runs at every decode step</text>
    <Panel x={40} y={202} w={560} h={112} />
    {CONT.map((row, i) => {
      const y = 214 + i * 22;
      return (
        <g key={`c-${i}`}>
          <text {...mono} x={52} y={y + 11.5} fill={TEXT_MUTED}>slot {i}</text>
          {row.map(([x, w], j) => <Seq key={`${x}-${j}`} x={x} y={y} w={w} tone={j % 2 === 0 ? ACCENT : GREEN} />)}
        </g>
      );
    })}
    <g transform="translate(104 214)">
      <g className={ANIM.travel} style={travel(484, 0)}>
        <path d="M0 0V82" stroke={PAPER} strokeOpacity={0.7} strokeWidth={1} />
      </g>
    </g>
    <text {...caption} x={104} y={308}>a slot frees at the next step and the newcomer's prefill runs in that same step</text>

    <Tag x={40} y={336} text="idle slot" tone="rose" />
    <Tag x={112} y={336} text="prefill" tone="accent" />
    <Tag x={172} y={336} text="decode" />
    <Tag x={228} y={336} text="new request joins at the next step" tone="green" />
  </CoverFrame>
);

/* Figure 3: draft proposes five tokens, the target verifies them in one pass, the rule keeps a prefix. */
const DRAFT = ['the', 'cache', 'is', 'read', 'every'];
const RATIO = ['p/q 1.3', 'p/q 0.9', 'p/q 0.6', 'p/q 0.1', 'p/q 0.8'];
const RESULT: [string, string, boolean][] = [['the', GREEN, false], ['cache', GREEN, false], ['is', GREEN, false], ['at', AMBER, false], ['every', ROSE, true]];
const COL = (i: number) => 148 + i * 72;

const SpeculativeDecoding: CoverComponent = ({ uid, title, className }) => (
  <CoverFrame uid={uid} title={title} className={className} glow={[320, 190, 240]}>
    <text {...caption} x={40} y={44}>Draft proposes, target verifies, the acceptance rule keeps the target's distribution</text>

    <Panel x={40} y={56} w={560} h={76} />
    <text {...caption} x={56} y={74}>draft model: five cheap sequential steps</text>
    <rect x={56} y={88} width={76} height={26} rx={3} fill={NODE_FILL_2} stroke={LINE} strokeWidth={1} />
    <text {...mono} x={94} y={104.5} textAnchor="middle" fill={TEXT_MUTED}>context</text>
    <Edge d="M134 101H146" uid={uid} />
    {DRAFT.map((t, i) => (
      <g key={t}>
        <g className={ANIM.grow} style={grow(i * 220)}>
          <rect x={COL(i)} y={88} width={56} height={26} rx={3} fill={ACCENT} fillOpacity={0.18} stroke={ACCENT} strokeOpacity={0.7} strokeWidth={1} />
          <text {...mono} x={COL(i) + 28} y={104.5} textAnchor="middle">{t}</text>
        </g>
        {i < 4 && <Edge d={`M${COL(i) + 58} 101H${COL(i) + 70}`} uid={uid} />}
      </g>
    ))}
    <text {...caption} x={508} y={97}>q from five</text>
    <text {...caption} x={508} y={109}>cheap passes</text>

    <Panel x={40} y={148} w={560} h={76} />
    <text {...caption} x={56} y={166}>target model: one forward pass scores all positions in parallel</text>
    <path d="M144 176H496V212H144Z" fill="none" stroke={ACCENT} strokeOpacity={0.7} strokeWidth={1.25} pathLength={1} className={ANIM.draw} />
    {RATIO.map((t, i) => (
      <g key={t}>
        <rect x={COL(i)} y={180} width={56} height={26} rx={3} fill={i === 3 ? ROSE : ACCENT} fillOpacity={0.14} stroke={i === 3 ? ROSE : ACCENT} strokeOpacity={0.6} strokeWidth={1} />
        <text {...mono} x={COL(i) + 28} y={196.5} textAnchor="middle" fill={i === 3 ? ROSE : undefined}>{t}</text>
      </g>
    ))}
    <text {...caption} x={508} y={189}>one pass, cost</text>
    <text {...caption} x={508} y={201}>about one token</text>

    <Panel x={40} y={240} w={560} h={76} />
    <text {...caption} x={56} y={258}>result: accepted prefix, one corrected token, the rest discarded</text>
    {RESULT.map(([t, tone, dead], i) => (
      <g key={t}>
        <rect x={COL(i)} y={272} width={56} height={26} rx={3} fill={tone} fillOpacity={dead ? 0.05 : 0.2} stroke={tone} strokeOpacity={dead ? 0.5 : 0.75} strokeWidth={1} strokeDasharray={dead ? '3 3' : undefined} />
        <text {...mono} x={COL(i) + 28} y={288.5} textAnchor="middle" fill={dead ? TEXT_MUTED : tone}>{t}</text>
      </g>
    ))}
    <text {...caption} x={508} y={281}>four tokens from</text>
    <text {...caption} x={508} y={293}>one target pass</text>

    <Tag x={40} y={340} text="accept if u < p/q" tone="green" />
    <Tag x={156} y={340} text="else sample from max(0, p minus q), stop" tone="amber" />
    <Tag x={400} y={340} text="output is exactly p" />
  </CoverFrame>
);

export const COVER: CoverComponent = Cover;

export const FIGURES: Record<string, CoverComponent> = {
  'llm-inference-internals/prefill-decode': PrefillDecode,
  'llm-inference-internals/continuous-batching': ContinuousBatching,
  'llm-inference-internals/speculative-decoding': SpeculativeDecoding,
};
