import { useId, type CSSProperties, type ReactNode, type SVGProps } from 'react';
import { ARTICLE_COVERS } from './articles';
import { ACCENT, AMBER, ANIM, CoverFrame, GREEN, LINE, LINE_SOFT, NODE_FILL, ROSE, TEXT_MUTED } from './shared';

export type NoteCoverId = 'game-economy' | 'public-wifi' | 'recon';

const TINT = ACCENT;
const MUTED = TEXT_MUTED;
const INK = '#0b0f17';

const label: SVGProps<SVGTextElement> = {
  fontFamily: 'inherit',
  fontSize: 10,
  fontWeight: 500,
  letterSpacing: 0.4,
  fill: '#a4adbe',
  fillOpacity: 0.9,
};
const caption: SVGProps<SVGTextElement> = { ...label, fontSize: 9, fill: MUTED, fillOpacity: 1 };
const mono: SVGProps<SVGTextElement> = { ...caption, fontFamily: 'var(--font-mono, ui-monospace, monospace)', letterSpacing: 0 };

/* Windows are fractions of one loop (--nc-t): hop 7% (short edge or a brief highlight), run 30% (long edge), on 55% (a state that holds, strokes draw over the first 10%), off is the inverse of on. */
const STYLE = `
@keyframes nc-hop { 0% { offset-distance: 0%; opacity: 0; } 0.7% { opacity: 1; } 6.3% { opacity: 1; } 7% { offset-distance: 100%; opacity: 0; } 100% { offset-distance: 100%; opacity: 0; } }
@keyframes nc-run { 0% { offset-distance: 0%; opacity: 0; } 1% { opacity: 1; } 29% { opacity: 1; } 30% { offset-distance: 100%; opacity: 0; } 100% { offset-distance: 100%; opacity: 0; } }
@keyframes nc-on { 0% { opacity: 0; stroke-dashoffset: 1; } 2% { opacity: 1; } 10% { stroke-dashoffset: 0; } 55% { opacity: 1; stroke-dashoffset: 0; } 57%, 100% { opacity: 0; stroke-dashoffset: 0; } }
@keyframes nc-off { 0% { opacity: 1; } 2% { opacity: 0; } 55% { opacity: 0; } 57%, 100% { opacity: 1; } }
.nc-hop, .nc-run, .nc-on { opacity: 0; }
@media (hover: hover) and (min-width: 768px) {
  .cover-live .nc-hop { animation: nc-hop var(--nc-t, 10s) linear infinite; }
  .cover-live .nc-run { animation: nc-run var(--nc-t, 10s) linear infinite; }
  .cover-live .nc-on { animation: nc-on var(--nc-t, 10s) linear infinite; }
  .cover-live .nc-off { animation: nc-off var(--nc-t, 10s) linear infinite; }
}
@media (prefers-reduced-motion: reduce) { .nc-hop, .nc-run, .nc-on, .nc-off { animation: none !important; } }
`;

type Win = 'hop' | 'run';

