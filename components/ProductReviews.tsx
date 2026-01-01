"use client";

import { useState, useEffect } from "react";
import { Star, User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Button from "./ui/Button";

interface Review {
    id: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
    productId: string;
}

const ProductReviews = ({ productId }: { productId: string }) => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [fetchError, setFetchError] = useState("");

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const { collection, query, where, getDocs, getFirestore, orderBy } = await import("firebase/firestore");
                const db = getFirestore();
                const q = query(
                    collection(db, "reviews"),
                    where("productId", "==", productId),
                    orderBy("createdAt", "desc")
                );

                const querySnapshot = await getDocs(q);
                const fetchedReviews: Review[] = [];
                querySnapshot.forEach((doc) => {
                    fetchedReviews.push({ id: doc.id, ...doc.data() } as Review);
                });
                setReviews(fetchedReviews);
            } catch (error) {
                console.error("Error fetching reviews:", error);
                setFetchError("Could not load reviews.");
            }
        };

        fetchReviews();
    }, [productId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setIsLoading(true);

        try {
            const { collection, addDoc, getFirestore } = await import("firebase/firestore");
            const db = getFirestore();
            const newReview = {
                userId: user.uid,
                userName: user.name,
                rating,
                comment,
                productId,
                createdAt: new Date().toISOString(),
                status: 'approved' // Instant approval
            };

            const docRef = await addDoc(collection(db, "reviews"), newReview);

            // Optimistic update
            setReviews([{ id: docRef.id, ...newReview } as Review, ...reviews]);
            setComment("");
            setRating(5);
        } catch (error) {
            console.error("Error adding review:", error);
            alert("Failed to submit review.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="mt-16 border-t border-white/10 pt-10">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                Customer Reviews <span className="text-gray-400 text-lg font-normal">({reviews.length})</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Review Form */}
                <div className="bg-secondary/50 p-6 rounded-xl border border-white/5 h-fit">
                    <h3 className="text-xl font-bold mb-4">Write a Review</h3>
                    {user ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            type="button"
                                            key={star}
                                            onClick={() => setRating(star)}
                                            className={`${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'} transition-colors`}
                                        >
                                            <Star className={`w-6 h-6 ${star <= rating ? 'fill-current' : ''}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Comment</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    required
                                    rows={4}
                                    placeholder="Share your thoughts about this product..."
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors"
                                />
                            </div>
                            <Button type="submit" isLoading={isLoading} className="w-full">
                                Submit Review
                            </Button>
                        </form>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-400 mb-4">Please log in to write a review.</p>
                            <Button variant="outline" onClick={() => window.location.href = '/login'}>
                                Log In
                            </Button>
                        </div>
                    )}
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                    {reviews.length === 0 ? (
                        <p className="text-gray-400 italic">No reviews yet. Be the first to review!</p>
                    ) : (
                        reviews.map((review) => (
                            <div key={review.id} className="bg-secondary p-4 rounded-lg border border-white/5">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                            <UserIcon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{review.userName}</p>
                                            <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex text-yellow-400">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-700'}`} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-300 text-sm mt-2">{review.comment}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProductReviews;
