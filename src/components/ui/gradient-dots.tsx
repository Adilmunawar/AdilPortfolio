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
    /** Mask color (default: 'var(--background)') */
    backgroundColor?: string;
};

export function GradientDots({
    dotSize = 2, // 2px radius = 4px diameter dots
    spacing = 20, // Wider spacing to make dots distinct
    duration = 30,
    colorCycleDuration = 6,
    backgroundColor = 'var(--background)',
    className,
    ...props
}: GradientDotsProps) {
    const hexSpacing = spacing * 1.732; // Hexagonal spacing calculation

    return (
        <motion.div
            className={`absolute inset-0 -z-10 ${className}`}
            style={{
                backgroundColor,
                backgroundImage: `
          /* The Mask: Creates holes (dots) in the solid background color */
          radial-gradient(circle at 50% 50%, transparent ${dotSize}px, ${backgroundColor} ${dotSize}px),
          radial-gradient(circle at 50% 50%, transparent ${dotSize}px, ${backgroundColor} ${dotSize}px),
          
          /* The Neon Orbs: Glowing colors visible through the holes */
          radial-gradient(circle at 50% 50%, var(--cyber-pink, #ff0080), transparent 60%),
          radial-gradient(circle at 50% 50%, var(--cyber-yellow, #ffff00), transparent 60%),
          radial-gradient(circle at 50% 50%, var(--cyber-green, #00ff80), transparent 60%),
          radial-gradient(ellipse at 50% 50%, var(--cyber-blue, #4338ca), transparent 60%)
        `,
                backgroundSize: `
          ${spacing}px ${hexSpacing}px,
          ${spacing}px ${hexSpacing}px,
          200% 200%,
          200% 200%,
          200% 200%,
          200% ${hexSpacing}px
        `,
                backgroundPosition: `
          0px 0px, ${spacing / 2}px ${hexSpacing / 2}px,
          0% 0%,
          0% 0%,
          0% 0px
        `,
            }}
            animate={{
                backgroundPosition: [
                    `0px 0px, ${spacing / 2}px ${hexSpacing / 2}px, 800% 400%, 1000% -400%, -1200% -600%, 400% ${hexSpacing}px`,
                    `0px 0px, ${spacing / 2}px ${hexSpacing / 2}px, 0% 0%, 0% 0%, 0% 0%, 0% 0%`,
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
    );
}
