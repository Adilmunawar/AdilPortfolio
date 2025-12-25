"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"

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
    quote: "Collaborating with Adil was seamless,builds high performing sites that make digital marketing actually work. Exceptional developer!",
    name: "Esha Riaz",
    role: "Digital Marketor",
    image: "/testimonials/esha.jpg",
  },
]

export function TestimonialsMinimal() {
  const [active, setActive] = useState(0)
  const [containerHeight, setContainerHeight] = useState(100)
  const quoteRefs = useRef<(HTMLParagraphElement | null)[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prevActive) => (prevActive + 1) % testimonials.length);
    }, 4000); // Auto-switch every 4 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  useEffect(() => {
    if (quoteRefs.current[active]) {
      setContainerHeight(quoteRefs.current[active]!.scrollHeight);
    }
  }, [active, testimonials]);


  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-16">
      {/* Quote */}
      <div 
        className="relative mb-12 transition-[height] duration-500 ease-in-out"
        style={{ height: containerHeight }}
      >
        {testimonials.map((t, i) => (
          <p
            key={i}
            ref={(el) => {quoteRefs.current[i] = el}}
            className={`
              absolute inset-0 text-2xl md:text-3xl font-light leading-relaxed text-foreground
              transition-all duration-500 ease-out
              ${
                active === i
                  ? "opacity-100 translate-y-0 blur-0"
                  : "opacity-0 translate-y-4 blur-sm pointer-events-none"
              }
            `}
          >
            "{t.quote}"
          </p>
        ))}
      </div>

      {/* Author Row */}
      <div className="flex items-center gap-8">
        {/* Avatars */}
        <div className="flex -space-x-4">
          {testimonials.map((t, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`
                relative w-20 h-20 rounded-full overflow-hidden ring-4 ring-background
                transition-all duration-300 ease-out
                ${active === i ? "z-10 scale-110" : "grayscale hover:grayscale-0 scale-90 hover:scale-100"}
              `}
            >
              <Image src={t.image || "/placeholder.svg"} alt={t.name} width={100} height={100} className={`object-cover ${t.name === 'Amna Ali' ? 'object-top' : ''}`} />
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="h-12 w-px bg-border" />

        {/* Active Author Info */}
        <div className="relative flex-1 min-h-[56px]">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`
                absolute inset-0 flex flex-col justify-center
                transition-all duration-400 ease-out
                ${active === i ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none"}
              `}
            >
              <span className="text-xl font-medium text-foreground">{t.name}</span>
              <span className="text-lg text-muted-foreground">{t.role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
