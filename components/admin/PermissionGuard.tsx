"use client";

import { useAuth } from '@/context/AuthContext';
import { ReactNode } from 'react';

interface PermissionGuardProps {
    children: ReactNode;
    requiredRole: 'admin' | 'staff';
    fallback?: ReactNode;
}

export default function PermissionGuard({ children, requiredRole, fallback = null }: PermissionGuardProps) {
    const { user } = useAuth();

    if (!user) return null;

    // Admin has access to everything
    if (user.role === 'admin') {
        return <>{children}</>;
    }

    // Staff check
    if (requiredRole === 'staff' && (user.role === 'staff' || user.role === 'admin')) {
        return <>{children}</>;
    }

    // Access Denied
    return <>{fallback}</>;
}
