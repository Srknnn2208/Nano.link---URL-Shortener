import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ChevronRight } from 'lucide-react';

export const WelcomePage: React.FC = () => {
    const [name, setName] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(0); // 0: Protocol Init, 1: Identify, 2: Access Granted

    useEffect(() => {
        // Sequence the animations
        const timer1 = setTimeout(() => setStep(1), 2000); // Show input after "Protocol Initiated"
        return () => clearTimeout(timer1);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            setStep(2); // Show Access Granted
            setTimeout(() => {
                login(name);
                navigate('/');
            }, 1500);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-4 font-mono overflow-hidden relative">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

            {/* Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[size:100%_4px] z-10 opacity-20"></div>

            <div className="w-full max-w-lg relative z-20">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-4">
                        {/* Step 0: Protocol Init */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-neon-green/70 text-sm tracking-widest"
                        >
                            <TypewriterText text="> SYSTEM_BOOT_SEQUENCE_INITIATED..." speed={30} />
                        </motion.div>

                        {/* Step 1: Identify */}
                        {step >= 1 && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tighter glitch-text" data-text="IDENTIFY YOURSELF">
                                    IDENTIFY YOURSELF
                                </h1>
                                <div className="h-1 w-24 bg-neon-green mt-4 animate-pulse"></div>
                            </motion.div>
                        )}
                    </div>

                    {/* Input Area */}
                    <AnimatePresence>
                        {step === 1 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: 0.5 }}
                                className="relative group"
                            >
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-green to-blue-500 rounded-lg blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                                <div className="relative flex items-center bg-black border border-white/10 rounded-lg p-1">
                                    <Terminal className="w-6 h-6 text-neon-green ml-3" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-transparent text-white p-4 focus:outline-none font-mono text-lg placeholder:text-gray-700 uppercase"
                                        placeholder="ENTER YOUR NAME"
                                        autoFocus
                                        autoComplete="off"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!name.trim()}
                                        className="p-2 hover:bg-white/10 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronRight className="w-6 h-6 text-neon-green" />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Step 2: Access Granted */}
                    <AnimatePresence>
                        {step === 2 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center space-y-2"
                            >
                                <div className="text-neon-green text-2xl font-bold tracking-widest animate-pulse">
                                    ACCESS GRANTED
                                </div>
                                <div className="text-gray-500 text-sm">
                                    ESTABLISHING SECURE UPLINK...
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </div>
        </div>
    );
};

// Simple Typewriter Component
const TypewriterText = ({ text, speed = 50 }: { text: string; speed?: number }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                setDisplayedText((prev) => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);
        return () => clearInterval(timer);
    }, [text, speed]);

    return <span>{displayedText}</span>;
};
