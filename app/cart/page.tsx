"use client";

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();

    if (cart.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-4xl font-bold mb-4 text-black dark:text-white">Your Cart is Empty</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-8">Looks like you haven't added any premium footwear yet.</p>
                <Link href="/products" className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-full font-bold transition-colors">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold mb-8 uppercase tracking-wider text-black dark:text-white">Shopping Cart</h1>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Cart Items */}
                <div className="flex-grow space-y-6">
                    {cart.map((item) => (
                        <div key={item.id} className="bg-secondary dark:bg-secondary p-4 rounded-lg flex gap-4 border border-border dark:border-white/5 items-center shadow-sm dark:shadow-none">
                            <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 dark:bg-black/20 rounded overflow-hidden">
                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                            </div>

                            <div className="flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-lg text-black dark:text-white">{item.name}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.brand}</p>
                                        <div className="flex gap-4 mt-1">
                                            {item.size && <span className="text-xs text-primary font-bold">Size: {item.size}</span>}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id, item.size)}
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3 bg-gray-100 dark:bg-black/30 rounded-full px-3 py-1 border border-border dark:border-white/10">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                                            className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-4 text-center font-bold text-black dark:text-white">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                            className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-black dark:text-white">
                                            ₹{((item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price) * item.quantity).toLocaleString('en-IN')}
                                        </p>
                                        {item.discount > 0 && <div className="text-xs text-green-600 dark:text-green-400">Saved {item.discount}%</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:w-96 flex-shrink-0">
                    <div className="bg-secondary dark:bg-secondary p-6 rounded-lg border border-border dark:border-white/5 sticky top-24 shadow-sm dark:shadow-none">
                        <h2 className="text-xl font-bold mb-6 uppercase tracking-wide text-black dark:text-white">Order Summary</h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>Subtotal</span>
                                <span className="text-black dark:text-white">₹{totalPrice.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>Shipping</span>
                                <span className="text-black dark:text-white">₹0</span>
                            </div>
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>Tax</span>
                                <span className="text-black dark:text-white">₹0.00</span>
                            </div>
                            <div className="h-px bg-gray-200 dark:bg-white/10 my-4" />
                            <div className="flex justify-between text-xl font-bold text-black dark:text-white">
                                <span>Total</span>
                                <span className="text-primary">₹{totalPrice.toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        <Link href="/checkout" className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 text-center">
                            Checkout <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
