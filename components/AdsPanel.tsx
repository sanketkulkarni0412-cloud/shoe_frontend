"use client";

import { useEffect, useState } from 'react';
import { Timer, Tag, X, ChevronRight, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdsPanel() {
    const [isVisible, setIsVisible] = useState(true);
    const [iscollapsed, setIsCollapsed] = useState(false);
    const [activeAd, setActiveAd] = useState(0);
    const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 59, seconds: 59 });

    const ads = [
        {
            title: "FLASH SALE",
            description: "Get 50% Flat Off on Nike Jordans",
            code: "FLASH50",
            bg: "bg-red-900/20 border-red-500",
            icon: Zap
        },
        {
            title: "NEW ARRIVALS",
            description: "Extra 10% Off on Running Shoes",
            code: "RUN10",
            bg: "bg-blue-900/20 border-blue-500",
            icon: Tag
        },
        {
            title: "WEEKEND DEAL",
            description: "Free Shipping on Orders > ₹2000",
            code: "FREESHIP",
            bg: "bg-green-900/20 border-green-500",
            icon: Timer
        }
    ];

    // Rotate ads
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveAd((prev) => (prev + 1) % ads.length);
        }, 5000); // Rotate every 5 seconds
        return () => clearInterval(interval);
    }, []);

    // Countdown Timer Logic
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return { hours: 2, minutes: 59, seconds: 59 }; // Reset loop
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Default collapse on mobile
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) setIsCollapsed(true);
            else setIsCollapsed(false);
        };
        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!isVisible) return null;

    // Collapsed State
    if (iscollapsed) {
        return (
            <button
                onClick={() => setIsCollapsed(false)}
                className="fixed right-0 top-32 z-40 bg-primary text-white p-2 rounded-l-lg shadow-[0_0_15px_rgba(230,0,0,0.5)] transition-all hover:pl-4 flex items-center gap-2"
                aria-label="Show Offers"
            >
                <Tag className="w-5 h-5 animate-pulse" />
                <span className="md:hidden font-bold text-xs writing-vertical-lr transform rotate-180">OFFERS</span>
            </button>
        );
    }

    return (
        <aside className="fixed right-0 top-24 bottom-auto z-30 w-[85vw] md:w-full max-w-[300px] p-4 block transition-all duration-300">
            {/* Mobile: Would be different, but prompt asked for sidebar. On mobile sidebars are tricky. 
                We will make it a floating widget on mobile or bottom sheet? 
                For now, let's keep it sticky on right for desktop, and maybe bottom fixed for mobile?
                Let's stick to Right Panel, but make it responsive 'collapsible' as requested.
             */}

            <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl relative overflow-hidden group">
                {/* Close/Collapse Controls */}
                <div className="absolute top-2 right-2 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setIsCollapsed(true)} className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                    <button onClick={() => setIsVisible(false)} className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Rotating Content */}
                <div className="relative min-h-[160px] flex flex-col justify-center text-center">
                    {/* Background Glow */}
                    <div className={`absolute inset-0 opacity-20 transition-colors duration-1000 ${ads[activeAd].bg.split(' ')[0]}`} />

                    <div className="relative z-10 transition-all duration-500 transform">
                        <div className="flex justify-center mb-2">
                            {/* Icon */}
                            {(() => {
                                const Icon = ads[activeAd].icon;
                                return <Icon className="w-8 h-8 text-white" />;
                            })()}
                        </div>

                        <h3 className="text-xl font-bold italic tracking-wider text-white mb-1 animate-fade-in">
                            {ads[activeAd].title}
                        </h3>

                        <p className="text-gray-300 text-sm mb-3 h-10 flex items-center justify-center">
                            {ads[activeAd].description}
                        </p>

                        <div className="bg-white/10 p-2 rounded border border-white/20 mx-4 cursor-pointer hover:bg-white/20 transition-colors"
                            onClick={() => {
                                navigator.clipboard.writeText(ads[activeAd].code);
                                alert('Coupon copied: ' + ads[activeAd].code);
                            }}>
                            <span className="font-mono font-bold text-primary tracking-widest">{ads[activeAd].code}</span>
                        </div>
                    </div>
                </div>

                {/* Timer Footnote */}
                <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-xs text-gray-400">
                    <span>Ends in:</span>
                    <span className="font-mono text-white font-bold text-sm bg-red-600/20 px-2 py-0.5 rounded">
                        {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                </div>
            </div>
        </aside>
    );
}
