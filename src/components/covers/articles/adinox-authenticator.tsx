'use client';
import type { CSSProperties } from 'react';
import { ACCENT, AMBER, ANIM, caption, CoverFrame, Edge, GREEN, label, LINE, LINE_SOFT, mono, NODE_FILL, Panel, ROSE, Tag, TEXT, TEXT_MUTED, type CoverComponent } from '../shared';

const WHITE = '#f2f4f8';

const travel = (path: string, ms: number): CSSProperties => ({ offsetPath: `path("${path}")`, offsetRotate: '0deg', animationDelay: `${ms}ms` });

function Pulse({ x, y, path, ms, tone = ACCENT }: { x: number; y: number; path: string; ms: number; tone?: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className={ANIM.travel} style={travel(path, ms)}>
        <circle r={2.4} fill={tone} />
        <circle r={5} fill={tone} fillOpacity={0.25} />
      </g>
    </g>
  );
}

function Bar({ x, y, w, h = 4, fill = '#fff', o = 0.18, grow, ms = 0 }: { x: number; y: number; w: number; h?: number; fill?: string; o?: number; grow?: boolean; ms?: number }) {
  return <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={fill} fillOpacity={o} className={grow ? ANIM.grow : undefined} style={grow ? { transformOrigin: '0 50%', animationDelay: `${ms}ms` } : undefined} />;
}

