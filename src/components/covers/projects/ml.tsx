'use client';
import type { CoverComponent } from '../shared';
import { ACCENT, ACCENT_DEEP, AMBER, ANIM, CoverFrame, Edge, GREEN, LINE, LINE_SOFT, NODE_FILL, NODE_FILL_2, Panel, ROSE, TEXT, TEXT_MUTED, Tag, caption, delay, label, mono } from '../shared';

const BRIGHT = '#f2f4f8';
const band = (x: number, y: number, w: number) => `M${x} ${y + 8}q0-8 8-8h${w - 16}q8 0 8 8v16H${x}z`;

/* Feature table -> three boosted trees -> sum -> yield bars; SHAP bars on the right. */
const FEATURES: [string, number][] = [['NDVI max', 56], ['NDVI mean', 40], ['Emergence', 32], ['Peak date', 48], ['Soil pH', 24], ['Rainfall', 44]];
const SHAP: [string, number, boolean][] = [['ndvi_max', 48, true], ['rainfall', 32, true], ['peak_doy', 24, false], ['soil_ph', 16, true]];
const YIELD = [40, 28, 48, 20, 36];

const CropYield: CoverComponent = ({ uid, title, className }) => (
  <CoverFrame uid={uid} title={title} className={className} glow={[320, 160, 180]}>
    <text {...caption} x="40" y="48">Feature table</text>
    <text {...caption} x="320" y="48" textAnchor="middle">Boosted trees</text>
    <text {...caption} x="600" y="48" textAnchor="end">SHAP values</text>

    <Panel x={40} y={64} w={168} h={176} />
    <path d={band(40, 64, 168)} fill={ACCENT} fillOpacity={0.12} />
    <text {...mono} x="52" y="80" fontSize={8} fill={TEXT}>field &times; season</text>
    {FEATURES.map(([name, w], i) => {
      const cy = 104 + i * 20;
      return (
        <g key={name}>
          {i > 0 && <path d={`M48 ${cy - 10}h152`} stroke={LINE_SOFT} />}
          <text {...mono} x="52" y={cy + 3} fontSize={8}>{name}</text>
          <rect x="136" y={cy - 2} width={w} height="4" rx="2" fill="#fff" fillOpacity={0.18} />
        </g>
      );
    })}
    <text {...mono} x="52" y="228" fontSize={8}>1,240 fields</text>

    <Edge d="M208 116h24" uid={uid} />
    <rect x="232" y="64" width="176" height="104" rx="10" fill="none" stroke={LINE} strokeWidth={1.25} strokeDasharray="4 4" />
    {[256, 320, 384].map((cx, t) => (
      <g key={cx} fill="none" stroke={LINE} strokeWidth={1.25}>
        <path d={`M${cx} 88l-12 28M${cx} 88l12 28M${cx - 12} 116l-6 28M${cx - 12} 116l6 28M${cx + 12} 116l-6 28M${cx + 12} 116l6 28`} />
        <circle cx={cx} cy="88" r="4" fill={NODE_FILL_2} stroke={ACCENT} strokeOpacity={0.7} />
        <circle cx={cx - 12} cy="116" r="3.5" fill={NODE_FILL} />
        <circle cx={cx + 12} cy="116" r="3.5" fill={NODE_FILL} />
        {[-18, -6, 6, 18].map((dx, k) => (
          <circle key={dx} cx={cx + dx} cy="144" r="2.5" stroke="none" fill={(k + t) % 2 ? ACCENT : LINE} fillOpacity={(k + t) % 2 ? 0.7 : 1} />
        ))}
      </g>
    ))}

    <Edge d="M320 168v20" uid={uid} />
    <circle cx="320" cy="200" r="12" fill={NODE_FILL_2} stroke={ACCENT} strokeOpacity={0.6} strokeWidth={1.25} />
    <text {...label} x="320" y="204" textAnchor="middle" fill={BRIGHT}>&Sigma;</text>
    <Edge d="M320 212v20" uid={uid} />

    <Panel x={232} y={232} w={176} h={88} />
    <text {...caption} x="244" y="248">Yield per field</text>
    <path d="M244 304h152" stroke={LINE_SOFT} />
    {YIELD.map((h, i) => (
      <rect key={i} x={248 + i * 32} y={304 - h} width="16" height={h} rx="2" fill={GREEN} fillOpacity={0.4 + i * 0.1} />
    ))}

    <Panel x={440} y={64} w={160} h={176} />
    <Tag x={452} y={80} text="SHAP" tone="accent" />
    <text {...mono} x="588" y="83" fontSize={8} textAnchor="end">impact</text>
    <path d="M544 100v100" stroke={LINE_SOFT} />
    {SHAP.map(([name, w, pos], i) => {
      const cy = 112 + i * 24;
      return (
        <g key={name}>
          <text {...mono} x="452" y={cy + 3} fontSize={8}>{name}</text>
          <rect
            x={pos ? 544 : 544 - w}
            y={cy - 4}
            width={w}
            height="8"
            rx="2"
            fill={pos ? ACCENT : ROSE}
            fillOpacity={0.8}
            className={ANIM.grow}
            style={{ ...delay(i * 120), transformOrigin: pos ? 'left center' : 'right center' }}
          />
        </g>
      );
    })}
    <Tag x={452} y={220} text="grouped CV" tone="green" />
  </CoverFrame>
);

