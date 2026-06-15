'use client';

import { Github, Instagram, Linkedin, Phone } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import React from 'react';
import ProfileCard from './ProfileCard';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const socialLinks = [
    {
      Icon: Linkedin,
      href: 'https://linkedin.com/in/adilmunawar',
      label: 'LinkedIn',
      color: 'text-frost-blue',
      gradientColor: 'var(--vivid-blue)',
    },
    {
      Icon: Github,
      href: 'https://github.com/adilmunawar',
      label: 'GitHub',
      color: 'text-frost-blue',
      gradientColor: 'var(--vivid-blue)',
    },
    {
      Icon: Instagram,
      href: 'https://instagram.com/adilmunawarx',
      label: 'Instagram',
      color: 'text-frost-blue',
      gradientColor: 'var(--vivid-blue)',
    },
    {
      Icon: Phone,
      href: 'tel:+923244965220',
      label: 'Phone',
      color: 'text-frost-blue',
      gradientColor: 'var(--vivid-blue)',
    },
  ];

  return (
    <section id="home" className="min-h-screen w-full relative overflow-hidden flex items-center justify-center pt-20 pb-12 px-4 md:px-8 xl:px-16">
      
      {/* LEFT COLUMN: Vertical Social Links */}
      <div className="hidden xl:flex absolute left-8 inset-y-0 flex-col items-center justify-center z-20 pointer-events-none">
        <motion.div 
            className="flex flex-col justify-center gap-6 pointer-events-auto border-r border-white/5 pr-8 h-[80vh] max-h-[800px]"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
        >
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
                    className="absolute -inset-0.5 rounded-full bg-transparent group-hover:bg-[conic-gradient(from_90deg_at_50%_50%,var(--vivid-blue)_50%,var(--gradient-color)_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient-rotate"
                    style={{ '--gradient-color': social.gradientColor } as React.CSSProperties}
                  ></div>
                  <div 
                    className="relative w-12 h-12 bg-cyber-dark rounded-full transition-all duration-300 group-hover:scale-110 flex items-center justify-center border border-white/5 group-hover:border-vivid-blue shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_25px_rgba(0,102,255,0.6)]"
                  >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyber-dark to-slate-800 opacity-80 group-hover:opacity-50 transition-opacity duration-300"></div>
                    <social.Icon size={20} className={`${social.color} transition-all duration-300 group-hover:scale-125 group-hover:text-white relative z-10`} />
                  </div>
                </a>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{social.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </motion.div>
      </div>

      {/* MOBILE SOCIAL LINKS (Visible only on smaller screens) */}
      <motion.div 
          className="flex xl:hidden absolute bottom-12 left-0 right-0 justify-center gap-6 z-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
      >
        {socialLinks.map((social, index) => (
          <a 
            key={index}
            href={social.href} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-10 h-10 bg-cyber-dark rounded-full flex items-center justify-center border border-white/10"
            aria-label={social.label}
          >
            <social.Icon size={18} className={social.color} />
          </a>
        ))}
      </motion.div>

      {/* CENTER COLUMN: Just the Profile Card */}
      <div className="flex flex-col items-center justify-center relative z-10 w-full max-w-lg mx-auto">
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="w-full flex justify-center scale-95 sm:scale-100 origin-center"
        >
          <ProfileCard
            name="Adil Munawar"
            title="Web Developer"
            handle="Adil Munawar"
            status="Online"
            contactText="Contact Me"
            avatarUrl="/adil-munawar-uploads/eaf50e40-682a-4730-ac3c-407cf3e4896e.png"
            miniAvatarUrl="/adil-munawar-uploads/eaf50e40-682a-4730-ac3c-407cf3e4896e.png"
            showUserInfo={true}
            enableTilt={true}
            onContactClick={() => window.open("https://wa.me/+923244965220", "_blank")}
          />
        </motion.div>
      </div>

      {/* RIGHT COLUMN: Rotated Name & CTA (Parallel) */}
      <div className="hidden xl:flex absolute right-8 inset-y-0 flex-row items-center justify-center gap-12 z-20 pointer-events-none">
         
         {/* CTA Button */}
         <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col items-center justify-center pointer-events-auto h-full pt-16"
         >
            <a
              href="#projects"
              className="group flex flex-col items-center justify-center gap-8"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className="text-frost-blue/70 hover:text-white font-semibold tracking-[0.4em] uppercase text-[11px] transition-colors duration-300" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                Decrypt my codeverse
              </span>
              
              {/* Refined sleek animated arrow */}
              <div className="relative flex flex-col items-center h-16 group-hover:h-24 transition-all duration-500 overflow-hidden">
                <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-vivid-blue to-vivid-blue group-hover:shadow-[0_0_10px_rgba(0,102,255,0.8)] transition-all duration-300"></div>
                <div className="w-2 h-2 border-r-2 border-b-2 border-vivid-blue transform rotate-45 -mt-[2px] group-hover:shadow-[2px_2px_5px_rgba(0,102,255,0.5)] transition-all duration-300"></div>
              </div>
            </a>
         </motion.div>

         {/* Rotated Name */}
         <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex items-center justify-center border-l border-white/5 pl-8 h-[80vh] max-h-[800px]"
         >
            <h1 
                className="text-6xl 2xl:text-[5.5rem] font-black text-transparent bg-clip-text bg-gradient-to-t from-vivid-blue via-blue-400 to-white tracking-[0.1em] drop-shadow-[0_0_30px_rgba(0,102,255,0.5)] leading-none whitespace-nowrap"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
                Adil Munawar
            </h1>
         </motion.div>
      </div>

    </section>
  );
};

export default HeroSection;