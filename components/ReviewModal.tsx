"use client";

import { useState } from "react";
import { Star, X } from "lucide-react";
import Button from "./ui/Button";

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    productName: string;
    onSubmit: (rating: number, comment: string) => Promise<void>;
}

export default function ReviewModal({ isOpen, onClose, productName, onSubmit }: ReviewModalProps) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(rating, comment);
            onClose();
        } catch (error) {
            console.error("Failed to submit review", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#0a0a0a] w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col">
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#0a0a0a]">
                    <h3 className="text-lg font-bold text-white">Review {productName}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-[#0a0a0a]">
                    <div className="flex flex-col items-center gap-2">
                        <label className="text-sm text-gray-400">Rate this product</label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className={`transition-transform hover:scale-110 focus:outline-none ${star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-600"}`}
                                >
                                    <Star className="w-8 h-8" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Write a review</label>
                        <textarea
                            required
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="What did you like or dislike?"
                            className="w-full bg-secondary border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none min-h-[100px]"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            type="button"
                            disabled={loading}
                            size="sm"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            isLoading={loading}
                            size="sm"
                        >
                            Submit Review
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