/* Stacked band cards -> narrowing conv blocks -> FC -> class probability bars. */
const BANDS: [string, 'rose' | 'green' | 'accent' | 'amber', string][] = [['R', 'rose', ROSE], ['G', 'green', GREEN], ['B', 'accent', ACCENT], ['NIR', 'amber', AMBER]];
const CONV: [number, number, number, number, string][] = [[168, 112, 40, 80, '64 ch'], [240, 128, 32, 56, '128 ch'], [312, 136, 24, 40, '256 ch']];
const CLASSES: [string, number][] = [['cropland', 0.82], ['water', 0.06], ['urban', 0.04], ['forest', 0.08]];

const CnnLandcover: CoverComponent = ({ uid, title, className }) => (
  <CoverFrame uid={uid} title={title} className={className} glow={[280, 160, 180]}>
    <text {...caption} x="40" y="48">Multispectral patch</text>
    <text {...caption} x="600" y="48" textAnchor="end">Class probabilities</text>

    {BANDS.map(([, , color], i) => (
      <Panel key={i} x={48 + i * 8} y={96 + i * 8} w={64} h={64} r={6} stroke={color} strokeOpacity={0.55} />
    ))}
    {Array.from({ length: 16 }, (_, k) => {
      const r = k >> 2;
      const c = k & 3;
      return <rect key={k} x={80 + c * 12} y={128 + r * 12} width="10" height="10" rx="1.5" fill={(r * 3 + c * 5) % 4 < 2 ? GREEN : ACCENT} fillOpacity={0.25 + ((r + c) % 3) * 0.15} />;
    })}
    {BANDS.map(([name, tone], i) => <Tag key={name} x={48 + i * 24} y={208} text={name} tone={tone} />)}

    <Edge d="M136 152h24" uid={uid} />
    <text {...caption} x="256" y="88" textAnchor="middle">ResNet backbone</text>
    {CONV.map(([x, y, w, h, ch], b) => (
      <g key={ch}>
        {Array.from({ length: b + 2 }, (_, s) => (
          <Panel key={s} x={x + s * 4} y={y - s * 4} w={w} h={h} r={3} fill={NODE_FILL_2} className={b === 1 && s === 2 ? ANIM.pulse : undefined} />
        ))}
        <text {...mono} x={x + w / 2 + (b + 1) * 2} y="216" fontSize={8} textAnchor="middle">{ch}</text>
      </g>
    ))}
    <Edge d="M216 152h20" uid={uid} />
    <Edge d="M284 152h24" uid={uid} />
    <Edge d="M352 152h20" uid={uid} />
    <Panel x={376} y={136} w={40} h={32} stroke={ACCENT} strokeOpacity={0.5} />
    <text {...label} x="396" y="156" textAnchor="middle" fill={BRIGHT}>FC</text>
    <Edge d="M416 152h20" uid={uid} />
    <Tag x={168} y={248} text="4-band stem" tone="amber" />
    <Tag x={256} y={248} text="focal loss" tone="rose" />
    <Tag x={336} y={248} text="ImageNet init" />

    <Panel x={440} y={64} w={160} h={176} />
    <Tag x={452} y={76} text="softmax" tone="accent" />
    {CLASSES.map(([name, p], i) => {
      const y = 104 + i * 32;
      const top = i === 0;
      return (
        <g key={name}>
          <text {...mono} x="452" y={y} fontSize={8} fill={top ? BRIGHT : TEXT_MUTED}>{name}</text>
          <text {...mono} x="588" y={y} fontSize={8} textAnchor="end" fill={top ? ACCENT : TEXT_MUTED}>{p.toFixed(2)}</text>
          <rect x="452" y={y + 6} width="136" height="6" rx="3" fill="#fff" fillOpacity={0.06} />
          <rect x="452" y={y + 6} width={136 * p} height="6" rx="3" fill={top ? ACCENT : TEXT_MUTED} fillOpacity={top ? 0.9 : 0.6} />
        </g>
      );
    })}
    <text {...caption} x="452" y="232">per-class metrics</text>
  </CoverFrame>
);

