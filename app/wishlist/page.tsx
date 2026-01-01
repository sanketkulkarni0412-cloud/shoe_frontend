"use client";

import { useWishlist } from '@/context/WishlistContext';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
    const { wishlist } = useWishlist();

    if (wishlist.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <Heart className="w-16 h-16 text-gray-600 mb-6" />
                <h1 className="text-4xl font-bold mb-4">Your Wishlist is Empty</h1>
                <p className="text-gray-400 mb-8">Save your favorite items here for later.</p>
                <Link href="/products" className="bg-primary hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold transition-colors">
                    Browse Products
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold mb-8 uppercase tracking-wider flex items-center gap-4">
                <Heart className="fill-red-500 text-red-500" /> My Wishlist
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {wishlist.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}
