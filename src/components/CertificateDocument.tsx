type Theme = 'mit' | 'euspa' | 'google' | 'classic';

export interface CertificateDocumentProps {
  title: string;
  issuer: string;
  issued?: string;
  credentialId?: string;
}

const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = 'inherit';
const MONO = 'ui-monospace, Menlo, Consolas, monospace';

const themeFor = (issuer: string): Theme => {
  if (/\bMIT\b/i.test(issuer)) return 'mit';
  if (/EUSPA|European|EU /i.test(issuer)) return 'euspa';
  if (/Google/i.test(issuer)) return 'google';
  return 'classic';
};

const wrap = (text: string, max: number): string[] => {
  if (text.length <= max) return [text];
  const cut = text.lastIndexOf(' ', max);
  return cut > 0 ? [text.slice(0, cut), text.slice(cut + 1)] : [text];
};

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');

const repeatTo = (text: string, chars: number) =>
  text.repeat(Math.max(1, Math.ceil(chars / text.length))).slice(0, Math.max(1, chars));

/* Engraved-document primitives. Geometry, gradients and tiled patterns only:
   no SVG filter is used anywhere, because feTurbulence / feGaussianBlur across
   several plates is exactly the kind of paint cost this site budgets against. */

const PaperDefs = ({ id, ink, accent }: { id: string; ink: string; accent: string }) => (
  <>
    <pattern id={`${id}-laid`} width="24" height="4" patternUnits="userSpaceOnUse">
      <line x1="0" y1="3.5" x2="24" y2="3.5" stroke={ink} strokeOpacity="0.045" strokeWidth="0.6" />
      <line x1="0.5" y1="0" x2="0.5" y2="4" stroke={ink} strokeOpacity="0.05" strokeWidth="0.6" />
    </pattern>
    <pattern id={`${id}-guilloche`} width="28" height="14" patternUnits="userSpaceOnUse">
      <path d="M0 7 Q7 0.5 14 7 T28 7" fill="none" stroke={accent} strokeOpacity="0.5" strokeWidth="0.5" />
      <path d="M0 7 Q7 13.5 14 7 T28 7" fill="none" stroke={accent} strokeOpacity="0.5" strokeWidth="0.5" />
      <path d="M14 7 Q21 1.5 28 7" fill="none" stroke={accent} strokeOpacity="0.28" strokeWidth="0.5" />
    </pattern>
    <radialGradient id={`${id}-vignette`} cx="50%" cy="46%" r="72%">
      <stop offset="0.68" stopColor="#000000" stopOpacity="0" />
      <stop offset="1" stopColor="#000000" stopOpacity="0.07" />
    </radialGradient>
    <radialGradient id={`${id}-dome`} cx="36%" cy="30%" r="72%">
      <stop offset="0" stopColor="#ffffff" stopOpacity="0.62" />
      <stop offset="0.55" stopColor="#ffffff" stopOpacity="0.08" />
      <stop offset="1" stopColor="#000000" stopOpacity="0.24" />
    </radialGradient>
  </>
);

const Paper = ({ id }: { id: string }) => (
  <>
    <rect width="640" height="480" fill={`url(#${id}-paper)`} />
    <rect width="640" height="480" fill={`url(#${id}-laid)`} />
  </>
);

const Vignette = ({ id }: { id: string }) => (
  <rect width="640" height="480" fill={`url(#${id}-vignette)`} pointerEvents="none" />
);

/* Rosette drawn as N rotated ellipses rather than a sampled polyline: same
   spirograph read, a fraction of the path data in the server HTML. */
const Rosette = ({
  cx, cy, rx, ry, count = 18, color, opacity = 0.5, width = 0.5,
}: { cx: number; cy: number; rx: number; ry: number; count?: number; color: string; opacity?: number; width?: number }) => (
  <g transform={`translate(${cx} ${cy})`} fill="none" stroke={color} strokeOpacity={opacity} strokeWidth={width}>
    {Array.from({ length: count }, (_, i) => (
      <ellipse key={i} rx={rx} ry={ry} transform={`rotate(${(180 / count) * i})`} />
    ))}
  </g>
);

const GuillocheBand = ({ id, x, y, width, height }: { id: string; x: number; y: number; width: number; height: number }) => (
  <rect x={x} y={y} width={width} height={height} fill={`url(#${id}-guilloche)`} />
);