/* NDVI curve with stage markers -> unrolled LSTM cells -> reconstruction-error strip with one spike. */
const NDVI = [176, 174, 168, 152, 128, 108, 96, 100, 112, 132, 152, 166, 174];
const STAGES: [number, string, 'green' | 'amber' | 'rose', string][] = [[3, 'emergence', 'green', GREEN], [6, 'peak', 'amber', AMBER], [10, 'senescence', 'rose', ROSE]];
const ERR = [8, 10, 6, 12, 8, 10, 48, 12, 8, 6, 10];

const LstmPhenology: CoverComponent = ({ uid, title, className }) => (
  <CoverFrame uid={uid} title={title} className={className} glow={[200, 176, 180]}>
    <text {...caption} x="40" y="48">NDVI sequence</text>
    <text {...caption} x="600" y="48" textAnchor="end">Reconstruction error</text>

    <Panel x={40} y={64} w={272} h={136} />
    <path d="M56 184h240" stroke={LINE_SOFT} />
    <path d={`M${NDVI.map((y, i) => `${56 + i * 20} ${y}`).join('L')}`} fill="none" stroke={GREEN} strokeOpacity={0.85} strokeWidth={1.5} strokeLinejoin="round" />
    {STAGES.map(([i, name, tone, color]) => {
      const x = 56 + i * 20;
      const y = NDVI[i] ?? 176;
      return (
        <g key={name}>
          <path d={`M${x} ${y + 6}V184`} stroke={color} strokeOpacity={0.4} strokeDasharray="2 3" />
          <circle cx={x} cy={y} r="3.5" fill={color} className={i === 6 ? ANIM.pulse : undefined} />
          <Tag x={x - (name.length * 5.6 + 12) / 2} y={80} text={name} tone={tone} />
        </g>
      );
    })}
    <text {...mono} x="56" y="195" fontSize={8}>day 0</text>
    <text {...mono} x="296" y="195" fontSize={8} textAnchor="end">day 240</text>

    <Edge d="M32 252H336" uid={uid} dashed className={ANIM.flow} />
    {[48, 120, 192, 264].map((x) => (
      <g key={x}>
        <Edge d={`M${x + 20} 208v16`} uid={uid} />
        <Panel x={x} y={232} w={40} h={40} fill={NODE_FILL_2} stroke={ACCENT} strokeOpacity={0.5} />
        <text {...mono} x={x + 20} y="256" fontSize={8} textAnchor="middle" fill={BRIGHT}>LSTM</text>
      </g>
    ))}
    <text {...mono} x="320" y="244" fontSize={8} textAnchor="middle">h(t)</text>
    <text {...caption} x="40" y="304">Bi-LSTM autoencoder</text>
    <Tag x={344} y={304} text="per-field" />
    <Tag x={416} y={304} text="MLflow" tone="accent" />

    <Panel x={344} y={64} w={256} h={208} />
    <path d="M360 208h224" stroke={LINE_SOFT} />
    <path d="M360 176h224" stroke={ROSE} strokeOpacity={0.4} strokeDasharray="3 3" />
    <text {...mono} x="584" y="171" fontSize={8} textAnchor="end" fill={ROSE} fillOpacity={0.8}>threshold</text>
    {ERR.map((h, i) => {
      const hot = i === 6;
      return <rect key={i} x={360 + i * 20} y={208 - h} width="16" height={h} rx="2" fill={hot ? ROSE : ACCENT} fillOpacity={hot ? 0.9 : 0.45} className={hot ? ANIM.pulse : undefined} />;
    })}
    <Tag x={462} y={140} text="anomaly" tone="rose" />
    <text {...caption} x="472" y="240" textAnchor="middle">irrigation gap</text>
    <text {...caption} x="472" y="256" fontSize={8} textAnchor="middle">trajectory departs pattern</text>
  </CoverFrame>
);

