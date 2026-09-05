'use client';
import {
  ACCENT, ACCENT_DEEP, AMBER, ANIM, CoverFrame, Edge, GREEN, LINE, LINE_SOFT, NODE_FILL, NODE_FILL_2, Panel, ROSE, TEXT, TEXT_MUTED, Tag,
  caption, delay, label, mono, type CoverComponent,
} from '../shared';

const WHITE = '#f2f4f8';
const INK = '#0b0f17';

/* Placeholder text lines (4px bars). */
function Lines({ x, y, widths, step = 12 }: { x: number; y: number; widths: number[]; step?: number }) {
  return (
    <g fill="#fff" fillOpacity={0.12}>
      {widths.map((w, i) => <rect key={i} x={x} y={y + i * step} width={w} height={4} rx={2} />)}
    </g>
  );
}

function Phone({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      <Panel x={x} y={y} w={w} h={h} r={20} />
      <rect x={x + w / 2 - 16} y={y + 12} width={32} height={4} rx={2} fill={LINE} />
      <rect x={x + 8} y={y + 24} width={w - 16} height={h - 48} rx={8} fill={INK} stroke={LINE_SOFT} strokeWidth={1.25} />
      <circle cx={x + w / 2} cy={y + h - 12} r={4} fill="none" stroke={LINE} strokeWidth={1.25} />
    </g>
  );
}

function Bubble({ x, y, w, text, mine, className }: { x: number; y: number; w: number; text: string; mine?: boolean; className?: string }) {
  return (
    <g className={className}>
      <rect x={x} y={y} width={w} height={20} rx={8} fill={mine ? ACCENT : NODE_FILL_2} fillOpacity={mine ? 0.28 : 1} stroke={mine ? ACCENT : LINE_SOFT} strokeOpacity={mine ? 0.5 : 1} strokeWidth={1.25} />
      <text {...mono} x={x + w / 2} y={y + 13} fontSize={8} textAnchor="middle" fill={mine ? WHITE : TEXT}>{text}</text>
    </g>
  );
}

/* Prompt bar, 2x2 generation grid filling in, Genkit -> Gemini pipeline, settings. */
const AdiFlux: CoverComponent = ({ uid, title, className }) => {
  const tiles = [[40, 120], [176, 120], [40, 232], [176, 232]];
  const rows: [string, string][] = [['model', 'gemini-2.0-flash'], ['size', '1024 × 1024'], ['count', '4'], ['seed', '48213']];
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[168, 224, 176]}>
      <defs>
        <linearGradient id={`${uid}-tile`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={ACCENT_DEEP} stopOpacity="0.55" />
          <stop offset="1" stopColor={ACCENT} stopOpacity="0.12" />
        </linearGradient>
      </defs>
      <text {...caption} x="40" y="44">Prompt</text>
      <Tag x={540} y={44} text="no login" tone="green" />

      <rect x="40" y="64" width="560" height="32" rx="8" fill={INK} stroke={ACCENT} strokeOpacity="0.45" strokeWidth="1.25" />
      <text {...mono} x="56" y="84" fill={WHITE} fillOpacity="0.9">neon fox, rain</text>
      <rect x="520" y="70" width="72" height="20" rx="5" fill={ACCENT} fillOpacity="0.16" stroke={ACCENT} strokeOpacity="0.5" strokeWidth="1.25" />
      <text {...caption} x="556" y="83.5" textAnchor="middle" fill={WHITE}>Generate</text>

      {tiles.map(([x, y], i) => (
        <g key={i}>
          <rect x={x} y={y} width="120" height="96" rx="8" fill={`url(#${uid}-tile)`} stroke={LINE} strokeWidth="1.25" />
          <g className={ANIM.pulse} style={delay(i * 300)} fill="#fff">
            <circle cx={x + 88} cy={y + 28} r="8" fillOpacity="0.4" />
            <path d={`M${x + 8} ${y + 84}l28-32 20 20 16-16 40 28z`} fillOpacity="0.2" />
          </g>
          <text {...mono} x={x + 10} y={y + 18} fontSize="8">0{i + 1}</text>
        </g>
      ))}

      <text {...caption} x="328" y="136">Pipeline</text>
      <Tag x={328} y={160} text="Genkit" tone="accent" />
      <Edge d="M384 160h32" uid={uid} />
      <Tag x={424} y={160} text="Gemini" tone="accent" />
      <Edge d="M480 160h32" uid={uid} />
      <Tag x={520} y={160} text="4 images" />

      <Panel x={328} y={192} w={272} h={136} />
      <text {...caption} x="344" y="212">Settings</text>
      {rows.map(([k, v], i) => {
        const y = 236 + i * 24;
        return (
          <g key={k}>
            <path d={`M344 ${y - 16}h240`} stroke={LINE_SOFT} strokeWidth="1.25" />
            <text {...mono} x="344" y={y}>{k}</text>
            <text {...mono} x="584" y={y} textAnchor="end" fill={WHITE} fillOpacity="0.85">{v}</text>
          </g>
        );
      })}
    </CoverFrame>
  );
};

