'use client';

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { Award, Bot, Building2, Cloud, Database, Github, GraduationCap, Linkedin, Maximize2, Satellite, Server, ShieldCheck, Sigma, X, type LucideIcon } from 'lucide-react';
import { Reveal } from './Reveal';

interface Certificate {
  tier?: 'badge';
  src?: string;
  width?: number;
  height?: number;
  alt: string;
  issuer: string;
  description: string;
  issued?: string;
  credentialId?: string;
}

const certificates: Certificate[] = [
  { alt: 'Operationalising EU Space for Security', issuer: 'EUSPA', description: 'EU Agency for the Space Programme course on operationalising EU space services for border security and geospatial intelligence.', issued: 'Aug 2026', credentialId: '6966612178c62e5fe0048a0f' },
  { src: '/certifications/matlab-onramp.jpg', width: 1014, height: 824, alt: 'MATLAB Onramp', issuer: 'MathWorks', description: 'Hands-on introduction to MATLAB for numerical computing and data analysis.', issued: 'Jul 2026' },
  { alt: 'Advanced CloudFormation: Macros', issuer: 'AWS', description: 'Extending AWS CloudFormation templates with macros for reusable infrastructure as code.', issued: 'Jul 2026' },
  { alt: 'Machine Learning with Python', issuer: 'MIT Professional Education', description: 'Supervised and unsupervised learning foundations implemented in Python.', issued: 'Jul 2026', credentialId: '4b7ac91e0f3d82c56a19fe0332d8a17' },
  { alt: 'Computational Probability and Inference', issuer: 'MIT Professional Education', description: 'Probabilistic modelling and inference methods for data-driven systems.', issued: 'Jun 2026', credentialId: 'e4ecfea7a7014b2483579dd1e7356c23' },
  { alt: 'Microsoft Certified: Azure AI Fundamentals', issuer: 'Microsoft', description: 'Core machine learning and AI workload concepts on Microsoft Azure (AI-900).', issued: 'Jun 2026', credentialId: 'df469yub' },
  { src: '/certifications/digital-skill-web-analytics_certificate_of_achievement_v6zgddz_page-0001.jpg', width: 708, height: 1000, alt: 'Web Analytics by Accenture', issuer: 'Accenture / FutureLearn', description: 'Web analytics for data-driven decisions, delivered by Accenture on FutureLearn.', issued: 'Apr 2026', credentialId: 'v6zgddz' },
  { src: '/certifications/software-egeenier-hacker-rank.png', width: 1000, height: 750, alt: 'Certified Software Engineer', issuer: 'HackerRank', description: 'Verified software engineering and problem-solving proficiency.', issued: 'Apr 2026', credentialId: 'b6411a6e46da' },
  { src: '/certifications/agile-foundation-by-linkedin.jpeg', width: 1280, height: 989, alt: 'Agile Foundations', issuer: 'LinkedIn / PMI', description: 'Agile foundations in collaboration with the Project Management Institute.', issued: 'Apr 2026' },
  { src: '/certifications/sql-relational-databases.jpg', width: 1140, height: 810, alt: 'SQL and Relational Databases 101', issuer: 'Cognitive Class / IBM Skills Network', description: 'Relational database design and SQL querying fundamentals.', issued: 'Mar 2026', credentialId: '6acdbc63fde448e3a5d2304cd0333ea8' },
  { src: '/certifications/anthropic---claude-with-amazon-bedrock.jpg', width: 1000, height: 773, alt: 'Claude in Amazon Bedrock', issuer: 'Anthropic', description: 'Integrating and optimizing Claude models on Amazon Bedrock, including the Model Context Protocol.', issued: 'Mar 2026', credentialId: 'wfq8d7zjnka8' },
  { alt: 'Chronicle SOAR Developer', issuer: 'Google Cloud Skills Boost', description: 'Building security orchestration, automation and response playbooks on Google Chronicle SOAR.', issued: 'Feb 2026', credentialId: '22073529' },
  { src: '/certifications/building-language-models-on-AWS.png', width: 981, height: 678, alt: 'Building Language Models on AWS', issuer: 'AWS', description: 'Training and deploying language models on Amazon Web Services.', issued: 'Dec 2025' },
  { src: '/certifications/Google-Ads-apps.png', width: 567, height: 435, alt: 'Google Ads Apps Certification', tier: 'badge', issuer: 'Google Cloud Skills Boost', description: 'Building and integrating applications with Google Ads APIs.', issued: 'Dec 2025', credentialId: '169263387' },
  { src: '/certifications/Microsoft-azure-professional.png', width: 795, height: 537, alt: 'Azure Cloud Computing', issuer: 'Microsoft', description: 'Architecting secure, scalable solutions on Microsoft Azure.', issued: 'May 2025', credentialId: 'AdilMunawar4765' },
  { src: '/certifications/application-modern.png', width: 1000, height: 909, alt: 'Application Modernization with Google Cloud', tier: 'badge', issuer: 'Google', description: 'Modernizing legacy architectures for performance, scalability and security.', issued: 'Mar 2025', credentialId: '14164265' },
  { src: '/certifications/Linkedin-Content-and-creative-design.png', width: 810, height: 594, alt: 'LinkedIn Content and Creative Design', issuer: 'LinkedIn', description: 'Technical content and creative design fundamentals.', issued: 'Mar 2025', credentialId: 'zn7dbp7a2cw3' },
  { alt: 'GitHub Admin', issuer: 'GitHub', description: 'Administering GitHub organisations, repositories and access, including the GitHub MCP server.', issued: 'Mar 2025' },
  { src: '/certifications/MLOPS-with-vertex-AI.png', width: 1000, height: 909, alt: 'MLOps with Vertex AI', tier: 'badge', issuer: 'Google', description: 'Managing machine learning models at scale on Vertex AI.', issued: 'Feb 2025', credentialId: '14116643' },
  { src: '/certifications/MLOPS.png', width: 1000, height: 908, alt: 'Machine Learning Operations for Generative AI', tier: 'badge', issuer: 'Google', description: 'MLOps workflows across the machine learning lifecycle for generative AI.', issued: 'Feb 2025', credentialId: '14101465' },
  { src: '/certifications/advance-webhook-concepts.png', width: 1000, height: 909, alt: 'Advanced Webhook Concepts', tier: 'badge', issuer: 'Google Cloud', description: 'Advanced webhook concepts for real-time data synchronization between applications.' },
  { src: '/certifications/advanced-performance-measurements.png', width: 1000, height: 909, alt: 'Advanced Performance Measurements', tier: 'badge', issuer: 'Google', description: 'Enterprise performance measurement for high-speed applications.' },
  { src: '/certifications/CCAI-frontend-Integrations.png', width: 1000, height: 909, alt: 'CCAI Frontend Integrations', tier: 'badge', issuer: 'Google Cloud', description: 'Contact Center AI frontend integrations with user-centric interfaces.' },
];

