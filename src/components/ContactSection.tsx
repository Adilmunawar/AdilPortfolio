'use client';
import { useEffect, useRef, useState, type MouseEvent } from 'react';
import {
  Mail,
  MessageCircle,
  Linkedin,
  Github,
  Send,
  Instagram,
  Copy,
  Check,
  ArrowRight,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Reveal } from './Reveal';

const EMAIL = 'adilmunawarx@gmail.com';

const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(0,102,255,0.45)]';

type Channel = { label: string; handle: string; href: string; Icon: LucideIcon };

const channels: Channel[] = [
  { label: 'Email', handle: EMAIL, href: `mailto:${EMAIL}`, Icon: Mail },
  { label: 'WhatsApp', handle: '+92 324 4965220', href: 'https://wa.me/923244965220', Icon: MessageCircle },
  { label: 'LinkedIn', handle: 'linkedin.com/in/adilmunawar', href: 'https://linkedin.com/in/adilmunawar', Icon: Linkedin },
  { label: 'GitHub', handle: 'github.com/adilmunawar', href: 'https://github.com/adilmunawar', Icon: Github },
  { label: 'Telegram', handle: '@adilmunawar', href: 'https://t.me/adilmunawar', Icon: Send },
  { label: 'Instagram', handle: '@adilmunawarx', href: 'https://instagram.com/adilmunawarx', Icon: Instagram },
];

const quickLinks: { label: string; href: string }[] = [
  { label: 'Work', href: '#projects' },
  { label: 'Case studies', href: '#case-studies' },
  { label: 'Services', href: '#services' },
  { label: 'Notes', href: '#blog' },
  { label: 'Contact', href: '#contact' },
];

const connectLinks: { label: string; href: string; Icon: LucideIcon }[] = [
  { label: 'GitHub', href: 'https://github.com/adilmunawar', Icon: Github },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/adilmunawar', Icon: Linkedin },
  { label: 'Email', href: `mailto:${EMAIL}`, Icon: Mail },
  { label: 'WhatsApp', href: 'https://wa.me/923244965220', Icon: MessageCircle },
];

const socialTiles: { label: string; href: string; Icon: LucideIcon }[] = [
  { label: 'GitHub', href: 'https://github.com/adilmunawar', Icon: Github },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/adilmunawar', Icon: Linkedin },
  { label: 'Instagram', href: 'https://instagram.com/adilmunawarx', Icon: Instagram },
  { label: 'WhatsApp', href: 'https://wa.me/923244965220', Icon: MessageCircle },
  { label: 'Email', href: `mailto:${EMAIL}`, Icon: Mail },
];

const FOOTER_LINK =
  'group/link inline-flex items-center gap-2 min-h-[44px] -ml-2 px-2 rounded-[6px] text-[14px] text-[#a4adbe] transition-colors duration-150 md:hover:text-[#f2f4f8]';

const LINK_ARROW =
  'text-[#6f7888] transition-[transform,color] duration-200 ease-out-quart md:group-hover/link:text-[#5c9dff] md:group-hover/link:translate-x-0.5';

const SOCIAL_TILE =
  'group/tile relative inline-flex h-12 w-12 items-center justify-center rounded-lg border border-white/[0.08] bg-gradient-to-br from-[rgba(0,102,255,0.16)] to-[rgba(0,102,255,0.03)] text-[#5c9dff] transition-[transform,border-color,color] duration-200 ease-out-quart md:hover:-translate-y-1 md:hover:border-[rgba(0,102,255,0.45)] md:hover:text-[#f2f4f8]';

const scrollToAnchor = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
  const target = document.getElementById(href.slice(1));
  if (!target) return;
  e.preventDefault();
  target.scrollIntoView({ behavior: 'smooth' });
  history.replaceState(null, '', href);
};

const isExternal = (href: string) => !href.startsWith('mailto:');

