'use client';
import { Card } from '@/components/ui/card';
import ProfileCard from './ProfileCard';
import { useState, useEffect, useRef } from 'react';
import { Sparkles, Users, Rocket, Cpu, Orbit } from 'lucide-react';
import { cn } from '@/lib/utils';

const dynamicTexts = [
  "Passionate Developer",
  "Web Developer",
  "Problem Solver",
  "Innovation Driver"
];

const orbitEvents = [
  {
    icon: Sparkles,
    color: 'text-sky-400',
    bgColor: 'bg-sky-900/20',
    title: 'Spark of Curiosity',
    description: 'My journey began with a childhood fascination for technology. Entirely self-taught, I dove into the digital world, earning numerous certifications and competing in coding contests to sharpen my skills.',
    position: 'top-0 left-1/4',
    animationDelay: '0s',
  },
  {
    icon: Users,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-900/20',
    title: 'Building the Collective',
    description: 'Driven by a passion to create, I forged a dedicated team to build custom SaaS and web solutions. We started by making a mark on the local stage, delivering quality and innovation to our first clients.',
    position: 'top-1/3 -right-4',
    animationDelay: '0.2s',
  },
  {
    icon: Rocket,
    color: 'text-purple-400',
    bgColor: 'bg-purple-900/20',
    title: 'Expanding Horizons',
    description: 'Our reputation for excellence allowed us to transition from local projects to the international arena, collaborating with a diverse range of overseas clients and tackling more complex challenges.',
    position: 'bottom-1/4 -left-4',
    animationDelay: '0.4s',
  },
  {
    icon: Cpu,
    color: 'text-amber-400',
    bgColor: 'bg-amber-900/20',
    title: 'The Nexus Mission',
    description: "Today, as a co-founder of Nexus Orbits Pakistan, our mission is to provide cutting-edge digital services on a global scale. The journey is ongoing, and we're just getting started.",
    position: 'bottom-0 right-1/4',
    animationDelay: '0.6s',
  },
];


const OrbitingNode = ({ event, isVisible }: { event: typeof orbitEvents[0], isVisible: boolean }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        'absolute w-32 h-32 md:w-40 md:h-40 transition-all duration-700 ease-in-out',
        event.position,
        { 'animate-fly-in': isVisible }
      )}
      style={{ animationDelay: event.animationDelay }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={cn(
        'relative w-full h-full transition-all duration-500 ease-out animate-float-orbit',
        { 'scale-150': isHovered }
      )}>
        <div className={cn(
          "absolute inset-0 rounded-full border-2 border-cyber-purple/30 flex items-center justify-center cursor-pointer transition-all duration-500",
          event.bgColor,
          {
            'bg-cyber-gray/80 backdrop-blur-md': isHovered,
            'backdrop-blur-sm': !isHovered
          }
        )}>
          <div className="relative w-full h-full flex items-center justify-center">
            <event.icon className={cn(
              'w-8 h-8 md:w-10 md:h-10 transition-all duration-500',
              event.color,
              { 'opacity-0 scale-50': isHovered, 'opacity-100 scale-100': !isHovered }
            )} />

            <div className={cn(
              "absolute inset-0 p-4 text-center flex flex-col justify-center items-center transition-all duration-500",
              { 'opacity-100': isHovered, 'opacity-0': !isHovered }
            )}>
              <h4 className="text-sm md:text-base font-bold text-gray-200 mb-1">{event.title}</h4>
              <p className="text-xs text-gray-400 leading-tight hidden md:block">{event.description}</p>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 rounded-full animate-pulse-glow" style={{ animationDelay: event.animationDelay }}></div>
      </div>
    </div>
  );
};


const AboutSection = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % dynamicTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const aboutSection = sectionRef.current;
    if (!aboutSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(aboutSection);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(aboutSection);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="min-h-screen py-20 px-4 flex flex-col justify-center items-center relative overflow-hidden bg-transparent">
      <div className="max-w-6xl w-full mx-auto relative z-10">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-5xl md:text-7xl font-bold mb-6 text-gradient-slow">
            About Me
          </h2>
          <div className="h-10 mb-8">
            <h3 className="text-2xl md:text-3xl font-medium text-gray-400">
              {dynamicTexts[currentTextIndex]}
            </h3>
          </div>
        </div>
        
        <div className="relative flex justify-center items-center h-[500px] md:h-[600px]">
          <div className={cn('absolute w-full h-full transition-opacity duration-1000 delay-500', isVisible ? 'opacity-100' : 'opacity-0')}>
              <div className="absolute w-[280px] h-[280px] md:w-[400px] md:h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-cyber-purple/10 rounded-full animate-spin-slow"></div>
              <div className="absolute w-[400px] h-[400px] md:w-[550px] md:h-[550px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-cyber-blue/10 rounded-full animate-spin-reverse"></div>
          </div>

          <div className={cn("relative z-10 transition-all duration-1000", isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90')}>
            <ProfileCard
              name="Adil Munawar"
              title="Web Developer"
              handle="Adil Munawar"
              status="Online"
              contactText="Contact Me"
              avatarUrl="/lovable-uploads/eaf50e40-682a-4730-ac3c-407cf3e4896e.png"
              miniAvatarUrl="/lovable-uploads/eaf50e40-682a-4730-ac3c-407cf3e4896e.png"
              showUserInfo={true}
              enableTilt={true}
              onContactClick={() => console.log('Contact clicked')}
            />
          </div>

          <div className="absolute w-[420px] h-[420px] md:w-[600px] md:h-[600px]">
            {orbitEvents.map((event, index) => (
              <OrbitingNode key={index} event={event} isVisible={isVisible} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