/* Photo canvas with a marquee around an object being removed, swatches, layers, edit prompt. */
const AdiMage: CoverComponent = ({ uid, title, className }) => {
  const swatches = ['#1d3a6e', '#2a6f5a', '#6e3a5a', '#4a4f5c', '#c9a15a', WHITE];
  const layers: [string, boolean][] = [['Upscaled', true], ['Background', false], ['Object mask', false], ['Original', false]];
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[216, 176, 176]}>
      <defs>
        <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1f3f78" />
          <stop offset="1" stopColor="#0f1727" />
        </linearGradient>
      </defs>
      <text {...caption} x="40" y="44">Canvas</text>
      <text {...caption} x="424" y="44">Layers</text>

      <Panel x={40} y={64} w={352} h={232} />
      <rect x="48" y="72" width="336" height="216" rx="4" fill={`url(#${uid}-sky)`} />
      <circle cx="320" cy="112" r="14" fill="#fff" fillOpacity="0.12" />
      <path d="M48 224Q120 168 192 216T336 200L384 224V288H48z" fill="#182238" />
      <g stroke={TEXT} strokeWidth="1.25" fill={NODE_FILL_2} opacity="0.55">
        <rect x="216" y="128" width="36" height="20" rx="2" />
        <path d="M234 148v52" />
      </g>
      <rect x="208" y="120" width="56" height="88" fill="none" stroke={ACCENT} strokeWidth="1.25" strokeDasharray="4 4" className={ANIM.flow} />
      {[[208, 120], [264, 120], [208, 208], [264, 208]].map(([x, y], i) => <rect key={i} x={x - 2} y={y - 2} width="4" height="4" fill={ACCENT} />)}
      <g className={ANIM.pulse}><Tag x={208} y={232} text="removing" tone="accent" /></g>

      <text {...caption} x="40" y="316">Background</text>
      {swatches.map((c, i) => <rect key={c} x={112 + i * 24} y="308" width="16" height="12" rx="3" fill={c} stroke={i === 0 ? ACCENT : LINE} strokeWidth="1.25" />)}
      <Tag x={272} y={316} text="upscale 2x" tone="green" />

      <Panel x={424} y={64} w={176} h={136} />
      {layers.map(([name, on], i) => {
        const y = 88 + i * 32;
        return (
          <g key={name}>
            {on && <rect x="432" y={y - 12} width="160" height="24" rx="4" fill={ACCENT} fillOpacity="0.12" />}
            <rect x="440" y={y - 7} width="20" height="14" rx="2" fill={NODE_FILL_2} stroke={LINE} strokeWidth="1.25" />
            <text {...caption} x="468" y={y + 3} fill={on ? WHITE : TEXT_MUTED}>{name}</text>
            <circle cx="580" cy={y} r="3" fill={on ? GREEN : 'none'} stroke={on ? 'none' : LINE} strokeWidth="1.25" />
          </g>
        );
      })}

      <Panel x={424} y={216} w={176} h={80} />
      <text {...caption} x="436" y="236">Edit prompt</text>
      <rect x="436" y="248" width="152" height="24" rx="6" fill={INK} stroke={ACCENT} strokeOpacity="0.45" strokeWidth="1.25" />
      <text {...mono} x="446" y="263.5" fill={WHITE} fillOpacity="0.9">remove the sign</text>
      <Tag x={424} y={316} text="Google GenAI" />
    </CoverFrame>
  );
};

