"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { API_URL } from '@/lib/api';

interface Transaction {
    id: string;
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    date: string;
}

interface WalletData {
    balance: number;
    transactions: Transaction[];
}

interface WalletContextType {
    wallet: WalletData;
    loading: boolean;
    refreshWallet: () => Promise<void>;
    topUpWallet: (amount: number) => Promise<void>;
    payWithWallet: (amount: number, orderId: string) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [wallet, setWallet] = useState<WalletData>({ balance: 0, transactions: [] });
    const [loading, setLoading] = useState(false);

    const refreshWallet = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/wallet/${user.uid}`);
            if (res.ok) {
                const data = await res.json();
                setWallet(data);
            }
        } catch (error) {
            console.error("Failed to fetch wallet", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshWallet();
    }, [user]);

    const topUpWallet = async (amount: number) => {
        if (!user) return;
        try {
            const res = await fetch(`${API_URL}/wallet/topup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.uid, amount })
            });
            if (!res.ok) throw new Error('Top-up failed');
            await refreshWallet();
        } catch (error) {
            throw error;
        }
    };

    const payWithWallet = async (amount: number, orderId: string) => {
        if (!user) return;
        try {
            const res = await fetch(`${API_URL}/wallet/pay`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.uid, amount, orderId })
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Payment failed');
            }
            await refreshWallet();
        } catch (error) {
            throw error;
        }
    };

    return (
        <WalletContext.Provider value={{ wallet, loading, refreshWallet, topUpWallet, payWithWallet }}>
            {children}
        </WalletContext.Provider>
    );
}

export function useWallet() {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
}
