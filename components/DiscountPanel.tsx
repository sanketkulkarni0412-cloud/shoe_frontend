"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { X, Clock, Tag } from 'lucide-react';
import Button from './ui/Button';

const DiscountPanel = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [settings, setSettings] = useState({
        title: "Get Extra 20% OFF",
        code: "SHOE20",
        percentage: "20",
        timerHours: 12
    });
    const [timeLeft, setTimeLeft] = useState({
        hours: 12,
        minutes: 45,
        seconds: 30
    });

    // Fetch Settings
    useEffect(() => {
        import('firebase/firestore').then(async ({ doc, getDoc, getFirestore }) => {
            const db = getFirestore();
            const snap = await getDoc(doc(db, "settings", "promotions"));
            if (snap.exists() && snap.data().discountPanel) {
                setSettings(prev => ({ ...prev, ...snap.data().discountPanel }));
                setTimeLeft({ hours: snap.data().discountPanel.timerHours || 12, minutes: 0, seconds: 0 });
            }
        });
    }, []);

    // Show after 3 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    // Countdown logic
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (val: number) => val.toString().padStart(2, '0');

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 100, opacity: 0 }}
                    className="fixed right-4 bottom-4 md:top-32 md:bottom-auto z-40 max-w-xs w-full"
                >
                    <div className="bg-gradient-to-br from-red-900 to-black p-1 rounded-2xl shadow-2xl border border-white/10">
                        <div className="bg-secondary/90 backdrop-blur-md p-5 rounded-xl relative overflow-hidden">
                            {/* Decorative background */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2"></div>

                            <button
                                onClick={() => setIsVisible(false)}
                                className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            <div className="flex items-center gap-2 mb-2 text-primary">
                                <Tag className="w-5 h-5" />
                                <span className="font-bold text-xs tracking-widest uppercase">Special Offer</span>
                            </div>

                            <h3 className="text-white font-bold text-xl mb-2 leading-tight">
                                {settings.title.split(settings.percentage + '%').length > 1 ? (
                                    <>
                                        {settings.title.split(settings.percentage + '%')[0]}
                                        <span className="text-primary text-2xl">{settings.percentage}% OFF</span>
                                        {settings.title.split(settings.percentage + '%')[1]}
                                    </>
                                ) : (
                                    settings.title
                                )}
                            </h3>
                            <p className="text-gray-400 text-xs mb-4">
                                Use code <span className="text-white font-mono bg-white/10 px-1 rounded">{settings.code}</span> at checkout.
                            </p>

                            <div className="flex items-center gap-2 bg-black/40 p-2 rounded-lg mb-4 justify-center">
                                <Clock className="w-4 h-4 text-primary" />
                                <div className="text-white font-mono font-bold text-sm tracking-widest">
                                    {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
                                </div>
                            </div>

                            <Button
                                variant="primary"
                                size="sm"
                                className="w-full shadow-lg shadow-primary/20"
                                onClick={() => setIsVisible(false)}
                            >
                                Claim Offer Now
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default DiscountPanel;
