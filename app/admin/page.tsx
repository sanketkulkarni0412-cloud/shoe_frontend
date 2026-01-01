"use client";

import { Users, ShoppingBag, DollarSign, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { API_URL } from '@/lib/api';
import PermissionGuard from '@/components/admin/PermissionGuard';
import RestockModal from '@/components/admin/RestockModal';
import { useAuth } from '@/context/AuthContext';

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
    const [products, setProducts] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);

    // Restock State
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch Products
            const resProd = await fetch(`${API_URL}/products`);
            const dataProd = await resProd.json();
            setProducts(dataProd);

            // Filter Low Stock (< 10)
            const lowStock = dataProd.filter((p: any) => (p.stock || 0) < 10);
            setLowStockProducts(lowStock);

            // Mock Orders for now, or fetch if API ready
            // setOrders(...)
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        }
    };

    const handleRestockClick = (product: any) => {
        setSelectedProduct(product);
        setIsRestockModalOpen(true);
    };

    const handleRestockConfirm = async (productId: string, addedQuantity: number) => {
        // Calculate new stock
        const product = products.find(p => p.id === productId || p._id === productId);
        if (!product) return;

        const currentStock = parseInt(product.stock || 0);
        const newStock = currentStock + addedQuantity;

        try {
            const res = await fetch(`${API_URL}/products/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stock: newStock })
            });

            if (!res.ok) throw new Error('Failed to update stock');

            // Refresh Data
            await fetchData();
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Revenue" value="₹12,45,000" icon={DollarSign} color="text-green-500" delay={0.1} />
                <StatCard title="Total Orders" value="1,245" icon={ShoppingBag} color="text-blue-500" delay={0.2} />
                <StatCard title="Active Users" value="8,520" icon={Users} color="text-purple-500" delay={0.3} />
                <StatCard title="Total Products" value={products.length} icon={Package} color="text-orange-500" delay={0.4} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-secondary p-6 rounded-xl border border-white/5">
                    <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex justify-between items-center p-3 hover:bg-white/5 rounded-lg transition-colors border-b border-white/5 last:border-0">
                                <div>
                                    <p className="font-bold text-sm">Order #ORD-{1000 + i}</p>
                                    <p className="text-xs text-gray-400">2 items • ₹2,499</p>
                                </div>
                                <span className="bg-green-500/20 text-green-500 text-xs font-bold px-2 py-1 rounded">Paid</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-secondary p-6 rounded-xl border border-white/5">
                    <h2 className="text-xl font-bold mb-4">Low Stock Alert</h2>
                    {lowStockProducts.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">All products are well stocked!</div>
                    ) : (
                        <div className="space-y-4">
                            {lowStockProducts.slice(0, 5).map((product) => (
                                <div key={product.id || product._id} className="flex justify-between items-center p-3 hover:bg-white/5 rounded-lg transition-colors border-b border-white/5 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center">
                                            <Package className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm truncate max-w-[150px]">{product.name}</p>
                                            <p className="text-xs text-red-400 font-bold">Only {product.stock} left</p>
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
