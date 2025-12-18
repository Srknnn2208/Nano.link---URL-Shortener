import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({ className, label, error, ...props }) => {
    return (
        <div className="flex flex-col gap-2 w-full">
            {label && (
                <label className="text-neon-green font-mono text-sm tracking-wider uppercase">
                    {label}
                </label>
            )}
            <input
                className={cn(
                    'bg-black/50 border-2 border-white/20 text-white p-3 font-mono focus:border-neon-green focus:outline-none focus:shadow-[0_0_15px_rgba(57,255,20,0.3)] transition-all placeholder:text-gray-700',
                    error && 'border-red-500 focus:border-red-500',
                    className
                )}
                {...props}
            />
            {error && <span className="text-red-500 text-xs font-mono">{error}</span>}
        </div>
    );
};
