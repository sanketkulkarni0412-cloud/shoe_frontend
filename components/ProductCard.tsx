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

const ProductCard = ({ product, index = 0 }: { product: Product; index?: number }) => {
    const { user } = useAuth();
    const router = useRouter();
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const isLiked = isInWishlist(product.id);

    const toggleLike = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isLiked) removeFromWishlist(product.id);
        else addToWishlist(product);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group bg-white dark:bg-secondary rounded-xl overflow-hidden border border-border hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 ease-out"
        >
            <Link href={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-100 dark:bg-white/5">
                {product.isSale && (
                    <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full z-20 tracking-wider shadow-lg"
                    >
                        SALE
                    </motion.span>
                )}

                <motion.button
                    onClick={toggleLike}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                    className="absolute top-3 right-3 z-20 p-2.5 rounded-full bg-white/80 dark:bg-black/40 hover:bg-white backdrop-blur-md transition-colors group/heart shadow-sm border border-border dark:border-transparent"
                >
                    <Heart
                        className={`w-5 h-5 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-white group-hover/heart:text-black dark:group-hover/heart:text-black'}`}
                    />
                </motion.button>

                <motion.div
                    className="w-full h-full"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                    <Image
                        src={product.image?.startsWith('http') ? product.image : 'https://placehold.co/600x600?text=No+Image'}
                        alt={product.name}
                        fill
                        className="object-cover"
                    />
                </motion.div>

                {/* Gradient Overlay for Text Readability at Bottom */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 dark:from-black/80 to-transparent opacity-60" />

                {/* Slide Up Add to Cart Button */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-20">
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={(e: React.MouseEvent) => {
                            e.preventDefault();
                            if (!user) {
                                router.push(`/login?redirect=/products/${product.id}`);
                                return;
                            }
                            addToCart(product);
                        }}
                        className="w-full shadow-xl flex items-center justify-center gap-2 hover:bg-primary-hover"
                    >
                        <ShoppingCart className="w-4 h-4" /> Add to Cart
                    </Button>
                </div>
            </Link>

            <div className="p-5 relative bg-white dark:bg-secondary min-h-[140px] flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-1">
                        <p className="text-[10px] uppercase font-bold text-gray-500 tracking-[0.2em]">{product.brand}</p>
                    </div>

                    <Link href={`/products/${product.id}`} className="block">
                        <h3 className="text-black dark:text-white font-medium text-base tracking-wide leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">
                            {product.name}
                        </h3>
                    </Link>
                </div>

                <div className="flex items-baseline gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-white/5 relative z-10">
                    <span className="text-black dark:text-white font-extrabold text-lg tracking-tight">
                        ₹{product.price.toLocaleString('en-IN')}
                    </span>

                    {product.discount > 0 && (
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500 dark:text-gray-400 text-xs line-through font-medium">
                                ₹{product.originalPrice.toLocaleString('en-IN')}
                            </span>
                            <span className="text-white bg-red-600 dark:bg-white dark:text-black text-[10px] font-bold px-1.5 py-0.5 rounded-sm tracking-wide">
                                -{product.discount}%
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
