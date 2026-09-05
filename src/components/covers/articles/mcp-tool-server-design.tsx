'use client';
import type { CSSProperties } from 'react';
import { ACCENT, AMBER, ANIM, caption, CoverFrame, Edge, GREEN, label, LINE_SOFT, mono, NODE_FILL_2, Panel, ROSE, Tag, TEXT_MUTED, type CoverComponent } from '../shared';

const INK = '#0b0f17';

const travel = (path: string, delayMs: number): CSSProperties => ({
  offsetPath: `path("${path}")`,
  offsetRotate: '0deg',
  animationDelay: `${delayMs}ms`,
});

/* A dot that travels along a local path; place inside a translated group. */
function Pulse({ path, delayMs, tone = ACCENT }: { path: string; delayMs: number; tone?: string }) {
  return (
    <g className={ANIM.travel} style={travel(path, delayMs)}>
      <circle r={2.4} fill={tone} />
      <circle r={5} fill={tone} fillOpacity={0.25} />
    </g>
  );
}

/* Nested viewport so the ca-scan sweep stays inside the panel it scans. */
function Sweep({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <svg x={x} y={y} width={w} height={h} overflow="hidden">
      <rect x={1} y={0} width={w - 2} height={3} fill={ACCENT} fillOpacity={0.55} className={ANIM.scan} />
    </svg>
  );
}

/* Card cover: agent, server stages, internal systems. */
const McpCover: CoverComponent = ({ uid, title, className }) => {
  const stages = ['validate schema', 'permission tier', 'session budget', 'idempotency claim', 'audit row'];
  const systems: [number, string][] = [[72, 'Orders API'], [136, 'PostgreSQL'], [200, 'Jobs queue']];
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[320, 160, 220]}>
      <text {...caption} x={40} y={52}>Agent</text>
      <text {...caption} x={320} y={52} textAnchor="middle">MCP tool server</text>
      <text {...caption} x={600} y={52} textAnchor="end">Internal systems</text>

      <Panel x={40} y={72} w={152} h={176} />
      <text {...label} x={56} y={96}>LLM agent</text>
      <text {...mono} x={56} y={128} fill={ACCENT}>lookup_order(...)</text>
      <text {...mono} x={56} y={152} fill={ACCENT}>create_refund(...)</text>
      <text {...mono} x={56} y={176} fill={ACCENT}>get_job(...)</text>
      <rect x={56} y={196} width={6} height={11} fill={ACCENT} className={ANIM.blink} />
      <text {...caption} x={56} y={232}>tool_use blocks</text>

      <Panel x={248} y={72} w={144} h={176} />
      {stages.map((s, i) => (
        <g key={s}>
          <circle cx={262} cy={101 + i * 28} r={2.5} fill={ACCENT} fillOpacity={0.9} />
          <text {...caption} x={272} y={104 + i * 28}>{s}</text>
        </g>
      ))}
      <text {...caption} x={272} y={232} fill={TEXT_MUTED}>then the handler</text>
      <Sweep x={249} y={73} w={142} h={174} />

      {systems.map(([y, name]) => (
        <g key={name}>
          <Panel x={448} y={y} w={152} h={48} fill={NODE_FILL_2} />
          <text {...label} x={464} y={y + 28}>{name}</text>
        </g>
      ))}

      <Edge uid={uid} d="M192 140H244" />
      <Edge uid={uid} d="M248 180H196" />
      <text {...caption} x={218} y={132} textAnchor="middle">call</text>
      <text {...caption} x={218} y={196} textAnchor="middle">result</text>
      <g className={ANIM.flow}>
        <Edge uid={uid} d="M392 160C420 160 420 96 444 96" dashed />
        <Edge uid={uid} d="M392 160H444" dashed />
        <Edge uid={uid} d="M392 160C420 160 420 224 444 224" dashed />
      </g>

      <g transform="translate(192 140)"><Pulse path="M0 0 L52 0" delayMs={0} /></g>
      <g transform="translate(392 160)"><Pulse path="M0 0 L52 0" delayMs={700} /></g>
      <g transform="translate(248 180)"><Pulse path="M0 0 L-52 0" delayMs={1400} tone={GREEN} /></g>

      <Tag x={40} y={292} text="JSON-RPC" />
      <Tag x={120} y={292} text="Zod schemas" tone="accent" />
      <Tag x={220} y={292} text="Scoped permissions" tone="amber" />
      <Tag x={356} y={292} text="Audit trail" tone="green" />
    </CoverFrame>
  );
};

