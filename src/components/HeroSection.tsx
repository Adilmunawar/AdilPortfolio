'use client';
import { Github, Instagram, Linkedin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import React, { useRef, useState, useEffect } from 'react';

const HeroSection = () => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(100);

  const toRotate = [ "Vibe Coder", "Frontend Engineer", "UI/UX Enthusiast" ];
  const period = 1500;

  useEffect(() => {
    let ticker = setInterval(() => {
      tick();
    }, typingSpeed);

    return () => { clearInterval(ticker) };
  }, [text, typingSpeed])

  const tick = () => {
    let i = loopNum % toRotate.length;
    let fullText = toRotate[i];
    let updatedText = isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1);

    setText(updatedText);

    if (isDeleting) {
      setTypingSpeed(prevSpeed => prevSpeed / 2);
    }

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true);
      setTypingSpeed(period);
    } else if (isDeleting && updatedText === '') {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setTypingSpeed(50);
    } else if (!isDeleting) {
        setTypingSpeed(100);
    }
  }

  const socialLinks = [
    {
      Icon: Instagram,
      href: 'https://instagram.com/adilmunawarx',
      label: 'Instagram',
      color: 'text-gray-400',
      glowColorStart: 'rgba(59, 29, 138, 0.4)',
      glowColorEnd: 'rgba(59, 29, 138, 0.7)',
      gradientColor: 'var(--cyber-purple)',
    },
    {
      Icon: Github,
      href: 'https://github.com/adilmunawar',
      label: 'GitHub',
      color: 'text-gray-400',
      glowColorStart: 'rgba(59, 29, 138, 0.4)',
      glowColorEnd: 'rgba(59, 29, 138, 0.7)',
      gradientColor: 'var(--cyber-purple)',
    },
    {
      Icon: Linkedin,
      href: 'https://linkedin.com/in/adilmunawar',
      label: 'LinkedIn',
      color: 'text-gray-400',
      glowColorStart: 'rgba(67, 56, 202, 0.4)',
      glowColorEnd: 'rgba(67, 56, 202, 0.7)',
      gradientColor: 'var(--cyber-blue)',
    },
    {
      Icon: Phone,
      href: 'tel:+923244965220',
      label: 'Phone',
      color: 'text-gray-400',
      glowColorStart: 'rgba(74, 222, 128, 0.4)',
      glowColorEnd: 'rgba(34, 197, 94, 0.7)',
      gradientColor: 'var(--cyber-blue)',
    },
  ];

  const skills = ['React', 'TypeScript', 'Framer Motion', 'Vite', 'Azure'];
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

  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rotateX = (y / rect.height - 0.5) * -15;
      const rotateY = (x / rect.width - 0.5) * 15;

      button.style.setProperty('--glow-x', `${x}px`);
      button.style.setProperty('--glow-y', `${y}px`);
      button.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    };

    const handleMouseLeave = () => {
      button.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    };

    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (button) {
        button.removeEventListener('mousemove', handleMouseMove);
        button.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-4 pt-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="animate-fade-in-up">
          {/* Professional name with subtle effects */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 drop-shadow-lg relative">
            <span className="text-gradient-slow relative z-10">Adil Munawar</span>
          </h1>
          
          {/* Professional subtitle */}
          <div className="relative mb-8 h-10">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-200 drop-shadow-md animate-fade-in-up" style={{
              animationDelay: '0.3s'
            }}>
              <span className="typing-cursor">{text}</span>
            </h3>
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
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--cyber-purple)] to-[var(--cyber-blue)] opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-md"></div>
                <span className="relative text-gray-300 text-sm font-medium transition-colors duration-300 group-hover:text-white">
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
                <Link 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group relative"
                  aria-label={social.label}
                >
                  <div 
                    className="absolute -inset-0.5 rounded-full bg-transparent group-hover:bg-[conic-gradient(from_90deg_at_50%_50%,var(--cyber-purple)_50%,var(--gradient-color)_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient-rotate"
                    style={{ '--gradient-color': social.gradientColor } as React.CSSProperties}
                  ></div>
                  <div 
                    className="relative w-14 h-14 bg-cyber-dark rounded-full transition-all duration-300 group-hover:scale-110 flex items-center justify-center border-2 border-gray-700/60 group-hover:border-transparent animate-social-icon-pulse"
                    style={{
                      '--glow-color-start': 'var(--cyber-purple)',
                      '--glow-color-end': 'var(--cyber-blue)',
                    } as React.CSSProperties}
                  >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 opacity-80 group-hover:opacity-50 transition-opacity duration-300"></div>
                    
                    <social.Icon size={26} className={`${social.color} transition-all duration-300 group-hover:scale-125 group-hover:text-white relative z-10`} />
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>{social.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Professional CTA button */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <Button
            ref={buttonRef}
            className="group relative inline-flex items-center justify-center rounded-full bg-transparent px-8 py-4 text-lg font-bold text-white overflow-hidden"
            style={{
              transition: 'transform 0.1s ease-out',
              transformStyle: 'preserve-3d',
            } as React.CSSProperties}
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <div className="absolute inset-[-2px] rounded-full bg-gradient-to-r from-[var(--cyber-purple)] via-[var(--cyber-blue)] to-[var(--cyber-purple)] opacity-75 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 rounded-full bg-cyber-dark"></div>
            <div
              className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_var(--glow-x)_var(--glow-y),_rgba(59,29,138,0.3)_0%,_rgba(30,30,57,0)_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ '--glow-x': '50%', '--glow-y': '50%' } as React.CSSProperties}
            ></div>
            <span className="relative z-10 flex items-center gap-2 group-hover:scale-105 transition-transform duration-500" style={{ textShadow: '0 0 15px rgba(30, 30, 57, 0.5)' }}>
              Decrypt my codeverse →
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