const at = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` });
const along = (path: string, ms: number): CSSProperties => ({
  offsetPath: `path("${path}")`,
  offsetRotate: '0deg',
  animationDelay: `${ms}ms`,
});

interface SceneProps {
  uid: string;
  title: string;
  className?: string;
  glow: [number, number, number];
  t: string;
  children: ReactNode;
}

function Scene({ uid, title, className, glow, t, children }: SceneProps) {
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={glow}>
      <style>{STYLE}</style>
      <g strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" style={{ '--nc-t': t } as CSSProperties}>
        {children}
      </g>
    </CoverFrame>
  );
}

function Pulse({ x, y, path, ms, win = 'hop', tone = ACCENT }: { x: number; y: number; path: string; ms: number; win?: Win; tone?: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className={`nc-${win}`} style={along(path, ms)}>
        <circle r={2.4} fill={tone} />
        <circle r={5} fill={tone} fillOpacity={0.25} />
      </g>
    </g>
  );
}

function Blip({ x, y, w, h, r = 4, ms, tone = ACCENT }: { x: number; y: number; w: number; h: number; r?: number; ms: number; tone?: string }) {
  return <rect x={x} y={y} width={w} height={h} rx={r} fill={tone} fillOpacity={0.16} stroke={tone} strokeOpacity={0.6} className="nc-hop" style={at(ms)} />;
}

function Draw({ d, ms, tone, width = 1.75 }: { d: string; ms: number; tone: string; width?: number }) {
  return <path d={d} fill="none" stroke={tone} strokeWidth={width} pathLength={1} strokeDasharray={1} className="nc-on" style={at(ms)} />;
}

interface CoverProps { title: string; className?: string }

// Client -> server-authority shield -> ledger; a forged packet is rejected on the way in.
function GameEconomy({ title, className }: CoverProps) {
  const u = 'nc-ge';
  const arrow = `url(#${u}-arrow)`;
  const ledger: [string, string, boolean][] = [
    ['#4812', '+50', true],
    ['#4813', '-120', true],
    ['#4814', '+50', true],
    ['#4815', '+99,999', false],
  ];
  const shield = 'M336 124l38 14v30q0 40-38 58q-38-18-38-58v-30z';
  const written = 2;
  return (
    <Scene uid={u} title={title} className={className} glow={[336, 176, 168]} t="10s">
      <text {...caption} x="40" y="44">Client</text>
      <text {...caption} x="600" y="44" textAnchor="end">Server authority</text>

      <rect x="48" y="104" width="104" height="144" rx="10" fill={NODE_FILL} stroke={LINE} />
      <rect x="60" y="118" width="80" height="92" rx="4" fill={INK} stroke={LINE_SOFT} />
      <text {...mono} x="68" y="136" fontSize="8">gold</text>
      <text {...label} x="68" y="154" fontSize="14" fill="#f2f4f8">1,250</text>
      <Blip x={64} y={141} w={52} h={17} r={3} ms={0} />
      <Blip x={64} y={141} w={52} h={17} r={3} ms={3500} tone={ROSE} />
      <path d="M68 172h48M68 182h32M68 192h56" stroke={LINE_SOFT} strokeWidth="2" />
      <circle cx="100" cy="230" r="5" fill="none" stroke={LINE} />
      <text {...caption} x="100" y="272" fontSize="8" textAnchor="middle">local state</text>

      <path d="M152 148h28" stroke={LINE} />
      <rect x="180" y="134" width="72" height="28" rx="6" fill={NODE_FILL} stroke={ACCENT} strokeOpacity="0.45" />
      <text {...mono} x="216" y="152" textAnchor="middle" fill="#a4adbe">gold +50</text>
      <path d="M252 148h30" stroke={LINE} markerEnd={arrow} />
      <Blip x={180} y={134} w={72} h={28} r={6} ms={900} />
      <Pulse x={152} y={148} path="M0 0 L132 0" ms={700} />

      <path d="M152 216h28" stroke={LINE} strokeDasharray="3 4" />
      <rect x="180" y="202" width="80" height="28" rx="6" fill={NODE_FILL} stroke={LINE} strokeDasharray="3 4" />
      <text {...mono} x="220" y="220" textAnchor="middle" fill="#a4adbe">gold +99,999</text>
      <path d="M260 216h20" stroke={LINE} strokeDasharray="3 4" />
      <Blip x={180} y={202} w={80} h={28} r={6} ms={4000} tone={ROSE} />
      <Pulse x={152} y={216} path="M0 0 L131 0" ms={3800} tone={AMBER} />
      <circle cx="292" cy="216" r="9" fill={INK} stroke={LINE} />
      <path d="M288 212l8 8M296 212l-8 8" stroke="#a4adbe" strokeWidth="1.5" />
      <Draw d="M288 212l8 8M296 212l-8 8" ms={4500} tone={ROSE} />
      <text {...caption} x="292" y="240" fontSize="8" textAnchor="middle">rejected</text>
      <text {...caption} x="292" y="240" fontSize="8" textAnchor="middle" fill={ROSE} className="nc-on" style={at(4600)}>rejected</text>
      <text {...caption} x="220" y="262" fontSize="8" textAnchor="middle">forged packet</text>

      <circle cx="336" cy="172" r="52" fill="none" stroke={TINT} strokeOpacity="0.25" strokeDasharray="2 6" />
      <g className="nc-on" style={at(1400)}>
        <circle cx="336" cy="172" r="52" fill="none" stroke={TINT} strokeOpacity="0.6" strokeDasharray="2 6" className={ANIM.flow} />
        <path d={shield} fill={ACCENT} fillOpacity="0.14" stroke="none" className={ANIM.pulse} />
      </g>
      <circle cx="336" cy="172" r="52" fill="none" stroke={ROSE} strokeOpacity="0.7" className="nc-hop" style={at(4500)} />
      <path d={shield} fill="#111622" stroke={ACCENT} strokeOpacity="0.75" />
      <path d="M321 172l11 11 20-24" fill="none" stroke={TINT} strokeWidth="1.75" />
      <Draw d="M321 172l11 11 20-24" ms={1500} tone={GREEN} />
      <text {...caption} x="336" y="272" textAnchor="middle">validate · authorise · write</text>

      <path d="M388 172h44" stroke={LINE} markerEnd={arrow} />
      <Pulse x={376} y={172} path="M0 0 L56 0" ms={2400} tone={GREEN} />

      <text {...caption} x="440" y="96">Ledger</text>
      <rect x="440" y="104" width="160" height="136" rx="8" fill={NODE_FILL} stroke={LINE} />
      <path d="M440 112q0-8 8-8h144q8 0 8 8v14H440z" fill={ACCENT} fillOpacity="0.12" />
      <text {...mono} x="452" y="119" fontSize="8" fill="#a4adbe">tx</text>
      <text {...mono} x="590" y="119" fontSize="8" fill="#a4adbe" textAnchor="end">delta</text>
      {ledger.map(([id, delta, ok], i) => {
        const y = 146 + i * 24;
        const appended = i === written;
        return (
          <g key={id}>
            {i > 0 && <path d={`M448 ${y - 12}h144`} stroke={LINE_SOFT} />}
            <g className={appended ? 'nc-off' : undefined} style={appended ? at(0) : undefined}>
              <circle cx="456" cy={y - 3} r="2.5" fill={ok ? TINT : 'none'} stroke={ok ? 'none' : LINE} fillOpacity="0.8" />
              <text {...mono} x="590" y={y} textAnchor="end" fill={ok ? '#f2f4f8' : MUTED} fillOpacity={ok ? 0.9 : 1} style={ok ? undefined : { textDecoration: 'line-through' }}>{delta}</text>
            </g>
            <text {...mono} x="468" y={y} fill={ok ? '#a4adbe' : MUTED}>{id}</text>
            {appended && (
              <g className="nc-on" style={at(3100)}>
                <circle cx="456" cy={y - 3} r="2.5" fill={TINT} fillOpacity="0.8" />
                <text {...mono} x="590" y={y} textAnchor="end" fill="#f2f4f8" fillOpacity={0.9}>{delta}</text>
              </g>
            )}
            {appended && <Blip x={446} y={y - 13} w={148} h={22} r={3} ms={3100} tone={GREEN} />}
            {!ok && <Blip x={446} y={y - 13} w={148} h={22} r={3} ms={4700} tone={ROSE} />}
          </g>
        );
      })}
      <text {...caption} x="520" y="262" fontSize="8" textAnchor="middle">append-only · server value wins</text>
    </Scene>
  );
}

