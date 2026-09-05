'use client';

import { useEffect, useRef, useState } from 'react';
import { Copy, Check, Clock, Link2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { SyntaxHighlighter, atomDark } from '@/lib/syntax-highlighter';
import { CaseStudyCover } from './covers/CaseStudyCover';
import { ArticleFigure } from './covers/ArticleFigure';
import type caseStudiesData from '@/lib/case-studies.json';

const MermaidDiagram = dynamic(() => import('./ui/MermaidDiagram').then(mod => mod.MermaidDiagram), { ssr: false });

export type CaseStudy = (typeof caseStudiesData)[number];

const WORDS_PER_MINUTE = 200;

const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(0,102,255,0.45)]';

const PROSE =
  'prose prose-invert max-w-none break-words text-[16px] leading-[1.65] ' +
  'prose-p:text-[#a4adbe] prose-li:text-[#a4adbe] prose-headings:text-[#f2f4f8] prose-headings:font-semibold prose-headings:tracking-[-0.01em] ' +
  'prose-strong:text-[#f2f4f8] prose-a:text-[#5c9dff] prose-a:no-underline hover:prose-a:underline prose-hr:border-white/[0.06] ' +
  'prose-blockquote:border-white/[0.16] prose-blockquote:text-[#a4adbe] prose-blockquote:font-normal prose-blockquote:not-italic ' +
  'prose-table:block prose-table:max-w-full prose-table:overflow-x-auto prose-th:text-[#f2f4f8] prose-th:whitespace-nowrap prose-tr:border-white/[0.06] ' +
  'prose-pre:bg-transparent prose-pre:p-0 prose-img:rounded-[8px]';

