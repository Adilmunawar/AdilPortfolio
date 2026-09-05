'use client';
import { ACCENT, AMBER, ANIM, caption, CoverFrame, Edge, GREEN, label, LINE, LINE_SOFT, mono, NODE_FILL, NODE_FILL_2, Panel, ROSE, Tag, type CoverComponent } from '../shared';

/* Seven parcels tiling a 160x176 box; reused as raster, vector and class map. */
const PARCELS = [
  '8,8 72,8 68,56 8,48',
  '72,8 152,8 152,48 68,56',
  '8,48 68,56 60,112 8,104',
  '68,56 152,48 152,104 108,112 60,112',
  '8,104 60,112 56,168 8,168',
  '60,112 108,112 112,168 56,168',
  '108,112 152,104 152,168 112,168',
];
const FIELD_FILLS = [GREEN, AMBER, GREEN, GREEN, AMBER, GREEN, AMBER];
const FIELD_ALPHA = [0.28, 0.18, 0.2, 0.34, 0.14, 0.24, 0.2];
const CLOUD = 'M-28 8C-36 -4 -24 -18 -10 -12C-4 -28 18 -28 22 -12C36 -14 40 6 28 10C24 18 -18 20 -28 8Z';
const INK = '#0b0f17';

const pick = <T,>(v: T | T[], i: number): T => (Array.isArray(v) ? v[i % v.length] : v) as T;

interface ParcelsProps {
  x: number; y: number; s?: number;
  fill?: string | string[]; fillOpacity?: number | number[];
  stroke?: string; strokeOpacity?: number; dashed?: boolean;
}
function Parcels({ x, y, s = 1, fill = GREEN, fillOpacity = 0.2, stroke = 'none', strokeOpacity = 1, dashed }: ParcelsProps) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={stroke} strokeOpacity={strokeOpacity} strokeWidth={1.25} strokeLinejoin="round" strokeDasharray={dashed ? '3 3' : undefined}>
      {PARCELS.map((pts, i) => (
        <polygon key={i} points={pts} fill={pick(fill, i)} fillOpacity={pick(fillOpacity, i)} vectorEffect="non-scaling-stroke" />
      ))}
    </g>
  );
}

/* Raster tile -> four HRNet resolution streams with fusion crossings -> traced polygons. */
const HrnetKishtwar: CoverComponent = ({ uid, title, className }) => {
  const rows = [96, 128, 160, 192];
  const starts = [232, 272, 312, 352];
  const fusions: string[] = [];
  [272, 312, 352, 392].forEach((x, k) => {
    for (let j = 0; j <= k && j < 3; j++) {
      fusions.push(`M${x - 8} ${rows[j] + 12}L${x + 8} ${rows[j + 1]}`, `M${x - 8} ${rows[j + 1]}L${x + 8} ${rows[j] + 12}`);
    }
  });
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[320, 160, 200]}>
      <text {...caption} x={40} y={44}>Kishtwar tile</text>
      <text {...caption} x={600} y={44} textAnchor="end">Vector boundaries</text>

      <Panel x={40} y={72} w={160} h={176} />
      <Parcels x={40} y={72} fill={FIELD_FILLS} fillOpacity={FIELD_ALPHA} />
      <Tag x={40} y={272} text="Satellite raster" />

      <text {...label} x={232} y={84}>HRNet</text>
      <Tag x={280} y={80} text="W48" tone="accent" />
      {rows.map((y, i) => (
        <rect key={y} x={starts[i]} y={y} width={408 - starts[i]} height={12} rx={3} fill={ACCENT} fillOpacity={0.6 - i * 0.12} />
      ))}
      <g className={ANIM.flow} fill="none" stroke={ACCENT} strokeOpacity={0.5} strokeWidth={1.25} strokeDasharray="3 3">
        {fusions.map((d) => <path key={d} d={d} />)}
        <Edge uid={uid} d="M200 102H228" dashed />
        <Edge uid={uid} d="M408 102H436" dashed />
      </g>
      <text {...caption} x={320} y={232} textAnchor="middle">4 parallel streams</text>
      <Tag x={272} y={272} text="Tiled inference" />

      <Panel x={440} y={72} w={160} h={176} />
      <Parcels x={440} y={72} fill="none" stroke={GREEN} strokeOpacity={0.6} />
      <g className={ANIM.pulse} fill={ACCENT} stroke={ACCENT} strokeWidth={1.25} strokeLinejoin="round">
        <path d="M508 128L500 184L548 184" fill="none" />
        <circle cx={508} cy={128} r={2} />
        <circle cx={500} cy={184} r={2} />
        <circle cx={548} cy={184} r={2} />
      </g>
      <Tag x={440} y={272} text="GIS polygons" tone="green" />
    </CoverFrame>
  );
};

