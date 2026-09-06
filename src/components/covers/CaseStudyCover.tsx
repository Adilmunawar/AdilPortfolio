import { useId, type CSSProperties } from 'react';
import { ARTICLE_COVERS } from './articles';
import { ACCENT, AMBER, ANIM, caption, CoverFrame, delay, GREEN, label, LINE, LINE_SOFT, NODE_FILL, ROSE, TEXT } from './shared';

export type CoverId = 'recruitment-engine' | 'agent-orchestration' | 'realtime-data';

const TINT = ACCENT;

const LOOP_CSS = `
.cs-hop,.cs-hop-s{opacity:0}
@media (hover:hover) and (min-width:768px){
.cover-live .cs-hop{animation:cs-hop 10s linear infinite both}
.cover-live .cs-hop-s{animation:cs-hop-s 10s linear infinite both}
.cover-live .cs-window{animation:cs-window 10s linear infinite both}
.cover-live .cs-hold{animation:cs-hold 10s linear infinite both}
}
@media (prefers-reduced-motion:reduce){.cs-hop,.cs-hop-s,.cs-window,.cs-hold{animation:none!important}}
@keyframes cs-hop{0%{offset-distance:0%;opacity:0}1%{opacity:1}11%{opacity:1}12%{offset-distance:100%;opacity:0}100%{offset-distance:100%;opacity:0}}
@keyframes cs-hop-s{0%{offset-distance:0%;opacity:0}.5%{opacity:1}5.5%{opacity:1}6%{offset-distance:100%;opacity:0}100%{offset-distance:100%;opacity:0}}
@keyframes cs-window{0%{opacity:0}2%{opacity:1}18%{opacity:1}20%{opacity:0}100%{opacity:0}}
@keyframes cs-hold{0%{opacity:0}2%{opacity:1}78%{opacity:1}80%{opacity:0}100%{opacity:0}}
`;

function LoopStyle() {
  return <style>{LOOP_CSS}</style>;
}

function Hop({ d, ms, short = false, tone = ACCENT }: { d: string; ms: number; short?: boolean; tone?: string }) {
  const style: CSSProperties = { offsetPath: `path("${d}")`, offsetRotate: '0deg', animationDelay: `${ms}ms` };
  return <circle r={2.6} fill={tone} className={short ? 'cs-hop-s' : 'cs-hop'} style={style} />;
}

function Pill({ x, y, w = 72, h = 32, text }: { x: number; y: number; w?: number; h?: number; text: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="8" fill={NODE_FILL} stroke={ACCENT} strokeOpacity="0.45" />
      <text {...label} x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle">{text}</text>
    </g>
  );
}

function Active({ x, y, w, h, r = 8, ms, dot = GREEN }: { x: number; y: number; w: number; h: number; r?: number; ms: number; dot?: string }) {
  return (
    <g className="cs-window" style={delay(ms)} opacity={0}>
      <rect x={x} y={y} width={w} height={h} rx={r} fill="none" stroke={ACCENT} strokeOpacity={0.9} className={ANIM.pulse} />
      <circle cx={x + w - 7} cy={y + 7} r={2.5} fill={dot} className={ANIM.blink} />
    </g>
  );
}

interface CoverProps { uid?: string; title: string; className?: string }

