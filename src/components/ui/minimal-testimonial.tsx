
"use client"

import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"

const testimonials = [
    {
        id: 1,
        quote: "Co-founding Nexus Orbits Pakistan with Adil has been a highlight of my career. After years of collaborating on countless projects, I can attest to his exceptional skill and vision as a web developer and partner.",
        author: "Zoya Ali",
        role: "Web Developer & Co-founder",
        avatar: "/testimonials/zoya.jpg",
    },
    {
        id: 4,
        quote: "Adil consistently impressed me with his dedication, professionalism, he is a great team player and communicator.",
        author: "Amna Ali",
        role: "HR Manager",
        avatar: "/testimonials/AmnaAli.jpg",
    },
    {
        id: 3,
        quote: "Collaborating with Adil was seamless, builds high performing sites that make digital marketing actually work. Exceptional developer!",
        author: "Esha Riaz",
        role: "Digital Marketor",
        avatar: "/testimonials/esha.jpg",
    },
    {
        id: 2,
        quote: "I have been profoundly impressed by Adil's remarkable aptitude for web development and problem-solving.",
        author: "Alice Austen",
        role: "Design Lead at Linear",
        avatar: "/testimonials/alice.png",
    },
]

export function TestimonialsMinimal() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const handleSelect = useCallback((index: number) => {
    if (index === activeIndex || isAnimating) return
    setIsAnimating(true)
    setTimeout(() => {
      setActiveIndex(index)
      setIsAnimating(false)
    }, 400) // Corresponds to quote transition
  }, [activeIndex, isAnimating])

  useEffect(() => {
    const interval = setInterval(() => {
      handleSelect((activeIndex + 1) % testimonials.length);
    }, 2000); // Auto-switch every 2 seconds

    return () => clearInterval(interval);
  }, [activeIndex, handleSelect]);
  
  const { quote: displayedQuote, role: displayedRole } = testimonials[activeIndex];

  return (
    <div className="flex flex-col items-center gap-10 py-16">
      {/* Quote Container */}
      <div className="relative px-8 flex items-center" style={{ minHeight: '16rem' }}>
        <span className="absolute -left-2 -top-6 text-7xl font-serif text-foreground/[0.06] select-none pointer-events-none">
          "
        </span>

        <p
          className={cn(
            "text-xl md:text-2xl font-light text-foreground text-center max-w-lg leading-relaxed transition-all duration-400 ease-out",
            isAnimating ? "opacity-0 blur-sm scale-[0.98]" : "opacity-100 blur-0 scale-100",
          )}
        >
          {displayedQuote}
        </p>

        <span className="absolute -right-2 -bottom-8 text-7xl font-serif text-foreground/[0.06] select-none pointer-events-none">
          "
        </span>
      </div>

      <div className="flex flex-col items-center gap-6 mt-2">
        {/* Role text */}
        <p
          className={cn(
            "text-xs text-muted-foreground tracking-[0.2em] uppercase transition-all duration-500 ease-out text-center flex items-center justify-center",
             isAnimating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0",
          )}
           style={{ minHeight: '2rem' }}
        >
          {displayedRole}
        </p>

        <div className="flex items-center justify-center gap-2">
          {testimonials.map((testimonial, index) => {
            const isActive = activeIndex === index
            const isHovered = hoveredIndex === index && !isActive
            const showName = isActive || isHovered

            return (
              <button
                key={testimonial.id}
                onClick={() => handleSelect(index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={cn(
                  "relative flex items-center gap-0 rounded-full cursor-pointer",
                  "transition-all duration-500 ease-custom-ease",
                  isActive ? "bg-foreground shadow-lg" : "bg-transparent hover:bg-muted/80",
                  showName ? "pr-4 pl-2 py-2" : "p-0.5",
                )}
              >
                {/* Avatar with smooth ring animation */}
                <div className="relative flex-shrink-0">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.author}
                    className={cn(
                      "w-12 h-12 rounded-full object-cover",
                      "transition-all duration-500 ease-custom-ease",
                      isActive ? "ring-2 ring-background/30" : "ring-0",
                      !isActive && "hover:scale-105",
                    )}
                  />
                </div>

                <div
                  className={cn(
                    "grid transition-all duration-500 ease-custom-ease",
                    showName ? "grid-cols-[1fr] opacity-100 ml-2" : "grid-cols-[0fr] opacity-0 ml-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <span
                      className={cn(
                        "text-sm font-medium whitespace-nowrap block",
                        "transition-colors duration-300",
                        isActive ? "text-background" : "text-foreground",
                      )}
                    >
                      {testimonial.author}
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
