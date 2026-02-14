"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserOrders, cancelOrder, returnOrder } from "@/lib/api";
import { useRouter } from "next/navigation";
import OrderCard from "@/components/OrderCard";
import ReturnModal from "@/components/ReturnModal";
import { Boxes, Filter, PackageX, Search } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface Order {
    id: string;
    customId?: string;
    date: string;
    status: string;
    total: number;
    orderDetails: any[];
    // ... other fields
}

export default function ReturnsAndOrdersPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'open' | 'cancelled'>('all');

    // Modal State
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
    const [modalType, setModalType] = useState<'cancel' | 'return'>('cancel');

    const fetchOrders = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const data = await getUserOrders(user.uid);
            setOrders(data);
        } catch (error) {
            console.error("Failed to load orders:", error);
            toast.error("Could not load your orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/login');
            } else {
                fetchOrders();
            }
        }
    }, [user, authLoading, router]);

    const handleAction = (orderId: string, type: 'cancel' | 'return') => {
        setSelectedOrder(orderId);
        setModalType(type);
        setModalOpen(true);
    };

    const handleModalSubmit = async (reason: string) => {
        if (!selectedOrder) return;

        try {
            if (modalType === 'cancel') {
                await cancelOrder(selectedOrder, reason);
                toast.success('Order cancelled successfully. Refund processed to wallet.');
            } else {
                await returnOrder(selectedOrder, reason);
                toast.success('Return requested successfully.');
            }
            fetchOrders(); // Refresh list
        } catch (error: any) {
            toast.error(error.message || 'Action failed');
        }
    };

    const filteredOrders = orders.filter(order => {
        if (filter === 'all') return true;
        if (filter === 'open') return ['Processing', 'Shipped', 'Out for Delivery'].includes(order.status);
        if (filter === 'cancelled') return ['Cancelled', 'Returned', 'Return Requested'].includes(order.status);
        return true;
    });

    // Imports updated implicitly by removing usages below

    if (authLoading || (loading && orders.length === 0)) {
        return (
            <div className="min-h-screen bg-black">
                <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
                    <div className="h-8 w-48 bg-white/10 rounded animate-pulse" />
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 bg-white/5 rounded-xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Toaster position="top-right" />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Returns & Orders</h1>
                        <p className="text-gray-400">Track, return, or buy things again</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                    {[
                        { id: 'all', label: 'All Orders', icon: Boxes },
                        { id: 'open', label: 'Open Orders', icon: PackageX },
                        { id: 'cancelled', label: 'Cancelled & Returns', icon: Filter }
                    ].map((tab) => {
                        const Icon = tab.icon;
                        const active = filter === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setFilter(tab.id as any)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap border ${active
                                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Orders List */}
                <div className="space-y-6">
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map(order => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                onCancel={() => handleAction(order.id, 'cancel')}
                                onReturn={() => handleAction(order.id, 'return')}
                            />
                        ))
                    ) : (
                        <div className="text-center py-24 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-gray-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No orders found</h3>
                            <p className="text-gray-400 max-w-sm mx-auto">
                                Looks like you haven't placed any orders in this category yet.
                            </p>
                        </div>
                    )}
                </div>
            </main>

            <ReturnModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleModalSubmit}
                type={modalType}
                order={orders.find(o => o.id === selectedOrder) || null}
            />
        </div>
    );
}
