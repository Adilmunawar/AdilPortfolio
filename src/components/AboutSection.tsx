'use client';
import { Card } from '@/components/ui/card';
import ProfileCard from './ProfileCard';
import { useState, useEffect, useRef } from 'react';
import { Sparkles, Users, Rocket, Cpu, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';

const dynamicTexts = [
  "Frontend Engineer",
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
  },
  {
    icon: Users,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-900/20',
    title: 'Building the Collective',
    description: 'Driven by a passion to create, I forged a dedicated team to build custom SaaS and web solutions. We started by making a mark on the local stage, delivering quality and innovation to our first clients.',
  },
  {
    icon: Rocket,
    color: 'text-purple-400',
    bgColor: 'bg-purple-900/20',
    title: 'Expanding Horizons',
    description: 'Our reputation for excellence allowed us to transition from local projects to the international arena, collaborating with a diverse range of overseas clients and tackling more complex challenges.',
  },
  {
    icon: Cpu,
    color: 'text-amber-400',
    bgColor: 'bg-amber-900/20',
    title: 'The Nexus Mission',
    description: "Today, as a co-founder of Nexus Orbits Pakistan, our mission is to provide cutting-edge digital services on a global scale. The journey is ongoing, and we're just getting started.",
  },
];

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 50 : -50,
    opacity: 0,
    scale: 0.95,
  }),
};

const AboutSection = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  
  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    setPage([(page + newDirection + milestoneEvents.length) % milestoneEvents.length, newDirection]);
  };
  
  useEffect(() => {
    const textInterval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % dynamicTexts.length);
    }, 3000);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      clearInterval(textInterval);
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const milestoneInterval = setInterval(() => {
      paginate(1);
    }, 5000); // Auto-play every 5 seconds

    return () => clearInterval(milestoneInterval);
  }, [isVisible, page]);


  const activeMilestone = milestoneEvents[page];

  return (
    <section id="about" ref={sectionRef} className="min-h-screen py-20 px-4 flex flex-col justify-center items-center relative overflow-hidden">
      <div className="max-w-7xl w-full mx-auto relative z-10">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-5xl md:text-7xl font-bold mb-6 text-gradient-slow">
            About Me
          </h2>
          <div className="h-10 mb-8">
            <h3 className="text-2xl md:text-3xl font-medium text-frost-cyan">
              {dynamicTexts[currentTextIndex]}
            </h3>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
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
                avatarUrl="/lovable-uploads/eaf50e40-682a-4730-ac3c-407cf3e4896e.png"
                miniAvatarUrl="/lovable-uploads/eaf50e40-682a-4730-ac3c-407cf3e4896e.png"
                showUserInfo={true}
                enableTilt={true}
                onContactClick={() => console.log('Contact clicked')}
              />
            </motion.div>
          
            <div className="lg:col-span-3 relative h-[350px] md:h-[280px] flex flex-col justify-center">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={page}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.3 }
                  }}
                  className="w-full absolute"
                >
                  <Card
                    className={cn(
                      "relative p-6 bg-cyber-dark/80 border border-neon-cyan/30 transition-all duration-300 shadow-lg backdrop-blur-sm h-full"
                    )}
                  >
                     <div className="relative z-10">
                        <div>
                          <div>
                            <h4 className="font-bold text-lg text-frost-white mb-2">{activeMilestone.title}</h4>
                            <p className="text-sm text-frost-cyan leading-relaxed">{activeMilestone.description}</p>
                          </div>
                        </div>
                      </div>
                  </Card>
                </motion.div>
              </AnimatePresence>
              <div className="absolute -bottom-10 right-0 z-20 flex gap-2">
                <Button variant="outline" size="icon" onClick={() => paginate(-1)} className="bg-cyber-dark/50 hover:bg-neon-cyan/20 border-neon-cyan/30">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => paginate(1)} className="bg-cyber-dark/50 hover:bg-neon-cyan/20 border-neon-cyan/30">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
