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

/* Elapsed part of the current 30 second step, growing from the left. */
function StepBar({ x, y, w, elapsed, delayMs = 0 }: { x: number; y: number; w: number; elapsed: number; delayMs?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={4} rx={2} fill={INK} stroke={LINE_SOFT} strokeWidth={1} />
      <rect x={x} y={y} width={elapsed} height={4} rx={2} fill={GREEN} fillOpacity={0.85} className={ANIM.grow} style={{ transformOrigin: `${x}px ${y + 2}px`, animationDelay: `${delayMs}ms` }} />
    </g>
  );
}

/* Six digit cells with the code; used by the cover and the pipeline figure. */
function Digits({ x, y, code, tone = GREEN }: { x: number; y: number; code: string; tone?: string }) {
  return (
    <g>
      {code.split('').map((d, i) => (
        <g key={i}>
          <rect x={x + i * 13} y={y} width={11} height={22} rx={3} fill={INK} stroke={tone} strokeOpacity={0.5} strokeWidth={1} />
          <text {...mono} x={x + 5.5 + i * 13} y={y + 15} textAnchor="middle" fill={tone}>{d}</text>
        </g>
      ))}
    </g>
  );
}

/* Card cover: the authenticator, the HOTP function both sides compute, and the verifier. */
const TotpCover: CoverComponent = ({ uid, title, className }) => {
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[320, 180, 220]}>
      <text {...caption} x={40} y={52}>Device</text>
      <text {...caption} x={320} y={52} textAnchor="middle">Both sides compute</text>
      <text {...caption} x={600} y={52} textAnchor="end">Verifier</text>

      <Panel x={40} y={64} w={152} h={232} r={16} />
      <text {...label} x={56} y={92}>AdiNox</text>
      <text {...caption} x={56} y={118} fill={TEXT_MUTED}>Example</text>
      <Digits x={56} y={126} code="872921" />
      <StepBar x={56} y={158} w={120} elapsed={72} />
      <text {...caption} x={56} y={190} fill={TEXT_MUTED}>Mail</text>
      <Digits x={56} y={198} code="287082" tone={ACCENT} />
      <StepBar x={56} y={230} w={120} elapsed={30} delayMs={400} />
      <circle cx={61} cy={268} r={3} fill={AMBER} className={ANIM.blink} />
      <text {...caption} x={70} y={272} fill={AMBER}>face-api.js gate</text>

      <Panel x={240} y={96} w={160} h={168} />
      <text {...label} x={320} y={120} textAnchor="middle">HOTP(K, C)</text>
      <text {...mono} x={256} y={146}>K: shared secret</text>
      <text {...mono} x={256} y={168}>C: floor(t / 30)</text>
      <text {...mono} x={256} y={190} fill={ACCENT}>HMAC-SHA1(K, C)</text>
      <text {...mono} x={256} y={212}>truncate, mod 10^6</text>
      <text {...mono} x={256} y={234} fill={GREEN}>872921</text>

      <Panel x={448} y={96} w={152} h={168} />
      <text {...label} x={464} y={120}>verify</text>
      <text {...mono} x={464} y={146}>window: 1 step</text>
      <text {...mono} x={464} y={168}>constant time ==</text>
      <text {...mono} x={464} y={190} fill={AMBER}>lastAccepted: C</text>
      <text {...mono} x={464} y={212} fill={ROSE}>replay rejected</text>
      <circle cx={584} cy={208} r={3} fill={ROSE} className={ANIM.blink} />

      <Edge uid={uid} d="M192 180H236" />
      <text {...caption} x={214} y={172} textAnchor="middle">K, t</text>
      <Edge uid={uid} d="M400 180H444" />
      <text {...caption} x={422} y={172} textAnchor="middle">code</text>

      <g transform="translate(192 180)"><Pulse path="M0 0 L44 0" delayMs={0} /></g>
      <g transform="translate(400 180)"><Pulse path="M0 0 L44 0" delayMs={600} tone={GREEN} /></g>

      <Tag x={240} y={312} text="RFC 6238" />
      <Tag x={316} y={312} text="HMAC-SHA1" tone="accent" />
      <Tag x={400} y={312} text="30 s step" tone="green" />
      <Tag x={478} y={312} text="secrets stay local" tone="amber" />
    </CoverFrame>
  );
};

