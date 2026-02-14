"use client";

import { createContext, useContext, useState, useEffect } from 'react';

type Product = {
    id: number;
    name: string;
    brand: string;
    price: number;
    image: string;
    discount: number;
};

type CartItem = Product & {
    quantity: number;
    size?: number;
};

type CartContextType = {
    cart: CartItem[];
    addToCart: (product: Product, size?: number) => void;
    removeFromCart: (productId: number, size?: number) => void;
    updateQuantity: (productId: number, size: number | undefined, quantity: number) => void;
    clearCart: () => void;
    totalPrice: number; // derived from cart
    cartCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [mounted, setMounted] = useState(false);

    // Load cart from local storage on mount
    useEffect(() => {
        setMounted(true);
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    // Save cart to local storage on change
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: Product, size?: number) => {
        setCart((prev) => {
            const existing = prev.find((item) =>
                item.id === product.id &&
                item.size === size
            );

            if (existing) {
                return prev.map((item) =>
                    item.id === product.id && item.size === size
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1, size }];
        });
    };

    const removeFromCart = (productId: number, size?: number) => {
        setCart((prev) => prev.filter((item) => !(
            item.id === productId &&
            item.size === size
        )));
    };

    const updateQuantity = (productId: number, size: number | undefined, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId, size);
            return;
        }
        setCart((prev) =>
            prev.map((item) =>
                item.id === productId && item.size === size
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const totalPrice = cart.reduce((total, item) => {
        const price = item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price;
        return total + price * item.quantity;
    }, 0);

    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalPrice, cartCount }}>
            {mounted ? children : null}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
