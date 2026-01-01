"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Package, Clock, AlertCircle, ArrowRight, Calendar, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

export default function MyOrdersPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'delivered': return 'bg-green-500/10 text-green-500';
            case 'shipped': return 'bg-blue-500/10 text-blue-500';
            case 'processing': return 'bg-yellow-500/10 text-yellow-500';
            case 'cancelled': return 'bg-red-500/10 text-red-500';
            default: return 'bg-gray-500/10 text-gray-500';
        }
    };

    const formatDate = (date: any) => {
        if (!date) return '';
        const d = date.toDate ? date.toDate() : new Date(date);
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return;
            try {
                const db = getFirestore();
                const q = query(
                    collection(db, 'orders'),
                    where('email', '==', user.email)
                );

                const snapshot = await getDocs(q);
                const fetchedOrders: any[] = [];
                snapshot.forEach(doc => {
                    fetchedOrders.push({ id: doc.id, ...doc.data() });
                });

                fetchedOrders.sort((a, b) => {
                    const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || a.date);
                    const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || b.date);
                    return dateB.getTime() - dateA.getTime();
                });

                setOrders(fetchedOrders);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-6"
        >
            <h1 className="text-2xl font-bold text-foreground">My Orders</h1>

            {loading ? (
                <div className="text-center py-10 text-gray-400">Loading orders...</div>
            ) : orders.length === 0 ? (
                <div className="bg-secondary border border-white/5 rounded-xl p-10 text-center">
                    <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white">No orders yet</h3>
                    <p className="text-gray-400 mt-2 mb-6">Start shopping to see your orders here.</p>
                    <Link href="/products">
                        <Button>Browse Products</Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order, index) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.3 }}
                            whileHover={{ scale: 1.005, backgroundColor: 'rgba(255,255,255,0.03)' }}
                            className="bg-secondary border border-white/5 rounded-xl overflow-hidden transition-colors"
                        >
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 border-b border-white/5 pb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="font-mono text-lg font-bold text-primary">{order.customId || order.id.slice(0, 8)}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-400 flex items-center gap-2">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {formatDate(order.createdAt || order.date)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-white">${(order.totalAmount || order.total)?.toFixed(2)}</p>
                                        <p className="text-sm text-gray-400">{(order.items || order.orderDetails)?.length} items</p>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1 space-y-2">
                                        {/* Show first 2 items preview */}
                                        {(order.items || order.orderDetails)?.slice(0, 2).map((item: any, i: number) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-md bg-white/5 overflow-hidden flex-shrink-0">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-300 line-clamp-1">{item.name}</p>
                                                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {(order.items || order.orderDetails)?.length > 2 && (
                                            <p className="text-xs text-gray-500 pl-1">+{((order.items || order.orderDetails)?.length || 0) - 2} more items</p>
                                        )}
                                    </div>

                                    <div className="flex flex-col justify-center gap-2 min-w-[140px]">
                                        <Link href={`/checkout/success?orderId=${order.customId || order.id}`}>
                                            <Button variant="outline" size="sm" className="w-full border-white/10 hover:bg-white/5">
                                                View Details
                                            </Button>
                                        </Link>
                                        <Link href="/track-order">
                                            <Button variant="secondary" size="sm" className="w-full bg-primary/10 text-primary hover:bg-primary/20 border-none">
                                                Track Order
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