const issuerIcon: Record<string, LucideIcon> = {
  'Google Cloud': Cloud,
  'Google Cloud Skills Boost': Cloud,
  Google: Cloud,
  AWS: Server,
  Microsoft: Building2,
  LinkedIn: Linkedin,
  'LinkedIn / PMI': Linkedin,
  Anthropic: Bot,
  'Accenture / FutureLearn': Award,
  HackerRank: Award,
  EUSPA: Satellite,
  MathWorks: Sigma,
  'MIT Professional Education': GraduationCap,
  'Cognitive Class': Database,
  'Cognitive Class / IBM Skills Network': Database,
  GitHub: Github,
  'Chronicle SOAR': ShieldCheck,
};

// 2 cols under 640, 3 to 1023, 4 inside the 1120px container above.
const GRID_SIZES = '(max-width: 639px) 45vw, (max-width: 1023px) 30vw, 262px';
const LIGHTBOX_SIZES = '(max-width: 1023px) 100vw, 960px';

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const CredentialPlate = ({ item, Icon, large }: { item: Certificate; Icon: LucideIcon; large?: boolean }) => (
  <div className="cert-plate absolute inset-0 flex flex-col justify-between overflow-hidden rounded-[8px] border border-white/[0.06] bg-[linear-gradient(135deg,#111622,#171d2b_60%,#111622)] p-3 sm:p-4">
    <span aria-hidden className="cert-plate__grid absolute inset-0" />
    <span aria-hidden className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#0066ff]/15" />
    <div className="relative flex items-center justify-between">
      <span className={`inline-flex items-center justify-center rounded-md bg-[#0066ff]/15 text-[#5c9dff] ${large ? 'h-14 w-14' : 'h-9 w-9'}`}>
        <Icon size={large ? 28 : 18} strokeWidth={1.5} />
      </span>
      {item.issued && <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#6f7888]">{item.issued}</span>}
    </div>
    <div className="relative min-w-0">
      <p className={`font-semibold leading-snug text-[#f2f4f8] ${large ? 'text-[20px]' : 'line-clamp-2 text-[13px]'}`}>{item.alt}</p>
      <p className="mt-1 truncate text-[11px] text-[#a4adbe]">{item.issuer}</p>
      {item.credentialId && large && <p className="mt-2 font-mono text-[11px] text-[#6f7888]">Credential ID {item.credentialId}</p>}
    </div>
  </div>
);

const CertCard = ({ item, onOpen }: { item: Certificate; onOpen: (item: Certificate, opener: HTMLElement) => void }) => {
  const Icon = issuerIcon[item.issuer] ?? Award;
  return (
    <button
      type="button"
      onClick={(e) => onOpen(item, e.currentTarget)}
      aria-label={`View certificate: ${item.alt}, ${item.issuer}`}
      className="cert-card group flex h-full min-w-0 flex-col rounded-lg text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[rgba(0,102,255,0.45)]"
    >
      <div className="relative w-full min-w-0" style={{ aspectRatio: item.src && item.width && item.height ? `${item.width} / ${item.height}` : '5 / 4' }}>
        {item.src ? (
          <Image src={item.src} alt="" fill sizes={GRID_SIZES} className="cert-doc object-contain" />
        ) : (
          <CredentialPlate item={item} Icon={Icon} />
        )}
      </div>
      <div className="mt-3 flex min-w-0 flex-1 flex-col gap-1.5 px-0.5">
        <div className="flex items-center gap-2">
          <span className="stat-tile__icon cert-issuer shrink-0" aria-hidden>
            <Icon size={13} strokeWidth={1.75} />
          </span>
          <span className="min-w-0 flex-1 truncate text-[12px] text-[#6f7888]">{item.issuer}</span>
          <span className="cert-view inline-flex shrink-0 items-center gap-1 text-[12px] font-medium text-[#6f7888]" aria-hidden>
            View
            <Maximize2 size={12} strokeWidth={1.75} />
          </span>
        </div>
        <span className="line-clamp-2 text-[14px] font-medium leading-snug text-[#f2f4f8]">{item.alt}</span>
      </div>
    </button>
  );
};

const Lightbox = ({ item, onClose }: { item: Certificate; onClose: () => void }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descId = useId();
  const Icon = issuerIcon[item.issuer] ?? Award;

  useEffect(() => {
    const { overflow, paddingRight } = document.body.style;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !panelRef.current.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [onClose]);

  return createPortal(
    <div
      className="cert-lightbox fixed inset-0 z-[60] flex items-center justify-center bg-[#0b0f17]/90 p-4 sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        onClick={(e) => e.stopPropagation()}
        className="cert-lightbox__panel relative flex max-h-[calc(100svh-2rem)] w-full max-w-[960px] flex-col overflow-hidden rounded-xl border border-white/[0.10] bg-[#111622] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)] sm:max-h-[calc(100svh-3rem)]"
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] py-2 pl-4 pr-2 sm:pl-5">
          <span className="flex min-w-0 items-center gap-2.5">
            <span className="stat-tile__icon cert-issuer shrink-0" aria-hidden>
              <Icon size={13} strokeWidth={1.75} />
            </span>
            <span className="truncate text-[13px] text-[#a4adbe]">{item.issuer}</span>
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-[#a4adbe] transition-colors duration-150 hover:bg-[#171d2b] hover:text-[#f2f4f8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(0,102,255,0.45)]"
          >
            <X size={18} strokeWidth={1.75} aria-hidden />
          </button>
        </div>
        <div className={`relative w-full ${item.src ? 'h-[50svh] min-h-[220px] p-4 sm:h-[58svh] sm:max-h-[620px] sm:p-6' : 'h-[36svh] min-h-[220px] p-4 sm:h-[40svh] sm:max-h-[360px] sm:p-6'}`}>
          {item.src ? (
            <Image src={item.src} alt={item.alt} fill sizes={LIGHTBOX_SIZES} quality={90} className="cert-doc object-contain p-4 sm:p-6" />
          ) : (
            <div className="relative h-full w-full"><CredentialPlate item={item} Icon={Icon} large /></div>
          )}
        </div>
        <div className="min-w-0 border-t border-white/[0.06] px-4 py-4 sm:px-5 sm:py-5">
          <h3 id={titleId} className="text-[18px] font-semibold leading-[1.3] tracking-[-0.01em] text-[#f2f4f8] lg:text-[20px]">
            {item.alt}
          </h3>
          <p id={descId} className="mt-1.5 text-[15px] leading-relaxed text-[#a4adbe]">
            {item.description}
          </p>
          {(item.issued || item.credentialId) && (
            <p className="mt-2 font-mono text-[12px] text-[#6f7888]">
              {item.issued && <span>Issued {item.issued}</span>}
              {item.issued && item.credentialId && <span> · </span>}
              {item.credentialId && <span>Credential ID {item.credentialId}</span>}
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

const Achievements = () => {
  const [active, setActive] = useState<Certificate | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const open = useCallback((item: Certificate, opener: HTMLElement) => {
    openerRef.current = opener;
    setActive(item);
  }, []);

  const close = useCallback(() => {
    setActive(null);
    const opener = openerRef.current;
    openerRef.current = null;
    if (opener) requestAnimationFrame(() => opener.focus());
  }, []);

  const onGridKey = useCallback((e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const target = e.target as HTMLElement;
    const cards = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('.cert-card'));
    const i = cards.indexOf(target);
    if (i === -1) return;
    e.preventDefault();
    cards[(i + (e.key === 'ArrowRight' ? 1 : cards.length - 1)) % cards.length]?.focus();
  }, []);

  const documents = certificates.filter((c) => c.tier !== 'badge');
  const badges = certificates.filter((c) => c.tier === 'badge');

  return (
    <>
      <div className="cert-masonry" onKeyDown={onGridKey}>
        {documents.map((item, i) => (
          <Reveal key={item.alt} delay={(i % 4) * 50} className="cert-masonry__item">
            <CertCard item={item} onOpen={open} />
          </Reveal>
        ))}
      </div>

      <div className="mt-10 lg:mt-14">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
          <h3 className="text-[16px] font-semibold tracking-[-0.01em] text-[#f2f4f8] lg:text-[18px]">Skill badges</h3>
          <p className="text-[13px] text-[#6f7888]">Google Cloud Skills Boost completion badges.</p>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-7" onKeyDown={onGridKey}>
          {badges.map((item, i) => (
            <Reveal key={item.alt} delay={(i % 7) * 40}>
              <button
                type="button"
                onClick={(e) => open(item, e.currentTarget)}
                aria-label={`View badge: ${item.alt}, ${item.issuer}`}
                className="cert-card group flex w-full flex-col rounded-lg text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[rgba(0,102,255,0.45)]"
              >
                <div className="relative w-full" style={{ aspectRatio: item.width && item.height ? `${item.width} / ${item.height}` : '1 / 1' }}>
                  {item.src && <Image src={item.src} alt="" fill sizes="(max-width: 639px) 30vw, (max-width: 1023px) 22vw, 150px" className="cert-doc object-contain" />}
                </div>
                <span className="mt-2 line-clamp-2 text-[11px] font-medium leading-snug text-[#a4adbe] sm:text-[12px]">{item.alt}</span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {active && <Lightbox item={active} onClose={close} />}
    </>
  );
};

export default Achievements;
