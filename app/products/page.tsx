import { getProducts } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import BlurText from '@/components/BlurText';

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ProductsPage({ searchParams }: Props) {
    const params = await searchParams;
    const category = typeof params.category === 'string' ? params.category : undefined;
    const isSale = params.sale === 'true';
    const search = typeof params.search === 'string' ? params.search : undefined;

    const products = await getProducts(category, isSale, search);

    return (
        <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-white/10 pb-6">
                    <div className="text-4xl font-bold uppercase tracking-widest">
                        <BlurText
                            text={search ? `Results for "${search}"` : category ? `${category} Collection` : isSale ? 'On Sale' : 'All Products'}
                            delay={50}
                            animateBy="letters"
                            direction="top"
                            className="text-4xl font-bold uppercase tracking-widest"
                        />
                    </div>
                    <p className="text-gray-400 mt-2 md:mt-0">
                        Showing {products.length} result{products.length !== 1 ? 's' : ''}
                    </p>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-bold mb-4">No products found</h2>
                        <p className="text-gray-400">Try checking a different category.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product: any) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
