"use client";

import { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { API_URL } from '@/lib/api';
import ReviewModal from '@/components/ReviewModal';

type OrderStatus = 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';

export default function TrackOrderPage() {
    const [orderId, setOrderId] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [orderData, setOrderData] = useState<any>(null);
    const [error, setError] = useState('');

    // Review State
    const [reviewModal, setReviewModal] = useState({ isOpen: false, productName: '' });

    const handleReviewSubmit = async (rating: number, comment: string) => {
        try {
            await fetch(`${API_URL}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: 'generic-id', // In a real app, map item name to ID
                    userId: 'guest-user', // Or actual user ID if auth check
                    userName: email || 'Guest',
                    rating,
                    comment
                })
            });
            alert('Review submitted successfully!');
            setReviewModal({ ...reviewModal, isOpen: false });
        } catch (e) {
            console.error(e);
            alert('Failed to submit review');
        }
    };

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setOrderData(null);

        try {
            const res = await fetch(`${API_URL}/orders/track`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to track order');
            }

            setOrderData(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getStepStatus = (step: string, currentStatus: string) => {
        const steps = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
        const currentIndex = steps.indexOf(currentStatus);
        const stepIndex = steps.indexOf(step);

        if (stepIndex < currentIndex) return 'completed';
        if (stepIndex === currentIndex) return 'current';
        return 'pending';
    };

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-8 uppercase tracking-wider">Track Your Order</h1>

                {/* Search Form */}
                <div className="bg-secondary p-8 rounded-lg border border-white/10 mb-12">
                    <form onSubmit={handleTrack} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-400 mb-2">Order ID <span className="text-red-500">*</span></label>
                                <input
                                    required
                                    type="text"
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                    placeholder="e.g. 5f4d..."
                                    className="w-full bg-black/50 border border-white/10 rounded p-3 focus:border-primary focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-2">Email (Optional)</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Verify with email"
                                    className="w-full bg-black/50 border border-white/10 rounded p-3 focus:border-primary focus:outline-none"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-red-700 text-white font-bold py-4 rounded transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? 'Searching...' : <><Search className="w-5 h-5" /> Track Order</>}
                        </button>
                    </form>
                    {error && (
                        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" /> {error}
                        </div>
                    )}
                </div>

                {/* Order Status Display */}
                {orderData && (
                    <div className="bg-secondary p-8 rounded-lg border border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-start mb-8 pb-8 border-b border-white/10">
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Order #{orderData.id.slice(0, 8)}...</h2>
                                <p className="text-gray-400">Placed on {new Date(orderData.date).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-bold text-primary">₹{orderData.total.toLocaleString('en-IN')}</p>
                                <p className="text-sm text-gray-400">{orderData.itemCount} items</p>
                            </div>
                        </div>

                        {/* Delay Note Alert */}
                        {orderData.delayNote && (
                            <div className="mb-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                                <div>
                                    <h3 className="text-yellow-500 font-bold mb-1">Update on your order</h3>
                                    <p className="text-gray-300 text-sm">{orderData.delayNote}</p>
                                </div>
                            </div>
                        )}

                        {/* Timeline */}
                        <div className="relative py-8">
                            {/* Connector Line */}
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 hidden md:block" />

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                                {[
                                    { label: 'Processing', icon: Clock },
                                    { label: 'Shipped', icon: Package },
                                    { label: 'Out for Delivery', icon: Truck },
                                    { label: 'Delivered', icon: CheckCircle }
                                ].map((step, index) => {
                                    const status = getStepStatus(step.label, orderData.status);
                                    const Icon = step.icon;

                                    let colorClass = 'text-gray-500 bg-black border-gray-700';
                                    if (status === 'completed') colorClass = 'text-green-500 bg-green-500/10 border-green-500';
                                    if (status === 'current') colorClass = 'text-primary bg-primary/10 border-primary animate-pulse';

                                    // Find timestamp for this step from history if available
                                    const historyLog = orderData.history?.find((h: any) => h.newStatus === step.label);
                                    const timestamp = historyLog ? new Date(historyLog.timestamp).toLocaleDateString() : null;

                                    return (
                                        <div key={index} className="flex flex-col items-center relative z-10 text-center">
                                            <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center mb-4 transition-all duration-500 ${colorClass}`}>
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <p className={`font-bold ${status !== 'pending' ? 'text-white' : 'text-gray-500'}`}>{step.label}</p>
                                            {status === 'current' && <p className="text-xs text-primary mt-1">In Progress</p>}
                                            {timestamp && <p className="text-xs text-gray-400 mt-1">{timestamp}</p>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Items Summary & Review */}
                        <div className="mt-8 pt-6 border-t border-white/10">
                            <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">Package Includes</h3>
                            <div className="space-y-4">
                                {orderData.items.map((item: string, i: number) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                                        <span className="text-sm font-medium">{item}</span>
                                        {orderData.status === 'Delivered' && (
                                            <button
                                                onClick={() => setReviewModal({ isOpen: true, productName: item })}
                                                className="text-xs bg-primary/10 text-primary hover:bg-primary hover:text-white px-3 py-1.5 rounded-full transition-colors"
                                            >
                                                Rate & Review
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {orderData.itemCount > 3 && (
                                    <div className="text-center text-xs text-gray-500 pt-2">
                                        +{orderData.itemCount - 3} more items
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Review Modal */}
            <ReviewModal
                isOpen={reviewModal.isOpen}
                productName={reviewModal.productName}
                onClose={() => setReviewModal({ ...reviewModal, isOpen: false })}
                onSubmit={handleReviewSubmit}
            />
        </div>
    );
}
