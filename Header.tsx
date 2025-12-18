import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/Button';

export const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="text-2xl font-bold tracking-tighter text-white">
                        NANO<span className="text-neon-green">.LINK</span>
                    </div>

                    {user && (
                        <nav className="hidden md:flex items-center gap-4 ml-8">
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    `text-sm font-mono tracking-widest hover:text-neon-green transition-colors ${isActive ? 'text-neon-green text-shadow-neon' : 'text-gray-400'}`
                                }
                            >
                                HOME
                            </NavLink>
                            <span className="text-gray-600">|</span>
                            <NavLink
                                to="/activity"
                                className={({ isActive }) =>
                                    `text-sm font-mono tracking-widest hover:text-neon-green transition-colors ${isActive ? 'text-neon-green text-shadow-neon' : 'text-gray-400'}`
                                }
                            >
                                ACTIVITY
                            </NavLink>
                        </nav>
                    )}
                </div>

                {user && (
                    <div className="flex items-center gap-6">
                        <div className="hidden md:block font-mono text-xs text-electric-magenta">
                            USER: <span className="text-white">{user.username}</span>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleLogout}>
                            LOGOUT
                        </Button>
                    </div>
                )}
            </div>
        </header>
    );
};
