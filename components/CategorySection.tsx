"use client";

import CategoryCard from './CategoryCard';

interface CategorySectionProps {
    categories: string[];
}

export default function CategorySection({ categories }: CategorySectionProps) {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-10 text-center uppercase tracking-widest">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.slice(0, 4).map((cat, index) => (
                    <CategoryCard key={cat} category={cat} index={index} />
                ))}
            </div>
        </section>
    );
}