/* Cron clock -> imagery inbox -> FastAPI container with ONNX chip -> PostGIS -> run log -> back to the clock. */
const LOG: [string, string, string, string, boolean][] = [
  ['02:00', 'pull imagery', 'ok', GREEN, false],
  ['02:04', 'segment AOI', 'ok', GREEN, false],
  ['02:11', 'write PostGIS', 'running', ACCENT, true],
];

const MlopsInference: CoverComponent = ({ uid, title, className }) => (
  <CoverFrame uid={uid} title={title} className={className} glow={[320, 176, 200]}>
    <text {...caption} x="40" y="48">Scheduled inference</text>
    <text {...caption} x="600" y="48" textAnchor="end">Model serving</text>

    <Tag x={56} y={64} text="scheduler" />
    <circle cx="88" cy="112" r="24" fill={NODE_FILL} stroke={LINE} strokeWidth={1.25} />
    <path d="M88 92v4M108 112h-4M88 132v-4M68 112h4" stroke={LINE} strokeWidth={1.25} />
    <g className={ANIM.spin}>
      <circle cx="88" cy="112" r="18" fill="none" />
      <path d="M88 112v-12M88 112h10" stroke={TEXT} strokeWidth={1.5} strokeLinecap="round" />
    </g>
    <circle cx="88" cy="112" r="1.5" fill={TEXT} />
    <Edge d="M112 112h32" uid={uid} />

    {[0, 1, 2].map((i) => <Panel key={i} x={152 + i * 8} y={88 + i * 8} w={48} h={40} r={4} />)}
    {Array.from({ length: 12 }, (_, k) => {
      const r = Math.floor(k / 4);
      const c = k % 4;
      return <rect key={k} x={176 + c * 10} y={112 + r * 8} width="8" height="6" rx="1" fill={(r + c) % 3 ? GREEN : ACCENT} fillOpacity={0.3 + ((r * 2 + c) % 3) * 0.15} />;
    })}
    <Tag x={152} y={160} text="new imagery" tone="green" />
    <Edge d="M216 124h24" uid={uid} />

    <Panel x={248} y={72} w={144} h={104} />
    <path d={band(248, 72, 144)} fill={ACCENT} fillOpacity={0.12} />
    <text {...mono} x="260" y="84" fontSize={8} fill={TEXT}>docker</text>
    <text {...mono} x="380" y="84" fontSize={8} fill={TEXT} textAnchor="end">v3.2</text>
    <text {...label} x="320" y="108" textAnchor="middle">FastAPI</text>
    <rect x="288" y="120" width="64" height="24" rx="4" fill={ACCENT} fillOpacity={0.16} stroke={ACCENT} strokeOpacity={0.6} strokeWidth={1.25} />
    <path d="M282 128h6M282 136h6M352 128h6M352 136h6" stroke={ACCENT} strokeOpacity={0.6} strokeWidth={1.25} />
    <text {...mono} x="320" y="136" fontSize={8} textAnchor="middle" fill={BRIGHT}>ONNX runtime</text>
    <text {...mono} x="320" y="164" fontSize={8} textAnchor="middle">POST /infer</text>
    <Edge d="M392 112h40" uid={uid} />

    <path d="M440 96v48q32 14 64 0V96" fill={NODE_FILL} stroke={ACCENT} strokeOpacity={0.45} strokeWidth={1.25} />
    <ellipse cx="472" cy="96" rx="32" ry="8" fill={NODE_FILL_2} stroke={ACCENT} strokeOpacity={0.45} strokeWidth={1.25} />
    <text {...label} x="472" y="176" textAnchor="middle">PostGIS</text>
    <Edge d="M472 184v24" uid={uid} />

    <Panel x={248} y={216} w={352} h={96} />
    <path d={band(248, 216, 352)} fill={ACCENT} fillOpacity={0.12} />
    <text {...caption} x="260" y="228" fill={TEXT}>run log</text>
    <text {...mono} x="588" y="228" fontSize={8} textAnchor="end">mlflow</text>
    {LOG.map(([t, msg, status, color, live], i) => {
      const y = 256 + i * 20;
      return (
        <g key={t}>
          <circle cx="264" cy={y - 3} r="2.5" fill={color} className={live ? ANIM.blink : undefined} />
          <text {...mono} x="276" y={y} fontSize={8}>{t}</text>
          <text {...mono} x="316" y={y} fontSize={8} fill={TEXT}>{msg}</text>
          <text {...mono} x="588" y={y} fontSize={8} textAnchor="end" fill={color}>{status}</text>
        </g>
      );
    })}
    <Tag x={120} y={264} text="drift check" tone="amber" />
    <Edge d="M248 280H88V144" uid={uid} dashed className={ANIM.flow} />
  </CoverFrame>
);

