"use client";

import { AlertCircle, Box, CheckCircle, Clock, Truck, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Button from "./ui/Button";

interface OrderItem {
    name: string;
    price: number;
    quantity: number;
    image: string;
    size: number;
}

interface OrderProps {
    order: {
        id: string;
        customId?: string;
        date: string;
        status: string;
        total: number;
        orderDetails: OrderItem[];
    };
    onCancel: () => void;
    onReturn: () => void;
}

const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
    'Processing': { icon: Clock, color: 'text-blue-400 bg-blue-400/10', label: 'Processing' },
    'Shipped': { icon: Truck, color: 'text-yellow-400 bg-yellow-400/10', label: 'Shipped' },
    'Out for Delivery': { icon: Truck, color: 'text-orange-400 bg-orange-400/10', label: 'Out for Delivery' },
    'Delivered': { icon: CheckCircle, color: 'text-green-400 bg-green-400/10', label: 'Delivered' },
    'Cancelled': { icon: XCircle, color: 'text-red-400 bg-red-400/10', label: 'Cancelled' },
    'Return Requested': { icon: AlertCircle, color: 'text-purple-400 bg-purple-400/10', label: 'Return Requested' },
    'Returned': { icon: Box, color: 'text-gray-400 bg-gray-400/10', label: 'Returned' },
};

export default function OrderCard({ order, onCancel, onReturn }: OrderProps) {
    const config = statusConfig[order.status] || statusConfig['Processing'];
    const Icon = config.icon;
    const isCancellable = ['Processing', 'Ordered'].includes(order.status);
    const isReturnable = order.status === 'Delivered';

    // Format date safely
    const orderDate = new Date(order.date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all group">
            <div className="p-4 sm:p-6 border-b border-white/5 bg-white/5 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-gray-400">
                    <div className="flex flex-col">
                        <span className="text-xs uppercase tracking-wider font-semibold">Order Placed</span>
                        <span className="text-white">{orderDate}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs uppercase tracking-wider font-semibold">Total</span>
                        <span className="text-white">₹{order.total.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs uppercase tracking-wider font-semibold">Order ID</span>
                        <span className="font-mono text-white/80">#{order.customId || order.id.slice(0, 8).toUpperCase()}</span>
                    </div>
                </div>

                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold leading-none ${config.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                    {config.label}
                </div>
            </div>

            <div className="p-4 sm:p-6 space-y-6">
                {order.orderDetails.map((item, idx) => (
                    <div key={idx} className="flex gap-4 sm:gap-6">
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-white/5 rounded-lg overflow-hidden flex-shrink-0 border border-white/10 flex items-center justify-center">
                            {item.image ? (
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : (
                                <Box className="w-8 h-8 text-white/20" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-white text-base sm:text-lg truncate">{item.name}</h4>
                            <p className="text-sm text-gray-400 mt-1">Size: {item.size} • Qty: {item.quantity}</p>
                            <p className="font-bold text-primary mt-2">₹{item.price.toLocaleString()}</p>
                        </div>
                        <div className="hidden sm:flex flex-col gap-2">
                            {/* Optional Item Actions can go here */}
                            <Button variant="outline" size="sm" className="w-full">Buy Again</Button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 sm:p-6 border-t border-white/5 bg-white/[0.02] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Updates sent to registered email
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    {/* Track Button */}
                    <Link href={`/track-order?id=${order.id}`} className="flex-1 sm:flex-none">
                        <Button variant="secondary" size="sm" className="w-full">
                            Track Package
                        </Button>
                    </Link>

                    {/* Action Buttons */}
                    {isCancellable && (
                        <Button
                            variant="destructive"
                            size="sm"
                            className="flex-1 sm:flex-none bg-red-500/10 text-red-500 border-red-500/50 hover:bg-red-500 hover:text-white"
                            onClick={onCancel}
                        >
                            Cancel Order
                        </Button>
                    )}

                    {isReturnable && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 sm:flex-none border-purple-500/50 text-purple-400 hover:bg-purple-500 hover:text-white hover:border-purple-500"
                            onClick={onReturn}
                        >
                            Return Item
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