/* Figure: counter and secret into HMAC, the tag, the offset nibble selecting four bytes, six digits out. */
const HotpPipeline: CoverComponent = ({ uid, title, className }) => {
  const tag = ['1f', '86', '98', '69', '0e', '02', 'ca', '16', '61', '85', '50', 'ef', '7f', '19', 'da', '8e', '94', '5b', '55', '5a'];
  const steps = ['offset = last nibble', '4 bytes at offset', 'clear the top bit', 'mod 1 000 000'];
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[320, 170, 220]}>
      <text {...caption} x={40} y={56}>Inputs</text>
      <text {...caption} x={260} y={56} textAnchor="middle">Tag</text>
      <text {...caption} x={416} y={56} textAnchor="middle">Dynamic truncation</text>
      <text {...caption} x={600} y={56} textAnchor="end">Code</text>

      <Panel x={40} y={84} w={128} h={124} />
      <text {...label} x={56} y={108}>secret K</text>
      <text {...mono} x={56} y={128} fill={ACCENT}>JBSWY3DPEHPK3PXP</text>
      <text {...label} x={56} y={156}>counter C</text>
      <text {...mono} x={56} y={176}>floor(t / 30)</text>
      <text {...caption} x={56} y={196} fill={TEXT_MUTED}>8 bytes, big-endian</text>

      <Panel x={208} y={84} w={104} h={124} fill={NODE_FILL_2} />
      <text {...label} x={260} y={116} textAnchor="middle">HMAC-SHA1</text>
      <text {...mono} x={260} y={140} textAnchor="middle" fill={ACCENT}>(K, C)</text>
      <text {...caption} x={260} y={176} textAnchor="middle" fill={TEXT_MUTED}>20 byte tag</text>
      <circle cx={260} cy={158} r={6} fill="none" stroke={ACCENT} strokeOpacity={0.8} strokeWidth={1.25} strokeDasharray="5 4" className={ANIM.spin} />

      <Panel x={352} y={84} w={128} h={124} />
      <text {...label} x={368} y={108}>truncate</text>
      {steps.map((s, i) => (
        <text key={s} {...caption} x={368} y={130 + i * 20}>{s}</text>
      ))}

      <Panel x={512} y={84} w={88} h={124} />
      <text {...label} x={556} y={108} textAnchor="middle">code</text>
      <Digits x={518} y={124} code="872921" />
      <StepBar x={518} y={160} w={78} elapsed={50} />
      <text {...caption} x={556} y={190} textAnchor="middle" fill={TEXT_MUTED}>valid 30 s</text>

      <Edge uid={uid} d="M168 146H204" />
      <Edge uid={uid} d="M312 146H348" />
      <Edge uid={uid} d="M480 146H508" />
      <g transform="translate(168 146)"><Pulse path="M0 0 L36 0" delayMs={0} /></g>
      <g transform="translate(312 146)"><Pulse path="M0 0 L36 0" delayMs={500} /></g>
      <g transform="translate(480 146)"><Pulse path="M0 0 L28 0" delayMs={1000} tone={GREEN} /></g>

      <Edge uid={uid} d="M260 208V240" dashed className={ANIM.flow} />
      {tag.map((h, i) => {
        const selected = i >= 10 && i <= 13;
        const last = i === 19;
        const tone = selected ? ACCENT : last ? AMBER : undefined;
        return (
          <g key={i}>
            <rect x={40 + i * 26} y={244} width={24} height={22} rx={3} fill={selected ? ACCENT : INK} fillOpacity={selected ? 0.2 : 1} stroke={tone ?? LINE_SOFT} strokeOpacity={tone ? 0.8 : 1} strokeWidth={1} className={selected ? ANIM.pulse : undefined} />
            <text {...mono} x={52 + i * 26} y={259} textAnchor="middle" fill={tone}>{h}</text>
          </g>
        );
      })}
      <path d="M300 236V232H402V236" fill="none" stroke={ACCENT} strokeOpacity={0.7} strokeWidth={1.25} />
      <path d="M351 232V222H380V212" fill="none" stroke={ACCENT} strokeOpacity={0.7} strokeWidth={1.25} strokeDasharray="4 4" className={ANIM.flow} markerEnd={`url(#${uid}-arrow)`} />
      <text {...caption} x={546} y={284} textAnchor="middle" fill={AMBER}>offset nibble</text>

      <text {...mono} x={40} y={290}>offset = 0x5a &amp; 0x0f = 10</text>
      <text {...mono} x={40} y={306}>(0x50 &amp; 0x7f) {'<<'} 24 | 0xef {'<<'} 16 | 0x7f {'<<'} 8 | 0x19 = 1357872921</text>
      <text {...mono} x={40} y={322} fill={GREEN}>1357872921 mod 10^6 = 872921</text>

      <Tag x={40} y={344} text="RFC 4226" />
      <Tag x={112} y={344} text="HMAC-SHA1" tone="accent" />
      <Tag x={188} y={344} text="8 byte counter" tone="amber" />
      <Tag x={292} y={344} text="6 digits" tone="green" />
    </CoverFrame>
  );
};

