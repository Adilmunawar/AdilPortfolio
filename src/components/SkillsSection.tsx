'use client';

import { Reveal } from './Reveal';
import Achievements from './Achievements';
import { LogoLoop, type LogoItem } from './LogoLoop';

const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';
const INVERT = new Set(['nextjs', 'github', 'express', 'vercel', 'amazonwebservices']);

type Logo = LogoItem & { src: string; alt: string; invert?: boolean };
// AWS only ships a wordmark variant on the CDN, so the file suffix is overridable.
const logo = (name: string, alt: string, variant = 'original'): Logo => ({
  src: `${DEVICON}/${name}/${name}-${variant}.svg`,
  alt,
  invert: INVERT.has(name),
});

const rows: { title: string; direction: 'left' | 'right'; logos: Logo[] }[] = [
  {
    title: 'Frontend',
    direction: 'left',
    logos: [
      logo('react', 'React'),
      logo('nextjs', 'Next.js'),
      logo('typescript', 'TypeScript'),
      logo('javascript', 'JavaScript'),
      logo('html5', 'HTML5'),
      logo('css3', 'CSS3'),
      logo('tailwindcss', 'Tailwind'),
      logo('vitejs', 'Vite'),
      logo('vuejs', 'Vue.js'),
    ],
  },
  {
    title: 'Backend & data',
    direction: 'right',
    logos: [
      logo('nodejs', 'Node.js'),
      logo('python', 'Python'),
      logo('fastapi', 'FastAPI'),
      logo('express', 'Express'),
      logo('azuresqldatabase', 'SQL'),
      logo('postgresql', 'PostgreSQL'),
      logo('firebase', 'Firebase'),
      logo('supabase', 'Supabase'),
      logo('redis', 'Redis'),
    ],
  },
  {
    title: 'Machine learning',
    direction: 'left',
    logos: [
      logo('pytorch', 'PyTorch'),
      logo('tensorflow', 'TensorFlow'),
      logo('keras', 'Keras'),
      logo('scikitlearn', 'scikit-learn'),
      logo('opencv', 'OpenCV'),
      logo('pandas', 'pandas'),
      logo('numpy', 'NumPy'),
      logo('anaconda', 'Anaconda'),
      logo('jupyter', 'Jupyter'),
    ],
  },
  {
    title: 'Cloud & tooling',
    direction: 'right',
    logos: [
      logo('amazonwebservices', 'AWS', 'original-wordmark'),
      logo('googlecloud', 'Google Cloud'),
      logo('azure', 'Azure'),
      logo('vercel', 'Vercel'),
      logo('docker', 'Docker'),
      logo('kubernetes', 'Kubernetes'),
      logo('git', 'Git'),
      logo('github', 'GitHub'),
      logo('figma', 'Figma'),
    ],
  },
];

const renderLogo = (item: LogoItem) => {
  if (!('src' in item)) return null;
  const { src, alt, invert } = item as Logo;
  return (
    <figure className="logo-chip">
      <img src={src} alt="" width={56} height={56} loading="lazy" decoding="async" draggable={false} className={invert ? 'logo-invert' : undefined} />
      <figcaption>{alt}</figcaption>
    </figure>
  );
};

// The group headings and their icons were removed from the visual design, so the
// names survive only as aria-labels to keep each column announceable.
const toolkit: { label: string; items: string[] }[] = [
  {
    label: 'Machine learning and remote sensing',
    items: ['PyTorch', 'HRNet / U-Net', 'Temporal CNN & LSTM', 'scikit-learn', 'XGBoost', 'TensorFlow / Keras', 'ONNX Runtime', 'MLflow', 'Google Earth Engine', 'xarray'],
  },
  {
    label: 'Backend and data',
    items: ['Python', 'Node.js', 'FastAPI', 'PostgreSQL / PostGIS', 'Supabase', 'Redis', 'pgvector', 'GDAL / Rasterio', 'GeoPandas / Shapely', 'NumPy / pandas'],
  },
  {
    label: 'Frontend',
    items: ['TypeScript', 'React', 'Next.js', 'Vite', 'Tailwind CSS', 'HTML & CSS', 'Zod', 'face-api.js', 'jsPDF', 'Framer Motion'],
  },
  {
    label: 'Cloud and tooling',
    items: ['Docker', 'AWS', 'Azure', 'Vercel', 'GitHub Actions', 'Cron / Airflow', 'RAG pipelines', 'MCP servers', 'LangChain', 'QGIS'],
  },
];

const SkillsSection = () => {
  return (
    <section id="skills" className="px-5 py-10 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-[1120px]">
        <Reveal className="mx-auto mb-6 max-w-[680px] text-center lg:mb-12">
          <h2 className="text-[24px] font-semibold leading-[1.15] tracking-[-0.02em] text-[#f2f4f8] lg:text-[40px]">
            Certifications
          </h2>
        </Reveal>

        <Reveal delay={60}>
          <Achievements />
        </Reveal>

        <div className="mt-16 lg:mt-24">
          <Reveal className="mx-auto mb-6 max-w-[680px] text-center lg:mb-12">
            <h2 className="text-[24px] font-semibold leading-[1.15] tracking-[-0.02em] text-[#f2f4f8] lg:text-[40px]">
              Toolkit
            </h2>
          </Reveal>

          <div className="space-y-8 lg:space-y-10">
            {rows.map((row, i) => (
                <Reveal key={row.title} delay={Math.min(i, 2) * 60} className="min-w-0">
                  <p className="mb-3 text-center text-[13px] font-medium text-[#f2f4f8]">{row.title}</p>
                  <LogoLoop
                    logos={row.logos}
                    speed={36}
                    direction={row.direction}
                    logoHeight={56}
                    gap={44}
                    fadeOut
                    fadeOutColor="#0b0f17"
                    scaleOnHover
                    pauseOnHover
                    ariaLabel={`${row.title} tools`}
                    renderItem={renderLogo}
                    className="py-1"
                  />
                </Reveal>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-6 border-t border-white/[0.06] pt-8 sm:grid-cols-4 lg:mt-16 lg:gap-8 lg:pt-12">
            {toolkit.map((column, i) => (
              <Reveal key={column.label} delay={Math.min(i, 2) * 60} className="min-w-0">
                <ul className="space-y-1.5 text-center" aria-label={column.label}>
                  {column.items.map((item) => (
                    <li key={item} className="text-[11px] leading-snug text-[#a4adbe] sm:text-[12px] lg:text-[14px] lg:leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
