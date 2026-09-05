'use client';
import type { CoverComponent } from './shared';
import { ARTICLE_FIGURES } from './articles';

export const FIGURES: Record<string, CoverComponent> = ARTICLE_FIGURES;

/* Markdown fence: ```figure\n<id>\n<optional caption>\n``` */
export function ArticleFigure({ source }: { source: string }) {
  const [id, ...rest] = source.trim().split('\n');
  const caption = rest.join(' ').trim();
  const Comp = FIGURES[id?.trim()];
  if (!Comp) return null;
  const uid = `fig-${id.trim().replace(/[^a-z0-9]+/gi, '-')}`;
  return (
    <figure className="my-6">
      <div className="aspect-video w-full overflow-hidden rounded-[12px] border border-white/[0.06] bg-[#0b0f17]">
        <Comp uid={uid} title={caption || id} className="block h-full w-full" />
      </div>
      {caption && <figcaption className="mt-2 text-[13px] leading-snug text-[#6f7888]">{caption}</figcaption>}
    </figure>
  );
}
