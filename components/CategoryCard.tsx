"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';

interface CategoryCardProps {
    category: string;
    index: number;
}

export default function CategoryCard({ category, index }: CategoryCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <Link href={`/products?category=${category}`}>
                <motion.div
                    className="group relative h-40 overflow-hidden rounded-lg border border-white/10 block cursor-pointer"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    {/* Glow Effect Container */}
                    <motion.div
                        className="absolute -inset-1 bg-primary/20 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300"
                        layoutId={`glow-${category}`}
                    />

                    {/* Background Image - Red Shoe */}
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center opacity-40 grayscale group-hover:grayscale-0 transition-all duration-500 ease-out" />

                    {/* Highlight Overlay on Hover */}
                    <motion.div
                        className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />

                    {/* Overlay for text legibility - White/Green in Light, Dark in Dark */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-green-50/90 dark:bg-none dark:bg-black/60 transition-all duration-300" />

                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <motion.span
                            className="text-xl font-bold uppercase tracking-wider text-black dark:text-white group-hover:text-primary transition-colors"
                            whileHover={{ y: -2, textShadow: "0px 0px 8px rgba(22, 163, 74, 0.5)" }}
                        >
                            {category}
                        </motion.span>
                    </div>
                </motion.div>
            </Link>
        </motion.div>
    );
}