/* Figure: five time steps, the accepted window of three, a device clock running behind the server. */
const TimeWindow: CoverComponent = ({ uid, title, className }) => {
  const steps: [string, string, string][] = [
    ['C-2', 'not computed', TEXT_MUTED],
    ['C-1', '287 082', GREEN],
    ['C', '081 804', ACCENT],
    ['C+1', '050 471', ACCENT],
    ['C+2', 'not computed', TEXT_MUTED],
  ];
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[320, 150, 220]}>
      <text {...caption} x={40} y={56}>Server time in 30 s steps</text>
      <text {...caption} x={600} y={56} textAnchor="end">window: one step either side</text>

      <rect x={150} y={92} width={332} height={88} rx={8} fill={GREEN} fillOpacity={0.06} stroke={GREEN} strokeOpacity={0.4} strokeWidth={1.25} strokeDasharray="4 4" />
      <text {...caption} x={102} y={84} textAnchor="middle" fill={ROSE}>rejected</text>
      <text {...caption} x={316} y={84} textAnchor="middle" fill={GREEN}>accepted</text>
      <text {...caption} x={534} y={84} textAnchor="middle" fill={ROSE}>rejected</text>

      {steps.map(([c, code, tone], i) => (
        <g key={c}>
          <rect x={50 + i * 108} y={104} width={104} height={44} rx={6} fill={i === 0 || i === 4 ? INK : NODE_FILL_2} stroke={LINE_SOFT} strokeWidth={1.25} />
          <text {...mono} x={102 + i * 108} y={122} textAnchor="middle" fill={tone === TEXT_MUTED ? TEXT_MUTED : undefined}>{c}</text>
          <text {...caption} x={102 + i * 108} y={140} textAnchor="middle" fill={tone}>{code}</text>
        </g>
      ))}
      <StepBar x={266} y={152} w={104} elapsed={62} />

      <path d="M328 96V168" stroke={ACCENT} strokeWidth={1.25} />
      <path d="M324 168l4 6 4-6z" fill={ACCENT} />
      <text {...caption} x={328} y={196} textAnchor="middle" fill={ACCENT}>server now</text>

      <g className={ANIM.drift}>
        <path d="M241 96V168" stroke={AMBER} strokeWidth={1.25} strokeDasharray="3 3" />
        <path d="M237 168l4 6 4-6z" fill={AMBER} />
      </g>
      <text {...caption} x={241} y={212} textAnchor="middle" fill={AMBER}>device clock, 25 s behind</text>

      <Panel x={40} y={240} w={200} h={64} />
      <text {...label} x={56} y={264}>device submits</text>
      <text {...mono} x={56} y={286} fill={GREEN}>287 082</text>

      <Panel x={400} y={240} w={200} h={64} />
      <text {...label} x={416} y={264}>verifier tries k = -1, 0, +1</text>
      <text {...mono} x={416} y={286} fill={GREEN}>match at k = -1, skew stored</text>

      <Edge uid={uid} d="M240 272H396" />
      <text {...caption} x={318} y={264} textAnchor="middle" fill={TEXT_MUTED}>three HMACs, one match</text>
      <g transform="translate(240 272)"><Pulse path="M0 0 L156 0" delayMs={0} tone={GREEN} /></g>

      <Tag x={40} y={332} text="30 s step" />
      <Tag x={116} y={332} text="window 1" tone="accent" />
      <Tag x={190} y={332} text="rate limit the verifier" tone="amber" />
      <Tag x={344} y={332} text="drift is measured, not guessed" tone="green" />
    </CoverFrame>
  );
};

