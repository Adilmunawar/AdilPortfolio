
'use client';
import { Github, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import MermaidDiagram from './MermaidDiagram';
import { useEffect, useRef, useState } from 'react';

type Project = {
  title: string;
  description: string;
  image: string;
  tech: string[];
  github: string;
  live: string;
  mermaidCode: string | null;
  animationOrder: string[];
};

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    const currentRef = cardRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div ref={cardRef} className={`transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <h3 className="text-4xl font-bold text-center text-gradient-slow mb-12">
        {project.title}
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center mb-8">
        <div className="lg:col-span-2 rounded-2xl overflow-hidden shadow-2xl hover:shadow-cyber-purple/40 transition-shadow duration-500">
           <Image 
              src={project.image} 
              alt={project.title}
              width={600}
              height={400}
              className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
            />
        </div>
        <div className="lg:col-span-3">
          <p className="text-gray-300 text-lg leading-relaxed mb-6">{project.description}</p>
          <div className="flex flex-wrap gap-3 mb-6">
              {project.tech.map((tech, techIndex) => (
                <span
                  key={techIndex}
                  className="px-4 py-2 text-sm rounded-full bg-cyber-gray/60 border border-cyber-purple/20 text-gray-300 backdrop-blur-sm transition-all duration-300 hover:bg-cyber-purple/20 hover:scale-105"
                >
                  {tech}
                </span>
              ))}
          </div>
          <div className="flex gap-4">
              <Button
                className="flex-1 bg-cyber-blue/80 text-white hover:bg-cyber-blue rounded-xl px-4 py-2 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-105"
                onClick={() => window.open(project.live, '_blank')}
              >
                <ExternalLink size={18} className="mr-2" />
                Live Demo
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-gray-800/50 text-gray-200 border-gray-600/30 hover:bg-gray-700/60 rounded-xl px-4 py-2 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                onClick={() => window.open(project.github, '_blank')}
              >
                <Github size={18} className="mr-2" />
                Source Code
              </Button>
            </div>
        </div>
      </div>

      {project.mermaidCode && (
        <div>
            <h4 className="text-2xl font-bold text-center text-gray-300 mb-6">Project Architecture</h4>
            <div className="p-4 bg-cyber-gray/20 rounded-xl border border-cyber-purple/20 backdrop-blur-sm">
                 <MermaidDiagram 
                    key={project.title} 
                    chart={project.mermaidCode} 
                    animationOrder={project.animationOrder}
                    play={isVisible}
                />
            </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
