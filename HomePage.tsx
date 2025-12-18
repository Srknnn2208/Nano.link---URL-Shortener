import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

export const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [longUrl, setLongUrl] = useState('');
    const [customCode, setCustomCode] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!longUrl || !user) return;

        setLoading(true);
        setError(null);
        try {
            const response = await api.shorten({
                longUrl,
                customCode,
                expiryDate,
                userId: user.id
            });
            navigate('/result', {
                state: {
                    shortUrl: response.shortUrl,
                    originalUrl: longUrl,
                    shortCode: response.shortCode
                }
            });
        } catch (error: any) {
            console.error('Failed to shorten URL', error);
            setError(error.message || 'Failed to create link');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] gap-12">
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-full max-w-2xl"
            >
                <div className="bg-black/20 border border-white/10 p-8 backdrop-blur-sm relative">
                    <div className="absolute -top-3 left-4 bg-black px-2 text-neon-green font-mono text-sm border border-neon-green/30">
                        NEW_LINK_GENERATOR
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                        <div className="space-y-4">
                            <Input
                                label="TARGET URL"
                                placeholder="https://example.com/very/long/url"
                                value={longUrl}
                                onChange={(e) => setLongUrl(e.target.value)}
                                required
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative">
                                    <Input
                                        label="CUSTOM ALIAS"
                                        placeholder="my-link"
                                        value={customCode}
                                        onChange={(e) => setCustomCode(e.target.value)}
                                        className="pl-[100px]"
                                        required
                                        error={error || undefined}
                                    />
                                    <div className="absolute left-3 top-[42px] text-gray-500 font-mono text-sm pointer-events-none">
                                        nano.link/
                                    </div>
                                </div>

                                <div>
                                    <Input
                                        label="EXPIRY DATE (OPTIONAL)"
                                        type="datetime-local"
                                        value={expiryDate}
                                        onChange={(e) => setExpiryDate(e.target.value)}
                                        className="text-gray-300" // Fix for dark mode calendar icon visibility if needed
                                    />
                                    <div className="text-[10px] text-gray-500 font-mono mt-1 text-right">
                                        DEFAULT: 7 DAYS
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'GENERATE SHORT LINK'}
                        </Button>
                    </form>
                </div>
            </motion.div>


        </div>
    );
};