/* Figure: the agent loop crossing the protocol boundary into typed handlers. */
const AgentLoop: CoverComponent = ({ uid, title, className }) => {
  const steps = ['1  read the tool list', '2  emit one tool call', '3  read structured result', '4  call again or answer'];
  const stages = ['validate arguments', 'permission tier', 'budget check', 'handler', 'audit row'];
  const tools: [number, string, string, 'green' | 'amber' | 'accent'][] = [
    [88, 'lookup_order', 'read', 'green'],
    [158, 'create_refund', 'write', 'amber'],
    [228, 'start_export', 'job', 'accent'],
  ];
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[332, 176, 220]}>
      <text {...caption} x={40} y={56}>Model side</text>
      <text {...caption} x={332} y={56} textAnchor="middle">Protocol boundary</text>
      <text {...caption} x={600} y={56} textAnchor="end">Handlers</text>

      <Panel x={40} y={80} w={168} h={200} />
      <text {...label} x={56} y={104}>Agent loop</text>
      {steps.map((s, i) => (
        <text key={s} {...caption} x={56} y={136 + i * 24}>{s}</text>
      ))}
      <circle cx={64} cy={252} r={7} fill="none" stroke={ACCENT} strokeOpacity={0.8} strokeWidth={1.25} strokeDasharray="6 5" className={ANIM.spin} />
      <text {...caption} x={80} y={256}>until the final answer</text>

      <Panel x={264} y={80} w={136} h={200} />
      <text {...label} x={332} y={104} textAnchor="middle">MCP server</text>
      {stages.map((s, i) => (
        <g key={s}>
          <rect x={276} y={116 + i * 28} width={112} height={20} rx={4} fill={NODE_FILL_2} stroke={LINE_SOFT} strokeWidth={1} />
          <text {...caption} x={332} y={130 + i * 28} textAnchor="middle">{s}</text>
        </g>
      ))}
      <Sweep x={265} y={81} w={134} h={198} />

      {tools.map(([y, name, tier, tone]) => (
        <g key={name}>
          <Panel x={456} y={y} w={144} h={44} />
          <text {...mono} x={468} y={y + 26} fill={ACCENT}>{name}</text>
          <Tag x={552} y={y + 22} text={tier} tone={tone} />
        </g>
      ))}

      <Edge uid={uid} d="M208 150H260" />
      <text {...caption} x={236} y={142} textAnchor="middle">tools/call</text>
      <Edge uid={uid} d="M264 214H212" />
      <text {...caption} x={238} y={230} textAnchor="middle">result</text>
      <g className={ANIM.flow}>
        <Edge uid={uid} d="M400 180C428 180 428 110 452 110" dashed />
        <Edge uid={uid} d="M400 180H452" dashed />
        <Edge uid={uid} d="M400 180C428 180 428 250 452 250" dashed />
      </g>

      <g transform="translate(208 150)"><Pulse path="M0 0 L52 0" delayMs={0} /></g>
      <g transform="translate(400 180)"><Pulse path="M0 0 L52 0" delayMs={600} tone={AMBER} /></g>
      <g transform="translate(264 214)"><Pulse path="M0 0 L-52 0" delayMs={1200} tone={GREEN} /></g>

      <Tag x={40} y={316} text="JSON-RPC 2.0" />
      <Tag x={136} y={316} text="schema is the prompt" tone="accent" />
      <Tag x={284} y={316} text="typed errors" tone="rose" />
      <Tag x={380} y={316} text="audit every call" tone="green" />
    </CoverFrame>
  );
};

