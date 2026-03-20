
"use client";

import React, { useState, MouseEvent, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight, BookOpen, Copy, Check, Target, Zap, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import caseStudiesData from '@/lib/case-studies.json';

const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
  const [isCopied, setIsCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const lang = match ? match[1] : 'bash';

  const handleCopy = () => {
    navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return !inline && match ? (
    <div className="relative my-6 rounded-xl bg-black/60 border border-neon-cyan/20 overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
        <span className="text-[10px] text-frost-cyan font-mono uppercase tracking-widest">{lang}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-frost-cyan hover:text-white transition-colors"
        >
          {isCopied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          <span className="font-medium">{isCopied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <SyntaxHighlighter
        style={atomDark}
        language={lang}
        PreTag="div"
        {...props}
        customStyle={{
          margin: 0,
          padding: '1.5rem',
          background: 'transparent',
          fontSize: '0.875rem',
        }}
        wrapLines={true}
        wrapLongLines={true}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  ) : (
    <code className={cn("text-xs font-mono bg-neon-cyan/10 text-neon-cyan px-1.5 py-0.5 rounded border border-neon-cyan/20", className)} {...props}>
      {children}
    </code>
  );
};

type CaseStudy = (typeof caseStudiesData)[0];

export default function CaseStudiesSection() {
  const [selectedPost, setSelectedPost] = useState<CaseStudy | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Vertical scroll progress for modal
  const vSliderRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: vSliderRef });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const handleReadMore = (post: CaseStudy) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  return (
    <>
      <section className="relative py-32 overflow-hidden" id="case-studies">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-neon-cyan/10 to-transparent -z-10" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-neon-cyan/10 to-transparent -z-10" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-24 space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-cyan-500/5 border border-cyan-500/20 text-cyan-400 backdrop-blur-md"
            >
              <Target className="w-4 h-4 animate-pulse" />
              <span className="font-bold text-xs uppercase tracking-[0.2em]">Engineering Deep Dives</span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl font-black text-white tracking-tighter"
            >
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-blue-600 animate-shimmer bg-[length:200%_auto]">Architectural</span> Journal
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-frost-cyan/60 max-w-2xl mx-auto text-lg font-medium"
            >
              Detailed dissections of complex systems, performance optimizations, and enterprise-grade solutions.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 gap-20">
            {caseStudiesData.map((study, index) => (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => handleReadMore(study)}
                className="group relative cursor-pointer"
              >
                {/* Horizontal Card Layout */}
                <div className={cn(
                  "flex flex-col lg:flex-row gap-8 lg:gap-0 bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:border-cyan-500/40 hover:shadow-[0_0_50px_-12px_rgba(34,211,238,0.2)]",
                  index % 2 !== 0 && "lg:flex-row-reverse"
                )}>
                  {/* Image Side */}
                  <div className="lg:w-1/2 relative h-[350px] lg:h-[500px] overflow-hidden">
                    <Image 
                      src={study.image} 
                      alt={study.title} 
                      fill 
                      className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[50%] group-hover:grayscale-0 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    
                    {/* Floating Info Overlay */}
                    <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between">
                      <div className="flex gap-2">
                        {study.techStack.slice(0, 3).map((tech, i) => (
                          <Badge key={i} className="bg-black/60 backdrop-blur-md border-white/10 text-[10px] font-bold text-frost-cyan">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-neon-cyan group-hover:text-black transition-all duration-500 group-hover:rotate-45">
                        <ArrowUpRight className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  {/* Content Side */}
                  <div className="lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center relative">
                    {/* Blueprint Pattern Background */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                    
                    <div className="space-y-8 relative z-10">
                      <div className="space-y-4">
                        <h3 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                          {study.title}
                        </h3>
                        <p className="text-frost-cyan/70 text-lg leading-relaxed line-clamp-3 font-medium">
                          {study.excerpt}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-6 pt-8 border-t border-white/5">
                        <div className="flex gap-5">
                          <div className="mt-1 w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                            <Target className="w-5 h-5 text-red-400" />
                          </div>
                          <div>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest font-black mb-1">The Challenge</p>
                            <p className="text-gray-300 text-sm leading-relaxed">{study.challenge}</p>
                          </div>
                        </div>

                        <div className="flex gap-5">
                          <div className="mt-1 w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                            <Zap className="w-5 h-5 text-cyan-400" />
                          </div>
                          <div>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest font-black mb-1">The Solution</p>
                            <p className="text-gray-300 text-sm leading-relaxed">{study.solution}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {selectedPost && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-6xl w-[95vw] h-[90vh] bg-[#020617]/95 backdrop-blur-2xl border-white/10 text-frost-white p-0 overflow-hidden shadow-2xl">
            {/* Reading Progress Bar */}
            <motion.div 
              className="absolute top-0 left-0 right-0 h-1 bg-neon-cyan origin-left z-50"
              style={{ scaleX }}
            />

            <div className="flex flex-col h-full">
              {/* Sticky Modal Header */}
              <div className="p-6 md:px-12 bg-black/40 border-b border-white/5 flex items-center justify-between backdrop-blur-xl shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-neon-cyan" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl md:text-2xl font-black tracking-tight text-white">{selectedPost.title}</DialogTitle>
                    <div className="flex items-center gap-3 text-[10px] text-white/40 uppercase tracking-widest font-bold">
                      <Clock className="w-3 h-3 text-neon-cyan" />
                      <span>12 Min Read</span>
                      <span className="w-1 h-1 bg-white/20 rounded-full" />
                      <span>Technical Architecture</span>
                    </div>
                  </div>
                </div>
              </div>

              <ScrollArea 
                ref={vSliderRef}
                className="flex-1"
              >
                <div className="max-w-4xl mx-auto px-6 md:px-12 py-16">
                  {/* Visual Header in content */}
                  <div className="relative w-full h-[300px] md:h-[450px] rounded-3xl overflow-hidden mb-16 shadow-2xl border border-white/10">
                    <Image
                      src={selectedPost.image}
                      alt={selectedPost.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  </div>

                  <div className="prose prose-lg prose-invert prose-p:text-frost-cyan/80 prose-p:leading-relaxed prose-headings:text-white prose-headings:font-black prose-headings:tracking-tighter prose-strong:text-white prose-a:text-neon-cyan prose-table:border-white/10 prose-th:text-white prose-tr:border-white/10 max-w-none prose-pre:bg-transparent prose-pre:p-0">
                    <ReactMarkdown components={{ code: CodeBlock }}>
                      {selectedPost.content}
                    </ReactMarkdown>
                  </div>
                  
                  {/* Closing Footer */}
                  <div className="mt-20 pt-12 border-t border-white/10 flex flex-col items-center text-center gap-6">
                    <div className="w-16 h-px bg-neon-cyan/30" />
                    <p className="text-frost-cyan/40 text-sm font-medium italic">End of Engineering Dissection</p>
                    <Button 
                      onClick={() => setIsModalOpen(false)}
                      variant="outline" 
                      className="rounded-full border-white/10 hover:bg-white/5"
                    >
                      Close Journal
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
