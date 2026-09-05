'use client';
import type { CSSProperties } from 'react';
import { ACCENT, AMBER, ANIM, caption, CoverFrame, Edge, GREEN, LINE, LINE_SOFT, mono, NODE_FILL_2, Panel, ROSE, Tag, TEXT, TEXT_MUTED, type CoverComponent } from '../shared';

const travel = (path: string, ms = 0): CSSProperties => ({
  offsetPath: `path("${path}")`,
  offsetRotate: '0deg',
  animationDelay: `${ms}ms`,
});

/* One memory segment: name, gigabytes, colour, opacity. */
type Seg = [string, number, string, number];

/* Persistent state for a 500M parameter model plus the terms that move with precision and checkpointing. */
const segments = (activations: number, castCache: number): Seg[] => [
  ['weights', 2, TEXT, 0.55],
  ['gradients', 2, ACCENT, 0.85],
  ['Adam m and v', 4, AMBER, 0.85],
  ['cast cache', castCache, ACCENT, 0.4],
  ['activations', activations, GREEN, 0.7],
  ['workspace', 2, TEXT_MUTED, 0.45],
];

const ROWS: [string, number, number][] = [
  ['fp32 weights, fp32 Adam', 36, 0],
  ['bf16 autocast, fp32 master weights', 18, 1],
  ['bf16 autocast, checkpointed blocks', 6, 1],
];

const LEGEND = segments(1, 1);

/* A horizontal stacked bar; each segment grows from its own left edge in order. */
function MemoryBar({ x, y, h, scale, segs, delayMs }: { x: number; y: number; h: number; scale: number; segs: Seg[]; delayMs: number }) {
  let cursor = x;
  return (
    <g>
      {segs.map(([name, gb, fill, opacity], i) => {
        if (gb <= 0) return null;
        const w = gb * scale;
        const sx = cursor;
        cursor += w;
        return (
          <rect key={name} x={sx} y={y} width={w} height={h} fill={fill} fillOpacity={opacity} stroke={LINE_SOFT} strokeWidth={0.5} className={ANIM.grow} style={{ transformOrigin: 'left center', animationDelay: `${delayMs + i * 90}ms` }} />
        );
      })}
    </g>
  );
}

/* Cover: three bars against a 24 GB card on the left, the levers on the right. */
const Cover: CoverComponent = ({ uid, title, className }) => {
  const scale = 6.4;
  const x0 = 56;
  const card = x0 + 24 * scale;
  const levers = ['autocast bf16', 'GradScaler for fp16', 'checkpoint hot blocks', 'accumulate N micro batches', 'channels_last', 'fused AdamW', 'memory snapshot'];
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[220, 170, 220]}>
      <text {...caption} x={40} y={44}>Peak memory for one training step</text>
      <text {...caption} x={600} y={44} textAnchor="end">What moves it</text>

      <Panel x={40} y={56} w={352} h={240} />
      <path d={`M${card} 66V282`} stroke={ROSE} strokeOpacity={0.7} strokeWidth={1} strokeDasharray="3 3" />
      <text {...caption} x={card} y={78} textAnchor="middle" fill={ROSE}>24 GB card</text>
      {ROWS.map(([name, act, cache], r) => {
        const y = 100 + r * 62;
        const total = 10 + act + cache;
        return (
          <g key={name}>
            <text {...caption} x={x0} y={y-6}>{name}</text>
            <MemoryBar x={x0} y={y} h={18} scale={scale} segs={segments(act, cache)} delayMs={r * 250} />
            <text {...mono} x={x0 + total * scale + 6} y={y + 12.5} fill={total > 24 ? ROSE : GREEN}>{total} GB</text>
          </g>
        );
      })}

      <Panel x={424} y={56} w={176} h={240} />
      {levers.map((s, i) => (
        <g key={s}>
          <circle cx={440} cy={82 + i * 28} r={2.5} fill={i === 6 ? GREEN : ACCENT} fillOpacity={0.9} />
          <text {...caption} x={450} y={85 + i * 28}>{s}</text>
        </g>
      ))}

      <Tag x={40} y={324} text="weights + grads + Adam = 16 bytes per param" tone="amber" />
      <Tag x={308} y={324} text="activations scale with batch" tone="green" />
    </CoverFrame>
  );
};

