"use client";

import { useWallet } from '@/context/WalletContext';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function WalletPage() {
    const { wallet, loading, topUpWallet } = useWallet();
    const { user } = useAuth();
    const [amount, setAmount] = useState('');
    const [isTopUpOpen, setIsTopUpOpen] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleTopUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        try {
            await topUpWallet(parseFloat(amount));
            setIsTopUpOpen(false);
            setAmount('');
        } catch (error) {
            console.error(error);
            alert('Top-up failed');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading Wallet...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <header className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">My Wallet</h1>
                <Button onClick={() => setIsTopUpOpen(!isTopUpOpen)}>
                    <Plus className="w-4 h-4 mr-2" /> Add Money
                </Button>
            </header>

            {/* Top Up Panel */}
            {isTopUpOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-secondary p-6 rounded-xl border border-white/10"
                >
                    <h3 className="font-bold mb-4">Add Funds to Wallet</h3>
                    <form onSubmit={handleTopUp} className="flex gap-4">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter Amount (₹)"
                            className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 flex-grow focus:outline-none focus:border-primary"
                            min="1"
                            required
                        />
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Processing...' : 'Add Money'}
                        </Button>
                    </form>
                </motion.div>
            )}

            {/* Balance Card */}
            <div className="bg-gradient-to-r from-primary/20 to-secondary p-8 rounded-2xl border border-primary/20 flex flex-col md:flex-row justify-between items-center">
                <div>
                    <p className="text-gray-400 mb-2 font-medium uppercase tracking-widest">Total Balance</p>
                    <h2 className="text-5xl font-bold text-white">₹{wallet.balance.toLocaleString('en-IN')}</h2>
                </div>
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mt-6 md:mt-0">
                    <Wallet className="w-8 h-8 text-primary" />
                </div>
            </div>

            {/* Transaction History */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold">Transaction History</h3>
                <div className="bg-secondary rounded-xl border border-white/5 overflow-hidden">
                    {wallet.transactions.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">No transactions yet</div>
                    ) : (
                        wallet.transactions.map((txn) => (
                            <div key={txn.id} className="p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${txn.type === 'credit' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {txn.type === 'credit' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className="font-bold">{txn.description}</p>
                                        <p className="text-xs text-gray-400 flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {new Date(txn.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <span className={`font-bold ${txn.type === 'credit' ? 'text-green-500' : 'text-white'}`}>
                                    {txn.type === 'credit' ? '+' : '-'} ₹{txn.amount.toLocaleString()}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
