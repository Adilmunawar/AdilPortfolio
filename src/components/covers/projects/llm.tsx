'use client';
import {
  ACCENT, AMBER, ANIM, CoverFrame, Edge, GREEN, LINE, LINE_SOFT, NODE_FILL, NODE_FILL_2, Panel, ROSE, TEXT, TEXT_MUTED, Tag,
  caption, delay, label, mono, type CoverComponent,
} from '../shared';

const WHITE = '#f2f4f8';
const INK = '#0b0f17';

function Bar({ x, y, w, h = 4, fill = '#fff', o = 0.18 }: { x: number; y: number; w: number; h?: number; fill?: string; o?: number }) {
  return <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={fill} fillOpacity={o} />;
}

function Doc({ x, y, w, h, f = 12 }: { x: number; y: number; w: number; h: number; f?: number }) {
  return (
    <g transform={`translate(${x} ${y})`} fill={NODE_FILL} stroke={LINE} strokeWidth={1.25} strokeLinejoin="round">
      <path d={`M0 0h${w - f}l${f} ${f}v${h - f}H0z`} />
      <path d={`M${w - f} 0v${f}h${f}`} fill="none" />
    </g>
  );
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

const star = (cx: number, cy: number, r: number) => {
  const k = r * 0.2;
  return `M${cx} ${cy - r}Q${cx + k} ${cy - k} ${cx + r} ${cy}Q${cx + k} ${cy + k} ${cx} ${cy + r}Q${cx - k} ${cy + k} ${cx - r} ${cy}Q${cx - k} ${cy - k} ${cx} ${cy - r}Z`;
};

// Docs -> chunker -> embeddings -> pgvector; query from the right; hybrid hits -> reranker -> LLM -> cited answer.
const EnterpriseRag: CoverComponent = ({ uid, title, className }) => (
  <CoverFrame uid={uid} title={title} className={className} glow={[352, 176, 208]}>
    <text {...caption} x={40} y={44}>Ingest</text>
    <text {...caption} x={600} y={44} textAnchor="end">Grounded answers</text>

    {[0, 1, 2].map((i) => <Doc key={i} x={48 + i * 8} y={76 + i * 8} w={40} h={56} f={10} />)}
    <path d="M72 108h20M72 116h16M72 124h22M72 132h12" stroke={LINE_SOFT} strokeWidth={2} />
    <Edge d="M108 112h24" uid={uid} />

    <Panel x={136} y={88} w={64} h={48} />
    <Bar x={148} y={100} w={40} o={0.22} />
    <Bar x={148} y={110} w={28} o={0.22} />
    <Bar x={148} y={120} w={40} o={0.22} />
    <text {...caption} x={168} y={156} textAnchor="middle">Chunker</text>
    <Edge d="M200 112h20" uid={uid} />

    <Panel x={224} y={88} w={80} h={48} />
    {[0, 1, 2].map((r) => [0, 1, 2, 3, 4, 5].map((c) => (
      <circle key={`${r}-${c}`} cx={239 + c * 10} cy={100 + r * 12} r={2} fill={ACCENT} fillOpacity={0.3 + ((r * 2 + c) % 4) * 0.2} />
    )))}
    <text {...caption} x={264} y={156} textAnchor="middle">Embeddings</text>
    <Edge d="M304 112h20" uid={uid} />

    <Cylinder cx={360} top={92} />
    <text {...caption} x={360} y={156} textAnchor="middle">pgvector</text>

    <Panel x={520} y={96} w={80} h={32} stroke={ACCENT} strokeOpacity={0.5} />
    <text {...label} x={560} y={116} textAnchor="middle">Query</text>
    <Edge d="M520 112H400" uid={uid} dashed className={ANIM.flow} />
    <text {...caption} x={460} y={132} textAnchor="middle" fontSize={8}>hybrid search</text>

    <text {...caption} x={560} y={150} textAnchor="middle" fontSize={8}>eval harness</text>
    <path d="M536 184a24 24 0 0 1 48 0" fill="none" stroke={LINE} strokeWidth={1.25} />
    <path d="M536 184A24 24 0 0 1 577 167" fill="none" stroke={ACCENT} strokeWidth={1.25} strokeLinecap="round" />
    <circle cx={577} cy={167} r={2.5} fill={ACCENT} />
    <text {...mono} x={560} y={182} textAnchor="middle" fontSize={8} fill={WHITE}>0.91</text>

    <Edge d="M360 146v30H112v12" uid={uid} dashed className={ANIM.flow} />

    <Panel x={48} y={192} w={128} h={96} />
    {[80, 60, 44].map((w, i) => (
      <g key={w}>
        <text {...mono} x={60} y={219 + i * 28} fontSize={8} fill={TEXT_MUTED}>0{i + 1}</text>
        <rect x={80} y={213 + i * 28} width={w} height={6} rx={3} fill={ACCENT} fillOpacity={0.85 - i * 0.25} />
      </g>
    ))}
    <text {...caption} x={112} y={308} textAnchor="middle" fontSize={8}>top-3 chunks</text>
    <Edge d="M176 240h20" uid={uid} />

    <Panel x={200} y={216} w={72} h={48} />
    <text {...label} x={236} y={244} textAnchor="middle">Reranker</text>
    <text {...caption} x={236} y={284} textAnchor="middle" fontSize={8}>cross-encoder</text>
    <Edge d="M272 240h20" uid={uid} />

    <Panel x={296} y={216} w={64} h={48} stroke={ACCENT} strokeOpacity={0.5} />
    <text {...label} x={328} y={244} textAnchor="middle">LLM</text>
    <Edge d="M360 240h20" uid={uid} />

    <Panel x={384} y={192} w={216} h={112} />
    <text {...caption} x={396} y={212} fill={TEXT}>Answer</text>
    <Bar x={396} y={222} w={176} o={0.22} />
    <Bar x={396} y={234} w={128} o={0.22} />
    <Bar x={396} y={246} w={184} o={0.22} />
    <Bar x={396} y={258} w={104} o={0.22} />
    <g className={ANIM.pulse}>
      <text {...mono} x={532} y={241} fontSize={8} fill={ACCENT}>[1]</text>
      <text {...mono} x={508} y={265} fontSize={8} fill={ACCENT}>[2]</text>
    </g>
    <path d="M396 276h192" stroke={LINE_SOFT} />
    <text {...mono} x={396} y={293} fontSize={8} fill={TEXT_MUTED}>[1] policy.pdf</text>
    <text {...mono} x={496} y={293} fontSize={8} fill={TEXT_MUTED}>[2] handbook.md</text>
  </CoverFrame>
);

// Agent with a plan -> guardrail -> MCP server exposing typed tools -> internal API / Postgres; audit strip below.
const AgenticMcp: CoverComponent = ({ uid, title, className }) => {
  const steps: [string, boolean][] = [['query db', true], ['fetch crm', true], ['run report', false]];
  const tools: [string, string][] = [['db.query', '→ rows'], ['crm.get', '→ json'], ['report.run', '→ pdf']];
  const log: [string, string][] = [['db.query · ok', GREEN], ['crm.get · ok', GREEN], ['report.run · confirm', AMBER]];
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[320, 160, 208]}>
      <text {...caption} x={40} y={44}>Agent loop</text>
      <text {...caption} x={600} y={44} textAnchor="end">Internal systems</text>

      <Panel x={40} y={96} w={128} h={128} />
      <circle cx={56} cy={116} r={3} fill={GREEN} className={ANIM.blink} />
      <text {...label} x={66} y={120}>Agent</text>
      <text {...caption} x={156} y={120} textAnchor="end" fontSize={8}>plan</text>
      <path d="M52 132h104" stroke={LINE_SOFT} />
      {steps.map(([s, done], i) => {
        const y = 152 + i * 24;
        return (
          <g key={s}>
            {done
              ? <Check x={58} y={y - 3} />
              : <circle cx={58} cy={y - 3} r={6} fill="none" stroke={ACCENT} strokeOpacity={0.7} strokeWidth={1.25} strokeDasharray="2 3" />}
            <text {...mono} x={72} y={y} fill={done ? TEXT : TEXT_MUTED}>{s}</text>
          </g>
        );
      })}

      <Edge d="M168 160h16" dashed className={ANIM.flow} />
      <path d="M204 146l10 4v9q0 10-10 15q-10-5-10-15v-9z" fill={NODE_FILL_2} stroke={GREEN} strokeOpacity={0.8} strokeWidth={1.25} strokeLinejoin="round" />
      <path d="M199 160l4 4 6-7" fill="none" stroke={GREEN} strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" />
      <text {...caption} x={204} y={190} textAnchor="middle" fontSize={8}>guardrail</text>
      <Edge d="M220 160h16" uid={uid} />

      <Panel x={240} y={80} w={160} h={160} stroke={ACCENT} strokeOpacity={0.5} />
      <text {...caption} x={256} y={100} fill={TEXT}>MCP server</text>
      <Tag x={344} y={97} text="typed" tone="green" />
      <path d="M252 112h136" stroke={LINE_SOFT} />
      {tools.map(([t, out], i) => (
        <g key={t}>
          <Tag x={256} y={136 + i * 32} text={t} tone="accent" />
          <text {...mono} x={336} y={139 + i * 32} fontSize={8} fill={TEXT_MUTED}>{out}</text>
        </g>
      ))}

      <Edge d="M400 136h80" uid={uid} dashed className={ANIM.flow} />
      <Edge d="M400 200h104" uid={uid} dashed className={ANIM.flow} />
      <Panel x={488} y={112} w={112} h={48} />
      <text {...label} x={544} y={140} textAnchor="middle">Internal API</text>
      <Cylinder cx={544} top={192} />
      <text {...caption} x={544} y={254} textAnchor="middle">Postgres</text>

      <Panel x={40} y={272} w={560} h={40} />
      <Tag x={52} y={292} text="audit log" />
      {log.map(([t, tone], i) => (
        <g key={t}>
          <circle cx={144 + i * 152} cy={292} r={2.5} fill={tone} />
          <text {...mono} x={152 + i * 152} y={295} fontSize={8}>{t}</text>
        </g>
      ))}
    </CoverFrame>
  );
};

