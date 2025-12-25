"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

const testimonials = [
  {
    quote: "Co-founding Nexus Orbits Pakistan with Adil has been a highlight of my career. After years of collaborating on countless projects, I can attest to his exceptional skill and vision as a web developer and partner.",
    name: "Zoya Ali",
    role: "Web Developer & Co-founder",
    image: "/testimonials/zoya.jpg",
  },
  {
    quote: "He consistently impressed me with his dedication, professionalism, he is a great team player and communicator.",
    name: "Amna Ali",
    role: "HR Manager",
    image: "/testimonials/AmnaAli.jpg",
  },
  {
    quote: "I have been profoundly impressed by his remarkable aptitude for web development and problem-solving.",
    name: "Alice Austen",
    role: "Design Lead at Linear",
    image: "/testimonials/alice.png",
  },
  {
    quote: "Collaborating with Adil was seamless. He builds high-performing sites that make digital marketing actually work. Exceptional developer!",
    name: "Esha Riaz",
    role: "Digital Marketor",
    image: "/testimonials/esha.jpg",
  },
]

export function TestimonialsMinimal() {
  const [active, setActive] = useState(0);
  const [containerHeight, setContainerHeight] = useState(100);
  const quoteRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const setTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 5000);
  };
  
  useEffect(() => {
    setTimer();
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [active]);

  useEffect(() => {
    if (quoteRefs.current[active]) {
      setContainerHeight(quoteRefs.current[active]!.scrollHeight);
    }
  }, [active, testimonials]);
  
  const handleAvatarClick = (index: number) => {
    setActive(index);
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-16">
      {/* Quote */}
      <div 
        className="relative mb-12 transition-[height] duration-500 ease-in-out"
        style={{ height: containerHeight }}
      >
        <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <p
                ref={(el) => (quoteRefs.current[active] = el)}
                className="text-2xl md:text-3xl font-light leading-relaxed text-foreground text-center"
              >
                <span className="text-5xl text-neon-cyan/50 absolute -left-4 -top-2">“</span>
                {testimonials[active].quote}
                <span className="text-5xl text-neon-cyan/50 absolute -right-4 -bottom-2">”</span>
              </p>
            </motion.div>
        </AnimatePresence>
      </div>

      {/* Author/Avatar Row */}
      <div className="flex flex-col items-center gap-8">
        <p className="text-center text-frost-cyan/70 font-semibold">{testimonials[active].role}</p>
        
        <div className="flex items-center space-x-2">
          {testimonials.map((t, i) => (
             <div 
                key={i} 
                onClick={() => handleAvatarClick(i)} 
                className="relative cursor-pointer focus:outline-none"
                onMouseEnter={() => setActive(i)}
                onMouseLeave={setTimer}
             >
              <AnimatePresence>
                {active === i && (
                  <motion.div
                    layoutId="capsule"
                    className="absolute inset-0 z-10 bg-white rounded-full flex items-center justify-start px-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <Image
                      src={t.image}
                      alt={t.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <span className="ml-3 text-sm font-medium text-cyber-dark whitespace-nowrap">{t.name}</span>
                  </motion.div>
                )}
              </AnimatePresence>
              <Image
                src={t.image}
                alt={t.name}
                width={56}
                height={56}
                className={`w-14 h-14 rounded-full object-cover transition-all duration-300 ${active === i ? 'opacity-0' : 'opacity-70 hover:opacity-100'}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
