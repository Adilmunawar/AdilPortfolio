'use client';
import type { CSSProperties } from 'react';
import { ACCENT, AMBER, ANIM, caption, CoverFrame, Edge, GREEN, label, LINE_SOFT, mono, NODE_FILL_2, Panel, ROSE, Tag, TEXT_MUTED, type CoverComponent } from '../shared';

const INK = '#0b0f17';

/* Windows are fractions of one loop (--mcp-t): hop 5%, travel 10%, long 30%, on 60% with strokes drawing over the first 20%. */
const STYLE = `
@keyframes mcp-on { 0% { opacity: 0; stroke-dashoffset: 1; } 2% { opacity: 1; } 20% { stroke-dashoffset: 0; } 58% { opacity: 1; } 60%, 100% { opacity: 0; stroke-dashoffset: 0; } }
@keyframes mcp-hop { 0% { offset-distance: 0%; opacity: 0; } 0.5% { opacity: 1; } 4.5% { opacity: 1; } 5% { offset-distance: 100%; opacity: 0; } 100% { offset-distance: 100%; opacity: 0; } }
@keyframes mcp-travel { 0% { offset-distance: 0%; opacity: 0; } 1% { opacity: 1; } 9% { opacity: 1; } 10% { offset-distance: 100%; opacity: 0; } 100% { offset-distance: 100%; opacity: 0; } }
@keyframes mcp-long { 0% { offset-distance: 0%; opacity: 0; } 2% { opacity: 1; } 28% { opacity: 1; } 30% { offset-distance: 100%; opacity: 0; } 100% { offset-distance: 100%; opacity: 0; } }
.mcp-on, .mcp-hop, .mcp-travel, .mcp-long { opacity: 0; }
@media (hover: hover) and (min-width: 768px) {
  .cover-live .mcp-on { animation: mcp-on var(--mcp-t, 10s) linear infinite; }
  .cover-live .mcp-hop { animation: mcp-hop var(--mcp-t, 10s) linear infinite; }
  .cover-live .mcp-travel { animation: mcp-travel var(--mcp-t, 10s) linear infinite; }
  .cover-live .mcp-long { animation: mcp-long var(--mcp-t, 10s) linear infinite; }
}
@media (prefers-reduced-motion: reduce) { .mcp-on, .mcp-hop, .mcp-travel, .mcp-long { animation: none !important; } }
`;

type Win = 'hop' | 'travel' | 'long';

