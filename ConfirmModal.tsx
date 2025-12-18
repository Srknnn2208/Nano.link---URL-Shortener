import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-gray-900 border border-white/10 rounded-xl p-6 max-w-md w-full shadow-2xl relative overflow-hidden"
                        >
                            {/* Decorative elements */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500" />

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-red-500/10 rounded-full">
                                    <AlertTriangle className="w-6 h-6 text-red-500" />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <h3 className="text-xl font-bold text-white tracking-wide">
                                        {title}
                                    </h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        {message}
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="text-gray-500 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex justify-end gap-3 mt-8">
                                <Button
                                    variant="ghost"
                                    onClick={onClose}
                                    className="text-sm"
                                >
                                    CANCEL
                                </Button>
                                <Button
                                    variant="primary" // Using primary but overriding colors for danger action
                                    onClick={() => {
                                        onConfirm();
                                        onClose();
                                    }}
                                    className="bg-red-500 border-red-500 hover:shadow-[4px_4px_0_#991b1b] text-white text-sm"
                                >
                                    DELETE
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
