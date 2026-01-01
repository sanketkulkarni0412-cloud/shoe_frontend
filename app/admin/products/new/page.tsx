"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, getFirestore } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function NewProductPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        category: '',
        price: '',
        originalPrice: '',
        description: '',
        image: '',
        stock: '100',
        isSale: false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await addDoc(collection(db, "products"), {
                ...formData,
                price: Number(formData.price),
                originalPrice: Number(formData.originalPrice),
                stock: Number(formData.stock),
                createdAt: new Date().toISOString(),
                sizes: [7, 8, 9, 10, 11] // Default sizes for shoe shop
            });
            router.push('/admin/products');
        } catch (error) {
            console.error("Error adding product:", error);
            alert("Failed to add product");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <Link href="/admin/products" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6">
                <ArrowLeft className="w-4 h-4" /> Back to Products
            </Link>

            <h1 className="text-3xl font-bold mb-8">Add New Product</h1>

            <form onSubmit={handleSubmit} className="bg-secondary p-8 rounded-xl border border-white/5 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-400 mb-2">Product Name</label>
                        <input name="name" required onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded p-3 focus:border-primary focus:outline-none text-white" />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2">Brand</label>
                        <input name="brand" required onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded p-3 focus:border-primary focus:outline-none text-white" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-400 mb-2">Category</label>
                        <select name="category" required onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded p-3 focus:border-primary focus:outline-none text-white">
                            <option value="">Select Category</option>
                            <option value="Sports">Sports</option>
                            <option value="Running">Running</option>
                            <option value="Casual">Casual</option>
                            <option value="Formal">Formal</option>
                            <option value="Sneakers">Sneakers</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2">Stock Quantity</label>
                        <input name="stock" type="number" required onChange={handleChange} value={formData.stock} className="w-full bg-black/50 border border-white/10 rounded p-3 focus:border-primary focus:outline-none text-white" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-400 mb-2">Price (₹)</label>
                        <input name="price" type="number" required onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded p-3 focus:border-primary focus:outline-none text-white" />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2">Original Price (₹)</label>
                        <input name="originalPrice" type="number" required onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded p-3 focus:border-primary focus:outline-none text-white" />
                    </div>
                </div>

                <div>
                    <label className="block text-gray-400 mb-2">Image URL</label>
                    <input name="image" required onChange={handleChange} placeholder="https://..." className="w-full bg-black/50 border border-white/10 rounded p-3 focus:border-primary focus:outline-none text-white" />
                </div>

                <div>
                    <label className="block text-gray-400 mb-2">Description</label>
                    <textarea name="description" required rows={4} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded p-3 focus:border-primary focus:outline-none text-white" />
                </div>

                <div className="flex items-center gap-2">
                    <input type="checkbox" name="isSale" id="isSale" onChange={handleChange as any} className="w-5 h-5 accent-primary" />
                    <label htmlFor="isSale" className="font-bold">Mark as On Sale</label>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-red-700 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all mt-4"
                >
                    {isLoading ? 'Saving...' : <><Save className="w-5 h-5" /> Save Product</>}
                </button>
            </form>
        </div>
    );
}