function Check({ x, y, tone = GREEN }: { x: number; y: number; tone?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={6} fill={tone} fillOpacity={0.14} stroke={tone} strokeOpacity={0.6} strokeWidth={1.25} />
      <path d={`M${x - 3} ${y}l2 2.5 4.5-5`} fill="none" stroke={tone} strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

function Lock({ x, y, tone = ACCENT }: { x: number; y: number; tone?: string }) {
  return (
    <g fill="none" stroke={tone} strokeWidth={1.25} strokeLinecap="round">
      <path d={`M${x - 3.5} ${y}v-3a3.5 3.5 0 0 1 7 0v3`} />
      <rect x={x - 5.5} y={y} width={11} height={8} rx={2} fill={tone} fillOpacity={0.15} />
    </g>
  );
}

/* Mock QR: 8x8 cells with three finder squares; deterministic bit pattern. */
function Qr({ x, y, cell = 10 }: { x: number; y: number; cell?: number }) {
  const bits = [
    [1, 1, 1, 0, 1, 1, 1, 1], [1, 0, 1, 0, 0, 1, 0, 1], [1, 1, 1, 0, 1, 1, 1, 1], [0, 0, 0, 1, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 1, 0, 1], [1, 1, 1, 0, 0, 1, 0, 0], [1, 0, 1, 0, 1, 0, 1, 1], [1, 1, 1, 0, 1, 1, 0, 1],
  ];
  return (
    <g fill={WHITE} fillOpacity={0.85}>
      {bits.map((row, r) => row.map((b, c) => (b ? <rect key={`${r}-${c}`} x={x + c * cell} y={y + r * cell} width={cell - 1.5} height={cell - 1.5} rx={1} /> : null)))}
    </g>
  );
}

function Ring({ cx, cy, r, tone = ACCENT }: { cx: number; cy: number; r: number; tone?: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={LINE_SOFT} strokeWidth={2} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={tone} strokeWidth={2} strokeLinecap="round" pathLength={1} className={ANIM.draw} transform={`rotate(-90 ${cx} ${cy})`} />
    </g>
  );
}

/* Cover: QR -> otpauth parse -> sealed vault -> HMAC -> rotating code, with the face gate in front of the view. */
const Cover: CoverComponent = ({ uid, title, className }) => (
  <CoverFrame uid={uid} title={title} className={className} glow={[328, 168, 220]}>
    <text {...caption} x={40} y={44}>Enrol</text>
    <text {...caption} x={600} y={44} textAnchor="end">Six digits, thirty second windows</text>

    <Panel x={40} y={116} w={96} h={96} stroke={ACCENT} strokeOpacity={0.5} />
    <Qr x={49} y={125} cell={10} />
    <text {...caption} x={88} y={228} textAnchor="middle">QR scan</text>
    <Edge d="M136 164H168" uid={uid} />
    <Pulse x={136} y={164} path="M0 0 L32 0" ms={0} />

    <Panel x={168} y={132} w={104} h={64} />
    <text {...label} x={220} y={154} textAnchor="middle">Parse</text>
    <text {...mono} x={220} y={170} textAnchor="middle" fill={TEXT_MUTED}>otpauth://totp</text>
    <text {...caption} x={220} y={186} textAnchor="middle">base32 to bytes</text>
    <Edge d="M272 164H304" uid={uid} />
    <Pulse x={272} y={164} path="M0 0 L32 0" ms={450} />

    <Panel x={304} y={124} w={104} h={80} stroke={ACCENT} strokeOpacity={0.5} />
    <Lock x={396} y={134} />
    <text {...label} x={316} y={146}>Vault</text>
    <text {...mono} x={316} y={164} fill={TEXT_MUTED}>AES-GCM</text>
    <text {...mono} x={316} y={178} fill={TEXT_MUTED}>PBKDF2 key</text>
    <text {...caption} x={316} y={194}>IndexedDB</text>
    <Edge d="M408 164H440" uid={uid} />
    <Pulse x={408} y={164} path="M0 0 L32 0" ms={900} tone={AMBER} />

    <Panel x={440} y={132} w={80} h={64} />
    <text {...label} x={480} y={154} textAnchor="middle">HMAC</text>
    <text {...mono} x={480} y={170} textAnchor="middle" fill={TEXT_MUTED}>WebCrypto</text>
    <text {...caption} x={480} y={186} textAnchor="middle">no export</text>
    <Edge d="M520 164H552" uid={uid} />
    <Pulse x={520} y={164} path="M0 0 L32 0" ms={1350} tone={GREEN} />

    <Panel x={552} y={116} w={56} h={96} />
    <Ring cx={580} cy={146} r={14} />
    <text {...caption} x={580} y={149} textAnchor="middle" fill={WHITE}>30 s</text>
    <text {...mono} x={580} y={182} textAnchor="middle" fill={WHITE} fontSize={11}>482 913</text>
    <text {...caption} x={580} y={200} textAnchor="middle">code</text>

    <Edge d="M580 212V240" uid={uid} dashed />
    <Panel x={508} y={240} w={100} h={40} stroke={AMBER} strokeOpacity={0.5} />
    <text {...label} x={558} y={257} textAnchor="middle">Face gate</text>
    <text {...caption} x={558} y={271} textAnchor="middle">in front of the view</text>
    <circle cx={598} cy={248} r={3} fill={AMBER} className={ANIM.blink} />

    <Tag x={40} y={300} text="Secret never leaves the device" tone="accent" />
    <Tag x={232} y={300} text="Encrypted at rest" />
    <Tag x={352} y={300} text="Gate, not a key" tone="amber" />
  </CoverFrame>
);

/* Figure: secret lifecycle from QR payload to parsed fields, to the sealed vault, to a non-extractable HMAC key and a code. */
const SecretLifecycle: CoverComponent = ({ uid, title, className }) => (
  <CoverFrame uid={uid} title={title} className={className} glow={[320, 168, 220]}>
    <defs>
      <clipPath id={`${uid}-qr`}><rect x={33} y={61} width={142} height={142} rx={8} /></clipPath>
    </defs>
    <text {...caption} x={32} y={44}>Scan</text>
    <text {...caption} x={208} y={44}>Parse and normalise</text>
    <text {...caption} x={400} y={44}>Seal at rest</text>
    <text {...caption} x={608} y={44} textAnchor="end">Use</text>

    <Panel x={32} y={60} w={144} h={144} />
    <Qr x={60} y={88} cell={11} />
    <g clipPath={`url(#${uid}-qr)`}>
      <g className={ANIM.scan}>
        <rect x={33} y={61} width={142} height={18} fill={ACCENT} fillOpacity={0.16} />
      </g>
    </g>
    <text {...mono} x={32} y={224} fill={TEXT_MUTED}>otpauth://totp/</text>
    <text {...mono} x={32} y={238} fill={TEXT_MUTED}>Issuer:user?secret=</text>
    <Edge d="M176 132H208" uid={uid} />
    <Pulse x={176} y={132} path="M0 0 L32 0" ms={0} />

    <Panel x={208} y={60} w={160} h={176} />
    <text {...mono} x={220} y={78} fill={ACCENT}>parseOtpauth(uri)</text>
    <text {...mono} x={220} y={100} fill={TEXT_MUTED}>issuer     Example</text>
    <text {...mono} x={220} y={116} fill={TEXT_MUTED}>account    adil@…</text>
    <text {...mono} x={220} y={132} fill={WHITE}>secret     base32 to bytes</text>
    <text {...mono} x={220} y={148} fill={TEXT_MUTED}>algorithm  SHA-1</text>
    <text {...mono} x={220} y={164} fill={TEXT_MUTED}>digits     6</text>
    <text {...mono} x={220} y={180} fill={TEXT_MUTED}>period     30 s</text>
    <Check x={226} y={212} />
    <text {...caption} x={238} y={215}>bounds checked, Uint8Array</text>
    <Edge d="M368 132H400" uid={uid} />
    <Pulse x={368} y={132} path="M0 0 L32 0" ms={500} />

    <Panel x={400} y={60} w={104} h={176} stroke={ACCENT} strokeOpacity={0.5} />
    <Lock x={490} y={70} />
    <text {...label} x={412} y={80}>Vault</text>
    <Tag x={412} y={100} text="AES-GCM" tone="accent" />
    <text {...mono} x={412} y={124} fill={TEXT_MUTED}>salt   16 B</text>
    <text {...mono} x={412} y={140} fill={TEXT_MUTED}>iter   stored</text>
    <text {...mono} x={412} y={156} fill={TEXT_MUTED}>iv     12 B</text>
    <Bar x={412} y={170} w={80} fill={ACCENT} o={0.5} grow ms={0} />
    <Bar x={412} y={180} w={64} fill={ACCENT} o={0.4} grow ms={120} />
    <Bar x={412} y={190} w={72} fill={ACCENT} o={0.3} grow ms={240} />
    <Bar x={412} y={200} w={48} fill={ACCENT} o={0.25} grow ms={360} />
    <text {...caption} x={452} y={226} textAnchor="middle">IndexedDB</text>
    <Edge d="M504 132H536" uid={uid} />
    <Pulse x={504} y={132} path="M0 0 L32 0" ms={1000} tone={AMBER} />

    <Panel x={536} y={92} w={72} h={80} />
    <text {...mono} x={572} y={110} textAnchor="middle" fill={ACCENT}>importKey</text>
    <text {...label} x={572} y={130} textAnchor="middle">HMAC</text>
    <text {...caption} x={572} y={146} textAnchor="middle">no export</text>
    <text {...caption} x={572} y={160} textAnchor="middle">session only</text>
    <Edge d="M572 172V196" uid={uid} />
    <Pulse x={572} y={172} path="M0 0 L0 24" ms={1500} tone={GREEN} />
    <Panel x={536} y={196} w={72} h={48} stroke={GREEN} strokeOpacity={0.5} />
    <text {...mono} x={572} y={219} textAnchor="middle" fill={WHITE} fontSize={11}>482 913</text>
    <text {...caption} x={572} y={236} textAnchor="middle">6 digits</text>

    <Tag x={32} y={300} text="Uint8Array, never a string" tone="accent" />
    <Tag x={200} y={300} text="Fresh nonce per write" />
    <Tag x={340} y={300} text="Key lives in memory only" tone="green" />
  </CoverFrame>
);

/* Figure: cold start through PBKDF2 to the key; within a session the face gate only guards the rendered codes. */
const UnlockFlow: CoverComponent = ({ uid, title, className }) => {
  const rows: [string, string][] = [['GitHub', '482 913'], ['AWS', '105 337'], ['Supabase', '771 020']];
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[320, 168, 220]}>
      <text {...caption} x={32} y={44}>Cold start: passphrase to key</text>
      <text {...caption} x={608} y={44} textAnchor="end">Rendered codes</text>

      <Panel x={32} y={86} w={88} h={48} />
      <text {...label} x={76} y={106} textAnchor="middle">Passphrase</text>
      <text {...mono} x={76} y={122} textAnchor="middle" fill={TEXT_MUTED}>••••••••</text>
      <Edge d="M120 110H144" uid={uid} />
      <Pulse x={120} y={110} path="M0 0 L24 0" ms={0} />

      <Panel x={144} y={80} w={104} h={60} stroke={ACCENT} strokeOpacity={0.5} />
      <text {...label} x={196} y={100} textAnchor="middle">PBKDF2</text>
      <text {...mono} x={196} y={116} textAnchor="middle" fill={TEXT_MUTED}>SHA-256</text>
      <text {...caption} x={196} y={131} textAnchor="middle">salt + iterations</text>
      <Edge d="M248 110H272" uid={uid} />
      <Pulse x={248} y={110} path="M0 0 L24 0" ms={450} />

      <Panel x={272} y={86} w={88} h={48} />
      <Lock x={350} y={92} />
      <text {...label} x={284} y={106}>AES key</text>
      <text {...caption} x={284} y={122}>non-extractable</text>
      <Edge d="M360 110H384" uid={uid} />
      <Pulse x={360} y={110} path="M0 0 L24 0" ms={900} />

      <Panel x={384} y={86} w={88} h={48} />
      <text {...label} x={428} y={106} textAnchor="middle">Decrypt</text>
      <text {...caption} x={428} y={122} textAnchor="middle">vault opened</text>
      <Edge d="M472 110H504" uid={uid} />
      <Pulse x={472} y={110} path="M0 0 L32 0" ms={1350} tone={GREEN} />

      <Panel x={504} y={80} w={104} h={180} />
      <circle cx={596} cy={92} r={3} fill={GREEN} className={ANIM.blink} />
      <text {...caption} x={516} y={98}>Codes</text>
      {rows.map(([issuer, code], i) => (
        <g key={issuer}>
          <text {...caption} x={516} y={122 + i * 40}>{issuer}</text>
          <text {...mono} x={516} y={138 + i * 40} fill={WHITE} fontSize={11}>{code}</text>
          <path d={`M516 ${146 + i * 40}H596`} stroke={LINE_SOFT} />
        </g>
      ))}
      <Ring cx={588} cy={132} r={7} />

      <text {...caption} x={32} y={168}>Re-lock within a session</text>
      <Panel x={32} y={186} w={88} h={48} stroke={AMBER} strokeOpacity={0.5} />
      <text {...label} x={76} y={206} textAnchor="middle">Lock</text>
      <text {...caption} x={76} y={222} textAnchor="middle">idle timer or tap</text>
      <Edge d="M120 210H144" uid={uid} />
      <Pulse x={120} y={210} path="M0 0 L24 0" ms={200} tone={AMBER} />

      <Panel x={144} y={176} w={104} h={68} stroke={AMBER} strokeOpacity={0.5} />
      <text {...label} x={196} y={196} textAnchor="middle">Face gate</text>
      <text {...mono} x={196} y={212} textAnchor="middle" fill={TEXT_MUTED}>face-api.js</text>
      <text {...caption} x={196} y={228} textAnchor="middle">descriptor distance</text>
      <text {...caption} x={196} y={239} textAnchor="middle">under threshold</text>
      <Edge d="M248 210H272" uid={uid} />
      <Pulse x={248} y={210} path="M0 0 L24 0" ms={800} tone={GREEN} />

      <Panel x={272} y={186} w={200} h={48} stroke={LINE} strokeDasharray="4 4" fill={NODE_FILL} />
      <text {...label} x={372} y={206} textAnchor="middle">Key stays in memory</text>
      <text {...caption} x={372} y={222} textAnchor="middle">codes hidden, ciphertext untouched</text>
      <Edge d="M472 210H504" uid={uid} />
      <Pulse x={472} y={210} path="M0 0 L32 0" ms={1300} tone={GREEN} />

      <Edge d="M196 244V272" uid={uid} dashed />
      <Pulse x={196} y={244} path="M0 0 L0 28" ms={1700} tone={ROSE} />
      <Panel x={144} y={272} w={104} h={36} stroke={ROSE} strokeOpacity={0.4} />
      <text {...caption} x={196} y={287} textAnchor="middle" fill={TEXT}>no match</text>
      <text {...caption} x={196} y={300} textAnchor="middle">passphrase fallback</text>

      <Tag x={32} y={330} text="Face is a gate, not a key" tone="accent" />
      <Tag x={194} y={330} text="Cold start always asks for the passphrase" />
      <Tag x={446} y={330} text="Key dropped on unload" tone="rose" />
    </CoverFrame>
  );
};

