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

const Corners = ({ color, inset = 30, size = 22 }: { color: string; inset?: number; size?: number }) => {
  const a = inset;
  const b = 640 - inset;
  const c = 480 - inset;
  return (
    <g fill="none" stroke={color} strokeWidth="1.25">
      <path d={`M${a} ${a + size} V${a} H${a + size}`} />
      <path d={`M${b - size} ${a} H${b} V${a + size}`} />
      <path d={`M${a} ${c - size} V${c} H${a + size}`} />
      <path d={`M${b - size} ${c} H${b} V${c - size}`} />
    </g>
  );
};

const Seal = ({ id, cx, cy, ring, core, text, font = SANS }: { id: string; cx: number; cy: number; ring: string; core: string; text: string; font?: string }) => (
  <g transform={`translate(${cx} ${cy})`}>
    <defs>
      <path id={`${id}-arc`} d="M -27 0 a 27 27 0 1 1 54 0 a 27 27 0 1 1 -54 0" />
    </defs>
    <circle r="38" fill="none" stroke={ring} strokeWidth="1.5" />
    <circle r="34" fill="none" stroke={ring} strokeOpacity="0.45" strokeWidth="0.75" strokeDasharray="2 2.5" />
    <circle r="17" fill={core} />
    <text fontFamily={font} fontSize="6.6" letterSpacing="2.2" fill={ring} fontWeight="600">
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
      </defs>
      <rect width="640" height="480" fill={`url(#${id}-paper)`} />
      <rect width="640" height="480" fill={`url(#${id}-hatch)`} />
      <rect x="0" y="0" width="16" height="480" fill={red} />
      <rect x="16" y="0" width="3" height="480" fill={dark} />
      <rect x="40" y="26" width="574" height="428" fill="none" stroke={red} strokeOpacity="0.35" strokeWidth="1.25" />
      <Corners color={red} inset={34} />

      <g transform="translate(60 62)">
        <rect x="0" y="0" width="7" height="30" fill={red} />
        <rect x="11" y="0" width="7" height="30" fill={red} />
        <rect x="22" y="0" width="7" height="18" fill={red} />
        <rect x="22" y="22" width="7" height="8" fill={red} />
        <rect x="33" y="0" width="7" height="30" fill={dark} />
      </g>
      <text x="112" y="74" fontFamily={SERIF} fontSize="15" letterSpacing="3.5" fill={dark} fontWeight="600">MIT</text>
      <text x="112" y="90" fontFamily={SANS} fontSize="9.5" letterSpacing="2.4" fill={muted}>PROFESSIONAL EDUCATION</text>
      <text x="580" y="74" textAnchor="end" fontFamily={SANS} fontSize="9" letterSpacing="2.6" fill={red}>CERTIFICATE</text>
      <text x="580" y="90" textAnchor="end" fontFamily={SANS} fontSize="9" letterSpacing="2.6" fill={muted}>OF COMPLETION</text>
      <line x1="60" y1="108" x2="580" y2="108" stroke={red} strokeOpacity="0.4" strokeWidth="1" />

      <text x="60" y="150" fontFamily={SANS} fontSize="11.5" fill={muted}>This certifies that</text>
      <text x="60" y="196" fontFamily={SERIF} fontSize="38" fill={ink}>Adil Munawar</text>
      <line x1="60" y1="210" x2="330" y2="210" stroke={red} strokeWidth="1.5" />
      <text x="60" y="244" fontFamily={SANS} fontSize="11.5" fill={muted}>has successfully completed the online course</text>
      {lines.map((line, i) => (
        <text key={line} x="60" y={282 + i * 30} fontFamily={SERIF} fontSize="25" fill={red} fontWeight="600">
          {line}
        </text>
      ))}
      <text x="60" y={lines.length > 1 ? 348 : 318} fontFamily={SANS} fontSize="11" fill={muted}>{issuer}</text>

      <Seal id={id} cx={534} cy={382} ring={red} core={red} text="RECORD OF COMPLETION" />
      <Footer issued={issued} credentialId={credentialId} ink={ink} muted={muted} />
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
      </defs>
      <rect width="640" height="480" fill={`url(#${id}-paper)`} />
      <rect width="640" height="132" fill={`url(#${id}-band)`} />
      <g clipPath={`url(#${id}-clip)`} fill="none" stroke="#ffffff" strokeOpacity="0.18" strokeWidth="1">
        <ellipse cx="540" cy="70" rx="150" ry="52" transform="rotate(-18 540 70)" />
        <ellipse cx="540" cy="70" rx="105" ry="36" transform="rotate(-18 540 70)" />
        <ellipse cx="540" cy="70" rx="60" ry="21" transform="rotate(-18 540 70)" />
        <circle cx="540" cy="70" r="120" strokeOpacity="0.08" />
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
      <Corners color={navy} inset={34} size={18} />

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
      </defs>
      <rect width="640" height="480" fill={`url(#${id}-paper)`} />
      <rect x="400" y="0" width="240" height="480" fill={`url(#${id}-dots)`} />
      <rect x="0" y="0" width="160" height="8" fill="#4285f4" />
      <rect x="160" y="0" width="160" height="8" fill="#ea4335" />
      <rect x="320" y="0" width="160" height="8" fill="#fbbc04" />
      <rect x="480" y="0" width="160" height="8" fill="#34a853" />

      <text x="56" y="66" fontFamily={SANS} fontSize="10" letterSpacing="2.4" fill={muted} fontWeight="600">{issuer.toUpperCase()}</text>
      <text x="56" y="88" fontFamily={SANS} fontSize="13" fill={blue} fontWeight="600">Certificate of Completion</text>

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
      </defs>
      <rect width="640" height="480" fill={`url(#${id}-paper)`} />
      <rect x="0" y="0" width="640" height="10" fill={navy} />
      <rect x="26" y="30" width="588" height="424" fill="none" stroke={navy} strokeOpacity="0.25" strokeWidth="1" />
      <Corners color={navy} inset={34} />
      <text x="60" y="74" fontFamily={SERIF} fontSize="15" letterSpacing="2" fill={navy} fontWeight="600">{issuer}</text>
      <text x="580" y="74" textAnchor="end" fontFamily={SANS} fontSize="9" letterSpacing="2.6" fill={muted}>CERTIFICATE OF COMPLETION</text>
      <line x1="60" y1="92" x2="580" y2="92" stroke={navy} strokeOpacity="0.35" strokeWidth="1" />
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
