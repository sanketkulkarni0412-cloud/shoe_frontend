import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-secondary text-gray-600 dark:text-gray-300 py-12 border-t border-border transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Brand */}
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold tracking-wider text-black dark:text-white">
                        SHOE<span className="text-primary">SHOP</span>
                    </h3>
                    <p className="text-sm leading-relaxed">
                        Premium footwear for the modern individual. Quality, comfort, and style in every step.
                    </p>
                    <div className="flex space-x-4">
                        <Link href="#" className="text-gray-400 hover:text-primary transition-colors"><Facebook className="w-5 h-5" /></Link>
                        <Link href="#" className="text-gray-400 hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></Link>
                        <Link href="#" className="text-gray-400 hover:text-primary transition-colors"><Instagram className="w-5 h-5" /></Link>
                        <Link href="#" className="text-gray-400 hover:text-primary transition-colors"><Linkedin className="w-5 h-5" /></Link>
                    </div>
                </div>

                {/* Links */}
                <div>
                    <h4 className="text-black dark:text-white font-bold mb-4">Shop</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/products?category=Sports" className="hover:text-primary transition-colors">Sports</Link></li>
                        <li><Link href="/products?category=Casual" className="hover:text-primary transition-colors">Casual</Link></li>
                        <li><Link href="/products?category=Formal" className="hover:text-primary transition-colors">Formal</Link></li>
                        <li><Link href="/products?sale=true" className="hover:text-primary transition-colors">Sale</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-black dark:text-white font-bold mb-4">Support</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/track-order" className="hover:text-primary transition-colors">Track Order</Link></li>
                        <li><Link href="#" className="hover:text-primary transition-colors">Returns & Exchanges</Link></li>
                        <li><Link href="#" className="hover:text-primary transition-colors">Shipping Info</Link></li>
                        <li><Link href="#" className="hover:text-primary transition-colors">Contact Us</Link></li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h4 className="text-black dark:text-white font-bold mb-4">Stay Updated</h4>
                    <p className="text-sm mb-4">Subscribe for exclusive offers and new arrivals.</p>
                    <form className="flex flex-col gap-2">
                        <input
                            type="email"
                            placeholder="Your email"
                            className="bg-white/50 dark:bg-black/50 border border-border rounded px-4 py-2 text-sm text-black dark:text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                        />
                        <button className="bg-primary hover:bg-red-700 text-white px-4 py-2 rounded font-bold transition-colors">
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-border text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Shoe Shop. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
