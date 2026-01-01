"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Mail, MessageSquare } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface NotificationToastProps {
    show: boolean;
    onClose: () => void;
    customerEmail?: string;
    message?: string;
}

export default function NotificationToast({ show, onClose, customerEmail, message }: NotificationToastProps) {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: 50, x: "-50%" }}
                    animate={{ opacity: 1, y: 0, x: "-50%" }}
                    exit={{ opacity: 0, y: 50, x: "-50%" }}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2"
                >
                    <div className="bg-[#0a0a0a] border border-green-500/30 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 min-w-[320px]">
                        <div className="bg-green-500/20 p-2 rounded-full">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-sm">Status Updated & Client Notified</h4>
                            <p className="text-xs text-gray-400 mt-1">Mock notifications sent via:</p>
                            <div className="flex gap-4 mt-2">
                                <span className="flex items-center gap-1 text-xs text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded">
                                    <Mail className="w-3 h-3" /> Email
                                </span>
                                <span className="flex items-center gap-1 text-xs text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded">
                                    <MessageSquare className="w-3 h-3" /> SMS
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
