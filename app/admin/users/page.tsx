"use client";

import { useEffect, useState } from 'react';
import { getAdminUsers, getUserOrders, API_URL } from '@/lib/api';
import { User, Mail, Calendar, Wallet, Search, Ban, CheckCircle, Package, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UserData {
    id: string;
    _id?: string;
    name: string;
    email: string;
    role: string;
    joined: string;
    status?: string; // active | blocked
    wallet?: {
        balance: number;
    };
}

export default function UsersPage() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const [userOrders, setUserOrders] = useState<any[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        setFilteredUsers(users.filter(u =>
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
        ));
    }, [searchTerm, users]);

    const fetchUsers = () => {
        getAdminUsers()
            .then((data) => {
                const usersData = data as UserData[];
                setUsers(usersData);
                setFilteredUsers(usersData);
            })
            .catch(console.error);
    };

    const toggleUserStatus = async (user: UserData) => {
        try {
            const newStatus = user.status === 'blocked' ? 'active' : 'blocked';
            const userId = user.id || user._id;

            await fetch(`${API_URL}/users/${userId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            setUsers(users.map(u => (u.id === userId || u._id === userId) ? { ...u, status: newStatus } : u));
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update user status");
        }
    };

    const handleViewDetails = async (user: UserData) => {
        setSelectedUser(user);
        setLoadingOrders(true);
        try {
            const orders = await getUserOrders(user.id || user._id || '');
            setUserOrders(orders);
        } catch (error) {
            console.error("Failed to fetch user orders:", error);
            setUserOrders([]);
        } finally {
            setLoadingOrders(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center text-white">
                <h1 className="text-3xl font-bold">Users Directory</h1>
                <div className="bg-secondary p-2 px-4 rounded-lg border border-white/10 flex items-center gap-2">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="bg-transparent border-none focus:outline-none text-white w-64"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((user) => (
                    <div key={user.id || user._id} className="bg-secondary p-6 rounded-xl border border-white/10 hover:border-primary/50 transition-colors group relative">
                        {/* Status Badge */}
                        {user.status === 'blocked' && (
                            <div className="absolute top-4 right-4 bg-red-500/20 text-red-500 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                                <Ban className="w-3 h-3" /> Blocked
                            </div>
                        )}

                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 group-hover:scale-110 transition-transform">
                                <User className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold">{user.name}</h3>
                                <p className={`text-xs px-2 py-0.5 rounded inline-block mt-1 ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-400/10 text-blue-400'
                                    }`}>
                                    {user.role === 'admin' ? 'Admin' : 'Customer'}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-white/5">
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                                <Mail className="w-4 h-4" />
                                <span>{user.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                                <Wallet className="w-4 h-4" />
                                <span>Wallet: <span className="font-bold text-primary">₹{(user.wallet?.balance || 0).toLocaleString('en-IN')}</span></span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                                <Calendar className="w-4 h-4" />
                                <span>Joined {new Date(user.joined || Date.now()).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-between gap-3">
                            <button
                                onClick={() => handleViewDetails(user)}
                                className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2 rounded text-sm transition-colors"
                            >
                                View Details
                            </button>
                            <button
                                onClick={() => toggleUserStatus(user)}
                                className={`flex-1 py-2 rounded text-sm transition-colors flex items-center justify-center gap-2 ${user.status === 'blocked'
                                    ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                                    : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                                    }`}
                            >
                                {user.status === 'blocked' ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                {user.status === 'blocked' ? 'Unblock' : 'Block'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* User Details Modal */}
            <AnimatePresence>
                {selectedUser && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedUser(null)}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-secondary border border-white/10 rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">{selectedUser.name}</h2>
                                        <p className="text-sm text-gray-400">{selectedUser.email}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-white">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto flex-1">
                                <h3 className="font-bold text-gray-300 mb-4 flex items-center gap-2">
                                    <Package className="w-5 h-5" /> Order History
                                </h3>

                                {loadingOrders ? (
                                    <div className="text-center py-10 text-gray-500">Loading history...</div>
                                ) : userOrders.length === 0 ? (
                                    <div className="text-center py-10 bg-black/20 rounded-lg text-gray-500">
                                        No orders found for this user.
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {userOrders.map((order) => (
                                            <div key={order.id} className="bg-black/20 p-4 rounded-lg border border-white/5 flex justify-between items-center">
                                                <div>
                                                    <div className="font-bold text-white">Order #{order.id.slice(0, 8)}</div>
                                                    <div className="text-xs text-gray-400">{new Date(order.date).toLocaleDateString()} • {(order.items || order.orderDetails || []).length} items</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-primary">₹{order.total}</div>
                                                    <div className={`text-xs px-2 py-0.5 rounded inline-block mt-1 ${order.status === 'Delivered' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                                                        }`}>
                                                        {order.status}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
