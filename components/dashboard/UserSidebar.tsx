"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
    LayoutDashboard,
    ShoppingBag,
    Truck,
    Star,
    Heart,
    Settings,
    LogOut,
    Menu,
    X,
    User,
    Sun,
    Moon,
    ChevronLeft,
    ChevronRight,
    SidebarClose,
    SidebarOpen,
    Eye
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';

const UserSidebar = () => {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [blurLevel, setBlurLevel] = useState<'none' | 'sm' | 'md' | 'lg'>('sm');
    const [uploading, setUploading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(user?.image || null);

    // Update local state when user context changes (e.g. initial load)
    // We use a useEffect to sync, but only if we haven't set a local preview recently? 
    // Actually, simple sync is fine.
    // useEffect(() => {
    //     if (user?.image) setAvatarUrl(user.image);
    // }, [user]);


    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            alert('File size must be less than 5MB');
            return;
        }

        if (!user) {
            console.error("User is not authenticated");
            return;
        }

        try {
            setUploading(true);
            const { storage, db, auth } = await import('@/lib/firebase');
            const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
            const { doc, updateDoc } = await import('firebase/firestore');
            const { updateProfile } = await import('firebase/auth');

            const storageRef = ref(storage, `users/${user.uid}/profile_${Date.now()}.jpg`);

            // Upload
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);

            // Update Firestore
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                image: downloadURL
            });

            // Update Auth Profile (try to keep them in sync)
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, {
                    photoURL: downloadURL
                });
            }

            // Update local state immediately for preview
            setAvatarUrl(downloadURL);

            // Reload page to reflect changes in Navbar/Context (simplest way to sync Context for now)
            // window.location.reload(); 
            // Or just alert success

        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Failed to upload image. Please try again.");
        } finally {
            setUploading(false);
        }
    };


    const links = [
        { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
        { href: '/dashboard/orders', label: 'My Orders', icon: ShoppingBag },
        { href: '/track-order', label: 'Track Order', icon: Truck },
        { href: '/dashboard/reviews', label: 'My Reviews', icon: Star },
        { href: '/dashboard/wishlist', label: 'Wishlist', icon: Heart },
        { href: '/dashboard/settings', label: 'Settings', icon: Settings },
    ];

    const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { theme, setTheme } = useTheme();

    const handleProfileClick = () => {
        setIsProfileMenuOpen(!isProfileMenuOpen);
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
        setIsProfileMenuOpen(false);
    };

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const cycleBlur = (e: React.MouseEvent) => {
        e.stopPropagation();
        const levels: ('none' | 'sm' | 'md' | 'lg')[] = ['none', 'sm', 'md', 'lg'];
        const currentIndex = levels.indexOf(blurLevel);
        setBlurLevel(levels[(currentIndex + 1) % levels.length]);
    };

    const blurClass = {
        none: '',
        sm: 'backdrop-blur-sm',
        md: 'backdrop-blur-md',
        lg: 'backdrop-blur-lg'
    }[blurLevel];

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-secondary border-r border-white/5 relative">
            {/* Backdrop for Click Outside */}
            {isProfileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={() => setIsProfileMenuOpen(false)}
                />
            )}

            {/* User Profile Summary */}
            <div className="p-6 border-b border-white/5 relative z-50">
                <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleProfileClick}
                            className={`w-12 h-12 rounded-full overflow-hidden border-2 cursor-pointer transition-colors ${isProfileMenuOpen ? 'border-primary shadow-lg shadow-primary/20' : 'border-primary/20 bg-primary/20'
                                } flex items-center justify-center`}
                        >
                            {(avatarUrl || user?.image) ? (
                                <img
                                    src={avatarUrl || user?.image}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="w-6 h-6 text-primary" />
                            )}
                        </motion.div>

                        {/* Sliding Menu */}
                        <AnimatePresence>
                            {isProfileMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: -10, scale: 0.95 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="absolute left-14 top-0 bg-secondary/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl p-1.5 w-48 overflow-hidden"
                                >
                                    <button
                                        onClick={handleUploadClick}
                                        disabled={uploading}
                                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-primary hover:text-white transition-colors text-left"
                                    >
                                        <div className="p-1.5 bg-background/50 rounded-full">
                                            {uploading ? (
                                                <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <User className="w-3.5 h-3.5" />
                                            )}
                                        </div>
                                        <span>
                                            {uploading ? 'Uploading...' : 'Change Picture'}
                                        </span>
                                    </button>

                                    <button
                                        onClick={toggleTheme}
                                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-primary hover:text-white transition-colors text-left"
                                    >
                                        <div className="p-1.5 bg-background/50 rounded-full">
                                            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                                        </div>
                                        <span>
                                            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                                        </span>
                                    </button>

                                    <button
                                        onClick={cycleBlur}
                                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-primary hover:text-white transition-colors text-left"
                                    >
                                        <div className="p-1.5 bg-background/50 rounded-full">
                                            <Eye className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="flex-1">Blur: {blurLevel.toUpperCase()}</span>
                                    </button>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className={`overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                        <p className="font-bold text-foreground truncate">{user?.name || 'User'}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto overflow-x-hidden">
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    const Icon = link.icon;
                    return (
                        <div key={link.href} className="relative group">
                            <Link
                                href={link.href}
                                onClick={() => setIsMobileOpen(false)}
                                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${isActive
                                    ? 'bg-primary text-white font-medium shadow-lg shadow-primary/20'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    } ${isCollapsed ? 'justify-center px-0' : ''}`}
                            >
                                <Icon className={`w-5 h-5 min-w-[20px] ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-white transition-colors'}`} />
                                <span className={`transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}`}>
                                    {link.label}
                                </span>
                            </Link>

                            {/* Animated Tooltip for Desktop Collapsed State */}
                            {isCollapsed && (
                                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                    {link.label}
                                    {/* Triangle */}
                                    <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Collapse Toggle (Desktop Only) */}
            <div className="hidden lg:flex p-4 border-t border-white/5 justify-end">
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                    {isCollapsed ? <SidebarOpen className="w-5 h-5" /> : <SidebarClose className="w-5 h-5" />}
                </button>
            </div>

            {/* Logout */}
            <div className="p-4 border-t border-white/5">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Log Out</span>
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Toggle */}
            <div className="lg:hidden fixed bottom-6 right-6 z-50">
                <button
                    onClick={toggleMobile}
                    className="bg-primary text-white p-4 rounded-full shadow-2xl shadow-black border border-white/10"
                >
                    {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Sidebar Backdrop */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={toggleMobile}
                            className={`fixed inset-0 bg-black/60 ${blurClass} z-40 lg:hidden`}
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-72 z-50 lg:hidden"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <aside className={`hidden lg:block fixed inset-y-0 left-0 pt-20 z-30 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
                <div className="h-full overflow-y-auto custom-scrollbar bg-secondary border-r border-white/5">
                    <SidebarContent />
                </div>
            </aside>
        </>
    );
};

export default UserSidebar;
