"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserReviews } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Star, ArrowLeft, MessageSquare, Trash2 } from "lucide-react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

interface Review {
    id: string;
    productId: string;
    productName?: string; // Ideally this would come from backend or we fetch product details
    rating: number;
    comment: string;
    status: string;
    createdAt: string;
}

export default function MyReviewsPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/login');
            } else {
                fetchReviews();
            }
        }
    }, [user, authLoading, router]);

    const fetchReviews = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const data = await getUserReviews(user.uid);
            setReviews(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load reviews");
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-black pt-24 px-4">
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="h-8 w-48 bg-white/10 rounded animate-pulse" />
                    {[1, 2].map(i => (
                        <div key={i} className="h-40 bg-white/5 rounded-xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground pt-24 pb-12 px-4">
            <Toaster position="top-right" />
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/dashboard" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">My Reviews</h1>
                        <p className="text-gray-400">See what you have shared</p>
                    </div>
                </div>

                {reviews.length > 0 ? (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div key={review.id} className="bg-[#111] border border-white/10 p-6 rounded-xl hover:border-white/20 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        {/* Since we don't assume we have product names easily, we show Generic or ID for now unless we enhance backend */}
                                        <h3 className="font-bold text-lg mb-1">{review.productName || 'Product Review'}</h3>
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${i < review.rating ? "fill-primary text-primary" : "text-gray-600"}`}
                                                />
                                            ))}
                                            <span className="text-gray-500 text-sm ml-2">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${review.status === 'approved' ? 'bg-green-500/10 text-green-500' :
                                        review.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                                            'bg-yellow-500/10 text-yellow-500'
                                        }`}>
                                        {review.status}
                                    </div>
                                </div>
                                <p className="text-gray-300 bg-white/5 p-4 rounded-lg italic border-l-2 border-white/20">
                                    "{review.comment}"
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="w-8 h-8 text-gray-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No reviews yet</h3>
                        <p className="text-gray-400 max-w-sm mx-auto">
                            Share your thoughts on products you've purchased to see them here.
                        </p>
                        <Link href="/orders">
                            <button className="mt-6 px-6 py-2 bg-primary hover:bg-red-700 text-white rounded-full font-bold transition-all">
                                Rate Recent Orders
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
