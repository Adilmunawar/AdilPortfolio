'use client';
import { useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import {
  Grid3x3,
  Activity,
  MessageSquare,
  Layers,
  Lock,
  ArrowUpRight,
  Github,
  ChevronDown,
  type LucideIcon,
} from 'lucide-react';
import { ProjectCover } from './covers/ProjectCover';
import { cn } from '@/lib/utils';
import { Reveal } from './Reveal';
import projectsData from '@/lib/projects.json';

type ProjectKind = 'model' | 'repo' | 'product';

type Project = {
  id: string;
  title: string;
  category: string;
  kind: ProjectKind;
  description: string;
  tech: string[];
  github: string | null;
  live: string | null;
  highlight: boolean;
  image?: string;
  spec?: { architecture: string; task: string; framework: string };
  client?: string | null;
  domain?: string | null;
  year?: string | null;
};

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'Agri-Tech & Geospatial', label: 'Agri-tech & geospatial' },
  { id: 'Machine Learning', label: 'Machine learning' },
  { id: 'LLM & Agents', label: 'LLM & agents' },
  { id: 'Products', label: 'Products' },
] as const;

type FilterId = (typeof FILTERS)[number]['id'];

const CATEGORY_LABEL: Record<string, string> = Object.fromEntries(FILTERS.map((f) => [f.id, f.label]));

const CATEGORY_ICON: Record<string, LucideIcon> = {
  'Agri-Tech & Geospatial': Grid3x3,
  'Machine Learning': Activity,
  'LLM & Agents': MessageSquare,
  Products: Layers,
};

const KIND_LABEL: Record<ProjectKind, string> = {
  model: 'Model',
  repo: 'Repository',
  product: 'Product',
};

const INITIAL_GRID = 6;
const MAX_CHIPS = 5;

const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(0,102,255,0.45)]';

const CHIP =
  'inline-flex items-center h-6 px-2 rounded-[4px] bg-[#171d2b] border border-white/[0.06] text-[12px] text-[#a4adbe] transition-colors duration-150 md:hover:border-[rgba(0,102,255,0.45)] md:hover:bg-[rgba(0,102,255,0.12)] md:hover:text-[#f2f4f8]';

// 36px visual button with a 44px hit area from the ::before extension.
const LINK_BTN =
  'group/link relative inline-flex items-center gap-1.5 h-9 px-3 rounded-[8px] border border-white/[0.10] bg-[#171d2b] text-[13px] font-medium text-[#f2f4f8] transition-colors duration-150 md:hover:border-[rgba(0,102,255,0.45)] md:hover:bg-[rgba(0,102,255,0.12)] before:absolute before:inset-x-0 before:-top-1 before:-bottom-1 before:content-[""]';
const ARROW =
  'shrink-0 transition-transform duration-200 ease-out-quart md:group-hover/link:translate-x-0.5 md:group-hover/link:-translate-y-0.5';

// Inner lines of a revealed block: hidden only while the parent Reveal is armed and not yet visible.
const LINE =
  'transition-[opacity,transform] duration-500 ease-out-expo [.reveal-armed:not(.is-visible)_&]:opacity-0 [.reveal-armed:not(.is-visible)_&]:translate-y-2';
const lineDelay = (i: number): CSSProperties => ({ transitionDelay: `${i * 60}ms` });

function projectMeta(project: Project): string | null {
  const parts = [project.client, project.domain, project.year].filter(
    (p): p is string => typeof p === 'string' && p.length > 0
  );
  return parts.length ? parts.join(' · ') : null;
}

// 1px gradient hairline: two gradient layers, the brighter one fades in on hover (opacity only).
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

function IconTile({ Icon, className }: { Icon: LucideIcon; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] bg-[rgba(0,102,255,0.12)] border border-[rgba(0,102,255,0.22)] text-[#5c9dff]',
        className
      )}
    >
      <Icon size={14} strokeWidth={1.75} aria-hidden="true" />
    </span>
  );
}