// Phone -> café access point -> on-path listener -> web; an encrypted tunnel arcs over the listener.
function PublicWifi({ title, className }: CoverProps) {
  const u = 'nc-pw';
  const arrow = `url(#${u}-arrow)`;
  const tunnel = 'M100 176C160 72 420 72 522 156';
  const eye = 'M336 192q16-12 32 0q-16 12-32 0z';
  const beacons = ['M188 168a34 34 0 0 1 48 0', 'M176 156a51 51 0 0 1 72 0', 'M164 144a68 68 0 0 1 96 0'];
  return (
    <Scene uid={u} title={title} className={className} glow={[224, 192, 168]} t="10s">
      <text {...caption} x="40" y="44">Public Wi-Fi</text>
      <text {...caption} x="600" y="44" textAnchor="end">On-path interception</text>

      <rect x="56" y="152" width="44" height="80" rx="7" fill={NODE_FILL} stroke={LINE} />
      <path d="M72 160h12" stroke={LINE} />
      <path d="M66 174h24M66 184h16M66 194h24" stroke={LINE_SOFT} strokeWidth="2" />
      <circle cx="78" cy="222" r="3" fill="none" stroke={LINE} />
      <Blip x={62} y={168} w={32} h={32} r={3} ms={600} />
      <text {...caption} x="78" y="256" textAnchor="middle">Phone</text>

      <path d="M100 192h60" stroke={LINE} markerEnd={arrow} />
      <Pulse x={100} y={192} path="M0 0 L58 0" ms={1000} tone={AMBER} />

      <g fill="none" stroke={TINT} strokeOpacity="0.35">
        {beacons.map((d) => <path key={d} d={d} />)}
      </g>
      <g fill="none" stroke={TINT} strokeOpacity="0.9">
        {beacons.map((d, i) => <path key={d} d={d} className="nc-hop" style={at(i * 150)} />)}
      </g>
      <rect x="184" y="176" width="56" height="32" rx="6" fill={NODE_FILL} stroke={LINE} />
      <circle cx="200" cy="192" r="2" fill={TINT} fillOpacity="0.9" />
      <circle cx="212" cy="192" r="2" fill={LINE} />
      <circle cx="224" cy="192" r="2" fill={LINE} />
      <Blip x={184} y={176} w={56} h={32} r={6} ms={1700} />
      <text {...caption} x="212" y="230" textAnchor="middle">Café access point</text>
      <text {...caption} x="212" y="244" fontSize="8" textAnchor="middle">open · no password</text>

      <path d="M240 192h68" stroke={LINE} markerEnd={arrow} />
      <Pulse x={240} y={192} path="M0 0 L66 0" ms={2100} tone={AMBER} />

      <rect x="312" y="164" width="80" height="56" rx="8" fill="#111622" stroke={LINE} strokeDasharray="3 4" />
      <path d={eye} fill="none" stroke="#a4adbe" />
      <circle cx="352" cy="192" r="3" fill="#a4adbe" />
      <Blip x={312} y={164} w={80} h={56} r={8} ms={2800} tone={ROSE} />
      <Draw d={eye} ms={2900} tone={ROSE} width={1.25} />
      <text {...caption} x="352" y="236" textAnchor="middle">Listener</text>
      <rect x="296" y="248" width="112" height="40" rx="6" fill={INK} stroke={LINE_SOFT} />
      <rect x="296" y="248" width="112" height="40" rx="6" fill="none" stroke={ROSE} strokeOpacity="0.6" className="nc-on" style={at(3000)} />
      <text {...mono} x="304" y="262" fontSize="8">GET /login</text>
      <text {...mono} x="304" y="276" fontSize="8">cookie=sess…</text>
      <Blip x={300} y={254} w={52} h={11} r={2} ms={3000} tone={ROSE} />
      <Blip x={300} y={268} w={62} h={11} r={2} ms={3300} tone={ROSE} />
      <rect x="297" y="249" width="110" height="38" rx="6" fill={INK} fillOpacity="0.8" className="nc-on" style={at(5600)} />
      <text {...caption} x="352" y="306" fontSize="8" textAnchor="middle">plaintext, readable</text>

      <path d="M392 192h68" stroke={LINE} markerEnd={arrow} />
      <Pulse x={392} y={192} path="M0 0 L66 0" ms={3600} tone={AMBER} />

      <path d={tunnel} fill="none" stroke={TINT} strokeOpacity="0.35" strokeWidth="9" />
      <path d={tunnel} fill="none" stroke={ACCENT} strokeOpacity="0.9" strokeDasharray="4 6" />
      <g className="nc-on" style={at(5200)}>
        <path d={tunnel} fill="none" stroke="#f2f4f8" strokeOpacity="0.7" strokeDasharray="4 6" className={ANIM.flow} />
      </g>
      <Pulse x={100} y={176} path="M0 0 C60 -104 320 -104 422 -20" ms={5400} win="run" />
      <rect x="298" y="86" width="44" height="26" rx="6" fill="#111622" stroke={ACCENT} strokeOpacity="0.6" />
      <rect x="315" y="97" width="10" height="8" rx="1.5" fill="none" stroke={TINT} />
      <path d="M317 97v-3a3 3 0 0 1 6 0v3" fill="none" stroke={TINT} />
      <Blip x={298} y={86} w={44} h={26} r={6} ms={5200} />
      <text {...caption} x="320" y="72" textAnchor="middle" fill={TINT} fillOpacity="0.9">HTTPS / VPN tunnel</text>
      <text {...caption} x="430" y="136" fontSize="8" textAnchor="middle">encrypted end to end</text>

      <circle cx="536" cy="192" r="40" fill={NODE_FILL} stroke={LINE} />
      <ellipse cx="536" cy="192" rx="16" ry="40" fill="none" stroke={LINE_SOFT} />
      <path d="M496 192h80M504 172h64M504 212h64" stroke={LINE_SOFT} />
      <circle cx="536" cy="192" r="42" fill="none" stroke={AMBER} strokeOpacity="0.7" className="nc-hop" style={at(4300)} />
      <circle cx="536" cy="192" r="42" fill="none" stroke={ACCENT} strokeOpacity="0.9" className="nc-hop" style={at(8400)} />
      <text {...caption} x="536" y="256" textAnchor="middle">Web</text>
    </Scene>
  );
}

