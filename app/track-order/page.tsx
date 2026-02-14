"use client";

import { useState, useEffect } from 'react';
import { Search, Package, Truck, CheckCircle, Clock, AlertCircle, ArrowLeft } from 'lucide-react';
import { API_URL } from '@/lib/api';
import ReviewModal from '@/components/ReviewModal';
import { useSearchParams, useRouter } from 'next/navigation';

type OrderStatus = 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';

export default function TrackOrderPage() {
    const [orderId, setOrderId] = useState('');
    const [loading, setLoading] = useState(false);
    const [orderData, setOrderData] = useState<any>(null);
    const [error, setError] = useState('');

    // Review State
    const [reviewModal, setReviewModal] = useState({ isOpen: false, productName: '' });

    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const idParam = searchParams.get('id');
        if (idParam) {
            setOrderId(idParam);
            // Auto-trigger search differently since we can't easily pass event object
            // Just reuse the logic in a separate function
            trackOrder(idParam);
        }
    }, [searchParams]);

    const trackOrder = async (id: string) => {
        setLoading(true);
        setError('');
        setOrderData(null);

        try {
            const res = await fetch(`${API_URL}/orders/track`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: id }),
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

    const handleReviewSubmit = async (rating: number, comment: string) => {
        try {
            await fetch(`${API_URL}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: 'generic-id', // In a real app, map item name to ID
                    userId: 'guest-user', // Or actual user ID if auth check
                    userName: 'Guest',
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
        trackOrder(orderId);
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
        <div className="min-h-screen bg-background text-foreground pt-24 pb-12 px-4 md:px-8">
            <button
                onClick={() => router.back()}
                className="mb-8 flex items-center gap-2 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors group"
            >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back</span>
            </button>

            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-8 uppercase tracking-wider text-black dark:text-white">Track Your Order</h1>

                {/* Search Form */}
                <div className="bg-secondary p-8 rounded-lg border border-border mb-12 shadow-sm">
                    <form onSubmit={handleTrack} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-gray-600 dark:text-gray-400 mb-2 font-medium">Order ID <span className="text-red-500">*</span></label>
                                <input
                                    required
                                    type="text"
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                    placeholder="e.g. 5f4d..."
                                    className="w-full bg-white dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded p-3 text-black dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-primary/20"
                        >
                            {loading ? 'Searching...' : <><Search className="w-5 h-5" /> Track Order</>}
                        </button>
                    </form>
                    {error && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-600 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-500 rounded flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" /> {error}
                        </div>
                    )}
                </div>

                {/* Order Status Display */}
                {orderData && (
                    <div className="bg-secondary p-8 rounded-lg border border-border animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-sm">
                        <div className="flex justify-between items-start mb-8 pb-8 border-b border-border">
                            <div>
                                <h2 className="text-2xl font-bold mb-2 text-black dark:text-white">Order #{orderData.id.slice(0, 8)}...</h2>
                                <p className="text-gray-500 dark:text-gray-400">Placed on {new Date(orderData.date).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-bold text-primary">₹{orderData.total.toLocaleString('en-IN')}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{orderData.itemCount} items</p>
                            </div>
                        </div>

                        {/* Delay Note Alert */}
                        {orderData.delayNote && (
                            <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 dark:bg-yellow-500/10 dark:border-yellow-500/30 rounded-lg flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
                                <div>
                                    <h3 className="text-yellow-700 dark:text-yellow-500 font-bold mb-1">Update on your order</h3>
                                    <p className="text-yellow-600 dark:text-gray-300 text-sm">{orderData.delayNote}</p>
                                </div>
                            </div>
                        )}

                        {/* Timeline */}
                        <div className="relative py-8">
                            {/* Connector Line */}
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-white/10 -translate-y-1/2 hidden md:block" />

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                                {[
                                    { label: 'Processing', icon: Clock, delay: 1000 * 60 * 30 }, // +30 mins
                                    { label: 'Shipped', icon: Package, delay: 1000 * 60 * 60 * 24 }, // +1 day
                                    { label: 'Out for Delivery', icon: Truck, delay: 1000 * 60 * 60 * 24 * 3 }, // +3 days
                                    { label: 'Delivered', icon: CheckCircle, delay: 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 60 * 4 } // +3d 4h
                                ].map((step, index) => {
                                    const status = getStepStatus(step.label, orderData.status);
                                    const Icon = step.icon;

                                    let colorClass = 'text-gray-400 bg-gray-100 border-gray-200 dark:text-gray-500 dark:bg-black dark:border-gray-700';
                                    if (status === 'completed') colorClass = 'text-green-600 bg-green-100 border-green-200 dark:text-green-500 dark:bg-green-500/10 dark:border-green-500';
                                    if (status === 'current') colorClass = 'text-primary bg-primary/10 border-primary shadow-[0_0_15px_rgba(22,163,74,0.3)] dark:shadow-[0_0_15px_rgba(239,68,68,0.5)]';

                                    // Mock Timestamp Logic
                                    const historyLog = orderData.history?.find((h: any) => h.newStatus === step.label);

                                    let displayTime = null;
                                    if (historyLog) {
                                        displayTime = new Date(historyLog.timestamp).toLocaleString('en-US', {
                                            month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                                        });
                                    } else if (status === 'completed' || status === 'current') {
                                        const mockDate = new Date(new Date(orderData.date).getTime() + step.delay);
                                        displayTime = mockDate.toLocaleString('en-US', {
                                            month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                                        });
                                    }

                                    return (
                                        <div key={index} className="flex flex-col items-center relative z-10 text-center group">
                                            <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center mb-4 transition-all duration-500 ${colorClass}`}>
                                                <Icon className="w-6 h-6" />
                                                {status === 'current' && (
                                                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                                                    </span>
                                                )}
                                            </div>
                                            <p className={`font-bold text-sm uppercase tracking-wide ${status !== 'pending' ? 'text-black dark:text-white' : 'text-gray-400 dark:text-gray-600'}`}>
                                                {step.label}
                                            </p>

                                            {status === 'current' && (
                                                <div className="flex items-center gap-1.5 mt-2 text-primary bg-primary/10 px-3 py-1 rounded-full">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                                    <span className="text-[10px] font-bold uppercase tracking-wider">Live Updates</span>
                                                </div>
                                            )}

                                            {displayTime && (
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-mono">
                                                    {displayTime}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Items Summary & Review */}
                        <div className="mt-8 pt-6 border-t border-border">
                            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase mb-4">Package Includes</h3>
                            <div className="space-y-4">
                                {orderData.items.map((item: string, i: number) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/5">
                                        <span className="text-sm font-medium text-black dark:text-white">{item}</span>
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
