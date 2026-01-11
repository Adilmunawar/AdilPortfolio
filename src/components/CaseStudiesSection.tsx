"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, BarChart3, Clock, Layers, Trophy, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// --- Data Structure ---
const CASE_STUDIES = [
  {
    id: 1,
    title: "AdiArc - Intelligent Database Manager",
    category: "Full Stack & AI",
    client: "Internal Product",
    image: "/AdiGon.png", // Using a relevant existing image
    challenge: "Managing massive SQL datasets manually was slow and prone to human error.",
    solution: "Built an automated Next.js dashboard with Gemini AI integration to auto-generate queries and audit logs.",
    impact: "90% Faster Querying",
    metricIcon: <Zap className="w-4 h-4 text-yellow-400" />,
    stack: ["Next.js 14", "Gemini AI", "PostgreSQL", "Tailwind"],
    link: "https://github.com/AdilMunawar/adigon"
  },
  {
    id: 2,
    title: "Zenith AI - Voice Assistant Core",
    category: "AI & ML",
    client: "Portfolio R&D",
    image: "/zenith.png", 
    challenge: "Existing web chatbots felt robotic and lacked real-time conversational fluidity.",
    solution: "Engineered a WebSocket-based audio streamer using OpenAI & Gemini for sub-500ms latency responses.",
    impact: "< 500ms Latency",
    metricIcon: <Clock className="w-4 h-4 text-cyan-400" />,
    stack: ["WebSockets", "Gemini API", "React Audio", "Node.js"],
    link: "#"
  },
  {
    id: 3,
    title: "AdiCorp Enterprise ERP",
    category: "System Architecture",
    client: "Freelance Client",
    image: "/AdiCorp.png",
    challenge: "Client needed a custom ERP to handle employee tracking, payroll, and inventory in one place.",
    solution: "Developed a modular SaaS architecture with role-based access control and automated reporting.",
    impact: "30% Cost Reduction",
    metricIcon: <BarChart3 className="w-4 h-4 text-green-400" />,
    stack: ["Supabase", "React", "TypeScript", "Recharts"],
    link: "https://adicorp.vercel.app"
  },
  {
    id: 4,
    title: "CyberSecurity Blog Platform",
    category: "Content & SEO",
    client: "Personal Brand",
    image: "/blogpic/gameserverhack.jpg",
    challenge: "Technical security concepts are hard to visualize and consume for beginners.",
    solution: "Created an interactive blog with live code snippets and dark-mode focused readability.",
    impact: "2k+ Monthly Reads",
    metricIcon: <Trophy className="w-4 h-4 text-purple-400" />,
    stack: ["MDX", "Next.js", "SEO Optimization", "Vercel"],
    link: "#blog"
  }
];

const CATEGORIES = ["All", "Full Stack & AI", "AI & ML", "System Architecture", "Content & SEO"];

export default function CaseStudiesSection() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredCases = activeCategory === "All" 
    ? CASE_STUDIES 
    : CASE_STUDIES.filter(c => c.category === activeCategory);

  return (
    <section className="relative py-24 bg-background overflow-hidden" id="case-studies">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[400px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        
        {/* --- Section Header --- */}
        <div className="text-center mb-16 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium uppercase tracking-wider"
          >
            <Layers className="w-3 h-3" />
            <span>Problem Solving</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white tracking-tight"
          >
            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Case Studies</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/60 max-w-2xl mx-auto text-lg"
          >
            Not just code—these are strategic solutions engineered to deliver measurable impact and solve complex technical challenges.
          </motion.p>
        </div>

        {/* --- Filter Tabs --- */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {CATEGORIES.map((cat, idx) => (
            <motion.button
              key={idx}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                activeCategory === cat
                  ? "bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                  : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white"
              }`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* --- The Grid --- */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredCases.map((study) => (
              <motion.div
                layout
                key={study.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm overflow-hidden hover:border-cyan-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-900/20"
              >
                {/* Image Area */}
                <div className="relative h-64 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10 opacity-80" />
                  <Image 
                    src={study.image} 
                    alt={study.title} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                  />
                  
                  {/* Floating Metric Badge */}
                  <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 bg-black/80 backdrop-blur-md border border-cyan-500/30 rounded-lg shadow-lg transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                    {study.metricIcon}
                    <span className="text-cyan-400 font-bold text-sm">{study.impact}</span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-6 md:p-8 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-cyan-500 text-xs font-bold uppercase tracking-widest mb-1">{study.client}</p>
                      <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {study.title}
                      </h3>
                    </div>
                    <Button 
                        size="icon" 
                        variant="ghost" 
                        className="text-white/30 group-hover:text-white group-hover:bg-cyan-500 group-hover:rotate-45 transition-all duration-300 rounded-full flex-shrink-0"
                        asChild
                    >
                        <a href={study.link} target="_blank" rel="noopener noreferrer">
                            <ArrowUpRight className="w-5 h-5" />
                        </a>
                    </Button>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex gap-3">
                        <div className="min-w-[4px] bg-red-500/50 rounded-full" />
                        <div>
                            <p className="text-xs text-white/40 uppercase font-semibold">The Challenge</p>
                            <p className="text-sm text-gray-300 leading-relaxed">{study.challenge}</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="min-w-[4px] bg-cyan-500/50 rounded-full" />
                        <div>
                            <p className="text-xs text-white/40 uppercase font-semibold">The Solution</p>
                            <p className="text-sm text-gray-300 leading-relaxed">{study.solution}</p>
                        </div>
                    </div>
                  </div>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                    {study.stack.map((tech, i) => (
                      <Badge key={i} variant="outline" className="bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-cyan-500/50 transition-colors">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* --- Footer CTA --- */}
        <div className="mt-16 text-center">
            <Button size="lg" className="bg-white text-black hover:bg-cyan-400 hover:text-black transition-all rounded-full px-8 font-bold">
                View All Archives
            </Button>
        </div>

      </div>
    </section>
  );
}
