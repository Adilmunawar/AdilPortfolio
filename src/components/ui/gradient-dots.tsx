'use client';

import React from 'react';
import { motion } from 'framer-motion';

type GradientDotsProps = React.ComponentProps<typeof motion.div> & {
    /** Dot radius in px (default: 2) */
    dotSize?: number;
    /** Spacing between dots in px (default: 20) */
    spacing?: number;
    /** Animation duration in seconds (default: 30) */
    duration?: number;
    /** Color cycle duration in seconds (default: 6) */
    colorCycleDuration?: number;
    /** Background color (default: 'var(--background)') */
    backgroundColor?: string;
};

export function GradientDots({
    dotSize = 1,
    spacing = 25,
    duration = 30,
    colorCycleDuration = 10,
    backgroundColor = 'var(--background)',
    className,
    ...props
}: GradientDotsProps) {
    const hexSpacing = spacing * 1.732; // Hexagonal spacing

    return (
        <>
            {/* Layer 1: The solid base background */}
            <div 
                className="absolute inset-0 -z-20" 
                style={{ backgroundColor }} 
            />

            {/* Layer 2: The Neon Orbs with a Dot Mask */}
            <motion.div
                className={`absolute inset-0 -z-10 ${className}`}
                style={{
                    backgroundColor: 'transparent',
                    // The Neon Orbs (Moving Colors)
                    backgroundImage: `
                        radial-gradient(circle at 50% 50%, var(--cyber-pink, #ff0080), transparent 40%),
                        radial-gradient(circle at 50% 50%, var(--cyber-yellow, #ffff00), transparent 40%),
                        radial-gradient(circle at 50% 50%, var(--cyber-green, #00ff80), transparent 40%),
                        radial-gradient(circle at 50% 50%, var(--neon-cyan, #22d3ee), transparent 40%)
                    `,
                    backgroundSize: `
                        300% 300%, 
                        300% 300%, 
                        300% 300%, 
                        300% 300%
                    `,
                    // The Mask: Defines the Grid of Dots
                    // 'black' in mask = visible, 'transparent' = invisible
                    WebkitMaskImage: `
                        radial-gradient(circle at 50% 50%, black ${dotSize}px, transparent ${dotSize + 0.5}px),
                        radial-gradient(circle at 50% 50%, black ${dotSize}px, transparent ${dotSize + 0.5}px)
                    `,
                    maskImage: `
                        radial-gradient(circle at 50% 50%, black ${dotSize}px, transparent ${dotSize + 0.5}px),
                        radial-gradient(circle at 50% 50%, black ${dotSize}px, transparent ${dotSize + 0.5}px)
                    `,
                    WebkitMaskSize: `${spacing}px ${hexSpacing}px, ${spacing}px ${hexSpacing}px`,
                    maskSize: `${spacing}px ${hexSpacing}px, ${spacing}px ${hexSpacing}px`,
                    
                    // Offset the second mask to create hexagonal pattern
                    WebkitMaskPosition: `0 0, ${spacing / 2}px ${hexSpacing / 2}px`,
                    maskPosition: `0 0, ${spacing / 2}px ${hexSpacing / 2}px`,
                    
                    WebkitMaskRepeat: 'repeat',
                    maskRepeat: 'repeat'
                }}
                animate={{
                    // Animate only the Orbs (Background Positions)
                    backgroundPosition: [
                        `0% 0%, 100% 0%, 50% 100%, 0% 50%`,
                        `100% 100%, 0% 100%, 50% 0%, 100% 50%`,
                        `0% 0%, 100% 0%, 50% 100%, 0% 50%` // Loop back
                    ],
                    filter: ['hue-rotate(0deg)', 'hue-rotate(360deg)'],
                }}
                transition={{
                    backgroundPosition: {
                        duration: duration,
                        ease: 'linear',
                        repeat: Number.POSITIVE_INFINITY,
                    },
                    filter: {
                        duration: colorCycleDuration,
                        ease: 'linear',
                        repeat: Number.POSITIVE_INFINITY,
                    },
                }}
                {...props}
            />
        </>
    );
}
