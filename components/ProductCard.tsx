"use client";

import { motion } from 'framer-motion';
import { ShoppingCart, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import Button from './ui/Button';

interface Product {
    id: number;
    name: string;
    brand: string;
    price: number;
    originalPrice: number;
    discount: number;
    image: string;
    isSale: boolean;
}

const ProductCard = ({ product }: { product: Product }) => {
    // ... hooks
    const { user } = useAuth();
    const router = useRouter();
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const isLiked = isInWishlist(product.id);

    const toggleLike = (e: React.MouseEvent) => {
        // ... logic
        e.preventDefault();
        e.stopPropagation();
        if (isLiked) removeFromWishlist(product.id);
        else addToWishlist(product);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -10 }}
            transition={{ duration: 0.3 }}
            className="group bg-secondary rounded-lg overflow-hidden border border-white/5 hover:border-primary/50 transition-colors duration-300"
        >
            <Link href={`/products/${product.id}`} className="block relative aspect-square overflow-hidden">
                {product.isSale && (
                    <span className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded z-10">
                        SALE
                    </span>
                )}
                {/* ... Heart Button ... */}
                <button
                    onClick={toggleLike}
                    className="absolute top-2 right-2 z-10 p-2 rounded-full bg-black/20 hover:bg-white/20 backdrop-blur-sm transition-colors text-white hover:text-red-500"
                >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                </button>

                <Image
                    src={product.image?.startsWith('http') ? product.image : 'https://placehold.co/600x600?text=No+Image'}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Overlay Add to Cart Button */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none group-hover:pointer-events-auto">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e: React.MouseEvent) => {
                            e.preventDefault();
                            if (!user) {
                                router.push(`/login?redirect=/products/${product.id}`);
                                return;
                            }
                            addToCart(product);
                        }}
                        className="transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 gap-2 shadow-xl"
                    >
                        <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                    </Button>
                </div>
            </Link>

            <div className="p-4">
                <p className="text-muted text-[10px] uppercase tracking-wider mb-1">{product.brand}</p>
                <Link href={`/products/${product.id}`}>
                    <h3 className="text-white font-bold text-base mb-2 group-hover:text-primary transition-colors truncate">
                        {product.name}
                    </h3>
                </Link>
                <div className="flex items-center gap-2 mt-4">
                    <span className="text-white font-bold text-base">₹{product.price.toLocaleString('en-IN')}</span>
                    {product.discount > 0 && (
                        <span className="text-muted text-xs line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                    )}
                    {product.discount > 0 && (
                        <span className="text-primary text-[10px] font-bold bg-primary/10 px-1.5 py-0.5 rounded">-{product.discount}%</span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
