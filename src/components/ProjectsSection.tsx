'use client';
import { Sparkles, Github, ExternalLink, Code2, Globe } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const projects = [
  {
    title: 'Adigaze',
    description: 'Advanced AI-powered candidate management system. Features a comprehensive dashboard to track applicants through the hiring pipeline, utilizing AI to match candidates with specific job requirements.',
    image: '/adigaze.jpg',
    tech: ['React', 'AI pipelines', 'PostgreSQL', 'Supabase'],
    github: 'https://github.com/adilmunawar/Adigaze',
    live: 'https://adigaze.vercel.app',
  },
  {
    title: 'Adicorp',
    description: 'A comprehensive Human Resource Management System (HRMS) designed to automate critical HR processes including employee management, attendance tracking, and salary calculation.',
    image: '/adicorp.jpg',
    tech: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
    github: 'https://github.com/adilmunawar/Adicorp',
    live: 'https://adicorp.vercel.app',
  },
  {
    title: 'AdiNox',
    description: 'An open-source Android authenticator app supporting TOTP and HOTP algorithms. It features a high-quality, animated UI for a seamless and secure user experience.',
    image: '/adinox.jpg',
    tech: ['Android', 'Java', '2FA', 'Security'],
    github: 'https://github.com/adilmunawar/adinox',
    live: 'https://adinox.vercel.app',
  },
  {
    title: 'AdiGon',
    description: 'An advanced AI assistant with a specialized "developer mode" and multi-file format capabilities, making it a versatile tool for various complex technical tasks.',
    image: '/adigon.jpg',
    tech: ['Python', 'AI', 'Gemini', 'Next.js'],
    github: 'https://github.com/adilmunawar/adigon',
    live: 'https://adigon.vercel.app',
  },
  {
    title: 'AdiFlux',
    description: 'An AI-powered web application for generating high-quality images from text prompts, opening up endless creative possibilities for users through simple prompts.',
    image: '/adiflux.jpg',
    tech: ['Next.js', 'AI', 'Image Generation', 'Vercel'],
    github: 'https://github.com/adilmunawar/adiflux',
    live: 'https://adiflux.vercel.app',
  },
  {
    title: 'Aditron',
    description: 'A modern social chatting application built with TypeScript, focusing on a high-standard UI/UX and sophisticated features for seamless, real-time social interaction.',
    image: '/aditron.jpg',
    tech: ['TypeScript', 'React', 'WebSockets', 'UI/UX'],
    github: 'https://github.com/adilmunawar/aditron',
    live: 'https://aditron.vercel.app',
  },
  {
    title: 'Adify',
    description: 'An intelligent resume builder that leverages the Gemini API to help users create professional, polished resumes tailored to specific job descriptions.',
    image: '/adify.jpg',
    tech: ['Gemini API', 'AI', 'Resume', 'React'],
    github: 'https://github.com/adilmunawar/adify',
    live: 'https://adifyai.vercel.app',
  }
];

const ProjectsSection = () => {
  return (
    <section id="projects" className="py-32 px-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-neon-cyan/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyber-dark/50 border border-neon-cyan/20 text-neon-cyan backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest">Featured Ecosystem</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-white tracking-tight"
          >
            Selected <span className="text-gradient animate-shimmer">Artifacts</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-frost-cyan/70 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            A collection of high-concurrency systems, AI integrations, and open-source tools designed for modern digital environments.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card 
                className="group h-full flex flex-col bg-cyber-dark/40 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden transition-all duration-500 hover:border-neon-cyan/50 hover:shadow-[0_0_40px_-15px_rgba(34,211,238,0.3)]"
              >
                {/* Image Container */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark via-cyber-dark/20 to-transparent" />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-neon-cyan/10 backdrop-blur-[2px]">
                    <div className="flex gap-4">
                      <Button
                        size="icon"
                        className="w-12 h-12 rounded-full bg-white text-black hover:bg-neon-cyan hover:text-white transition-all duration-300"
                        onClick={() => window.open(project.live, '_blank')}
                        title="View Live Site"
                      >
                        <Globe size={20} />
                      </Button>
                      <Button
                        size="icon"
                        className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300"
                        onClick={() => window.open(project.github, '_blank')}
                        title="View Code"
                      >
                        <Github size={20} />
                      </Button>
                    </div>
                  </div>
                </div>

                <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-2xl font-bold text-white group-hover:text-neon-cyan transition-colors">
                    {project.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="px-8 flex-grow">
                  <p className="text-frost-cyan/70 text-sm leading-relaxed mb-8 line-clamp-4 font-medium">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((techItem) => (
                      <span
                        key={techItem}
                        className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-white/5 border border-white/5 text-frost-cyan group-hover:border-neon-cyan/20 group-hover:text-white transition-all"
                      >
                        {techItem}
                      </span>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="p-8 pt-4 flex gap-4">
                  <Button
                    className="flex-1 h-12 rounded-2xl bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan hover:text-black border border-neon-cyan/20 font-bold text-xs uppercase tracking-widest transition-all duration-300"
                    onClick={() => window.open(project.live, '_blank')}
                  >
                    <ExternalLink size={14} className="mr-2" />
                    Launch
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex-1 h-12 rounded-2xl bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/10 font-bold text-xs uppercase tracking-widest transition-all duration-300"
                    onClick={() => window.open(project.github, '_blank')}
                  >
                    <Code2 size={14} className="mr-2" />
                    Source
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;