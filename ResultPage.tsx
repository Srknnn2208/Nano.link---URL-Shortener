import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Copy, Check, Sparkles, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ResultPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { shortUrl, originalUrl, shortCode } = location.state || {};
    const [copied, setCopied] = useState(false);
    const [showQr, setShowQr] = useState(false);

    useEffect(() => {
        if (!shortUrl || !originalUrl) {
            navigate('/');
        }
    }, [shortUrl, originalUrl, navigate]);

    // Construct the functional URL dynamically to include the correct port
    const port = window.location.port ? `:${window.location.port}` : '';
    const functionalUrl = `http://nano.link${port}/${shortCode}`;

    const handleCopy = async () => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(functionalUrl);
            } else {
                // Fallback for non-secure contexts (like http://nano.link)
                const textArea = document.createElement("textarea");
                textArea.value = functionalUrl;
                textArea.style.position = "fixed";
                textArea.style.left = "-9999px";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                try {
                    document.execCommand('copy');
                } catch (err) {
                    console.error('Fallback copy failed', err);
                }
                document.body.removeChild(textArea);
            }
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    if (!shortUrl || !originalUrl) return null;

    // Construct QR code URL using a public API for simplicity in this frontend-only demo
    // In a real app, we might generate this locally or via backend
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(originalUrl)}`;

    return (
        <div className="max-w-2xl mx-auto space-y-8 p-6">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-white tracking-wider">
                    Your link is ready!
                </h1>
                <p className="text-gray-400">
                    Share your link with the world.
                </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 space-y-6 relative overflow-hidden">
                <div className="space-y-2">
                    <label className="text-xs font-mono text-gray-500">GENERATED_UPLINK</label>
                    <div className="flex items-center gap-2 bg-black/50 p-4 rounded-lg border border-white/10 group hover:border-neon-green/50 transition-colors">
                        <span className="flex-1 font-mono text-lg text-neon-green truncate">
                            {functionalUrl.replace(/^https?:\/\//, '')}
                        </span>
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded-lg transition-colors relative"
                            title="Copy to clipboard"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-5 h-5 text-neon-green" />
                                    <span className="text-sm text-neon-green font-medium">COPIED</span>
                                </>
                            ) : (
                                <Copy className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                            )}
                        </button>
                    </div>
                </div>

                <div className="flex justify-center">
                    <div className="relative w-64 h-64 rounded-xl overflow-hidden bg-white p-4">
                        {/* QR Code */}
                        <img
                            src={qrCodeUrl}
                            alt="QR Code"
                            className="w-full h-full object-contain"
                        />

                        {/* Sparkle Cover */}
                        <AnimatePresence>
                            {!showQr && (
                                <motion.div
                                    initial={{ opacity: 1 }}
                                    exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                                    transition={{ duration: 0.5 }}
                                    className="absolute inset-0 bg-gradient-to-br from-black via-green-900 to-black flex flex-col items-center justify-center z-10 border border-white/10"
                                >
                                    <div className="absolute inset-0 opacity-50">
                                        {[...Array(20)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className="absolute bg-white rounded-full"
                                                initial={{
                                                    top: `${Math.random() * 100}%`,
                                                    left: `${Math.random() * 100}%`,
                                                    width: Math.random() * 4 + 2,
                                                    height: Math.random() * 4 + 2,
                                                    opacity: Math.random() * 0.5 + 0.3,
                                                }}
                                                animate={{
                                                    opacity: [0.3, 1, 0.3],
                                                    scale: [1, 1.5, 1],
                                                }}
                                                transition={{
                                                    duration: Math.random() * 2 + 1,
                                                    repeat: Infinity,
                                                    ease: "easeInOut",
                                                }}
                                            />
                                        ))}
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setShowQr(true)}
                                        className="relative z-20 flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white font-semibold hover:bg-white/20 transition-all shadow-lg group"
                                    >
                                        <QrCode className="w-5 h-5" />
                                        <span>Get QR</span>
                                        <Sparkles className="w-4 h-4 text-yellow-300 group-hover:rotate-12 transition-transform" />
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="text-sm text-gray-400 hover:text-white transition-colors underline decoration-dotted"
                    >
                        Create another link
                    </button>
                </div>
            </div>
        </div>
    );
};