/* Figure: two attempts with one idempotency key across agent, server and upstream lanes. */
const IdempotentRetry: CoverComponent = ({ uid, title, className }) => {
  const lanes: [number, string][] = [[96, 'Agent'], [176, 'Server'], [256, 'Upstream']];
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[300, 176, 220]}>
      <text {...caption} x={40} y={56}>Same intent, same key</text>
      <text {...caption} x={600} y={56} textAnchor="end">Second call is deduplicated</text>

      {lanes.map(([y, name]) => (
        <g key={name}>
          <text {...label} x={40} y={y + 4}>{name}</text>
          <path d={`M112 ${y}H456`} stroke={LINE_SOFT} strokeWidth={1.25} />
        </g>
      ))}

      {/* attempt 1 */}
      <Edge uid={uid} d="M176 100V170" />
      <text {...mono} x={168} y={140} textAnchor="end" fill={ACCENT}>create_refund k1</text>
      <Edge uid={uid} d="M176 180V250" />
      <Edge uid={uid} d="M200 252V182" />
      <text {...caption} x={208} y={220}>refund created</text>
      <path d="M200 172V112" stroke={ROSE} strokeOpacity={0.7} strokeWidth={1.25} strokeDasharray="3 3" />
      <g className={ANIM.blink} stroke={ROSE} strokeWidth={1.25} strokeLinecap="round">
        <path d="M196 128l8 8M204 128l-8 8" />
      </g>
      <text {...caption} x={210} y={124} fill={ROSE}>response lost</text>

      {/* attempt 2 */}
      <Edge uid={uid} d="M336 100V170" />
      <text {...mono} x={328} y={140} textAnchor="end" fill={ACCENT}>same key k1</text>
      <Edge uid={uid} d="M348 180H476" dashed className={ANIM.flow} />
      <Edge uid={uid} d="M360 172V112" />
      <text {...caption} x={368} y={140} fill={GREEN}>replayed: true</text>
      <path d="M336 184V224" stroke={ROSE} strokeOpacity={0.6} strokeWidth={1.25} strokeDasharray="3 3" />
      <text {...caption} x={344} y={244} fill={ROSE}>upstream skipped</text>

      <Panel x={480} y={140} w={120} h={80} stroke={ACCENT} strokeOpacity={0.5} />
      <text {...caption} x={540} y={158} textAnchor="middle">idempotency store</text>
      <rect x={490} y={166} width={100} height={20} rx={4} fill={INK} stroke={LINE_SOFT} strokeWidth={1} />
      <text {...mono} x={498} y={180} fill={GREEN}>k1: done</text>
      <text {...caption} x={540} y={208} textAnchor="middle" fill={GREEN}>fingerprint matches</text>
      <text {...caption} x={540} y={236} textAnchor="middle" fill={TEXT_MUTED}>claimed on attempt 1</text>

      <g transform="translate(176 100)"><Pulse path="M0 0 L0 70" delayMs={0} /></g>
      <g transform="translate(176 180)"><Pulse path="M0 0 L0 70" delayMs={300} /></g>
      <g transform="translate(200 252)"><Pulse path="M0 0 L0 -70" delayMs={600} tone={GREEN} /></g>
      <g transform="translate(336 100)"><Pulse path="M0 0 L0 70" delayMs={1300} /></g>
      <g transform="translate(348 180)"><Pulse path="M0 0 L128 0" delayMs={1600} tone={AMBER} /></g>
      <g transform="translate(360 172)"><Pulse path="M0 0 L0 -60" delayMs={1900} tone={GREEN} /></g>

      <Edge uid={uid} d="M112 300H456" />
      <text {...caption} x={464} y={304}>time</text>
      <text {...mono} x={176} y={320} textAnchor="middle">attempt 1</text>
      <text {...mono} x={336} y={320} textAnchor="middle">attempt 2</text>
      <text {...caption} x={176} y={336} textAnchor="middle" fill={TEXT_MUTED}>timeout</text>
      <text {...caption} x={336} y={336} textAnchor="middle" fill={TEXT_MUTED}>stored result</text>
    </CoverFrame>
  );
};

