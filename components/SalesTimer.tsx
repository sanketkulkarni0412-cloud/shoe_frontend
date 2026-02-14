"use client";

import { useEffect, useState } from 'react';

const SalesTimer = () => {
    const [mounted, setMounted] = useState(false);
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        setMounted(true);
        // Set a date 2 days from now
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 2);

        const interval = setInterval(() => {
            const now = new Date();
            const difference = targetDate.getTime() - now.getTime();

            if (difference <= 0) {
                clearInterval(interval);
            } else {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);

                setTimeLeft({ days, hours, minutes, seconds });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    if (!mounted) return null;

    return (
        <div className="flex gap-4 text-center">
            {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="bg-white/80 dark:bg-black/50 backdrop-blur-sm border border-black/10 dark:border-primary/30 p-2 min-w-[70px] rounded shadow-sm">
                    <div className="text-2xl font-bold text-black dark:text-primary">{String(value).padStart(2, '0')}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest">{unit}</div>
                </div>
            ))}
        </div>
    );
};

export default SalesTimer;
