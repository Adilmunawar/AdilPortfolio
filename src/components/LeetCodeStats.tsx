'use client';

import { Card } from '@/components/ui/card';
import leetCodeStats from '@/lib/leetcode-stats.json';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';
import { Trophy, ExternalLink, Activity, Terminal, Zap, Cpu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Cyber Palette
const THEME = {
  cyan: '#22d3ee',   // Main Glow
  white: '#f0f9ff',  // Text
  slate: '#0f172a',  // Dark BG
  grid: 'rgba(34, 211, 238, 0.15)',
};

const LeetCodeStats = () => {
    const { totalSolved, easy, medium, hard, ranking, acceptanceRate } = leetCodeStats;
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Fallback loading state
    if (!totalSolved && !ranking) {
        return (
          <Card className="p-8 border border-white/10 bg-black/40 backdrop-blur-xl">
             <div className="flex flex-col items-center text-neon-cyan animate-pulse">
                <Terminal className="w-10 h-10 mb-4" />
                <p className="font-mono text-sm">INITIALIZING DATA STREAM...</p>
             </div>
          </Card>
        );
    }

    // Data for Radar Chart
    // We normalize data to 100 to make the shape look good regardless of total numbers
    const radarData = [
        { subject: 'Easy', A: (easy.solved / easy.total) * 100, fullMark: 100 },
        { subject: 'Medium', A: (medium.solved / medium.total) * 100, fullMark: 100 },
        { subject: 'Hard', A: (hard.solved / hard.total) * 100, fullMark: 100 },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-full"
        >
            <Card className="relative w-full p-6 overflow-hidden bg-[#0a0f1e]/80 border border-neon-cyan/30 rounded-xl shadow-[0_0_40px_-10px_rgba(34,211,238,0.15)] group backdrop-blur-md">
                
                {/* 1. Background Grid & Scanline */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-cyan/5 to-transparent h-[10px] w-full animate-scanline pointer-events-none"></div>

                {/* 2. Header Area */}
                <div className="relative z-10 flex justify-between items-start border-b border-neon-cyan/20 pb-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-neon-cyan/10 border border-neon-cyan/50 rounded-lg group-hover:animate-pulse">
                            <Cpu className="w-5 h-5 text-neon-cyan" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white tracking-widest uppercase font-mono">
                                System_Metrics
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-neon-cyan/70 font-mono">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan"></span>
                                </span>
                                ONLINE // LeetCode
                            </div>
                        </div>
                    </div>
                    
                    <div className="text-right">
                        <p className="text-xs text-gray-400 font-mono uppercase mb-1">Total Solved</p>
                        <p className="text-3xl font-black text-white drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] font-mono">
                            {totalSolved}
                        </p>
                    </div>
                </div>

                {/* 3. Main Content Grid */}
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-8">
                    
                    {/* LEFT: Radar Chart (The "Skill Shape") */}
                    <div className="lg:col-span-2 h-[200px] relative">
                         <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                <PolarGrid stroke={THEME.grid} strokeDasharray="4 4" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: THEME.white, fontSize: 10, fontFamily: 'monospace' }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="Skills"
                                    dataKey="A"
                                    stroke={THEME.cyan}
                                    strokeWidth={2}
                                    fill={THEME.cyan}
                                    fillOpacity={0.2}
                                    className="group-hover:animate-pulse"
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                        {/* Decorative corners for the chart area */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-neon-cyan"></div>
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-neon-cyan"></div>
                    </div>

                    {/* RIGHT: Segmented Power Bars */}
                    <div className="lg:col-span-3 flex flex-col justify-center space-y-5">
                        
                        {/* Easy Bar */}
                        <SkillBar label="EASY" value={easy.solved} total={easy.total} color="bg-emerald-400" />
                        
                        {/* Medium Bar */}
                        <SkillBar label="MED" value={medium.solved} total={medium.total} color="bg-amber-400" />
                        
                        {/* Hard Bar */}
                        <SkillBar label="HARD" value={hard.solved} total={hard.total} color="bg-rose-500" />

                        {/* Footer Stats */}
                        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-neon-cyan/20">
                            <div className="flex items-center gap-3">
                                <Trophy className="w-4 h-4 text-yellow-500" />
                                <div>
                                    <p className="text-[10px] text-gray-400 font-mono uppercase">Global Rank</p>
                                    <p className="text-sm font-bold text-white font-mono">{ranking.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Activity className="w-4 h-4 text-neon-cyan" />
                                <div>
                                    <p className="text-[10px] text-gray-400 font-mono uppercase">Acceptance</p>
                                    <p className="text-sm font-bold text-white font-mono">{acceptanceRate.toFixed(1)}%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};

// Segmented Bar Component (The "Battery" Look)
const SkillBar = ({ label, value, total, color }: { label: string, value: number, total: number, color: string }) => {
    const percentage = (value / total) * 100;
    // Create 20 segments
    const segments = Array.from({ length: 20 });
    const filledSegments = Math.round((percentage / 100) * 20);

    return (
        <motion.div
            className="flex items-center gap-4"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
            <div className="w-12 text-xs font-bold text-neon-cyan font-mono">{label}</div>
            
            {/* The Bar */}
            <div className="flex-1 flex gap-[2px] h-3">
                {segments.map((_, i) => (
                    <div 
                        key={i}
                        className={`flex-1 rounded-[1px] transition-all duration-500 ${
                            i < filledSegments 
                                ? `${color} shadow-[0_0_8px_currentColor] opacity-100` 
                                : 'bg-gray-800 opacity-30'
                        }`}
                    />
                ))}
            </div>

            <div className="w-16 text-right text-xs font-mono text-gray-400">
                <span className="text-white">{value}</span>/{total}
            </div>
        </motion.div>
    );
};

export default LeetCodeStats;

    