'use client';
import type { CSSProperties } from 'react';
import { ACCENT, AMBER, ANIM, caption, CoverFrame, delay, Edge, GREEN, label, LINE, LINE_SOFT, mono, NODE_FILL, Panel, ROSE, Tag, TEXT, TEXT_MUTED, type CoverComponent } from '../shared';

const WHITE = '#f2f4f8';

const ERP_CSS = `
.erp-hop, .erp-far, .erp-live { opacity: 0; }
.erp-grow { transform-box: fill-box; transform-origin: left center; }
@media (hover: hover) and (min-width: 768px) {
  .cover-live .erp-hop { animation: erp-hop var(--erp-t, 10s) linear infinite both; }
  .cover-live .erp-far { animation: erp-far var(--erp-t, 10s) linear infinite both; }
  .cover-live .erp-show, .cover-live .erp-live { animation: erp-show var(--erp-t, 10s) ease-in-out infinite both; }
  .cover-live .erp-grow { animation: erp-grow var(--erp-t, 10s) cubic-bezier(0.16, 1, 0.3, 1) infinite both; }
}
@media (prefers-reduced-motion: reduce) {
  .erp-hop, .erp-far, .erp-show, .erp-live, .erp-grow { animation: none !important; }
}
@keyframes erp-hop { 0% { offset-distance: 0%; opacity: 0; } 1% { opacity: 1; } 4% { opacity: 1; } 5% { offset-distance: 100%; opacity: 0; } 100% { offset-distance: 100%; opacity: 0; } }
@keyframes erp-far { 0% { offset-distance: 0%; opacity: 0; } 1% { opacity: 1; } 29% { opacity: 1; } 30% { offset-distance: 100%; opacity: 0; } 100% { offset-distance: 100%; opacity: 0; } }
@keyframes erp-show { 0% { opacity: 0; } 2% { opacity: 1; } 18% { opacity: 1; } 20% { opacity: 0; } 100% { opacity: 0; } }
@keyframes erp-grow { 0% { transform: scaleX(0); opacity: 1; } 6% { transform: scaleX(1); opacity: 1; } 92% { transform: scaleX(1); opacity: 1; } 100% { transform: scaleX(1); opacity: 0; } }
`;

const Style = () => <style>{ERP_CSS}</style>;

const period = (seconds: number) => ({ '--erp-t': `${seconds}s` } as unknown as CSSProperties);

const travel = (path: string, ms: number): CSSProperties => ({ offsetPath: `path("${path}")`, offsetRotate: '0deg', animationDelay: `${ms}ms` });

function Pulse({ x, y, path, ms, tone = ACCENT, far = false }: { x: number; y: number; path: string; ms: number; tone?: string; far?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className={far ? 'erp-far' : 'erp-hop'} style={travel(path, ms)}>
        <circle r={2.4} fill={tone} />
        <circle r={5} fill={tone} fillOpacity={0.25} />
      </g>
    </g>
  );
}

function Work({ x, y, w, h, r = 8, ms, tone = ACCENT }: { x: number; y: number; w: number; h: number; r?: number; ms: number; tone?: string }) {
  return (
    <g className="erp-live" style={delay(ms)}>
      <rect className={ANIM.pulse} x={x} y={y} width={w} height={h} rx={r} fill={tone} fillOpacity={0.07} stroke={tone} strokeOpacity={0.75} strokeWidth={1.5} />
    </g>
  );
}

function Veil({ x, y, w, h, at }: { x: number; y: number; w: number; h: number; at: number[] }) {
  return (
    <>
      {at.map((ms) => (
        <g key={ms} className="erp-live" style={delay(ms)}>
          <rect x={x} y={y} width={w} height={h} rx={7} fill={NODE_FILL} />
        </g>
      ))}
    </>
  );
}

function Verifying({ x, y, w, ms, text }: { x: number; y: number; w: number; ms: number; text: string }) {
  return (
    <g className="erp-live" style={delay(ms)}>
      <rect x={x - 8} y={y - 8} width={w} height={16} rx={8} fill={NODE_FILL} />
      <circle cx={x} cy={y} r={6} fill={AMBER} fillOpacity={0.14} stroke={AMBER} strokeOpacity={0.7} strokeWidth={1.25} />
      <circle cx={x} cy={y} r={1.6} fill={AMBER} className={ANIM.blink} />
      <text {...caption} x={x + 12} y={y + 3} fill={AMBER}>{text}</text>
    </g>
  );
}