interface ChipProps { x: number; y: number; w: number; text: string; active?: boolean; on?: number }

function Chip({ x, y, w, text, active, on }: ChipProps) {
  return (
    <g>
      <rect x={x} y={y} width={w} height="18" rx="4" fill={active ? ACCENT : NODE_FILL} fillOpacity={active ? 0.16 : 1} stroke={active ? ACCENT : LINE} strokeOpacity={active ? 0.5 : 1} />
      <text {...mono} x={x + w / 2} y={y + 12.5} fontSize="8" textAnchor="middle" fill={active ? '#f2f4f8' : '#a4adbe'}>{text}</text>
      {on !== undefined && (
        <g className="nc-on" style={at(on)}>
          <rect x={x} y={y} width={w} height="18" rx="4" fill={ACCENT} fillOpacity="0.16" stroke={ACCENT} strokeOpacity="0.5" />
          <text {...mono} x={x + w / 2} y={y + 12.5} fontSize="8" textAnchor="middle" fill="#f2f4f8">{text}</text>
        </g>
      )}
    </g>
  );
}

// Search console with query chips -> funnel narrowing thousands of hosts -> ranked list; subdomain map below.
function Recon({ title, className }: CoverProps) {
  const u = 'nc-rc';
  const arrow = `url(#${u}-arrow)`;
  const chips: [string, number, number, number, boolean][] = [
    ['domain:*.target', 52, 106, 74, true],
    ['legacy', 132, 106, 44, false],
    ['/admin', 182, 106, 46, false],
    ['port:8443', 52, 130, 58, false],
    ['.bak', 116, 130, 36, false],
  ];
  const ranked: [string, number][] = [['legacy-api', 96], ['dev-portal', 72], ['old-cms', 52], ['staging', 32]];
  const leaves = [
    ['api', 448, 288, false],
    ['legacy', 500, 312, true],
    ['dev', 552, 288, false],
    ['cdn', 592, 312, false],
  ] as const;
  const funnelDots = [3, 5, 4, 3, 2, 1];
  // Hosts enter the funnel at (280,120), fan out to x=346 at these heights; only the two marked survive to the ranked list.
  const hosts: [number, boolean][] = [[132, false], [150, true], [168, false], [186, true], [204, false]];
  return (
    <Scene uid={u} title={title} className={className} glow={[176, 168, 160]} t="11s">
      <text {...caption} x="40" y="44">Search console</text>
      <text {...caption} x="600" y="44" textAnchor="end">Triage</text>

      <rect x="40" y="56" width="240" height="248" rx="10" fill={NODE_FILL} stroke={LINE} />
      <rect x="52" y="68" width="216" height="26" rx="6" fill={INK} stroke={ACCENT} strokeOpacity="0.45" />
      <circle cx="66" cy="81" r="4" fill="none" stroke="#a4adbe" />
      <path d="M69 84l4 4" stroke="#a4adbe" />
      <text {...mono} x="80" y="85" fill="#f2f4f8" fillOpacity="0.9">page.domain:*.target …</text>
      <rect x="236" y="76" width="1.5" height="10" fill={TINT} className={ANIM.blink} />
      <Blip x={52} y={68} w={216} h={26} r={6} ms={0} />

      {chips.map(([text, x, y, w, active], i) => <Chip key={text} x={x} y={y} w={w} text={text} active={active} on={active ? undefined : 800 + (i - 1) * 450} />)}

      <path d="M52 160h216" stroke={LINE_SOFT} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i}>
          <rect x="52" y={170 + i * 20} width="6" height="6" rx="1.5" fill={i < 2 ? TINT : LINE} fillOpacity={i < 2 ? 0.8 : 1} />
          <rect x="66" y={171 + i * 20} width={[120, 96, 140, 84, 112, 60][i]} height="4" rx="2" fill="#fff" fillOpacity={i < 2 ? 0.22 : 0.1} />
          <rect x="220" y={171 + i * 20} width={[32, 24, 40, 20, 28, 16][i]} height="4" rx="2" fill="#fff" fillOpacity="0.08" />
          {i >= 2 && <rect x="50" y={168 + i * 20} width="204" height="10" fill={NODE_FILL} fillOpacity="0.85" className="nc-on" style={at(1100 + (i - 2) * 450)} />}
        </g>
      ))}
      <text {...mono} x="52" y="296" fontSize="8" className="nc-off" style={at(2700)}>12,400 results</text>
      <text {...mono} x="52" y="296" fontSize="8" fill={TINT} className="nc-on" style={at(2700)}>38 candidates</text>

      <path d="M280 120h16" stroke={LINE} />
      <path d="M296 104L392 148v40L296 232z" fill={ACCENT} fillOpacity="0.06" stroke={LINE} />
      <path d="M296 104L392 148M296 232L392 188" stroke={LINE} strokeDasharray="3 4" />
      <g className="nc-on" style={at(3000)}>
        <path d="M296 104L392 148v40L296 232z" fill={ACCENT} fillOpacity="0.1" stroke="none" className={ANIM.pulse} />
        <path d="M296 104L392 148M296 232L392 188" stroke={ACCENT} strokeOpacity="0.8" strokeDasharray="3 4" className={ANIM.flow} />
      </g>
      {funnelDots.map((n, col) => {
        const x = 308 + col * 15;
        const half = (n - 1) * 6;
        return Array.from({ length: n }, (_, k) => (
          <circle key={`${col}-${k}`} cx={x} cy={168 - half + k * 12} r="2" fill={TINT} fillOpacity={0.35 + col * 0.1} />
        ));
      })}
      {hosts.map(([y, keep], k) => (
        <g key={y}>
          <Pulse x={280} y={120} path={`M0 0 L16 0 C36 0 44 ${y - 120} 66 ${y - 120}`} ms={3000 + k * 180} tone={keep ? ACCENT : AMBER} />
          {keep && <Pulse x={346} y={y} path={`M0 0 L46 ${168 - y} L70 ${168 - y}`} ms={3770 + k * 180} />}
        </g>
      ))}
      <text {...caption} x="344" y="252" fontSize="8" textAnchor="middle">passive → confirm → rank</text>
      <path d="M392 168h24" stroke={LINE} markerEnd={arrow} />

      <text {...caption} x="424" y="76">Worth a human&apos;s time</text>
      <rect x="424" y="84" width="176" height="112" rx="8" fill={NODE_FILL} stroke={LINE} />
      {ranked.map(([name, w], i) => {
        const y = 104 + i * 24;
        return (
          <g key={name}>
            <text {...mono} x="434" y={y + 3} fontSize="8">0{i + 1}</text>
            <text {...mono} x="450" y={y + 3} fontSize="8" fill="#a4adbe">{name}</text>
            <rect x="508" y={y - 3} width={w * 0.84} height="6" rx="2" fill={TINT} fillOpacity={0.8 - i * 0.16} />
            <Blip x={428} y={y - 9} w={168} h={20} r={3} ms={4750 + i * 350} />
          </g>
        );
      })}
      <text {...mono} x="592" y="188" fontSize="8" textAnchor="end">38 hosts</text>

      <text {...caption} x="424" y="230">Subdomains</text>
      <rect x="484" y="240" width="72" height="20" rx="5" fill={NODE_FILL} stroke={LINE} />
      <text {...mono} x="520" y="253.5" fontSize="8" textAnchor="middle" fill="#a4adbe">target.com</text>
      <g fill="none" stroke={LINE_SOFT}>
        {leaves.map(([name, x, y]) => <path key={name} d={`M520 260C520 276 ${x} ${y - 22} ${x} ${y - 8}`} />)}
      </g>
      {leaves.map(([name, x, y], i) => (
        <Pulse key={name} x={520} y={260} path={`M0 0 C0 16 ${x - 520} ${y - 282} ${x - 520} ${y - 268}`} ms={6200 + i * 120} tone={i === 1 ? ACCENT : AMBER} />
      ))}
      {leaves.map(([name, x, y, hot]) => (
        <g key={name}>
          <rect x={x - 22} y={y - 8} width="44" height="16" rx="4" fill={hot ? ACCENT : NODE_FILL} fillOpacity={hot ? 0.16 : 1} stroke={hot ? ACCENT : LINE} strokeOpacity={hot ? 0.5 : 1} />
          <text {...mono} x={x} y={y + 3} fontSize="8" textAnchor="middle" fill={hot ? '#f2f4f8' : MUTED}>{name}</text>
          {hot && <rect x={x - 25} y={y - 11} width="50" height="22" rx="6" fill="none" stroke={ACCENT} strokeOpacity="0.9" className="nc-on" style={at(7000)} />}
        </g>
      ))}
    </Scene>
  );
}

function Fallback({ title, className }: CoverProps) {
  const u = 'nc-fb';
  return (
    <Scene uid={u} title={title} className={className} glow={[320, 180, 150]} t="10s">
      {[32, 64, 96].map((r, i) => (
        <circle key={r} cx="320" cy="180" r={r} fill="none" stroke={i === 0 ? ACCENT : LINE} strokeOpacity={i === 0 ? 0.6 : 1} strokeDasharray={i ? '2 6' : undefined} className={i ? ANIM.flow : undefined} />
      ))}
      <text {...label} x="320" y="184" textAnchor="middle">Note</text>
    </Scene>
  );
}

const COVERS: Record<NoteCoverId, (p: CoverProps) => JSX.Element> = {
  'game-economy': GameEconomy,
  'public-wifi': PublicWifi,
  recon: Recon,
};

export function NoteCover({ cover, title, className }: { cover?: string; title: string; className?: string }) {
  const uid = `nt-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const Article = cover ? ARTICLE_COVERS[cover] : undefined;
  if (Article) return <Article uid={uid} title={title} className={className} />;
  const Cover = (cover && COVERS[cover as NoteCoverId]) || Fallback;
  return <Cover title={title} className={className} />;
}

export default NoteCover;
