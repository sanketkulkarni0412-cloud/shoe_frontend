"use client";

import { useCart } from '@/context/CartContext';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

type Product = {
    id: number;
    name: string;
    brand: string;
    price: number;
    image: string;
    discount: number;
    originalPrice: number;
    sizes: number[];
};

export default function ProductInteraction({ product }: { product: Product }) {
    const { addToCart } = useCart();
    const router = useRouter();
    const { user } = useAuth(); // Auth check
    const [selectedSize, setSelectedSize] = useState<number | null>(null);
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

    return (
        <div className="w-full">
            <div className="mb-8">
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
                                    : 'border-white/20 hover:border-primary hover:bg-white/5 text-gray-300'
                                }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex gap-4 border-t border-white/10 pt-6 mt-auto">
                <button
                    onClick={handleAdd}
                    disabled={isAdded}
                    className={`flex-1 py-2.5 rounded-full font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1 ${isAdded
                        ? 'bg-green-600 text-white cursor-default'
                        : 'bg-white text-black hover:bg-gray-200 shadow-lg'
                        }`}
                >
                    <ShoppingCart className="w-4 h-4" />
                    {isAdded ? 'Added' : 'Add to Cart'}
                </button>

                <button
                    onClick={() => {
                        if (!selectedSize) {
                            setError('Please select a size');
                            setTimeout(() => setError(''), 3000);
                            return;
                        }

                        // Guard Buy Now
                        if (!user) {
                            // Optional: Toast message "Please login to continue"
                            router.push('/login?redirect=/checkout');
                            return;
                        }

                        addToCart(product, selectedSize);
                        router.push('/checkout');
                    }}
                    className="flex-1 py-2.5 rounded-full font-bold uppercase tracking-wider text-xs bg-primary hover:bg-red-700 text-white shadow-lg transition-all transform hover:-translate-y-1"
                >
                    Buy Now
                </button>
            </div>
        </div>
    );
}
