'use client';
import type { CSSProperties } from 'react';
import { ACCENT, AMBER, ANIM, caption, CoverFrame, delay, Edge, GREEN, label, LINE, mono, NODE_FILL, Panel, ROSE, Tag, TEXT, TEXT_MUTED, type CoverComponent } from '../shared';

const WHITE = '#f2f4f8';

const ON = 'msi-on';
const DONE = 'msi-done';
const GO = 'msi-go';
const DRAW = 'msi-draw';
const HID = 'msi-hid';
/* Pulses move 130px per 600ms and park at the end of shorter paths, so every edge is crossed at the same speed. */
const STYLE = `
.msi-go{opacity:0}
.msi-hid{opacity:0}
.msi-draw{stroke-dasharray:1}
@media (hover:hover) and (min-width:768px){
.cover-live .msi-on{animation:msi-on 12s linear infinite both}
.cover-live .msi-done{animation:msi-done 12s linear infinite both}
.cover-live .msi-go{animation:msi-go 12s linear infinite both}
.cover-live .msi-draw{animation:msi-draw 12s linear infinite both}
}
@media (prefers-reduced-motion:reduce){
.msi-on,.msi-done,.msi-go,.msi-draw{animation:none !important}
}
@keyframes msi-on{0%{opacity:0}2%{opacity:1}14%{opacity:1}16%{opacity:0}100%{opacity:0}}
@keyframes msi-done{0%{opacity:0}2%{opacity:1}32%{opacity:1}36%{opacity:0}100%{opacity:0}}
@keyframes msi-go{0%{offset-distance:0px;opacity:0}0.5%{opacity:1}5%{offset-distance:130px;opacity:1}5.5%{offset-distance:130px;opacity:0}100%{offset-distance:130px;opacity:0}}
@keyframes msi-draw{0%{stroke-dashoffset:1;opacity:1}8%{stroke-dashoffset:0;opacity:1}86%{stroke-dashoffset:0;opacity:1}90%{stroke-dashoffset:0;opacity:0}100%{stroke-dashoffset:0;opacity:0}}
`;

const travel = (path: string, ms: number): CSSProperties => ({ offsetPath: `path("${path}")`, offsetRotate: '0deg', animationDelay: `${ms}ms` });

function Pulse({ x, y, path, ms, tone = ACCENT }: { x: number; y: number; path: string; ms: number; tone?: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className={GO} style={travel(path, ms)}>
        <circle r={2.4} fill={tone} />
        <circle r={5} fill={tone} fillOpacity={0.25} />
      </g>
    </g>
  );
}

function Active({ x, y, w, h, r = 8, ms, tone = ACCENT, hold = false, breathe = true }: { x: number; y: number; w: number; h: number; r?: number; ms: number; tone?: string; hold?: boolean; breathe?: boolean }) {
  return (
    <g className={`${hold ? DONE : ON} ${HID}`} style={delay(ms)}>
      <rect x={x} y={y} width={w} height={h} rx={r} fill={tone} fillOpacity={0.1} stroke={tone} strokeOpacity={0.9} strokeWidth={1.25} className={breathe ? ANIM.pulse : undefined} />
    </g>
  );
}

function Busy({ cx, cy, ms }: { cx: number; cy: number; ms: number }) {
  return (
    <g className={`${ON} ${HID}`} style={delay(ms)}>
      <circle cx={cx} cy={cy} r={3} fill={WHITE} className={ANIM.blink} />
    </g>
  );
}

function Bar({ x, y, w, h = 5, fill, o = 0.7, ms }: { x: number; y: number; w: number; h?: number; fill: string; o?: number; ms: number }) {
  return <line x1={x + h / 2} y1={y + h / 2} x2={x + w - h / 2} y2={y + h / 2} stroke={fill} strokeOpacity={o} strokeWidth={h} strokeLinecap="round" pathLength={1} className={DRAW} style={delay(ms)} />;
}

