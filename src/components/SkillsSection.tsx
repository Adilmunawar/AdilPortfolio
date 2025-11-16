'use client';
import { useState, useEffect } from 'react';
import GitHubStats from './GitHubStats';
import { LogoLoop } from './LogoLoop';

const SkillsSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const skillsSection = document.getElementById('skills-section-observer');
    if(!skillsSection) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(skillsSection);

    return () => observer.disconnect();
  }, []);

  const frontendSkills = [
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg", alt: "React" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg", alt: "Next.js" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg", alt: "TypeScript" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg", alt: "JavaScript" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg", alt: "HTML5" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg", alt: "CSS3" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg", alt: "Tailwind" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg", alt: "Vue.js" }
  ];

  const backendSkills = [
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg", alt: "Node.js" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg", alt: "Python" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg", alt: "Express" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azuresqldatabase/azuresqldatabase-original.svg", alt: "SQL" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg", alt: "PostgreSQL" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg", alt: "Firebase" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg", alt: "Supabase" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg", alt: "Redis" }
  ];

  const toolsSkills = [
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg", alt: "Git" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg", alt: "GitHub" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg", alt: "VS Code" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg", alt: "Docker" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg", alt: "Figma" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/webpack/webpack-original.svg", alt: "Webpack" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azure/azure-original.svg", alt: "Azure" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg", alt: "Vercel" }
  ];

  return (
    <section id="skills" className="py-20 px-4 relative overflow-hidden">
      <div id="skills-section-observer" className="max-w-7xl mx-auto relative z-10">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className={`text-5xl md:text-7xl font-bold mb-6 transition-all duration-1000 ${
            isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-12'
          }`}>
            <span className="text-gradient animate-shimmer">Skills & Expertise</span>
          </h2>
          <p className={`text-xl text-gray-300 max-w-3xl mx-auto transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
          }`}>
            Mastering the latest technologies to build exceptional digital experiences
          </p>
        </div>
        
        {/* GitHub Stats */}
        <div className={`mb-16 transition-all duration-1000 delay-200 ${
          isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-12'
        }`}>
          <GitHubStats />
        </div>

        {/* Scrolling Frontend Banner */}
        <div className={`transition-all duration-1000 delay-200 mb-12 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <LogoLoop 
            logos={frontendSkills} 
            speed={40} 
            fadeOut={true} 
            logoHeight={80}
            gap={64}
            scaleOnHover={true}
            fadeOutColor='var(--cyber-dark)'
            renderItem={(item) => (
              'src' in item ? (
                <div className="flex flex-col items-center justify-center text-center gap-2">
                  <img src={item.src} alt={item.alt || ''} style={{height: '60px', width: '60px'}} />
                  <span className="text-xs text-gray-400">{item.alt}</span>
                </div>
              ) : null
            )}
          />
        </div>

        {/* Scrolling Backend Banner */}
        <div className={`transition-all duration-1000 delay-300 mb-12 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <LogoLoop 
            logos={backendSkills} 
            speed={40}
            direction="right"
            fadeOut={true} 
            logoHeight={80}
            gap={64}
            scaleOnHover={true}
            fadeOutColor='var(--cyber-dark)'
            renderItem={(item) => (
               'src' in item ? (
                <div className="flex flex-col items-center justify-center text-center gap-2">
                  <img src={item.src} alt={item.alt || ''} style={{height: '60px', width: '60px'}} />
                  <span className="text-xs text-gray-400">{item.alt}</span>
                </div>
              ) : null
            )}
          />
        </div>

        {/* Scrolling Tools Banner */}
        <div className={`transition-all duration-1000 delay-400 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <LogoLoop 
            logos={toolsSkills} 
            speed={40}
            direction="left"
            fadeOut={true} 
            logoHeight={80}
            gap={64}
            scaleOnHover={true}
            fadeOutColor='var(--cyber-dark)'
            renderItem={(item) => (
               'src' in item ? (
                <div className="flex flex-col items-center justify-center text-center gap-2">
                  <img src={item.src} alt={item.alt || ''} style={{height: '60px', width: '60px'}} />
                  <span className="text-xs text-gray-400">{item.alt}</span>
                </div>
              ) : null
            )}
          />
        </div>
      </div>

      {/* Optimized background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyber-blue/5 rounded-full blur-3xl" style={{ animation: 'drift1 25s ease-in-out infinite' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyber-purple/5 rounded-full blur-3xl" style={{ animation: 'drift2 30s ease-in-out infinite' }}></div>
        <div className="absolute top-3/4 left-1/2 w-72 h-72 bg-cyber-purple/5 rounded-full blur-3xl" style={{ animation: 'drift3 35s ease-in-out infinite' }}></div>
      </div>
    </section>
  );
};

export default SkillsSection;
