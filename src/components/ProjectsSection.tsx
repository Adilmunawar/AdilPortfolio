'use client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Github, ExternalLink, Play, Pause, Code2, Sparkles, Bot, ImageIcon, Users } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

const ProjectsSection = () => {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  const projects = [
    {
      title: 'Adicorp',
      description: 'A comprehensive Human Resource Management System (HRMS) to automate HR processes.',
      longDescription: 'Adicorp is a full-featured HRMS designed to streamline and automate critical HR processes including employee management, attendance tracking, and salary calculation. Built for efficiency and scalability.',
      image: '/AdiCorp.png',
      tech: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
      github: 'https://github.com/adilmunawar/Adicorp',
      live: 'https://adicorp.vercel.app',
      status: 'development',
      statusColor: 'text-blue-400',
      statusBg: 'bg-blue-500/10',
      statusBorder: 'border-blue-400/20',
      statusIcon: Code2,
      gradient: 'from-blue-800/5 to-cyan-800/5',
      hoverGradient: 'hover:from-blue-800/15 hover:to-cyan-800/15',
      borderColor: 'border-blue-700/20 hover:border-blue-700/40',
      accentColor: 'text-blue-400'
    },
    {
      title: 'AdiNox',
      description: 'An open-source Android authenticator app for secure two-factor authentication (2FA).',
      longDescription: 'AdiNox is a free, open-source Android authenticator app supporting TOTP and HOTP algorithms. It features a high-quality, animated UI for a seamless and secure user experience.',
      image: '/AdiNox.png',
      tech: ['Android', 'Java', '2FA', 'Security'],
      github: 'https://github.com/adilmunawar/Adinox',
      live: 'https://play.google.com/store/apps/details?id=com.adinox',
      status: 'live',
      statusColor: 'text-emerald-400',
      statusBg: 'bg-emerald-500/10',
      statusBorder: 'border-emerald-400/20',
      statusIcon: Play,
      gradient: 'from-emerald-800/5 to-green-800/5',
      hoverGradient: 'hover:from-emerald-800/15 hover:to-green-800/15',
      borderColor: 'border-emerald-700/20 hover:border-emerald-700/40',
      accentColor: 'text-emerald-400'
    },
    {
      title: 'AdiGon',
      description: 'An AI assistant with a specialized \'developer mode\' and multi-file format capabilities.',
      longDescription: 'AdiGon is an advanced AI assistant built with unique functionalities. It includes a \'developer mode\' for coding tasks and has the ability to understand and respond to multiple file formats, making it a versatile tool.',
      image: '/AdiGon.png',
      tech: ['Python', 'AI', 'Gemini API', 'Next.js'],
      github: 'https://github.com/adilmunawar/AdiGon',
      live: 'https://adigon.vercel.app',
      status: 'live',
      statusColor: 'text-purple-400',
      statusBg: 'bg-purple-500/10',
      statusBorder: 'border-purple-400/20',
      statusIcon: Bot,
      gradient: 'from-purple-800/5 to-pink-800/5',
      hoverGradient: 'hover:from-purple-800/15 hover:to-pink-800/15',
      borderColor: 'border-purple-700/20 hover:border-purple-700/40',
      accentColor: 'text-purple-400'
    },
    {
      title: 'AdiFlux',
      description: 'An AI-powered web application for generating high-quality images from text prompts.',
      longDescription: 'AdiFlux leverages the power of AI to transform text into stunning visuals. This web application allows users to create new, unique images directly from text prompts, opening up endless creative possibilities.',
      image: '/AdiFlux.png',
      tech: ['Next.js', 'AI', 'Image Generation', 'Vercel'],
      github: 'https://github.com/adilmunawar/AdiFlux',
      live: 'https://adiflux.vercel.app',
      status: 'live',
      statusColor: 'text-emerald-400',
      statusBg: 'bg-emerald-500/10',
      statusBorder: 'border-emerald-400/20',
      statusIcon: ImageIcon,
      gradient: 'from-sky-800/5 to-cyan-800/5',
      hoverGradient: 'hover:from-sky-800/15 hover:to-cyan-800/15',
      borderColor: 'border-sky-700/20 hover:border-sky-700/40',
      accentColor: 'text-sky-400'
    },
    {
      title: 'AdiMage',
      description: 'A multi-functional AI image editing suite for advanced photo manipulation and enhancement.',
      longDescription: 'AdiMage is a powerful AI image editing suite using the Gemini API. Its tools include AI Photo Restoration, Profile Picture Pro, AI Product Studio for background replacement, and AI Style Transfer.',
      image: 'https://images.unsplash.com/photo-1579541629929-a18de8fb3828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      tech: ['Gemini API', 'React', 'AI', 'Image Editing'],
      github: 'https://github.com/adilmunawar/Adimage',
      live: 'https://adimage.vercel.app',
      status: 'development',
      statusColor: 'text-amber-400',
      statusBg: 'bg-amber-500/10',
      statusBorder: 'border-amber-400/20',
      statusIcon: Code2,
      gradient: 'from-amber-800/5 to-orange-800/5',
      hoverGradient: 'hover:from-amber-800/15 hover:to-orange-800/15',
      borderColor: 'border-amber-700/20 hover:border-amber-700/40',
      accentColor: 'text-amber-400'
    },
    {
      title: 'AdiTron (AditronDev)',
      description: 'A social chatting application with a high-standard UI/UX for real-time interaction.',
      longDescription: 'AdiTron (AditronDev) is a modern social chatting application built with TypeScript. It focuses on a high-standard UI/UX and sophisticated features for seamless, real-time social interaction.',
      image: '/AdiTron.png',
      tech: ['TypeScript', 'React', 'WebSockets', 'UI/UX'],
      github: 'https://github.com/adilmunawar/Aditron',
      live: 'https://aditron.vercel.app',
      status: 'live',
      statusColor: 'text-rose-400',
      statusBg: 'bg-rose-500/10',
      statusBorder: 'border-rose-400/20',
      statusIcon: Play,
      gradient: 'from-rose-800/5 to-pink-800/5',
      hoverGradient: 'hover:from-rose-800/15 hover:to-pink-800/15',
      borderColor: 'border-rose-700/20 hover:border-rose-700/40',
      accentColor: 'text-rose-400'
    },
    {
      title: 'Adify',
      description: 'An AI-powered resume builder to help you craft the perfect resume.',
      longDescription: 'Adify is an intelligent resume builder that leverages the Gemini API to help users create professional, polished resumes. It can assist with wording, formatting, and tailoring your resume to specific job descriptions.',
      image: '/Adify.png',
      tech: ['Gemini API', 'AI', 'Resume', 'React'],
      github: 'https://github.com/adilmunawar/Adify',
      live: 'https://adify.vercel.app',
      status: 'paused',
      statusColor: 'text-gray-400',
      statusBg: 'bg-gray-500/10',
      statusBorder: 'border-gray-400/20',
      statusIcon: Pause,
      gradient: 'from-gray-800/5 to-slate-800/5',
      hoverGradient: 'hover:from-gray-800/15 hover:to-slate-800/15',
      borderColor: 'border-gray-700/20 hover:border-gray-700/40',
      accentColor: 'text-gray-400'
    }
  ];

  const getStatusText = (status: string) => {
    switch (status) {
      case 'live': return 'Live';
      case 'paused': return 'Paused';
      case 'development': return 'In Development';
      default: return status;
    }
  };

  return (
    <section id="projects" className="min-h-screen py-20 px-4 relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20 animate-fade-in-up">
          <div className="inline-block mb-8">
            <span className="text-gray-400 text-sm font-semibold tracking-widest uppercase bg-cyber-purple/5 px-6 py-3 rounded-full border border-cyber-purple/20 backdrop-blur-sm animate-pulse-slow">
              <Sparkles className="inline w-4 h-4 mr-2 text-cyber-purple animate-pulse" />
              Featured Work
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold mb-8 text-gradient-slow drop-shadow-2xl">
            My Projects
          </h2>
          <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
            Explore my latest creations showcasing modern web technologies, 
            <span className="text-gray-300 font-semibold"> innovative solutions</span>, and 
            cutting-edge design principles
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
          {projects.map((project, index) => (
            <Card 
              key={index}
              className={`group relative bg-gray-900/40 backdrop-blur-xl border-2 ${project.borderColor} rounded-3xl overflow-hidden transition-all duration-700 hover:scale-[1.02] cursor-pointer animate-scale-in shadow-2xl hover:shadow-3xl`}
              style={{ animationDelay: `${index * 0.2}s` }}
              onMouseEnter={() => setHoveredProject(index)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              <div className="absolute top-4 right-4 z-20">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${project.statusBg} border ${project.statusBorder} backdrop-blur-sm`}>
                  <project.statusIcon size={12} className={project.statusColor} />
                  <span className={`text-xs font-semibold ${project.statusColor}`}>
                    {getStatusText(project.status)}
                  </span>
                </div>
              </div>

              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent z-10"></div>
                <Image 
                  src={project.image} 
                  alt={project.title}
                  layout="fill"
                  className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 flex gap-4 z-20">
                  <Button
                    size="sm"
                    className="bg-cyber-blue/90 text-white hover:bg-cyber-blue rounded-full px-4 py-2 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-110"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(project.live, '_blank');
                    }}
                  >
                    <ExternalLink size={16} className="mr-2" />
                    Live
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-gray-800/60 text-gray-200 border-gray-600/30 hover:bg-gray-700/60 rounded-full px-4 py-2 backdrop-blur-sm transition-all duration-300 hover:scale-110"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(project.github, '_blank');
                    }}
                  >
                    <Github size={16} className="mr-2" />
                    Code
                  </Button>
                </div>
              </div>

              <div className="p-8 relative">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className={`px-3 py-1 text-xs rounded-full bg-gray-800/40 border border-gray-700/50 text-gray-300 backdrop-blur-sm transition-all duration-300 hover:bg-gray-700/60 hover:scale-105`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <h3 className="text-2xl font-bold text-gray-200 mb-3 group-hover:text-gray-100 transition-colors duration-500">
                  {project.title}
                </h3>
                
                <p className="text-gray-400 text-sm mb-4 group-hover:text-gray-300 transition-colors duration-500 leading-relaxed min-h-[40px]">
                  {hoveredProject === index ? project.longDescription : project.description}
                </p>

                <div className="flex gap-3 pt-4 border-t border-gray-700/30">
                  <Button
                    size="sm"
                    className={`flex-1 bg-gray-800/40 border border-gray-700/50 text-gray-300 hover:bg-gray-700/60 hover:text-white transition-all duration-500 hover:scale-105 backdrop-blur-sm rounded-xl`}
                    onClick={() => window.open(project.live, '_blank')}
                  >
                    <ExternalLink size={16} className="mr-2" />
                    View Live
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-gray-700/50 text-gray-400 hover:bg-gray-800/40 hover:text-gray-200 transition-all duration-500 hover:scale-105 backdrop-blur-sm rounded-xl"
                    onClick={() => window.open(project.github, '_blank')}
                  >
                    <Github size={16} className="mr-2" />
                    GitHub
                  </Button>
                </div>
              </div>

              <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-700 bg-gradient-to-r ${project.gradient} blur-xl`}></div>
              
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className={`absolute inset-0 rounded-3xl border-2 ${project.borderColor} animate-pulse-slow`}></div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <div className="relative inline-block">
            <Button 
              className="bg-gradient-to-r from-cyber-purple to-cyber-blue text-white hover:from-cyber-blue hover:to-cyber-purple px-8 py-4 text-lg font-semibold rounded-full transition-all duration-700 hover:scale-110 shadow-2xl shadow-cyber-purple/20 hover:shadow-cyber-blue/30 backdrop-blur-sm border border-white/20 group relative overflow-hidden"
              onClick={() => window.open('https://github.com/adilmunawar', '_blank')}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Github size={20} />
                View All Projects
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </span>
              
              <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue to-cyber-purple transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
