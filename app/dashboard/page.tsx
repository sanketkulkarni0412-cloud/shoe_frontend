"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Truck, Package, Clock, ShoppingBag, Heart, User, MessageSquare, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ProfileImageUpload from '@/components/ProfileImageUpload';
import { API_URL } from '@/lib/api';

export default function DashboardPage() {
    const { user, updateUserImage } = useAuth();
    // Static stats for now or mock
    const ordersLength = 1; // You'd pull this from context or api
    const wishlistCount = 2; // You'd pull this from context
    const activeShipments = 1; // Mock


    const [walletBalance, setWalletBalance] = useState(0);

    // Fetch Wallet Balance
    useEffect(() => {
        if (!user) return;

        fetch(`${API_URL}/users/${user.uid}/wallet`) // Assuming this endpoint exists based on earlier research or I'll use wallet route
            .catch(() => { }); // Fallback

        // Actually better to use the specific wallet route
        fetch(`${API_URL}/wallet/${user.uid}`)
            .then(res => {
                if (res.ok) return res.json();
                return { balance: 0 };
            })
            .then(data => setWalletBalance(data.balance || 0))
            .catch(err => console.error("Error fetching wallet:", err));
    }, [user, updateUserImage]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-6"
        >
            <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>

            {/* Profile & Wallet Section */}
            <div className="bg-secondary border border-white/5 rounded-xl p-6 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex flex-col md:flex-row items-center gap-6 flex-1">
                        <ProfileImageUpload
                            currentImage={user?.image}
                            onImageUpdated={(url) => updateUserImage(url)}
                        />
                        <div className="text-center md:text-left">
                            <h2 className="text-xl font-bold text-foreground">{user?.name}</h2>
                            <p className="text-gray-400">{user?.email}</p>
                            <p className="text-sm text-gray-500 mt-1">Member since {new Date().getFullYear()}</p>
                        </div>
                    </div>

                    {/* Wallet Card */}
                    <div className="bg-black/40 p-5 rounded-lg border border-white/10 min-w-[220px] text-center md:text-right">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Wallet Balance</h3>
                        <div className="text-3xl font-bold text-primary">₹{walletBalance.toLocaleString('en-IN')}</div>
                        <p className="text-[10px] text-gray-500 mt-1">Available for next purchase</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/dashboard/orders">
                    <motion.div whileHover={{ y: -5 }} className="bg-secondary border border-white/5 p-6 rounded-xl h-full cursor-pointer hover:border-primary/50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
                                <ShoppingBag className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Total Orders</p>
                                <p className="text-2xl font-bold text-foreground">{ordersLength}</p>
                            </div>
                        </div>
                    </motion.div>
                </Link>

                <Link href="/dashboard/wishlist">
                    <motion.div whileHover={{ y: -5 }} className="bg-secondary border border-white/5 p-6 rounded-xl h-full cursor-pointer hover:border-primary/50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-500/10 rounded-lg text-purple-500">
                                <Heart className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Wishlist Items</p>
                                <p className="text-2xl font-bold text-foreground">{wishlistCount}</p>
                            </div>
                        </div>
                    </motion.div>
                </Link>

                <Link href="/dashboard/reviews">
                    <motion.div whileHover={{ y: -5 }} className="bg-secondary border border-white/5 p-6 rounded-xl h-full cursor-pointer hover:border-primary/50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-yellow-500/10 rounded-lg text-yellow-500">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">My Reviews</p>
                                <p className="text-2xl font-bold text-foreground">0</p>
                            </div>
                        </div>
                    </motion.div>
                </Link>
                <Link href="/dashboard/settings">
                    <motion.div whileHover={{ y: -5 }} className="bg-secondary border border-white/5 p-6 rounded-xl h-full cursor-pointer hover:border-primary/50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gray-500/10 rounded-lg text-gray-400">
                                <Settings className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Settings</p>
                                <p className="text-xs text-gray-500">Profile, Addresses & Security</p>
                            </div>
                        </div>
                    </motion.div>
                </Link>
            </div>
        </motion.div>
    );
}
