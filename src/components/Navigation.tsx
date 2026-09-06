'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'Contribution', href: '#stats' },
  { name: 'Credentials', href: '#skills' },
  { name: 'Services', href: '#services' },
  { name: 'Case studies', href: '#case-studies' },
  { name: 'Work', href: '#projects' },
  { name: 'Testimonials', href: '#testimonials' },
  { name: 'Notes', href: '#blog' },
  { name: 'Contact', href: '#contact' },
];

const spyIds = navItems.map((item) => item.href.slice(1));
const HIDE_AFTER = 160;
const HIDE_DELTA = 6;

type Bound = { id: string; top: number; bottom: number };

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const headerRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);
  const lockUntil = useRef(0);
  const activeRef = useRef('home');

  useEffect(() => {
    let ticking = false;
    let lastScrolled = false;
    let lastHidden = false;
    let lastY = window.scrollY;
    let viewport = window.innerHeight;
    let maxScroll = 1;
    let bounds: Bound[] = [];
    lockUntil.current = performance.now() + 800;

    const measureLayout = () => {
      viewport = window.innerHeight;
      maxScroll = Math.max(1, document.documentElement.scrollHeight - viewport);
      bounds = spyIds.flatMap((id) => {
        const el = document.getElementById(id);
        if (!el) return [];
        const top = el.offsetTop;
        return [{ id, top, bottom: top + el.offsetHeight }];
      });
      update();
    };

    const update = () => {
      ticking = false;
      const y = window.scrollY;

      const isScrolled = y > 8;
      if (isScrolled !== lastScrolled) {
        lastScrolled = isScrolled;
        setScrolled(isScrolled);
      }

      const delta = y - lastY;
      lastY = y;
      const locked = performance.now() < lockUntil.current;
      const focusInside = headerRef.current?.contains(document.activeElement) ?? false;
      let hide = lastHidden;
      if (y < HIDE_AFTER || locked || focusInside) hide = false;
      else if (delta > HIDE_DELTA) hide = true;
      else if (delta < -HIDE_DELTA) hide = false;
      if (hide !== lastHidden) {
        lastHidden = hide;
        setHidden(hide);
      }

      const bar = progressRef.current;
      if (bar) bar.style.transform = `scaleX(${Math.min(1, Math.max(0, y / maxScroll))})`;

      const line = y + viewport * 0.4;
      let current = bounds.length ? bounds[0].id : 'home';
      if (y >= maxScroll - 4 && bounds.length) current = bounds[bounds.length - 1].id;
      else {
        for (const b of bounds) {
          if (line >= b.top && line < b.bottom) {
            current = b.id;
            break;
          }
        }
      }
      if (current !== activeRef.current) {
        activeRef.current = current;
        setActiveSection(current);
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    let raf = 0;
    const onLayout = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measureLayout);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onLayout);
    const observer = new ResizeObserver(onLayout);
    observer.observe(document.body);
    measureLayout();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onLayout);
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const placeIndicator = useCallback((target: HTMLElement | null) => {
    const indicator = indicatorRef.current;
    if (!indicator) return;
    if (!target) {
      indicator.classList.remove('is-measured');
      return;
    }
    indicator.style.setProperty('--nav-x', String(target.offsetLeft));
    indicator.style.setProperty('--nav-w', String(target.offsetWidth));
    if (!indicator.classList.contains('is-measured')) {
      requestAnimationFrame(() => indicator.classList.add('is-measured'));
    }
  }, []);

  const placeOnActive = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    placeIndicator(list.querySelector<HTMLElement>('[aria-current="location"]'));
  }, [placeIndicator]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    placeOnActive();
    const observer = new ResizeObserver(placeOnActive);
    observer.observe(list);
    return () => observer.disconnect();
  }, [activeSection, placeOnActive]);

  useEffect(() => {
    if (!isOpen) {
      if (wasOpen.current) {
        wasOpen.current = false;
        menuButtonRef.current?.focus();
      }
      return;
    }
    wasOpen.current = true;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    sheetRef.current?.querySelector<HTMLElement>('a')?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        return;
      }
      if (e.key !== 'Tab' || !sheetRef.current) return;
      const focusable = sheetRef.current.querySelectorAll<HTMLElement>('a[href], button');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const button = menuButtonRef.current;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        (button ?? last).focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        (button ?? first).focus();
      } else if (e.shiftKey && document.activeElement === button) {
        e.preventDefault();
        last.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  const handleLinkClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.getElementById(href.slice(1));
    if (!target) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    lockUntil.current = performance.now() + (reduce ? 200 : 1200);
    setHidden(false);
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', href);
    setIsOpen(false);
  }, []);

  const handleListKey = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (!keys.includes(e.key) || !listRef.current) return;
    const links = Array.from(listRef.current.querySelectorAll<HTMLAnchorElement>('a[href]'));
    const index = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (index < 0) return;
    e.preventDefault();
    const next =
      e.key === 'Home' ? 0 : e.key === 'End' ? links.length - 1 : (index + (e.key === 'ArrowRight' ? 1 : -1) + links.length) % links.length;
    links[next].focus();
  }, []);

  const activeIndex = Math.max(0, spyIds.indexOf(activeSection));
  const elevated = scrolled || isOpen;

  return (
    <header
      ref={headerRef}
      className={cn(
        'site-header sticky top-0 z-50 h-16 border-b',
        elevated ? 'bg-bg-0/95 border-subtle shadow-float' : 'bg-transparent border-transparent',
        hidden && !isOpen && 'is-hidden'
      )}
    >
      <nav aria-label="Primary" className="container-page relative flex h-full items-center justify-center">
        <div
          ref={listRef}
          className="relative hidden h-11 items-center rounded-full border border-subtle bg-bg-1 p-1 lg:flex"
          onMouseLeave={placeOnActive}
          onKeyDown={handleListKey}
        >
          <span ref={indicatorRef} aria-hidden="true" className="nav-pill">
            <span className="nav-pill__cap nav-pill__cap--l" />
            <span className="nav-pill__mid" />
            <span className="nav-pill__cap nav-pill__cap--r" />
          </span>
          {navItems.map((item, index) => {
            const active = activeSection === item.href.slice(1);
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.href)}
                onMouseEnter={(e) => placeIndicator(e.currentTarget)}
                onFocus={(e) => placeIndicator(e.currentTarget)}
                onBlur={placeOnActive}
                aria-current={active ? 'location' : undefined}
                className={cn(
                  'nav-link focus-ring relative z-10 flex h-9 items-center whitespace-nowrap rounded-full px-3 text-[13px] font-medium transition-colors duration-150 ease-standard',
                  active ? 'text-primary' : 'text-secondary hover:text-primary'
                )}
              >
                <span className="nav-link__index font-mono text-[10px] text-tertiary">{String(index + 1).padStart(2, '0')}</span>
                {item.name}
              </a>
            );
          })}
        </div>

        <div className="pointer-events-none flex items-center gap-2 text-[13px] lg:hidden" aria-live="polite">
          <span className="font-mono text-mono text-tertiary">{String(activeIndex + 1).padStart(2, '0')}</span>
          <span key={activeSection} className="nav-row-in font-medium text-primary">
            {navItems[activeIndex]?.name}
          </span>
        </div>

        <div className="absolute right-0 top-0 flex h-16 items-center lg:hidden">
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            className="focus-ring inline-flex h-11 min-w-[44px] items-center justify-center gap-2 rounded-md px-2 text-small font-medium text-primary"
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
          >
            <span className={cn('nav-burger', isOpen && 'is-open')} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
          </button>
        </div>
      </nav>

      <span
        ref={progressRef}
        aria-hidden="true"
        className={cn(
          'absolute bottom-[-1px] left-0 h-0.5 w-full origin-left bg-accent transition-opacity duration-200 ease-standard',
          scrolled && !isOpen ? 'opacity-100' : 'opacity-0'
        )}
        style={{ transform: 'scaleX(0)' }}
      />

      <div className={cn('nav-backdrop lg:hidden', isOpen && 'is-open')} onClick={() => setIsOpen(false)} aria-hidden="true" />
      <div
        id="mobile-nav"
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={cn('nav-sheet lg:hidden', isOpen && 'is-open')}
      >
        <ul className="border-b border-subtle">
          {navItems.map((item, index) => {
            const active = activeSection === item.href.slice(1);
            return (
              <li key={item.href} className="border-t border-subtle">
                <a
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item.href)}
                  aria-current={active ? 'location' : undefined}
                  className={cn(
                    'nav-sheet__row focus-ring flex h-[52px] items-center gap-4 px-5 text-base transition-colors duration-150 ease-standard active:bg-bg-2',
                    active ? 'text-primary' : 'text-secondary'
                  )}
                  style={{ transitionDelay: isOpen ? `${40 + index * 25}ms` : '0ms' }}
                >
                  <span className="w-6 font-mono text-mono text-tertiary">{String(index + 1).padStart(2, '0')}</span>
                  <span className="font-medium">{item.name}</span>
                  <span className={cn('ml-auto h-1.5 w-1.5 rounded-full bg-accent transition-opacity', active ? 'opacity-100' : 'opacity-0')} />
                </a>
              </li>
            );
          })}
        </ul>
        <p className="mt-auto px-5 py-4 text-[12px] text-tertiary">Section {activeIndex + 1} of {navItems.length}</p>
      </div>
    </header>
  );
};

export default Navigation;
