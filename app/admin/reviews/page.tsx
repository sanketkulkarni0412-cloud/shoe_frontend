"use client";

import { useState, useEffect } from 'react';
import { Star, Check, Trash, X } from 'lucide-react';
import { collection, getDocs, doc, updateDoc, deleteDoc, getFirestore, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const items: any[] = [];
            querySnapshot.forEach((doc) => {
                items.push({ id: doc.id, ...doc.data() });
            });
            setReviews(items);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this review?")) {
            try {
                await deleteDoc(doc(db, "reviews", id));
                setReviews(reviews.filter(r => r.id !== id));
            } catch (error) {
                alert("Failed to delete review");
            }
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Review Moderation</h1>

            {loading ? (
                <div className="text-center py-10">Loading reviews...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-secondary p-6 rounded-lg border border-white/10 relative group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-1 mb-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-700'}`} />
                                        ))}
                                    </div>
                                    <p className="font-bold text-sm">{review.userName}</p>
                                    <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                                </div>
                                <button
                                    onClick={() => handleDelete(review.id)}
                                    className="p-2 hover:bg-red-500/20 text-red-500 rounded transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash className="w-4 h-4" />
                                </button>
                            </div>

                            <p className="text-gray-300 text-sm italic">"{review.comment}"</p>

                            <div className="mt-4 pt-4 border-t border-white/5 text-xs text-gray-500 flex justify-between">
                                <span>Product ID: {review.productId}</span>
                            </div>
                        </div>
                    ))}
                    {!loading && reviews.length === 0 && (
                        <div className="col-span-full text-center text-gray-500 py-10">No reviews found.</div>
                    )}
                </div>
            )}
        </div>
    );
}