function Bar({ x, y, w, h = 4, fill = '#fff', o = 0.18, grow, ms = 0 }: { x: number; y: number; w: number; h?: number; fill?: string; o?: number; grow?: boolean; ms?: number }) {
  return <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={fill} fillOpacity={o} className={grow ? 'erp-grow' : undefined} style={grow ? delay(ms) : undefined} />;
}

function Check({ x, y, tone = GREEN }: { x: number; y: number; tone?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={6} fill={tone} fillOpacity={0.14} stroke={tone} strokeOpacity={0.6} strokeWidth={1.25} />
      <path d={`M${x - 3} ${y}l2 2.5 4.5-5`} fill="none" stroke={tone} strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

function Cylinder({ cx, top, w = 64, h = 40 }: { cx: number; top: number; w?: number; h?: number }) {
  const rx = w / 2;
  return (
    <g fill={NODE_FILL} stroke={ACCENT} strokeOpacity={0.5} strokeWidth={1.25}>
      <path d={`M${cx - rx} ${top}v${h}q${rx} 12 ${w} 0V${top}`} />
      <ellipse cx={cx} cy={top} rx={rx} ry={6} />
    </g>
  );
}

/* Cover: question -> dense and BM25 -> RRF -> rerank and gate -> cited answer or refusal. */
const Cover: CoverComponent = ({ uid, title, className }) => (
  <CoverFrame uid={uid} title={title} className={className} glow={[328, 168, 220]}>
    <Style />
    <g style={period(10)}>
      <text {...caption} x={40} y={44}>Question</text>
      <text {...caption} x={600} y={44} textAnchor="end">Cited answer, or a refusal</text>

      <Panel x={40} y={140} w={96} h={48} stroke={ACCENT} strokeOpacity={0.5} />
      <text {...label} x={88} y={168} textAnchor="middle">Question</text>
      <Work x={40} y={140} w={96} h={48} ms={0} />
      <Edge d="M136 164C152 164 152 116 168 116" uid={uid} />
      <Edge d="M136 164C152 164 152 212 168 212" uid={uid} />
      <Pulse x={136} y={164} path="M0 0 C16 0 16 -48 32 -48" ms={1500} />
      <Pulse x={136} y={164} path="M0 0 C16 0 16 48 32 48" ms={1500} tone={AMBER} />

      <Panel x={168} y={92} w={96} h={48} />
      <text {...label} x={216} y={112} textAnchor="middle">Dense</text>
      <text {...mono} x={216} y={128} textAnchor="middle" fill={TEXT_MUTED}>pgvector</text>
      <Work x={168} y={92} w={96} h={48} ms={2000} />
      <Panel x={168} y={188} w={96} h={48} />
      <text {...label} x={216} y={208} textAnchor="middle">BM25</text>
      <text {...mono} x={216} y={224} textAnchor="middle" fill={TEXT_MUTED}>exact terms</text>
      <Work x={168} y={188} w={96} h={48} ms={2000} tone={AMBER} />
      <Edge d="M264 116C280 116 280 164 296 164" uid={uid} />
      <Edge d="M264 212C280 212 280 164 296 164" uid={uid} />
      <Pulse x={264} y={116} path="M0 0 C16 0 16 48 32 48" ms={3500} />
      <Pulse x={264} y={212} path="M0 0 C16 0 16 -48 32 -48" ms={3500} tone={AMBER} />

      <Panel x={296} y={140} w={64} h={48} stroke={ACCENT} strokeOpacity={0.5} />
      <text {...label} x={328} y={160} textAnchor="middle">RRF</text>
      <text {...caption} x={328} y={176} textAnchor="middle">fuse ranks</text>
      <Work x={296} y={140} w={64} h={48} ms={4000} />
      <Edge d="M360 164H392" uid={uid} />
      <Pulse x={360} y={164} path="M0 0 L32 0" ms={5500} />

      <Panel x={392} y={132} w={72} h={64} />
      <text {...label} x={428} y={156} textAnchor="middle">Rerank</text>
      <text {...caption} x={428} y={172} textAnchor="middle">then gate</text>
      <Work x={392} y={132} w={72} h={64} ms={6000} />
      <g className="erp-show" style={delay(6000)}>
        <circle cx={456} cy={140} r={3} fill={GREEN} className={ANIM.blink} />
      </g>
      <Edge d="M464 152C480 152 480 116 496 116" uid={uid} />
      <Edge d="M464 176C480 176 480 240 496 240" uid={uid} dashed />
      <Pulse x={464} y={152} path="M0 0 C16 0 16 -36 32 -36" ms={7500} tone={GREEN} />

      <Panel x={496} y={72} w={104} h={88} />
      <text {...caption} x={508} y={90} fill={TEXT}>Answer</text>
      <g className="erp-show" style={delay(8000)}>
        <Bar x={508} y={100} w={60} o={0.22} grow ms={8000} />
        <text {...mono} x={574} y={104} fill={ACCENT}>[1]</text>
        <Bar x={508} y={114} w={44} o={0.22} grow ms={8150} />
        <text {...mono} x={558} y={118} fill={ACCENT}>[2]</text>
        <Bar x={508} y={128} w={64} o={0.22} grow ms={8300} />
        <text {...mono} x={578} y={132} fill={ACCENT}>[1]</text>
        <Check x={514} y={148} />
        <text {...caption} x={526} y={151}>claims checked</text>
        <Verifying x={514} y={148} w={92} ms={7400} text="checking claims" />
      </g>

      <Panel x={496} y={204} w={104} h={72} stroke={ROSE} strokeOpacity={0.4} />
      <text {...caption} x={508} y={222} fill={TEXT}>Refusal</text>
      <Tag x={548} y={218} text="no hit" tone="rose" />
      <text {...mono} x={508} y={244} fill={TEXT_MUTED}>not in the</text>
      <text {...mono} x={508} y={256} fill={TEXT_MUTED}>knowledge base</text>
      <text {...caption} x={508} y={270}>nearest docs</text>

      <Tag x={40} y={300} text="Hybrid retrieval" tone="accent" />
      <Tag x={150} y={300} text="Reciprocal rank fusion" />
      <Tag x={293} y={300} text="Cross-encoder" />
      <Tag x={386} y={300} text="Recall@k + faithfulness" tone="green" />
    </g>
  </CoverFrame>
);

/* Figure: document tree -> structure-aware chunks with heading paths -> dense and keyword indexes. */
const Chunking: CoverComponent = ({ uid, title, className }) => {
  const chunks: [string, number[]][] = [
    ['Leave policy › Annual leave', [140, 112, 128]],
    ['Leave policy › Carry-over', [120, 136]],
    ['Leave policy › Rates (table)', []],
    ['Leave policy › How to apply', [132, 96, 120]],
  ];
  const cardY = [68, 124, 180, 236];
  /* ms at which the 2.4s scan band reaches the centre of each document section */
  const packAt = [200, 750, 1250, 1900];
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[320, 176, 220]}>
      <defs>
        <clipPath id={`${uid}-doc`}><rect x={33} y={61} width={158} height={246} rx={8} /></clipPath>
      </defs>
      <Style />
      <g style={period(8)}>
        <text {...caption} x={32} y={44}>Parsed document tree</text>
        <text {...caption} x={320} y={44} textAnchor="middle">Structure-aware chunks</text>
        <text {...caption} x={608} y={44} textAnchor="end">Two indexes</text>

        <Panel x={32} y={60} w={160} h={248} />
        <Bar x={44} y={74} w={96} h={6} fill={ACCENT} o={0.8} />
        <Bar x={44} y={90} w={128} />
        <Bar x={44} y={100} w={120} />
        <Bar x={44} y={110} w={84} />
        <Bar x={44} y={128} w={72} h={5} fill={ACCENT} o={0.55} />
        <Bar x={44} y={142} w={128} />
        <Bar x={44} y={152} w={104} />
        <g stroke={LINE} strokeWidth={1}>
          {[168, 182, 196, 210].map((y) => <path key={y} d={`M44 ${y}H172`} />)}
          {[44, 88, 132, 172].map((x) => <path key={x} d={`M${x} 168V210`} />)}
        </g>
        <Bar x={48} y={173} w={32} h={4} fill={AMBER} o={0.6} />
        <Bar x={44} y={228} w={72} h={5} fill={ACCENT} o={0.55} />
        {[242, 254, 266].map((y) => (
          <g key={y}>
            <circle cx={48} cy={y + 2} r={1.5} fill={TEXT_MUTED} />
            <Bar x={56} y={y} w={100} />
          </g>
        ))}
        <Bar x={44} y={284} w={112} />
        <g clipPath={`url(#${uid}-doc)`}>
          <g transform="translate(33 61)">
            <g className="erp-far" style={travel('M0 0 V222', 0)}>
              <rect x={0} y={0} width={158} height={24} fill={ACCENT} fillOpacity={0.12} />
              <path d="M0 24H158" stroke={ACCENT} strokeOpacity={0.6} strokeWidth={1} />
            </g>
          </g>
        </g>

        {chunks.map(([path, bars], i) => (
          <g key={path}>
            <Panel x={224} y={cardY[i]} w={176} h={44} stroke={i === 2 ? AMBER : LINE} strokeOpacity={i === 2 ? 0.5 : 1} />
            <text {...mono} x={234} y={cardY[i] + 15} fill={i === 2 ? AMBER : ACCENT}>{path}</text>
            {i === 2 ? (
              <g stroke={LINE} strokeWidth={1}>
                {[cardY[i] + 22, cardY[i] + 30, cardY[i] + 38].map((y) => <path key={y} d={`M234 ${y}H390`} />)}
                {[234, 286, 338, 390].map((x) => <path key={x} d={`M${x} ${cardY[i] + 22}V${cardY[i] + 38}`} />)}
              </g>
            ) : (
              bars.map((w, j) => <Bar key={j} x={234} y={cardY[i] + 22 + j * 7} w={w} h={3} o={0.2} grow ms={packAt[i] + 150 + j * 100} />)
            )}
            <Work x={224} y={cardY[i]} w={176} h={44} ms={packAt[i]} tone={i === 2 ? AMBER : ACCENT} />
            <path d={`M400 ${cardY[i] + 22}H440`} stroke={LINE} strokeWidth={1.25} />
            <Pulse x={400} y={cardY[i] + 22} path="M0 0 H40" ms={packAt[i] + 600} tone={i === 2 ? AMBER : ACCENT} />
          </g>
        ))}
        <path d="M440 90V258" stroke={LINE} strokeWidth={1.25} />
        <Edge d="M440 124H488" uid={uid} />
        <Edge d="M440 236H488" uid={uid} />
        <Pulse x={440} y={124} path="M0 0 L48 0" ms={3100} />
        <Pulse x={440} y={236} path="M0 0 L48 0" ms={3100} tone={AMBER} />
        <text {...caption} x={464} y={116} textAnchor="middle">embed</text>
        <text {...caption} x={464} y={228} textAnchor="middle">tokenise</text>

        <Cylinder cx={548} top={100} w={72} h={44} />
        {[0, 1, 2].map((r) => [0, 1, 2, 3, 4].map((c) => (
          <circle key={`${r}-${c}`} cx={528 + c * 10} cy={112 + r * 10} r={2} fill={ACCENT} fillOpacity={0.35 + ((r * 3 + c) % 4) * 0.18} />
        )))}
        <Work x={506} y={88} w={84} h={74} r={12} ms={3500} />
        <text {...caption} x={548} y={172} textAnchor="middle">pgvector, HNSW</text>

        <Panel x={492} y={196} w={116} h={92} />
        <Tag x={500} y={212} text="BM25" tone="amber" />
        <text {...mono} x={500} y={238} fill={TEXT_MUTED}>carry    12, 31</text>
        <text {...mono} x={500} y={254} fill={TEXT_MUTED}>leave    4, 12</text>
        <text {...mono} x={500} y={270} fill={TEXT_MUTED}>hr-27    31</text>
        <Work x={492} y={196} w={116} h={92} ms={3500} tone={AMBER} />

        <Tag x={224} y={330} text="Heading path prefixed" tone="accent" />
        <Tag x={362} y={330} text="Tables kept whole" tone="amber" />
        <Tag x={477} y={330} text="Token budget" />
      </g>
    </CoverFrame>
  );
};