/* Figure: a write-tier call held at the gate, confirmed, then retried with the same key. */
const PermissionGate: CoverComponent = ({ uid, title, className }) => {
  const tiers: [number, string, string, string][] = [
    [84, 'read', 'runs automatically', GREEN],
    [156, 'write', 'confirmation gate', AMBER],
    [228, 'destructive', 'human approval', ROSE],
  ];
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[328, 176, 220]}>
      <text {...caption} x={40} y={56}>Incoming call</text>
      <text {...caption} x={328} y={56} textAnchor="middle">Tier declared at registration</text>
      <text {...caption} x={600} y={56} textAnchor="end">Outcome</text>

      <Panel x={40} y={120} w={160} h={120} />
      <text {...caption} x={56} y={144}>tools/call</text>
      <text {...mono} x={56} y={168} fill={ACCENT}>create_refund</text>
      <text {...mono} x={56} y={190}>amountMinor: 4200</text>
      <text {...mono} x={56} y={212} fill={AMBER}>tier: write</text>

      {tiers.map(([y, name, sub, tone]) => (
        <g key={name}>
          <Panel x={264} y={y} w={128} h={48} stroke={tone} strokeOpacity={0.55} />
          <text {...label} x={276} y={y + 20} fill={tone}>{name}</text>
          <text {...caption} x={276} y={y + 36}>{sub}</text>
        </g>
      ))}

      <Panel x={456} y={84} w={144} h={48} stroke={GREEN} strokeOpacity={0.4} />
      <text {...caption} x={468} y={104} fill={GREEN}>execute handler</text>
      <text {...caption} x={468} y={120}>result returned</text>

      <Panel x={456} y={156} w={144} h={48} stroke={AMBER} strokeOpacity={0.55} />
      <text {...mono} x={468} y={176} fill={AMBER}>PERMISSION_REQUIRED</text>
      <text {...caption} x={468} y={192}>with a confirmationId</text>
      <circle cx={588} cy={168} r={3} fill={AMBER} className={ANIM.blink} />

      <Panel x={456} y={228} w={144} h={48} stroke={ROSE} strokeOpacity={0.4} />
      <text {...caption} x={468} y={248} fill={ROSE}>blocked</text>
      <text {...caption} x={468} y={264}>logged, never executed</text>

      <Edge uid={uid} d="M200 180H260" />
      <g className={ANIM.flow}>
        <Edge uid={uid} d="M392 108H452" dashed />
        <Edge uid={uid} d="M392 180H452" dashed />
        <Edge uid={uid} d="M392 252H452" dashed />
      </g>
      <path d="M600 180H612V292H120V244" fill="none" stroke={AMBER} strokeOpacity={0.6} strokeWidth={1.25} strokeDasharray="4 4" className={ANIM.flow} markerEnd={`url(#${uid}-arrow)`} />
      <text {...caption} x={366} y={312} textAnchor="middle">operator approves, agent retries with the same idempotencyKey</text>

      <g transform="translate(200 180)"><Pulse path="M0 0 L60 0" delayMs={0} tone={AMBER} /></g>
      <g transform="translate(392 180)"><Pulse path="M0 0 L60 0" delayMs={500} tone={AMBER} /></g>
      <g transform="translate(600 180)"><Pulse path="M0 0 L12 0 L12 112 L-480 112 L-480 64" delayMs={1100} tone={GREEN} /></g>

      <Tag x={40} y={340} text="read: auto" tone="green" />
      <Tag x={124} y={340} text="write: confirm" tone="amber" />
      <Tag x={228} y={340} text="destructive: human" tone="rose" />
    </CoverFrame>
  );
};

export const COVER: CoverComponent = McpCover;

export const FIGURES: Record<string, CoverComponent> = {
  'mcp-tool-server-design/agent-loop': AgentLoop,
  'mcp-tool-server-design/idempotent-retry': IdempotentRetry,
  'mcp-tool-server-design/permission-gate': PermissionGate,
};
