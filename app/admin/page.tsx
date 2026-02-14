"use client";

import { Users, ShoppingBag, DollarSign, Package, TrendingUp, Loader2, Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getAdminStats, getAdminOrders } from '@/lib/api'; // getProducts removed, fetched in stats if needed or separate
import PermissionGuard from '@/components/admin/PermissionGuard';
import RestockModal from '@/components/admin/RestockModal';
import RevenueChart from '@/components/admin/RevenueChart';
import { useAuth } from '@/context/AuthContext';
import { API_URL } from '@/lib/api';

const StatCard = ({ title, value, icon: Icon, color, delay }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="bg-secondary p-6 rounded-xl border border-white/5 relative overflow-hidden group"
    >
        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
            <Icon className="w-16 h-16" />
        </div>
        <div className="relative z-10">
            <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">{title}</p>
            <h3 className="text-3xl font-bold">{value}</h3>
        </div>
    </motion.div>
);

export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Restock State
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('ID Copied!');
    };

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [statsData, ordersData, productsRes] = await Promise.all([
                getAdminStats(),
                getAdminOrders(),
                fetch(`${API_URL}/products`)
            ]);

            setStats(statsData);
            setRecentOrders(ordersData.slice(0, 5));

            const productsData = await productsRes.json();
            const lowStock = productsData.filter((p: any) => (p.stock || 0) < 10);
            setLowStockProducts(lowStock);

        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRestockClick = (product: any) => {
        setSelectedProduct(product);
        setIsRestockModalOpen(true);
    };

    const handleRestockConfirm = async (productId: string, addedQuantity: number) => {
        try {
            const product = lowStockProducts.find(p => p.id === productId || p._id === productId);
            if (!product) return;

            const currentStock = parseInt(product.stock || 0);
            const newStock = currentStock + addedQuantity;

            const res = await fetch(`${API_URL}/products/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stock: newStock })
            });

            if (!res.ok) throw new Error('Failed to update stock');

            // Refresh Data
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center text-white">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
                    <p className="text-gray-400">Welcome back, {user?.name}</p>
                </div>
                <div className="bg-green-500/10 text-green-500 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Store Live
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Revenue"
                    value={`₹${stats?.totalSales?.toLocaleString() || '0'}`}
                    icon={DollarSign}
                    color="text-green-500"
                    delay={0.1}
                />
                <StatCard
                    title="Total Orders"
                    value={stats?.totalOrders || '0'}
                    icon={ShoppingBag}
                    color="text-blue-500"
                    delay={0.2}
                />
                <StatCard
                    title="Total Users"
                    value={stats?.totalUsers || '0'}
                    icon={Users}
                    color="text-purple-500"
                    delay={0.3}
                />
                <StatCard
                    title="Products"
                    value={stats?.totalProducts || '0'}
                    icon={Package}
                    color="text-orange-500"
                    delay={0.4}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-bold mb-4">Revenue Trends</h2>
                    <RevenueChart
                        data={stats?.totalSales > 0 ? stats.chartData : [
                            { name: 'Jan', total: 12000 },
                            { name: 'Feb', total: 19000 },
                            { name: 'Mar', total: 15000 },
                            { name: 'Apr', total: 22000 },
                            { name: 'May', total: 28000 },
                            { name: 'Jun', total: 35000 },
                        ]}
                        type="bar"
                    />
                </div>
                <div>
                    <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
                    <div className="bg-secondary p-4 rounded-xl border border-white/5 space-y-3">
                        {recentOrders.length === 0 ? (
                            <p className="text-gray-400 text-center py-4">No recent orders</p>
                        ) : (
                            recentOrders.map((order: any, i) => (
                                <div key={i} className="flex justify-between items-center p-3 hover:bg-white/5 rounded-lg transition-colors border-b border-white/5 last:border-0 cursor-pointer">
                                    <div>
                                        <p className="font-bold text-sm text-white flex items-center gap-2 group">
                                            {order.customId || `#${order.id.slice(0, 8).toUpperCase()}`}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    copyToClipboard(order.customId || order.id);
                                                }}
                                                className="text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="Copy ID"
                                            >
                                                <Copy className="w-3 h-3" />
                                            </button>
                                        </p>
                                        <p className="text-xs text-gray-400">{order.items?.length || 0} items • ₹{order.total}</p>
                                    </div>
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${order.status === 'Delivered' ? 'bg-green-500/20 text-green-500' :
                                        order.status === 'Cancelled' ? 'bg-red-500/20 text-red-500' :
                                            'bg-yellow-500/20 text-yellow-500'
                                        }`}>
                                        {order.status || 'Pending'}
                                    </span>
                                </div>
                            ))
                        )}
                        <button className="w-full text-center text-xs text-gray-500 hover:text-white pt-2">View All Orders</button>
                    </div>
                </div>
            </div>

            <div className="bg-secondary p-6 rounded-xl border border-white/5">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-red-500" />
                    Low Stock Alert
                </h2>
                {lowStockProducts.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">All products are well stocked!</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {lowStockProducts.map((product) => (
                            <div key={product.id || product._id} className="flex justify-between items-center p-4 bg-black/40 rounded-lg border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center overflow-hidden">
                                        {product.image ? (
                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <Package className="w-5 h-5 text-gray-400" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm truncate max-w-[120px] text-white">{product.name}</p>
                                        <p className="text-xs text-red-400 font-bold">Stock: {product.stock}</p>
                                    </div>
                                </div>
                                <PermissionGuard requiredRole="admin">
                                    <button
                                        onClick={() => handleRestockClick(product)}
                                        className="text-xs bg-white/10 hover:bg-primary hover:text-white px-3 py-1.5 rounded transition-colors"
                                    >
                                        Restock
                                    </button>
                                </PermissionGuard>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <RestockModal
                isOpen={isRestockModalOpen}
                onClose={() => setIsRestockModalOpen(false)}
                product={selectedProduct}
                onConfirm={handleRestockConfirm}
            />
        </div>
    );
}
