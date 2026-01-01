"use client";

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const TopMarquee = () => {
    const [offers, setOffers] = useState([
        "🚀 FREE SHIPPING ON ORDERS OVER ₹2999",
        "⚡ EXTRA 10% OFF WITH CREDIT CARDS"
    ]);

    useEffect(() => {
        import('firebase/firestore').then(async ({ doc, getDoc, getFirestore }) => {
            try {
                const db = getFirestore();
                const docRef = doc(db, "settings", "promotions");
                const snapshot = await getDoc(docRef);
                if (snapshot.exists()) {
                    const data = snapshot.data().marquee;
                    if (data) {
                        setOffers([data.text1, data.text2, data.text3, data.text4].filter(Boolean));
                    }
                }
            } catch (e) { console.error(e); }
        });
    }, []);

    return (
        <div className="bg-primary text-white py-1.5 overflow-hidden border-b border-red-800 z-[60] relative">
            <div className="flex whitespace-nowrap">
                <motion.div
                    animate={{ x: [0, -1000] }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 20,
                    }}
                    className="flex items-center gap-8 text-xs font-bold tracking-widest px-4"
                >
                    {[...offers, ...offers, ...offers].map((offer, index) => (
                        <span key={index} className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-white rounded-full opacity-50"></span>
                            {offer}
                        </span>
                    ))}
                </motion.div>
                {/* Duplicate for seamless loop */}
                <motion.div
                    animate={{ x: [0, -1000] }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 20,
                    }}
                    className="flex items-center gap-8 text-xs font-bold tracking-widest px-4"
                >
                    {[...offers, ...offers, ...offers].map((offer, index) => (
                        <span key={index} className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-white rounded-full opacity-50"></span>
                            {offer}
                        </span>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default TopMarquee;
