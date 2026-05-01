"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useCart } from './CartContext';

type Product = {
    id: number;
    name: string;
    brand: string;
    price: number;
    originalPrice: number;
    discount: number;
    image: string;
    isSale: boolean;
};

type WishlistContextType = {
    wishlist: Product[];
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (productId: number) => void;
    moveToCart: (product: Product) => void;
    isInWishlist: (productId: number) => boolean;
    wishlistCount: number;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
    const [wishlist, setWishlist] = useState<Product[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
            setWishlist(JSON.parse(savedWishlist));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const { addToCart } = useCart();

    const addToWishlist = (product: Product) => {
        setWishlist((prev) => {
            if (prev.some(item => item.id === product.id)) return prev;
            return [...prev, product];
        });
    };

    const removeFromWishlist = (productId: number) => {
        setWishlist((prev) => prev.filter(item => item.id !== productId));
    };

    const moveToCart = (product: Product) => {
        // Adapt Wishlist Product to Cart Product if necessary
        // Cart Context adds quantity: 1 internally
        addToCart(product);
        removeFromWishlist(product.id);
    };

    const isInWishlist = (productId: number) => {
        return wishlist.some(item => item.id === productId);
    };

    return (
        <WishlistContext.Provider value={{
            wishlist,
            addToWishlist,
            removeFromWishlist,
            moveToCart,
            isInWishlist,
            wishlistCount: wishlist.length
        }}>
            {mounted ? children : null}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};
