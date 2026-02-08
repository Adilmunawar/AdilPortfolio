'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, TrendingUp, Award, X } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import leetCodeStats from '@/lib/leetcode-stats.json';
import useEmblaCarousel, { type EmblaCarouselType } from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

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
    
    const [isExpanded, setIsExpanded] = useState(false);
    const [isHoveringStats, setIsHoveringStats] = useState(false);
    const [mostRecentBadge, setMostRecentBadge] = useState(badges[0]);

    const [emblaRef, emblaApi] = useEmblaCarousel(
      { loop: true, align: 'center' },
      [Autoplay({ delay: 2500, stopOnInteraction: false, stopOnMouseEnter: true })]
    );
    const [scales, setScales] = useState<number[]>([]);

    const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
        if (!emblaApi) return;
        const selectedIndex = emblaApi.selectedScrollSnap();
        setMostRecentBadge(badges[selectedIndex]);
    }, []);

    const TWEEN_FACTOR = 1.8;
    const onScroll = useCallback(() => {
        if (!emblaApi) return;
        const engine = emblaApi.internalEngine();
        const scrollProgress = emblaApi.scrollProgress();

        const newScales = emblaApi.scrollSnapList().map((scrollSnap, index) => {
            let diff = scrollSnap - scrollProgress;
            
            if (engine.options.loop) {
                engine.slideLooper.loopPoints.forEach((loopItem) => {
                    const target = loopItem.target();
                    if (index === loopItem.index && target !== 0) {
                        const sign = Math.sign(target);
                        if (sign === -1) diff = scrollSnap - (1 + scrollProgress);
                        if (sign === 1) diff = scrollSnap + (1 - scrollProgress);
                    }
                });
            }
            const tweenValue = 1 - Math.abs(diff * TWEEN_FACTOR);
            return 0.7 + 0.3 * Math.max(0, tweenValue);
        });
        setScales(newScales);
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect(emblaApi);
        onScroll();
        emblaApi.on('select', onSelect);
        emblaApi.on('scroll', onScroll);
        emblaApi.on('reInit', onScroll);
        emblaApi.on('reInit', onSelect);

        return () => {
            emblaApi.off('select', onSelect);
            emblaApi.off('scroll', onScroll);
        }
    }, [emblaApi, onSelect, onScroll]);

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
        <motion.div layout className="relative bg-cyber-dark/80 rounded-2xl border border-neon-cyan/20 backdrop-blur-sm">
            <div className="p-6 md:p-8">
                <div className="flex justify-between items-start mb-6">
                    <h3 className="text-2xl font-bold text-white tracking-widest uppercase">
                        LeetCode Stats
                    </h3>
                    <div className="text-right">
                        <p className="text-xs text-slate-400 uppercase tracking-wider">Global Rank</p>
                        <p className="text-3xl font-bold text-neon-cyan animate-text-glow">~{ranking.toLocaleString()}</p>
                    </div>
                </div>

                <motion.div layout className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    <AnimatePresence>
                        {!isExpanded && (
                            <motion.div
                                layoutId="stats-box"
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30, transition: { duration: 0.3 } }}
                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                className="md:col-span-2 flex flex-col gap-6 p-6 bg-slate-900/50 rounded-xl border border-slate-700"
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
                                        <GaugeCircle {...solvedPortions} />
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
                            isExpanded ? "md:col-span-5 min-h-[400px]" : "md:col-span-3"
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
                                        <h4 className="text-lg font-bold text-white flex items-center gap-2">All Badges</h4>
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
                                                <Image src={badge.src} alt={badge.alt} width={256} height={256} className="rounded-lg transition-transform duration-300 group-hover:scale-105" />
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
                                    <div className="flex justify-between items-start mb-2">
                                      <div>
                                        <h4 className="text-sm font-semibold text-white">
                                            Badges: <span className="text-xl font-bold">{badges.length}</span>
                                        </h4>
                                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                                            <span>Most Recent:</span> 
                                            <span className="font-semibold text-slate-200 truncate">{mostRecentBadge.alt}</span>
                                        </div>
                                      </div>
                                      <button onClick={() => setIsExpanded(true)} className="p-2 -mr-2 -mt-2 rounded-full hover:bg-slate-700 transition-colors">
                                          <ArrowRight className="w-5 h-5 text-slate-300" />
                                      </button>
                                    </div>
                                    
                                    <div className="relative mt-auto h-32 flex items-center justify-center">
                                        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-slate-900/50 to-transparent z-10 pointer-events-none" />
                                        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-slate-900/50 to-transparent z-10 pointer-events-none" />
                                        <div ref={emblaRef} className="overflow-hidden cursor-grab active:cursor-grabbing w-full">
                                            <div className="flex items-center -ml-4">
                                                {badges.map((badge, index) => (
                                                    <motion.div
                                                        key={index}
                                                        className="relative flex-[0_0_120px] h-32 pl-4"
                                                        style={{ transform: `scale(${scales[index] || 0.8})` }}
                                                        transition={{ type: 'spring', stiffness: 400, damping: 30}}
                                                    >
                                                        <Image src={badge.src} alt={badge.alt} width={256} height={256} className="object-contain w-full h-full" />
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
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
