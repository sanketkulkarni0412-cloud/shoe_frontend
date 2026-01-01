"use client";

import { useCart } from '@/context/CartContext';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';

export default function AddToCartButton({ product }: { product: any }) {
    const { addToCart } = useCart();
    const [isAdded, setIsAdded] = useState(false);

    const handleAdd = () => {
        addToCart(product);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <button
            onClick={handleAdd}
            className={`flex-1 py-4 rounded-full font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all transform hover:scale-105 ${isAdded ? 'bg-green-600 text-white' : 'bg-primary hover:bg-red-700 text-white'
                }`}
        >
            <ShoppingCart className="w-5 h-5" />
            {isAdded ? 'Added to Cart' : 'Add to Cart'}
        </button>
    );
}