/* Mic + waveform -> STT -> router hub -> three skills; memory disc below, TTS back out to a speaker. */
const SKILLS: [string, string, number][] = [['Automation', 'selenium', 72], ['Web', 'requests', 144], ['Vision', 'opencv', 216]];
const WAVE = [8, 20, 32, 16, 40, 24, 12, 28];

const skillGlyph = (k: number, y: number) =>
  k === 0 ? (
    <path d={`M492 ${y + 12}h8v8h-8zM496 ${y + 8}v4M496 ${y + 20}v4M488 ${y + 16}h4M500 ${y + 16}h4`} />
  ) : k === 1 ? (
    <>
      <circle cx="496" cy={y + 16} r="5" />
      <ellipse cx="496" cy={y + 16} rx="2" ry="5" />
      <path d={`M491 ${y + 16}h10`} />
    </>
  ) : (
    <>
      <path d={`M489 ${y + 16}q7-8 14 0q-7 8-14 0z`} />
      <circle cx="496" cy={y + 16} r="1.8" fill={ACCENT} />
    </>
  );

const Jarvis: CoverComponent = ({ uid, title, className }) => (
  <CoverFrame uid={uid} title={title} className={className} glow={[352, 160, 190]}>
    <text {...caption} x="40" y="48">Voice pipeline</text>
    <text {...caption} x="600" y="48" textAnchor="end">Skills</text>

    <text {...caption} x="72" y="112" textAnchor="middle">Listen</text>
    <rect x="64" y="128" width="16" height="32" rx="8" fill={NODE_FILL_2} stroke={ACCENT} strokeOpacity={0.7} strokeWidth={1.25} />
    <path d="M56 156a16 16 0 0 0 32 0M72 172v12M64 184h16" fill="none" stroke={LINE} strokeWidth={1.25} strokeLinecap="round" />
    <g className={ANIM.pulse}>
      {WAVE.map((h, i) => <rect key={i} x={104 + i * 8} y={160 - h / 2} width="4" height={h} rx="2" fill={ACCENT} fillOpacity={0.7} />)}
    </g>
    <Edge d="M168 160h24" uid={uid} />
    <Panel x={200} y={136} w={72} h={48} stroke={ACCENT} strokeOpacity={0.5} />
    <text {...label} x="236" y="158" textAnchor="middle" fill={BRIGHT}>STT</text>
    <text {...mono} x="236" y="174" fontSize={8} textAnchor="middle">speech&rarr;text</text>
    <Edge d="M272 160h32" uid={uid} />

    <g fill="none" stroke={LINE} strokeWidth={1.25} strokeDasharray="4 4" className={ANIM.flow}>
      <path d="M352 160L480 88" markerEnd={`url(#${uid}-arrow)`} />
      <path d="M352 160H480" markerEnd={`url(#${uid}-arrow)`} />
      <path d="M352 160L480 232" markerEnd={`url(#${uid}-arrow)`} />
    </g>
    <path d="M352 200v32" stroke={LINE} strokeWidth={1.25} />
    <Edge d="M320 184C288 208 288 232 272 232" uid={uid} />
    <circle cx="352" cy="160" r="40" fill="#111622" stroke={ACCENT} strokeOpacity={0.7} strokeWidth={1.25} />
    <circle cx="352" cy="160" r="30" fill="none" stroke={ACCENT} strokeOpacity={0.35} strokeWidth={1.25} strokeDasharray="2 4" className={ANIM.flow} />
    <text {...label} x="352" y="156" textAnchor="middle" fill={BRIGHT}>Router</text>
    <text {...mono} x="352" y="172" fontSize={8} textAnchor="middle">dispatch</text>

    {SKILLS.map(([name, lib, y], i) => (
      <g key={name}>
        <Panel x={480} y={y} w={96} h={32} stroke={ACCENT} strokeOpacity={0.45} />
        <g fill="none" stroke={ACCENT} strokeOpacity={0.8} strokeWidth={1.25}>{skillGlyph(i, y)}</g>
        <text {...label} x={508} y={y + 20}>{name}</text>
        <text {...mono} x={528} y={y + 48} fontSize={8} textAnchor="middle">{lib}</text>
      </g>
    ))}

    <path d="M328 240v24q24 10 48 0V240" fill={NODE_FILL} stroke={LINE} strokeWidth={1.25} />
    <ellipse cx="352" cy="240" rx="24" ry="6" fill={NODE_FILL_2} stroke={LINE} strokeWidth={1.25} />
    <text {...caption} x="352" y="288" textAnchor="middle">Memory</text>

    <Panel x={200} y={216} w={72} h={32} stroke={ACCENT} strokeOpacity={0.5} />
    <text {...label} x="236" y="236" textAnchor="middle" fill={BRIGHT}>TTS</text>
    <Edge d="M200 232H104" uid={uid} />
    <path d="M60 224h8l12-8v32l-12-8h-8z" fill={NODE_FILL_2} stroke={LINE} strokeWidth={1.25} strokeLinejoin="round" />
    <path d="M86 226a8 8 0 0 1 0 12M92 220a16 16 0 0 1 0 24" fill="none" stroke={LINE} strokeWidth={1.25} />
    <text {...caption} x="72" y="280" textAnchor="middle">Speak</text>
  </CoverFrame>
);

