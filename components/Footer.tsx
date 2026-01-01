import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="bg-secondary text-gray-300 py-12 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <Link href="/" className="text-2xl font-bold tracking-wider text-white">
                        SHOE<span className="text-primary">SHOP</span>
                    </Link>
                    <p className="mt-4 text-sm text-gray-400">
                        Premium footwear for every occasion. Experience comfort and style like never before.
                    </p>
                </div>

                <div>
                    <h3 className="text-white font-bold uppercase tracking-wider mb-4">Shop</h3>
                    <div className="flex flex-col gap-2">
                        <Link href="/products" className="hover:text-primary transition-colors">All Products</Link>
                        <Link href="/products?sale=true" className="hover:text-primary transition-colors">Sale</Link>
                        <Link href="/products?category=Sports" className="hover:text-primary transition-colors">Sports</Link>
                        <Link href="/products?category=Formal" className="hover:text-primary transition-colors">Formal</Link>
                    </div>
                </div>

                <div>
                    <h3 className="text-white font-bold uppercase tracking-wider mb-4">Support</h3>
                    <div className="flex flex-col gap-2">
                        <Link href="/track-order" className="hover:text-primary transition-colors">Track Your Order</Link>
                        <Link href="#" className="hover:text-primary transition-colors">Contact Us</Link>
                        <Link href="#" className="hover:text-primary transition-colors">Shipping & Returns</Link>
                        <Link href="#" className="hover:text-primary transition-colors">Size Guide</Link>
                        <Link href="#" className="hover:text-primary transition-colors">FAQ</Link>
                    </div>
                </div>

                <div>
                    <h3 className="text-white font-bold uppercase tracking-wider mb-4">Newsletter</h3>
                    <p className="mb-4 text-sm">Subscribe to get special offers, free giveaways, and deals.</p>
                    <form className="flex gap-2">
                        <input type="email" placeholder="Your email" className="bg-black/50 border border-white/20 rounded px-3 py-2 w-full focus:outline-none focus:border-primary text-white" />
                        <button className="bg-primary hover:bg-red-700 text-white px-4 py-2 rounded font-bold transition-colors">
                            GO
                        </button>
                    </form>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-white/10 text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Shoe Shop. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