/* HR dashboard: sidebar, KPI tiles, monthly bars, employee table, payroll progress. */
const AdiCorp: CoverComponent = ({ uid, title, className }) => {
  const nav = ['Dashboard', 'Employees', 'Attendance', 'Leave', 'Payroll', 'Events'];
  const kpis: [string, string, string, string][] = [['Attendance', '96.4%', '+1.2%', GREEN], ['Leave', '14', 'pending', AMBER], ['Payroll', '$182k', 'processed', GREEN]];
  const bars = [48, 56, 40, 64, 60, 72, 52, 68];
  const staff: [string, string, string][] = [['A. Khan', 'in', GREEN], ['S. Malik', 'leave', AMBER], ['R. Ahmed', 'in', GREEN]];
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[280, 192, 200]}>
      <text {...caption} x="160" y="44">HR dashboard</text>
      <Tag x={520} y={44} text="PDF" tone="rose" />
      <Tag x={560} y={44} text="XLSX" tone="green" />

      <Panel x={40} y={40} w={104} h={280} />
      <rect x="52" y="52" width="12" height="12" rx="3" fill={ACCENT} />
      <text {...label} x="70" y="62">AdiCorp</text>
      {nav.map((n, i) => {
        const y = 96 + i * 24;
        return (
          <g key={n}>
            {i === 0 && <rect x="48" y={y - 12} width="88" height="18" rx="4" fill={ACCENT} fillOpacity="0.12" />}
            <rect x="56" y={y - 8} width="8" height="8" rx="2" fill={i === 0 ? ACCENT : LINE} />
            <text {...caption} x="72" y={y} fill={i === 0 ? WHITE : TEXT_MUTED}>{n}</text>
          </g>
        );
      })}
      <circle cx="60" cy="296" r="8" fill={NODE_FILL_2} stroke={LINE} strokeWidth="1.25" />
      <text {...caption} x="76" y="299">Admin</text>

      {kpis.map(([name, val, note, tone], i) => {
        const x = 160 + i * 152;
        return (
          <g key={name}>
            <Panel x={x} y={56} w={136} h={56} />
            <text {...caption} x={x + 12} y="76">{name}</text>
            <text {...label} x={x + 12} y="100" fontSize="14" fill={WHITE}>{val}</text>
            <text {...caption} x={x + 124} y="100" textAnchor="end" fill={tone}>{note}</text>
          </g>
        );
      })}

      <Panel x={160} y={128} w={240} h={128} />
      <text {...caption} x="172" y="148">Monthly attendance</text>
      <path d="M172 236h216" stroke={LINE_SOFT} strokeWidth="1.25" />
      {[0, 1, 2, 3].map((g) => (
        <g key={g} className={ANIM.grow} style={delay(g * 160)} fill={ACCENT}>
          {[0, 1].map((k) => {
            const i = g * 2 + k;
            return <rect key={i} x={172 + i * 28} y={236 - bars[i]} width="16" height={bars[i]} rx="2" fillOpacity={0.4 + k * 0.35} />;
          })}
        </g>
      ))}
      {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A'].map((m, i) => <text key={i} {...caption} x={180 + i * 28} y="250" fontSize="8" textAnchor="middle">{m}</text>)}

      <Panel x={416} y={128} w={184} h={128} />
      <path d="M416 136q0-8 8-8h168q8 0 8 8v14H416z" fill={ACCENT} fillOpacity="0.12" />
      <text {...mono} x="428" y="143" fontSize="8">employee</text>
      <text {...mono} x="588" y="143" fontSize="8" textAnchor="end">status</text>
      {staff.map(([name, st, tone], i) => {
        const y = 172 + i * 28;
        return (
          <g key={name}>
            {i > 0 && <path d={`M424 ${y - 14}h168`} stroke={LINE_SOFT} strokeWidth="1.25" />}
            <circle cx="434" cy={y - 3} r="6" fill={NODE_FILL_2} stroke={LINE} strokeWidth="1.25" />
            <text {...caption} x="448" y={y} fill={WHITE}>{name}</text>
            <circle cx="548" cy={y - 3} r="2.5" fill={tone} />
            <text {...caption} x="556" y={y} fill={tone}>{st}</text>
          </g>
        );
      })}

      <Panel x={160} y={272} w={440} h={48} />
      <text {...caption} x="172" y="292">Payroll run</text>
      <text {...mono} x="588" y="292" textAnchor="end" fill={WHITE}>75%</text>
      <rect x="172" y="300" width="416" height="6" rx="3" fill={LINE_SOFT} />
      <rect x="172" y="300" width="312" height="6" rx="3" fill={ACCENT} fillOpacity="0.8" />
    </CoverFrame>
  );
};

