'use client';
import { Card } from '@/components/ui/card';
import ProfileCard from './ProfileCard';
import { useState, useEffect, useRef } from 'react';
import { Sparkles, Users, Rocket, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';

const dynamicTexts = [
  "Passionate Developer",
  "Web Developer",
  "Problem Solver",
  "Innovation Driver"
];

const milestoneEvents = [
  {
    icon: Sparkles,
    color: 'text-sky-400',
    bgColor: 'bg-sky-900/20',
    title: 'Spark of Curiosity',
    description: 'My journey began with a childhood fascination for technology. Entirely self-taught, I dove into the digital world, earning numerous certifications and competing in coding contests to sharpen my skills.',
    animationDelay: '0.2s',
  },
  {
    icon: Users,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-900/20',
    title: 'Building the Collective',
    description: 'Driven by a passion to create, I forged a dedicated team to build custom SaaS and web solutions. We started by making a mark on the local stage, delivering quality and innovation to our first clients.',
    animationDelay: '0.4s',
  },
  {
    icon: Rocket,
    color: 'text-purple-400',
    bgColor: 'bg-purple-900/20',
    title: 'Expanding Horizons',
    description: 'Our reputation for excellence allowed us to transition from local projects to the international arena, collaborating with a diverse range of overseas clients and tackling more complex challenges.',
    animationDelay: '0.6s',
  },
  {
    icon: Cpu,
    color: 'text-amber-400',
    bgColor: 'bg-amber-900/20',
    title: 'The Nexus Mission',
    description: "Today, as a co-founder of Nexus Orbits Pakistan, our mission is to provide cutting-edge digital services on a global scale. The journey is ongoing, and we're just getting started.",
    animationDelay: '0.8s',
  },
];

const MilestoneCard = ({ event, isVisible }: { event: typeof milestoneEvents[0], isVisible: boolean }) => {
  return (
    <Card
      className={cn(
        "relative p-6 bg-cyber-gray/30 border border-cyber-purple/20 backdrop-blur-sm transition-all duration-500 hover:border-cyber-purple/40 hover:scale-105",
        { "animate-fade-in-up": isVisible }
      )}
      style={{ animationDelay: event.animationDelay }}
    >
      <div className="flex items-start gap-4">
        <div className={cn("p-3 rounded-lg", event.bgColor)}>
          <event.icon className={cn("w-6 h-6", event.color)} />
        </div>
        <div>
          <h4 className="font-bold text-lg text-gray-200 mb-2">{event.title}</h4>
          <p className="text-sm text-gray-400 leading-relaxed">{event.description}</p>
        </div>
      </div>
      <div className="absolute -inset-px rounded-lg bg-gradient-to-r from-cyber-purple to-cyber-blue opacity-0 hover:opacity-100 transition-opacity duration-500" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 1px, 1px 1px, 1px 100%, 0 100%)' }}></div>
    </Card>
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
      { threshold: 0.2 }
    );

    observer.observe(aboutSection);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="min-h-screen py-20 px-4 flex flex-col justify-center items-center relative overflow-hidden bg-transparent">
      <div className="max-w-7xl w-full mx-auto relative z-10">
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
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            <div className={cn("lg:col-span-2 flex justify-center transition-all duration-1000", isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90')}>
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
          
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
              {milestoneEvents.map((event, index) => (
                <MilestoneCard key={index} event={event} isVisible={isVisible} />
              ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
