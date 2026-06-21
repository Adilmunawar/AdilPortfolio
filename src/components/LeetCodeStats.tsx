'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import leetCodeStats from '@/lib/leetcode-stats.json';

const THEME = {
  easy: '#34d399',
  medium: '#f59e0b',
  hard: '#f43f5e',
  background: 'hsl(var(--muted))',
  foreground: 'hsl(var(--foreground))',
};

interface GaugeCircleProps {
    easy: number;
    medium: number;
    hard: number;
    totalSolved: number;
    totalQuestions: number;
    size?: number;
    stroke?: number;
}

const GaugeCircle: React.FC<GaugeCircleProps> = ({ easy, medium, hard, totalSolved, totalQuestions, size = 150, stroke = 10 }) => {
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
    const { totalSolved, easy, medium, hard, acceptanceRate, totalQuestions } = leetCodeStats;
    const [isHoveringStats, setIsHoveringStats] = useState(false);

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
        <motion.div layout className="relative bg-transparent h-full flex flex-col justify-center w-full lg:w-auto">
            <div className="flex justify-center xl:justify-end mb-4">
                <p className="text-xl font-bold text-white tracking-widest uppercase">
                    LeetCode Stats
                </p>
            </div>

            <motion.div
                layoutId="stats-box"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="flex flex-row items-center justify-center gap-6"
                onMouseEnter={() => setIsHoveringStats(true)}
                onMouseLeave={() => setIsHoveringStats(false)}
            >
                <div className="relative w-[140px] h-[140px] flex-shrink-0">
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
                                    <TrendingUp className="w-6 h-6 text-vivid-blue mb-1" />
                                    <p className="text-2xl font-bold text-white">{acceptanceRate.toFixed(1)}%</p>
                                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">Acceptance</p>
                                </>
                            ) : (
                                <>
                                    <p className="text-2xl font-bold text-white leading-none mb-1">
                                      {totalSolved}<span className="text-xs text-slate-400 ml-0.5">/{totalQuestions}</span>
                                    </p>
                                    <p className="text-[10px] text-emerald-400 flex items-center justify-center gap-1 uppercase tracking-wider">
                                      <CheckCircle2 size={12}/> Solved
                                    </p>
                                </>
                            )}
                        </motion.div>
                    </AnimatePresence>
                    <GaugeCircle {...solvedPortions} size={140} stroke={8} />
                </div>
                
                <div className="flex flex-col justify-center gap-3 flex-shrink-0">
                    {stats.map(stat => (
                        <div key={stat.label} className="flex flex-col">
                            <p className={cn(`text-[10px] uppercase tracking-wider font-semibold mb-0.5`, stat.color)}>{stat.label}</p>
                            <p className="text-base font-bold text-white leading-none">
                              {stat.solved}<span className="text-xs text-slate-500 font-normal ml-0.5">/{stat.total}</span>
                            </p>
                        </div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default LeetCodeStats;