'use client';
import { Card } from '@/components/ui/card';
import ProfileCard from './ProfileCard';
import { useState, useEffect, useRef } from 'react';
import { Sparkles, Users, Rocket, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

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

const MilestoneCard = ({ event, isVisible, isActive }: { event: typeof milestoneEvents[0], isVisible: boolean, isActive: boolean }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  return (
    <motion.div
      className="relative group"
      variants={cardVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      style={{ transitionDelay: event.animationDelay }}
    >
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.7 } }}
            exit={{ opacity: 0, transition: { duration: 0.7 } }}
            className="absolute -inset-2.5 bg-gradient-to-r from-cyber-purple to-cyber-blue rounded-xl blur-lg"
          />
        )}
      </AnimatePresence>
      <Card
        className={cn(
          "relative p-6 bg-cyber-gray border border-cyber-purple/20 transition-all duration-300 group-hover:border-cyber-purple/60 group-hover:scale-105 group-hover:-translate-y-2 h-full shadow-lg",
          isActive && "scale-105 -translate-y-2 border-cyber-purple/60"
        )}
      >
        <div className="relative z-10">
          <div className="flex items-start gap-4">
            <div className={cn(
              "p-3 rounded-lg shadow-inner transition-all duration-300", 
              event.bgColor, 
              "border", 
              event.color.replace('text-', 'border-') + '/30',
              (isActive ? "scale-110" : "group-hover:scale-110")
            )}>
              <event.icon className={cn("w-6 h-6 transition-all duration-300", event.color, (isActive ? "scale-110" : "group-hover:scale-110"))} />
            </div>
            <div>
              <h4 className="font-bold text-lg text-gray-200 mb-2">{event.title}</h4>
              <p className="text-sm text-gray-400 leading-relaxed">{event.description}</p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};


const AboutSection = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [activeMilestoneIndex, setActiveMilestoneIndex] = useState(-1);

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
      { threshold: 0.1 }
    );

    observer.observe(aboutSection);

    return () => {
      if(aboutSection) {
        observer.unobserve(aboutSection);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      const glowInterval = setInterval(() => {
        setActiveMilestoneIndex((prevIndex) => (prevIndex + 1) % milestoneEvents.length);
      }, 2000); // Cycle every 2 seconds

      return () => clearInterval(glowInterval);
    }
  }, [isVisible]);

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
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            <motion.div 
              className="lg:col-span-2 flex justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <ProfileCard
                name="Adil Munawar"
                title="Web Developer"
                handle="Adil Munawar"
                status="Online"
                contactText="Contact Me"
                avatarUrl="https://picsum.photos/seed/profile-pic/600/800"
                miniAvatarUrl="https://picsum.photos/seed/profile-pic/100/100"
                showUserInfo={true}
                enableTilt={true}
                onContactClick={() => console.log('Contact clicked')}
              />
            </motion.div>
          
            <div className="lg:col-span-3 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {milestoneEvents.map((event, index) => (
                        <MilestoneCard key={index} event={event} isVisible={isVisible} isActive={activeMilestoneIndex === index} />
                    ))}
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