/* Phone with three TOTP entries and countdown rings, QR scan glyph, face-unlock badge, local vault. */
const AdiNox: CoverComponent = ({ uid, title, className }) => {
  const entries: [string, string, number, string][] = [['GitHub', '482 913', 40, ACCENT], ['Google', '057 261', 22, ACCENT], ['Supabase', '930 448', 8, AMBER]];
  const finders = [[72, 112], [120, 112], [72, 160]];
  const modules = [[96, 112], [104, 120], [96, 128], [112, 128], [76, 136], [88, 140], [100, 140], [116, 144], [128, 136], [96, 152], [108, 156], [124, 156], [100, 168], [116, 168], [128, 168]];
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[288, 176, 184]}>
      <text {...caption} x="40" y="44">Authenticator</text>
      <text {...caption} x="600" y="44" textAnchor="end">Biometric lock</text>

      <Phone x={208} y={40} w={160} h={280} />
      <text {...caption} x="228" y="84">Codes</text>
      <text {...caption} x="348" y="84" textAnchor="end">+</text>
      {entries.map(([issuer, code, dash, tone], i) => {
        const y = 96 + i * 64;
        return (
          <g key={issuer}>
            <rect x="224" y={y} width="128" height="56" rx="6" fill={NODE_FILL_2} stroke={LINE_SOFT} strokeWidth="1.25" />
            <text {...caption} x="234" y={y + 18}>{issuer}</text>
            <text {...mono} x="234" y={y + 42} fontSize="13" letterSpacing={1} fill={WHITE}>{code}</text>
            <circle cx="332" cy={y + 28} r="10" fill="none" stroke={LINE_SOFT} strokeWidth="1.25" />
            <circle cx="332" cy={y + 28} r="10" fill="none" stroke={tone} strokeWidth="1.25" strokeDasharray={`${dash} 62.8`} transform={`rotate(-90 332 ${y + 28})`} className={i === 0 ? ANIM.spin : undefined} />
          </g>
        );
      })}

      <path d="M56 112v-16h16M136 96h16v16M152 176v16h-16M72 192H56v-16" fill="none" stroke={ACCENT} strokeWidth="1.25" />
      {finders.map(([x, y]) => (
        <g key={`${x}-${y}`} fill={TEXT}>
          <rect x={x} y={y} width="16" height="16" rx="2" fill="none" stroke={TEXT} strokeWidth="1.25" />
          <rect x={x + 5} y={y + 5} width="6" height="6" rx="1" />
        </g>
      ))}
      <g fill={TEXT} fillOpacity="0.7">
        {modules.map(([x, y]) => <rect key={`${x}-${y}`} x={x} y={y} width="4" height="4" rx="1" />)}
      </g>
      <text {...caption} x="104" y="216" textAnchor="middle">Scan to add</text>
      <Tag x={72} y={248} text="local only" />

      <circle cx="504" cy="136" r="40" fill={NODE_FILL} stroke={LINE} strokeWidth="1.25" />
      <circle cx="504" cy="128" r="10" fill="none" stroke={TEXT} strokeWidth="1.25" />
      <path d="M484 160q20-18 40 0" fill="none" stroke={TEXT} strokeWidth="1.25" />
      <path d="M476 120v-12h12M520 108h12v12M532 152v12h-12M488 164h-12v-12" fill="none" stroke={ACCENT} strokeWidth="1.25" className={ANIM.pulse} />
      <circle cx="544" cy="172" r="8" fill={GREEN} fillOpacity="0.16" stroke={GREEN} strokeWidth="1.25" />
      <path d="M540 172l3 3 6-6" fill="none" stroke={GREEN} strokeWidth="1.25" />
      <text {...caption} x="504" y="200" textAnchor="middle">Face unlock</text>
      <text {...mono} x="504" y="216" fontSize="8" textAnchor="middle">face-api.js</text>

      <Panel x={424} y={240} w={160} h={80} />
      <rect x="440" y="268" width="14" height="10" rx="2" fill="none" stroke={AMBER} strokeWidth="1.25" />
      <path d="M443 268v-4a4 4 0 0 1 8 0v4" fill="none" stroke={AMBER} strokeWidth="1.25" />
      <text {...label} x="464" y="268">Local vault</text>
      <text {...caption} x="464" y="284">device only</text>
      <Tag x={440} y={304} text="TOTP 30s" tone="accent" />
    </CoverFrame>
  );
};

