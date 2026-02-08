'use client';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from './ui/button';
import { ChevronsLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { ScrollArea } from './ui/scroll-area';
import Image from 'next/image';
import { useEffect } from "react";

// Updated to use .jpg files as requested for performance
const badges = [
    { src: '/leetcode/202508.jpg', alt: 'August 2025 Daily Challenge' },
    { src: '/leetcode/202509.jpg', alt: 'September 2025 Daily Challenge' },
    { src: '/leetcode/202510.jpg', alt: 'October 2025 Daily Challenge' },
    { src: '/leetcode/202511.jpg', alt: 'November 2025 Daily Challenge' },
    { src: '/leetcode/25100.jpg', alt: '100 Day Badge' },
    { src: '/leetcode/2550.jpg', alt: '50 Day Badge' },
    { src: '/leetcode/Introduction_to_Pandas.jpg', alt: 'Introduction to Pandas' },
    { src: '/leetcode/Top_SQL_50.jpg', alt: 'Top SQL 50' },
];

const LeetCodeBadges = () => {

  useEffect(() => {
    // Preload images after the component mounts to ensure they are cached
    // by the time the user opens the drawer.
    badges.forEach((badge) => {
      const img = new (window as any).Image();
      img.src = badge.src;
    });
  }, []);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="fixed right-0 top-1/2 -translate-y-1/2 z-30
                     flex items-center justify-center w-auto h-auto p-2
                     bg-cyber-dark/80 border-2 border-neon-cyan/30 hover:bg-neon-cyan/20
                     rounded-l-lg rounded-r-none
                     transition-all duration-300 group
                     transform hover:scale-105 backdrop-blur-sm"
          style={{ writingMode: 'vertical-rl' }}
        >
          <span className="flex items-center gap-2 transform -rotate-180 text-sm tracking-wider text-frost-cyan">
            <ChevronsLeft className="w-4 h-4 animate-pulse" />
            LeetCode Badges
          </span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-4xl">
          <DrawerHeader>
            <DrawerTitle className="text-center text-2xl font-bold text-gradient-slow">LeetCode Badges</DrawerTitle>
            <DrawerDescription className="text-center text-frost-cyan">A collection of my achievements on LeetCode.</DrawerDescription>
          </DrawerHeader>
          <ScrollArea className="h-[60vh] p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {badges.map((badge, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group relative flex flex-col items-center gap-2"
                >
                  <Image
                    src={badge.src}
                    alt={badge.alt}
                    width={256}
                    height={256}
                    className="rounded-lg transition-transform duration-300 group-hover:scale-105 w-32 h-32"
                  />
                  <p className="text-xs text-center text-frost-cyan/70 group-hover:text-frost-white transition-colors">
                    {badge.alt}
                  </p>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default LeetCodeBadges;
