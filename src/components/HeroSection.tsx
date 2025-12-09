'use client';
import { Github, Instagram, Linkedin, Phone } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import React, { useRef, useState, useEffect } from 'react';
import TextRoller from './TextRoller';

const HeroSection = () => {
  const toRotate = [ "Frontend Engineer", "UI/UX Enthusiast", "Vibe Coder" ];

  const socialLinks = [
    {
      Icon: Instagram,
      href: 'https://instagram.com/adilmunawarx',
      label: 'Instagram',
      color: 'text-frost-cyan',
      glowColorStart: 'rgba(34, 211, 238, 0.4)',
      glowColorEnd: 'rgba(34, 211, 238, 0.7)',
      gradientColor: 'var(--neon-cyan)',
    },
    {
      Icon: Github,
      href: 'https://github.com/adilmunawar',
      label: 'GitHub',
      color: 'text-frost-cyan',
      glowColorStart: 'rgba(34, 211, 238, 0.4)',
      glowColorEnd: 'rgba(34, 211, 238, 0.7)',
      gradientColor: 'var(--neon-cyan)',
    },
    {
      Icon: Linkedin,
      href: 'https://linkedin.com/in/adilmunawar',
      label: 'LinkedIn',
      color: 'text-frost-cyan',
      glowColorStart: 'rgba(34, 211, 238, 0.4)',
      glowColorEnd: 'rgba(34, 211, 238, 0.7)',
      gradientColor: 'var(--neon-cyan)',
    },
    {
      Icon: Phone,
      href: 'tel:+923244965220',
      label: 'Phone',
      color: 'text-frost-cyan',
      glowColorStart: 'rgba(34, 211, 238, 0.4)',
      glowColorEnd: 'rgba(34, 211, 238, 0.7)',
      gradientColor: 'var(--neon-cyan)',
    },
  ];

  const skills = ['React', 'TypeScript', 'Next.js', 'Vite', 'Azure'];
  const skillRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent, index: number) => {
      const ref = skillRefs.current[index];
      if (!ref) return;

      const rect = ref.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rotateX = (y / rect.height - 0.5) * -20; // Tilt range
      const rotateY = (x / rect.width - 0.5) * 20;

      ref.style.setProperty('--rotate-x', `${rotateX}deg`);
      ref.style.setProperty('--rotate-y', `${rotateY}deg`);
      ref.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    };

    const handleMouseLeave = (index: number) => {
      const ref = skillRefs.current[index];
      if (!ref) return;
      ref.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    };

    const refs = skillRefs.current;
    refs.forEach((ref, index) => {
      if (ref) {
        const mouseMove = (e: MouseEvent) => handleMouseMove(e, index);
        const mouseLeave = () => handleMouseLeave(index);
        ref.addEventListener('mousemove', mouseMove);
        ref.addEventListener('mouseleave', mouseLeave);
        return () => {
          if (ref) {
            ref.removeEventListener('mousemove', mouseMove);
            ref.removeEventListener('mouseleave', mouseLeave);
          }
        };
      }
    });
  }, []);

  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-4 pt-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="animate-fade-in-up">
          {/* Professional name with subtle effects */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 drop-shadow-lg relative">
            <a href="#home" className="text-frost-white relative z-10 animate-text-glow">Adil Munawar</a>
          </h1>
          
          {/* Professional subtitle */}
          <div className="relative mb-8 h-12 flex items-center justify-center">
            <TextRoller roles={toRotate} />
          </div>

          {/* Skills preview */}
          <div className="flex flex-wrap justify-center gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            {skills.map((skill, index) => (
              <div
                key={skill}
                ref={(el) => { skillRefs.current[index] = el; }}
                className="group relative px-4 py-2 rounded-full transition-all duration-300 bg-gray-800/40 border border-white/10 backdrop-blur-sm hover:bg-gray-700/60"
                style={{ transition: 'transform 0.1s ease-out' }}
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-neon-cyan to-frost-cyan opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-md"></div>
                <span className="relative text-frost-cyan text-sm font-medium transition-colors duration-300 group-hover:text-frost-white">
                  {skill}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Redesigned social links with advanced animations */}
        <div className="flex justify-center space-x-4 mb-12 animate-scale-in" style={{
          animationDelay: '0.6s'
        }}>
          {socialLinks.map((social, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <a 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group relative"
                  aria-label={social.label}
                >
                  <div 
                    className="absolute -inset-0.5 rounded-full bg-transparent group-hover:bg-[conic-gradient(from_90deg_at_50%_50%,var(--neon-cyan)_50%,var(--gradient-color)_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient-rotate"
                    style={{ '--gradient-color': social.gradientColor } as React.CSSProperties}
                  ></div>
                  <div 
                    className="relative w-14 h-14 bg-cyber-dark rounded-full transition-all duration-300 group-hover:scale-110 flex items-center justify-center border-2 border-neon-cyan/50 group-hover:border-neon-cyan animate-social-icon-pulse"
                    style={{
                      '--glow-color-start': 'var(--neon-cyan)',
                      '--glow-color-end': 'rgba(34, 211, 238, 0.7)',
                    } as React.CSSProperties}
                  >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyber-dark to-slate-800 opacity-80 group-hover:opacity-50 transition-opacity duration-300"></div>
                    
                    <social.Icon size={26} className={`${social.color} transition-all duration-300 group-hover:scale-125 group-hover:text-frost-white relative z-10`} />
                  </div>
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>{social.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Professional CTA button */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <a
            href="#about"
            className="cta-btn"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <div className="cta-btn-background"></div>
            <span className="cta-btn-content">
              Decrypt my codeverse
              <span className="cta-btn-arrow">→</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
