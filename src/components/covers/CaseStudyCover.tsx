import { useId, type ReactNode, type SVGProps } from 'react';
import { ARTICLE_COVERS } from './articles';

export type CoverId = 'recruitment-engine' | 'agent-orchestration' | 'realtime-data';

const ACCENT = '#5c9dff';
const TINT = '#5c9dff';
const NODE_FILL = '#171d2b';
const LINE = 'rgba(255,255,255,0.18)';
const LINE_SOFT = 'rgba(255,255,255,0.08)';

// Hover-only motion on md+ while the parent `.group` card is hovered; static everywhere else.
const FLOW = 'md:[@media(hover:hover)]:group-hover:animate-dash-flow';
const PULSE = 'md:[@media(hover:hover)]:group-hover:animate-pulse-soft';
const stagger = (i: number) => ({ animationDelay: `${i * 140}ms` });

const label: SVGProps<SVGTextElement> = {
  fontFamily: 'inherit',
  fontSize: 10,
  fontWeight: 500,
  letterSpacing: 0.4,
  fill: '#a4adbe',
  fillOpacity: 0.9,
};
const caption: SVGProps<SVGTextElement> = { ...label, fontSize: 9, fill: '#6f7888', fillOpacity: 1 };

interface FrameProps {
  uid: string;
  title: string;
  className?: string;
  glow: [number, number, number];
  children: ReactNode;
}