/* Drifting satellite above an Earth arc; tiles fall along beams into four task cards. */
const TASKS: [string, string][] = [['Classification', 'ResNet'], ['Segmentation', 'U-Net'], ['Detection', 'YOLO'], ['Change', 'Siamese']];

const thumb = (k: number, x: number, y: number) =>
  k === 0 ? (
    <>
      <rect x={x + 2} y={y + 2} width="13" height="13" rx="2" fill={GREEN} fillOpacity={0.5} />
      <rect x={x + 17} y={y + 2} width="13" height="13" rx="2" fill={ACCENT} fillOpacity={0.5} />
      <rect x={x + 2} y={y + 17} width="13" height="13" rx="2" fill={AMBER} fillOpacity={0.45} />
      <rect x={x + 17} y={y + 17} width="13" height="13" rx="2" fill="#fff" fillOpacity={0.1} />
    </>
  ) : k === 1 ? (
    <path d={`M${x + 6} ${y + 20}q4-14 12-12t8 6q4 8-6 12t-14-6z`} fill={GREEN} fillOpacity={0.45} stroke={GREEN} strokeOpacity={0.8} strokeWidth={1.25} />
  ) : k === 2 ? (
    <g fill="none" stroke={AMBER} strokeOpacity={0.85} strokeWidth={1.25}>
      <rect x={x + 5} y={y + 6} width="12" height="10" rx="1" />
      <rect x={x + 16} y={y + 17} width="11" height="9" rx="1" />
    </g>
  ) : (
    <>
      <rect x={x + 1} y={y + 1} width="15" height="30" rx="2" fill={GREEN} fillOpacity={0.3} />
      <rect x={x + 16} y={y + 1} width="15" height="30" rx="2" fill={ROSE} fillOpacity={0.3} />
      <path d={`M${x + 16} ${y + 2}v28`} stroke={LINE} strokeWidth={1.25} strokeDasharray="2 2" />
    </>
  );

