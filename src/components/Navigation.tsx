'use client';
import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Work', href: '#projects' },
  { name: 'Case studies', href: '#case-studies' },
  { name: 'Services', href: '#services' },
  { name: 'Notes', href: '#blog' },
  { name: 'Contact', href: '#contact' },
];

const spyIds = ['home', ...navItems.map((item) => item.href.slice(1))];
const EMAIL = 'mailto:adilmunawarx@gmail.com';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

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

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
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

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 h-14 transition-colors duration-200 ease-standard border-b',
        scrolled || isOpen ? 'bg-bg-0/[0.92] border-subtle' : 'bg-transparent border-transparent'
      )}
      aria-label="Primary"
    >
      <div className="container-page flex h-full items-center justify-between gap-4">
        <a
          href="#home"
          onClick={(e) => handleLinkClick(e, '#home')}
          className="text-small font-medium text-primary rounded-sm"
        >
          Adil Munawar
        </a>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const active = activeSection === item.href.slice(1);
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.href)}
                aria-current={active ? 'location' : undefined}
                className={cn(
                  'flex h-14 items-center px-3 text-small font-medium transition-colors duration-150 ease-standard rounded-sm',
                  active ? 'text-primary' : 'text-secondary hover:text-primary'
                )}
              >
                <span className="relative">
                  {item.name}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute -bottom-1 left-0 h-0.5 w-full origin-left bg-accent transition-transform duration-200 ease-out-quart',
                      active ? 'scale-x-100' : 'scale-x-0'
                    )}
                  />
                </span>
              </a>
            );
          })}
          <a href={EMAIL} className="btn-secondary ml-3 h-8 px-3">
            Email
          </a>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="md:hidden -mr-3 flex h-11 items-center px-3 text-small font-medium text-primary rounded-sm"
          aria-expanded={isOpen}
          aria-controls="mobile-nav"
        >
          {isOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      {isOpen && (
        <div id="mobile-nav" className="md:hidden absolute left-0 right-0 top-full bg-bg-1 border-b border-subtle">
          {[...navItems, { name: 'Email', href: EMAIL }].map((item, index) => {
            const external = item.href.startsWith('mailto:');
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={external ? () => setIsOpen(false) : (e) => handleLinkClick(e, item.href)}
                className="nav-row-in flex h-12 items-center px-5 text-base text-secondary hover:bg-bg-2 hover:text-primary transition-colors duration-150 ease-standard"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                {item.name}
              </a>
            );
          })}
        </div>
      )}
    </nav>
  );
};

export default Navigation;
