"use client";

import Link from 'next/link';
import { ShoppingCart, Menu, Search, X, Heart, User, LogOut, Mic, Truck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import TopMarquee from './TopMarquee';
import Button from './ui/Button';

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
    const [imageError, setImageError] = useState(false);

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
                <nav className="bg-gradient-to-r from-black via-gray-900 to-red-950 border-b border-white/10">

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-14">

                            {/* Logo */}
                            <div className="flex-shrink-0">
                                <Link href="/" className="text-2xl font-bold tracking-wider">
                                    SHOE<span className="text-primary">SHOP</span>
                                </Link>
                            </div>

                            <div className="hidden md:block">
                                <div className="ml-4 flex items-baseline space-x-4">
                                    {['Sports', 'Running', 'Casual', 'Formal', 'Sneakers'].map((item) => (
                                        <Link
                                            key={item}
                                            href={`/products?category=${item}`}
                                            className="relative group px-2 py-1.5 rounded-md text-xs font-medium uppercase tracking-wide overflow-hidden"
                                        >
                                            <span className="relative z-10 text-gray-300 group-hover:text-white transition-colors duration-300">{item}</span>
                                            <span className="absolute inset-0 bg-primary/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Icons */}
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className={`flex items-center transition-all duration-300 ${isSearchOpen ? 'w-full md:w-64' : 'w-auto'}`}>
                                    {isSearchOpen ? (
                                        <form
                                            onSubmit={handleSearch}
                                            className="flex items-center w-full relative bg-white/10 dark:bg-white/5 border border-white/10 rounded-full px-3 py-1 transition-all focus-within:ring-1 focus-within:ring-primary/50 focus-within:border-primary/50"
                                        >
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Search..."
                                                className="w-full bg-transparent border-none text-white placeholder-gray-400 focus:outline-none text-xs"
                                                autoFocus
                                                onBlur={() => !searchQuery && setIsSearchOpen(false)}
                                            />
                                            <div className="flex items-center gap-2 ml-2">
                                                {isListening ? (
                                                    <button
                                                        type="button"
                                                        onClick={handleVoiceSearch}
                                                        className="text-red-500 animate-pulse"
                                                    >
                                                        <Mic className="h-3.5 w-3.5" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={handleVoiceSearch}
                                                        className="text-gray-400 hover:text-white transition-colors"
                                                    >
                                                        <Mic className="h-3.5 w-3.5" />
                                                    </button>
                                                )}
                                                <button type="submit" className="text-gray-400 hover:text-white transition-colors">
                                                    <Search className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <button
                                            onClick={() => setIsSearchOpen(true)}
                                            className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                                        >
                                            <Search className="h-5 w-5" />
                                        </button>
                                    )}
                                </div>

                                <Link href="/wishlist" className="hidden md:block text-gray-300 hover:text-white relative">
                                    <Heart className="h-5 w-5" />
                                    {mounted && wishlistCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                            {wishlistCount}
                                        </span>
                                    )}
                                </Link>

                                <Link href="/track-order" className="hidden md:block text-gray-300 hover:text-white" title="Track Order">
                                    <Truck className="h-5 w-5" />
                                </Link>

                                {mounted && user ? (
                                    <Link href="/dashboard" className="flex items-center gap-2 text-gray-300 hover:text-white">
                                        <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/50 overflow-hidden">
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
                                ) : (
                                    <Link href="/login">
                                        <Button variant="outline" size="sm" className="flex items-center gap-2 border-white/20 hover:border-primary">
                                            <User className="h-3.5 w-3.5" />
                                            <span className="hidden sm:inline">Login / Sign Up</span>
                                        </Button>
                                    </Link>
                                )}

                                <Link href="/cart" className="text-gray-300 hover:text-white relative">
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
                                        className="text-gray-300 hover:text-white p-2"
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
                            <div className="md:hidden bg-secondary border-t border-white/10">
                                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                                    {['Sports', 'Running', 'Casual', 'Formal', 'Sneakers'].map((item) => (
                                        <Link
                                            key={item}
                                            href={`/products?category=${item}`}
                                            onClick={() => setIsOpen(false)}
                                            className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium border-l-2 border-transparent hover:border-primary hover:bg-white/5 transition-all"
                                        >
                                            {item}
                                        </Link>
                                    ))}
                                    <div className="border-t border-white/10 my-2 pt-2">
                                        <Link
                                            href="/wishlist"
                                            onClick={() => setIsOpen(false)}
                                            className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2"
                                        >
                                            <Heart className="h-4 w-4" /> Wishlist
                                            {mounted && wishlistCount > 0 && <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full ml-auto">{wishlistCount}</span>}
                                        </Link>
                                        <Link
                                            href="/track-order"
                                            onClick={() => setIsOpen(false)}
                                            className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2"
                                        >
                                            <Truck className="h-4 w-4" /> Track Order
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </nav >
            </div >
        </>
    );
};

export default Navbar;