/* Figure 1: the same model under three configurations, with the segments that never move and the one that does. */
const MemoryBudget: CoverComponent = ({ uid, title, className }) => {
  const scale = 9;
  const x0 = 64;
  const card = x0 + 24 * scale;
  let lx = 56;
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[300, 170, 240]}>
      <text {...caption} x={40} y={44}>Peak memory, 500M parameters, one micro batch, illustrative</text>
      <text {...caption} x={600} y={44} textAnchor="end">GB</text>

      <Panel x={40} y={56} w={560} h={232} />
      <path d={`M${card} 64V256`} stroke={ROSE} strokeOpacity={0.7} strokeWidth={1} strokeDasharray="3 3" />
      <text {...caption} x={card} y={76} textAnchor="middle" fill={ROSE}>24 GB card</text>
      {ROWS.map(([name, act, cache], r) => {
        const y = 92 + r * 62;
        const total = 10 + act + cache;
        return (
          <g key={name}>
            <text {...caption} x={x0} y={y-6}>{name}</text>
            <MemoryBar x={x0} y={y} h={22} scale={scale} segs={segments(act, cache)} delayMs={r * 250} />
            <text {...mono} x={x0 + total * scale + 8} y={y + 14.5} fill={total > 24 ? ROSE : GREEN}>{total} GB</text>
          </g>
        );
      })}
      <text {...mono} x={x0} y={272} fill={TEXT_MUTED}>8 GB of weights, gradients and Adam moments in every row; only the activation term moves</text>

      {LEGEND.map(([name, , fill, opacity]) => {
        const x = lx;
        lx += 14 + name.length * 5.4 + 18;
        return (
          <g key={name}>
            <rect x={x} y={326} width={10} height={10} rx={2} fill={fill} fillOpacity={opacity} />
            <text {...caption} x={x + 14} y={334.5}>{name}</text>
          </g>
        );
      })}
    </CoverFrame>
  );
};

/* Figure 2: six blocks; the dot runs forward through the blocks and back along the lower lane. */
const CheckpointRecompute: CoverComponent = ({ uid, title, className }) => {
  const xs = [104, 180, 256, 332, 408, 484];
  const bw = 56;
  const lane = (y0: number, y1: number) => `M0 0 L460 0 L460 ${y1-y0} L0 ${y1-y0}`;
  const stack = (bx: number, y: number, kept: boolean[]) =>
    kept.map((k, j) => (
      k
        ? <rect key={j} x={bx + 4 + j * 16} y={y} width={14} height={10} rx={1.5} fill={GREEN} fillOpacity={0.7} />
        : <rect key={j} x={bx + 4 + j * 16} y={y} width={14} height={10} rx={1.5} fill="none" stroke={AMBER} strokeOpacity={0.9} strokeWidth={1} strokeDasharray="2 2" className={ANIM.pulse} style={{ animationDelay: `${j * 200 + (bx-104) * 2}ms` }} />
    ));
  const panel = (py: number, kept: boolean[], keptText: string) => (
    <g>
      <Panel x={40} y={py} w={560} h={120} />
      <text {...caption} x={48} y={py + 30}>forward</text>
      <text {...caption} x={48} y={py + 103}>backward</text>
      <Edge d={`M96 ${py + 27}H556`} opacity={0.6} />
      <Edge d={`M556 ${py + 27}V${py + 100}`} opacity={0.6} />
      <Edge uid={uid} d={`M556 ${py + 100}H100`} opacity={0.6} />
      {xs.map((bx, i) => (
        <g key={bx}>
          <rect x={bx} y={py + 16} width={bw} height={22} rx={4} fill={NODE_FILL_2} stroke={LINE} strokeWidth={1.25} />
          <text {...mono} x={bx + bw / 2} y={py + 30.5} textAnchor="middle">block {i + 1}</text>
          {stack(bx, py + 48, kept)}
          <text {...mono} x={bx + bw / 2} y={py + 74} textAnchor="middle" fill={TEXT_MUTED}>{keptText}</text>
        </g>
      ))}
      <g transform={`translate(96 ${py + 27})`}>
        <g className={ANIM.travel} style={travel(lane(py + 27, py + 100))}>
          <circle r={3} fill={ACCENT} />
          <circle r={6} fill={ACCENT} fillOpacity={0.25} />
        </g>
      </g>
    </g>
  );
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[320, 180, 240]}>
      <text {...caption} x={40} y={44}>Store every intermediate</text>
      <text {...caption} x={600} y={44} textAnchor="end">18 tensors alive at the loss</text>
      {panel(56, [true, true, true], 'kept 3')}

      <text {...caption} x={40} y={188}>Checkpoint each block</text>
      <text {...caption} x={600} y={188} textAnchor="end">6 inputs kept, internals rebuilt per block</text>
      {panel(200, [true, false, false], 'kept 1')}

      <Tag x={40} y={340} text="stored for backward" tone="green" />
      <Tag x={172} y={340} text="recomputed in backward" tone="amber" />
      <Tag x={322} y={340} text="about one third more compute" />
    </CoverFrame>
  );
};

