'use client';
import { Suspense, lazy, useEffect, useRef, useState, type ComponentType } from 'react';

type Loader = () => Promise<{ default: ComponentType }>;

const isServer = typeof window === 'undefined';

const SECTIONS: { id: string; load: Loader }[] = [
  { id: 'stats', load: () => import('./StatsSection') },
  { id: 'skills', load: () => import('./SkillsSection') },
  { id: 'services', load: () => import('./ServicesSection') },
  { id: 'case-studies', load: () => import('./CaseStudiesSection') },
  { id: 'projects', load: () => import('./ProjectsSection') },
  { id: 'testimonials', load: () => import('./TestimonialsSection') },
  { id: 'blog', load: () => import('./BlogSection') },
  { id: 'contact', load: () => import('./ContactSection') },
];

const SERVER_COMPONENTS = new Map<string, ComponentType>(
  isServer ? SECTIONS.map((s) => [s.id, lazy(s.load)]) : []
);

function LazySection({ id, load }: { id: string; load: Loader }) {
  const ref = useRef<HTMLDivElement>(null);
  const [Loaded, setLoaded] = useState<ComponentType | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;

    const start = () => {
      load().then((m) => {
        if (!cancelled) setLoaded(() => m.default);
      });
    };

    if (!('IntersectionObserver' in window)) {
      start();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          start();
        }
      },
      { rootMargin: '600px 0px 600px 0px' }
    );
    io.observe(el);

    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, [load]);

  if (Loaded) {
    return (
      <div ref={ref} data-lazy-section={id}>
        <Loaded />
      </div>
    );
  }

  const ServerComponent = SERVER_COMPONENTS.get(id);
  if (ServerComponent) {
    return (
      <div ref={ref} data-lazy-section={id}>
        <Suspense fallback={null}>
          <ServerComponent />
        </Suspense>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      data-lazy-section={id}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: '' }}
    />
  );
}

export default function DeferredSections() {
  return (
    <>
      {SECTIONS.map((s) => (
        <LazySection key={s.id} id={s.id} load={s.load} />
      ))}
    </>
  );
}
