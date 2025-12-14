'use client';

import { Card } from '@/components/ui/card';
import leetCodeStats from '@/lib/leetcode-stats.json';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from 'recharts';
import { Trophy, Activity, Cpu, Terminal, CheckCircle } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

// Cyber Palette
const THEME = {
  cyan: '#22d3ee',
  red: '#f43f5e',
  amber: '#f59e0b',
  emerald: '#34d399',
  white: '#f0f9ff',
  slate: '#0f172a',
  grid: 'rgba(34, 211, 238, 0.15)',
  grid2: 'rgba(244, 63, 94, 0.15)',
};

const LeetCodeStats = () => {
    const { totalSolved, easy, medium, hard, ranking, acceptanceRate, totalQuestions } = leetCodeStats;
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    
    // Data for Radar Chart 1
    const radarData1 = useMemo(() => [
        { subject: 'Dyn. Prog.', A: 95, fullMark: 100 },
        { subject: 'Backtracking', A: 75, fullMark: 100 },
        { subject: 'Union Find', A: 60, fullMark: 100 },
        { subject: 'Div & Conquer', A: 55, fullMark: 100 },
        { subject: 'Bitmask', A: 45, fullMark: 100 },
    ], []);

    // Data for Radar Chart 2
    const radarData2 = useMemo(() => [
        { subject: 'Greedy', A: 88, fullMark: 100 },
        { subject: 'Graph', A: 92, fullMark: 100 },
        { subject: 'Trie', A: 70, fullMark: 100 },
        { subject: 'Segment Tree', A: 65, fullMark: 100 },
        { subject: 'Geometry', A: 50, fullMark: 100 },
    ], []);

    const radialChartData = useMemo(() => [
        { name: 'Hard', value: (hard.solved / totalQuestions) * 100, fill: THEME.red },
        { name: 'Medium', value: (medium.solved / totalQuestions) * 100, fill: THEME.amber },
        { name: 'Easy', value: (easy.solved / totalQuestions) * 100, fill: THEME.emerald },
    ], [easy, medium, hard, totalQuestions]);


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

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-full"
        >
            <Card className="relative w-full p-6 overflow-hidden bg-[#0a0f1e]/80 border border-neon-cyan/30 rounded-xl shadow-[0_0_40px_-10px_rgba(34,211,238,0.15)] group backdrop-blur-md">
                
                <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-cyan/5 to-transparent h-[10px] w-full animate-scanline pointer-events-none"></div>

                <div className="relative z-10 flex justify-between items-start border-b border-neon-cyan/20 pb-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-neon-cyan/10 border border-neon-cyan/50 rounded-lg group-hover:animate-pulse">
                            <Cpu className="w-5 h-5 text-neon-cyan" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white tracking-widest uppercase font-mono">
                                LeetCode_Metrics
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-neon-cyan/70 font-mono">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan"></span>
                                </span>
                                ADVANCED ALGORITHMS
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content: Three Charts + Skill Bars */}
                <div className="relative z-10 space-y-8">
                    
                    {/* Charts Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[220px]">
                        {/* Chart 1: Left Radar */}
                        <div className="h-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData1}>
                                    <PolarGrid stroke={THEME.grid} strokeDasharray="4 4" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: THEME.white, fontSize: 10, fontFamily: 'monospace' }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar name="Core Skills" dataKey="A" stroke={THEME.cyan} strokeWidth={2} fill={THEME.cyan} fillOpacity={0.2} className="group-hover:animate-pulse" animationDuration={300} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Chart 2: Center Circular */}
                        <div className="h-full relative flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadialBarChart 
                                    cx="50%" 
                                    cy="50%" 
                                    innerRadius="70%" 
                                    outerRadius="100%" 
                                    barSize={8}
                                    data={radialChartData}
                                    startAngle={90}
                                    endAngle={-270}
                                >
                                    <RadialBar
                                        minAngle={15}
                                        background
                                        dataKey="value"
                                        cornerRadius={10}
                                        className="group-hover:animate-pulse"
                                        animationDuration={1500}
                                    />
                                </RadialBarChart>
                            </ResponsiveContainer>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                                <p className="text-3xl font-black text-white font-mono">{totalSolved}<span className="text-lg text-gray-400 font-mono">/{totalQuestions}</span></p>
                                <div className="flex items-center justify-center gap-1.5 text-emerald-400">
                                    <CheckCircle size={14}/>
                                    <p className="text-sm font-semibold">Solved</p>
                                </div>
                            </div>
                        </div>

                        {/* Chart 3: Right Radar */}
                        <div className="h-full relative">
                             <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData2}>
                                    <PolarGrid stroke={THEME.grid2} strokeDasharray="4 4" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: THEME.white, fontSize: 10, fontFamily: 'monospace' }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar name="Specialized Skills" dataKey="A" stroke={THEME.red} strokeWidth={2} fill={THEME.amber} fillOpacity={0.25} className="group-hover:animate-pulse" animationDuration={300} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Skill Bars & Stats Area */}
                    <div className="space-y-5 pt-8 border-t border-neon-cyan/20">
                        <SkillBar label="EASY" value={easy.solved} total={easy.total} color="bg-emerald-400" />
                        <SkillBar label="MED" value={medium.solved} total={medium.total} color="bg-amber-400" />
                        <SkillBar label="HARD" value={hard.solved} total={hard.total} color="bg-rose-500" />
                        
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
