"use client";

import { useState, useEffect } from 'react';
import { Plus, Trash, Copy, Calendar, Percent, Tag, X } from 'lucide-react';
import { API_URL } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

interface Coupon {
    id: string;
    code: string;
    type: 'percent' | 'flat';
    value: number;
    expiryDate?: string;
    usageLimit?: number;
    usedCount: number;
    isActive: boolean;
}

export default function AdminCouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        code: '',
        type: 'percent',
        value: '',
        expiryDate: '',
        usageLimit: ''
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/coupons`); // Helper removed for raw fetch to debug if needed, or assume api.ts helpers if consistent
            // Actually, let's use the fetch directly as we just added the route
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setCoupons(data);
        } catch (error) {
            console.error("Error fetching coupons:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this coupon?')) return;
        try {
            await fetch(`${API_URL}/coupons/${id}`, { method: 'DELETE' });
            setCoupons(coupons.filter(c => c.id !== id));
        } catch (error) {
            console.error(error);
            alert("Failed to delete");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/coupons`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const newCoupon = await res.json();
                setCoupons([newCoupon, ...coupons]);
                setIsModalOpen(false);
                setFormData({ code: '', type: 'percent', value: '', expiryDate: '', usageLimit: '' });
            } else {
                alert('Failed to create coupon');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const copyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code);
        alert(`Copied ${code}!`);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Coupons & Promotions</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus className="w-5 h-5" /> Create Coupon
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading coupons...</div>
            ) : coupons.length === 0 ? (
                <div className="text-center py-20 bg-secondary rounded-lg border border-white/10">
                    <Tag className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-400">No Active Coupons</h3>
                    <p className="text-gray-500 mt-2">Create a new coupon to boost sales!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {coupons.map((coupon) => (
                        <div key={coupon.id} className="bg-secondary p-6 rounded-xl border border-white/10 relative group overflow-hidden">
                            {/* Decorative Background */}
                            <div className="absolute -right-6 -top-6 text-white/5 rotate-12">
                                <Tag className="w-32 h-32" />
                            </div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-white/10 px-3 py-1 rounded text-sm font-mono font-bold tracking-wider text-primary border border-white/10 flex items-center gap-2">
                                        {coupon.code}
                                        <button onClick={() => copyToClipboard(coupon.code)} className="hover:text-white text-gray-400 transition-colors">
                                            <Copy className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(coupon.id)}
                                        className="text-gray-500 hover:text-red-500 transition-colors"
                                    >
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold text-white">
                                            {coupon.type === 'flat' ? '₹' : ''}{coupon.value}{coupon.type === 'percent' ? '%' : ''}
                                        </span>
                                        <span className="text-gray-400 text-sm uppercase font-bold">OFF</span>
                                    </div>

                                    <div className="space-y-2 text-sm text-gray-400">
                                        {coupon.expiryDate && (
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>Expires: {new Date(coupon.expiryDate).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                        {coupon.usageLimit && (
                                            <div className="flex items-center gap-2">
                                                <Tag className="w-4 h-4" />
                                                <span>{coupon.usedCount} / {coupon.usageLimit} Used</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className={`text-xs font-bold px-2 py-1 rounded inline-block ${coupon.isActive ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                                        }`}>
                                        {coupon.isActive ? 'ACTIVE' : 'INACTIVE'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#0a0a0a] border border-white/10 rounded-xl w-full max-w-md p-6"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold">Create New Coupon</h2>
                                <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Coupon Code</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. SUMMER50"
                                        className="w-full bg-secondary border border-white/10 rounded p-2 focus:border-primary text-white uppercase"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Discount Type</label>
                                        <select
                                            className="w-full bg-secondary border border-white/10 rounded p-2 focus:border-primary text-white"
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                                        >
                                            <option value="percent">Percentage (%)</option>
                                            <option value="flat">Flat Amount (₹)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Value</label>
                                        <input
                                            type="number"
                                            required
                                            placeholder="e.g. 20"
                                            className="w-full bg-secondary border border-white/10 rounded p-2 focus:border-primary text-white"
                                            value={formData.value}
                                            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Expiry Date (Optional)</label>
                                    <input
                                        type="date"
                                        className="w-full bg-secondary border border-white/10 rounded p-2 focus:border-primary text-white"
                                        value={formData.expiryDate}
                                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Usage Limit (Optional)</label>
                                    <input
                                        type="number"
                                        placeholder="Max number of uses"
                                        className="w-full bg-secondary border border-white/10 rounded p-2 focus:border-primary text-white"
                                        value={formData.usageLimit}
                                        onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-primary hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors mt-4"
                                >
                                    Create Coupon
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
