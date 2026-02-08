
'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, TrendingUp, Award, X } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import leetCodeStats from '@/lib/leetcode-stats.json';

const badges = [
    { src: '/leetcode/Top_SQL_50.jpg', alt: 'Top SQL 50' },
    { src: '/leetcode/202508.jpg', alt: 'August 2025 Daily Challenge' },
    { src: '/leetcode/202509.jpg', alt: 'September 2025 Daily Challenge' },
    { src: '/leetcode/202510.jpg', alt: 'October 2025 Daily Challenge' },
    { src: '/leetcode/202511.jpg', alt: 'November 2025 Daily Challenge' },
    { src: '/leetcode/25100.jpg', alt: '100 Day Badge' },
    { src: '/leetcode/2550.jpg', alt: '50 Day Badge' },
    { src: '/leetcode/Introduction_to_Pandas.jpg', alt: 'Introduction to Pandas' },
];

const mostRecentBadge = badges[0];

const THEME = {
  easy: '#34d399',      // emerald-400
  medium: '#f59e0b',     // amber-500
  hard: '#f43f5e',       // rose-500
  background: 'hsl(var(--muted))',
  foreground: 'hsl(var(--foreground))',
};

const GaugeCircle = ({ easy, medium, hard, size = 150, stroke = 10 }) => {
    const radius = (size - stroke) / 2;
    const circumference = radius * 2 * Math.PI;
    const arc = circumference * (270 / 360);

    const easyOffset = 0;
    const mediumOffset = arc * easy;
    const hardOffset = arc * (easy + medium);

    const easyDash = arc * easy;
    const mediumDash = arc * medium;
    const hardDash = arc * hard;

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-[225deg]">
            <circle
                cx={size / 2} cy={size / 2} r={radius}
                fill="none"
                stroke={THEME.background}
                strokeOpacity="0.2"
                strokeWidth={stroke}
                strokeDasharray={`${arc} ${circumference - arc}`}
            />
            {/* Hard */}
            <motion.circle
                cx={size / 2} cy={size / 2} r={radius}
                fill="none" stroke={THEME.hard} strokeWidth={stroke} strokeLinecap="round"
                strokeDasharray={`${hardDash} ${circumference - hardDash}`}
                strokeDashoffset={-hardOffset}
                initial={{ strokeDashoffset: -hardOffset + arc }}
                animate={{ strokeDashoffset: -hardOffset }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
            />
            {/* Medium */}
            <motion.circle
                cx={size / 2} cy={size / 2} r={radius}
                fill="none" stroke={THEME.medium} strokeWidth={stroke} strokeLinecap="round"
                strokeDasharray={`${mediumDash} ${circumference - mediumDash}`}
                strokeDashoffset={-mediumOffset}
                 initial={{ strokeDashoffset: -mediumOffset + arc }}
                animate={{ strokeDashoffset: -mediumOffset }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            />
            {/* Easy */}
            <motion.circle
                cx={size / 2} cy={size / 2} r={radius}
                fill="none" stroke={THEME.easy} strokeWidth={stroke} strokeLinecap="round"
                strokeDasharray={`${easyDash} ${circumference - easyDash}`}
                strokeDashoffset={-easyOffset}
                 initial={{ strokeDashoffset: -easyOffset + arc }}
                animate={{ strokeDashoffset: -easyOffset }}
                transition={{ duration: 1, ease: 'easeOut' }}
            />
        </svg>
    );
};

const LeetCodeStats = () => {
    const { totalSolved, easy, medium, hard, acceptanceRate, totalQuestions, ranking } = leetCodeStats;
    
    const [isExpanded, setIsExpanded] = useState(false);
    const [isHoveringStats, setIsHoveringStats] = useState(false);
    const [badgeIndex, setBadgeIndex] = useState(0);

    const stats = useMemo(() => [
        { label: 'Easy', solved: easy.solved, total: easy.total, color: 'text-emerald-400' },
        { label: 'Medium', solved: medium.solved, total: medium.total, color: 'text-amber-400' },
        { label: 'Hard', solved: hard.solved, total: hard.total, color: 'text-rose-500' },
    ], [easy, medium, hard]);

    useEffect(() => {
        if (!isExpanded) {
            const interval = setInterval(() => {
                setBadgeIndex(prev => (prev + 1));
            }, 2500);
            return () => clearInterval(interval);
        }
    }, [isExpanded]);

    const displayedBadges = useMemo(() => {
        const len = badges.length;
        if (len === 0) return [];
        return [
            badges[(badgeIndex - 1 + len) % len],
            badges[badgeIndex % len],
            badges[(badgeIndex + 1) % len]
        ];
    }, [badgeIndex]);
    
    const solvedPercentages = useMemo(() => ({
        easy: easy.solved / totalSolved,
        medium: medium.solved / totalSolved,
        hard: hard.solved / totalSolved,
    }), [easy.solved, medium.solved, hard.solved, totalSolved]);

    return (
        <motion.div layout className="relative bg-cyber-dark/80 rounded-2xl border border-neon-cyan/20 backdrop-blur-sm">
            <div className="p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-white tracking-widest uppercase">
                        LeetCode Stats
                    </h3>
                    <div className="text-right">
                        <p className="text-xs text-slate-400">Global Rank</p>
                        <p className="text-2xl font-bold text-neon-cyan animate-text-glow">~{ranking.toLocaleString()}</p>
                    </div>
                </div>

                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnimatePresence>
                        {!isExpanded && (
                            <motion.div
                                layoutId="stats-box"
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30, transition: { duration: 0.3 } }}
                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                className="flex flex-col gap-6 p-6 bg-slate-900/50 rounded-xl border border-slate-700"
                                onMouseEnter={() => setIsHoveringStats(true)}
                                onMouseLeave={() => setIsHoveringStats(false)}
                            >
                                <div className="flex items-center justify-between gap-4">
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
                                                        <p className="text-sm text-emerald-400 flex items-center gap-1 mt-1"><CheckCircle2 size={14}/> Solved</p>
                                                    </>
                                                )}
                                            </motion.div>
                                        </AnimatePresence>
                                        <GaugeCircle {...solvedPercentages} />
                                    </div>
                                    <div className="flex flex-col gap-2.5 flex-1">
                                        {stats.map(stat => (
                                            <div key={stat.label} className="p-3 rounded-lg bg-slate-800/70 border border-slate-700">
                                                <p className={`text-sm font-medium ${stat.color}`}>{stat.label}</p>
                                                <p className="text-lg font-bold text-white">{stat.solved}<span className="text-xs text-slate-400">/{stat.total}</span></p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.div
                        layout
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        className={cn(
                            "relative p-6 bg-slate-900/50 rounded-xl border border-slate-700 flex flex-col",
                            isExpanded ? "md:col-span-2 min-h-[400px]" : ""
                        )}
                    >
                        <AnimatePresence mode="wait">
                            {isExpanded ? (
                                <motion.div
                                    key="expanded-badges"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-lg font-bold text-white flex items-center gap-2"><Award className="w-5 h-5 text-amber-400"/> All Badges</h4>
                                        <button onClick={() => setIsExpanded(false)} className="p-2 rounded-full hover:bg-slate-700 transition-colors">
                                            <X className="w-5 h-5 text-slate-300" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                                        {badges.map((badge, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.3, delay: index * 0.03 }}
                                                className="group relative flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
                                            >
                                                <Image src={badge.src} alt={badge.alt} width={128} height={128} className="rounded-lg transition-transform duration-300 group-hover:scale-105" />
                                                <p className="text-xs text-center text-slate-400 group-hover:text-white transition-colors h-8 flex items-center">
                                                    {badge.alt}
                                                </p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="collapsed-badges"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col flex-grow"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm text-slate-400">Badges</p>
                                            <p className="text-4xl font-bold text-white">{badges.length}</p>
                                        </div>
                                        <button onClick={() => setIsExpanded(true)} className="p-2 rounded-full hover:bg-slate-700 transition-colors">
                                            <ArrowRight className="w-5 h-5 text-slate-300" />
                                        </button>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-sm text-slate-400">Most Recent Badge</p>
                                        <p className="font-semibold text-white truncate">{mostRecentBadge.alt}</p>
                                    </div>
                                    <div className="relative mt-auto h-24 flex items-center justify-center overflow-hidden">
                                        <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-slate-900/50 to-transparent z-10" />
                                        <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-slate-900/50 to-transparent z-10" />
                                        <AnimatePresence custom={badgeIndex}>
                                            <motion.div
                                                key={badgeIndex}
                                                className="absolute flex items-center justify-center w-full"
                                                initial={{ x: 100, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                exit={{ x: -100, opacity: 0 }}
                                                transition={{ type: 'spring', stiffness: 350, damping: 35 }}
                                            >
                                                {displayedBadges.length > 0 && displayedBadges.map((badge, i) => (
                                                    <motion.div
                                                        key={badge.src + i}
                                                        animate={{ scale: i === 1 ? 1.15 : 0.8, opacity: i === 1 ? 1 : 0.5, zIndex: i === 1 ? 10 : 1 }}
                                                        transition={{ duration: 0.4 }}
                                                        className="w-20 h-20 absolute"
                                                        style={{ x: `${(i - 1) * 70}px` }}
                                                    >
                                                        <Image src={badge.src} alt={badge.alt} width={128} height={128} className="object-contain" />
                                                    </motion.div>
                                                ))}
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default LeetCodeStats;
