"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag, Users, Star, Megaphone, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { name: 'Products', icon: Package, href: '/admin/products' },
    { name: 'Orders', icon: ShoppingBag, href: '/admin/orders' },
    { name: 'Customers', icon: Users, href: '/admin/users' },
    { name: 'Reviews', icon: Star, href: '/admin/reviews' },
    { name: 'Ads & Banners', icon: Megaphone, href: '/admin/ads' },
];

const AdminSidebar = () => {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <aside className="w-64 bg-secondary border-r border-white/10 flex flex-col h-screen sticky top-0">
            <div className="p-6 border-b border-white/10">
                <Link href="/" className="text-2xl font-bold tracking-wider block">
                    SHOE<span className="text-primary">ADMIN</span>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                    ? 'bg-primary text-white font-bold shadow-lg shadow-primary/20'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'}`} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/10">
                <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
