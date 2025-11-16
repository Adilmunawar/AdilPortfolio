'use client';
import { useState, useEffect } from 'react';
import GitHubStats from './GitHubStats';
import { LogoLoop } from './LogoLoop';
import './LogoLoop.css';

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
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", alt: "React" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg", alt: "Next.js" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", alt: "TypeScript" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", alt: "JavaScript" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg", alt: "HTML5" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg", alt: "CSS3" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg", alt: "Tailwind" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg", alt: "Vue.js" }
  ];
  
  const skillCategories = [
    {
      title: "Backend",
      color: "from-emerald-500 to-teal-500",
      skills: [
        { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
        { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
        { name: "Express", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
        { name: "SQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azuresqldatabase/azuresqldatabase-original.svg" },
        { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
        { name: "Firebase", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" },
        { name: "Supabase", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg" },
        { name: "Redis", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" }
      ]
    },
    {
      title: "Tools & Environment",
      color: "from-purple-500 to-pink-500",
      skills: [
        { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
        { name: "GitHub", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
        { name: "VS Code", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
        { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
        { name: "Figma", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
        { name: "Webpack", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webpack/webpack-original.svg" },
        { name: "Azure", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg" },
        { name: "Vercel", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg" }
      ]
    }
  ];

  return (
    <section id="skills" className="py-20 px-4 relative overflow-hidden">
      {/* Define SVG filter for the icons */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="purple-gradient-map">
            <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0
                                                 0.33 0.33 0.33 0 0
                                                 0.33 0.33 0.33 0 0
                                                 0 0 0 1 0" />
            <feComponentTransfer colorInterpolationFilters="sRGB">
              <feFuncR type="table" tableValues="0.23 0.53" />
              <feFuncG type="table" tableValues="0.11 0.49" />
              <feFuncB type="table" tableValues="0.54 0.76" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      <style jsx>{`
        .frontend-skill-icon {
          filter: url(#purple-gradient-map);
        }
      `}</style>

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
        <div className={`transition-all duration-1000 delay-200 mb-16 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <LogoLoop 
            logos={frontendSkills} 
            speed={60} 
            fadeOut={true} 
            logoHeight={60}
            gap={64}
            scaleOnHover={true}
            fadeOutColor='var(--cyber-dark)'
            renderItem={(item) => (
              'src' in item ? <img src={item.src} alt={item.alt} className="frontend-skill-icon" /> : null
            )}
          />
        </div>

        {/* Skills Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <div
              key={category.title}
              className={`transition-all duration-1000 will-change-transform ${
                isVisible 
                  ? 'opacity-100 transform translate-y-0' 
                  : 'opacity-0 transform translate-y-12'
              }`}
              style={{ transitionDelay: `${(categoryIndex + 1) * 300}ms` }}
            >
              {/* Category Card with hover tilt effect */}
              <div className="relative group h-full animate-subtle-tilt hover:animate-none">
                {/* Slower, smoother glow effect */}
                <div className={`absolute -inset-1 bg-gradient-to-r from-cyber-purple to-cyber-blue rounded-2xl blur opacity-10 group-hover:opacity-20 transition-all duration-[2000ms] ease-in-out`}></div>
                
                {/* Main card */}
                <div className="relative bg-cyber-gray/30 backdrop-blur-xl rounded-2xl border border-white/10 p-5 hover:border-white/30 transition-all duration-700 h-full flex flex-col group-hover:transform group-hover:scale-[1.01] group-hover:rotate-1">
                  {/* Category header */}
                  <div className="mb-5">
                    <h3 className={`text-xl font-bold bg-gradient-to-r from-cyber-purple to-cyber-blue bg-clip-text text-transparent mb-2`}>
                      {category.title}
                    </h3>
                    <div className={`h-0.5 w-12 bg-gradient-to-r from-cyber-purple to-cyber-blue rounded-full group-hover:w-20 transition-all duration-500`}></div>
                  </div>

                  {/* Skills grid */}
                  <div className="grid grid-cols-4 gap-2.5 flex-grow content-start">
                    {category.skills.map((skill, skillIndex) => (
                      <div
                        key={skill.name}
                        className="group/skill relative flex flex-col items-center p-2.5 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/25 hover:bg-white/10 transition-all duration-500 cursor-pointer will-change-transform hover:rotate-2"
                        style={{ 
                          animationDelay: `${skillIndex * 100}ms`
                        }}
                      >
                        {/* Skill icon */}
                        <div className="relative w-8 h-8 mb-1.5 transition-all duration-500 group-hover/skill:scale-105">
                          <img 
                            src={skill.icon} 
                            alt={skill.name}
                            className="w-full h-full object-contain filter brightness-90 group-hover/skill:brightness-110 transition-all duration-500"
                          />
                          
                          {/* Subtle glow effect on hover */}
                          <div className={`absolute inset-0 bg-gradient-to-r from-cyber-purple to-cyber-blue rounded-lg opacity-0 group-hover/skill:opacity-20 blur-lg transition-all duration-700`}></div>
                        </div>

                        {/* Skill name */}
                        <span className="text-xs text-center text-gray-300 group-hover/skill:text-white transition-colors duration-500 font-medium leading-tight">
                          {skill.name}
                        </span>

                        {/* Subtle hover indicator */}
                        <div className={`absolute inset-0 rounded-lg bg-gradient-to-r from-cyber-purple to-cyber-blue opacity-0 group-hover/skill:opacity-5 transition-all duration-700`}></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
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
