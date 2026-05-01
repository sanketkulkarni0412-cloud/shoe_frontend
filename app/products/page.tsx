export const dynamic = "force-dynamic"; // 🔥 MOST IMPORTANT

import { getProducts } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import BlurText from '@/components/BlurText';
import PriceFilter from '@/components/PriceFilter';

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ProductsPage({ searchParams }: Props) {
    const params = await searchParams;

    const category = typeof params.category === 'string' ? params.category : undefined;
    const isSale = params.sale === 'true';
    const search = typeof params.search === 'string' ? params.search : undefined;

    const minPrice = typeof params.minPrice === 'string' ? parseInt(params.minPrice) : undefined;
    const maxPrice = typeof params.maxPrice === 'string' ? parseInt(params.maxPrice) : undefined;

    let products: any[] = [];

    try {
        products = await getProducts(category, isSale, search, minPrice, maxPrice);
    } catch (err) {
        console.error("Error fetching products:", err);
        products = []; // fallback
    }

    return (
        <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-200 dark:border-white/10 pb-6">
                    <div className="text-4xl font-bold uppercase tracking-widest">
                        <BlurText
                            text={search ? `Results for "${search}"` : category ? `${category} Collection` : isSale ? 'On Sale' : 'All Products'}
                            delay={50}
                            animateBy="letters"
                            direction="top"
                            className="text-4xl font-bold uppercase tracking-widest"
                        />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 md:mt-0">
                        Showing {products.length} result{products.length !== 1 ? 's' : ''}
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <aside className="w-full lg:w-64 flex-shrink-0">
                        <div className="sticky top-24">
                            <PriceFilter />
                        </div>
                    </aside>

                    <div className="flex-1">
                        {products.length === 0 ? (
                            <div className="text-center py-20 bg-gray-100 dark:bg-secondary/30 rounded-xl border border-gray-200 dark:border-white/5">
                                <h2 className="text-2xl font-bold mb-4">No products found</h2>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">
                                    Try adjusting your filters or checking a different category.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                                {products.map((product: any, index: number) => (
                                    <ProductCard key={product.id} product={product} index={index} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}