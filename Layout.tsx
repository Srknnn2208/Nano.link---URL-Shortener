import React from 'react';
import { Header } from './Header';
import { motion } from 'framer-motion';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 pt-20 px-4 pb-12 w-full max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {children}
                </motion.div>
            </main>

            <footer className="py-6 text-center text-gray-800 text-xs font-mono">
                SYSTEM_STATUS: <span className="text-neon-green">ONLINE</span> | V.1.0.0
            </footer>
        </div>
    );
};
