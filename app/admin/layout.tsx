"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/admin/Sidebar';
import PermissionGuard from '@/components/admin/PermissionGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/admin/login');
            } else if (user.role !== 'admin') {
                // Don't auto-redirect, let them see the access denied screen with logout
                // router.push('/'); 
            } else {
                setIsAuthorized(true);
            }
        }
    }, [user, loading, router]);

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;

    if (user && user.role !== 'admin') {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <div className="bg-[#111] border border-white/10 p-8 rounded-xl max-w-md w-full text-center space-y-6">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-2">Access Restricted</h1>
                        <p className="text-gray-400">Your account does not have administrator privileges.</p>
                    </div>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => router.push('/')}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                        >
                            Go Home
                        </button>
                        <button
                            onClick={() => { logout(); router.push('/admin/login'); }}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        >
                            Logout & Switch
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <PermissionGuard requiredRole="staff" fallback={null}>
            <div className="flex min-h-screen bg-black text-white">
                <AdminSidebar />
                <main className="flex-1 p-8 overflow-y-auto h-screen bg-black">
                    {children}
                </main>
            </div>
        </PermissionGuard>
    );
}