function Check({ x, y, tone = GREEN }: { x: number; y: number; tone?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={6} fill={tone} fillOpacity={0.14} stroke={tone} strokeOpacity={0.6} strokeWidth={1.25} />
      <path d={`M${x - 3} ${y}l2 2.5 4.5-5`} fill="none" stroke={tone} strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

function Cylinder({ cx, top, w = 64, h = 40, tone = ACCENT, strokeOpacity = 0.5, fill = NODE_FILL, fillOpacity = 1 }: { cx: number; top: number; w?: number; h?: number; tone?: string; strokeOpacity?: number; fill?: string; fillOpacity?: number }) {
  const rx = w / 2;
  return (
    <g fill={fill} fillOpacity={fillOpacity} stroke={tone} strokeOpacity={strokeOpacity} strokeWidth={1.25}>
      <path d={`M${cx - rx} ${top}v${h}q${rx} 12 ${w} 0V${top}`} />
      <ellipse cx={cx} cy={top} rx={rx} ry={6} />
    </g>
  );
}

function Tile({ x, y, size = 30, tone = ACCENT }: { x: number; y: number; size?: number; tone?: string }) {
  const c = size / 3;
  const shade = [0.15, 0.5, 0.3, 0.6, 0.25, 0.45, 0.2, 0.55, 0.35];
  return (
    <g>
      {shade.map((o, i) => <rect key={i} x={x + (i % 3) * c} y={y + Math.floor(i / 3) * c} width={c - 1} height={c - 1} fill={tone} fillOpacity={o} />)}
    </g>
  );
}

const Cover: CoverComponent = ({ uid, title, className }) => (
  <CoverFrame uid={uid} title={title} className={className} glow={[328, 168, 220]}>
    <style>{STYLE}</style>
    <text {...caption} x={40} y={44}>Deployment layer</text>
    <text {...caption} x={600} y={44} textAnchor="end">Every row carries a model version</text>

    <text {...caption} x={40} y={82}>On demand</text>
    <Panel x={40} y={92} w={96} h={48} stroke={ACCENT} strokeOpacity={0.5} />
    <text {...label} x={88} y={112} textAnchor="middle">Request</text>
    <text {...mono} x={88} y={128} textAnchor="middle" fill={TEXT_MUTED}>POST /infer</text>
    <Active x={40} y={92} w={96} h={48} ms={600} />
    <Edge d="M136 116H168" uid={uid} />
    <Pulse x={136} y={116} path="M0 0 L32 0" ms={900} />
    <Panel x={168} y={92} w={96} h={48} />
    <text {...label} x={216} y={112} textAnchor="middle">Validate</text>
    <text {...mono} x={216} y={128} textAnchor="middle" fill={TEXT_MUTED}>pydantic</text>
    <Active x={168} y={92} w={96} h={48} ms={1000} />
    <Edge d="M264 116C280 116 280 172 296 172" uid={uid} />
    <Pulse x={264} y={116} path="M0 0 C16 0 16 56 32 56" ms={1700} />

    <text {...caption} x={40} y={194}>Scheduled</text>
    <Panel x={40} y={204} w={96} h={48} stroke={AMBER} strokeOpacity={0.5} />
    <text {...label} x={88} y={224} textAnchor="middle">Tick</text>
    <text {...mono} x={88} y={240} textAnchor="middle" fill={TEXT_MUTED}>cron, Airflow</text>
    <Active x={40} y={204} w={96} h={48} ms={4600} tone={AMBER} />
    <Edge d="M136 228H168" uid={uid} />
    <Pulse x={136} y={228} path="M0 0 L32 0" ms={4900} tone={AMBER} />
    <Panel x={168} y={204} w={96} h={48} />
    <text {...label} x={216} y={224} textAnchor="middle">Discover</text>
    <text {...mono} x={216} y={240} textAnchor="middle" fill={TEXT_MUTED}>new scenes</text>
    <Active x={168} y={204} w={96} h={48} ms={5000} tone={AMBER} />
    <Edge d="M264 228C280 228 280 172 296 172" uid={uid} />
    <Pulse x={264} y={228} path="M0 0 C16 0 16 -56 32 -56" ms={5700} tone={AMBER} />

    <Panel x={296} y={132} w={120} h={80} stroke={ACCENT} strokeOpacity={0.5} />
    <circle cx={404} cy={144} r={3} fill={GREEN} />
    <text {...label} x={308} y={154}>ONNX Runtime</text>
    <text {...mono} x={308} y={172} fill={TEXT_MUTED}>warm session</text>
    <text {...mono} x={308} y={186} fill={TEXT_MUTED}>2 slots, 4 threads</text>
    <text {...caption} x={308} y={202}>one per process</text>
    <Active x={296} y={132} w={120} h={80} ms={2100} />
    <Active x={296} y={132} w={120} h={80} ms={6100} tone={AMBER} />
    <Busy cx={404} cy={144} ms={2100} />
    <Busy cx={404} cy={144} ms={6100} />
    <Edge d="M356 236V212" uid={uid} dashed />
    <Pulse x={356} y={236} path="M0 0 L0 -24" ms={0} tone={GREEN} />
    <Panel x={296} y={236} w={120} h={40} />
    <text {...caption} x={308} y={252} fill={TEXT}>MLflow alias</text>
    <text {...mono} x={308} y={268} fill={GREEN}>production: v7</text>
    <Active x={296} y={236} w={120} h={40} ms={0} tone={GREEN} breathe={false} />

    <Edge d="M416 172C432 172 432 116 456 116" uid={uid} />
    <Pulse x={416} y={172} path="M0 0 C16 0 16 -56 40 -56" ms={3600} tone={GREEN} />
    <Panel x={456} y={92} w={104} h={48} />
    <text {...label} x={508} y={112} textAnchor="middle">Response</text>
    <text {...mono} x={508} y={128} textAnchor="middle" fill={TEXT_MUTED}>200, version</text>
    <Active x={456} y={92} w={104} h={48} ms={4000} tone={GREEN} hold breathe={false} />

    <Edge d="M416 172C432 172 432 228 456 228" uid={uid} />
    <Pulse x={416} y={172} path="M0 0 C16 0 16 56 40 56" ms={7600} tone={GREEN} />
    <Cylinder cx={508} top={210} w={104} h={36} />
    <text {...label} x={508} y={232} textAnchor="middle">PostGIS</text>
    <text {...caption} x={508} y={266} textAnchor="middle">versioned rows, run log</text>
    <g className={`${DONE} ${HID}`} style={delay(8000)}>
      <Cylinder cx={508} top={210} w={104} h={36} tone={GREEN} strokeOpacity={0.9} fill={GREEN} fillOpacity={0.08} />
    </g>

    <Tag x={40} y={310} text="ONNX parity gate" tone="accent" />
    <Tag x={150} y={310} text="Bounded concurrency" />
    <Tag x={278} y={310} text="Idempotent runs" tone="green" />
    <Tag x={386} y={310} text="Drift flagged" tone="amber" />
  </CoverFrame>
);

const ExportParity: CoverComponent = ({ uid, title, className }) => {
  const widths = [64, 40, 52];
  const wrong = [64, 55, 36];
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[320, 168, 220]}>
      <style>{STYLE}</style>
      <text {...caption} x={32} y={44}>Same inputs, two runtimes</text>
      <text {...caption} x={608} y={44} textAnchor="end">Gate before registration</text>

      <Panel x={32} y={148} w={96} h={64} />
      <Tile x={44} y={160} size={30} />
      <text {...caption} x={82} y={174}>held-out</text>
      <text {...caption} x={82} y={186}>tiles</text>
      <Active x={32} y={148} w={96} h={64} ms={0} breathe={false} />
      <Edge d="M128 180C152 180 152 108 168 108" uid={uid} />
      <Edge d="M128 180C152 180 152 252 168 252" uid={uid} />
      <Pulse x={128} y={180} path="M0 0 C24 0 24 -72 40 -72" ms={200} />
      <Pulse x={128} y={180} path="M0 0 C24 0 24 72 40 72" ms={1500} tone={AMBER} />
      <Pulse x={128} y={180} path="M0 0 C24 0 24 72 40 72" ms={6800} tone={AMBER} />

      <Panel x={168} y={80} w={128} h={56} />
      <text {...label} x={180} y={100}>PyTorch</text>
      <text {...mono} x={180} y={116} fill={TEXT_MUTED}>model.eval()</text>
      <text {...caption} x={180} y={129}>reference logits</text>
      {widths.map((w, i) => <Bar key={i} x={252} y={94 + i * 12} w={w * 0.6} fill={ACCENT} ms={600 + i * 120} />)}
      <Active x={168} y={80} w={128} h={56} ms={600} />

      <Edge d="M232 136V224" uid={uid} dashed />
      <Pulse x={232} y={136} path="M0 0 L0 88" ms={1000} />
      <Pulse x={232} y={136} path="M0 0 L0 88" ms={6300} />
      <text {...mono} x={240} y={172} fill={ACCENT}>export, opset 17</text>
      <text {...caption} x={240} y={186}>dynamic axes</text>
      <text {...mono} x={240} y={172} fill={WHITE} className={`${ON} ${HID}`} style={delay(1000)}>export, opset 17</text>
      <text {...mono} x={240} y={172} fill={WHITE} className={`${ON} ${HID}`} style={delay(6300)}>export, opset 17</text>

      <Panel x={168} y={224} w={128} h={56} />
      <text {...label} x={180} y={244}>ONNX Runtime</text>
      <text {...mono} x={180} y={260} fill={TEXT_MUTED}>CPU provider</text>
      <text {...caption} x={180} y={273}>exported logits</text>
      <g className={`${DONE} ${HID}`} style={delay(1900)}>
        {wrong.map((w, i) => <Bar key={i} x={252} y={238 + i * 12} w={w * 0.6} fill={ROSE} ms={1900 + i * 120} />)}
      </g>
      <g className={DONE} style={delay(7200)}>
        {widths.map((w, i) => <Bar key={i} x={252} y={238 + i * 12} w={w * 0.6} fill={AMBER} ms={7200 + i * 120} />)}
      </g>
      <Active x={168} y={224} w={128} h={56} ms={1400} tone={AMBER} />
      <Active x={168} y={224} w={128} h={56} ms={6700} tone={AMBER} />

      <Edge d="M296 108C320 108 320 160 336 160" uid={uid} />
      <Edge d="M296 252C320 252 320 200 336 200" uid={uid} />
      <Pulse x={296} y={108} path="M0 0 C24 0 24 52 40 52" ms={3000} />
      <Pulse x={296} y={252} path="M0 0 C24 0 24 -52 40 -52" ms={3000} tone={AMBER} />
      <Pulse x={296} y={108} path="M0 0 C24 0 24 52 40 52" ms={8400} />
      <Pulse x={296} y={252} path="M0 0 C24 0 24 -52 40 -52" ms={8400} tone={AMBER} />

      <Panel x={336} y={132} w={144} h={96} stroke={ACCENT} strokeOpacity={0.5} />
      <circle cx={468} cy={144} r={3} fill={GREEN} />
      <text {...label} x={348} y={154}>Parity gate</text>
      <text {...mono} x={348} y={174} fill={TEXT_MUTED}>allclose 1e-4, 1e-3</text>
      <text {...mono} x={348} y={190} fill={TEXT_MUTED}>argmax agree 0.999</text>
      <text {...mono} x={348} y={206} fill={TEXT_MUTED}>max_abs logged</text>
      <text {...caption} x={348} y={220}>per model, per export</text>
      <Active x={336} y={132} w={144} h={96} ms={3300} />
      <Active x={336} y={132} w={144} h={96} ms={8700} />
      <Busy cx={468} cy={144} ms={3300} />
      <Busy cx={468} cy={144} ms={8700} />

      <Edge d="M480 160C500 160 500 116 520 116" uid={uid} />
      <Edge d="M480 200C500 200 500 244 520 244" uid={uid} dashed />
      <Pulse x={480} y={200} path="M0 0 C20 0 20 44 40 44" ms={4700} tone={ROSE} />
      <Pulse x={480} y={160} path="M0 0 C20 0 20 -44 40 -44" ms={10000} tone={GREEN} />

      <Panel x={520} y={88} w={88} h={56} stroke={GREEN} strokeOpacity={0.5} />
      <g className={ON} style={delay(10300)}>
        <Check x={534} y={104} />
      </g>
      <text {...label} x={546} y={108}>Register</text>
      <text {...caption} x={532} y={126}>MLflow run with</text>
      <text {...caption} x={532} y={138}>parity metrics</text>
      <Active x={520} y={88} w={88} h={56} ms={10300} tone={GREEN} breathe={false} />

      <Panel x={520} y={216} w={88} h={68} stroke={ROSE} strokeOpacity={0.4} />
      <text {...label} x={532} y={234} fill={ROSE}>Fix export</text>
      <text {...caption} x={532} y={250}>align_corners</text>
      <text {...caption} x={532} y={262}>batch norm mode</text>
      <text {...caption} x={532} y={274}>baked shapes</text>
      <Active x={520} y={216} w={88} h={68} ms={5000} tone={ROSE} />

      <Tag x={32} y={320} text="Dynamic batch, height, width" tone="accent" />
      <Tag x={214} y={320} text="Logits under tolerance" />
      <Tag x={364} y={320} text="Argmax maps must agree" tone="green" />
    </CoverFrame>
  );
};

