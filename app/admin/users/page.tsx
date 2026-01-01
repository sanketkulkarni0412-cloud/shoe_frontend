"use client";

import { useEffect, useState } from 'react';
import { getAdminUsers } from '@/lib/api';
import { User, Mail, Calendar, Wallet } from 'lucide-react';

interface UserData {
    id: string;
    name: string;
    email: string;
    role: string;
    joined: string;
    wallet?: {
        balance: number;
    };
}

export default function UsersPage() {
    const [users, setUsers] = useState<UserData[]>([]);

    useEffect(() => {
        getAdminUsers()
            .then((data) => setUsers(data as UserData[])) // Cast if API returns any
            .catch(console.error);
    }, []);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Users Directory</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((user) => (
                    <div key={user.id} className="bg-secondary p-6 rounded-xl border border-white/10 hover:border-primary/50 transition-colors group">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 group-hover:scale-110 transition-transform">
                                <User className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold">{user.name}</h3>
                                <p className={`text-xs px-2 py-0.5 rounded inline-block mt-1 ${user.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-blue-400/10 text-blue-400'}`}>
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
                                <span>Joined {new Date(user.joined).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