/* Figure: the same code submitted twice; the cache records the counter and refuses the second use. */
const ReplayCache: CoverComponent = ({ uid, title, className }) => {
  const lanes: [number, string][] = [[96, 'Client'], [176, 'Server'], [256, 'Cache']];
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[300, 176, 220]}>
      <text {...caption} x={40} y={56}>Same code, twice inside the window</text>
      <text {...caption} x={600} y={56} textAnchor="end">second use rejected before any HMAC</text>

      {lanes.map(([y, name]) => (
        <g key={name}>
          <text {...label} x={40} y={y + 4}>{name}</text>
          <path d={`M112 ${y}H456`} stroke={LINE_SOFT} strokeWidth={1.25} />
        </g>
      ))}

      {/* attempt 1 */}
      <Edge uid={uid} d="M176 100V170" />
      <text {...mono} x={168} y={140} textAnchor="end" fill={ACCENT}>287 082</text>
      <Edge uid={uid} d="M176 180V250" />
      <text {...caption} x={184} y={220}>{'counter > last?'}</text>
      <Edge uid={uid} d="M200 252V182" />
      <text {...caption} x={208} y={200} fill={GREEN}>store C-1</text>
      <path d="M200 172V102" fill="none" stroke={GREEN} strokeOpacity={0.8} strokeWidth={1.25} markerEnd={`url(#${uid}-arrow)`} />
      <text {...caption} x={208} y={140} fill={GREEN}>accepted</text>

      {/* attempt 2 */}
      <Edge uid={uid} d="M336 100V170" />
      <text {...mono} x={328} y={140} textAnchor="end" fill={ACCENT}>287 082 again</text>
      <Edge uid={uid} d="M336 180V250" />
      <text {...caption} x={344} y={220} fill={ROSE}>{'C-1 <= last'}</text>
      <path d="M360 252V182" fill="none" stroke={ROSE} strokeOpacity={0.8} strokeWidth={1.25} markerEnd={`url(#${uid}-arrow)`} />
      <text {...caption} x={368} y={200} fill={ROSE}>reject</text>
      <path d="M360 172V102" fill="none" stroke={ROSE} strokeOpacity={0.8} strokeWidth={1.25} markerEnd={`url(#${uid}-arrow)`} />
      <text {...caption} x={368} y={140} fill={ROSE}>rejected</text>
      <text {...caption} x={344} y={238} fill={ROSE}>no HMAC computed</text>

      <Panel x={480} y={140} w={120} h={80} stroke={ACCENT} strokeOpacity={0.5} />
      <text {...caption} x={540} y={158} textAnchor="middle">lastAccepted</text>
      <rect x={490} y={166} width={100} height={20} rx={4} fill={INK} stroke={LINE_SOFT} strokeWidth={1} />
      <text {...mono} x={498} y={180} fill={GREEN}>acct: C-1</text>
      <text {...caption} x={540} y={208} textAnchor="middle" fill={TEXT_MUTED}>written on attempt 1</text>

      <g transform="translate(176 100)"><Pulse path="M0 0 L0 70" delayMs={0} /></g>
      <g transform="translate(176 180)"><Pulse path="M0 0 L0 70" delayMs={300} /></g>
      <g transform="translate(200 252)"><Pulse path="M0 0 L0 -70" delayMs={600} tone={GREEN} /></g>
      <g transform="translate(200 172)"><Pulse path="M0 0 L0 -70" delayMs={900} tone={GREEN} /></g>
      <g transform="translate(336 100)"><Pulse path="M0 0 L0 70" delayMs={1400} /></g>
      <g transform="translate(336 180)"><Pulse path="M0 0 L0 70" delayMs={1700} /></g>
      <g transform="translate(360 252)"><Pulse path="M0 0 L0 -70" delayMs={2000} tone={ROSE} /></g>
      <g transform="translate(360 172)"><Pulse path="M0 0 L0 -70" delayMs={2300} tone={ROSE} /></g>

      <Edge uid={uid} d="M112 300H456" />
      <text {...caption} x={464} y={304}>time</text>
      <text {...mono} x={176} y={320} textAnchor="middle">attempt 1</text>
      <text {...mono} x={336} y={320} textAnchor="middle">attempt 2</text>
      <text {...caption} x={176} y={336} textAnchor="middle" fill={GREEN}>12:00:07, accepted</text>
      <text {...caption} x={336} y={336} textAnchor="middle" fill={ROSE}>12:00:19, replayed</text>
    </CoverFrame>
  );
};

export const COVER: CoverComponent = TotpCover;

export const FIGURES: Record<string, CoverComponent> = {
  'totp-internals-authenticator/hotp-pipeline': HotpPipeline,
  'totp-internals-authenticator/time-window': TimeWindow,
  'totp-internals-authenticator/replay-cache': ReplayCache,
};
