export const dynamic = "force-dynamic";

import { getProduct, getProducts } from '@/lib/api';
import Link from 'next/link';
import ProductDetailClient from '@/components/ProductDetailClient';

type Props = {
    params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: Props) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-black dark:text-white">
                <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
                <Link href="/products" className="text-primary hover:underline">Return to Shop</Link>
            </div>
        );
    }

    return <ProductDetailClient product={product} />;
}
