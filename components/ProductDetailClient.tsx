"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Star, ShoppingCart, Truck, ShieldCheck, Heart, X, ZoomIn } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import ProductReviews from '@/components/ProductReviews';
import { motion, AnimatePresence } from 'framer-motion';

type Product = {
    id: number;
    name: string;
    brand: string;
    price: number;
    image: string;
    discount: number;
    originalPrice: number;
    sizes: number[];
    description: string;
    isSale: boolean;
};

export default function ProductDetailClient({ product }: { product: Product }) {
    const { addToCart } = useCart();
    const router = useRouter();
    const { user } = useAuth();

    // State
    const [selectedSize, setSelectedSize] = useState<number | null>(null);

    // Lightbox State
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    // We no longer switch the image source. We keep the base product image.
    // The visual color change is handled via CSS overlay.
    const baseImage = product.image;

    // Handle Esc key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsLightboxOpen(false);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    // Interaction State
    const [isAdded, setIsAdded] = useState(false);
    const [error, setError] = useState('');

    const handleAdd = () => {
        if (!user) {
            router.push(`/login?redirect=/products/${product.id}`);
            return;
        }

        if (!selectedSize) {
            setError('Please select a size');
            setTimeout(() => setError(''), 3000);
            return;
        }

        addToCart(product, selectedSize);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const handleBuyNow = () => {
        if (!user) {
            router.push(`/login?redirect=/products/${product.id}`);
            return;
        }

        if (!selectedSize) {
            setError('Please select a size');
            setTimeout(() => setError(''), 3000);
            return;
        }

        addToCart(product, selectedSize);
        router.push('/checkout');
    };

    return (
        <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <Link href="/products" className="inline-flex items-center gap-2 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Products
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Image Section - Animated Transition */}
                    <div
                        className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-secondary border border-gray-200 dark:border-white/10 group cursor-zoom-in"
                        onClick={() => setIsLightboxOpen(true)}
                    >
                        {product.isSale && (
                            <span className="absolute top-4 left-4 bg-primary text-white font-bold px-4 py-2 rounded z-10">
                                SALE
                            </span>
                        )}
                        <Image
                            src={baseImage}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            priority
                        />

                        <div className="absolute inset-0 bg-black/20 dark:bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                            <ZoomIn className="w-12 h-12 text-white" />
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="flex flex-col justify-center">
                        <h2 className="text-primary font-bold uppercase tracking-wider mb-2">{product.brand}</h2>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">{product.name}</h1>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex text-yellow-500">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-current" />
                                ))}
                            </div>
                            <span className="text-gray-500 dark:text-gray-400">(128 reviews)</span>
                        </div>

                        <div className="flex items-center gap-4 mb-8">
                            <span className="text-3xl font-bold">₹{product.price.toLocaleString('en-IN')}</span>
                            {product.discount > 0 && (
                                <>
                                    <span className="text-xl text-gray-400 dark:text-gray-500 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                                    <span className="bg-primary/20 text-primary px-2 py-1 rounded text-sm font-bold">-{product.discount}%</span>
                                </>
                            )}
                        </div>

                        <div className="space-y-6 mb-8">
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                                {product.description}
                            </p>

                            {/* Size Selection */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-bold">Select Size</h3>
                                    {error && <span className="text-red-500 text-sm font-bold animate-pulse">{error}</span>}
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {product.sizes.map((size: number) => (
                                        <button
                                            key={size}
                                            onClick={() => {
                                                setSelectedSize(size);
                                                setError('');
                                            }}
                                            className={`w-12 h-12 rounded border transition-all flex items-center justify-center font-bold text-lg
                                                ${selectedSize === size
                                                    ? 'bg-primary border-primary text-white scale-110 shadow-[0_0_15px_rgba(230,0,0,0.5)]'
                                                    : 'border-gray-200 dark:border-white/20 hover:border-primary hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 border-t border-gray-200 dark:border-white/10 pt-6 mt-8">
                                <button
                                    onClick={handleAdd}
                                    disabled={isAdded}
                                    className={`flex-1 py-3 rounded-full font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1 ${isAdded
                                        ? 'bg-green-600 text-white cursor-default'
                                        : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 shadow-lg'
                                        }`}
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    {isAdded ? 'Added' : 'Add to Cart'}
                                </button>

                                <button
                                    onClick={handleBuyNow}
                                    className="flex-1 py-3 rounded-full font-bold uppercase tracking-wider text-sm bg-primary hover:bg-red-700 text-white shadow-lg transition-all transform hover:-translate-y-1"
                                >
                                    Buy Now
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-8">
                                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                                    <Truck className="w-5 h-5 text-primary" />
                                    <span>Free Shipping</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                                    <ShieldCheck className="w-5 h-5 text-primary" />
                                    <span>2 Year Warranty</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-16 border-t border-gray-200 dark:border-white/10">
                    <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
                    <ProductReviews productId={product.id.toString()} />
                </div>
            </div>

            {/* Lightbox Overlay */}
            <AnimatePresence>
                {isLightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
                        onClick={() => setIsLightboxOpen(false)}
                    >
                        <button
                            className="absolute top-4 right-4 text-white hover:text-red-500 transition-colors z-50 p-2"
                            onClick={() => setIsLightboxOpen(false)}
                        >
                            <X className="w-10 h-10" />
                        </button>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="relative w-full max-w-5xl h-[80vh] sm:h-[90vh]"
                            onClick={(e) => e.stopPropagation()} // Prevent close on image click
                        >
                            <Image
                                src={baseImage}
                                alt={product.name}
                                fill
                                className="object-contain"
                                priority
                                quality={100}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
