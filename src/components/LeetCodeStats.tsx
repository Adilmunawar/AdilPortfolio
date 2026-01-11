
'use client';

import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer,
} from 'recharts';
import { Button } from './ui/button';
import { Eye, EyeOff, Terminal } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import leetCodeStats from '@/lib/leetcode-stats.json';
import Image from 'next/image';

// Cyber Palette
const THEME = {
  cyan: '#22d3ee',
  red: '#f43f5e',
  amber: '#f59e0b',
  emerald: '#34d399',
  white: '#f0f9ff',
  grid: 'rgba(34, 211, 238, 0.1)',
  grid2: 'rgba(244, 63, 94, 0.15)',
};

const badges = [
  { src: '/leetcode/202508.gif', alt: 'LeetCode 202508 Badge' },
  { src: '/leetcode/202509.gif', alt: 'LeetCode 202509 Badge' },
  { src: '/leetcode/202510.gif', alt: 'LeetCode 202510 Badge' },
  { src: '/leetcode/202511.gif', alt: 'LeetCode 202511 Badge' },
  { src: '/leetcode/25100.gif', alt: 'LeetCode 25100 Badge' },
  { src: '/leetcode/2550.gif', alt: 'LeetCode 2550 Badge' },
  { src: '/leetcode/Introduction_to_Pandas.gif', alt: 'Introduction to Pandas Badge' },
  { src: '/leetcode/Top_SQL_50.gif', alt: 'Top SQL 50 Badge' },
];

