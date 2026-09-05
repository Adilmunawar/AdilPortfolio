'use client';

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { Award, Bot, Building2, Cloud, Linkedin, Maximize2, Server, X, type LucideIcon } from 'lucide-react';
import { Reveal } from './Reveal';

interface Certificate {
  src: string;
  alt: string;
  issuer: string;
  description: string;
  width: number;
  height: number;
}

// width/height are the source pixel sizes in public/certifications so each document keeps its own aspect ratio.
const certificates: Certificate[] = [
  { src: '/certifications/advance-webhook-concepts.png', alt: 'Advanced Webhook Concepts', issuer: 'Google Cloud', description: 'Advanced webhook concepts for real-time data synchronization between applications.', width: 1000, height: 909 },
  { src: '/certifications/advanced-performance-measurements.png', alt: 'Advanced Performance Measurements', issuer: 'Google', description: 'Enterprise performance measurement for high-speed applications.', width: 1000, height: 909 },
  { src: '/certifications/CCAI-frontend-Integrations.png', alt: 'CCAI Frontend Integrations', issuer: 'Google Cloud', description: 'Contact Center AI frontend integrations with user-centric interfaces.', width: 1000, height: 909 },
  { src: '/certifications/MLOPS.png', alt: 'MLOps', issuer: 'Google Cloud', description: 'MLOps workflows across the machine learning lifecycle.', width: 1000, height: 908 },
  { src: '/certifications/MLOPS-with-vertex-AI.png', alt: 'MLOps with Vertex AI', issuer: 'Google Cloud', description: 'Managing machine learning models at scale on Vertex AI.', width: 1000, height: 909 },
  { src: '/certifications/application-modern.png', alt: 'Application Modernization', issuer: 'Google Cloud', description: 'Modernizing legacy architectures for performance, scalability and security.', width: 1000, height: 909 },
  { src: '/certifications/Google-Ads-apps.png', alt: 'Google Ads Apps', issuer: 'Google', description: 'Building and integrating applications with Google Ads APIs.', width: 567, height: 435 },
  { src: '/certifications/building-language-models-on-AWS.png', alt: 'Building Language Models on AWS', issuer: 'AWS', description: 'Training and deploying language models on Amazon Web Services.', width: 981, height: 678 },
  { src: '/certifications/Linkedin-Content-and-creative-design.png', alt: 'Content and Creative Design', issuer: 'LinkedIn', description: 'Technical content and creative design fundamentals.', width: 810, height: 594 },
  { src: '/certifications/Microsoft-azure-professional.png', alt: 'Microsoft Azure Professional', issuer: 'Microsoft', description: 'Architecting secure, scalable solutions on Microsoft Azure.', width: 795, height: 537 },
  { src: '/certifications/anthropic---claude-with-amazon-bedrock.jpg', alt: 'Claude with Amazon Bedrock', issuer: 'Anthropic / AWS', description: 'Integrating and optimizing Claude models on Amazon Bedrock.', width: 1000, height: 773 },
  { src: '/certifications/digital-skill-web-analytics_certificate_of_achievement_v6zgddz_page-0001.jpg', alt: 'Digital Skills: Web Analytics', issuer: 'FutureLearn', description: 'Web analytics for data-driven decisions.', width: 708, height: 1000 },
  { src: '/certifications/software-egeenier-hacker-rank.png', alt: 'Software Engineer', issuer: 'HackerRank', description: 'Verified software engineering and problem-solving proficiency.', width: 1000, height: 750 },
  { src: '/certifications/agile-foundation-by-linkedin.jpeg', alt: 'Agile Foundations', issuer: 'LinkedIn / PMI', description: 'Agile foundations in collaboration with the Project Management Institute.', width: 1280, height: 989 },
];

const issuerIcon: Record<string, LucideIcon> = {
  'Google Cloud': Cloud,
  Google: Cloud,
  AWS: Server,
  Microsoft: Building2,
  LinkedIn: Linkedin,
  'LinkedIn / PMI': Linkedin,
  'Anthropic / AWS': Bot,
  FutureLearn: Award,
  HackerRank: Award,
};

// 2 cols under 640, 3 to 1023, 4 inside the 1120px container above.
const GRID_SIZES = '(max-width: 639px) 45vw, (max-width: 1023px) 30vw, 262px';
const LIGHTBOX_SIZES = '(max-width: 1023px) 100vw, 960px';

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const CertCard = ({ item, onOpen }: { item: Certificate; onOpen: (item: Certificate, opener: HTMLElement) => void }) => {
  const Icon = issuerIcon[item.issuer] ?? Award;
  return (
    <button
      type="button"
      onClick={(e) => onOpen(item, e.currentTarget)}
      aria-label={`View certificate: ${item.alt}, ${item.issuer}`}
      className="cert-card group flex h-full min-w-0 flex-col rounded-lg text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[rgba(0,102,255,0.45)]"
    >
      <div className="relative aspect-[5/4] w-full min-w-0">
        <Image src={item.src} alt="" fill sizes={GRID_SIZES} className="cert-doc object-contain" />
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
        <div className="relative h-[50svh] min-h-[220px] w-full p-4 sm:h-[58svh] sm:max-h-[620px] sm:p-6">
          <Image src={item.src} alt={item.alt} fill sizes={LIGHTBOX_SIZES} quality={90} className="cert-doc object-contain p-4 sm:p-6" />
        </div>
        <div className="min-w-0 border-t border-white/[0.06] px-4 py-4 sm:px-5 sm:py-5">
          <h3 id={titleId} className="text-[18px] font-semibold leading-[1.3] tracking-[-0.01em] text-[#f2f4f8] lg:text-[20px]">
            {item.alt}
          </h3>
          <p id={descId} className="mt-1.5 text-[15px] leading-relaxed text-[#a4adbe]">
            {item.description}
          </p>
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

  return (
    <>
      <div
        className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-8 lg:grid-cols-4"
        role="group"
        aria-label="Certifications"
        onKeyDown={onGridKey}
      >
        {certificates.map((item, i) => (
          <Reveal key={item.src} delay={(i % 4) * 50} className="min-w-0">
            <CertCard item={item} onOpen={open} />
          </Reveal>
        ))}
      </div>
      {active ? <Lightbox item={active} onClose={close} /> : null}
    </>
  );
};

export default Achievements;
