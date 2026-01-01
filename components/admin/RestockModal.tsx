"use client";

import { useState } from 'react';
import { X, Package, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';

interface Product {
    id?: string;
    _id?: string;
    name: string;
    stock: number;
    price: number;
}

interface RestockModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
    onConfirm: (productId: string, addedQuantity: number) => Promise<void>;
}

export default function RestockModal({ isOpen, onClose, product, onConfirm }: RestockModalProps) {
    const [quantity, setQuantity] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const qty = parseInt(quantity);
        if (isNaN(qty) || qty <= 0) {
            setError('Please enter a valid positive number');
            return;
        }

        if (!product) return;

        try {
            setIsSubmitting(true);
            await onConfirm(product.id || product._id, qty);
            setQuantity('');
            onClose();
        } catch (err) {
            setError('Failed to update stock. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !product) return null;

    const currentStock = product.stock || 0;
    const addedStock = parseInt(quantity) || 0;
    const newTotal = currentStock + addedStock;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-secondary border border-white/10 rounded-xl w-full max-w-md overflow-hidden shadow-2xl"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Package className="w-5 h-5 text-primary" />
                                    Restock Inventory
                                </h2>
                                <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Product</label>
                                    <div className="font-medium text-lg text-white truncate">{product.name}</div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-black/40 p-3 rounded-lg border border-white/5 text-center">
                                        <div className="text-xs text-gray-500 mb-1">Current</div>
                                        <div className="text-xl font-bold text-white">{currentStock}</div>
                                    </div>
                                    <div className="flex items-center justify-center text-gray-500">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                    <div className="bg-primary/10 p-3 rounded-lg border border-primary/20 text-center">
                                        <div className="text-xs text-primary/70 mb-1">New Total</div>
                                        <div className="text-xl font-bold text-primary">{newTotal}</div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Quantity to Add</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                        placeholder="Enter amount..."
                                        autoFocus
                                    />
                                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                                </div>

                                <div className="flex gap-3 justify-end pt-2">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </button>
                                    <Button type="submit" disabled={isSubmitting || addedStock <= 0}>
                                        {isSubmitting ? (
                                            <span className="flex items-center gap-2">
                                                <Loader2 className="w-4 h-4 animate-spin" /> Updating...
                                            </span>
                                        ) : (
                                            'Confirm Restock'
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
