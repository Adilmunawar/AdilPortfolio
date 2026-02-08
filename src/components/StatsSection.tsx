'use client';
import { motion } from 'framer-motion';
import GitHubStats from './GitHubStats';
import LeetCodeStats from './LeetCodeStats';

const StatsSection = () => {
  return (
    <section id="stats" className="py-20 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-5xl md:text-7xl font-bold mb-6 text-gradient-slow">
                Stats & Achievements
            </h2>
            <p className="text-xl text-frost-cyan max-w-4xl mx-auto leading-relaxed">
                A data-driven look at my coding journey and accomplishments.
            </p>
        </div>
        <div className="grid grid-cols-1 gap-12 lg:gap-16 items-start">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
            >
                <GitHubStats />
            </motion.div>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.4 }}
            >
                <LeetCodeStats />
            </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