/* Figure 3: four micro batches feed one gradient buffer; the optimiser steps once, then the buffer is freed. */
const AccumulationLoop: CoverComponent = ({ uid, title, className }) => {
  const boxes = [56, 132, 208, 284];
  const segW = 73;
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[220, 180, 220]}>
      <text {...caption} x={40} y={44}>One optimiser step from N = 4 micro batches</text>
      <text {...caption} x={600} y={44} textAnchor="end">Activation memory</text>

      <Panel x={40} y={56} w={352} h={256} />
      {boxes.map((bx, i) => (
        <g key={bx}>
          <rect x={bx} y={76} width={64} height={26} rx={4} fill={NODE_FILL_2} stroke={LINE} strokeWidth={1.25} />
          <text {...mono} x={bx + 32} y={93} textAnchor="middle">micro {i + 1}</text>
          <Edge uid={uid} d={`M${56 + i * segW + segW / 2} 102V136`} />
        </g>
      ))}
      <rect x={56} y={140} width={292} height={18} rx={3} fill={NODE_FILL_2} stroke={LINE} strokeWidth={1.25} />
      {boxes.map((_, i) => (
        <rect key={i} x={56 + i * segW} y={140} width={segW} height={18} rx={3} fill={ACCENT} fillOpacity={0.55} className={ANIM.grow} style={{ transformOrigin: 'left center', animationDelay: `${i * 260}ms` }} />
      ))}
      <text {...caption} x={56} y={172}>.grad accumulates the sum of loss / N, allocated once</text>

      <Edge uid={uid} d="M316 158V182" />
      <rect x={218} y={186} width={130} height={26} rx={4} fill={NODE_FILL_2} stroke={GREEN} strokeOpacity={0.7} strokeWidth={1.25} />
      <text {...mono} x={283} y={203} textAnchor="middle" fill={GREEN}>optimizer.step()</text>
      <Edge uid={uid} d="M283 212V222" />
      <rect x={218} y={226} width={130} height={26} rx={4} fill={NODE_FILL_2} stroke={LINE} strokeWidth={1.25} />
      <text {...mono} x={283} y={243} textAnchor="middle">zero_grad(set_to_none)</text>
      <Edge uid={uid} d="M218 239H48V89H52" dashed />
      <text {...caption} x={56} y={270}>unscale, clip and step every N micro batches</text>
      <text {...caption} x={56} y={286} fill={AMBER}>BatchNorm still normalises over the micro batch</text>
      <text {...caption} x={56} y={302} fill={TEXT_MUTED}>same mean gradient as one batch of 4 x micro</text>

      <g transform="translate(56 89)">
        <g className={ANIM.travel} style={travel('M0 0 L260 0 L260 114')}>
          <circle r={3} fill={ACCENT} />
          <circle r={6} fill={ACCENT} fillOpacity={0.25} />
        </g>
      </g>

      <Panel x={424} y={56} w={176} h={256} />
      <path d="M548 72V184" stroke={ROSE} strokeOpacity={0.7} strokeWidth={1} strokeDasharray="3 3" />
      <text {...caption} x={548} y={68} textAnchor="middle" fill={ROSE}>card limit</text>
      <text {...caption} x={440} y={92}>batch of 16 in one pass</text>
      <rect x={440} y={98} width={150} height={12} rx={2} fill={ROSE} fillOpacity={0.7} className={ANIM.grow} style={{ transformOrigin: 'left center' }} />
      <text {...caption} x={440} y={128}>4 micro batches of 4</text>
      <rect x={440} y={134} width={38} height={12} rx={2} fill={GREEN} fillOpacity={0.8} className={ANIM.grow} style={{ transformOrigin: 'left center', animationDelay: '150ms' }} />
      <text {...caption} x={440} y={164}>weights, grads, Adam</text>
      <rect x={440} y={170} width={64} height={12} rx={2} fill={AMBER} fillOpacity={0.8} className={ANIM.grow} style={{ transformOrigin: 'left center', animationDelay: '300ms' }} />
      <text {...caption} x={440} y={196} fill={TEXT_MUTED}>persistent, identical in</text>
      <text {...caption} x={440} y={210} fill={TEXT_MUTED}>both cases</text>
      <path d="M440 226H584" stroke={LINE_SOFT} strokeWidth={1} />
      <text {...mono} x={440} y={246}>micro batch: 1/4 of</text>
      <text {...mono} x={440} y={260}>the activation term</text>
      <text {...mono} x={440} y={280} fill={AMBER}>grad buffer stays</text>
      <text {...mono} x={440} y={294} fill={AMBER}>resident between steps</text>

      <Tag x={40} y={334} text="sum of N scaled backward calls" tone="accent" />
      <Tag x={228} y={334} text="step every N" tone="green" />
      <Tag x={315} y={334} text="BN sees the micro batch" tone="amber" />
    </CoverFrame>
  );
};

export const COVER: CoverComponent = Cover;

export const FIGURES: Record<string, CoverComponent> = {
  'gpu-memory-training-budget/memory-bar': MemoryBudget,
  'gpu-memory-training-budget/checkpoint-recompute': CheckpointRecompute,
  'gpu-memory-training-budget/accumulation-loop': AccumulationLoop,
};