function readingTimeMinutes(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
  const [isCopied, setIsCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const lang = match ? match[1] : 'bash';

  if (lang === 'mermaid') {
    return <MermaidDiagram chart={String(children)} />;
  }
  if (lang === 'figure') {
    return <ArticleFigure source={String(children)} />;
  }

  const handleCopy = () => {
    navigator.clipboard?.writeText(String(children).replace(/\n$/, '')).catch(() => {});
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return !inline && match ? (
    <div className="my-6 rounded-[8px] bg-[#0b0f17] border border-white/[0.06] overflow-hidden">
      <div className="flex items-stretch justify-between pl-4 pr-2 min-h-[44px] bg-[#171d2b] border-b border-white/[0.06]">
        <span className="flex items-center font-mono text-[12px] text-[#6f7888]">{lang}</span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code"
          className={cn('flex items-center gap-1.5 px-2 text-[13px] font-medium text-[#a4adbe] hover:text-[#f2f4f8] transition-colors duration-150', FOCUS)}
        >
          {isCopied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
          {isCopied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter
        style={atomDark}
        language={lang}
        PreTag="div"
        {...props}
        customStyle={{ margin: 0, padding: '1.25rem', background: 'transparent', fontSize: '0.8125rem' }}
        wrapLines={true}
        wrapLongLines={true}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  ) : (
    <code className={cn('font-mono text-[0.875em] bg-[#171d2b] text-[#f2f4f8] px-1.5 py-0.5 rounded-[4px] border border-white/[0.06] before:content-none after:content-none', className)} {...props}>
      {children}
    </code>
  );
};

interface CaseStudyDialogProps {
  post: CaseStudy;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CaseStudyDialog({ post, open, onOpenChange }: CaseStudyDialogProps) {
  const scrollRootRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const copyTimer = useRef<number | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const readTime = readingTimeMinutes(post.content);

  useEffect(() => () => { if (copyTimer.current) window.clearTimeout(copyTimer.current); }, []);

  const copyLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}#case-studies`;
    try {
      await navigator.clipboard?.writeText(url).catch(() => {});
      setLinkCopied(true);
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setLinkCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  useEffect(() => {
    if (!open) return;
    const root = scrollRootRef.current;
    const viewport = root?.querySelector<HTMLElement>('[data-radix-scroll-area-viewport]');
    const bar = progressRef.current;
    if (!viewport || !bar) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const max = viewport.scrollHeight - viewport.clientHeight;
      const p = max > 0 ? viewport.scrollTop / max : 0;
      bar.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    viewport.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => viewport.removeEventListener('scroll', onScroll);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[100vw] h-[100dvh] max-w-none rounded-none border-0 sm:border sm:border-white/[0.06] sm:w-[95vw] sm:h-[90vh] sm:max-w-4xl sm:rounded-[16px] bg-[#111622] text-[#f2f4f8] p-0 gap-0 overflow-hidden shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)]">
        <div
          ref={progressRef}
          className="absolute top-0 left-0 right-0 h-0.5 bg-[#0066ff] origin-left z-50"
          style={{ transform: 'scaleX(0)' }}
        />

        <div className="flex flex-col h-full min-h-0">
          <div className="px-5 py-4 pr-14 md:px-8 md:pr-16 border-b border-white/[0.06] shrink-0">
            <div className="max-w-[680px] mx-auto min-w-0 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-[#a4adbe]">Case study</p>
                <DialogTitle className="mt-1 text-[20px] md:text-[24px] font-semibold tracking-[-0.01em] leading-[1.3] text-[#f2f4f8] break-words line-clamp-2">
                  {post.title}
                </DialogTitle>
                <DialogDescription className="sr-only">{post.excerpt}</DialogDescription>
                <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[#6f7888]">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={12} strokeWidth={1.75} aria-hidden="true" />
                    {readTime} min read
                  </span>
                  <span className="truncate">{post.techStack.join(', ')}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={copyLink}
                aria-live="polite"
                aria-label={linkCopied ? 'Link copied' : 'Copy link to case studies'}
                className={cn(
                  'relative shrink-0 mt-0.5 inline-flex items-center gap-1.5 h-9 px-3 rounded-[8px] border border-white/[0.10] bg-[#171d2b] text-[13px] font-medium text-[#f2f4f8] transition-colors duration-150 md:hover:border-[rgba(0,102,255,0.45)] md:hover:bg-[rgba(0,102,255,0.12)] before:absolute before:inset-x-0 before:-top-1 before:-bottom-1 before:content-[""]',
                  FOCUS
                )}
              >
                {linkCopied ? (
                  <Check size={14} className="text-[#3ddc84]" aria-hidden="true" />
                ) : (
                  <Link2 size={14} aria-hidden="true" />
                )}
                <span className="hidden sm:inline">{linkCopied ? 'Copied' : 'Copy link'}</span>
              </button>
            </div>
          </div>

          <ScrollArea ref={scrollRootRef} className="flex-1 min-h-0">
            <div className="max-w-[680px] mx-auto px-5 md:px-8 py-6 md:py-10">
              <div className="relative w-full aspect-video rounded-[8px] overflow-hidden mb-8 border border-white/[0.06] bg-[#0b0f17]">
                <CaseStudyCover cover={post.cover} title={post.title} className="absolute inset-0 w-full h-full" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-8 md:mb-10">
                <div className="rounded-[8px] border border-white/[0.06] bg-[#171d2b] p-4 md:p-5">
                  <p className="text-[13px] font-medium text-[#f2f4f8]">Challenge</p>
                  <p className="mt-2 text-[15px] leading-[1.6] text-[#a4adbe]">{post.challenge}</p>
                </div>
                <div className="rounded-[8px] border border-white/[0.06] bg-[#171d2b] p-4 md:p-5">
                  <p className="text-[13px] font-medium text-[#f2f4f8]">Solution</p>
                  <p className="mt-2 text-[15px] leading-[1.6] text-[#a4adbe]">{post.solution}</p>
                </div>
              </div>

              <div className={PROSE}>
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ code: CodeBlock }}>
                  {post.content}
                </ReactMarkdown>
              </div>

              <div className="mt-10 md:mt-14 pt-6 border-t border-white/[0.06] flex items-center justify-between gap-4">
                <p className="text-[13px] text-[#6f7888]">End of case study</p>
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className={cn('inline-flex items-center justify-center h-10 px-4 rounded-[8px] border border-white/[0.10] hover:border-white/[0.16] text-[14px] font-medium text-[#f2f4f8] transition-colors duration-150', FOCUS)}
                >
                  Close
                </button>
              </div>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