/* Two phones trading messages through a Supabase realtime bolt; emoji tray on the left. */
const Aditron: CoverComponent = ({ uid, title, className }) => {
  type Msg = [string, number, number, boolean];
  const left: Msg[] = [['hey, you online?', 96, 104, false], ['yep, deploying', 88, 132, true], ['nice, ship it', 80, 160, false], ['live now', 56, 188, true]];
  const right: Msg[] = [['hey, you online?', 96, 104, true], ['yep, deploying', 88, 132, false], ['nice, ship it', 80, 160, true]];
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[320, 176, 176]}>
      <Phone x={72} y={40} w={176} h={280} />
      <circle cx="96" cy="82" r="8" fill={NODE_FILL_2} stroke={LINE} strokeWidth="1.25" />
      <circle cx="102" cy="88" r="2.5" fill={GREEN} className={ANIM.pulse} />
      <text {...caption} x="112" y="80" fill={WHITE}>Alice</text>
      <text {...caption} x="112" y="91" fontSize="8" fill={GREEN}>online</text>
      <path d="M88 98h144" stroke={LINE_SOFT} strokeWidth="1.25" />
      {left.map(([t, w, y, mine]) => <Bubble key={t} x={mine ? 232 - w : 88} y={y} w={w} text={t} mine={mine} />)}
      <rect x="88" y="224" width="144" height="32" rx="6" fill={NODE_FILL_2} stroke={LINE_SOFT} strokeWidth="1.25" />
      {[112, 144, 176, 208].map((cx, i) => (
        <g key={cx} fill="none" stroke={i ? TEXT : ACCENT} strokeWidth="1.25">
          <circle cx={cx} cy="240" r="7" />
          <circle cx={cx - 2.5} cy="238" r="0.75" fill={i ? TEXT : ACCENT} />
          <circle cx={cx + 2.5} cy="238" r="0.75" fill={i ? TEXT : ACCENT} />
          <path d={`M${cx - 3} 242q3 3 6 0`} />
        </g>
      ))}
      <rect x="88" y="264" width="144" height="24" rx="12" fill={INK} stroke={LINE} strokeWidth="1.25" />
      <text {...mono} x="100" y="279.5" fontSize="8" fill={TEXT_MUTED}>Message</text>
      <circle cx="220" cy="276" r="8" fill={ACCENT} fillOpacity="0.2" />
      <path d="M216 276h8M221 273l3 3-3 3" fill="none" stroke={ACCENT} strokeWidth="1.25" />

      <g fill="none" stroke={ACCENT} strokeOpacity="0.5" strokeWidth="1.25" strokeDasharray="3 5" className={ANIM.flow}>
        <path d="M248 168h56" />
        <path d="M336 168h56" />
      </g>
      <circle cx="320" cy="168" r="16" fill={NODE_FILL} stroke={ACCENT} strokeOpacity="0.7" strokeWidth="1.25" />
      <path d="M322 158l-7 11h6l-3 9 8-12h-6z" fill={ACCENT} className={ANIM.pulse} />
      <text {...caption} x="320" y="208" textAnchor="middle">Realtime</text>
      <Tag x={292} y={232} text="Supabase" tone="green" />

      <Phone x={392} y={40} w={176} h={280} />
      <circle cx="416" cy="82" r="8" fill={NODE_FILL_2} stroke={LINE} strokeWidth="1.25" />
      <circle cx="422" cy="88" r="2.5" fill={GREEN} />
      <text {...caption} x="432" y="80" fill={WHITE}>Bob</text>
      <text {...caption} x="432" y="91" fontSize="8" fill={GREEN}>online</text>
      <path d="M408 98h144" stroke={LINE_SOFT} strokeWidth="1.25" />
      {right.map(([t, w, y, mine]) => <Bubble key={t} x={mine ? 552 - w : 408} y={y} w={w} text={t} mine={mine} />)}
      <Bubble x={408} y={188} w={56} text="live now" className={ANIM.drift} />
      <rect x="408" y="224" width="40" height="20" rx="8" fill={NODE_FILL_2} stroke={LINE_SOFT} strokeWidth="1.25" />
      {[420, 428, 436].map((cx) => <circle key={cx} cx={cx} cy="234" r="2" fill={TEXT_MUTED} />)}
      <rect x="408" y="264" width="144" height="24" rx="12" fill={INK} stroke={LINE} strokeWidth="1.25" />
      <text {...mono} x="420" y="279.5" fontSize="8" fill={WHITE}>on it</text>
      <circle cx="540" cy="276" r="8" fill={ACCENT} fillOpacity="0.2" />
      <path d="M536 276h8M541 273l3 3-3 3" fill="none" stroke={ACCENT} strokeWidth="1.25" />
    </CoverFrame>
  );
};