/* Reads as a hairline at tile size and as real lettering when zoomed. */
const Microtext = ({ x, y, width, text, color, size = 3.2 }: { x: number; y: number; width: number; text: string; color: string; size?: number }) => (
  <text
    x={x}
    y={y}
    fontFamily={SANS}
    fontSize={size}
    letterSpacing="0.35"
    fill={color}
    fillOpacity="0.55"
    textLength={width}
    lengthAdjust="spacingAndGlyphs"
  >
    {repeatTo(`${text} · `, Math.round(width / (size * 0.5)))}
  </text>
);

const Corners = ({ color, inset = 30, size = 22, top }: { color: string; inset?: number; size?: number; top?: number }) => {
  const a = inset;
  const t = top ?? inset;
  const b = 640 - inset;
  const c = 480 - inset;
  return (
    <g fill="none" stroke={color} strokeWidth="1.25">
      <path d={`M${a} ${t + size} V${t} H${a + size}`} />
      <path d={`M${b - size} ${t} H${b} V${t + size}`} />
      <path d={`M${a} ${c - size} V${c} H${a + size}`} />
      <path d={`M${b - size} ${c} H${b} V${c - size}`} />
    </g>
  );
};

/* Domed, milled-rim seal: the dash pattern on the thick ring reads as the
   serrations on a struck medal, and the radial gradient supplies the relief. */
