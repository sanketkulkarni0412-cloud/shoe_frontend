"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/admin/Sidebar';
import PermissionGuard from '@/components/admin/PermissionGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login');
            } else if (user.role !== 'admin') {
                router.push('/'); // Redirect non-admins to home
            } else {
                setIsAuthorized(true);
            }
        }
    }, [user, loading, router]);
    return (
        <PermissionGuard requiredRole="staff" fallback={<div className="p-10 text-center text-red-500">Access Restricted</div>}>
            <div className="flex min-h-screen bg-black text-white">
                <AdminSidebar />
                <main className="flex-1 p-8 overflow-y-auto h-screen bg-black">
                    {children}
                </main>
            </div>
        </PermissionGuard>
    );
}