/* Storefront window: hero reel, product carousel, cart drawer; LCP gauge with web vitals. */
const Nureh: CoverComponent = ({ uid, title, className }) => {
  const cards: [string, string][] = [['Linen shirt', 'PKR 4,200'], ['Kurta set', 'PKR 6,800'], ['Denim jacket', 'PKR 5,400']];
  const vitals: [string, string][] = [['CLS', '0.00'], ['FCP', '0.9s'], ['TTFB', '120ms']];
  const shirt = 'M-14 -10l6-4a8 8 0 0 0 16 0l6 4-4 8-4-2v16h-12v-16l-4 2z';
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[248, 176, 200]}>
      <defs>
        <linearGradient id={`${uid}-hero`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={ACCENT_DEEP} stopOpacity="0.5" />
          <stop offset="1" stopColor={ACCENT_DEEP} stopOpacity="0.06" />
        </linearGradient>
        <linearGradient id={`${uid}-shade`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.45" />
        </linearGradient>
      </defs>
      <Panel x={40} y={40} w={416} h={280} />
      <path d="M40 48q0-8 8-8h400q8 0 8 8v16H40z" fill="#fff" fillOpacity="0.04" />
      {[52, 62, 72].map((cx) => <circle key={cx} cx={cx} cy="52" r="2.5" fill={LINE} />)}
      <rect x="88" y="45" width="96" height="14" rx="7" fill={INK} stroke={LINE_SOFT} strokeWidth="1.25" />
      <text {...mono} x="136" y="55" fontSize="8" textAnchor="middle">nureh.pk</text>
      <path d="M40 64h416" stroke={LINE_SOFT} strokeWidth="1.25" />

      <text {...label} x="56" y="84" letterSpacing={2} fill={WHITE}>NUREH</text>
      {['Shop', 'Reels', 'About'].map((t, i) => <text key={t} {...caption} x={136 + i * 40} y="84">{t}</text>)}
      <rect x="56" y="96" width="256" height="88" rx="6" fill={`url(#${uid}-hero)`} stroke={LINE_SOFT} strokeWidth="1.25" />
      <circle cx="184" cy="140" r="16" fill={INK} fillOpacity="0.6" stroke="#fff" strokeOpacity="0.6" strokeWidth="1.25" />
      <path d="M180 133l12 7-12 7z" fill={WHITE} />
      <Tag x={64} y={112} text="reel" tone="accent" />
      <text {...label} x="64" y="172" fill={WHITE}>New drop</text>

      {cards.map(([name, price], i) => {
        const x = 56 + i * 88;
        return (
          <g key={name}>
            <Panel x={x} y={200} w={80} h={104} />
            <rect x={x + 8} y="208" width="64" height="48" rx="4" fill={NODE_FILL_2} />
            <path d={shirt} transform={`translate(${x + 40} 232)`} fill="#fff" fillOpacity="0.12" stroke={LINE} strokeWidth="1.25" />
            <text {...caption} x={x + 8} y="272" fill={WHITE}>{name}</text>
            <text {...mono} x={x + 8} y="288" fontSize="8">{price}</text>
          </g>
        );
      })}
      {[0, 1, 2].map((i) => <circle key={i} cx={176 + i * 8} cy="312" r="2" fill={i ? LINE : ACCENT} />)}

      <rect x="312" y="64" width="24" height="248" fill={`url(#${uid}-shade)`} />
      <rect x="336" y="64" width="112" height="248" rx="6" fill={NODE_FILL_2} stroke={LINE} strokeWidth="1.25" />
      <text {...label} x="348" y="88">Cart</text>
      <circle cx="428" cy="84" r="7" fill={ACCENT} fillOpacity="0.2" stroke={ACCENT} strokeOpacity="0.5" strokeWidth="1.25" />
      <text {...mono} x="428" y="87" fontSize="8" textAnchor="middle" fill={WHITE}>2</text>
      {cards.slice(0, 2).map(([name, price], i) => {
        const y = 112 + i * 40;
        return (
          <g key={name}>
            <rect x="348" y={y - 12} width="24" height="24" rx="4" fill={NODE_FILL} stroke={LINE_SOFT} strokeWidth="1.25" />
            <text {...caption} x="380" y={y - 2} fontSize="8" fill={WHITE}>{name}</text>
            <text {...mono} x="380" y={y + 10} fontSize="8">{price}</text>
          </g>
        );
      })}
      <path d="M348 184h88" stroke={LINE_SOFT} strokeWidth="1.25" />
      <text {...caption} x="348" y="204">Total</text>
      <text {...mono} x="436" y="204" textAnchor="end" fill={WHITE}>PKR 11,000</text>
      <rect x="348" y="280" width="88" height="20" rx="6" fill={ACCENT} fillOpacity="0.16" stroke={ACCENT} strokeOpacity="0.5" strokeWidth="1.25" />
      <text {...caption} x="392" y="293.5" textAnchor="middle" fill={WHITE}>Checkout</text>

      <text {...caption} x="472" y="44">Performance</text>
      <Tag x={472} y={72} text="React" />
      <Tag x={520} y={72} text="Vite" />
      <Tag x={472} y={96} text="LCP preload" tone="accent" />
      <path d="M488 192A48 48 0 0 1 584 192" fill="none" stroke={LINE} strokeWidth="1.25" />
      <path d="M496 192A40 40 0 0 1 576 192" fill="none" stroke={LINE_SOFT} strokeWidth="1.25" />
      <path d="M488 192A48 48 0 0 1 512 150.4L516 157.4A40 40 0 0 0 496 192z" fill={GREEN} fillOpacity="0.25" />
      <path d="M500.6 156.6L497.8 153.8M536 142v-4M571.4 156.6l2.8-2.8" stroke={LINE} strokeWidth="1.25" />
      <path d="M536 192L504.8 174" stroke={ACCENT} strokeWidth="1.25" strokeLinecap="round" className={ANIM.pulse} />
      <circle cx="536" cy="192" r="3" fill={ACCENT} />
      <circle cx="592" cy="152" r="8" fill={GREEN} fillOpacity="0.16" stroke={GREEN} strokeWidth="1.25" />
      <path d="M588 152l3 3 6-6" fill="none" stroke={GREEN} strokeWidth="1.25" />
      <text {...mono} x="536" y="216" textAnchor="middle">LCP</text>
      <text {...label} x="536" y="236" fontSize="14" textAnchor="middle" fill={WHITE}>1.4s</text>

      <Panel x={472} y={248} w={128} h={72} />
      {vitals.map(([k, v], i) => {
        const y = 268 + i * 20;
        return (
          <g key={k}>
            <circle cx="484" cy={y - 3} r="2.5" fill={GREEN} />
            <text {...mono} x="496" y={y}>{k}</text>
            <text {...mono} x="588" y={y} textAnchor="end" fill={WHITE}>{v}</text>
          </g>
        );
      })}
    </CoverFrame>
  );
};

