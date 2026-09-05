'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { CalendarDays, Flame, Github, Zap } from 'lucide-react';
import contributionData from '@/lib/github-contributions.json';

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

const fmt = (n: number) => n.toLocaleString('en-US');

/* Fires once when the element crosses `threshold`; disconnects afterwards. */
export function useInViewOnce<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

/* Renders the final value on the server; counts up once (~900ms rAF) when `active`. */
export function CountUp({
  value,
  active,
  duration = 900,
  className,
  format = fmt,
}: {
  value: number;
  active: boolean;
  duration?: number;
  className?: string;
  format?: (n: number) => string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || done.current) return;
    if (!active) {
      el.textContent = format(0);
      return;
    }
    done.current = true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = format(value);
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = format(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, value, duration, format]);

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}

const LEVEL_CLASS: Record<number, string> = {
  0: 'bg-white/[0.05]',
  1: 'bg-[#0066ff]/25',
  2: 'bg-[#0066ff]/50',
  3: 'bg-[#0066ff]/80',
  4: 'bg-[#5c9dff]',
};
const levelClass = (level: number) => LEVEL_CLASS[level] ?? LEVEL_CLASS[0];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const buildWeeks = (contributions: ContributionDay[]) => {
  if (!contributions || contributions.length === 0) return [];
  const byDate = new Map<string, ContributionDay>();
  contributions.forEach((day) => byDate.set(day.date, day));

  const weeks: ContributionDay[][] = Array.from({ length: 52 }, () => []);
  const latest = contributions.reduce((m, d) => (d.date > m ? d.date : m), contributions[0].date);
  const today = new Date(latest + 'T00:00:00Z');
  const endDate = new Date(today);
  endDate.setUTCDate(today.getUTCDate() + (6 - today.getUTCDay()));
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - (52 * 7 - 1));

  for (let i = 0; i < 52 * 7; i++) {
    const current = new Date(startDate);
    current.setDate(startDate.getDate() + i);
    const key = current.toISOString().split('T')[0];
    weeks[Math.floor(i / 7)].push(byDate.get(key) ?? { date: key, count: 0, level: 0 });
  }
  return weeks;
};

const dayMs = 86_400_000;
const summarize = (contributions: ContributionDay[]) => {
  const days = [...contributions].sort((a, b) => a.date.localeCompare(b.date));
  let longest = 0;
  let run = 0;
  let prev = 0;
  let best = 0;
  let active = 0;
  for (const d of days) {
    if (d.count <= 0) {
      run = 0;
      prev = 0;
      continue;
    }
    const t = Date.parse(`${d.date}T00:00:00Z`);
    run = prev && t - prev === dayMs ? run + 1 : 1;
    prev = t;
    longest = Math.max(longest, run);
    best = Math.max(best, d.count);
    active += 1;
  }
  return { longest, best, active };
};

const idx = (i: number) => ({ '--i': i }) as CSSProperties;

const GitHubStats = () => {
  const { totalContributions, contributions } = contributionData as {
    totalContributions: number;
    contributions: ContributionDay[];
  };
  const weeks = buildWeeks(contributions);
  const { longest, best, active } = summarize(contributions);
  const [rootRef, inView] = useInViewOnce<HTMLDivElement>(0.2);
  const [armed, setArmed] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setArmed(true);
    const el = scrollerRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);

  const monthLabels = weeks.map((week, w) => {
    const first = new Date(`${week[0].date}T00:00:00Z`);
    const prevWeek = weeks[w - 1];
    const prevMonth = prevWeek ? new Date(`${prevWeek[0].date}T00:00:00Z`).getUTCMonth() : -1;
    return first.getUTCMonth() !== prevMonth && w !== 0 && w < weeks.length - 1 ? MONTHS[first.getUTCMonth()] : '';
  });

  const tiles = [
    { icon: Flame, label: 'Longest streak', value: longest, suffix: ' days' },
    { icon: Zap, label: 'Best day', value: best, suffix: '' },
    { icon: CalendarDays, label: 'Active days', value: active, suffix: '' },
  ];

  return (
    <div
      ref={rootRef}
      className={`data-card h-full min-w-0 ${armed ? 'motion-armed' : ''} ${inView ? 'is-in' : ''}`}
      aria-label="GitHub contribution statistics"
    >
      <div className="data-card__body flex h-full flex-col p-5 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <div className="flex items-center gap-3">
            <span className="stat-tile__icon" aria-hidden>
              <Github size={16} strokeWidth={1.75} />
            </span>
            <div>
              <p className="text-sm font-medium text-[#f2f4f8]">GitHub contributions</p>
              <p className="mt-0.5 text-[13px] text-[#6f7888]">@AdilMunawar · last 12 months</p>
            </div>
          </div>
          {totalContributions ? (
            <p className="font-mono text-[28px] font-medium leading-none tabular-nums text-[#f2f4f8] lg:text-[32px]">
              <CountUp value={totalContributions} active={inView} />
            </p>
          ) : null}
        </div>

        {!totalContributions ? (
          <p className="mt-6 text-[13px] text-[#6f7888]">
            Contribution data has not been generated yet. Run the GitHub contribution stats action to populate it.
          </p>
        ) : (
          <>
            <div
              ref={scrollerRef}
              className="mt-5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <div className="heatmap grid w-max grid-cols-[auto_1fr] gap-x-2" aria-label="Contribution calendar" role="img">
                <div aria-hidden />
                <div className="grid grid-flow-col gap-[3px] text-[9px] leading-[10px] text-[#6f7888]" aria-hidden>
                  {monthLabels.map((m, w) => (
                    <span key={w} className="w-[10px] overflow-visible whitespace-nowrap">
                      {m}
                    </span>
                  ))}
                </div>
                <div className="mt-[3px] grid grid-rows-7 gap-[3px] text-[9px] leading-[10px] text-[#6f7888]" aria-hidden>
                  {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((d, i) => (
                    <span key={i} className="h-[10px]">
                      {d}
                    </span>
                  ))}
                </div>
                <div className="mt-[3px] grid grid-flow-col gap-[3px]">
                  {weeks.map((week, w) => (
                    <div key={w} className="heatmap-col grid grid-rows-7 gap-[3px]" style={idx(w)}>
                      {week.map((day) => (
                        <div
                          key={day.date}
                          className={`heatmap-cell h-[10px] w-[10px] rounded-[2px] ${levelClass(day.level)}`}
                          title={`${day.count} contributions on ${new Date(`${day.date}T00:00:00Z`).toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric', year: 'numeric' })}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-end gap-2 text-xs text-[#6f7888]">
              <span>Less</span>
              <div className="flex gap-[3px]">
                {[0, 1, 2, 3, 4].map((level) => (
                  <div key={level} className={`h-[10px] w-[10px] rounded-[2px] ${levelClass(level)}`} />
                ))}
              </div>
              <span>More</span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
              {tiles.map(({ icon: Icon, label, value, suffix }) => (
                <div key={label} className="stat-tile">
                  <span className="stat-tile__icon" aria-hidden>
                    <Icon size={15} strokeWidth={1.75} />
                  </span>
                  <p className="font-mono text-lg font-medium leading-none tabular-nums text-[#f2f4f8] sm:text-xl">
                    <CountUp value={value} active={inView} />
                    {suffix ? <span className="text-[12px] text-[#6f7888]">{suffix}</span> : null}
                  </p>
                  <p className="text-[12px] leading-tight text-[#6f7888]">{label}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GitHubStats;
