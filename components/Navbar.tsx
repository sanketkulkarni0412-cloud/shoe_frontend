"use client";

import Link from 'next/link';
import { ShoppingCart, Menu, Search, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-black border-b border-white/10 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-2xl font-bold tracking-wider">
                            SHOE<span className="text-primary">SHOP</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            {['Sports', 'Running', 'Casual', 'Formal', 'Sneakers'].map((item) => (
                                <Link
                                    key={item}
                                    href={`/products?category=${item}`}
                                    className="text-gray-300 hover:text-white hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium uppercase tracking-wide"
                                >
                                    {item}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Icons */}
                    <div className="flex items-center gap-4">
                        <button className="text-gray-300 hover:text-white">
                            <Search className="h-6 w-6" />
                        </button>
                        <Link href="/cart" className="text-gray-300 hover:text-white relative">
                            <ShoppingCart className="h-6 w-6" />
                            <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                0
                            </span>
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
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-secondary">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {['Sports', 'Running', 'Casual', 'Formal', 'Sneakers'].map((item) => (
                            <Link
                                key={item}
                                href={`/products?category=${item}`}
                                onClick={() => setIsOpen(false)}
                                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