const cycle = (t: string): CSSProperties => ({ '--mcp-t': t } as CSSProperties);
const at = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` });
const along = (path: string, ms: number): CSSProperties => ({
  offsetPath: `path("${path}")`,
  offsetRotate: '0deg',
  animationDelay: `${ms}ms`,
});

function Pulse({ path, ms, win = 'hop', tone = ACCENT }: { path: string; ms: number; win?: Win; tone?: string }) {
  return (
    <g className={`mcp-${win}`} style={along(path, ms)}>
      <circle r={2.4} fill={tone} />
      <circle r={5} fill={tone} fillOpacity={0.25} />
    </g>
  );
}

function Sweep({ x, y, w, h, ms }: { x: number; y: number; w: number; h: number; ms: number }) {
  return (
    <svg x={x} y={y} width={w} height={h} overflow="hidden">
      <rect x={1} y={-1.5} width={w - 2} height={3} fill={ACCENT} fillOpacity={0.55} className="mcp-long" style={along(`M0 0 L0 ${h}`, ms)} />
    </svg>
  );
}

function Working({ x, y, w, h, ms, tone = ACCENT }: { x: number; y: number; w: number; h: number; ms: number; tone?: string }) {
  return (
    <g className="mcp-travel" style={at(ms)}>
      <rect x={x} y={y} width={w} height={h} rx={8} fill={tone} fillOpacity={0.12} className={ANIM.pulse} />
    </g>
  );
}

function Flow({ d, ms, win = 'long', tone = ACCENT }: { d: string; ms: number; win?: Win; tone?: string }) {
  return (
    <g className={`mcp-${win}`} style={at(ms)}>
      <path d={d} fill="none" stroke={tone} strokeOpacity={0.85} strokeWidth={1.25} strokeDasharray="4 4" className={ANIM.flow} />
    </g>
  );
}

function Highlight({ x, y, w, h, ms, win = 'travel', tone = ACCENT }: { x: number; y: number; w: number; h: number; ms: number; win?: Win; tone?: string }) {
  return <rect x={x} y={y} width={w} height={h} rx={3} fill={tone} fillOpacity={0.14} className={`mcp-${win}`} style={at(ms)} />;
}

const McpCover: CoverComponent = ({ uid, title, className }) => {
  const stages = ['validate schema', 'permission tier', 'session budget', 'idempotency claim', 'audit row'];
  const systems: [number, string][] = [[72, 'Orders API'], [136, 'PostgreSQL'], [200, 'Jobs queue']];
  const stageAt = (i: number) => 1900 + i * 450;
  const toOrders = 'M392 160C420 160 420 96 444 96';
  const fromOrders = 'M444 96C420 96 420 160 392 160';
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[320, 160, 220]}>
      <style>{STYLE}</style>
      <g style={cycle('10s')}>
        <text {...caption} x={40} y={52}>Agent</text>
        <text {...caption} x={320} y={52} textAnchor="middle">MCP tool server</text>
        <text {...caption} x={600} y={52} textAnchor="end">Internal systems</text>

        <Panel x={40} y={72} w={152} h={176} />
        <text {...label} x={56} y={96}>LLM agent</text>
        <rect x={50} y={117} width={100} height={15} rx={3} fill={ACCENT} fillOpacity={0.14} className="mcp-on" style={at(1100)} />
        <text {...mono} x={56} y={128} fill={ACCENT}>lookup_order(...)</text>
        <text {...mono} x={56} y={152} fill={ACCENT}>create_refund(...)</text>
        <text {...mono} x={56} y={176} fill={ACCENT}>get_job(...)</text>
        <path d="M158 125l3 3 6-6" fill="none" stroke={GREEN} strokeWidth={1.5} strokeLinecap="round" className="mcp-travel" style={at(7600)} />
        <rect x={56} y={196} width={6} height={11} fill={ACCENT} className={ANIM.blink} />
        <text {...caption} x={56} y={232}>tool_use blocks</text>

        <Panel x={248} y={72} w={144} h={176} />
        {stages.map((s, i) => (
          <g key={s}>
            <Highlight x={256} y={93 + i * 28} w={128} h={15} ms={stageAt(i)} win="hop" />
            <circle cx={262} cy={101 + i * 28} r={2.5} fill={ACCENT} fillOpacity={0.45} />
            <text {...caption} x={272} y={104 + i * 28}>{s}</text>
          </g>
        ))}
        <g className="mcp-on" style={at(stageAt(0) + 400)}>
          {stages.map((s, i) => (
            <circle key={s} cx={262} cy={101 + i * 28} r={2.5} fill={GREEN} className="mcp-on" style={at(stageAt(i) + 400)} />
          ))}
        </g>
        <text {...caption} x={272} y={232} fill={TEXT_MUTED}>then the handler</text>
        <Sweep x={249} y={73} w={142} h={174} ms={1600} />

        {systems.map(([y, name]) => (
          <g key={name}>
            <Panel x={448} y={y} w={152} h={48} fill={NODE_FILL_2} />
            <text {...label} x={464} y={y + 28}>{name}</text>
          </g>
        ))}
        <Working x={449} y={73} w={150} h={46} ms={5100} />

        <Edge uid={uid} d="M192 140H244" />
        <Edge uid={uid} d="M248 180H196" />
        <text {...caption} x={218} y={132} textAnchor="middle">call</text>
        <text {...caption} x={218} y={196} textAnchor="middle">result</text>
        <Edge uid={uid} d={toOrders} dashed />
        <Edge uid={uid} d="M392 160H444" dashed />
        <Edge uid={uid} d="M392 160C420 160 420 224 444 224" dashed />
        <Flow d={toOrders} ms={4100} />

        <Pulse path="M192 140 L244 140" ms={1100} />
        <Pulse path={toOrders} ms={4100} win="travel" />
        <Pulse path={fromOrders} ms={6100} win="travel" tone={GREEN} />
        <Pulse path="M248 180 L196 180" ms={7100} tone={GREEN} />

        <Tag x={40} y={292} text="JSON-RPC" />
        <Tag x={120} y={292} text="Zod schemas" tone="accent" />
        <Tag x={220} y={292} text="Scoped permissions" tone="amber" />
        <Tag x={356} y={292} text="Audit trail" tone="green" />
      </g>
    </CoverFrame>
  );
};

const AgentLoop: CoverComponent = ({ uid, title, className }) => {
  const steps: [string, number][] = [['1  read the tool list', 200], ['2  emit one tool call', 1200], ['3  read structured result', 6800], ['4  call again or answer', 7800]];
  const stages: [string, number, Win, number][] = [
    ['validate arguments', 2300, 'hop', 2700],
    ['permission tier', 2800, 'hop', 3200],
    ['budget check', 3300, 'hop', 3700],
    ['handler', 3800, 'travel', 5800],
    ['audit row', 5800, 'hop', 6200],
  ];
  const tools: [number, string, string, 'green' | 'amber' | 'accent'][] = [
    [88, 'lookup_order', 'read', 'green'],
    [158, 'create_refund', 'write', 'amber'],
    [228, 'start_export', 'job', 'accent'],
  ];
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[332, 176, 220]}>
      <style>{STYLE}</style>
      <g style={cycle('10s')}>
        <text {...caption} x={40} y={56}>Model side</text>
        <text {...caption} x={332} y={56} textAnchor="middle">Protocol boundary</text>
        <text {...caption} x={600} y={56} textAnchor="end">Handlers</text>

        <Panel x={40} y={80} w={168} h={200} />
        <text {...label} x={56} y={104}>Agent loop</text>
        {steps.map(([s, ms], i) => (
          <g key={s}>
            <Highlight x={50} y={125 + i * 24} w={148} h={15} ms={ms} />
            <text {...caption} x={56} y={136 + i * 24}>{s}</text>
          </g>
        ))}
        <circle cx={64} cy={252} r={7} fill="none" stroke={ACCENT} strokeOpacity={0.8} strokeWidth={1.25} strokeDasharray="6 5" />
        <circle cx={64} cy={252} r={7} fill={ACCENT} fillOpacity={0.35} stroke={ACCENT} strokeWidth={1.5} className="mcp-travel" style={at(7800)} />
        <text {...caption} x={80} y={256}>until the final answer</text>

        <Panel x={264} y={80} w={136} h={200} />
        <text {...label} x={332} y={104} textAnchor="middle">MCP server</text>
        {stages.map(([s, ms, win], i) => (
          <g key={s}>
            <rect x={276} y={116 + i * 28} width={112} height={20} rx={4} fill={NODE_FILL_2} stroke={LINE_SOFT} strokeWidth={1} />
            <rect x={276} y={116 + i * 28} width={112} height={20} rx={4} fill={ACCENT} fillOpacity={0.2} className={`mcp-${win}`} style={at(ms)} />
            <text {...caption} x={332} y={130 + i * 28} textAnchor="middle">{s}</text>
          </g>
        ))}
        <rect x={276} y={200} width={112} height={20} rx={4} fill={ACCENT} fillOpacity={0.2} className="mcp-travel" style={at(4800)} />
        <g className="mcp-on" style={at(2700)}>
          {stages.map(([s, , , done], i) => (
            <rect key={s} x={276} y={116 + i * 28} width={112} height={20} rx={4} fill={GREEN} fillOpacity={0.08} stroke={GREEN} strokeOpacity={0.7} strokeWidth={1} className="mcp-on" style={at(done)} />
          ))}
        </g>

        {tools.map(([y, name, tier, tone]) => (
          <g key={name}>
            <Panel x={456} y={y} w={144} h={44} />
            <text {...mono} x={468} y={y + 26} fill={ACCENT}>{name}</text>
            <Tag x={552} y={y + 22} text={tier} tone={tone} />
          </g>
        ))}
        <Working x={457} y={159} w={142} h={42} ms={4300} tone={AMBER} />

        <Edge uid={uid} d="M208 150H260" />
        <text {...caption} x={236} y={142} textAnchor="middle">tools/call</text>
        <Edge uid={uid} d="M264 214H212" />
        <text {...caption} x={238} y={230} textAnchor="middle">result</text>
        <Edge uid={uid} d="M400 180C428 180 428 110 452 110" dashed />
        <Edge uid={uid} d="M400 180H452" dashed />
        <Edge uid={uid} d="M400 180C428 180 428 250 452 250" dashed />
        <Flow d="M400 180H452" ms={3800} win="travel" tone={AMBER} />

        <Pulse path="M208 150 L260 150" ms={1800} />
        <Pulse path="M400 180 L452 180" ms={3800} tone={AMBER} />
        <Pulse path="M452 180 L400 180" ms={5300} tone={GREEN} />
        <Pulse path="M264 214 L212 214" ms={6300} tone={GREEN} />

        <Tag x={40} y={316} text="JSON-RPC 2.0" />
        <Tag x={136} y={316} text="schema is the prompt" tone="accent" />
        <Tag x={284} y={316} text="typed errors" tone="rose" />
        <Tag x={380} y={316} text="audit every call" tone="green" />
      </g>
    </CoverFrame>
  );
};

const IdempotentRetry: CoverComponent = ({ uid, title, className }) => {
  const lanes: [number, string][] = [[96, 'Agent'], [176, 'Server'], [256, 'Upstream']];
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[300, 176, 220]}>
      <style>{STYLE}</style>
      <g style={cycle('10s')}>
        <text {...caption} x={40} y={56}>Same intent, same key</text>
        <text {...caption} x={600} y={56} textAnchor="end">Second call is deduplicated</text>

        {lanes.map(([y, name]) => (
          <g key={name}>
            <text {...label} x={40} y={y + 4}>{name}</text>
            <path d={`M112 ${y}H456`} stroke={LINE_SOFT} strokeWidth={1.25} />
          </g>
        ))}

        <Edge uid={uid} d="M176 100V170" />
        <text {...mono} x={168} y={140} textAnchor="end" fill={ACCENT}>create_refund k1</text>
        <Edge uid={uid} d="M176 180V250" />
        <Edge uid={uid} d="M200 252V182" />
        <text {...caption} x={208} y={220}>refund created</text>
        <path d="M200 172V112" stroke={ROSE} strokeOpacity={0.7} strokeWidth={1.25} strokeDasharray="3 3" />
        <path d="M196 128l8 8M204 128l-8 8" fill="none" stroke={ROSE} strokeOpacity={0.8} strokeWidth={1.25} strokeLinecap="round" />
        <path d="M196 128l8 8M204 128l-8 8" fill="none" stroke={ROSE} strokeWidth={2.5} strokeLinecap="round" className="mcp-hop" style={at(4500)} />
        <text {...caption} x={210} y={124} fill={ROSE}>response lost</text>

        <Edge uid={uid} d="M336 100V170" />
        <text {...mono} x={328} y={140} textAnchor="end" fill={ACCENT}>same key k1</text>
        <Edge uid={uid} d="M348 180H476" dashed />
        <Flow d="M348 180H476" ms={6000} win="travel" tone={AMBER} />
        <Edge uid={uid} d="M360 172V112" />
        <Highlight x={364} y={130} w={66} h={14} ms={9500} tone={GREEN} />
        <text {...caption} x={368} y={140} fill={GREEN}>replayed: true</text>
        <path d="M336 184V224" stroke={ROSE} strokeOpacity={0.6} strokeWidth={1.25} strokeDasharray="3 3" />
        <path d="M336 184V224" fill="none" stroke={ROSE} strokeWidth={2.5} strokeDasharray="3 3" className="mcp-hop" style={at(7200)} />
        <text {...caption} x={344} y={244} fill={ROSE}>upstream skipped</text>

        <Panel x={480} y={140} w={120} h={80} stroke={ACCENT} strokeOpacity={0.5} />
        <Working x={481} y={141} w={118} h={78} ms={7000} />
        <text {...caption} x={540} y={158} textAnchor="middle">idempotency store</text>
        <rect x={490} y={166} width={100} height={20} rx={4} fill={INK} stroke={LINE_SOFT} strokeWidth={1} />
        <text {...mono} x={498} y={180} fill={GREEN}>k1: done</text>
        <g className="mcp-long" style={at(1000)}>
          <rect x={490} y={166} width={100} height={20} rx={4} fill={INK} />
          <text {...mono} x={498} y={180} fill={AMBER}>k1: pending</text>
        </g>
        <rect x={490} y={166} width={100} height={20} rx={4} fill="none" stroke={GREEN} strokeOpacity={0.8} strokeWidth={1.25} pathLength={1} strokeDasharray={1} className="mcp-on" style={at(1000)} />
        <rect x={490} y={166} width={100} height={20} rx={4} fill={GREEN} fillOpacity={0.14} stroke={GREEN} strokeWidth={1.25} className="mcp-travel" style={at(7000)} />
        <text {...caption} x={540} y={208} textAnchor="middle" fill={GREEN}>fingerprint matches</text>
        <text {...caption} x={540} y={236} textAnchor="middle" fill={TEXT_MUTED}>claimed on attempt 1</text>

        <Pulse path="M176 100 L176 170" ms={500} />
        <Pulse path="M176 180 L176 250" ms={1500} />
        <Pulse path="M200 252 L200 182" ms={3500} tone={GREEN} />
        <Pulse path="M200 172 L200 112" ms={4000} tone={GREEN} />
        <Pulse path="M336 100 L336 170" ms={5500} />
        <Pulse path="M348 180 L476 180" ms={6000} win="travel" tone={AMBER} />
        <Pulse path="M476 180 L348 180" ms={8000} win="travel" tone={GREEN} />
        <Pulse path="M360 172 L360 112" ms={9000} tone={GREEN} />

        <Edge uid={uid} d="M112 300H456" />
        <text {...caption} x={464} y={304}>time</text>
        <text {...mono} x={176} y={320} textAnchor="middle">attempt 1</text>
        <text {...mono} x={336} y={320} textAnchor="middle">attempt 2</text>
        <Highlight x={152} y={326} w={48} h={14} ms={5000} tone={ROSE} />
        <text {...caption} x={176} y={336} textAnchor="middle" fill={TEXT_MUTED}>timeout</text>
        <Highlight x={304} y={326} w={64} h={14} ms={9500} tone={GREEN} />
        <text {...caption} x={336} y={336} textAnchor="middle" fill={TEXT_MUTED}>stored result</text>
      </g>
    </CoverFrame>
  );
};

const PermissionGate: CoverComponent = ({ uid, title, className }) => {
  const tiers: [number, string, string, string][] = [
    [84, 'read', 'runs automatically', GREEN],
    [156, 'write', 'confirmation gate', AMBER],
    [228, 'destructive', 'human approval', ROSE],
  ];
  const back = 'M600 180H612V292H120V244';
  const confirmed = 'M392 180C424 180 424 122 452 122';
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[328, 176, 220]}>
      <style>{STYLE}</style>
      <g style={cycle('12s')}>
        <text {...caption} x={40} y={56}>Incoming call</text>
        <text {...caption} x={328} y={56} textAnchor="middle">Tier declared at registration</text>
        <text {...caption} x={600} y={56} textAnchor="end">Outcome</text>

        <Panel x={40} y={120} w={160} h={120} />
        <text {...caption} x={56} y={144}>tools/call</text>
        <text {...mono} x={56} y={168} fill={ACCENT}>create_refund</text>
        <text {...mono} x={56} y={190}>amountMinor: 4200</text>
        <Highlight x={50} y={201} w={70} h={15} ms={200} tone={AMBER} />
        <Highlight x={50} y={157} w={90} h={15} ms={7400} tone={GREEN} />
        <text {...mono} x={56} y={212} fill={AMBER}>tier: write</text>

        {tiers.map(([y, name, sub, tone]) => (
          <g key={name}>
            <Panel x={264} y={y} w={128} h={48} stroke={tone} strokeOpacity={0.55} />
            <text {...label} x={276} y={y + 20} fill={tone}>{name}</text>
            <text {...caption} x={276} y={y + 36}>{sub}</text>
          </g>
        ))}
        <Working x={265} y={157} w={126} h={46} ms={1400} tone={AMBER} />
        <Working x={265} y={157} w={126} h={46} ms={8600} tone={GREEN} />

        <Panel x={456} y={84} w={144} h={48} stroke={GREEN} strokeOpacity={0.4} />
        <Working x={457} y={85} w={142} h={46} ms={11000} tone={GREEN} />
        <text {...caption} x={468} y={104} fill={GREEN}>execute handler</text>
        <text {...caption} x={468} y={120}>result returned</text>

        <Panel x={456} y={156} w={144} h={48} stroke={AMBER} strokeOpacity={0.55} />
        <Working x={457} y={157} w={142} h={46} ms={3200} tone={AMBER} />
        <text {...mono} x={468} y={176} fill={AMBER}>PERMISSION_REQUIRED</text>
        <text {...caption} x={468} y={192}>with a confirmationId</text>
        <circle cx={588} cy={168} r={3} fill={AMBER} />
        <g className="mcp-long" style={at(3200)}>
          <circle cx={588} cy={168} r={4.5} fill={INK} />
          <circle cx={588} cy={168} r={3} fill={AMBER} className={ANIM.blink} />
        </g>
        <circle cx={588} cy={168} r={3} fill={GREEN} className="mcp-long" style={at(6800)} />

        <Panel x={456} y={228} w={144} h={48} stroke={ROSE} strokeOpacity={0.4} />
        <text {...caption} x={468} y={248} fill={ROSE}>blocked</text>
        <text {...caption} x={468} y={264}>logged, never executed</text>

        <Edge uid={uid} d="M200 180H260" />
        <Edge uid={uid} d="M392 108H452" dashed />
        <Edge uid={uid} d="M392 180H452" dashed />
        <Edge uid={uid} d="M392 252H452" dashed />
        <Edge uid={uid} d={confirmed} dashed opacity={0.55} />
        <Flow d={confirmed} ms={9800} win="travel" tone={GREEN} />
        <path d={back} fill="none" stroke={AMBER} strokeOpacity={0.6} strokeWidth={1.25} strokeDasharray="4 4" markerEnd={`url(#${uid}-arrow)`} />
        <path d={back} fill="none" stroke={GREEN} strokeOpacity={0.9} strokeWidth={1.5} strokeLinecap="round" pathLength={1} strokeDasharray={1} className="mcp-on" style={at(4400)} />
        <Highlight x={222} y={302} w={288} h={14} ms={6800} tone={GREEN} />
        <text {...caption} x={366} y={312} textAnchor="middle">operator approves, agent retries with the same idempotencyKey</text>

        <Pulse path="M200 180 L260 180" ms={800} tone={AMBER} />
        <Pulse path="M392 180 L452 180" ms={2600} tone={AMBER} />
        <Pulse path="M200 180 L260 180" ms={8000} tone={GREEN} />
        <Pulse path={confirmed} ms={9800} win="travel" tone={GREEN} />

        <Tag x={40} y={340} text="read: auto" tone="green" />
        <Tag x={124} y={340} text="write: confirm" tone="amber" />
        <Tag x={228} y={340} text="destructive: human" tone="rose" />
      </g>
    </CoverFrame>
  );
};

export const COVER: CoverComponent = McpCover;

export const FIGURES: Record<string, CoverComponent> = {
  'mcp-tool-server-design/agent-loop': AgentLoop,
  'mcp-tool-server-design/idempotent-retry': IdempotentRetry,
  'mcp-tool-server-design/permission-gate': PermissionGate,
};
