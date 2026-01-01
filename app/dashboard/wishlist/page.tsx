"use client";

import { Trash2, ShoppingCart, Heart } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { useWishlist } from '@/context/WishlistContext';

export default function DashboardWishlist() {
    const { wishlist, removeFromWishlist, moveToCart } = useWishlist();

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-6"
        >
            <h1 className="text-2xl font-bold text-foreground">My Wishlist</h1>

            {wishlist.length === 0 ? (
                <div className="bg-secondary border border-white/5 rounded-xl p-10 text-center">
                    <Heart className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white">Your wishlist is empty</h3>
                    <p className="text-gray-400 mt-2 mb-6">Save items you like to keep track of them.</p>
                    <Link href="/products">
                        <Button>Browse Products</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05, duration: 0.3 }}
                            whileHover={{ y: -5 }}
                            className="bg-secondary border border-white/5 rounded-xl overflow-hidden group shadow-lg shadow-black/20"
                        >
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => moveToCart(item)}
                                        className="p-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
                                        title="Move to Cart"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => removeFromWishlist(item.id)}
                                        className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                                        title="Remove"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg text-white mb-1 line-clamp-1">{item.name}</h3>
                                <p className="text-primary font-bold">${item.price}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