// Résumé page -> parsed record (name, skills, experience) -> ranked candidates with growing score bars; MFA badge.
const AdiGaze: CoverComponent = ({ uid, title, className }) => {
  const rows: [number, number, string][] = [[128, 48, '92'], [104, 40, '81'], [72, 56, '64']];
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[320, 168, 208]}>
      <text {...caption} x={40} y={44}>Résumé</text>
      <text {...caption} x={224} y={44}>Structured record</text>
      <text {...caption} x={600} y={44} textAnchor="end">Ranked</text>

      <Doc x={48} y={64} w={136} h={192} f={16} />
      <Bar x={64} y={84} w={64} h={6} o={0.4} />
      <Bar x={64} y={96} w={48} h={3} />
      <Bar x={64} y={120} w={104} />
      <Bar x={64} y={130} w={96} />
      <Bar x={64} y={140} w={72} />
      <Bar x={64} y={160} w={40} h={5} fill={ACCENT} o={0.6} />
      <Bar x={64} y={172} w={104} />
      <Bar x={64} y={182} w={88} />
      <Bar x={64} y={192} w={96} />
      <Bar x={64} y={212} w={40} h={5} fill={ACCENT} o={0.6} />
      <Bar x={64} y={224} w={72} />
      <Bar x={64} y={234} w={100} />
      <text {...caption} x={116} y={280} textAnchor="middle" fontSize={8}>PDF · DOCX</text>
      <Edge d="M188 160h28" uid={uid} dashed className={ANIM.flow} />

      <Panel x={224} y={64} w={160} h={192} />
      <text {...caption} x={236} y={84} fontSize={8}>name</text>
      <Bar x={236} y={92} w={96} h={6} o={0.35} />
      <text {...caption} x={236} y={120} fontSize={8}>skills</text>
      <Tag x={236} y={136} text="React" tone="accent" />
      <Tag x={284} y={136} text="SQL" tone="accent" />
      <Tag x={320} y={136} text="Python" tone="accent" />
      <text {...caption} x={236} y={168} fontSize={8}>experience</text>
      <Bar x={236} y={178} w={72} h={5} o={0.35} />
      <text {...mono} x={372} y={184} fontSize={8} textAnchor="end" fill={TEXT_MUTED}>2022 – 24</text>
      <Bar x={236} y={190} w={112} h={3} />
      <Bar x={236} y={206} w={56} h={5} o={0.35} />
      <text {...mono} x={372} y={212} fontSize={8} textAnchor="end" fill={TEXT_MUTED}>2019 – 22</text>
      <Bar x={236} y={218} w={96} h={3} />
      <text {...caption} x={304} y={280} textAnchor="middle" fontSize={8}>edge functions</text>
      <Edge d="M388 160h28" uid={uid} />

      <Panel x={424} y={64} w={176} h={192} />
      <text {...caption} x={436} y={84} fill={TEXT}>Match score</text>
      <text {...caption} x={588} y={84} textAnchor="end" fontSize={8}>vs. role</text>
      <path d="M436 96h152" stroke={LINE_SOFT} />
      {rows.map(([w, name, score], i) => {
        const y = 120 + i * 40;
        return (
          <g key={score}>
            <text {...mono} x={436} y={y + 3} fontSize={8} fill={TEXT_MUTED}>0{i + 1}</text>
            <Bar x={456} y={y - 3} w={name} h={6} o={i ? 0.22 : 0.4} />
            <rect x={456} y={y + 8} width={w} height={6} rx={3} fill={ACCENT} fillOpacity={0.9 - i * 0.2} className={ANIM.grow} style={delay(i * 160)} />
            <text {...mono} x={588} y={y + 3} textAnchor="end" fill={i ? TEXT : WHITE}>{score}</text>
          </g>
        );
      })}
      <rect x={490} y={282} width={12} height={9} rx={2} fill="none" stroke={GREEN} strokeWidth={1.25} />
      <path d="M492 282v-3a4 4 0 0 1 8 0v3" fill="none" stroke={GREEN} strokeWidth={1.25} />
      <Tag x={510} y={286} text="MFA" tone="green" />
    </CoverFrame>
  );
};

