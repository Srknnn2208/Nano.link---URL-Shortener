import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FlipCardProps {
    digit: string;
}

const FlipCard: React.FC<FlipCardProps> = ({ digit }) => {
    // Initialize with '0' to trigger animation on mount (entry effect)
    const [prevDigit, setPrevDigit] = useState('0');
    const [isFlipping, setIsFlipping] = useState(false);

    useEffect(() => {
        if (digit !== prevDigit) {
            setIsFlipping(true);
            const timer = setTimeout(() => {
                setPrevDigit(digit);
                setIsFlipping(false);
            }, 600); // Standard duration
            return () => clearTimeout(timer);
        }
    }, [digit, prevDigit]);

    return (
        <div className="relative w-6 h-10 bg-black rounded text-neon-green font-mono text-lg font-bold perspective-1000 overflow-hidden border border-white/10">
            {/* Top Half (New) */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-zinc-900 overflow-hidden z-0 flex items-end justify-center rounded-t border-b border-black/80">
                <span className="translate-y-1/2">{digit}</span>
            </div>

            {/* Bottom Half (Old) */}
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-black overflow-hidden z-0 flex items-start justify-center rounded-b border-t border-black/80">
                <span className="-translate-y-1/2">{prevDigit}</span>
            </div>

            {/* Flipping Top Half (Old) */}
            <AnimatePresence>
                {isFlipping && (
                    <motion.div
                        key={`top-${prevDigit}`}
                        initial={{ rotateX: 0 }}
                        animate={{ rotateX: -180 }}
                        transition={{
                            duration: 0.6,
                            ease: "easeInOut"
                        }}
                        className="absolute top-0 left-0 right-0 h-full bg-zinc-900 z-10 origin-center backface-hidden"
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        <div className="absolute top-0 left-0 right-0 h-1/2 overflow-hidden flex items-end justify-center rounded-t border-b border-black/80 bg-zinc-900">
                            <span className="translate-y-1/2">{prevDigit}</span>
                        </div>
                        <div className="absolute top-1/2 left-0 right-0 h-1/2 overflow-hidden flex items-start justify-center rounded-b border-t border-black/80 bg-black rotate-x-180">
                            <span className="-translate-y-1/2">{digit}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const FlipCounter: React.FC<{ value: number }> = ({ value }) => {
    // Pad with zeros to ensure at least 2 digits (e.g., 01, 02)
    const digits = value.toString().padStart(2, '0').split('');

    return (
        <div className="flex gap-1 items-center justify-end">
            {digits.map((digit, i) => (
                <FlipCard key={`${i}-${digits.length}`} digit={digit} />
            ))}
        </div>
    );
};