const RequestPath: CoverComponent = ({ uid, title, className }) => (
  <CoverFrame uid={uid} title={title} className={className} glow={[320, 168, 220]}>
    <style>{STYLE}</style>
    <text {...caption} x={32} y={44}>Request path</text>
    <text {...caption} x={608} y={44} textAnchor="end">Health reports the loaded version</text>

    <Panel x={32} y={132} w={80} h={64} stroke={ACCENT} strokeOpacity={0.5} />
    <text {...label} x={72} y={154} textAnchor="middle">Request</text>
    <text {...mono} x={72} y={170} textAnchor="middle" fill={TEXT_MUTED}>/infer/tile</text>
    <text {...caption} x={72} y={186} textAnchor="middle">bbox, crs, size</text>
    <Active x={32} y={132} w={80} h={64} ms={0} breathe={false} />
    <Active x={32} y={132} w={80} h={64} ms={2000} breathe={false} />
    <Active x={32} y={132} w={80} h={64} ms={6400} breathe={false} />
    <Edge d="M112 164H136" uid={uid} />
    <Pulse x={112} y={164} path="M0 0 L24 0" ms={400} />
    <Pulse x={112} y={164} path="M0 0 L24 0" ms={2400} />
    <Pulse x={112} y={164} path="M0 0 L24 0" ms={6800} />

    <Panel x={136} y={132} w={88} h={64} />
    <text {...label} x={180} y={154} textAnchor="middle">Validate</text>
    <text {...mono} x={180} y={170} textAnchor="middle" fill={TEXT_MUTED}>pydantic</text>
    <text {...caption} x={180} y={186} textAnchor="middle">CRS, area cap</text>
    <Active x={136} y={132} w={88} h={64} ms={500} />
    <Active x={136} y={132} w={88} h={64} ms={2500} />
    <Active x={136} y={132} w={88} h={64} ms={6900} />
    <Edge d="M224 164H248" uid={uid} />
    <Pulse x={224} y={164} path="M0 0 L24 0" ms={1300} />
    <Pulse x={224} y={164} path="M0 0 L24 0" ms={3000} />
    <Edge d="M180 196V240" uid={uid} dashed />
    <Pulse x={180} y={196} path="M0 0 L0 44" ms={7600} tone={ROSE} />
    <Panel x={136} y={240} w={88} h={36} stroke={ROSE} strokeOpacity={0.4} />
    <text {...mono} x={180} y={255} textAnchor="middle" fill={ROSE}>422</text>
    <text {...caption} x={180} y={268} textAnchor="middle">which field</text>
    <Active x={136} y={240} w={88} h={36} ms={7800} tone={ROSE} breathe={false} />

    <Panel x={248} y={116} w={104} h={96} />
    <text {...label} x={300} y={136} textAnchor="middle">Slots</text>
    <text {...mono} x={300} y={150} textAnchor="middle" fill={TEXT_MUTED}>Semaphore(2)</text>
    <rect x={262} y={160} width={34} height={22} rx={4} fill={ACCENT} fillOpacity={0.3} stroke={ACCENT} strokeOpacity={0.6} className={ANIM.pulse} />
    <rect x={304} y={160} width={34} height={22} rx={4} fill="none" stroke={LINE} strokeDasharray="3 3" />
    <text {...caption} x={279} y={175} textAnchor="middle" fill={WHITE}>busy</text>
    <text {...caption} x={321} y={175} textAnchor="middle">free</text>
    <g className={`${ON} ${HID}`} style={delay(1500)}>
      <rect x={303} y={159} width={36} height={24} rx={5} fill={NODE_FILL} />
      <rect x={304} y={160} width={34} height={22} rx={4} fill={ACCENT} fillOpacity={0.3} stroke={ACCENT} strokeOpacity={0.6} />
      <text {...caption} x={321} y={175} textAnchor="middle" fill={WHITE}>busy</text>
    </g>
    <text {...caption} x={300} y={200} textAnchor="middle">take one or reject</text>
    <Active x={248} y={116} w={104} h={96} ms={1400} breathe={false} />
    <Active x={248} y={116} w={104} h={96} ms={3100} breathe={false} />
    <Edge d="M352 164H376" uid={uid} />
    <Pulse x={352} y={164} path="M0 0 L24 0" ms={1900} />
    <Edge d="M300 212V240" uid={uid} dashed />
    <Pulse x={300} y={212} path="M0 0 L0 28" ms={3300} tone={ROSE} />
    <Panel x={248} y={240} w={104} h={36} stroke={ROSE} strokeOpacity={0.4} />
    <text {...mono} x={300} y={255} textAnchor="middle" fill={ROSE}>503</text>
    <text {...caption} x={300} y={268} textAnchor="middle">retry later</text>
    <Active x={248} y={240} w={104} h={36} ms={3400} tone={ROSE} breathe={false} />

    <Panel x={376} y={116} w={104} h={96} stroke={ACCENT} strokeOpacity={0.5} />
    <circle cx={468} cy={128} r={3} fill={GREEN} />
    <text {...label} x={388} y={138}>ONNX session</text>
    <text {...mono} x={388} y={156} fill={TEXT_MUTED}>warm at start</text>
    <text {...mono} x={388} y={170} fill={TEXT_MUTED}>intra-op 4</text>
    <text {...mono} x={388} y={184} fill={TEXT_MUTED}>IO binding</text>
    <text {...caption} x={388} y={202}>worker thread</text>
    <g transform="translate(462 182)">
      <g className={ON} style={delay(2000)}>
        <g className={ANIM.spin}>
          <circle r={7} fill="none" stroke={ACCENT} strokeOpacity={0.5} strokeWidth={2} strokeDasharray="11 33" />
        </g>
      </g>
    </g>
    <Active x={376} y={116} w={104} h={96} ms={2000} />
    <Busy cx={468} cy={128} ms={2000} />
    <Edge d="M480 164H504" uid={uid} />
    <Pulse x={480} y={164} path="M0 0 L24 0" ms={3500} tone={GREEN} />

    <Panel x={504} y={132} w={104} h={64} stroke={GREEN} strokeOpacity={0.5} />
    <text {...label} x={556} y={154} textAnchor="middle">Response</text>
    <text {...mono} x={556} y={170} textAnchor="middle" fill={TEXT_MUTED}>200, logits</text>
    <text {...caption} x={556} y={186} textAnchor="middle">version header</text>
    <Active x={504} y={132} w={104} h={64} ms={3600} tone={GREEN} hold breathe={false} />

    <Tag x={32} y={316} text="Reject, do not queue" tone="rose" />
    <Tag x={162} y={316} text="One session per process" tone="accent" />
    <Tag x={314} y={316} text="Event loop never blocks" />
  </CoverFrame>
);

