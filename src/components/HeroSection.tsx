'use client';

import React from 'react';
import { ArrowRight, ArrowDown, Github, Linkedin, Mail, type LucideIcon } from 'lucide-react';
import ProfileCard from './ProfileCard';

const textLinks: { label: string; href: string; external: boolean; Icon: LucideIcon }[] = [
  { label: 'GitHub', href: 'https://github.com/adilmunawar', external: true, Icon: Github },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/adilmunawar', external: true, Icon: Linkedin },
  { label: 'Email', href: 'mailto:adilmunawarx@gmail.com', external: false, Icon: Mail },
];

const enter = (delay: number): React.CSSProperties => ({ animationDelay: `${delay}ms` });

const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

const HeroSection = () => {
  return (
    <section id="home" className="relative w-full overflow-hidden">
      <div className="container-page flex flex-col gap-10 py-12 lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-8 lg:gap-y-4 lg:py-0 lg:min-h-[min(calc(100svh-56px),720px)]">
        <div className="container-hero-text order-1 flex flex-col items-start lg:col-span-7">
          <div className="hero-in inline-flex h-7 items-center gap-2 rounded-full border border-default bg-bg-1 px-3 text-small text-secondary" style={enter(0)}>
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-success" />
            Available for new engagements
          </div>

          <h1 className="hero-in mt-6 text-display text-primary" style={enter(60)}>
            Adil Munawar
          </h1>

          <p className="hero-in mt-4 text-h3 font-medium text-secondary" style={enter(120)}>
            Machine-learning engineer for <span className="text-accent-text">agricultural remote sensing</span> · full-stack developer
          </p>

          {/* Hairline under the role line: one light sweep on load, looping only on hover-capable desktops. */}
          <div aria-hidden="true" className="hero-in relative mt-3 h-px w-full max-w-[220px] overflow-hidden bg-white/[0.08]" style={enter(150)}>
            <span className="absolute inset-y-0 left-0 w-1/2 bg-[linear-gradient(90deg,transparent,#5c9dff,transparent)] animate-sweep" />
          </div>

          <p className="hero-in mt-4 text-lede text-secondary" style={enter(180)}>
            I train segmentation and time-series models on satellite imagery to map fields and crops, and build the web products that put those maps in front of people.
          </p>

          <div className="hero-in mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row" style={enter(240)}>
            <a href="#projects" onClick={(e) => scrollTo(e, 'projects')} className="btn-primary group/cta h-11 sm:h-10">
              View selected work
              <ArrowRight size={16} aria-hidden="true" className="md:group-hover/cta:animate-arrow-nudge" />
            </a>
            <a href="#contact" onClick={(e) => scrollTo(e, 'contact')} className="btn-secondary group/cta h-11 sm:h-10">
              Get in touch
              <ArrowDown
                size={16}
                aria-hidden="true"
                className="transition-transform duration-200 ease-out-quart md:group-hover/cta:translate-y-0.5"
              />
            </a>
          </div>
        </div>

        <div className="hero-in order-3 flex flex-wrap items-center gap-x-4 lg:col-span-7" style={enter(360)}>
          {textLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className="group/social inline-flex min-h-[44px] items-center gap-1.5 text-small text-tertiary transition-colors duration-150 ease-standard hover:text-primary"
            >
              <link.Icon
                size={15}
                strokeWidth={1.75}
                aria-hidden="true"
                className="transition-transform duration-200 ease-out-quart md:group-hover/social:-translate-y-0.5"
              />
              {link.label}
            </a>
          ))}
        </div>

        <div className="hero-in order-2 flex w-full justify-center lg:col-span-5 lg:row-span-2 lg:justify-end" style={enter(300)}>
          <div className="w-full max-w-[280px] sm:max-w-[320px]">
            <ProfileCard
              name="Adil Munawar"
              title="ML engineer · remote sensing"
              handle="adilmunawarx"
              avatarUrl="/adil-munawar-uploads/eaf50e40-682a-4730-ac3c-407cf3e4896e.png"
              miniAvatarUrl="/adil-munawar-uploads/eaf50e40-682a-4730-ac3c-407cf3e4896e.png"
              showUserInfo={true}
              enableTilt={true}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