/* Twelve-month NDVI curves per crop -> sequence model -> parcel map in three class colours. */
const CropTypeTimeseries: CoverComponent = ({ uid, title, className }) => {
  const curves: [string, string][] = [
    [AMBER, 'M64 168C88 128 112 112 136 120S176 200 208 216L256 216C280 212 304 184 328 160'],
    [GREEN, 'M64 216H160C184 216 208 128 232 120S280 176 304 212L328 216'],
    [ACCENT, 'M64 200C112 184 160 136 208 120S280 104 328 112'],
  ];
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[240, 168, 200]}>
      <defs>
        <clipPath id={`${uid}-plot`}><rect x={64} y={96} width={264} height={136} /></clipPath>
      </defs>
      <text {...caption} x={40} y={44}>NDVI phenology</text>
      <text {...caption} x={600} y={44} textAnchor="end">Per-parcel output</text>

      <Panel x={40} y={64} w={304} h={200} />
      <Tag x={56} y={84} text="Wheat" tone="amber" />
      <Tag x={104} y={84} text="Rice" tone="green" />
      <Tag x={152} y={84} text="Sugarcane" tone="accent" />
      <text {...caption} x={328} y={88} textAnchor="end">12 months</text>
      <path d="M64 128H328M64 160H328M64 192H328" stroke={LINE_SOFT} strokeWidth={1.25} />
      <path d="M64 232H328" stroke={LINE} strokeWidth={1.25} />
      {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${64 + i * 24} 232v4`} stroke={LINE} strokeWidth={1.25} />)}
      {['Jan', 'Apr', 'Jul', 'Oct'].map((m, i) => <text key={m} {...mono} x={64 + i * 72} y={250} textAnchor="middle">{m}</text>)}
      <g fill="none" strokeWidth={1.25} strokeLinecap="round">
        {curves.map(([c, d]) => <path key={c} d={d} stroke={c} strokeOpacity={0.9} />)}
      </g>
      {/* ca-scan translates along local Y; the rotated group turns that into a left-to-right sweep. */}
      <g clipPath={`url(#${uid}-plot)`}>
        <g transform="translate(64 232) rotate(-90)">
          <path d="M0 0H136" stroke={ACCENT} strokeOpacity={0.7} strokeWidth={1.25} className={ANIM.scan} />
        </g>
      </g>

      <g className={ANIM.flow}>
        <Edge uid={uid} d="M344 160H372" dashed />
        <Edge uid={uid} d="M456 160H484" dashed />
      </g>
      <Panel x={376} y={136} w={80} h={48} stroke={ACCENT} strokeOpacity={0.5} />
      <text {...label} x={416} y={156} textAnchor="middle">1D-CNN</text>
      <text {...label} x={416} y={172} textAnchor="middle">LSTM</text>
      <text {...caption} x={416} y={204} textAnchor="middle">per-class confidence</text>

      <Panel x={488} y={96} w={112} h={128} />
      <Parcels x={492} y={100} s={0.65} fill={[AMBER, GREEN, ACCENT, GREEN, AMBER, ACCENT, GREEN]} fillOpacity={0.5} stroke={INK} strokeOpacity={0.8} />
      <Tag x={488} y={244} text="3 classes" />
      <Tag x={40} y={288} text="Sentinel-2" tone="accent" />
      <Tag x={120} y={288} text="Temporal attention" />
    </CoverFrame>
  );
};