const Seal = ({ id, cx, cy, ring, core, text, font = SANS }: { id: string; cx: number; cy: number; ring: string; core: string; text: string; font?: string }) => (
  <g transform={`translate(${cx} ${cy})`}>
    <defs>
      <path id={`${id}-arc`} d="M 0 28 a 28 28 0 1 1 0 -56 a 28 28 0 1 1 0 56" />
    </defs>
    <Rosette cx={0} cy={0} rx={30} ry={11} count={16} color={ring} opacity={0.22} width={0.4} />
    <circle r="40" fill="none" stroke={ring} strokeOpacity="0.85" strokeWidth="3.2" strokeDasharray="1.6 3.1" />
    <circle r="38" fill="none" stroke={ring} strokeWidth="1.5" />
    <circle r="36.2" fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="0.7" />
    <circle r="34" fill="none" stroke={ring} strokeOpacity="0.45" strokeWidth="0.75" strokeDasharray="2 2.5" />
    <circle r="17.8" fill={ring} fillOpacity="0.28" />
    <circle r="17" fill={core} />
    <circle r="17" fill={`url(#${id}-dome)`} />
    <text fontFamily={font} fontSize="6" letterSpacing="1.1" fill={ring} fontWeight="600">
      <textPath href={`#${id}-arc`} startOffset="50%" textAnchor="middle">
        {text}
      </textPath>
    </text>
    <path d="M -6 0.5 L -2 4.5 L 6.5 -4.5" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

const Footer = ({ issued, credentialId, ink, muted, x = 60, y = 402 }: { issued?: string; credentialId?: string; ink: string; muted: string; x?: number; y?: number }) => (
  <g>
    {issued && (
      <>
        <text x={x} y={y} fontFamily={SANS} fontSize="8.5" letterSpacing="1.6" fill={muted}>ISSUED</text>
        <text x={x} y={y + 16} fontFamily={SANS} fontSize="12" fill={ink}>{issued}</text>
      </>
    )}
    {credentialId && (
      <>
        <text x={x + 130} y={y} fontFamily={SANS} fontSize="8.5" letterSpacing="1.6" fill={muted}>CREDENTIAL ID</text>
        <text x={x + 130} y={y + 16} fontFamily={MONO} fontSize="11.5" fill={ink}>{credentialId}</text>
      </>
    )}
    <text x={x} y={y + 40} fontFamily={SANS} fontSize="9" fill={muted}>Verifiable with the issuer using the credential ID. Awarded to Adil Munawar.</text>
  </g>
);

const MitBars = ({ red, dark }: { red: string; dark: string }) => (
  <>
    <rect x="0" y="0" width="7" height="30" fill={red} />
    <rect x="11" y="0" width="7" height="30" fill={red} />
    <rect x="22" y="0" width="7" height="18" fill={red} />
    <rect x="22" y="22" width="7" height="8" fill={red} />
    <rect x="33" y="0" width="7" height="30" fill={dark} />
  </>
);

const MitDocument = ({ id, title, issuer, issued, credentialId }: CertificateDocumentProps & { id: string }) => {
  const red = '#a31f34';
  const dark = '#750014';
  const ink = '#1b1b1f';
  const muted = '#6b6f78';
  const lines = wrap(title, 30);
  return (
    <>
      <defs>
        <linearGradient id={`${id}-paper`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fffdfb" />
          <stop offset="1" stopColor="#f5efec" />
        </linearGradient>
        <pattern id={`${id}-hatch`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke={red} strokeOpacity="0.06" strokeWidth="1" />
        </pattern>
        <PaperDefs id={id} ink={ink} accent={red} />
      </defs>

      <Paper id={id} />
      <rect width="640" height="480" fill={`url(#${id}-hatch)`} />

      <g transform="translate(300 128) scale(6.6)" opacity="0.028">
        <MitBars red={red} dark={red} />
      </g>

      <rect x="0" y="0" width="16" height="480" fill={red} />
      <rect x="16" y="0" width="3" height="480" fill={dark} />
      <rect x="40" y="26" width="574" height="428" fill="none" stroke={red} strokeOpacity="0.35" strokeWidth="1.25" />
      <rect x="45" y="31" width="564" height="418" fill="none" stroke={red} strokeOpacity="0.16" strokeWidth="0.6" />
      <Corners color={red} inset={34} />

      <g transform="translate(60 62)">
        <MitBars red={red} dark={dark} />
      </g>
      <text x="112" y="74" fontFamily={SERIF} fontSize="15" letterSpacing="3.5" fill={dark} fontWeight="600">MIT</text>
      <text x="112" y="90" fontFamily={SANS} fontSize="9.5" letterSpacing="2.4" fill={muted}>PROFESSIONAL EDUCATION</text>
      <text x="580" y="74" textAnchor="end" fontFamily={SANS} fontSize="9" letterSpacing="2.6" fill={red}>CERTIFICATE</text>
      <text x="580" y="90" textAnchor="end" fontFamily={SANS} fontSize="9" letterSpacing="2.6" fill={muted}>OF COMPLETION</text>
      <line x1="60" y1="108" x2="580" y2="108" stroke={red} strokeOpacity="0.4" strokeWidth="1" />
      <Microtext x={60} y={116} width={520} text="MASSACHUSETTS INSTITUTE OF TECHNOLOGY PROFESSIONAL EDUCATION" color={red} />
      <GuillocheBand id={id} x={60} y={120} width={520} height={12} />

      <text x="60" y="164" fontFamily={SANS} fontSize="11.5" fill={muted}>This certifies that</text>
      <text x="60" y="206" fontFamily={SERIF} fontSize="38" fill={ink}>Adil Munawar</text>
      <line x1="60" y1="220" x2="330" y2="220" stroke={red} strokeWidth="1.5" />
      <text x="60" y="252" fontFamily={SANS} fontSize="11.5" fill={muted}>has successfully completed the online course</text>
      {lines.map((line, i) => (
        <text key={line} x="60" y={288 + i * 30} fontFamily={SERIF} fontSize="25" fill={red} fontWeight="600">
          {line}
        </text>
      ))}
      <text x="60" y={lines.length > 1 ? 352 : 322} fontFamily={SANS} fontSize="11" fill={muted}>{issuer}</text>

      <Seal id={id} cx={534} cy={382} ring={red} core={red} text="RECORD OF COMPLETION" />
      <Footer issued={issued} credentialId={credentialId} ink={ink} muted={muted} />
      <Vignette id={id} />
    </>
  );
};

const EuspaDocument = ({ id, title, issued, credentialId }: CertificateDocumentProps & { id: string }) => {
  const navy = '#0b2a6f';
  const blue = '#1a4fd8';
  const gold = '#e8b300';
  const ink = '#111a2e';
  const muted = '#5f6b84';
  const lines = wrap(title, 32);
  return (
    <>
      <defs>
        <linearGradient id={`${id}-paper`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#eef2fb" />
        </linearGradient>
        <linearGradient id={`${id}-band`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={navy} />
          <stop offset="1" stopColor={blue} />
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <rect width="640" height="132" />
        </clipPath>
        <PaperDefs id={id} ink={ink} accent={navy} />
      </defs>
      <Paper id={id} />
      <rect width="640" height="132" fill={`url(#${id}-band)`} />
      <g clipPath={`url(#${id}-clip)`}>
        <Rosette cx={540} cy={70} rx={150} ry={52} count={20} color="#ffffff" opacity={0.16} width={0.6} />
        <circle cx="540" cy="70" r="120" fill="none" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="1" />
      </g>
      <g fill={gold}>
        <circle cx="611" cy="40" r="2.4" />
        <circle cx="470" cy="98" r="2" />
        <circle cx="598" cy="106" r="1.6" />
        <circle cx="500" cy="34" r="1.6" />
        <circle cx="540" cy="70" r="3.2" />
      </g>
      <rect x="0" y="132" width="640" height="4" fill={gold} />
      <text x="60" y="58" fontFamily={SANS} fontSize="9.5" letterSpacing="2.6" fill="#c9d6ff">EU AGENCY FOR THE SPACE PROGRAMME</text>
      <text x="60" y="88" fontFamily={SERIF} fontSize="24" fill="#ffffff" fontWeight="600">EUSPA</text>
      <text x="60" y="110" fontFamily={SANS} fontSize="10.5" letterSpacing="1.8" fill="#dfe7ff">CERTIFICATE OF COMPLETION</text>

      <rect x="28" y="152" width="584" height="300" fill="none" stroke={navy} strokeOpacity="0.2" strokeWidth="1" />
      <rect x="33" y="157" width="574" height="290" fill="none" stroke={navy} strokeOpacity="0.1" strokeWidth="0.6" />
      <Corners color={navy} inset={34} top={158} size={18} />
      <Microtext x={60} y={168} width={520} text="EUROPEAN UNION AGENCY FOR THE SPACE PROGRAMME" color={navy} />
      <GuillocheBand id={id} x={60} y={430} width={520} height={12} />

      <text x="60" y="190" fontFamily={SANS} fontSize="11.5" fill={muted}>This certificate is awarded to</text>
      <text x="60" y="232" fontFamily={SERIF} fontSize="36" fill={ink}>Adil Munawar</text>
      <line x1="60" y1="246" x2="300" y2="246" stroke={gold} strokeWidth="2" />
      <text x="60" y="278" fontFamily={SANS} fontSize="11.5" fill={muted}>for completing the training course</text>
      {lines.map((line, i) => (
        <text key={line} x="60" y={314 + i * 28} fontFamily={SERIF} fontSize="23" fill={navy} fontWeight="600">
          {line}
        </text>
      ))}

      <Seal id={id} cx={534} cy={382} ring={navy} core={blue} text="EU SPACE PROGRAMME" />
      <Footer issued={issued} credentialId={credentialId} ink={ink} muted={muted} />
      <Vignette id={id} />
    </>
  );
};

const GoogleDocument = ({ id, title, issuer, issued, credentialId }: CertificateDocumentProps & { id: string }) => {
  const blue = '#1a73e8';
  const ink = '#202124';
  const muted = '#5f6368';
  const lines = wrap(title, 26);
  return (
    <>
      <defs>
        <linearGradient id={`${id}-paper`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#f3f6fc" />
        </linearGradient>
        <pattern id={`${id}-dots`} width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill={blue} fillOpacity="0.12" />
        </pattern>
        <PaperDefs id={id} ink={ink} accent={blue} />
      </defs>
      <Paper id={id} />
      <rect x="400" y="0" width="240" height="480" fill={`url(#${id}-dots)`} />
      <Rosette cx={534} cy={382} rx={46} ry={17} count={18} color={blue} opacity={0.16} width={0.45} />
      <rect x="0" y="0" width="160" height="8" fill="#4285f4" />
      <rect x="160" y="0" width="160" height="8" fill="#ea4335" />
      <rect x="320" y="0" width="160" height="8" fill="#fbbc04" />
      <rect x="480" y="0" width="160" height="8" fill="#34a853" />

      <text x="56" y="66" fontFamily={SANS} fontSize="10" letterSpacing="2.4" fill={muted} fontWeight="600">{issuer.toUpperCase()}</text>
      <text x="56" y="88" fontFamily={SANS} fontSize="13" fill={blue} fontWeight="600">Certificate of Completion</text>
      <Microtext x={56} y={104} width={330} text="GOOGLE CLOUD SKILLS BOOST" color={blue} />

      <text x="56" y="140" fontFamily={SANS} fontSize="11.5" fill={muted}>Awarded to</text>
      <text x="56" y="184" fontFamily={SANS} fontSize="36" fill={ink} fontWeight="700">Adil Munawar</text>
      <text x="56" y="226" fontFamily={SANS} fontSize="11.5" fill={muted}>for completing the course</text>
      {lines.map((line, i) => (
        <text key={line} x="56" y={264 + i * 36} fontFamily={SANS} fontSize="30" fill={blue} fontWeight="700">
          {line}
        </text>
      ))}
      <g transform={`translate(56 ${lines.length > 1 ? 326 : 290})`}>
        <rect x="0" y="0" width="118" height="24" rx="12" fill="#e8f0fe" />
        <text x="59" y="16" textAnchor="middle" fontFamily={SANS} fontSize="10.5" fill={blue} fontWeight="600">{/SOAR/i.test(title) ? 'Security · SOAR' : 'Google Cloud'}</text>
        <rect x="126" y="0" width="86" height="24" rx="12" fill="#e6f4ea" />
        <text x="169" y="16" textAnchor="middle" fontFamily={SANS} fontSize="10.5" fill="#137333" fontWeight="600">{/Developer/i.test(title) ? 'Developer' : 'Course'}</text>
      </g>

      <g transform="translate(534 382)">
        <path d="M0 -40 L34.6 -20 L34.6 20 L0 40 L-34.6 20 L-34.6 -20 Z" fill="none" stroke={blue} strokeWidth="2" strokeLinejoin="round" />
        <path d="M0 -28 L24.2 -14 L24.2 14 L0 28 L-24.2 14 L-24.2 -14 Z" fill={blue} fillOpacity="0.08" stroke={blue} strokeOpacity="0.5" strokeWidth="1" strokeLinejoin="round" />
        <path d="M -9 1 L -3 7 L 10 -7" fill="none" stroke={blue} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <Footer issued={issued} credentialId={credentialId} ink={ink} muted={muted} x={56} />
      <Vignette id={id} />
    </>
  );
};

const ClassicDocument = ({ id, title, issuer, issued, credentialId }: CertificateDocumentProps & { id: string }) => {
  const navy = '#0b3d91';
  const ink = '#101828';
  const muted = '#5b6472';
  const lines = wrap(title, 32);
  return (
    <>
      <defs>
        <linearGradient id={`${id}-paper`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbfbf9" />
          <stop offset="1" stopColor="#eef1f6" />
        </linearGradient>
        <PaperDefs id={id} ink={ink} accent={navy} />
      </defs>
      <Paper id={id} />
      <rect x="0" y="0" width="640" height="10" fill={navy} />
      <rect x="26" y="30" width="588" height="424" fill="none" stroke={navy} strokeOpacity="0.25" strokeWidth="1" />
      <rect x="31" y="35" width="578" height="414" fill="none" stroke={navy} strokeOpacity="0.12" strokeWidth="0.6" />
      <Corners color={navy} inset={34} />
      <text x="60" y="74" fontFamily={SERIF} fontSize="15" letterSpacing="2" fill={navy} fontWeight="600">{issuer}</text>
      <text x="580" y="74" textAnchor="end" fontFamily={SANS} fontSize="9" letterSpacing="2.6" fill={muted}>CERTIFICATE OF COMPLETION</text>
      <line x1="60" y1="92" x2="580" y2="92" stroke={navy} strokeOpacity="0.35" strokeWidth="1" />
      <Microtext x={60} y={100} width={520} text={issuer.toUpperCase()} color={navy} />
      <GuillocheBand id={id} x={60} y={430} width={520} height={12} />
      <text x="60" y="150" fontFamily={SANS} fontSize="11.5" fill={muted}>This certifies that</text>
      <text x="60" y="196" fontFamily={SERIF} fontSize="38" fill={ink}>Adil Munawar</text>
      <line x1="60" y1="210" x2="330" y2="210" stroke={navy} strokeWidth="1.5" />
      <text x="60" y="244" fontFamily={SANS} fontSize="11.5" fill={muted}>has successfully completed</text>
      {lines.map((line, i) => (
        <text key={line} x="60" y={282 + i * 30} fontFamily={SERIF} fontSize="25" fill={navy} fontWeight="600">
          {line}
        </text>
      ))}
      <Seal id={id} cx={534} cy={382} ring={navy} core={navy} text="RECORD OF COMPLETION" />
      <Footer issued={issued} credentialId={credentialId} ink={ink} muted={muted} />
      <Vignette id={id} />
    </>
  );
};

export const CertificateDocument = (props: CertificateDocumentProps) => {
  const id = `cert-${slug(props.title)}`;
  const theme = themeFor(props.issuer);
  const Body = theme === 'mit' ? MitDocument : theme === 'euspa' ? EuspaDocument : theme === 'google' ? GoogleDocument : ClassicDocument;
  return (
    <svg viewBox="0 0 640 480" width="100%" height="100%" role="img" aria-label={`${props.title}, ${props.issuer}`} className="block">
      <Body id={id} {...props} />
    </svg>
  );
};
