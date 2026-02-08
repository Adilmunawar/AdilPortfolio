'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import leetCodeStats from '@/lib/leetcode-stats.json';
import { LogoLoop } from './LogoLoop';

const badges = [
    { src: '/leetcode/202601.png', alt: 'January 2026 Daily Challenge' },
    { src: '/leetcode/202512.png', alt: 'December 2025 Daily Challenge' },
    { src: '/leetcode/202511.png', alt: 'November 2025 Daily Challenge' },
    { src: '/leetcode/202510.png', alt: 'October 2025 Daily Challenge' },
    { src: '/leetcode/202509.png', alt: 'September 2025 Daily Challenge' },
    { src: '/leetcode/202508.png', alt: 'August 2025 Daily Challenge' },
    { src: '/leetcode/25100.png', alt: '100 Day Badge' },
    { src: '/leetcode/2550.png', alt: '50 Day Badge' },
];


const THEME = {
  easy: '#34d399',      // emerald-400
  medium: '#f59e0b',     // amber-500
  hard: '#f43f5e',       // rose-500
  background: 'hsl(var(--muted))',
  foreground: 'hsl(var(--foreground))',
};

const GaugeCircle = ({ easy, medium, hard, totalSolved, totalQuestions, size = 150, stroke = 10 }) => {
    const easyRatioOfAll = totalQuestions > 0 ? easy / totalQuestions : 0;
    const mediumRatioOfAll = totalQuestions > 0 ? medium / totalQuestions : 0;
    const hardRatioOfAll = totalQuestions > 0 ? hard / totalQuestions : 0;

    const radius = (size - stroke) / 2;
    const circumference = radius * 2 * Math.PI;
    const fullArc = circumference * (270 / 360);

    const easyDash = fullArc * easyRatioOfAll;
    const mediumDash = fullArc * mediumRatioOfAll;
    const hardDash = fullArc * hardRatioOfAll;

    const mediumOffset = -easyDash;
    const hardOffset = -(easyDash + mediumDash);

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-[225deg]">
            <circle
                cx={size / 2} cy={size / 2} r={radius}
                fill="none"
                stroke={THEME.background}
                strokeOpacity="0.2"
                strokeWidth={stroke}
                strokeDasharray={`${fullArc} ${circumference - fullArc}`}
            />
            
            <motion.circle
                cx={size / 2} cy={size / 2} r={radius}
                fill="none" stroke={THEME.hard} strokeWidth={stroke} strokeLinecap="round"
                strokeDasharray={`${hardDash} ${circumference}`}
                strokeDashoffset={hardOffset}
                initial={{ strokeDasharray: `0 ${circumference}` }}
                animate={{ strokeDasharray: `${hardDash} ${circumference}` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.6 }}
            />
            <motion.circle
                cx={size / 2} cy={size / 2} r={radius}
                fill="none" stroke={THEME.medium} strokeWidth={stroke} strokeLinecap="round"
                strokeDasharray={`${mediumDash} ${circumference}`}
                strokeDashoffset={mediumOffset}
                 initial={{ strokeDasharray: `0 ${circumference}` }}
                animate={{ strokeDasharray: `${mediumDash} ${circumference}` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
            />
            <motion.circle
                cx={size / 2} cy={size / 2} r={radius}
                fill="none" stroke={THEME.easy} strokeWidth={stroke} strokeLinecap="round"
                strokeDasharray={`${easyDash} ${circumference}`}
                strokeDashoffset={0}
                 initial={{ strokeDasharray: `0 ${circumference}` }}
                animate={{ strokeDasharray: `${easyDash} ${circumference}` }}
                transition={{ duration: 1, ease: 'easeOut' }}
            />
        </svg>
    );
};

const LeetCodeStats = () => {
    const { totalSolved, easy, medium, hard, acceptanceRate, totalQuestions, ranking } = leetCodeStats;
    const [isHoveringStats, setIsHoveringStats] = useState(false);
    const mostRecentBadge = badges[0];

    const stats = useMemo(() => [
        { label: 'Easy', solved: easy.solved, total: easy.total, color: 'text-emerald-400' },
        { label: 'Medium', solved: medium.solved, total: medium.total, color: 'text-amber-400' },
        { label: 'Hard', solved: hard.solved, total: hard.total, color: 'text-rose-500' },
    ], [easy, medium, hard]);

    const solvedPortions = useMemo(() => ({
        easy: easy.solved,
        medium: medium.solved,
        hard: hard.solved,
        totalSolved: totalSolved,
        totalQuestions: totalQuestions,
    }), [easy.solved, medium.solved, hard.solved, totalSolved, totalQuestions]);


    return (
        <motion.div layout className="relative bg-transparent rounded-2xl">
            <div className="p-6 md:p-8">
                <div className="flex justify-between items-start mb-6">
                    <h3 className="text-2xl font-bold text-white tracking-widest uppercase">
                        LeetCode Stats
                    </h3>
                </div>

                <motion.div layout className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    <motion.div
                        layoutId="stats-box"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        className="md:col-span-2 p-6 bg-slate-900/50 rounded-xl border border-slate-700 flex flex-row items-stretch justify-between"
                        onMouseEnter={() => setIsHoveringStats(true)}
                        onMouseLeave={() => setIsHoveringStats(false)}
                    >
                       <div className="flex w-full items-stretch">
                         <div className="flex-1 flex flex-col justify-between items-center">
                            <div className="text-center">
                                <p className="text-xs text-slate-400 uppercase">Global Rank</p>
                                <p className="text-2xl font-bold text-white tracking-tight">{ranking.toLocaleString()}</p>
                            </div>
                            <div className="relative w-[150px] h-[150px]">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={isHoveringStats ? 'acceptance' : 'solved'}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute inset-0 flex flex-col items-center justify-center text-center"
                                    >
                                        {isHoveringStats ? (
                                            <>
                                                <TrendingUp className="w-7 h-7 text-neon-cyan mb-1" />
                                                <p className="text-3xl font-bold text-white">{acceptanceRate.toFixed(1)}%</p>
                                                <p className="text-xs text-slate-400 mt-1">Acceptance</p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-3xl font-bold text-white">{totalSolved}<span className="text-base text-slate-400">/{totalQuestions}</span></p>
                                                <p className="text-sm text-emerald-400 flex items-center justify-center gap-1 mt-1"><CheckCircle2 size={14}/> Solved</p>
                                            </>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                                <GaugeCircle {...solvedPortions} />
                            </div>
                         </div>
                            <div className="flex flex-col justify-center gap-2.5">
                                {stats.map(stat => (
                                    <div key={stat.label} className="p-3 rounded-lg bg-slate-800/70 border border-slate-700">
                                        <p className={cn(`text-sm font-medium`, stat.color)}>{stat.label}</p>
                                        <p className="text-lg font-bold text-white">{stat.solved}<span className="text-xs text-slate-400">/{stat.total}</span></p>
                                    </div>
                                ))}
                            </div>
                       </div>
                    </motion.div>

                    <motion.div
                        layout
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        className={cn(
                            "relative p-6 bg-slate-900/50 rounded-xl border border-slate-700 flex flex-col md:col-span-3 min-h-[268px] overflow-hidden"
                        )}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h4 className="text-sm font-semibold text-white">
                                Badges: <span className="text-xl font-bold">{badges.length}</span>
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                <span>Most Recent:</span> 
                                <span className="font-semibold text-slate-200 truncate">{mostRecentBadge.alt}</span>
                            </div>
                        </div>
                        
                        <div className="relative flex-grow flex items-center justify-center overflow-hidden">
                            <LogoLoop
                                logos={badges}
                                speed={40}
                                fadeOut={true}
                                logoHeight={80}
                                gap={48}
                                scaleOnHover={true}
                                fadeOutColor='hsl(var(--background))'
                            />
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default LeetCodeStats;
