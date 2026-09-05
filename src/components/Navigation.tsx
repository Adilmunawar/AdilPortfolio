'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'Activity', href: '#stats' },
  { name: 'Credentials', href: '#skills' },
  { name: 'Services', href: '#services' },
  { name: 'Case studies', href: '#case-studies' },
  { name: 'Work', href: '#projects' },
  { name: 'Testimonials', href: '#testimonials' },
  { name: 'Notes', href: '#blog' },
  { name: 'Contact', href: '#contact' },
];

const spyIds = ['home', ...navItems.map((item) => item.href.slice(1))];
const ZENITH_SELECTOR = 'button[aria-label="Open Zenith AI assistant"]';


const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const progressRef = useRef<HTMLSpanElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    let ticking = false;
    let lastScrolled = false;
    let lastActive = 'home';

    const update = () => {
      ticking = false;
      const isScrolled = window.scrollY > 8;
      if (isScrolled !== lastScrolled) {
        lastScrolled = isScrolled;
        setScrolled(isScrolled);
      }

      const bar = progressRef.current;
      if (bar) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
        bar.style.transform = `scaleX(${progress})`;
      }

      const scrollPosition = window.scrollY + window.innerHeight / 2;
      for (const id of spyIds) {
        const section = document.getElementById(id);
        if (section && scrollPosition >= section.offsetTop && scrollPosition < section.offsetTop + section.offsetHeight) {
          if (id !== lastActive) {
            lastActive = id;
            setActiveSection(id);
          }
          break;
        }
      }
    };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    update();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sliding pill: measured once per active change / resize, moved with transform only.
  useEffect(() => {
    const list = listRef.current;
    const indicator = indicatorRef.current;
    if (!list || !indicator) return;

    const measure = () => {
      const target = list.querySelector<HTMLElement>('[aria-current="location"]');
      if (!target) {
        indicator.classList.remove('is-measured');
        return;
      }
      indicator.style.setProperty('--nav-x', String(target.offsetLeft));
      indicator.style.setProperty('--nav-w', String(target.offsetWidth));
      if (!indicator.classList.contains('is-measured')) {
        requestAnimationFrame(() => indicator.classList.add('is-measured'));
      }
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [activeSection]);

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
    document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' });
    history.replaceState(null, '', href);
    setIsOpen(false);
  }, []);


  const elevated = scrolled || isOpen;

  return (
    <header
      className={cn(
        'sticky top-0 z-50 h-16 border-b transition-colors duration-200 ease-standard relative',
        elevated ? 'bg-bg-0/95 border-subtle shadow-float' : 'bg-transparent border-transparent'
      )}
    >
      <nav
        aria-label="Primary"
        className="container-page flex h-full items-center justify-center lg:justify-center"
      >

        <div
          ref={listRef}
          className="relative hidden h-11 items-center rounded-full border border-subtle bg-bg-1 p-1 lg:flex"
        >
          <span ref={indicatorRef} aria-hidden="true" className="nav-pill">
            <span className="nav-pill__cap nav-pill__cap--l" />
            <span className="nav-pill__mid" />
            <span className="nav-pill__cap nav-pill__cap--r" />
          </span>
          {navItems.map((item) => {
            const active = activeSection === item.href.slice(1);
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.href)}
                aria-current={active ? 'location' : undefined}
                className={cn(
                  'focus-ring relative z-10 flex h-9 items-center whitespace-nowrap rounded-full px-3 text-[13px] font-medium transition-colors duration-150 ease-standard',
                  active ? 'text-primary' : 'text-secondary hover:text-primary'
                )}
              >
                {item.name}
              </a>
            );
          })}
        </div>

        <div className="absolute right-4 top-0 flex h-16 items-center lg:hidden">
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            className="focus-ring -mr-3 inline-flex h-11 min-w-[44px] items-center justify-center rounded-md px-3 text-small font-medium text-primary lg:hidden"
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
          >
            {isOpen ? 'Close' : 'Menu'}
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

      <div
        className={cn('nav-backdrop lg:hidden', isOpen && 'is-open')}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
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
                    'focus-ring flex h-[52px] items-center gap-4 px-5 text-base transition-colors duration-150 ease-standard active:bg-bg-2',
                    active ? 'text-primary' : 'text-secondary'
                  )}
                >
                  <span className="w-6 font-mono text-mono text-tertiary">{String(index + 1).padStart(2, '0')}</span>
                  <span className="font-medium">{item.name}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
};

export default Navigation;
