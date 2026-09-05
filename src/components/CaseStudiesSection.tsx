'use client';

import { useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { Clock, ArrowRight, FileSearch, Network, Database, BookOpen, type LucideIcon } from 'lucide-react';
import caseStudiesData from '@/lib/case-studies.json';
import { cn } from '@/lib/utils';
import { Reveal } from './Reveal';
import { DialogErrorBoundary } from './DialogErrorBoundary';
import { CaseStudyCover } from './covers/CaseStudyCover';
import type { CaseStudy } from './CaseStudyDialog';

const loadDialog = () => import('./CaseStudyDialog');
const CaseStudyDialog = dynamic(loadDialog, { ssr: false });

const WORDS_PER_MINUTE = 200;
const MAX_CHIPS = 3;

const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(0,102,255,0.45)]';

const CHIP =
  'inline-flex items-center h-6 px-2 rounded-[4px] bg-[#171d2b] border border-white/[0.06] text-[12px] text-[#a4adbe] transition-colors duration-150 md:hover:border-[rgba(0,102,255,0.45)] md:hover:bg-[rgba(0,102,255,0.12)] md:hover:text-[#f2f4f8]';

const COVER_ICON: Record<string, LucideIcon> = {
  'recruitment-engine': FileSearch,
  'agent-orchestration': Network,
  'realtime-data': Database,
};

function readingTimeMinutes(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

const READ_TIME: Record<number, number> = Object.fromEntries(
  caseStudiesData.map((s) => [s.id, readingTimeMinutes(s.content)])
);

function Hairline({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('group relative rounded-[13px] p-px', className)}>
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-[13px] bg-[linear-gradient(135deg,rgba(255,255,255,0.16),rgba(255,255,255,0.05)_45%,rgba(0,102,255,0.32))]"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-[13px] opacity-0 transition-opacity duration-200 md:group-hover:opacity-100 bg-[linear-gradient(135deg,rgba(92,157,255,0.6),rgba(255,255,255,0.12)_45%,rgba(0,102,255,0.7))]"
      />
      <div className="relative h-full rounded-[12px] bg-[#111622] transition-colors duration-150 md:group-hover:bg-[#141a28]">
        {children}
      </div>
    </div>
  );
}

function CaseStudyCard({ study, index, onOpen }: { study: CaseStudy; index: number; onOpen: (s: CaseStudy) => void }) {
  const preload = () => { loadDialog(); };
  const chips = study.techStack.slice(0, MAX_CHIPS);
  const overflow = study.techStack.length - chips.length;
  const Icon = COVER_ICON[study.cover] ?? BookOpen;

  return (
    <Reveal delay={(index % 3) * 60} className="h-full">
      <Hairline className="h-full">
        <article
          role="button"
          tabIndex={0}
          aria-label={`Read case study: ${study.title}`}
          onClick={() => onOpen(study)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOpen(study);
            }
          }}
          onMouseEnter={preload}
          onTouchStart={preload}
          onFocus={preload}
          className={cn('h-full flex flex-col rounded-[12px] overflow-hidden cursor-pointer', FOCUS)}
        >
          <div className="relative aspect-[16/9] bg-[#0b0f17] border-b border-white/[0.06] overflow-hidden">
            <CaseStudyCover cover={study.cover} title={study.title} className="absolute inset-0 w-full h-full" />
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#111622]/80 to-transparent"
            />
          </div>

          <div className="flex flex-col flex-1 p-3 md:p-6">
            <div className="flex items-center gap-2 text-[10px] md:text-[12px] text-[#6f7888]">
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] bg-[rgba(0,102,255,0.12)] border border-[rgba(0,102,255,0.22)] text-[#5c9dff]">
                <Icon size={14} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <span className="font-mono">Case study {String(index + 1).padStart(2, '0')}</span>
            </div>
            <h3 className="mt-2 md:mt-3 text-[13px] sm:text-[16px] md:text-[20px] font-semibold tracking-[-0.01em] leading-[1.3] text-[#f2f4f8]">
              {study.title}
            </h3>
            <p className="mt-1.5 md:mt-2 text-[11px] sm:text-[13px] md:text-[15px] leading-[1.5] md:leading-[1.6] text-[#a4adbe] line-clamp-2 md:line-clamp-3">{study.excerpt}</p>

            <ul className="mt-3 hidden sm:flex flex-wrap gap-1.5 md:mt-4" aria-label="Technologies">
              {chips.map((tech) => (
                <li key={tech} className={CHIP}>
                  {tech}
                </li>
              ))}
              {overflow > 0 && <li className="inline-flex items-center h-6 px-2 text-[12px] text-[#6f7888]">+{overflow}</li>}
            </ul>

            <div className="mt-auto pt-2.5 md:pt-4 flex items-center justify-between gap-2 border-t border-white/[0.06] min-h-[36px] md:min-h-[44px]">
              <span className="inline-flex items-center gap-1.5 text-[10px] md:text-[12px] text-[#6f7888]">
                <Clock size={12} strokeWidth={1.75} aria-hidden="true" />
                {READ_TIME[study.id]} min read
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] md:text-[13px] font-medium text-[#5c9dff] transition-colors duration-150 md:group-hover:text-[#f2f4f8]">
                Read case study
                <ArrowRight
                  size={14}
                  aria-hidden="true"
                  className="transition-transform duration-200 ease-out-quart md:group-hover:translate-x-1"
                />
              </span>
            </div>
          </div>
        </article>
      </Hairline>
    </Reveal>
  );
}

export default function CaseStudiesSection() {
  const [selectedPost, setSelectedPost] = useState<CaseStudy | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleReadMore = (post: CaseStudy) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  return (
    <>
      <section id="case-studies" className="py-10 md:py-28 px-5 md:px-8">
        <div className="max-w-[1120px] mx-auto">
          <Reveal className="max-w-[680px]">
            <h2 className="text-[24px] md:text-[40px] font-semibold tracking-[-0.02em] leading-[1.15] text-[#f2f4f8]">
              Case studies
            </h2>
            <p className="mt-3 md:mt-4 text-[15px] md:text-[20px] leading-[1.5] text-[#a4adbe]">
              Longer write-ups on how three systems were designed, what broke, and what I&apos;d change.
            </p>
          </Reveal>

          <div className="mt-6 md:mt-12 grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {caseStudiesData.map((study, index) => (
              <CaseStudyCard key={study.id} study={study} index={index} onOpen={handleReadMore} />
            ))}
          </div>
        </div>
      </section>

      {selectedPost && (
        <DialogErrorBoundary label="case study" onClose={() => setIsModalOpen(false)}>
          <CaseStudyDialog post={selectedPost} open={isModalOpen} onOpenChange={setIsModalOpen} />
        </DialogErrorBoundary>
      )}
    </>
  );
}