// Chat window: user bubble with PDF + code attachments, markdown reply with a blinking cursor; voice waveform and dev-mode toggle.
const AdiGon: CoverComponent = ({ uid, title, className }) => {
  const wave = [6, 12, 20, 10, 26, 16, 8, 22, 14, 6, 18, 10];
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[224, 184, 208]}>
      <text {...caption} x={40} y={44}>Assistant</text>
      <text {...caption} x={600} y={44} textAnchor="end">Controls</text>

      <Panel x={48} y={56} w={352} h={256} />
      <path d="M48 64q0-8 8-8h336q8 0 8 8v16H48z" fill={ACCENT} fillOpacity={0.1} />
      <circle cx={64} cy={68} r={3} fill={GREEN} />
      <text {...caption} x={74} y={71.5} fill={TEXT}>AdiGon</text>
      <text {...caption} x={388} y={71.5} textAnchor="end" fontSize={8}>Gemini</text>

      <rect x={192} y={96} width={192} height={64} rx={10} fill={ACCENT} fillOpacity={0.14} stroke={ACCENT} strokeOpacity={0.35} strokeWidth={1.25} />
      <rect x={204} y={108} width={84} height={20} rx={4} fill={NODE_FILL} stroke={LINE} strokeWidth={1.25} />
      <path d="M212 112h6l3 3v9h-9z" fill="none" stroke={ROSE} strokeWidth={1.25} strokeLinejoin="round" />
      <text {...mono} x={228} y={121.5} fontSize={8}>spec.pdf</text>
      <rect x={296} y={108} width={76} height={20} rx={4} fill={NODE_FILL} stroke={LINE} strokeWidth={1.25} />
      <path d="M307 114l-3 4 3 4M315 114l3 4-3 4" fill="none" stroke={ACCENT} strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" />
      <text {...mono} x={324} y={121.5} fontSize={8}>app.tsx</text>
      <Bar x={204} y={140} w={144} o={0.22} />
      <Bar x={204} y={150} w={80} o={0.22} />

      <rect x={64} y={176} width={248} height={96} rx={10} fill={NODE_FILL_2} stroke={LINE} strokeWidth={1.25} />
      <Bar x={76} y={188} w={88} h={6} o={0.35} />
      <rect x={76} y={202} width={224} height={28} rx={4} fill={INK} stroke={LINE_SOFT} strokeWidth={1.25} />
      <Bar x={84} y={209} w={56} h={3} fill={ACCENT} o={0.6} />
      <Bar x={148} y={209} w={96} h={3} />
      <Bar x={84} y={219} w={40} h={3} />
      <Bar x={132} y={219} w={72} h={3} fill={ACCENT} o={0.45} />
      <circle cx={82} cy={244} r={1.5} fill={TEXT_MUTED} />
      <Bar x={90} y={242} w={160} o={0.22} />
      <circle cx={82} cy={256} r={1.5} fill={TEXT_MUTED} />
      <Bar x={90} y={254} w={112} o={0.22} />
      <rect x={206} y={250} width={1.5} height={11} fill={ACCENT} className={ANIM.blink} />

      <rect x={64} y={284} width={320} height={20} rx={10} fill={INK} stroke={LINE_SOFT} strokeWidth={1.25} />
      <text {...caption} x={76} y={297.5} fontSize={8}>Message AdiGon…</text>
      <rect x={365} y={288} width={6} height={9} rx={3} fill="none" stroke={TEXT_MUTED} strokeWidth={1.25} />
      <path d="M362 294a6 6 0 0 0 12 0" fill="none" stroke={TEXT_MUTED} strokeWidth={1.25} />

      <text {...caption} x={432} y={80}>Voice input</text>
      <Panel x={432} y={88} w={168} h={64} />
      <rect x={448} y={106} width={10} height={18} rx={5} fill={ACCENT} fillOpacity={0.25} stroke={ACCENT} strokeWidth={1.25} />
      <path d="M444 118a9 9 0 0 0 18 0M453 127v5" fill="none" stroke={ACCENT} strokeWidth={1.25} strokeLinecap="round" />
      <g className={ANIM.pulse}>
        {wave.map((h, i) => <rect key={i} x={480 + i * 9} y={120 - h / 2} width={4} height={h} rx={2} fill={ACCENT} fillOpacity={0.85} />)}
      </g>

      <Panel x={432} y={176} w={168} h={40} />
      <text {...label} x={448} y={200}>Developer mode</text>
      <rect x={548} y={188} width={36} height={16} rx={8} fill={GREEN} fillOpacity={0.25} stroke={GREEN} strokeOpacity={0.6} strokeWidth={1.25} />
      <circle cx={575} cy={196} r={5.5} fill={GREEN} />

      <text {...caption} x={432} y={248}>Accepts</text>
      <Tag x={432} y={268} text="PDF" tone="rose" />
      <Tag x={472} y={268} text="Code" tone="accent" />
      <Tag x={516} y={268} text="Markdown" />
    </CoverFrame>
  );
};