// Shared 16:9 canvas: flat ground, 32px grid, one faint radial tint, arrow marker.
function Frame({ uid, title, className, glow: [gx, gy, gr], children }: FrameProps) {
  return (
    <svg
      viewBox="0 0 640 360"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={title}
      className={className}
    >
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0b0f17" />
          <stop offset="1" stopColor="#111a2b" />
        </linearGradient>
        <radialGradient id={`${uid}-glow`}>
          <stop offset="0" stopColor="#0066ff" stopOpacity="0.14" />
          <stop offset="1" stopColor="#0066ff" stopOpacity="0" />
        </radialGradient>
        <pattern id={`${uid}-grid`} width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M32 0H0v32" fill="none" stroke="#fff" strokeOpacity="0.035" />
        </pattern>
        <marker id={`${uid}-arrow`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" markerUnits="userSpaceOnUse" orient="auto">
          <path d="M0 0l8 4-8 4z" fill={LINE} />
        </marker>
      </defs>
      <rect width="640" height="360" fill={`url(#${uid}-bg)`} />
      <rect width="640" height="360" fill={`url(#${uid}-grid)`} />
      <circle cx={gx} cy={gy} r={gr} fill={`url(#${uid}-glow)`} />
      <g strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </g>
    </svg>
  );
}

function Pill({ x, y, w = 72, h = 32, text }: { x: number; y: number; w?: number; h?: number; text: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="8" fill={NODE_FILL} stroke={ACCENT} strokeOpacity="0.45" />
      <text {...label} x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle">{text}</text>
    </g>
  );
}

interface CoverProps { title: string; className?: string }

// Documents -> parser -> worker pool -> ranked list.
function RecruitmentEngine({ title, className }: CoverProps) {
  const u = 'cs-re';
  const arrow = `url(#${u}-arrow)`;
  const bars = [52, 44, 36, 28, 20];
  return (
    <Frame uid={u} title={title} className={className} glow={[392, 176, 168]}>
      <text {...caption} x="40" y="44">AI pipeline</text>
      <text {...caption} x="600" y="44" textAnchor="end">Parallel workers</text>

      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${56 + i * 10} ${112 + i * 10})`}>
          <path d="M0 0h52l16 16v72H0z" fill={NODE_FILL} stroke={LINE} />
          <path d="M52 0v16h16" fill="none" stroke={LINE} />
          <path d="M12 32h44M12 44h36M12 56h44M12 68h28" stroke={LINE_SOFT} strokeWidth="2" />
        </g>
      ))}
      <text {...caption} x="56" y="246">1,000+ resumes</text>

      <path d="M152 176h44" stroke={LINE} markerEnd={arrow} />
      <rect x="200" y="144" width="80" height="64" rx="10" fill={NODE_FILL} stroke={ACCENT} strokeOpacity="0.5" />
      <text {...label} x="240" y="172" fontSize="13" textAnchor="middle" fill={TINT}>{'{ }'}</text>
      <text {...label} x="240" y="192" textAnchor="middle">Parser</text>

      <path d="M280 176h12v-32h8" fill="none" stroke={LINE} markerEnd={arrow} />
      <path d="M280 176h20" stroke={LINE} markerEnd={arrow} />
      <path d="M280 176h12v32h8" fill="none" stroke={LINE} markerEnd={arrow} />

      <text {...caption} x="304" y="108">Worker pool</text>
      <text {...caption} x="480" y="108" textAnchor="end" fill={TINT} fillOpacity="0.8">x10</text>
      <rect x="304" y="120" width="176" height="112" rx="12" fill="none" stroke={LINE} strokeDasharray="4 4" className={FLOW} />
      {[0, 1, 2].map((r) => (
        <g key={r}>
          <path d={`M320 ${144 + r * 32}h128`} stroke={LINE_SOFT} />
          {[0, 1, 2, 3, 4].map((c) => {
            const active = (r + c) % 3 !== 1;
            return (
              <rect
                key={c}
                x={312 + c * 32}
                y={136 + r * 32}
                width="16"
                height="16"
                rx="3"
                fill={active ? TINT : NODE_FILL}
                fillOpacity={active ? 0.7 : 1}
                stroke={TINT}
                strokeOpacity={active ? 0 : 0.35}
                className={active ? PULSE : undefined}
                style={active ? stagger((r * 5 + c) % 5) : undefined}
              />
            );
          })}
        </g>
      ))}

      <path d="M480 176h28" stroke={LINE} markerEnd={arrow} />
      <text {...caption} x="512" y="100">Ranked</text>
      <rect x="512" y="112" width="88" height="128" rx="10" fill={NODE_FILL} stroke={LINE} />
      {bars.map((w, i) => (
        <g key={i}>
          <text {...caption} x="524" y={137 + i * 24} fontSize="8">0{i + 1}</text>
          <rect x="540" y={129 + i * 24} width={w} height="8" rx="2" fill={TINT} fillOpacity={0.75 - i * 0.13} />
        </g>
      ))}
    </Frame>
  );
}

// Planner hub with tool spokes and a vector memory store.
function AgentOrchestration({ title, className }: CoverProps) {
  const u = 'cs-ao';
  return (
    <Frame uid={u} title={title} className={className} glow={[320, 176, 160]}>
      <text {...caption} x="40" y="44">Agent graph</text>
      <text {...caption} x="600" y="44" textAnchor="end">Swarm logic</text>

      <g stroke={LINE} strokeDasharray="3 5" fill="none" className={FLOW}>
        <path d="M320 176L140 104" />
        <path d="M320 176L500 104" />
        <path d="M320 176L140 248" />
        <path d="M320 176L500 252" />
        <path d="M320 176V64" />
      </g>

      <Pill x={104} y={88} text="Search" />
      <text {...caption} x="140" y="136" fontSize="8" textAnchor="middle">Tool</text>
      <Pill x={464} y={88} text="API" />
      <text {...caption} x="500" y="136" fontSize="8" textAnchor="middle">429 backoff</text>
      <Pill x={104} y={232} text="Database" />
      <text {...caption} x="140" y="280" fontSize="8" textAnchor="middle">Postgres</text>
      <Pill x={284} y={48} text="Sanitize" />

      <g>
        <path d="M464 240v26q36 12 72 0V240" fill={NODE_FILL} stroke={ACCENT} strokeOpacity="0.45" />
        <ellipse cx="500" cy="240" rx="36" ry="7" fill={NODE_FILL} stroke={ACCENT} strokeOpacity="0.45" />
        <text {...label} x="500" y="262" textAnchor="middle">Memory</text>
        <text {...caption} x="500" y="292" fontSize="8" textAnchor="middle">pgvector</text>
      </g>

      <circle cx="320" cy="176" r="40" fill="#111622" stroke={ACCENT} strokeOpacity="0.7" />
      <circle cx="320" cy="176" r="29" fill="none" stroke={TINT} strokeOpacity="0.4" strokeDasharray="2 4" className={FLOW} />
      {[30, 90, 150, 210, 270, 330].map((a, i) => {
        const rad = (a * Math.PI) / 180;
        return (
          <circle
            key={a}
            cx={320 + Math.cos(rad) * 29}
            cy={176 + Math.sin(rad) * 29}
            r="2.5"
            fill={TINT}
            fillOpacity="0.8"
            className={PULSE}
            style={stagger(i)}
          />
        );
      })}
      <text {...label} x="320" y="180" textAnchor="middle">Planner</text>
      <text {...caption} x="320" y="240" textAnchor="middle" fill={TINT} fillOpacity="0.7">Strict JSON</text>
    </Frame>
  );
}

interface TableProps { x: number; y: number; name: string; rows: [boolean, number][] }

function Table({ x, y, name, rows }: TableProps) {
  const w = 128;
  const h = 24 + rows.length * 20;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="8" fill={NODE_FILL} stroke={LINE} />
      <path d={`M${x} ${y + 8}q0-8 8-8h${w - 16}q8 0 8 8v12H${x}z`} fill={ACCENT} fillOpacity="0.12" />
      <text {...caption} x={x + 10} y={y + 14} fill="#a4adbe">{name}</text>
      {rows.map(([key, len], i) => {
        const cy = y + 30 + i * 20;
        return (
          <g key={i}>
            {key && <circle cx={x + 14} cy={cy} r="2.5" fill={TINT} fillOpacity="0.8" />}
            <rect x={x + (key ? 24 : 12)} y={cy - 2} width={len} height="4" rx="2" fill="#fff" fillOpacity={key ? 0.22 : 0.1} />
          </g>
        );
      })}
    </g>
  );
}

// Related tables with key edges, a websocket pulse and client devices.
function RealtimeData({ title, className }: CoverProps) {
  const u = 'cs-rd';
  const arrow = `url(#${u}-arrow)`;
  return (
    <Frame uid={u} title={title} className={className} glow={[304, 168, 160]}>
      <text {...caption} x="40" y="40">Postgres</text>
      <text {...caption} x="408" y="40">Realtime</text>
      <path d="M384 56v240" stroke={LINE_SOFT} strokeDasharray="2 6" className={FLOW} />

      <Table x={40} y={56} name="employees" rows={[[true, 40], [false, 64], [false, 48]]} />
      <Table x={40} y={188} name="salaries" rows={[[true, 40], [false, 56], [false, 36]]} />
      <Table x={216} y={120} name="attendance" rows={[[true, 40], [false, 52], [false, 60]]} />

      <path d="M168 86h24v132h-20" fill="none" stroke={LINE} markerEnd={arrow} />
      <path d="M192 150h20" stroke={LINE} markerEnd={arrow} />

      <path d="M280 204v20" stroke={LINE} strokeDasharray="2 4" className={FLOW} />
      <rect x="232" y="224" width="96" height="24" rx="12" fill={NODE_FILL} stroke={ACCENT} strokeOpacity="0.4" />
      <text {...caption} x="280" y="240" textAnchor="middle">pool :6543</text>

      <path d="M344 162h56" stroke={LINE} />
      <path d="M400 162h20l6-18 8 36 6-18h20" fill="none" stroke={ACCENT} strokeOpacity="0.8" strokeWidth="1.5" className={PULSE} />
      <path d="M460 162h44v-38h12" fill="none" stroke={LINE} markerEnd={arrow} />
      <path d="M504 162v50h36" fill="none" stroke={LINE} markerEnd={arrow} />
      <text {...caption} x="444" y="196" textAnchor="middle" fontSize="8">websocket</text>

      <text {...caption} x="560" y="84" textAnchor="middle">Clients</text>
      <rect x="520" y="96" width="80" height="56" rx="6" fill={NODE_FILL} stroke={LINE} />
      <path d="M520 110h80" stroke={LINE_SOFT} />
      <circle cx="528" cy="103" r="1.5" fill={TINT} fillOpacity="0.8" className={PULSE} />
      <circle cx="534" cy="103" r="1.5" fill={LINE} />
      <path d="M532 124h48M532 134h32" stroke={LINE_SOFT} strokeWidth="2" />
      <rect x="544" y="184" width="32" height="56" rx="6" fill={NODE_FILL} stroke={LINE} />
      <path d="M554 232h12" stroke={LINE} />
      <path d="M552 200h16M552 210h10" stroke={LINE_SOFT} strokeWidth="2" />
    </Frame>
  );
}

function Fallback({ title, className }: CoverProps) {
  const u = 'cs-fb';
  return (
    <Frame uid={u} title={title} className={className} glow={[320, 180, 150]}>
      {[32, 64, 96].map((r, i) => (
        <circle key={r} cx="320" cy="180" r={r} fill="none" stroke={i === 0 ? ACCENT : LINE} strokeOpacity={i === 0 ? 0.6 : 1} strokeDasharray={i ? '2 6' : undefined} className={i ? FLOW : undefined} />
      ))}
      <text {...label} x="320" y="184" textAnchor="middle">Case study</text>
    </Frame>
  );
}

const COVERS: Record<CoverId, (p: CoverProps) => JSX.Element> = {
  'recruitment-engine': RecruitmentEngine,
  'agent-orchestration': AgentOrchestration,
  'realtime-data': RealtimeData,
};

export function CaseStudyCover({ cover, title, className }: { cover: string; title: string; className?: string }) {
  const uid = `cs-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const Article = ARTICLE_COVERS[cover];
  if (Article) return <Article uid={uid} title={title} className={className} />;
  const Cover = COVERS[cover as CoverId] ?? Fallback;
  return <Cover title={title} className={className} />;
}

export default CaseStudyCover;
