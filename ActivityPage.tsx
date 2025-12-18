import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { ActivityLog } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Clock, BarChart2, Trash2, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { FlipCounter } from '../components/ui/FlipCounter';
import { useAuth } from '../context/AuthContext';

export const ActivityPage: React.FC = () => {
    const { user } = useAuth();
    const [activities, setActivities] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; linkId: string | null }>({
        isOpen: false,
        linkId: null
    });

    const copyToClipboard = async (text: string, id: string) => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                // Fallback for non-secure contexts (like http://nano.link)
                const textArea = document.createElement("textarea");
                textArea.value = text;
                textArea.style.position = "fixed";
                textArea.style.left = "-9999px";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                try {
                    document.execCommand('copy');
                } catch (err) {
                    console.error('Fallback copy failed', err);
                    return;
                }
                document.body.removeChild(textArea);
            }

            setCopiedStates(prev => ({ ...prev, [id]: true }));
            setTimeout(() => {
                setCopiedStates(prev => ({ ...prev, [id]: false }));
            }, 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    const fetchActivity = async () => {
        if (!user) return;
        try {
            const data = await api.getActivity(user.id);
            // Only update if data changed (to avoid jitter, though React handles diffs well)
            // For flip counter, we just pass the new numbers.
            setActivities(prev => {
                // Determine if we should update specific items or all
                // Simple equality check usually insufficient for arrays, but direct set is fine for this size
                return data;
            });
        } catch (error) {
            console.error('Failed to fetch activity', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivity();

        // Polling for Real-Time Updates (every 2 seconds)
        const interval = setInterval(() => {
            fetchActivity();
        }, 2000);

        return () => clearInterval(interval);
    }, [user]);

    const handleDelete = async () => {
        if (deleteModal.linkId) {
            await api.deleteActivity(deleteModal.linkId);
            setActivities(prev => prev.filter(a => a.id !== deleteModal.linkId));
            setDeleteModal({ isOpen: false, linkId: null });
        }
    };

    return (
        <div className="space-y-8">
            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, linkId: null })}
                onConfirm={handleDelete}
                title="DELETE LINK?"
                message="This action cannot be undone. The link will stop working immediately."
            />

            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h1 className="text-2xl font-bold text-white tracking-[0.2em] flex items-center gap-3">
                    <BarChart2 className="text-electric-magenta" />
                    USER_ACTIVITY_LOG
                </h1>
                <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
                    <span>TOTAL: <span className="text-neon-green">{activities.length}</span></span>
                </div>
            </div>

            {loading && activities.length === 0 ? (
                <div className="text-center py-20 font-mono text-neon-green animate-pulse">
                    LOADING_DATA_STREAM...
                </div>
            ) : (
                <div className="overflow-x-auto pb-10"> {/* Added padding bottom for flip card overflow */}
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-white/20 text-gray-400 font-mono text-sm tracking-wider">
                                <th className="p-4">SHORT_CODE</th>
                                <th className="p-4">TARGET_URL</th>
                                <th className="p-4 text-right">CLICKS</th>
                                <th className="p-4">EXPIRY</th>
                                <th className="p-4 text-right">STATUS</th>
                                <th className="p-4 text-right">ACTION</th>
                            </tr>
                        </thead>
                        <tbody className="font-mono text-sm">
                            {activities.map((log, index) => {
                                const isExpired = new Date(log.expiryDate) < new Date();
                                const status = isExpired ? 'EXPIRED' : (log.isActive ? 'ACTIVE' : 'EXPIRED');

                                return (
                                    <React.Fragment key={log.id}>
                                        <motion.tr
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer"
                                            onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                                        >
                                            <td className="p-4 text-neon-green font-bold">
                                                {log.shortCode}
                                            </td>
                                            <td className="p-4 max-w-xs truncate text-gray-300 group-hover:text-white transition-colors">
                                                <a href={log.longUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline" onClick={(e) => e.stopPropagation()}>
                                                    {log.longUrl}
                                                    <ExternalLink size={12} className="opacity-50" />
                                                </a>
                                            </td>
                                            <td className="p-4 text-right flex justify-end">
                                                {/* Flip Counter Implementation */}
                                                <FlipCounter value={log.clicks} />
                                            </td>
                                            <td className="p-4 text-gray-400">
                                                <div className="flex items-center gap-2">
                                                    <Clock size={14} />
                                                    {new Date(log.expiryDate).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <span className={`px-2 py-1 text-xs font-bold border ${status === 'ACTIVE' ? 'border-neon-green text-neon-green bg-neon-green/10' : 'border-red-500 text-red-500 bg-red-500/10'}`}>
                                                    {status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setDeleteModal({ isOpen: true, linkId: log.id }); }}
                                                        className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                                                        title="Delete Link"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                    <button className="p-2 text-neon-green hover:bg-neon-green/10 rounded-lg transition-colors">
                                                        {expandedId === log.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                        <AnimatePresence>
                                            {expandedId === log.id && (
                                                <motion.tr
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="bg-white/5 border-b border-white/10"
                                                >
                                                    <td colSpan={6} className="p-6">
                                                        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start" onClick={(e) => e.stopPropagation()}>
                                                            <div className="bg-white p-4 rounded-lg shadow-lg shadow-neon-green/20">
                                                                <img
                                                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(log.longUrl)}`}
                                                                    alt="QR Code"
                                                                    className="w-32 h-32"
                                                                />
                                                                <div className="mt-2 text-center text-black font-bold text-xs font-mono tracking-widest">
                                                                    SCAN_ME
                                                                </div>
                                                            </div>
                                                            <div className="flex-1 space-y-4 w-full">
                                                                <div>
                                                                    <label className="block text-xs font-mono text-gray-500 mb-1">SHORT_LINK</label>
                                                                    <div className="flex items-center gap-2 bg-black/50 p-3 rounded border border-white/10">
                                                                        <a
                                                                            href={`http://nano.link:5173/${log.shortCode}`}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="flex-1 text-neon-green font-mono hover:underline truncate"
                                                                        >
                                                                            {`http://nano.link:5173/${log.shortCode}`}
                                                                        </a>
                                                                        <button
                                                                            onClick={() => copyToClipboard(`http://nano.link:5173/${log.shortCode}`, `short_${log.id}`)}
                                                                            className="p-2 hover:text-white text-gray-400 transition-colors"
                                                                            title="Copy Link"
                                                                        >
                                                                            {copiedStates[`short_${log.id}`] ? <Check size={16} className="text-neon-green" /> : <Copy size={16} />}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <label className="block text-xs font-mono text-gray-500 mb-1">TARGET_DESTINATION</label>
                                                                    <div className="flex items-center gap-2 bg-black/50 p-3 rounded border border-white/10">
                                                                        <a
                                                                            href={log.longUrl}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="flex-1 text-gray-300 font-mono hover:text-white transition-colors truncate hover:underline"
                                                                        >
                                                                            {log.longUrl}
                                                                        </a>
                                                                        <button
                                                                            onClick={() => copyToClipboard(log.longUrl, `long_${log.id}`)}
                                                                            className="p-2 hover:text-white text-gray-400 transition-colors"
                                                                            title="Copy URL"
                                                                        >
                                                                            {copiedStates[`long_${log.id}`] ? <Check size={16} className="text-neon-green" /> : <Copy size={16} />}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            )}
                                        </AnimatePresence>
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
