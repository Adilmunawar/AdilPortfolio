
"use client";

import React, { useState, MouseEvent, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, BookOpen, Copy, Check } from "lucide-react";
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
    <div className="relative my-4 rounded-lg bg-cyber-dark border border-neon-cyan/20 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-cyber-gray/50 border-b border-neon-cyan/20">
        <span className="text-xs text-frost-cyan font-mono">{lang}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-frost-cyan hover:text-white transition-colors"
        >
          {isCopied ? <Check size={14} /> : <Copy size={14} />}
          {isCopied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter
        style={atomDark}
        language={lang}
        PreTag="div"
        {...props}
        wrapLines={true}
        wrapLongLines={true}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  ) : (
    <code className={cn("text-sm font-mono bg-neon-cyan/10 text-neon-cyan px-1 py-0.5 rounded break-words", className)} {...props}>
      {children}
    </code>
  );
};

type CaseStudy = (typeof caseStudiesData)[0];

export default function CaseStudiesSection() {
  const [selectedPost, setSelectedPost] = useState<CaseStudy | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Vertical drag state for modal
  const vSliderRef = useRef<HTMLDivElement>(null);
  const [isVDragging, setIsVDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  
  useEffect(() => {
    return () => {
      document.body.style.userSelect = '';
    };
  }, []);

  const handleReadMore = (post: CaseStudy) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };
  
  // Vertical Drag Handlers for Modal
  const onVMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    const slider = vSliderRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
    if (!slider) return;
    setIsVDragging(true);
    setStartY(e.pageY - (slider as HTMLElement).offsetTop);
    setScrollTop(slider.scrollTop);
    document.body.style.userSelect = 'none';
  };

  const onVMouseLeaveOrUp = () => {
    setIsVDragging(false);
    document.body.style.userSelect = '';
  };

  const onVMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const slider = vSliderRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
    if (!isVDragging || !slider) return;
    e.preventDefault();
    const y = e.pageY - (slider as HTMLElement).offsetTop;
    const walk = (y - startY) * 2;
    slider.scrollTop = scrollTop - walk;
  };

  return (
    <>
      <section className="relative py-24" id="case-studies">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 space-y-4">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium uppercase tracking-wider"
            >
              <BookOpen className="w-3 h-3" />
              <span className="font-semibold text-sm">Deep Dives</span>
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-white tracking-tight"
            >
              Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Case Studies</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 gap-12">
            <AnimatePresence>
              {caseStudiesData.map((study, index) => (
                <motion.div
                  layout
                  key={study.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                  onClick={() => handleReadMore(study)}
                  className="group relative rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm overflow-hidden hover:border-cyan-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-900/20 cursor-pointer"
                >
                  <motion.div
                    whileHover={{ y: -5 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }} 
                    className="md:flex"
                  >
                    <div className="md:w-1/3 relative h-48 md:h-auto overflow-hidden">
                        <Image 
                            src={study.image} 
                            alt={study.title} 
                            fill 
                            className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                        />
                         <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent z-10 opacity-80" />
                    </div>
                    <div className="md:w-2/3 p-6 flex flex-col">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                                    {study.title}
                                </h3>
                                <p className="text-sm text-gray-300 leading-relaxed mt-2">{study.excerpt}</p>
                            </div>
                            <div 
                                className="text-white/30 group-hover:text-white group-hover:bg-cyan-500 group-hover:rotate-45 transition-all duration-300 rounded-full flex-shrink-0 p-2"
                            >
                              <ArrowUpRight className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
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
                    </div>
                  </motion.div>
                  <div className="flex flex-wrap gap-2 p-4 border-t border-white/10 bg-black/20">
                      {study.techStack.map((tech, i) => (
                      <Badge key={i} variant="outline" className="bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-cyan-500/50 transition-colors">
                          {tech}
                      </Badge>
                      ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {selectedPost && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-5xl w-[90vw] h-[90vh] bg-cyber-dark/90 backdrop-blur-lg border-neon-cyan/30 text-frost-white p-0 flex flex-col">
              <ScrollArea 
                ref={vSliderRef}
                className={cn("h-full w-full rounded-lg custom-scrollbar", isVDragging ? "cursor-grabbing" : "cursor-grab")}
                onMouseDown={onVMouseDown}
                onMouseLeave={onVMouseLeaveOrUp}
                onMouseUp={onVMouseLeaveOrUp}
                onMouseMove={onVMouseMove}
              >
                <div className="p-0">
                    <DialogHeader className="p-6 md:p-8 z-10 !space-y-2">
                        <DialogTitle className="text-2xl md:text-3xl font-bold text-gradient-slow mb-2">{selectedPost.title}</DialogTitle>
                    </DialogHeader>
                    <div className="prose prose-sm md:prose-base prose-invert prose-p:text-frost-cyan/90 prose-p:break-words prose-headings:text-frost-white prose-strong:text-frost-white prose-a:text-neon-cyan prose-table:border-neon-cyan/20 prose-th:text-frost-white prose-tr:border-neon-cyan/20 max-w-none px-6 md:px-8 pb-8">
                        <ReactMarkdown components={{ code: CodeBlock }}>
                          {selectedPost.content}
                        </ReactMarkdown>
                    </div>
                </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
