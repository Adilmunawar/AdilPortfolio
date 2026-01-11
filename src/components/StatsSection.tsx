'use client';
import { motion } from 'framer-motion';
import GitHubStats from './GitHubStats';
import LeetCodeStats from './LeetCodeStats';
import LeetCodeBadges from './LeetCodeBadges';

const StatsSection = () => {
  return (
    <section id="stats" className="py-8 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 gap-8 items-start max-w-4xl mx-auto">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
            >
                <GitHubStats />
            </motion.div>
            <motion.div 
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.4 }}
            >
                <LeetCodeStats />
            </motion.div>
        </div>
      </div>
      <LeetCodeBadges />
    </section>
  );
};

export default StatsSection;