// Keyword table with volume bars, you-vs-rivals chart, article skeleton filling in, SEO score dial with audit checks.
const AdiHunt: CoverComponent = ({ uid, title, className }) => {
  const kw: [number, number, string][] = [[64, 88, '12k'], [48, 64, '8.4k'], [80, 48, '5.1k'], [40, 32, '2.3k']];
  const you = [36, 24, 44, 32];
  const rivals = [20, 32, 16, 26];
  const para = [[168, 160, 128], [168, 152, 160], [168, 136, 96]];
  const audits = ['Readability', 'Meta tags', 'Backlinks', 'Headings'];
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[304, 176, 208]}>
      <text {...caption} x={40} y={44}>Research</text>
      <text {...caption} x={296} y={44}>Generate</text>
      <text {...caption} x={600} y={44} textAnchor="end">Audit</text>

      <Panel x={40} y={64} w={232} h={136} />
      <text {...caption} x={52} y={84} fontSize={8}>Keyword</text>
      <text {...caption} x={260} y={84} fontSize={8} textAnchor="end">Volume</text>
      <path d="M52 92h208" stroke={LINE_SOFT} />
      {kw.map(([k, v, n], i) => {
        const y = 108 + i * 24;
        return (
          <g key={n}>
            <Bar x={52} y={y - 2} w={k} o={0.22} />
            <rect x={136} y={y - 3} width={v} height={6} rx={3} fill={ACCENT} fillOpacity={0.85 - i * 0.18} />
            <text {...mono} x={260} y={y + 3} fontSize={8} textAnchor="end">{n}</text>
          </g>
        );
      })}

      <Panel x={40} y={224} w={232} h={88} />
      <text {...caption} x={52} y={244} fontSize={8}>Competitors</text>
      <rect x={196} y={237} width={6} height={6} rx={1.5} fill={ACCENT} />
      <text {...caption} x={206} y={244} fontSize={8}>you</text>
      <rect x={228} y={237} width={6} height={6} rx={1.5} fill="#fff" fillOpacity={0.25} />
      <text {...caption} x={238} y={244} fontSize={8}>rivals</text>
      <path d="M52 300h208" stroke={LINE_SOFT} />
      {you.map((h, i) => (
        <g key={i}>
          <rect x={64 + i * 52} y={300 - h} width={12} height={h} rx={2} fill={ACCENT} fillOpacity={0.85} />
          <rect x={80 + i * 52} y={300 - rivals[i]} width={12} height={rivals[i]} rx={2} fill="#fff" fillOpacity={0.18} />
        </g>
      ))}

      <Panel x={296} y={64} w={200} h={248} />
      <Bar x={312} y={84} w={128} h={8} o={0.4} />
      <Bar x={312} y={100} w={64} h={3} />
      {para.map((ws, g) => (
        <g key={g} className={ANIM.pulse} style={delay(g * 400)}>
          {g > 0 && <Bar x={312} y={104 + g * 56} w={72 + g * 16} h={5} fill={ACCENT} o={0.6} />}
          {ws.map((w, i) => <Bar key={i} x={312} y={120 + g * 56 + i * 10} w={w} o={0.22} />)}
        </g>
      ))}
      <Tag x={312} y={292} text="generating" tone="accent" />

      <circle cx={560} cy={120} r={32} fill="none" stroke={LINE} strokeWidth={1.25} />
      <circle cx={560} cy={120} r={32} fill="none" stroke={ACCENT} strokeWidth={1.25} strokeDasharray="175 201" strokeLinecap="round" transform="rotate(-90 560 120)" />
      <circle cx={537} cy={98} r={3} fill={ACCENT} />
      <text {...label} x={560} y={126} textAnchor="middle" fontSize={18} fill={WHITE}>87</text>
      <text {...caption} x={560} y={172} textAnchor="middle">SEO score</text>
      {audits.map((a, i) => (
        <g key={a}>
          <Check x={536} y={197 + i * 24} />
          <text {...caption} x={548} y={200 + i * 24}>{a}</text>
        </g>
      ))}
    </CoverFrame>
  );
};