function RecruitmentEngine({ uid = 'cs-re', title, className }: CoverProps) {
  const arrow = `url(#${uid}-arrow)`;
  const bars = [52, 44, 36, 28, 20];
  const cells = Array.from({ length: 10 }, (_, k) => ({ c: Math.floor(k / 2), r: k % 2, start: 2000 + k * 100 }));
  const RETRY = 1;
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[392, 176, 168]}>
      <LoopStyle />
      <g strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round">
        <text {...caption} x="40" y="44">AI pipeline</text>
        <text {...caption} x="600" y="44" textAnchor="end">Parallel workers</text>

        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${56 + i * 10} ${112 + i * 10})`}>
            <path d="M0 0h52l16 16v72H0z" fill={NODE_FILL} stroke={LINE} />
            <path d="M52 0v16h16" fill="none" stroke={LINE} />
            <path d="M12 32h44M12 44h36M12 56h44M12 68h28" stroke={LINE_SOFT} strokeWidth="2" />
          </g>
        ))}
        <path transform="translate(76 132)" d="M0 0h52l16 16v72H0z" fill="none" stroke={ACCENT} strokeOpacity={0.7} className="cs-window" style={delay(0)} opacity={0} />
        <text {...caption} x="56" y="246">1,000+ resumes</text>

        <path d="M152 176h44" stroke={LINE} markerEnd={arrow} />
        <Hop d="M152 176h44" ms={0} short />
        <Hop d="M152 176h44" ms={350} short />

        <rect x="200" y="144" width="80" height="64" rx="10" fill={NODE_FILL} stroke={ACCENT} strokeOpacity="0.5" />
        <text {...label} x="240" y="172" fontSize="13" textAnchor="middle" fill={TINT}>{'{ }'}</text>
        <text {...label} x="240" y="192" textAnchor="middle">Parser</text>
        <Active x={200} y={144} w={80} h={64} r={10} ms={400} dot={AMBER} />

        <path d="M280 176h12v-32h8" fill="none" stroke={LINE} markerEnd={arrow} />
        <path d="M280 176h20" stroke={LINE} markerEnd={arrow} />
        <path d="M280 176h12v32h8" fill="none" stroke={LINE} markerEnd={arrow} />
        <Hop d="M280 176h12v-32h8" ms={1300} short />
        <Hop d="M280 176h20" ms={1450} short />
        <Hop d="M280 176h12v32h8" ms={1600} short />

        <text {...caption} x="304" y="108">Worker pool</text>
        <text {...caption} x="480" y="108" textAnchor="end" fill={TINT} fillOpacity="0.8">x10</text>
        <rect x="304" y="120" width="176" height="112" rx="12" fill="none" stroke={LINE} strokeDasharray="4 4" />
        <path d="M312 176h160" stroke={LINE_SOFT} />
        {cells.map(({ c, r, start }, k) => {
          const x = 318 + c * 32;
          const y = 142 + r * 48;
          const retry = k === RETRY;
          const doneAt = retry ? start + 6000 : start + 2000;
          return (
            <g key={k}>
              <rect x={x} y={y} width="20" height="20" rx="4" fill={NODE_FILL} stroke={TINT} strokeOpacity="0.35" />
              <rect x={x} y={y} width="20" height="20" rx="4" fill={AMBER} fillOpacity="0.75" className="cs-window" style={delay(start)} opacity={retry ? 1 : 0} />
              {retry && (
                <>
                  <g className="cs-window" style={delay(start + 2000)} opacity={0}>
                    <rect x={x} y={y} width="20" height="20" rx="4" fill={ROSE} fillOpacity="0.8" />
                    <text {...caption} x={x + 10} y="246" fontSize="8" textAnchor="middle" fill={ROSE} className={ANIM.blink}>retry</text>
                  </g>
                  <rect x={x} y={y} width="20" height="20" rx="4" fill={AMBER} fillOpacity="0.75" className="cs-window" style={delay(start + 4000)} opacity={0} />
                </>
              )}
              <rect x={x} y={y} width="20" height="20" rx="4" fill={TINT} fillOpacity="0.7" className={retry ? 'cs-window' : 'cs-hold'} style={delay(doneAt)} opacity={retry ? 0 : 1} />
            </g>
          );
        })}

        <path d="M480 176h28" stroke={LINE} markerEnd={arrow} />
        <Hop d="M480 176h28" ms={8300} short tone={GREEN} />
        <Hop d="M480 176h28" ms={8550} short tone={GREEN} />
        <text {...caption} x="512" y="100">Ranked</text>
        <rect x="512" y="112" width="88" height="128" rx="10" fill={NODE_FILL} stroke={LINE} />
        <g className="cs-hold" style={delay(8900)} opacity={1}>
          {bars.map((w, i) => (
            <g key={i}>
              <text {...caption} x="524" y={137 + i * 24} fontSize="8">0{i + 1}</text>
              <rect x="540" y={129 + i * 24} width={w} height="8" rx="2" fill={TINT} fillOpacity={0.75 - i * 0.13} className={ANIM.grow} style={delay(8900 + i * 120)} />
            </g>
          ))}
        </g>
      </g>
    </CoverFrame>
  );
}

function AgentOrchestration({ uid = 'cs-ao', title, className }: CoverProps) {
  // Spokes run from the planner rim (r 40) to the pill edges so pulses stop where the shapes meet.
  const spoke = (a: string, b: string) => [`M${a}L${b}`, `M${b}L${a}`];
  const [toSearch, fromSearch] = spoke('282.9 161.1', '176 118.4');
  const [toApi, fromApi] = spoke('357.1 161.1', '464 118.4');
  const [toDb, fromDb] = spoke('282.9 190.9', '176 233.6');
  const [toMemory] = spoke('356.8 191.6', '464 236.8');
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[320, 176, 160]}>
      <LoopStyle />
      <g strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round">
        <text {...caption} x="40" y="44">Agent graph</text>
        <text {...caption} x="600" y="44" textAnchor="end">Swarm logic</text>

        <g stroke={LINE} strokeDasharray="3 5" fill="none">
          <path d={toSearch} />
          <path d={toApi} />
          <path d={toDb} />
          <path d={toMemory} />
          <path d="M320 136V80" />
        </g>

        <Pill x={104} y={88} text="Search" />
        <text {...caption} x="140" y="136" fontSize="8" textAnchor="middle">Tool</text>
        <Pill x={464} y={88} text="API" />
        <g className="cs-window" style={delay(3200)} opacity={1}>
          <text {...caption} x="500" y="136" fontSize="8" textAnchor="middle" fill={ROSE} className={ANIM.blink}>429 backoff</text>
        </g>
        <Pill x={104} y={232} text="Database" />
        <text {...caption} x="140" y="280" fontSize="8" textAnchor="middle">Postgres</text>
        <Pill x={284} y={48} text="Sanitize" />
        <Active x={284} y={48} w={72} h={32} ms={0} />
        <Active x={104} y={88} w={72} h={32} ms={3000} />
        <Active x={104} y={232} w={72} h={32} ms={3000} />
        <Active x={464} y={88} w={72} h={32} ms={6400} />

        <g>
          <path d="M464 240v26q36 12 72 0V240" fill={NODE_FILL} stroke={ACCENT} strokeOpacity="0.45" />
          <ellipse cx="500" cy="240" rx="36" ry="7" fill={NODE_FILL} stroke={ACCENT} strokeOpacity="0.45" />
          <ellipse cx="500" cy="240" rx="36" ry="7" fill="none" stroke={ACCENT} strokeOpacity="0.9" className="cs-window" style={delay(7600)} opacity={0} />
          <rect x="482" y="250" width="36" height="3" rx="1.5" fill={GREEN} fillOpacity="0.6" className="cs-hold" style={delay(7800)} opacity={1} />
          <text {...label} x="500" y="262" textAnchor="middle">Memory</text>
          <text {...caption} x="500" y="292" fontSize="8" textAnchor="middle">pgvector</text>
        </g>

        <circle cx="320" cy="176" r="40" fill="#111622" stroke={ACCENT} strokeOpacity="0.7" />
        <circle cx="320" cy="176" r="29" fill="none" stroke={TINT} strokeOpacity="0.4" strokeDasharray="2 4" />
        <g className="cs-window" style={delay(1000)} opacity={0}>
          <circle cx="320" cy="176" r="29" fill="none" stroke={TINT} strokeOpacity="0.9" strokeDasharray="2 4" className={ANIM.pulse} />
        </g>
        {[30, 90, 150, 210, 270, 330].map((a) => {
          const rad = (a * Math.PI) / 180;
          return <circle key={a} cx={320 + Math.cos(rad) * 29} cy={176 + Math.sin(rad) * 29} r="2.5" fill={TINT} fillOpacity="0.8" />;
        })}
        <text {...label} x="320" y="180" textAnchor="middle">Planner</text>
        <text {...caption} x="320" y="240" textAnchor="middle" fill={TINT} fillOpacity="0.7" className="cs-hold" style={delay(9600)} opacity={1}>Strict JSON</text>

        <Hop d="M320 80V136" ms={600} short />
        <Hop d={toSearch} ms={1800} />
        <Hop d={toApi} ms={1800} />
        <Hop d={toDb} ms={1800} />
        <Hop d={fromApi} ms={3200} tone={ROSE} />
        <Hop d={fromSearch} ms={5000} tone={GREEN} />
        <Hop d={fromDb} ms={5200} tone={GREEN} />
        <Hop d={toApi} ms={5200} tone={AMBER} />
        <Hop d={toMemory} ms={6400} />
        <Hop d={fromApi} ms={8400} tone={GREEN} />
      </g>
    </CoverFrame>
  );
}

interface TableProps { x: number; y: number; name: string; rows: [boolean, number][]; hold?: [number, number] }

function Table({ x, y, name, rows, hold }: TableProps) {
  const w = 128;
  const h = 24 + rows.length * 20;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="8" fill={NODE_FILL} stroke={LINE} />
      <path d={`M${x} ${y + 8}q0-8 8-8h${w - 16}q8 0 8 8v12H${x}z`} fill={ACCENT} fillOpacity="0.12" />
      <text {...caption} x={x + 10} y={y + 14} fill={TEXT}>{name}</text>
      {rows.map(([key, len], i) => {
        const cy = y + 30 + i * 20;
        const held = hold && hold[0] === i;
        return (
          <g key={i} className={held ? 'cs-hold' : undefined} style={held ? delay(hold[1]) : undefined} opacity={1}>
            {key && <circle cx={x + 14} cy={cy} r="2.5" fill={TINT} fillOpacity="0.8" />}
            <rect x={x + (key ? 24 : 12)} y={cy - 2} width={len} height="4" rx="2" fill="#fff" fillOpacity={key ? 0.22 : 0.1} />
          </g>
        );
      })}
    </g>
  );
}

function RealtimeData({ uid = 'cs-rd', title, className }: CoverProps) {
  const arrow = `url(#${uid}-arrow)`;
  const wave = 'M400 162h20l6-18 8 36 6-18h20';
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[304, 168, 160]}>
      <LoopStyle />
      <g strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round">
        <text {...caption} x="40" y="40">Postgres</text>
        <text {...caption} x="408" y="40">Realtime</text>
        <path d="M384 56v240" stroke={LINE_SOFT} strokeDasharray="2 6" />

        <Table x={40} y={56} name="employees" rows={[[true, 40], [false, 64], [false, 48]]} />
        <Table x={40} y={188} name="salaries" rows={[[true, 40], [false, 56], [false, 36]]} />
        <Table x={216} y={120} name="attendance" rows={[[true, 40], [false, 52], [false, 60]]} hold={[2, 1000]} />
        <rect x="228" y="188" width="60" height="4" rx="2" fill={AMBER} fillOpacity="0.85" className="cs-window" style={delay(1000)} opacity={0} />
        <circle cx="298" cy="190" r="2.5" fill={GREEN} className="cs-window" style={delay(2800)} opacity={0} />

        <path d="M168 86h24v132h-20" fill="none" stroke={LINE} markerEnd={arrow} />
        <path d="M192 150h20" stroke={LINE} markerEnd={arrow} />
        <Hop d="M168 86h24v64h20" ms={1200} />

        <path d="M280 204v20" stroke={LINE} strokeDasharray="2 4" />
        <rect x="232" y="224" width="96" height="24" rx="12" fill={NODE_FILL} stroke={ACCENT} strokeOpacity="0.4" />
        <text {...caption} x="280" y="240" textAnchor="middle">pool :6543</text>
        <rect x="232" y="224" width="96" height="24" rx="12" fill="none" stroke={ACCENT} strokeOpacity="0.9" className="cs-window" style={delay(0)} opacity={0} />
        <Hop d="M280 224v-20" ms={400} short />

        <path d="M344 162h56" stroke={LINE} />
        <path d={wave} fill="none" stroke={ACCENT} strokeOpacity="0.5" strokeWidth="1.5" />
        <g className="cs-window" style={delay(3400)} opacity={0}>
          <path d={wave} fill="none" stroke={ACCENT} strokeOpacity="1" strokeWidth="1.5" className={ANIM.pulse} />
        </g>
        <path d="M460 162h44v-38h12" fill="none" stroke={LINE} markerEnd={arrow} />
        <path d="M504 162v50h36" fill="none" stroke={LINE} markerEnd={arrow} />
        <text {...caption} x="444" y="196" textAnchor="middle" fontSize="8">websocket</text>
        <Hop d="M344 162h56" ms={2800} short tone={GREEN} />
        <Hop d={wave} ms={3400} tone={GREEN} />
        <Hop d="M460 162h44v-38h12" ms={4600} tone={GREEN} />
        <Hop d="M460 162h44v50h36" ms={4600} tone={GREEN} />

        <text {...caption} x="560" y="84" textAnchor="middle">Clients</text>
        <rect x="520" y="96" width="80" height="56" rx="6" fill={NODE_FILL} stroke={LINE} />
        <path d="M520 110h80" stroke={LINE_SOFT} />
        <g className="cs-window" style={delay(5800)} opacity={1}>
          <circle cx="528" cy="103" r="1.5" fill={GREEN} className={ANIM.blink} />
        </g>
        <circle cx="534" cy="103" r="1.5" fill={LINE} />
        <path d="M532 124h48M532 134h32" stroke={LINE_SOFT} strokeWidth="2" />
        <path d="M532 144h40" stroke={ACCENT} strokeOpacity="0.7" strokeWidth="2" className="cs-hold" style={delay(5800)} opacity={1} />
        <rect x="544" y="184" width="32" height="56" rx="6" fill={NODE_FILL} stroke={LINE} />
        <path d="M554 232h12" stroke={LINE} />
        <path d="M552 200h16M552 210h10" stroke={LINE_SOFT} strokeWidth="2" />
        <path d="M552 220h14" stroke={ACCENT} strokeOpacity="0.7" strokeWidth="2" className="cs-hold" style={delay(5800)} opacity={1} />
      </g>
    </CoverFrame>
  );
}

function Fallback({ uid = 'cs-fb', title, className }: CoverProps) {
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[320, 180, 150]}>
      <g strokeWidth={1.25}>
        {[32, 64, 96].map((r, i) => (
          <circle key={r} cx="320" cy="180" r={r} fill="none" stroke={i === 0 ? ACCENT : LINE} strokeOpacity={i === 0 ? 0.6 : 1} strokeDasharray={i ? '2 6' : undefined} className={i === 0 ? ANIM.pulse : undefined} />
        ))}
        <text {...label} x="320" y="184" textAnchor="middle">Case study</text>
      </g>
    </CoverFrame>
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