const LeetCodeStats = () => {
    const { 
      totalSolved, 
      easy, 
      medium, 
      hard, 
      ranking, 
      acceptanceRate, 
      totalQuestions 
    } = leetCodeStats;
    
    const [mounted, setMounted] = useState(false);
    const [isHoveringCircular, setIsHoveringCircular] = useState(false);
    const [showBadges, setShowBadges] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    
    const radarData1 = useMemo(() => [
        { subject: 'Dyn. Prog.', A: 95, fullMark: 100 },
        { subject: 'Backtracking', A: 75, fullMark: 100 },
        { subject: 'Union Find', A: 60, fullMark: 100 },
        { subject: 'Div & Conquer', A: 55, fullMark: 100 },
        { subject: 'Bitmask', A: 45, fullMark: 100 },
    ], []);

    const radarData2 = useMemo(() => [
        { subject: 'Greedy', A: 88, fullMark: 100 },
        { subject: 'Graph', A: 92, fullMark: 100 },
        { subject: 'Trie', A: 70, fullMark: 100 },
        { subject: 'Segment Tree', A: 65, fullMark: 100 },
        { subject: 'Geometry', A: 50, fullMark: 100 },
    ], []);

    // Fallback loading state
    if (!mounted || (!totalSolved && !ranking)) {
        return (
          <div className="p-8">
             <div className="flex flex-col items-center text-neon-cyan animate-pulse">
                <Terminal className="w-10 h-10 mb-4" />
                <p className="font-mono text-sm">INITIALIZING DATA STREAM...</p>
             </div>
          </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full p-8 group relative"
        >
            {/* Header Area */}
            <div className="relative z-10 text-center pb-6 mb-6">
              <div className="flex justify-center items-center gap-4">
                <motion.div initial={{ opacity: 0}} animate={{opacity: 1}} transition={{delay: 0.2}}>
                    <h3 className="text-2xl font-bold text-white tracking-widest uppercase">
                        LeetCode Stats
                    </h3>
                    <p className="text-sm text-neon-cyan/70">@AdilMunawar</p>
                </motion.div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowBadges(!showBadges)}
                  className="bg-cyber-dark/50 border-neon-cyan/20 hover:bg-neon-cyan/10"
                >
                  {showBadges ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                  {showBadges ? 'Hide Badges' : 'Show Badges'}
                </Button>
              </div>
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    transition={{ delay: 0.4, type: 'spring' }}
                    className="mt-4 inline-flex items-center gap-3 bg-neon-cyan/10 border border-neon-cyan/20 px-4 py-2 rounded-full"
                >
                    <span className="text-xs text-gray-300 uppercase">Global Rank:</span>
                    <span className="text-lg font-bold text-white">{ranking.toLocaleString()}</span>
                </motion.div>
            </div>

            {/* Main Content: Three Charts */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 items-center gap-4 min-h-[220px]">
                {/* Left Radar Chart */}
                <motion.div className="h-full relative group/radar" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                    <ResponsiveContainer width="100%" height={200}>
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData1}>
                            <PolarGrid stroke={THEME.grid} strokeDasharray="3 3" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: THEME.white, fontSize: 10, fontFamily: 'monospace' }} />
                            <Radar 
                                dataKey="A" 
                                stroke={THEME.cyan} 
                                strokeWidth={2} 
                                fill={THEME.cyan} 
                                fillOpacity={0.2} 
                                animationDuration={800} 
                                className="group-hover/radar:animate-radar-ripple" 
                                dot={{ r: 3, fill: THEME.white, stroke: THEME.cyan, strokeWidth: 1 }} 
                                activeDot={{ r: 5, stroke: THEME.white }}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Center Donut Chart */}
                <motion.div 
                    className="h-full relative flex items-center justify-center"
                    onMouseEnter={() => setIsHoveringCircular(true)}
                    onMouseLeave={() => setIsHoveringCircular(false)}
                    initial={{ opacity: 0, scale: 0.5 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    transition={{ delay: 0.6, type: 'spring' }}
                >
                    <DonutChart
                        easy={easy.solved}
                        medium={medium.solved}
                        hard={hard.solved}
                        total={totalQuestions}
                    />
                    <AnimatePresence>
                        {!isHoveringCircular ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                className="absolute inset-0 flex flex-col items-center justify-center text-center"
                            >
                                <p className="text-3xl lg:text-4xl font-black text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]">{totalSolved}</p>
                                <p className="text-sm text-gray-400 -mt-1">/{totalQuestions}</p>
                                <p className="text-sm font-semibold text-emerald-400 mt-1">Solved</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                className="absolute inset-0 flex flex-col items-center justify-center text-center"
                            >
                                <div className="flex items-baseline gap-1.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-neon-cyan"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                                    <p className="text-3xl font-black text-white drop-shadow-[0_0_8px_rgba(34,211,238,0.7)]">{acceptanceRate.toFixed(1)}%</p>
                                </div>
                                <p className="text-sm font-semibold text-neon-cyan/80 mt-1">Acceptance</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
                
                {/* Right Radar Chart */}
                <motion.div className="h-full relative group/radar" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                     <ResponsiveContainer width="100%" height={200}>
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData2}>
                            <PolarGrid stroke={THEME.grid2} strokeDasharray="3 3" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: THEME.white, fontSize: 10, fontFamily: 'monospace' }} />
                            <Radar 
                                dataKey="A" 
                                stroke={THEME.red} 
                                strokeWidth={2} 
                                fill={THEME.amber} 
                                fillOpacity={0.25} 
                                animationDuration={800} 
                                className="group-hover/radar:animate-radar-ripple" 
                                dot={{ r: 3, fill: THEME.white, stroke: THEME.red, strokeWidth: 1 }}
                                activeDot={{ r: 5, stroke: THEME.white }}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* Badges Section */}
            <div className="relative z-10 mt-16 min-h-[120px]">
              <AnimatePresence>
                {showBadges && (
                  <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="flex flex-wrap justify-center items-center gap-4 md:gap-6"
                  >
                      {badges.map((badge, index) => (
                          <motion.div
                              key={index}
                              whileHover={{ scale: 1.1, rotate: 3 }}
                              transition={{ type: 'spring', stiffness: 300 }}
                          >
                              <Image
                                  src={badge.src}
                                  alt={badge.alt}
                                  width={120}
                                  height={120}
                                  className="rounded-md"
                              />
                          </motion.div>
                      ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
        </motion.div>
    );
};

// Custom Donut Chart Component
const DonutChart = ({ easy, medium, hard, total }: { easy: number, medium: number, hard: number, total: number }) => {
    const size = 150;
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const easyPercent = (easy / total) * 100;
    const mediumPercent = (medium / total) * 100;
    const hardPercent = (hard / total) * 100;
    
    const dashArray = `${circumference} ${circumference}`;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke="rgba(34, 211, 238, 0.1)"
                    strokeWidth={strokeWidth}
                />
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke={THEME.emerald}
                    strokeWidth={strokeWidth}
                    strokeDasharray={dashArray}
                    strokeDashoffset={circumference}
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: circumference - (easyPercent / 100) * circumference }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke={THEME.amber}
                    strokeWidth={strokeWidth}
                    strokeDasharray={dashArray}
                    strokeDashoffset={circumference}
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: circumference - (mediumPercent / 100) * circumference }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    style={{ transform: `rotate(${(easyPercent / 100) * 360}deg)`, transformOrigin: '50% 50%' }}
                />
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke={THEME.red}
                    strokeWidth={strokeWidth}
                    strokeDasharray={dashArray}
                    strokeDashoffset={circumference}
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: circumference - (hardPercent / 100) * circumference }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                    style={{ transform: `rotate(${((easyPercent + mediumPercent) / 100) * 360}deg)`, transformOrigin: '50% 50%' }}
                />
            </svg>
            <motion.div 
                className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-neon-cyan/50 group-hover:animate-pulse"
                style={{
                    boxShadow: '0 0 20px -5px rgba(34,211,238,0), 0 0 30px -10px rgba(34,211,238,0)',
                }}
                animate={{
                    boxShadow: [
                        '0 0 20px -5px rgba(34,211,238,0), 0 0 30px -10px rgba(34,211,238,0)',
                        '0 0 20px -5px rgba(34,211,238,0.5), 0 0 30px -10px rgba(34,211,238,0.3)',
                        '0 0 20px -5px rgba(34,211,238,0), 0 0 30px -10px rgba(34,211,238,0)'
                    ]
                }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            />
        </div>
    );
};

export default LeetCodeStats;

    