/* Figure: thirty second windows on a timeline, the playhead sweeping the current window, and the server's acceptance band. */
const CodeRotation: CoverComponent = ({ uid, title, className }) => {
  const windows: [string, string][] = [['c-1', '271 405'], ['c', '482 913'], ['c+1', '930 116'], ['c+2', '554 208']];
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[320, 168, 220]}>
      <text {...caption} x={64} y={44}>Thirty second windows, counter = floor(now / 30)</text>
      <Ring cx={584} cy={52} r={14} />
      <text {...caption} x={584} y={55} textAnchor="middle" fill={WHITE}>30 s</text>

      {windows.map(([name, code], i) => {
        const x = 64 + i * 128;
        const current = i === 1;
        return (
          <g key={name}>
            <Panel x={x + 8} y={96} w={112} h={40} stroke={current ? ACCENT : LINE} strokeOpacity={current ? 0.6 : 1} />
            <text {...mono} x={x + 64} y={121} textAnchor="middle" fill={current ? WHITE : TEXT_MUTED} fontSize={11}>{code}</text>
            <path d={`M${x} 196V204`} stroke={LINE} strokeWidth={1.25} />
            <text {...mono} x={x + 64} y={220} textAnchor="middle" fill={current ? WHITE : TEXT_MUTED}>{name}</text>
          </g>
        );
      })}
      <path d="M576 196V204" stroke={LINE} strokeWidth={1.25} />
      <path d="M64 200H576" stroke={LINE} strokeWidth={1.25} />

      <rect x={192} y={168} width={128} height={10} rx={5} fill={ACCENT} fillOpacity={0.35} className={ANIM.grow} style={{ transformOrigin: '0 50%' }} />
      <g transform="translate(192 166)">
        <g className={ANIM.travel} style={travel('M0 0 L128 0', 0)}>
          <path d="M0 0V30" stroke={ACCENT} strokeWidth={1.5} />
          <path d="M-4 -4h8l-4 5z" fill={ACCENT} />
        </g>
      </g>
      <text {...caption} x={256} y={160} textAnchor="middle">now, re-rendered on the boundary</text>
      <rect x={296} y={168} width={24} height={10} rx={5} fill={AMBER} fillOpacity={0.5} />
      <text {...caption} x={308} y={190} textAnchor="middle" fill={AMBER}>last seconds: fade, show next</text>

      <rect x={64} y={236} width={384} height={22} rx={6} fill={GREEN} fillOpacity={0.1} stroke={GREEN} strokeOpacity={0.4} />
      <text {...caption} x={256} y={250} textAnchor="middle" fill={GREEN}>server accepts the current window and one either side</text>
      <rect x={456} y={236} width={120} height={22} rx={6} fill={ROSE} fillOpacity={0.1} stroke={ROSE} strokeOpacity={0.4} />
      <text {...caption} x={516} y={250} textAnchor="middle" fill={ROSE}>drift beyond: rejected</text>

      <Tag x={64} y={300} text="Re-render on the boundary" tone="accent" />
      <Tag x={226} y={300} text="Fade in the last seconds" tone="amber" />
      <Tag x={382} y={300} text="Skew warning from Date header" tone="rose" />
    </CoverFrame>
  );
};

export const COVER: CoverComponent = Cover;

export const FIGURES: Record<string, CoverComponent> = {
  'adinox-authenticator/secret-lifecycle': SecretLifecycle,
  'adinox-authenticator/unlock-flow': UnlockFlow,
  'adinox-authenticator/code-rotation': CodeRotation,
};
