'use client';
import { useState, type KeyboardEvent, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { Clock, Tag, ArrowRight, PenLine } from 'lucide-react';
import blogData from '@/lib/blog-data.json';
import { cn } from '@/lib/utils';
import { Reveal } from './Reveal';
import { DialogErrorBoundary } from './DialogErrorBoundary';
import { NoteCover } from './covers/NoteCover';
import type { BlogPost } from './BlogPostDialog';

const loadDialog = () => import('./BlogPostDialog');
const BlogPostDialog = dynamic(loadDialog, { ssr: false });

const WORDS_PER_MINUTE = 200;

const readingTime = (content: string) => {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
};

const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(0,102,255,0.45)]';

const GRADIENT_REST =
  'bg-[linear-gradient(135deg,rgba(255,255,255,0.16),rgba(255,255,255,0.05)_45%,rgba(0,102,255,0.32))]';
const GRADIENT_HOVER =
  'bg-[linear-gradient(135deg,rgba(92,157,255,0.6),rgba(255,255,255,0.12)_45%,rgba(0,102,255,0.7))]';

function Hairline({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('group relative rounded-[13px] p-px', className)}>
      <span aria-hidden="true" className={cn('absolute inset-0 rounded-[13px]', GRADIENT_REST)} />
      <span
        aria-hidden="true"
        className={cn('absolute inset-0 rounded-[13px] opacity-0 transition-opacity duration-200 md:group-hover:opacity-100', GRADIENT_HOVER)}
      />
      <div className="relative h-full rounded-[12px] bg-[#111622] transition-colors duration-150 md:group-hover:bg-[#141a28]">
        {children}
      </div>
    </div>
  );
}

const Meta = ({ post, className = '' }: { post: BlogPost; className?: string }) => (
  <p className={cn('flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[#6f7888]', className)}>
    <span className="inline-flex items-center gap-1.5">
      <Clock size={12} strokeWidth={1.75} aria-hidden="true" />
      {readingTime(post.content)} min read
    </span>
    <span className="inline-flex items-center gap-1.5 min-w-0">
      <Tag size={12} strokeWidth={1.75} aria-hidden="true" />
      <span className="truncate">{post.tags.slice(0, 3).join(', ')}</span>
    </span>
  </p>
);

const BlogSection = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openPost = (post: BlogPost) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const onCardKeyDown = (e: KeyboardEvent<HTMLElement>, post: BlogPost) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openPost(post);
    }
  };

  const preload = () => { loadDialog(); };
  const [featured, ...rest] = blogData;

  return (
    <>
      <section id="blog" className="py-10 md:py-28 px-5 md:px-8">
        <div className="max-w-[1120px] mx-auto">
          <Reveal className="mx-auto max-w-[680px] text-center">
            <h2 className="text-[24px] md:text-[40px] font-semibold tracking-[-0.02em] leading-[1.15] text-[#f2f4f8]">
              Notes
            </h2>
          </Reveal>

          <div className="mt-6 md:mt-12 grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-6">
            {featured && (
              <Reveal className="lg:col-span-7 lg:self-start">
                <Hairline>
                  <article
                    role="button"
                    tabIndex={0}
                    aria-label={`Read note: ${featured.title}`}
                    onClick={() => openPost(featured)}
                    onKeyDown={(e) => onCardKeyDown(e, featured)}
                    onMouseEnter={preload}
                    onTouchStart={preload}
                    onFocus={preload}
                    className={cn('h-full flex flex-col rounded-[12px] overflow-hidden cursor-pointer', FOCUS)}
                  >
                    <div className="relative aspect-video bg-[#0b0f17] border-b border-white/[0.06] overflow-hidden">
                      <NoteCover cover={featured.cover} title={featured.title} className="absolute inset-0 w-full h-full pointer-events-none" />
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#111622]/80 to-transparent"
                      />
                      <span className="absolute left-4 bottom-4 inline-flex items-center gap-2 text-[12px] text-[#a4adbe]">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-[6px] bg-[#111622]/90 border border-[rgba(0,102,255,0.22)] text-[#5c9dff]">
                          <PenLine size={14} strokeWidth={1.75} aria-hidden="true" />
                        </span>
                        Latest note
                      </span>
                    </div>
                    <div className="p-3.5 md:p-6 flex flex-col flex-grow">
                      <Meta post={featured} />
                      <h3 className="mt-2 text-[15px] md:text-[20px] font-semibold tracking-[-0.01em] leading-[1.3] text-[#f2f4f8]">
                        {featured.title}
                      </h3>
                      <p className="mt-2 text-[12px] md:text-[15px] leading-[1.5] md:leading-[1.6] text-[#a4adbe] line-clamp-2 md:line-clamp-3">{featured.excerpt}</p>
                      <span className="mt-auto pt-4 inline-flex items-center gap-1.5 min-h-[44px] text-[13px] font-medium text-[#5c9dff] transition-colors duration-150 md:group-hover:text-[#f2f4f8]">
                        Read note
                        <ArrowRight
                          size={14}
                          aria-hidden="true"
                          className="transition-transform duration-200 ease-out-quart md:group-hover:translate-x-1"
                        />
                      </span>
                    </div>
                  </article>
                </Hairline>
              </Reveal>
            )}

            {rest.length > 0 && (
              <div className="lg:col-span-5 flex flex-col border-t border-white/[0.06]">
                {rest.map((post, index) => (
                  <Reveal key={post.id} delay={(index + 1) * 60} className="border-b border-white/[0.06]">
                    <article
                      role="button"
                      tabIndex={0}
                      aria-label={`Read note: ${post.title}`}
                      onClick={() => openPost(post)}
                      onKeyDown={(e) => onCardKeyDown(e, post)}
                      onMouseEnter={preload}
                      onTouchStart={preload}
                      onFocus={preload}
                      className={cn(
                        'group flex items-start gap-3 md:gap-4 py-2.5 md:py-5 px-2 -mx-2 rounded-[8px] cursor-pointer transition-colors duration-150 md:hover:bg-[#171d2b]',
                        FOCUS
                      )}
                    >
                      <span className={cn('relative shrink-0 rounded-[9px] p-px', GRADIENT_REST)}>
                        <span
                          aria-hidden="true"
                          className={cn('absolute inset-0 rounded-[9px] opacity-0 transition-opacity duration-200 md:group-hover:opacity-100', GRADIENT_HOVER)}
                        />
                        <span className="relative block w-16 h-10 md:w-24 md:h-[60px] rounded-[8px] overflow-hidden bg-[#0b0f17]">
                          <NoteCover cover={post.cover} title={post.title} className="absolute inset-0 w-full h-full pointer-events-none" />
                        </span>
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-[13px] md:text-[18px] font-semibold tracking-[-0.01em] leading-[1.3] text-[#f2f4f8] line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="mt-1 hidden md:block text-[14px] leading-[1.5] text-[#a4adbe] line-clamp-2">{post.excerpt}</p>
                        <Meta post={post} className="mt-1 md:mt-2" />
                      </div>
                      <ArrowRight
                        size={16}
                        aria-hidden="true"
                        className="hidden sm:block shrink-0 mt-1 text-[#6f7888] transition-[transform,color] duration-200 ease-out-quart md:group-hover:translate-x-1 md:group-hover:text-[#5c9dff]"
                      />
                    </article>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {selectedPost && (
        <DialogErrorBoundary label="note" onClose={() => setIsModalOpen(false)}>
          <BlogPostDialog post={selectedPost} open={isModalOpen} onOpenChange={setIsModalOpen} />
        </DialogErrorBoundary>
      )}
    </>
  );
};

export default BlogSection;
