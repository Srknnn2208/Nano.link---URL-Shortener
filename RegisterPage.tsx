import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Terminal, UserPlus, Eye, EyeOff } from 'lucide-react';

export const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const user = await api.auth.register({ username, password });
            login(user);
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-black text-white font-mono">
            <div className="max-w-md w-full space-y-8 z-10">
                <div className="text-center">
                    <Terminal className="mx-auto h-12 w-12 text-neon-green" />
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-white tracking-widest">
                        NEW_USER_ENTRY
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="sr-only">Username</label>
                            <input
                                type="text"
                                required
                                className="appearance-none relative block w-full px-3 py-3 border border-gray-700 bg-black/50 placeholder-gray-500 text-neon-green focus:outline-none focus:border-neon-green focus:ring-1 focus:ring-neon-green transition-all duration-300 hover:shadow-[0_0_15px_rgba(57,255,20,0.3)] hover:border-neon-green focus:shadow-[0_0_20px_rgba(57,255,20,0.5)] sm:text-sm rounded-md"
                                placeholder="CHOOSE_USERNAME"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <label className="sr-only">Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                className="appearance-none relative block w-full px-3 py-3 border border-gray-700 bg-black/50 placeholder-gray-500 text-neon-green focus:outline-none focus:border-neon-green focus:ring-1 focus:ring-neon-green transition-all duration-300 hover:shadow-[0_0_15px_rgba(57,255,20,0.3)] hover:border-neon-green focus:shadow-[0_0_20px_rgba(57,255,20,0.5)] sm:text-sm rounded-md"
                                placeholder="CHOOSE_PASSWORD"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-neon-green transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-500/10 p-2 border border-red-500/20">
                            {error.toUpperCase()}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium text-black bg-neon-green hover:bg-neon-green/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon-green transition-colors"
                        >
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                <UserPlus className="h-5 w-5 text-black/50 group-hover:text-black" />
                            </span>
                            INITIALIZE_ACCOUNT
                        </button>
                    </div>
                    <div className="text-center text-sm">
                        <Link to="/login" className="text-gray-500 hover:text-neon-green transition-colors">
                            EXISTING_USER? <span className="underline">LOGIN</span>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};
