'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { CircleCheck, Flame, Target, Trophy } from 'lucide-react';
import leetCodeStats from '@/lib/leetcode-stats.json';
import { CountUp, useInViewOnce } from './GitHubStats';

const COLORS = {
  easy: '#34d399',
  medium: '#fbbf24',
  hard: '#fb7185',
  track: 'rgba(255,255,255,0.06)',
};

const ARC = 75; // % of the circle used by the 270° gauge

interface GaugeProps {
  easy: number;
  medium: number;
  hard: number;
  total: number;
  size?: number;
  stroke?: number;
}

/* Each arc is a full circle with pathLength=100, rotated to its start and
   revealed by animating stroke-dashoffset from its own length down to 0. */
const Gauge = ({ easy, medium, hard, total, size = 124, stroke = 9 }: GaugeProps) => {
  const c = size / 2;
  const r = (size - stroke) / 2;
  const share = (n: number) => (total > 0 ? (n / total) * ARC : 0);
  const segments = [
    { len: share(easy), color: COLORS.easy, delay: 0 },
    { len: share(medium), color: COLORS.medium, delay: 120 },
    { len: share(hard), color: COLORS.hard, delay: 240 },
  ];
  let start = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      <circle
        cx={c}
        cy={c}
        r={r}
        fill="none"
        stroke={COLORS.track}
        strokeWidth={stroke}
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray={`${ARC} ${100 - ARC}`}
        transform={`rotate(135 ${c} ${c})`}
      />
      {segments.map((seg) => {
        const rotate = 135 + start * 3.6;
        start += seg.len;
        if (seg.len <= 0) return null;
        return (
          <circle
            key={seg.color}
            className="arc-draw"
            cx={c}
            cy={c}
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={stroke}
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray={`${seg.len} 100`}
            transform={`rotate(${rotate} ${c} ${c})`}
            style={{ '--len': seg.len, '--d': `${seg.delay}ms` } as CSSProperties}
          />
        );
      })}
    </svg>
  );
};

const LeetCodeStats = () => {
  const { totalSolved, easy, medium, hard, acceptanceRate, totalQuestions, ranking } = leetCodeStats;
  const [rootRef, inView] = useInViewOnce<HTMLDivElement>(0.25);
  const [armed, setArmed] = useState(false);
  useEffect(() => setArmed(true), []);

  const rows = [
    { label: 'Easy', solved: easy.solved, total: easy.total, color: COLORS.easy },
    { label: 'Medium', solved: medium.solved, total: medium.total, color: COLORS.medium },
    { label: 'Hard', solved: hard.solved, total: hard.total, color: COLORS.hard },
  ];

  const tiles = [
    { icon: CircleCheck, label: 'Solved', node: <CountUp value={totalSolved} active={inView} /> },
    {
      icon: Target,
      label: 'Acceptance',
      node: (
        <>
          <CountUp value={Math.round(acceptanceRate * 10)} active={inView} format={(n) => (n / 10).toFixed(1)} />
          <span className="text-[12px] text-[#6f7888]">%</span>
        </>
      ),
    },
    { icon: Flame, label: 'Hard solved', node: <CountUp value={hard.solved} active={inView} /> },
  ];

  return (
    <div
      ref={rootRef}
      className={`data-card data-card--tl h-full min-w-0 ${armed ? 'motion-armed' : ''} ${inView ? 'is-in' : ''}`}
      aria-label="LeetCode statistics"
    >
      <div className="data-card__body flex h-full flex-col p-5 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <div>
            <p className="text-sm font-medium text-[#f2f4f8]">LeetCode</p>
            <p className="mt-0.5 text-[13px] text-[#6f7888]">Global rank</p>
          </div>
          <p className="flex items-center gap-2 font-mono text-[28px] font-medium leading-none tabular-nums text-[#f2f4f8] lg:text-[32px]">
            <Trophy size={20} strokeWidth={1.75} className="text-[#fbbf24]" aria-hidden />
            <span>
              <span className="text-[#6f7888]">#</span>
              <CountUp value={ranking} active={inView} />
            </span>
          </p>
        </div>

        <div className="mt-5 flex items-center gap-5">
          <div className="relative h-[124px] w-[124px] shrink-0">
            <Gauge easy={easy.solved} medium={medium.solved} hard={hard.solved} total={totalQuestions} />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="font-mono text-xl font-medium leading-none tabular-nums text-[#f2f4f8]">
                <CountUp value={totalSolved} active={inView} />
              </p>
              <p className="mt-1 text-[11px] text-[#6f7888]">of {totalQuestions.toLocaleString('en-US')}</p>
            </div>
          </div>

          <dl className="min-w-0 flex-1 space-y-3">
            {rows.map((row, i) => (
              <div key={row.label}>
                <div className="flex items-center justify-between gap-3 text-[13px]">
                  <dt className="flex items-center gap-2 text-[#a4adbe]">
                    <span className="h-2 w-2 rounded-[2px]" style={{ backgroundColor: row.color }} aria-hidden />
                    {row.label}
                  </dt>
                  <dd className="font-mono tabular-nums text-[#f2f4f8]">
                    {row.solved}
                    <span className="text-[#6f7888]">/{row.total}</span>
                  </dd>
                </div>
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/[0.06]" aria-hidden>
                  <div
                    className="grow-x h-full w-full rounded-full"
                    style={{ '--p': row.total ? row.solved / row.total : 0, '--d': `${120 * i}ms`, backgroundColor: row.color } as CSSProperties}
                  />
                </div>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
          {tiles.map(({ icon: Icon, label, node }) => (
            <div key={label} className="stat-tile">
              <span className="stat-tile__icon" aria-hidden>
                <Icon size={15} strokeWidth={1.75} />
              </span>
              <p className="font-mono text-lg font-medium leading-none tabular-nums text-[#f2f4f8] sm:text-xl">{node}</p>
              <p className="text-[12px] leading-tight text-[#6f7888]">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeetCodeStats;