/* Mosaic -> boundaries -> polygons -> QA -> PostGIS, with a checked vector map and GeoJSON card below. */
const FarmDigitization: CoverComponent = ({ uid, title, className }) => {
  const stages: [number, string][] = [[48, 'Mosaic'], [160, 'Boundaries'], [272, 'Polygons'], [384, 'QA review']];
  const tiles: [number, number, number][] = [[56, 112, 0.3], [88, 112, 0.18], [56, 144, 0.22], [88, 144, 0.34]];
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[320, 152, 220]}>
      <text {...caption} x={40} y={44}>Imagery to vector</text>
      <text {...caption} x={600} y={44} textAnchor="end">Human-in-the-loop QA</text>

      {stages.map(([x, name]) => (
        <g key={name}>
          <Panel x={x} y={104} w={72} h={72} />
          <text {...caption} x={x + 36} y={196} textAnchor="middle">{name}</text>
        </g>
      ))}
      {tiles.map(([x, y, a]) => <rect key={`${x}-${y}`} x={x} y={y} width={28} height={28} rx={2} fill={GREEN} fillOpacity={a} />)}
      <Parcels x={164} y={108} s={0.4} fill="none" stroke={ACCENT} strokeOpacity={0.8} dashed />
      <Parcels x={276} y={108} s={0.4} fill={GREEN} fillOpacity={0.25} stroke={GREEN} strokeOpacity={0.7} />
      <Parcels x={388} y={108} s={0.4} fill={GREEN} fillOpacity={0.18} stroke={GREEN} strokeOpacity={0.45} />
      <g className={ANIM.pulse} stroke={GREEN} strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round">
        <circle cx={420} cy={140} r={12} fill={NODE_FILL} />
        <path d="M414 140l4 4 8-9" fill="none" />
      </g>

      <path d="M520 116v48q36 14 72 0v-48" fill={NODE_FILL} stroke={ACCENT} strokeOpacity={0.5} strokeWidth={1.25} />
      <ellipse cx={556} cy={116} rx={36} ry={8} fill={NODE_FILL} stroke={ACCENT} strokeOpacity={0.5} strokeWidth={1.25} />
      <Tag x={528} y={84} text="GeoJSON" tone="accent" />
      <text {...caption} x={556} y={196} textAnchor="middle">PostGIS</text>

      <g className={ANIM.flow}>
        {['M120 140H156', 'M232 140H268', 'M344 140H380', 'M456 140H516', 'M224 268H396'].map((d) => <Edge key={d} uid={uid} d={d} dashed />)}
      </g>

      <Panel x={48} y={224} w={176} h={88} />
      <Parcels x={56} y={228} s={0.45} fill={GREEN} fillOpacity={0.2} stroke={GREEN} strokeOpacity={0.6} />
      <path d="M100 242l3 3 6-6M90 290l3 3 6-6" fill="none" stroke={GREEN} strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" />
      <Tag x={136} y={248} text="Topology OK" tone="green" />
      <Tag x={136} y={280} text="EPSG:4326" />

      <Panel x={400} y={224} w={192} h={88} fill={INK} stroke={LINE_SOFT} />
      <text {...mono} x={412} y={248}>{'{ "type": "Feature",'}</text>
      <text {...mono} x={412} y={266} fill={ACCENT}>{'"geometry": { ... },'}</text>
      <text {...mono} x={412} y={284}>{'"srid": 4326 }'}</text>
    </CoverFrame>
  );
};

