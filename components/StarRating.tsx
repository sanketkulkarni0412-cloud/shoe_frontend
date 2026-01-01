"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
    rating: number; // 0 to 5
    setRating?: (rating: number) => void;
    readonly?: boolean;
    size?: number;
}

export default function StarRating({ rating, setRating, readonly = false, size = 20 }: StarRatingProps) {
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => !readonly && setRating && setRating(star)}
                    className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
                    disabled={readonly}
                >
                    <Star
                        size={size}
                        className={`${star <= rating ? "fill-yellow-500 text-yellow-500" : "text-gray-600"
                            }`}
                    />
                </button>
            ))}
        </div>
    );
}
