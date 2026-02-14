"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const priceRanges = [
    { label: "Under ₹4,999", min: 0, max: 4999 },
    { label: "₹5,000 - ₹9,999", min: 5000, max: 9999 },
    { label: "₹10,000 - ₹14,999", min: 10000, max: 14999 },
    { label: "₹15,000 and above", min: 15000, max: 1000000 },
];

export default function PriceFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedRange, setSelectedRange] = useState<string | null>(null);

    // Sync state with URL
    useEffect(() => {
        const min = searchParams.get("minPrice");
        const max = searchParams.get("maxPrice");

        if (min !== null && max !== null) {
            const found = priceRanges.find(r => r.min.toString() === min && r.max.toString() === max);
            if (found) setSelectedRange(found.label);
            else setSelectedRange("Custom");
        } else {
            setSelectedRange(null);
        }
    }, [searchParams]);

    const handleSelect = (range: typeof priceRanges[0]) => {
        const params = new URLSearchParams(searchParams.toString());

        // Toggle off if clicking the same one
        if (selectedRange === range.label) {
            params.delete("minPrice");
            params.delete("maxPrice");
            setSelectedRange(null);
        } else {
            params.set("minPrice", range.min.toString());
            params.set("maxPrice", range.max.toString());
            setSelectedRange(range.label);
        }

        router.push(`/products?${params.toString()}`);
    };

    return (
        <div className="bg-gray-100 dark:bg-secondary/50 p-6 rounded-xl border border-gray-200 dark:border-white/5 backdrop-blur-sm transition-colors">
            <h3 className="text-lg font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                Shop by Price
                {selectedRange && <span className="text-primary text-xs ml-auto cursor-pointer hover:text-red-700 dark:hover:text-white" onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.delete("minPrice");
                    params.delete("maxPrice");
                    router.push(`/products?${params.toString()}`);
                }}>Clear</span>}
            </h3>
            <div className="space-y-2">
                {priceRanges.map((range) => (
                    <motion.button
                        key={range.label}
                        onClick={() => handleSelect(range)}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between group ${selectedRange === range.label
                            ? "bg-primary text-white font-bold shadow-lg shadow-primary/20"
                            : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/5"
                            }`}
                    >
                        {range.label}
                        {selectedRange === range.label && (
                            <motion.div layoutId="active-price" className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
