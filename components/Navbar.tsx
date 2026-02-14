"use client";

import Link from 'next/link';
import { ShoppingCart, Menu, Search, X, Heart, User, LogOut, Mic, Truck, Boxes, Home, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import TopMarquee from './TopMarquee';
import Button from './ui/Button';
import { useTheme } from 'next-themes';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { isListening, transcript, startListening, hasRecognitionSupport } = useSpeechRecognition();
    const [mounted, setMounted] = useState(false);
    const { cartCount } = useCart();
    const { wishlistCount } = useWishlist();
    const { user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [imageError, setImageError] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Reset image error when buffer changes (e.g. upload)
    useEffect(() => {
        setImageError(false);
    }, [user?.image]);

    useEffect(() => {
        if (transcript) {
            setSearchQuery(transcript);
            router.push(`/products?search=${encodeURIComponent(transcript)}`);
            setIsSearchOpen(false);
        }
    }, [transcript, router]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
        }
    };

    const handleVoiceSearch = () => {
        if (hasRecognitionSupport) {
            startListening();
        } else {
            alert('Voice search is not supported in this browser. Please use Chrome, Edge, or Safari.');
        }
    };

    return (
        <>
            <div className="sticky top-0 z-50">
                {/* Marquee stays on top */}
                <TopMarquee />
                <nav className="bg-white dark:bg-black border-b border-gray-200 dark:border-white/10 backdrop-blur-md transition-colors duration-300">

                    <div className="w-full px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-14">

                            {/* Logo */}
                            <div className="flex-shrink-0">
                                <Link href="/" className="text-2xl font-bold tracking-wider text-black dark:text-white">
                                    SHOE<span className="text-primary">SHOP</span>
                                </Link>
                            </div>

                            <div className="hidden md:block">
                                <div className="ml-10 flex items-baseline space-x-8">
                                    {['Sports', 'Running', 'Casual', 'Formal', 'Sneakers'].map((item) => (
                                        <Link
                                            key={item}
                                            href={`/products?category=${item}`}
                                            className="relative group px-2 py-1.5 rounded-md text-sm font-medium uppercase tracking-wide overflow-hidden"
                                        >
                                            <span className="relative z-10 text-gray-600 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white transition-colors duration-300">{item}</span>
                                            <span className="absolute inset-0 bg-primary/10 dark:bg-primary/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Icons */}
                            <div className="flex items-center gap-2 sm:gap-3">
                                {mounted && (
                                    <button
                                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                        className="text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white p-1 rounded-full transition-colors"
                                        title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                                    >
                                        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                                    </button>
                                )}
                                <Link href="/" className="text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white" title="Home">
                                    <Home className="h-5 w-5" />
                                </Link>


                                <Link href="/wishlist" className="hidden md:block text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white relative">
                                    <Heart className="h-5 w-5" />
                                    {mounted && wishlistCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                            {wishlistCount}
                                        </span>
                                    )}
                                </Link>

                                <Link href="/track-order" className="hidden md:block text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white" title="Track Order">
                                    <Truck className="h-5 w-5" />
                                </Link>

                                {mounted && user ? (
                                    <>
                                        <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white">
                                            <div className="h-7 w-7 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary border border-primary/50 overflow-hidden">
                                                {user.image && !imageError ? (
                                                    <img
                                                        src={user.image}
                                                        alt="User"
                                                        className="w-full h-full object-cover"
                                                        onError={() => setImageError(true)}
                                                    />
                                                ) : (
                                                    <User className="h-3.5 w-3.5" />
                                                )}
                                            </div>
                                            <span className="hidden xl:block text-xs font-medium">
                                                {user.name.split(' ')[0]}
                                            </span>
                                        </Link>
                                        <Link href="/orders" className="hidden md:block text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white" title="Returns & Orders">
                                            <Boxes className="h-5 w-5" />
                                        </Link>
                                    </>
                                ) : (
                                    <Link href="/login">
                                        <Button variant="outline" size="sm" className="flex items-center gap-2 border-border hover:border-primary text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">
                                            <User className="h-3.5 w-3.5" />
                                            <span className="hidden sm:inline">Login / Sign Up</span>
                                        </Button>
                                    </Link>
                                )}

                                <Link href="/cart" className="text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white relative">
                                    <ShoppingCart className="h-5 w-5" />
                                    {mounted && cartCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>
                                <div className="md:hidden">
                                    <button
                                        onClick={() => setIsOpen(!isOpen)}
                                        className="text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white p-2"
                                    >
                                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div >

                    {/* Mobile Menu */}
                    {
                        isOpen && (
                            <div className="md:hidden bg-white dark:bg-secondary border-t border-border">
                                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                                    {['Sports', 'Running', 'Casual', 'Formal', 'Sneakers'].map((item) => (
                                        <Link
                                            key={item}
                                            href={`/products?category=${item}`}
                                            onClick={() => setIsOpen(false)}
                                            className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium border-l-2 border-transparent hover:border-primary hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                                        >
                                            {item}
                                        </Link>
                                    ))}
                                    <div className="border-t border-border my-2 pt-2">
                                        <Link
                                            href="/wishlist"
                                            onClick={() => setIsOpen(false)}
                                            className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2"
                                        >
                                            <Heart className="h-4 w-4" /> Wishlist
                                            {mounted && wishlistCount > 0 && <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full ml-auto">{wishlistCount}</span>}
                                        </Link>
                                        <Link
                                            href="/track-order"
                                            onClick={() => setIsOpen(false)}
                                            className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2"
                                        >
                                            <Truck className="h-4 w-4" /> Track Order
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </nav>

                {/* Search Bar Below Navbar - Only on Homepage */}
                {pathname === '/' && (
                    <div className="absolute top-full left-0 w-full bg-transparent border-b border-white/20 dark:border-white/10 py-3 px-4 backdrop-blur-md z-40">
                        <form
                            onSubmit={handleSearch}
                            className="max-w-4xl mx-auto flex items-center relative"
                        >
                            <Search className="absolute left-4 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="What are you looking for?"
                                className="w-full bg-transparent border border-black/20 dark:border-white/20 rounded-full py-2 pl-12 pr-20 text-sm text-black dark:text-white placeholder-gray-600 dark:placeholder-gray-500 focus:outline-none focus:border-black/50 dark:focus:border-white/50 transition-all"
                            />
                            <div className="absolute right-4 flex items-center gap-2">
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                                {isListening ? (
                                    <button
                                        type="button"
                                        onClick={handleVoiceSearch}
                                        className="text-red-500 animate-pulse"
                                    >
                                        <Mic className="h-4 w-4" />
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleVoiceSearch}
                                        className="text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                                    >
                                        <Mic className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                )}
            </div >
        </>
    );
};

export default Navbar;