const SatelliteDl: CoverComponent = ({ uid, title, className }) => (
  <CoverFrame uid={uid} title={title} className={className} glow={[320, 96, 160]}>
    <defs>
      <linearGradient id={`${uid}-earth`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={ACCENT_DEEP} stopOpacity="0.22" />
        <stop offset="0.25" stopColor={ACCENT_DEEP} stopOpacity="0" />
      </linearGradient>
    </defs>
    <text {...caption} x="40" y="48">Earth observation</text>
    <text {...caption} x="600" y="48" textAnchor="end">Architecture index</text>

    <circle cx="320" cy="520" r="400" fill={`url(#${uid}-earth)`} stroke={ACCENT} strokeOpacity={0.3} strokeWidth={1.25} />
    {TASKS.map(([name], i) => (
      <path key={name} d={`M320 104L${104 + i * 144} 224`} fill="none" stroke={LINE_SOFT} strokeWidth={1.25} strokeDasharray="3 5" />
    ))}
    <g className={ANIM.pulse}>
      {TASKS.flatMap(([name], i) =>
        [144, 192].map((y) => {
          const x = 320 + ((104 + i * 144 - 320) * (y - 104)) / 120;
          return <rect key={`${name}${y}`} x={x - 6} y={y - 6} width="12" height="12" rx="2" fill={ACCENT} fillOpacity={0.45} stroke={ACCENT} strokeOpacity={0.7} strokeWidth={1.25} />;
        }),
      )}
    </g>

    <g className={ANIM.drift}>
      <rect x="272" y="66" width="32" height="12" rx="2" fill={NODE_FILL_2} stroke={ACCENT} strokeOpacity={0.6} strokeWidth={1.25} />
      <rect x="336" y="66" width="32" height="12" rx="2" fill={NODE_FILL_2} stroke={ACCENT} strokeOpacity={0.6} strokeWidth={1.25} />
      <path d="M280 66v12M288 66v12M296 66v12M344 66v12M352 66v12M360 66v12" stroke={ACCENT} strokeOpacity={0.35} strokeWidth={1.25} />
      <path d="M304 72h4M332 72h4" stroke={LINE} strokeWidth={1.25} />
      <rect x="308" y="64" width="24" height="16" rx="3" fill={NODE_FILL} stroke={LINE} strokeWidth={1.25} />
      <path d="M320 80v8" stroke={LINE} strokeWidth={1.25} />
      <path d="M312 90a8 8 0 0 0 16 0" fill={NODE_FILL_2} stroke={ACCENT} strokeOpacity={0.7} strokeWidth={1.25} />
    </g>

    {TASKS.map(([name, arch], i) => {
      const x = 40 + i * 144;
      return (
        <g key={name}>
          <Panel x={x} y={232} w={128} h={88} />
          <rect x={x + 12} y="244" width="32" height="32" rx="4" fill={NODE_FILL_2} stroke={LINE} strokeWidth={1.25} />
          {thumb(i, x + 12, 244)}
          <text {...label} x={x + 12} y="296">{name}</text>
          <text {...mono} x={x + 12} y="310" fontSize={8}>{arch}</text>
        </g>
      );
    })}
  </CoverFrame>
);

export const ML_COVERS: Record<string, CoverComponent> = {
  'crop-yield-xgboost': CropYield,
  'cnn-landcover': CnnLandcover,
  'lstm-phenology': LstmPhenology,
  'mlops-inference': MlopsInference,
  jarvis: Jarvis,
  'satellite-dl': SatelliteDl,
};