/* Breaking ticker, markdown editor with toolbar and admin lock, live article preview. */
const Federals: CoverComponent = ({ uid, title, className }) => {
  const tools = ['B', 'I', 'H1', '</>'];
  const strip = [[120, 64], [192, 40], [240, 88], [336, 56], [400, 72], [480, 40]];
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[320, 200, 200]}>
      <rect x="40" y="40" width="560" height="24" rx="4" fill={ROSE} fillOpacity="0.08" stroke={ROSE} strokeOpacity="0.35" strokeWidth="1.25" />
      <Tag x={48} y={52} text="Breaking" tone="rose" />
      <g className={ANIM.drift} fill="#fff" fillOpacity="0.16">
        {strip.map(([x, w]) => <rect key={x} x={x} y="48" width={w} height="8" rx="4" />)}
      </g>
      <circle cx="584" cy="52" r="3" fill={ROSE} className={ANIM.blink} />

      <Panel x={40} y={80} w={272} h={240} />
      {tools.map((t, i) => (
        <g key={t}>
          <rect x={52 + i * 24} y="88" width="20" height="16" rx="3" fill={NODE_FILL_2} stroke={LINE_SOFT} strokeWidth="1.25" />
          <text {...mono} x={62 + i * 24} y="99.5" fontSize="8" textAnchor="middle" fill={WHITE}>{t}</text>
        </g>
      ))}
      <Tag x={152} y={96} text="Markdown" />
      <rect x="248" y="95" width="10" height="7" rx="1.5" fill="none" stroke={AMBER} strokeWidth="1.25" />
      <path d="M250 95v-3a3 3 0 0 1 6 0v3" fill="none" stroke={AMBER} strokeWidth="1.25" />
      <Tag x={264} y={96} text="admin" tone="amber" />
      <path d="M52 112h248" stroke={LINE_SOFT} strokeWidth="1.25" />
      <text {...mono} x="52" y="132" fill={WHITE}># Budget passes</text>
      <text {...mono} x="52" y="148" fill={ACCENT}>## Senate vote</text>
      <Lines x={52} y={160} widths={[200, 232, 176]} />
      <text {...mono} x="52" y="208" fill={GREEN}>![chart](cover.jpg)</text>
      <Lines x={52} y={220} widths={[216, 144]} />
      <text {...mono} x="52" y="256">&gt; Sources: 3</text>
      <rect x="120" y="248" width="1.5" height="10" fill={ACCENT} className={ANIM.blink} />
      <path d="M52 288h248" stroke={LINE_SOFT} strokeWidth="1.25" />
      <text {...mono} x="52" y="308" fontSize="8">draft</text>
      <Tag x={248} y={304} text="SEO 92" tone="green" />

      <Panel x={328} y={80} w={272} h={240} />
      <text {...caption} x="340" y="100">Preview</text>
      <g className={ANIM.pulse}><Tag x={552} y={96} text="live" tone="green" /></g>
      <path d="M340 112h248" stroke={LINE_SOFT} strokeWidth="1.25" />
      <text {...label} x="340" y="132" fontSize="12" fill={WHITE}>Budget passes</text>
      <text {...caption} x="340" y="148" fontSize="8">Politics · 2 min</text>
      <rect x="340" y="160" width="248" height="64" rx="4" fill={NODE_FILL_2} />
      <circle cx="556" cy="176" r="6" fill="#fff" fillOpacity="0.2" />
      <path d="M348 216l40-32 24 20 20-16 56 28z" fill="#fff" fillOpacity="0.1" />
      <Lines x={340} y={236} widths={[248, 216, 232, 160]} />
      <Tag x={340} y={304} text="Politics" tone="accent" />
      <Tag x={408} y={304} text="Economy" />
      <text {...mono} x="588" y="308" fontSize="8" textAnchor="end">RLS · Supabase</text>
    </CoverFrame>
  );
};

export const PRODUCT_COVERS: Record<string, CoverComponent> = {
  adiflux: AdiFlux,
  adimage: AdiMage,
  adicorp: AdiCorp,
  adinox: AdiNox,
  aditron: Aditron,
  nureh: Nureh,
  federals: Federals,
};