/* Seasonal NDVI sparkline against its baseline band, one flagged dip, fields tinted by index. */
const NdviMonitoring: CoverComponent = ({ uid, title, className }) => {
  const baseline = 'M64 192C128 192 160 124 224 124S304 124 368 176';
  const field = 'M64 196C128 196 160 128 224 128C240 128 248 132 256 136C268 144 276 168 288 172C300 176 320 156 336 156S360 184 368 188';
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[216, 152, 200]}>
      <text {...caption} x={40} y={44}>Field NDVI</text>
      <text {...caption} x={600} y={44} textAnchor="end">Fields by index</text>

      <Panel x={40} y={64} w={352} h={176} />
      <Tag x={56} y={84} text="Sentinel-2" tone="accent" />
      <Tag x={128} y={84} text="Baseline band" tone="green" />
      <path d="M64 216H368" stroke={LINE} strokeWidth={1.25} />
      {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${64 + i * 32} 216v4`} stroke={LINE} strokeWidth={1.25} />)}
      <text {...mono} x={64} y={234}>Mar</text>
      <text {...mono} x={368} y={234} textAnchor="end">Nov</text>
      <path d={baseline} fill="none" stroke={GREEN} strokeOpacity={0.12} strokeWidth={20} />
      <path d={baseline} fill="none" stroke={GREEN} strokeOpacity={0.4} strokeWidth={1.25} strokeDasharray="3 3" />
      <path d={field} fill="none" stroke={GREEN} strokeWidth={1.25} strokeLinecap="round" />

      <Panel x={264} y={72} w={112} h={36} stroke={ROSE} strokeOpacity={0.5} />
      <Tag x={272} y={90} text="Anomaly" tone="rose" />
      <text {...mono} x={368} y={94} textAnchor="end" fill={ROSE}>-0.21</text>
      <path d="M288 112V160" stroke={ROSE} strokeOpacity={0.5} strokeWidth={1.25} strokeDasharray="3 3" className={ANIM.flow} />
      <circle cx={288} cy={172} r={8} fill="none" stroke={ROSE} strokeOpacity={0.4} strokeWidth={1.25} />
      <circle cx={288} cy={172} r={4} fill={ROSE} className={ANIM.blink} />

      <Tag x={40} y={264} text="Per-field alerts" tone="rose" />
      <Tag x={152} y={264} text="FastAPI dashboard" />

      <Panel x={424} y={64} w={176} h={176} />
      <Parcels x={432} y={64} fill={[GREEN, GREEN, GREEN, ROSE, GREEN, GREEN, GREEN]} fillOpacity={[0.55, 0.35, 0.7, 0.45, 0.4, 0.6, 0.3]} stroke={INK} strokeOpacity={0.7} />
      <circle cx={540} cy={148} r={6} fill="none" stroke={ROSE} strokeWidth={1.25} className={ANIM.pulse} />
      {[0.15, 0.3, 0.45, 0.6, 0.75].map((a, i) => <rect key={a} x={424 + i * 20} y={256} width={16} height={8} rx={2} fill={GREEN} fillOpacity={a} />)}
      <text {...caption} x={532} y={264}>low to high</text>
    </CoverFrame>
  );
};

/* Scene with clouds and offset shadows -> U-Net hourglass with skips -> binary mask tile. */
const CloudShadowMask: CoverComponent = ({ uid, title, className }) => {
  const rows = [88, 120, 152, 184];
  const widths = [48, 40, 32, 24];
  const clouds: [number, number, number][] = [[96, 120, 1], [156, 176, 0.8], [72, 200, 0.6]];
  const blobs = (dx: number, cloud: string) => (
    <>
      {clouds.map(([x, y, s]) => <path key={`s${x}`} d={CLOUD} transform={`translate(${x + dx + 16} ${y + 16}) scale(${s})`} fill={INK} fillOpacity={0.8} />)}
      {clouds.map(([x, y, s]) => <path key={`c${x}`} d={CLOUD} transform={`translate(${x + dx} ${y}) scale(${s})`} fill={cloud} fillOpacity={0.92} />)}
    </>
  );
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[320, 152, 200]}>
      <defs>
        <clipPath id={`${uid}-scene`}><rect x={40} y={72} width={160} height={160} rx={8} /></clipPath>
        <clipPath id={`${uid}-mask`}><rect x={440} y={72} width={160} height={160} rx={8} /></clipPath>
      </defs>
      <text {...caption} x={40} y={44}>Sentinel-2 scene</text>
      <text {...caption} x={600} y={44} textAnchor="end">Predicted mask</text>

      <Panel x={40} y={72} w={160} h={160} />
      <g clipPath={`url(#${uid}-scene)`}>
        <Parcels x={48} y={72} s={0.9} fill={FIELD_FILLS} fillOpacity={FIELD_ALPHA} />
        {blobs(0, '#e6ebf3')}
      </g>
      <Tag x={40} y={256} text="13 bands" tone="accent" />

      <Tag x={300} y={60} text="U-Net" tone="accent" />
      {rows.map((y, i) => (
        <g key={y}>
          <rect x={296 - widths[i]} y={y} width={widths[i]} height={20} rx={4} fill={ACCENT} fillOpacity={0.55 - i * 0.1} />
          <rect x={344} y={y} width={widths[i]} height={20} rx={4} fill={NODE_FILL_2} stroke={ACCENT} strokeOpacity={0.5} strokeWidth={1.25} />
        </g>
      ))}
      <rect x={296} y={216} width={48} height={20} rx={4} fill={NODE_FILL} stroke={ACCENT} strokeOpacity={0.7} strokeWidth={1.25} className={ANIM.pulse} />
      <g fill="none" stroke={LINE} strokeWidth={1.25}>
        {rows.slice(0, 3).map((y, i) => (
          <path key={y} d={`M${296 - widths[i] / 2} ${y + 20}L${296 - widths[i + 1] / 2} ${rows[i + 1]}M${344 + widths[i + 1] / 2} ${rows[i + 1]}L${344 + widths[i] / 2} ${y + 20}`} />
        ))}
        <path d="M284 204L308 216M332 216L356 204" />
      </g>
      <g className={ANIM.flow}>
        {rows.map((y) => <Edge key={y} uid={uid} d={`M296 ${y + 10}H340`} dashed />)}
        <Edge uid={uid} d="M200 98H244" dashed />
        <Edge uid={uid} d="M392 98H436" dashed />
      </g>
      <text {...caption} x={320} y={260} textAnchor="middle">Skip connections</text>

      <Panel x={440} y={72} w={160} h={160} fill={NODE_FILL_2} />
      <g clipPath={`url(#${uid}-mask)`}>{blobs(400, '#f2f4f8')}</g>
      <rect x={440} y={252} width={12} height={8} rx={2} fill="#f2f4f8" fillOpacity={0.9} />
      <text {...caption} x={458} y={260}>cloud</text>
      <rect x={504} y={252} width={12} height={8} rx={2} fill={INK} stroke={LINE} strokeWidth={1.25} />
      <text {...caption} x={522} y={260}>shadow</text>
    </CoverFrame>
  );
};

export const AGRI_COVERS: Record<string, CoverComponent> = {
  'hrnet-w48-kishtwar': HrnetKishtwar,
  'crop-type-timeseries': CropTypeTimeseries,
  'farm-digitization': FarmDigitization,
  'ndvi-monitoring': NdviMonitoring,
  'cloud-shadow-mask': CloudShadowMask,
};
