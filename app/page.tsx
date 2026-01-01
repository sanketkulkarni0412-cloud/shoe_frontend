import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { getProducts, getCategories, getProduct } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import SalesTimer from '@/components/SalesTimer';

export default async function Home() {
  const products = await getProducts();
  const categories = await getCategories();
  const saleProducts = products.filter((p: any) => p.isSale).slice(0, 4);
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10" />
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/Dynamic_Sneaker_Video_Generation.mp4" type="video/mp4" />
        </video>

        <div className="relative z-20 text-center max-w-4xl px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            STEP INTO <span className="text-primary">THE FUTURE</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Experience the perfect blend of style, comfort, and performance.
            The new collection is here.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/products" className="bg-primary hover:bg-red-700 text-white px-6 py-3 rounded-full font-bold text-base transition-all transform hover:scale-105 flex items-center gap-2">
              Shop Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/products?sale=true" className="bg-transparent border border-white hover:bg-white hover:text-black text-white px-6 py-3 rounded-full font-bold text-base transition-all">
              View Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center uppercase tracking-widest">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.slice(0, 4).map((cat: string) => (
            <Link key={cat} href={`/products?category=${cat}`} className="group relative h-40 overflow-hidden rounded-lg border border-white/10 hover:border-primary/50 transition-colors">
              {/* Background Image - Red Shoe */}
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center opacity-40 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500 ease-out" />

              {/* Overlay for legibility */}
              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors mb-0" />

              <div className="absolute inset-0 flex items-center justify-center z-10">
                <span className="text-xl font-bold uppercase tracking-wider group-hover:text-primary transition-colors transform group-hover:scale-105 duration-300">{cat}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Sales Section */}
      <section className="py-20 bg-secondary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
            <div>
              <h2 className="text-4xl font-bold mb-2">FLASH SALE</h2>
              <p className="text-primary font-bold uppercase tracking-wider">Limited Time Offer</p>
            </div>
            <SalesTimer />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {saleProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 uppercase tracking-widest flex items-center justify-between">
          <span>Featured</span>
          <Link href="/products" className="text-sm text-primary hover:text-white transition-colors flex items-center gap-1 font-medium">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
