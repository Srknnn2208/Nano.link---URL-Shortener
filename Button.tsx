import React from 'react';


// Let's create a simple utility first in a separate file or just use it here.
// I'll assume I'll create src/lib/utils.ts next.

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
    className,
    variant = 'primary',
    size = 'md',
    ...props
}) => {
    const variants = {
        primary: 'bg-neon-green text-black border-2 border-neon-green hover:shadow-[4px_4px_0_#FF00FF] hover:-translate-y-1 active:translate-y-0 active:shadow-none transition-all',
        secondary: 'bg-electric-magenta text-white border-2 border-electric-magenta hover:shadow-[4px_4px_0_#39FF14] hover:-translate-y-1 active:translate-y-0 active:shadow-none transition-all',
        outline: 'bg-transparent text-neon-green border-2 border-neon-green hover:bg-neon-green/10 hover:shadow-[0_0_10px_#39FF14] transition-all',
        ghost: 'bg-transparent text-gray-400 hover:text-neon-green transition-colors',
    };

    const sizes = {
        sm: 'px-3 py-1 text-sm',
        md: 'px-6 py-2 text-base',
        lg: 'px-8 py-3 text-lg font-bold',
    };

    return (
        <button
            className={cn(
                'font-mono uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-neon-green',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    );
};
