'use client';
import { motion } from 'framer-motion';
import GitHubStats from './GitHubStats';
import LeetCodeStats from './LeetCodeStats';
import BadgesShowcase from './BadgesShowcase';

const StatsSection = () => {
  return (
    <section id="stats" className="py-20 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* GitHub and LeetCode side by side on large screens */}
        <div className="flex flex-col xl:flex-row gap-8 lg:gap-12 items-center xl:items-stretch justify-between mb-20 w-full">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="w-full xl:w-[70%] max-w-full overflow-hidden"
            >
                <GitHubStats />
            </motion.div>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="w-full xl:w-[30%] flex justify-center xl:justify-end"
            >
                <LeetCodeStats />
            </motion.div>
        </div>

        {/* New Badges Showcase Section */}
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.6 }}
        >
            <div className="text-center mb-10">
                <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                    Earned Badges
                </h3>
            </div>
            <BadgesShowcase />
        </motion.div>

      </div>
    </section>
  );
};

export default StatsSection;