const JobLoop: CoverComponent = ({ uid, title, className }) => (
  <CoverFrame uid={uid} title={title} className={className} glow={[320, 168, 220]}>
    <style>{STYLE}</style>
    <text {...caption} x={32} y={44}>Each tick</text>
    <text {...caption} x={608} y={44} textAnchor="end">Promotion moves the alias</text>

    <Panel x={32} y={84} w={88} h={48} stroke={AMBER} strokeOpacity={0.5} />
    <text {...label} x={76} y={104} textAnchor="middle">Tick</text>
    <text {...mono} x={76} y={120} textAnchor="middle" fill={TEXT_MUTED}>cron, DAG</text>
    <Active x={32} y={84} w={88} h={48} ms={0} tone={AMBER} breathe={false} />
    <Edge d="M120 108H152" uid={uid} />
    <Pulse x={120} y={108} path="M0 0 L32 0" ms={300} tone={AMBER} />

    <Panel x={152} y={84} w={104} h={48} />
    <text {...label} x={204} y={104} textAnchor="middle">Discover</text>
    <text {...caption} x={204} y={120} textAnchor="middle">new scenes over AOIs</text>
    <Active x={152} y={84} w={104} h={48} ms={500} tone={AMBER} />
    <Edge d="M256 108H288" uid={uid} />
    <Pulse x={256} y={108} path="M0 0 L32 0" ms={1200} tone={AMBER} />

    <Panel x={288} y={72} w={120} h={72} stroke={ACCENT} strokeOpacity={0.5} />
    <text {...label} x={300} y={92}>Claim by key</text>
    <text {...mono} x={300} y={108} fill={TEXT_MUTED}>sha256(model, v,</text>
    <text {...mono} x={300} y={120} fill={TEXT_MUTED}>scene, aoi, params)</text>
    <text {...caption} x={300} y={136}>on conflict do nothing</text>
    <Active x={288} y={72} w={120} h={72} ms={1400} />
    <Edge d="M348 72V58" uid={uid} dashed />
    <Pulse x={348} y={72} path="M0 0 L0 -14" ms={2000} tone={TEXT_MUTED} />
    <text {...caption} x={348} y={52} textAnchor="middle" fill={TEXT_MUTED}>conflict: already done, skip</text>
    <text {...caption} x={348} y={52} textAnchor="middle" fill={AMBER} className={`${ON} ${HID}`} style={delay(2100)}>conflict: already done, skip</text>
    <Edge d="M408 108H440" uid={uid} />
    <Pulse x={408} y={108} path="M0 0 L32 0" ms={2600} />

    <Panel x={440} y={84} w={88} h={48} />
    <text {...label} x={484} y={104} textAnchor="middle">Run model</text>
    <text {...mono} x={484} y={120} textAnchor="middle" fill={GREEN}>v7 via alias</text>
    <Active x={440} y={84} w={88} h={48} ms={2800} />
    <Active x={440} y={84} w={88} h={48} ms={4400} />
    <Edge d="M528 96C556 88 556 128 528 120" uid={uid} dashed />
    <Pulse x={528} y={96} path="M0 0 C28 -8 28 32 0 24" ms={3800} tone={AMBER} />
    <text {...caption} x={562} y={111} fill={AMBER}>retry x4</text>
    <text {...caption} x={562} y={123} fill={AMBER}>backoff x2</text>
    <g className={`${ON} ${HID}`} style={delay(4100)}>
      <text {...caption} x={562} y={111} fill={WHITE}>retry x4</text>
      <text {...caption} x={562} y={123} fill={WHITE}>backoff x2</text>
    </g>
    <Edge d="M484 132V196" uid={uid} />
    <Pulse x={484} y={132} path="M0 0 L0 64" ms={5900} tone={GREEN} />

    <Cylinder cx={484} top={200} w={88} h={32} />
    <text {...label} x={484} y={221} textAnchor="middle">PostGIS</text>
    <g className={`${DONE} ${HID}`} style={delay(6200)}>
      <Cylinder cx={484} top={200} w={88} h={32} tone={GREEN} strokeOpacity={0.9} fill={GREEN} fillOpacity={0.08} />
    </g>
    <text {...caption} x={484} y={262} textAnchor="middle">version on every row</text>
    <text {...caption} x={484} y={274} textAnchor="middle">run row: status, attempts</text>
    <text {...caption} x={484} y={262} textAnchor="middle" fill={GREEN} className={`${DONE} ${HID}`} style={delay(6300)}>version on every row</text>

    <Edge d="M528 216H560V290H76V132" uid={uid} />
    <g className={`${ON} ${HID}`} style={delay(9600)}>
      <path d="M528 216H560V290H76V132" fill="none" stroke={AMBER} strokeOpacity={0.8} strokeWidth={1.5} pathLength={1} className={DRAW} style={delay(9600)} />
    </g>
    <text {...caption} x={318} y={303} textAnchor="middle">next tick, pending rows older than a run are reclaimed</text>
    <text {...caption} x={318} y={303} textAnchor="middle" fill={AMBER} className={`${ON} ${HID}`} style={delay(9800)}>next tick, pending rows older than a run are reclaimed</text>

    <Panel x={176} y={184} w={136} h={80} />
    <text {...label} x={188} y={202}>MLflow registry</text>
    <text {...mono} x={188} y={224} fill={GREEN}>production  v7</text>
    <text {...mono} x={188} y={240} fill={AMBER}>candidate   v8</text>
    <text {...caption} x={188} y={256}>shadow run, then move alias</text>
    <Active x={176} y={184} w={136} h={80} ms={1000} tone={GREEN} breathe={false} />
    <Edge d="M244 184C244 164 348 164 348 144" uid={uid} dashed />
    <Pulse x={244} y={184} path="M0 0 C0 -20 104 -20 104 -40" ms={1000} tone={GREEN} />

    <Tag x={32} y={330} text="Idempotency key" tone="accent" />
    <Tag x={146} y={330} text="Pending rows reclaimed" />
    <Tag x={293} y={330} text="Rollback: alias back" tone="rose" />
  </CoverFrame>
);

export const COVER: CoverComponent = Cover;

export const FIGURES: Record<string, CoverComponent> = {
  'model-serving-scheduled-inference/export-parity': ExportParity,
  'model-serving-scheduled-inference/request-path': RequestPath,
  'model-serving-scheduled-inference/job-loop': JobLoop,
};