const ContactSection = () => {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard?.writeText(EMAIL).catch(() => {});
      setCopied(true);
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1500);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  return (
    <section id="contact" className="pt-16 md:pt-28 px-5 md:px-8">
      <div className="max-w-[1120px] mx-auto">
        <Reveal className="max-w-[680px]">
          <h2 className="text-[28px] md:text-[40px] font-semibold tracking-[-0.02em] leading-[1.15] text-[#f2f4f8]">
            Let&apos;s work together
          </h2>
          <p className="mt-3 md:mt-4 text-[17px] md:text-[20px] leading-[1.5] text-[#a4adbe]">
            I take on a small number of ML, geospatial and full-stack engagements. Email is best; I reply within a day.
          </p>

          <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3">
            <a
              href={`mailto:${EMAIL}`}
              className={cn(
                'group/cta inline-flex items-center justify-center gap-2 h-11 px-5 rounded-[8px] bg-[#0066ff] hover:bg-[#1a75ff] active:bg-[#0052cc] text-[14px] font-medium text-white transition-colors duration-150',
                FOCUS
              )}
            >
              <Mail size={16} strokeWidth={1.75} aria-hidden="true" />
              Email
              <ArrowRight
                size={16}
                aria-hidden="true"
                className="transition-transform duration-200 ease-out-quart md:group-hover/cta:translate-x-0.5"
              />
            </a>
            <a
              href="https://wa.me/923244965220"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'group/cta inline-flex items-center justify-center gap-2 h-11 px-5 rounded-[8px] border border-white/[0.10] hover:border-white/[0.16] hover:bg-[#111622] text-[14px] font-medium text-[#f2f4f8] transition-colors duration-150',
                FOCUS
              )}
            >
              <MessageCircle size={16} strokeWidth={1.75} aria-hidden="true" />
              WhatsApp
              <ArrowUpRight
                size={16}
                aria-hidden="true"
                className="transition-transform duration-200 ease-out-quart md:group-hover/cta:translate-x-0.5 md:group-hover/cta:-translate-y-0.5"
              />
            </a>
          </div>

          <p className="mt-4 text-[13px] text-[#6f7888]">Lahore, Pakistan · Remote worldwide · UTC+5</p>
        </Reveal>

        <Reveal variant="none" delay={60} className="mt-10 md:mt-14">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 border-t border-white/[0.06]">
            {channels.map((c) => (
              <li
                key={c.label}
                className="group flex items-center gap-3 min-h-[56px] py-2 border-b border-white/[0.06] text-[14px]"
              >
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[rgba(0,102,255,0.12)] border border-[rgba(0,102,255,0.22)] text-[#5c9dff] transition-colors duration-150 md:group-hover:bg-[rgba(0,102,255,0.2)]">
                  <c.Icon size={16} strokeWidth={1.75} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[12px] text-[#6f7888]">{c.label}</span>
                  <span className="block truncate text-[#a4adbe] transition-colors duration-150 md:group-hover:text-[#f2f4f8]">{c.handle}</span>
                </span>
                {c.label === 'Email' && (
                  <button
                    type="button"
                    onClick={copyEmail}
                    aria-live="polite"
                    aria-label={copied ? 'Email copied' : 'Copy email address'}
                    className={cn(
                      'inline-flex items-center gap-1.5 min-h-[44px] px-2 text-[13px] font-medium text-[#a4adbe] hover:text-[#f2f4f8] transition-colors duration-150',
                      FOCUS
                    )}
                  >
                    {copied ? (
                      <Check size={14} className="text-[#3ddc84]" aria-hidden="true" />
                    ) : (
                      <Copy size={14} aria-hidden="true" />
                    )}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                )}
                <a
                  href={c.href}
                  target={isExternal(c.href) ? '_blank' : undefined}
                  rel={isExternal(c.href) ? 'noopener noreferrer' : undefined}
                  aria-label={`${c.label}: ${c.handle}`}
                  className={cn(
                    'group/open inline-flex items-center gap-1 min-h-[44px] px-2 -mr-2 text-[13px] font-medium text-[#5c9dff] hover:text-[#f2f4f8] transition-colors duration-150',
                    FOCUS
                  )}
                >
                  Open
                  <ArrowUpRight
                    size={14}
                    aria-hidden="true"
                    className="transition-transform duration-200 ease-out-quart md:group-hover/open:translate-x-0.5 md:group-hover/open:-translate-y-0.5"
                  />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <footer className="mt-16 md:mt-24 pb-24 md:pb-8 text-[13px] text-[#6f7888]">
          <div
            aria-hidden="true"
            className="relative h-px bg-gradient-to-r from-transparent via-[rgba(92,157,255,0.45)] to-transparent"
          >
            <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5c9dff] shadow-[0_0_0_4px_rgba(0,102,255,0.18)]" />
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-8 pt-10 md:pt-12 lg:grid-cols-12">
            <div className="col-span-2 min-w-0 lg:col-span-6">
              <p className="text-[18px] md:text-[20px] font-semibold tracking-[-0.01em] leading-[1.3] text-[#f2f4f8]">
                Crafted with{' '}
                <span aria-hidden="true" className="text-[#fb7185]">♥</span>
                <span className="sr-only">love</span>
                {' '}by{' '}
                <a
                  href="#home"
                  onClick={(e) => scrollToAnchor(e, '#home')}
                  className={cn(
                    'inline-block -my-3 -mx-0.5 px-0.5 py-3 rounded-[4px] text-[#5c9dff] transition-colors duration-150 md:hover:text-[#f2f4f8]',
                    FOCUS
                  )}
                >
                  Adil Munawar
                </a>
              </p>
              <p className="mt-1.5 max-w-[440px] text-[14px] leading-[1.5] text-[#a4adbe]">
                Machine-learning engineer for agricultural remote sensing · full-stack developer
              </p>

              <ul className="mt-6 flex flex-wrap gap-3" aria-label="Social profiles">
                {socialTiles.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target={isExternal(s.href) ? '_blank' : undefined}
                      rel={isExternal(s.href) ? 'noopener noreferrer' : undefined}
                      aria-label={s.label}
                      className={cn(SOCIAL_TILE, FOCUS)}
                    >
                      <s.Icon size={20} strokeWidth={1.75} aria-hidden="true" />
                      <span
                        aria-hidden="true"
                        className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#0066ff] opacity-0 transition-opacity duration-150 md:group-hover/tile:opacity-100"
                      />
                    </a>
                  </li>
                ))}
              </ul>

              <p className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="inline-flex items-center gap-2 text-[#a4adbe]">
                  <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-[#3ddc84]" />
                  Available for new engagements
                </span>
                <span aria-hidden="true">·</span>
                <span>Lahore, Pakistan · Remote worldwide · UTC+5</span>
              </p>
            </div>

            <nav aria-label="Site sections" className="min-w-0 lg:col-span-3">
              <p className="text-[13px] font-medium text-[#f2f4f8]">Site</p>
              <ul className="mt-1 flex flex-col">
                {quickLinks.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} onClick={(e) => scrollToAnchor(e, l.href)} className={cn(FOOTER_LINK, FOCUS)}>
                      {l.label}
                      <ArrowRight size={12} aria-hidden="true" className={LINK_ARROW} />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Connect" className="min-w-0 lg:col-span-3">
              <p className="text-[13px] font-medium text-[#f2f4f8]">Connect</p>
              <ul className="mt-1 flex flex-col">
                {connectLinks.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target={isExternal(l.href) ? '_blank' : undefined}
                      rel={isExternal(l.href) ? 'noopener noreferrer' : undefined}
                      className={cn(FOOTER_LINK, FOCUS)}
                    >
                      <l.Icon
                        size={16}
                        strokeWidth={1.75}
                        aria-hidden="true"
                        className="text-[#6f7888] transition-colors duration-150 md:group-hover/link:text-[#5c9dff]"
                      />
                      {l.label}
                      {isExternal(l.href) ? (
                        <ArrowUpRight
                          size={12}
                          aria-hidden="true"
                          className={cn(LINK_ARROW, 'md:group-hover/link:-translate-y-0.5')}
                        />
                      ) : (
                        <ArrowRight size={12} aria-hidden="true" className={LINK_ARROW} />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="mt-10 md:mt-12 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-[#a4adbe]">© 2026 Adil Munawar</p>
            <p>Built with Next.js · Lahore, Pakistan</p>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default ContactSection;
