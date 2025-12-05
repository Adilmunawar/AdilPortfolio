
'use client';
import { Sparkles, Github, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const projects = [
    {
      title: 'Adicorp',
      description: 'A comprehensive Human Resource Management System (HRMS) designed to streamline and automate critical HR processes including employee management, attendance tracking, and salary calculation.',
      image: '/AdiCorp.png',
      tech: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
      github: 'https://github.com/adilmunawar/Adicorp',
      live: 'https://adicorp.vercel.app',
    },
    {
      title: 'AdiNox',
      description: 'An open-source Android authenticator app supporting TOTP and HOTP algorithms. It features a high-quality, animated UI for a seamless and secure user experience.',
      image: '/AdiNox.png',
      tech: ['Android', 'Java', '2FA', 'Security'],
      github: 'https://github.com/adilmunawar/adinox',
      live: 'https://adinox.vercel.app',
    },
    {
      title: 'AdiGon',
      description: 'An advanced AI assistant with a specialized \'developer mode\' and multi-file format capabilities, making it a versatile tool for various tasks.',
      image: '/AdiGon.png',
      tech: ['Python', 'AI', 'Gemini API', 'Next.js'],
      github: 'https://github.com/adilmunawar/adigon',
      live: 'https://adigon.vercel.app',
    },
    {
      title: 'AdiFlux',
      description: 'An AI-powered web application for generating high-quality images from text prompts, opening up endless creative possibilities for users.',
      image: '/AdiFlux.png',
      tech: ['Next.js', 'AI', 'Image Generation', 'Vercel'],
      github: 'https://github.com/adilmunawar/adiflux',
      live: 'https://adiflux.vercel.app',
    },
    {
      title: 'AdiTron (AditronDev)',
      description: 'A modern social chatting application built with TypeScript, focusing on a high-standard UI/UX and sophisticated features for seamless, real-time social interaction.',
      image: '/AdiTron.png',
      tech: ['TypeScript', 'React', 'WebSockets', 'UI/UX'],
      github: 'https://github.com/adilmunawar/aditron',
      live: 'https://aditron.vercel.app',
    },
    {
      title: 'Adify',
      description: 'An intelligent resume builder that leverages the Gemini API to help users create professional, polished resumes tailored to specific job descriptions.',
      image: '/Adify.png',
      tech: ['Gemini API', 'AI', 'Resume', 'React'],
      github: 'https://github.com/adilmunawar/adify',
      live: 'https://adify.vercel.app',
    }
  ];

const ProjectsSection = () => {
  return (
    <section id="projects" className="min-h-screen py-20 px-4 relative bg-cyber-dark">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.map((project, index) => (
            <Card 
              key={index}
              className="group relative bg-cyber-gray/40 border-2 border-cyber-purple/20 rounded-2xl overflow-hidden transition-all duration-500 hover:border-cyber-blue/60 hover:shadow-2xl hover:shadow-cyber-blue/20 hover:-translate-y-2 animate-scale-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="relative overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  width={600}
                  height={400}
                  className="object-cover w-full h-48 transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cyber-gray via-cyber-gray/50 to-transparent"></div>
              </div>
              <CardHeader className="relative pt-4">
                <CardTitle className="text-2xl font-bold text-gray-100 group-hover:text-white transition-colors">
                  {project.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-6 min-h-[100px]">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((techItem) => (
                    <span
                      key={techItem}
                      className="px-3 py-1 text-xs rounded-full bg-cyber-blue/10 border border-cyber-blue/20 text-cyber-blue/80 group-hover:bg-cyber-blue/20 transition-colors"
                    >
                      {techItem}
                    </span>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex gap-4 p-4 bg-cyber-gray/20">
                  <Button
                    className="flex-1 bg-cyber-blue/80 text-white hover:bg-cyber-blue rounded-lg transition-all duration-300 hover:scale-105"
                    onClick={() => window.open(project.live, '_blank')}
                  >
                    <ExternalLink size={16} className="mr-2" />
                    Live Demo
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent text-gray-300 border-gray-600/50 hover:bg-gray-700/60 hover:text-white rounded-lg transition-all duration-300 hover:scale-105"
                    onClick={() => window.open(project.github, '_blank')}
                  >
                    <Github size={16} className="mr-2" />
                    Code
                  </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