// Template picker -> résumé page with an AI-refined paragraph (sparkle) -> suggestion card and export button.
const AdiFy: CoverComponent = ({ uid, title, className }) => (
  <CoverFrame uid={uid} title={title} className={className} glow={[288, 184, 216]}>
    <text {...caption} x={40} y={44}>Templates</text>
    <text {...caption} x={600} y={44} textAnchor="end">Refine · export</text>

    <Panel x={48} y={64} w={88} h={56} r={6} />
    <rect x={56} y={72} width={24} height={40} rx={2} fill="#fff" fillOpacity={0.08} />
    <Bar x={88} y={74} w={36} h={3} /><Bar x={88} y={82} w={28} h={3} /><Bar x={88} y={92} w={36} h={3} /><Bar x={88} y={100} w={24} h={3} />
    <text {...caption} x={92} y={134} textAnchor="middle" fontSize={8}>Modern</text>

    <Panel x={48} y={152} w={88} h={56} r={6} fill={ACCENT} fillOpacity={0.1} stroke={ACCENT} strokeOpacity={0.7} />
    <Bar x={60} y={160} w={32} h={4} o={0.4} />
    <Bar x={60} y={170} w={64} h={3} /><Bar x={60} y={178} w={56} h={3} /><Bar x={60} y={188} w={64} h={3} /><Bar x={60} y={196} w={40} h={3} />
    <circle cx={128} cy={160} r={5} fill={ACCENT} />
    <path d="M125.5 160l2 2 3-3.5" fill="none" stroke={INK} strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" />
    <text {...caption} x={92} y={222} textAnchor="middle" fontSize={8} fill={ACCENT}>Classic</text>
    <Edge d="M140 180h28" uid={uid} />

    <Panel x={48} y={240} w={88} h={56} r={6} />
    <rect x={56} y={248} width={72} height={8} rx={2} fill="#fff" fillOpacity={0.1} />
    <Bar x={56} y={264} w={56} h={3} /><Bar x={56} y={272} w={44} h={3} /><Bar x={56} y={280} w={60} h={3} />
    <text {...caption} x={92} y={310} textAnchor="middle" fontSize={8}>Minimal</text>

    <Panel x={176} y={48} w={216} h={272} />
    <Bar x={196} y={72} w={96} h={8} o={0.45} />
    <Bar x={196} y={88} w={64} h={4} o={0.2} />
    <circle cx={364} cy={80} r={16} fill="#fff" fillOpacity={0.06} stroke={LINE} strokeWidth={1.25} />
    <circle cx={364} cy={76} r={5} fill="#fff" fillOpacity={0.25} />
    <path d="M354 92a10 10 0 0 1 20 0" fill="#fff" fillOpacity={0.25} />

    <Bar x={196} y={118} w={56} h={5} fill={ACCENT} o={0.6} />
    <Tag x={328} y={116} text="AI refine" tone="accent" />
    <rect x={190} y={126} width={188} height={34} rx={4} fill={ACCENT} fillOpacity={0.05} stroke={ACCENT} strokeOpacity={0.45} strokeWidth={1.25} strokeDasharray="4 4" className={ANIM.flow} />
    <Bar x={196} y={132} w={160} o={0.22} />
    <Bar x={196} y={142} w={152} o={0.22} />
    <Bar x={196} y={152} w={104} o={0.22} />
    <path d={star(368, 143, 8)} fill={ACCENT} className={ANIM.pulse} />

    <Bar x={196} y={176} w={72} h={5} fill={ACCENT} o={0.6} />
    <Bar x={196} y={190} w={88} h={5} o={0.35} />
    <text {...mono} x={380} y={196} fontSize={8} textAnchor="end" fill={TEXT_MUTED}>2022 – now</text>
    <Bar x={196} y={202} w={168} h={3} /><Bar x={196} y={212} w={136} h={3} />
    <Bar x={196} y={228} w={72} h={5} o={0.35} />
    <text {...mono} x={380} y={234} fontSize={8} textAnchor="end" fill={TEXT_MUTED}>2019 – 22</text>
    <Bar x={196} y={240} w={152} h={3} /><Bar x={196} y={250} w={120} h={3} />
    <Bar x={196} y={272} w={40} h={5} fill={ACCENT} o={0.6} />
    <Tag x={196} y={292} text="React" /><Tag x={244} y={292} text="Node" /><Tag x={286} y={292} text="SQL" /><Tag x={324} y={292} text="Figma" />

    <Edge d="M392 116h32" uid={uid} dashed className={ANIM.flow} />
    <Panel x={432} y={64} w={168} h={96} />
    <text {...caption} x={444} y={84} fill={TEXT}>Suggestion</text>
    <Bar x={444} y={96} w={136} fill={ACCENT} o={0.6} />
    <Bar x={444} y={106} w={96} fill={ACCENT} o={0.45} />
    <text {...caption} x={444} y={128} fontSize={8}>stronger verbs</text>
    <Tag x={444} y={148} text="Accept" tone="green" />
    <Tag x={500} y={148} text="Retry" />

    <rect x={432} y={184} width={168} height={32} rx={8} fill={ACCENT} fillOpacity={0.16} stroke={ACCENT} strokeOpacity={0.5} strokeWidth={1.25} />
    <path d="M460 193v10m-4-4l4 4 4-4M454 206h12" fill="none" stroke={ACCENT} strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" />
    <text {...label} x={524} y={204} textAnchor="middle" fill={WHITE}>Export PDF</text>
    <Tag x={432} y={248} text="Crop image" />
    <Tag x={508} y={248} text="Gemini" tone="accent" />
  </CoverFrame>
);

export const LLM_COVERS: Record<string, CoverComponent> = {
  'enterprise-rag': EnterpriseRag,
  'agentic-mcp': AgenticMcp,
  adigaze: AdiGaze,
  adigon: AdiGon,
  adihunt: AdiHunt,
  adify: AdiFy,
};
