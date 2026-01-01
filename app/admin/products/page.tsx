"use client";

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash, Search } from 'lucide-react';
import { API_URL } from '@/lib/api'; // Or use firebase directly
import Link from 'next/link';

// We'll fetch from Firebase directly for Admin to ensure real-time updates and easier write access
import { collection, getDocs, deleteDoc, doc, getFirestore } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';

export default function AdminProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            // For now, let's try to fetch from API first, if that fails or is static, we might need a hybrid approach.
            // Actually, best to read from Firestore if we are migrating.
            // Let's assume we want to view what's in Firestore.
            const querySnapshot = await getDocs(collection(db, "products"));
            const items: any[] = [];
            querySnapshot.forEach((doc) => {
                items.push({ id: doc.id, ...doc.data() });
            });
            setProducts(items);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteDoc(doc(db, "products", id));
                setProducts(products.filter(p => p.id !== id));
            } catch (error) {
                console.error("Error deleting product:", error);
                alert("Failed to delete product");
            }
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Products</h1>
                <Link href="/admin/products/new" className="bg-primary hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                    <Plus className="w-5 h-5" /> Add Product
                </Link>
            </div>

            <div className="bg-secondary p-4 rounded-lg mb-6 border border-white/10 flex items-center gap-2">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search products..."
                    className="bg-transparent border-none focus:outline-none text-white w-full"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="text-center py-10">Loading products...</div>
            ) : (
                <div className="bg-secondary rounded-lg border border-white/10 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-black/20 text-gray-400 uppercase text-xs">
                            <tr>
                                <th className="p-4">Product</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Stock</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/10 rounded overflow-hidden relative">
                                            {/* Use fallback image if URL is invalid or relative */}
                                            <Image
                                                src={product.image || '/placeholder.png'}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <span className="font-bold">{product.name}</span>
                                    </td>
                                    <td className="p-4 text-gray-400">{product.category || 'N/A'}</td>
                                    <td className="p-4 font-mono">₹{product.price?.toLocaleString('en-IN')}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${(product.stock || 0) > 10 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                                            }`}>
                                            {product.stock || 0} in stock
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <button className="p-2 hover:bg-blue-500/20 text-blue-500 rounded transition-colors">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="p-2 hover:bg-red-500/20 text-red-500 rounded transition-colors"
                                        >
                                            <Trash className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!loading && filteredProducts.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            No products found. Add some products to get started.
                            <br /><span className="text-xs">(Note: Static file products are not shown here, only Firestore Products)</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
