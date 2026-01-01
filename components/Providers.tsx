"use client";

import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { WalletProvider } from '@/context/WalletContext';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <WalletProvider>
                <CartProvider>
                    <WishlistProvider>
                        {children}
                    </WishlistProvider>
                </CartProvider>
            </WalletProvider>
        </AuthProvider>
    );
}
