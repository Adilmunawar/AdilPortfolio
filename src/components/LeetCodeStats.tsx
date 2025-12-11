'use client';

import { Card } from '@/components/ui/card';
import leetCodeStats from '@/lib/leetcode-stats.json';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';
import { Trophy, Activity, Cpu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// --- Cyber Palette & Theme ---
const THEME = {
  cyan: '#22d3ee',
  white: '#f0f9ff',
  slate: '#0f172a',
  grid: 'rgba(34, 211, 238, 0.15)',
  colors: {
    easy: '#00B8A3',   // Cyan-Green
    medium: '#FFC01E', // Yellow
    hard: '#FF375F',    // Red-Orange
    unsolved: 'rgba(34, 211, 238, 0.1)', // Faint grid color
  },
};

const LeetCodeStats = () => {
    const { totalSolved, totalQuestions, easy, medium, hard, ranking, acceptanceRate } = leetCodeStats;
    const [isHovering, setIsHovering] = useState(false);

    // Data for Radar Chart
    const radarData = [
        { subject: 'Easy', A: (easy.solved / easy.total) * 100, fullMark: 100 },
        { subject: 'Medium', A: (medium.solved / medium.total) * 100, fullMark: 100 },
        { subject: 'Hard', A: (hard.solved / hard.total) * 100, fullMark: 100 },
    ];
    
    // Data for Circular (Pie) Chart
    const pieData = [
      { name: 'Easy', value: easy.solved, color: THEME.colors.easy },
      { name: 'Medium', value: medium.solved, color: THEME.colors.medium },
      { name: 'Hard', value: hard.solved, color: THEME.colors.hard },
      { name: 'Unsolved', value: totalQuestions - totalSolved, color: THEME.colors.unsolved },
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
                
                <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-cyan/5 to-transparent h-[10px] w-full animate-scanline pointer-events-none"></div>

                <div className="relative z-10 flex justify-between items-start border-b border-neon-cyan/20 pb-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-neon-cyan/10 border border-neon-cyan/50 rounded-lg">
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
                                LIVE_DATA // @AdilMunawar
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                         <p className="text-xs text-gray-400 font-mono uppercase mb-1">Global Rank</p>
                        <p className="text-3xl font-black text-white drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] font-mono">
                            {ranking.toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    
                    {/* --- LEFT: Radar Chart --- */}
                    <div className="h-[250px] relative">
                         <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                <PolarGrid stroke={THEME.grid} strokeDasharray="4 4" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: THEME.white, fontSize: 12, fontFamily: 'monospace' }} />
                                <Radar name="Skills" dataKey="A" stroke={THEME.cyan} strokeWidth={2} fill={THEME.cyan} fillOpacity={0.2} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* --- RIGHT: Circular Chart & Stats --- */}
                    <div className="flex flex-col items-center">
                        <div
                            className="relative h-[200px] w-[200px] cursor-pointer"
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={2}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                {isHovering ? (
                                    <>
                                        <div className="text-3xl font-bold text-white transition-all duration-300">
                                            {acceptanceRate.toFixed(1)}%
                                        </div>
                                        <div className="text-sm text-gray-400 font-mono">Acceptance</div>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-3xl font-bold text-white">
                                            {totalSolved}
                                        </div>
                                        <div className="text-sm text-gray-400 font-mono">Solved</div>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="w-full mt-6 space-y-3">
                           <StatRow label="Easy" solved={easy.solved} total={easy.total} color={THEME.colors.easy} />
                           <StatRow label="Medium" solved={medium.solved} total={medium.total} color={THEME.colors.medium} />
                           <StatRow label="Hard" solved={hard.solved} total={hard.total} color={THEME.colors.hard} />
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};

// Stat Row for Easy, Medium, Hard breakdown
const StatRow = ({ label, solved, total, color }: { label: string; solved: number; total: number; color: string }) => {
    const percentage = (solved / total) * 100;
    return (
        <div className="flex items-center justify-between text-sm font-mono">
            <span className="text-gray-400">{label}</span>
            <div className="flex items-center gap-3">
                <span className="font-bold text-white">{solved} <span className="text-gray-500">/ {total}</span></span>
                <div className="w-24 h-2 bg-gray-700/50 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${percentage}%`, backgroundColor: color }}></div>
                </div>
            </div>
        </div>
    );
}

export default LeetCodeStats;