/* Figure: two ranked lists fused by reciprocal rank, then reranked. */
const HybridFusion: CoverComponent = ({ uid, title, className }) => {
  const dense: [string, number][] = [['c07', 72], ['c31', 64], ['c12', 58], ['c45', 50], ['c03', 44]];
  const bm25: [string, number][] = [['c31', 72], ['c19', 60], ['c07', 52], ['c58', 46], ['c12', 40]];
  const fused: [string, number][] = [['c31', 88], ['c07', 84], ['c12', 78], ['c19', 42], ['c45', 40]];
  const rowY = (i: number) => 90 + i * 30;
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[320, 168, 220]}>
      <Style />
      <g style={period(10)}>
        <text {...caption} x={32} y={44}>Dense top-k</text>
        <text {...caption} x={176} y={44}>BM25 top-k</text>
        <text {...caption} x={608} y={44} textAnchor="end">Fused, then reranked</text>

        <Panel x={32} y={60} w={128} h={176} />
        <g className="erp-live" style={delay(4600)}>
          <rect x={36} y={rowY(1) - 11} width={120} height={22} rx={4} fill={ACCENT} fillOpacity={0.14} />
        </g>
        {dense.map(([id, w], i) => (
          <g key={id}>
            <text {...mono} x={44} y={rowY(i) + 3} fill={id === 'c31' ? WHITE : TEXT}>{id}</text>
            <Bar x={72} y={rowY(i) - 3} w={w} h={6} fill={ACCENT} o={0.8 - i * 0.12} grow ms={i * 150} />
          </g>
        ))}
        <text {...mono} x={44} y={228} fill={TEXT_MUTED}>cosine</text>

        <Panel x={176} y={60} w={128} h={176} />
        <g className="erp-live" style={delay(4600)}>
          <rect x={180} y={rowY(0) - 11} width={120} height={22} rx={4} fill={AMBER} fillOpacity={0.14} />
        </g>
        {bm25.map(([id, w], i) => (
          <g key={id}>
            <text {...mono} x={188} y={rowY(i) + 3} fill={id === 'c31' ? WHITE : TEXT}>{id}</text>
            <Bar x={216} y={rowY(i) - 3} w={w} h={6} fill={AMBER} o={0.8 - i * 0.12} grow ms={200 + i * 150} />
          </g>
        ))}
        <text {...mono} x={188} y={228} fill={TEXT_MUTED}>term weight</text>

        <Edge d="M96 236V256H384V186" uid={uid} />
        <Pulse x={96} y={236} path="M0 0 V20 H288 V-50" ms={1600} far />
        <Edge d="M304 148H336" uid={uid} />
        <Pulse x={304} y={148} path="M0 0 L32 0" ms={4100} tone={AMBER} />

        <Panel x={336} y={112} w={96} h={72} stroke={ACCENT} strokeOpacity={0.5} />
        <text {...label} x={384} y={134} textAnchor="middle">RRF</text>
        <text {...mono} x={384} y={154} textAnchor="middle" fill={WHITE}>1 / (k + rank)</text>
        <text {...caption} x={384} y={172} textAnchor="middle">k = 60, ranks add</text>
        <Work x={336} y={112} w={96} h={72} ms={4600} />
        <Edge d="M432 148H464" uid={uid} />
        <Pulse x={432} y={148} path="M0 0 L32 0" ms={6100} tone={GREEN} />

        <Panel x={464} y={60} w={144} h={176} />
        <rect x={468} y={rowY(0) - 11} width={136} height={22} rx={4} fill={ACCENT} fillOpacity={0.12} />
        {fused.map(([id, w], i) => (
          <g key={id}>
            <text {...mono} x={476} y={rowY(i) + 3} fill={i === 0 ? WHITE : TEXT}>{id}</text>
            <Bar x={504} y={rowY(i) - 3} w={w} h={6} fill={GREEN} o={0.85 - i * 0.12} grow ms={6600 + i * 150} />
          </g>
        ))}
        <Veil x={465} y={61} w={142} h={174} at={[0, 1600, 3200, 4800]} />
        <text {...caption} x={536} y={252} textAnchor="middle">c31: mid in both, first after fusion</text>

        <Edge d="M536 258V272" uid={uid} />
        <Panel x={464} y={276} w={144} h={44} />
        <text {...label} x={536} y={302} textAnchor="middle">Cross-encoder rerank</text>
        <Work x={464} y={276} w={144} h={44} ms={8000} />

        <Tag x={32} y={300} text="Dense: meaning" tone="accent" />
        <Tag x={130} y={300} text="BM25: exact terms" tone="amber" />
        <Tag x={245} y={300} text="Union, not intersection" />
      </g>
    </CoverFrame>
  );
};