// Encoder / decoder block glyph for datasheet plates.
function SpecStrip({ project, className }: { project: Project; className?: string }) {
  const rows = (
    [
      ['Architecture', project.spec?.architecture],
      ['Task', project.spec?.task],
      ['Framework', project.spec?.framework],
      ['Client', project.client],
    ] as [string, string | null | undefined][]
  ).filter((r): r is [string, string] => Boolean(r[1]));
  if (!rows.length) return null;
  // One column below sm: two columns inside a 150px card leaves ~65px, which is
  // narrow enough that break-words splits values like "Segmentation".
  return (
    <dl className={cn('grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 sm:gap-y-2 font-mono text-[10px] sm:text-[11px] md:text-[12px] leading-[1.45]', className ?? 'mt-3')}>
      {rows.map(([key, value]) => (
        <div key={key} className="min-w-0">
          <dt className="text-[#6f7888]">{key}</dt>
          <dd className="mt-0.5 text-[#f2f4f8] font-medium break-words">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Plate({ project, fill }: { project: Project; fill?: boolean; sizes?: string }) {
  const Icon = CATEGORY_ICON[project.category] ?? Layers;
  return (
    <div className={fill ? 'h-full' : undefined}>
      <div className={cn('relative rounded-[8px] overflow-hidden bg-[#0b0f17] border border-white/[0.06]', fill ? 'h-full min-h-[150px] sm:min-h-[200px] md:min-h-[260px]' : 'aspect-[16/10]')}>
        <ProjectCover id={project.id} title={project.title} className="absolute inset-0 h-full w-full transition-transform duration-500 ease-out-expo md:group-hover:scale-[1.03]" />
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#111622]/80 to-transparent" />
        {/* Cards sit two-up at 375px, so the overlay has to stay inside ~150px:
            cap its width and let the label truncate instead of running over the art. */}
        <span className="absolute left-2 bottom-2 sm:left-3 sm:bottom-3 inline-flex max-w-[calc(100%-1rem)] sm:max-w-[calc(100%-1.5rem)] items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[12px] text-[#a4adbe]">
          <IconTile Icon={Icon} className="hidden sm:inline-flex bg-[#111622]/90" />
          <span className="truncate">{CATEGORY_LABEL[project.category] ?? project.category}</span>
        </span>
        <span className="absolute right-2 top-2 sm:right-3 sm:top-3 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.12em] text-[#6f7888]">{KIND_LABEL[project.kind]}</span>
      </div>
      {!fill && <SpecStrip project={project} />}
    </div>
  );
}

function TechChips({ tech, max }: { tech: string[]; max?: number }) {
  const shown = max ? tech.slice(0, max) : tech;
  const overflow = tech.length - shown.length;
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
      {shown.map((t) => (
        <li key={t} className={CHIP}>
          {t}
        </li>
      ))}
      {overflow > 0 && (
        <li className="inline-flex items-center h-6 px-2 text-[12px] text-[#6f7888]">+{overflow}</li>
      )}
    </ul>
  );
}

function Links({ project }: { project: Project }) {
  if (!project.live && !project.github) {
    return (
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 min-h-[44px]">
        <span className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full border border-white/[0.10] bg-[#171d2b] text-[12px] font-medium text-[#a4adbe]">
          <Lock size={12} strokeWidth={1.75} aria-hidden="true" />
          Private engagement
        </span>
        <span className="text-[13px] text-[#6f7888]">Details on request</span>
      </div>
    );
  }
  return (
    <div className="flex flex-wrap gap-2 py-1">
      {project.live && (
        <a href={project.live} target="_blank" rel="noopener noreferrer" className={cn(LINK_BTN, FOCUS)}>
          Live
          <ArrowUpRight size={14} className={ARROW} aria-hidden="true" />
        </a>
      )}
      {project.github && (
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.title} on GitHub`}
          className={cn(LINK_BTN, FOCUS)}
        >
          <Github size={14} aria-hidden="true" />
          Source
          <ArrowUpRight size={14} className={ARROW} aria-hidden="true" />
        </a>
      )}
    </div>
  );
}

function FeaturedRow({ project, index }: { project: Project; index: number }) {
  const meta = projectMeta(project);
  const flip = index % 2 === 1;
  const numeral = String(index + 1).padStart(2, '0');
  const Icon = CATEGORY_ICON[project.category] ?? Layers;
  return (
    <Reveal>
      <Hairline>
        <article className="grid grid-cols-12 gap-3 md:gap-6 p-3 md:p-5 rounded-[12px] overflow-hidden">
          <div className={cn('col-span-5 min-w-0', flip && 'order-2')}>
            <Plate project={project} fill />
          </div>
          <div className={cn('col-span-7 min-w-0 flex flex-col', flip && 'order-1')}>
            <div className="flex items-center justify-between gap-2">
              <p className="inline-flex items-center gap-2 text-[10px] md:text-[12px] font-mono text-[#5c9dff]">
                <span className="hidden sm:inline-flex"><IconTile Icon={Icon} /></span>
                {numeral} · Featured
              </p>
              <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.12em] text-[#6f7888]">{KIND_LABEL[project.kind]}</span>
            </div>
            <h3 className="mt-2 md:mt-3 text-[14px] sm:text-[17px] md:text-[22px] font-semibold tracking-[-0.01em] leading-[1.25] text-[#f2f4f8]">
              {project.title}
            </h3>
            {meta && <p className="mt-0.5 md:mt-1 text-[10px] md:text-[12px] text-[#6f7888]">{meta}</p>}
            <p className="mt-2 md:mt-3 text-[11px] sm:text-[13px] md:text-[15px] leading-[1.5] md:leading-[1.6] text-[#a4adbe] line-clamp-3 md:line-clamp-none">
              {project.description}
            </p>
            <SpecStrip project={project} className="mt-3 md:mt-4 border-t border-white/[0.06] pt-3 md:pt-4 sm:grid-cols-4" />
            <div className="mt-3 hidden sm:block md:mt-4">
              <TechChips tech={project.tech} />
            </div>
            <div className="mt-auto pt-2 md:pt-3">
              <Links project={project} />
            </div>
          </div>
        </article>
      </Hairline>
    </Reveal>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const meta = projectMeta(project);
  return (
    <Reveal delay={(index % 3) * 60} className="h-full">
      <Hairline className="h-full">
        <article className="h-full flex flex-col p-3 md:p-6">
          <Plate project={project} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px" />
          <h3 className="mt-2.5 md:mt-4 text-[12px] sm:text-[16px] md:text-[20px] font-semibold tracking-[-0.01em] leading-[1.3] text-[#f2f4f8]">
            {project.title}
          </h3>
          {meta && <p className="mt-0.5 md:mt-1 text-[9px] sm:text-[10px] md:text-[12px] text-[#6f7888]">{meta}</p>}
          <p className="mt-1.5 md:mt-3 text-[10px] sm:text-[13px] md:text-[15px] leading-[1.5] md:leading-[1.6] text-[#a4adbe] line-clamp-3">{project.description}</p>
          <div className="mt-2 hidden sm:block md:mt-4">
            <TechChips tech={project.tech} max={MAX_CHIPS} />
          </div>
          <div className="mt-auto pt-2 md:pt-3">
            <Links project={project} />
          </div>
        </article>
      </Hairline>
    </Reveal>
  );
}

const ProjectsSection = () => {
  const [filter, setFilter] = useState<FilterId>('all');
  const [showAll, setShowAll] = useState(false);

  const projects = projectsData as Project[];
  const filtered = useMemo(
    () => (filter === 'all' ? projects : projects.filter((p) => p.category === filter)),
    [filter, projects]
  );

  const featured = filter === 'all' ? filtered.filter((p) => p.highlight) : [];
  const rest = filter === 'all' ? filtered.filter((p) => !p.highlight) : filtered;
  const visible = showAll || filter !== 'all' ? rest : rest.slice(0, INITIAL_GRID);
  const hidden = rest.length - visible.length;

  return (
    <section id="projects" className="py-10 md:py-28 px-5 md:px-8">
      <div className="max-w-[1120px] mx-auto">
        <Reveal className="mx-auto max-w-[680px] text-center">
          <h2 className="text-[24px] md:text-[40px] font-semibold tracking-[-0.02em] leading-[1.15] text-[#f2f4f8]">
            Selected work
          </h2>
        </Reveal>

        <Reveal variant="none" delay={60} className="mt-8 md:mt-12">
          <div
            role="tablist"
            aria-label="Project categories"
            className="flex gap-6 overflow-x-auto border-b border-white/[0.06] -mx-5 px-5 md:mx-0 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {FILTERS.map((f) => {
              const active = filter === f.id;
              const Icon = f.id === 'all' ? null : CATEGORY_ICON[f.id];
              return (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setFilter(f.id);
                    setShowAll(false);
                  }}
                  className={cn(
                    'relative shrink-0 inline-flex items-center gap-1.5 h-11 text-[14px] font-medium whitespace-nowrap transition-colors duration-150',
                    FOCUS,
                    active ? 'text-[#f2f4f8]' : 'text-[#a4adbe] hover:text-[#f2f4f8]'
                  )}
                >
                  {Icon && (
                    <Icon
                      size={14}
                      strokeWidth={1.75}
                      aria-hidden="true"
                      className={cn('transition-opacity duration-150', active ? 'text-[#5c9dff] opacity-100' : 'opacity-60')}
                    />
                  )}
                  {f.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute left-0 right-0 -bottom-px h-0.5 bg-[#0066ff] origin-left transition-transform duration-200',
                      active ? 'scale-x-100' : 'scale-x-0'
                    )}
                  />
                </button>
              );
            })}
          </div>
        </Reveal>

        {featured.length > 0 && (
          <div className="mt-6 md:mt-12 flex flex-col gap-3 md:gap-6">
            {featured.map((project, index) => (
              <FeaturedRow key={project.id} project={project} index={index} />
            ))}
          </div>
        )}

        {visible.length > 0 ? (
          <div className="mt-3 md:mt-6 grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {visible.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-[15px] text-[#6f7888]">No projects in this category yet.</p>
        )}

        {hidden > 0 && (
          <div className="mt-6 md:mt-8">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className={cn(
                'group/more inline-flex items-center gap-2 min-h-[44px] px-4 rounded-[8px] border border-white/[0.10] bg-[#111622] text-[14px] font-medium text-[#f2f4f8] transition-colors duration-150 md:hover:border-[rgba(0,102,255,0.45)] md:hover:bg-[rgba(0,102,255,0.12)]',
                FOCUS
              )}
            >
              Show all {filtered.length} projects
              <ChevronDown
                size={16}
                aria-hidden="true"
                className="transition-transform duration-200 ease-out-quart md:group-hover/more:translate-y-0.5"
              />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;
