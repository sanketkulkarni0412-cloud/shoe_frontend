"use client";

import { createContext, useContext, useState, useEffect } from 'react';

type Product = {
    id: number;
    name: string;
    brand: string;
    price: number;
    image: string;
    discount: number;
    colors?: { name: string, hex: string, image: string }[];
};

type CartItem = Product & {
    quantity: number;
    size?: number;
    color?: { name: string, hex: string, image: string };
};

type CartContextType = {
    cart: CartItem[];
    addToCart: (product: Product, size?: number, color?: { name: string, hex: string, image: string }) => void;
    removeFromCart: (productId: number, size?: number, colorName?: string) => void;
    updateQuantity: (productId: number, size: number | undefined, quantity: number, colorName?: string) => void;
    clearCart: () => void;
    totalPrice: number;
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

    const addToCart = (product: Product, size?: number, color?: { name: string, hex: string, image: string }) => {
        setCart((prev) => {
            const existing = prev.find((item) =>
                item.id === product.id &&
                item.size === size &&
                item.color?.name === color?.name
            );

            if (existing) {
                return prev.map((item) =>
                    item.id === product.id && item.size === size && item.color?.name === color?.name
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1, size, color }];
        });
    };

    const removeFromCart = (productId: number, size?: number, colorName?: string) => {
        setCart((prev) => prev.filter((item) => !(
            item.id === productId &&
            item.size === size &&
            item.color?.name === colorName
        )));
    };

    const updateQuantity = (productId: number, size: number | undefined, quantity: number, colorName?: string) => {
        if (quantity <= 0) {
            removeFromCart(productId, size, colorName);
            return;
        }
        setCart((prev) =>
            prev.map((item) =>
                item.id === productId && item.size === size && item.color?.name === colorName
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