/* Figure: reranked evidence -> grounding gate -> cited answer, or a refusal that lists the closest documents. */
const GroundingGate: CoverComponent = ({ uid, title, className }) => {
  const rows: [string, number, string][] = [
    ['[1] leave-policy.pdf §4', 120, GREEN],
    ['[2] hr-handbook.md §2', 96, GREEN],
    ['[3] ticket-8812', 40, ROSE],
  ];
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[320, 168, 220]}>
      <Style />
      <g style={period(8)}>
        <text {...caption} x={32} y={44}>Reranked evidence</text>
        <text {...caption} x={608} y={44} textAnchor="end">Answer or refuse</text>

        <Panel x={32} y={60} w={176} h={176} />
        <text {...caption} x={108} y={76} textAnchor="middle">threshold</text>
        <path d="M108 80V86" stroke={ACCENT} strokeOpacity={0.6} strokeWidth={1.25} />
        {rows.map(([name, w, tone], i) => (
          <g key={name}>
            <text {...mono} x={44} y={94 + i * 44} fill={tone === ROSE ? TEXT_MUTED : WHITE}>{name}</text>
            <Bar x={44} y={101 + i * 44} w={w} h={6} fill={tone} o={0.7} grow ms={i * 200} />
            <path d={`M108 ${97 + i * 44}V${111 + i * 44}`} stroke={ACCENT} strokeOpacity={0.6} strokeWidth={1.25} strokeDasharray="2 2" />
            <text {...caption} x={44} y={122 + i * 44} fill={TEXT_MUTED}>rerank score</text>
          </g>
        ))}

        <Edge d="M208 148H248" uid={uid} />
        <Pulse x={208} y={148} path="M0 0 L40 0" ms={1300} />

        <Panel x={248} y={104} w={120} h={88} stroke={ACCENT} strokeOpacity={0.5} />
        <text {...label} x={308} y={124} textAnchor="middle">Grounding gate</text>
        <g className="erp-show" style={delay(1700)}>
          <circle cx={356} cy={112} r={3} fill={GREEN} className={ANIM.blink} />
        </g>
        <text {...mono} x={260} y={146} fill={TEXT_MUTED}>best &gt;= threshold</text>
        <text {...mono} x={260} y={162} fill={TEXT_MUTED}>claim has a span</text>
        <text {...mono} x={260} y={178} fill={TEXT_MUTED}>sources agree</text>
        {[2000, 2400, 2800].map((ms, i) => (
          <g key={ms} className="erp-live" style={delay(ms)}>
            <circle cx={359} cy={143 + i * 16} r={2.5} fill={GREEN} />
          </g>
        ))}
        <Work x={248} y={104} w={120} h={88} ms={1700} />

        <Edge d="M368 132C400 132 400 100 432 100" uid={uid} />
        <Edge d="M368 168C400 168 400 240 432 240" uid={uid} dashed />
        <Pulse x={368} y={132} path="M0 0 C32 0 32 -32 64 -32" ms={3300} tone={GREEN} />

        <Panel x={432} y={60} w={176} h={120} />
        <text {...caption} x={444} y={78} fill={TEXT}>Answer</text>
        <Bar x={444} y={88} w={112} o={0.22} grow ms={3800} />
        <text {...mono} x={562} y={92} fill={ACCENT}>[1]</text>
        <Bar x={444} y={104} w={96} o={0.22} grow ms={3950} />
        <text {...mono} x={546} y={108} fill={ACCENT}>[2]</text>
        <Bar x={444} y={120} w={128} o={0.22} grow ms={4100} />
        <text {...mono} x={578} y={124} fill={ACCENT}>[1]</text>
        <path d="M444 138H596" stroke={LINE_SOFT} />
        <Check x={452} y={158} />
        <text {...caption} x={466} y={161}>each cited claim verified</text>
        <Verifying x={452} y={158} w={142} ms={3800} text="verifying each claim" />
        <Veil x={433} y={82} w={174} h={96} at={[0, 1200, 2400]} />

        <Panel x={432} y={200} w={176} h={96} stroke={ROSE} strokeOpacity={0.4} />
        <text {...caption} x={444} y={218} fill={TEXT}>Refusal</text>
        <Tag x={508} y={214} text="below threshold" tone="rose" />
        <text {...mono} x={444} y={242} fill={WHITE}>Not in the knowledge base.</text>
        <text {...caption} x={444} y={262}>closest documents:</text>
        <text {...mono} x={444} y={278} fill={TEXT_MUTED}>leave-policy.pdf, hr-handbook</text>

        <Tag x={32} y={326} text="Cite or refuse" tone="accent" />
        <Tag x={130} y={326} text="No score, no answer" tone="rose" />
        <Tag x={256} y={326} text="Nearest documents surfaced" />
      </g>
    </CoverFrame>
  );
};

export const COVER: CoverComponent = Cover;

export const FIGURES: Record<string, CoverComponent> = {
  'enterprise-rag-pipeline/chunking': Chunking,
  'enterprise-rag-pipeline/hybrid-fusion': HybridFusion,
  'enterprise-rag-pipeline/grounding-gate': GroundingGate,
};
