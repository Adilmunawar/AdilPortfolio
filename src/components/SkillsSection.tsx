'use client';

import { BrainCircuit, Cloud, Database, Monitor, Wrench, type LucideIcon } from 'lucide-react';
import { Reveal } from './Reveal';
import Achievements from './Achievements';
import { LogoLoop, type LogoItem } from './LogoLoop';

const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';
const INVERT = new Set(['nextjs', 'github', 'express', 'vercel']);

type Logo = LogoItem & { src: string; alt: string; invert?: boolean };
const logo = (name: string, alt: string): Logo => ({
  src: `${DEVICON}/${name}/${name}-original.svg`,
  alt,
  invert: INVERT.has(name),
});

const rows: { title: string; icon: LucideIcon; direction: 'left' | 'right'; logos: Logo[] }[] = [
  {
    title: 'Frontend',
    icon: Monitor,
    direction: 'left',
    logos: [
      logo('react', 'React'),
      logo('nextjs', 'Next.js'),
      logo('typescript', 'TypeScript'),
      logo('javascript', 'JavaScript'),
      logo('html5', 'HTML5'),
      logo('css3', 'CSS3'),
      logo('tailwindcss', 'Tailwind'),
      logo('vuejs', 'Vue.js'),
    ],
  },
  {
    title: 'Backend & data',
    icon: Database,
    direction: 'right',
    logos: [
      logo('nodejs', 'Node.js'),
      logo('python', 'Python'),
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
    icon: BrainCircuit,
    direction: 'left',
    logos: [
      logo('python', 'Python'),
      logo('pytorch', 'PyTorch'),
      logo('tensorflow', 'TensorFlow'),
      logo('scikitlearn', 'scikit-learn'),
      logo('pandas', 'pandas'),
      logo('numpy', 'NumPy'),
      logo('opencv', 'OpenCV'),
      logo('jupyter', 'Jupyter'),
      logo('docker', 'Docker'),
    ],
  },
  {
    title: 'Tools & cloud',
    icon: Wrench,
    direction: 'right',
    logos: [
      logo('git', 'Git'),
      logo('github', 'GitHub'),
      logo('vscode', 'VS Code'),
      logo('docker', 'Docker'),
      logo('figma', 'Figma'),
      logo('webpack', 'Webpack'),
      logo('azure', 'Azure'),
      logo('vercel', 'Vercel'),
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

const toolkit: { group: string; icon: LucideIcon; items: string[] }[] = [
  {
    group: 'Machine learning & remote sensing',
    icon: BrainCircuit,
    items: ['PyTorch', 'HRNet / U-Net', 'Temporal CNN & LSTM', 'scikit-learn', 'Google Earth Engine', 'xarray'],
  },
  {
    group: 'Backend & data',
    icon: Database,
    items: ['Python', 'Node.js', 'PostgreSQL / PostGIS', 'Supabase', 'GDAL / Rasterio', 'GeoPandas / Shapely'],
  },
  {
    group: 'Frontend',
    icon: Monitor,
    items: ['TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'HTML & CSS'],
  },
  {
    group: 'Cloud & tooling',
    icon: Cloud,
    items: ['Docker', 'Azure', 'Vercel', 'GitHub Actions', 'RAG pipelines', 'MCP servers'],
  },
];

const SkillsSection = () => {
  return (
    <section id="skills" className="px-5 py-16 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-[1120px]">
        <Reveal className="mb-8 lg:mb-12">
          <h2 className="text-[28px] font-semibold leading-[1.15] tracking-[-0.02em] text-[#f2f4f8] lg:text-[40px]">
            Certifications
          </h2>
          <p className="mt-3 max-w-[680px] text-[17px] leading-normal text-[#a4adbe] lg:text-[20px]">
            Courses and assessments from Google Cloud, AWS, Microsoft, MIT Professional Education, EUSPA, Anthropic, GitHub and LinkedIn.
          </p>
        </Reveal>

        <Reveal delay={60}>
          <Achievements />
        </Reveal>

        <div className="mt-16 lg:mt-24">
          <Reveal className="mb-8 lg:mb-12">
            <h2 className="text-[28px] font-semibold leading-[1.15] tracking-[-0.02em] text-[#f2f4f8] lg:text-[40px]">
              Toolkit
            </h2>
            <p className="mt-3 max-w-[680px] text-[17px] leading-normal text-[#a4adbe] lg:text-[20px]">
              What I reach for day to day, grouped by the kind of work.
            </p>
          </Reveal>

          <div className="space-y-8 lg:space-y-10">
            {rows.map((row, i) => {
              const Icon = row.icon;
              return (
                <Reveal key={row.title} delay={Math.min(i, 2) * 60} className="min-w-0">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="stat-tile__icon" aria-hidden>
                      <Icon size={15} strokeWidth={1.75} />
                    </span>
                    <p className="text-[13px] font-medium text-[#f2f4f8]">{row.title}</p>
                    <span className="font-mono text-[12px] tabular-nums text-[#6f7888]">{row.logos.length} tools</span>
                  </div>
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
              );
            })}
          </div>

          <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-white/[0.06] pt-10 lg:mt-16 lg:grid-cols-4 lg:gap-8 lg:pt-12">
            {toolkit.map((column, i) => {
              const Icon = column.icon;
              return (
                <Reveal key={column.group} delay={Math.min(i, 2) * 60} className="min-w-0">
                  <div className="flex items-center gap-2.5">
                    <span className="stat-tile__icon shrink-0" aria-hidden>
                      <Icon size={15} strokeWidth={1.75} />
                    </span>
                    <p className="text-[13px] font-medium text-[#a4adbe]">{column.group}</p>
                  </div>
                  <ul className="mt-3 space-y-1.5">
                    {column.items.map((item) => (
                      <li key={item} className="text-[15px] leading-relaxed text-[#a4adbe]">
                        {item}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
