export const dynamic = "force-dynamic";

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { getProducts, getCategories, getProduct } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import SalesTimer from '@/components/SalesTimer';

import nextDynamic from 'next/dynamic';

const HeroVideo = nextDynamic(() => import('@/components/HeroVideo'));
import CategorySection from '@/components/CategorySection';

export default async function Home() {
  const products = await getProducts();
  const categories = await getCategories();
  const saleProducts = products.filter((p: any) => p.isSale).slice(0, 4);
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-transparent dark:from-black dark:via-transparent dark:to-black z-10" />
        <HeroVideo />

        <div className="relative z-20 text-center max-w-4xl px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight text-white drop-shadow-md">
            STEP INTO <span className="text-primary drop-shadow-md">THE FUTURE</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Experience the perfect blend of style, comfort, and performance.
            The new collection is here.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/products" className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-full font-bold text-base transition-all transform hover:scale-105 flex items-center gap-2">
              Shop Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/products?sale=true" className="bg-transparent border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-black dark:text-white px-6 py-3 rounded-full font-bold text-base transition-all">
              View Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <CategorySection categories={categories} />

      {/* Sales Section */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-b from-white to-green-50 dark:from-gray-950 dark:via-[#0a0a0a] dark:to-black">
        {/* Dynamic Background Gradient - Theme Aware */}
        <div className="absolute inset-0 bg-transparent dark:bg-gradient-to-b dark:from-gray-950 dark:via-[#0a0a0a] dark:to-black z-0" />

        {/* Noise Texture Overlay - Dark Mode Only */}
        <div className="absolute inset-0 opacity-[0.03] z-[1] hidden dark:block" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }} />

        {/* Ambient Glow Effects */}
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-primary/10 dark:bg-primary/20 rounded-full blur-[120px] mix-blend-screen opacity-40 animate-pulse-slow pointer-events-none z-[1]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-100 dark:bg-blue-900/10 rounded-full blur-[100px] mix-blend-screen opacity-30 pointer-events-none z-[1]" />

        {/* Abstract Shapes */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-primary/10 rounded-full blur-2xl z-[1]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8 relative">
            {/* Title Glow Effect */}
            <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-40 h-40 bg-primary/10 dark:bg-primary/30 blur-[80px] rounded-full pointer-events-none"></div>

            <div className="relative text-center md:text-left">
              <h2 className="text-5xl md:text-6xl font-black mb-3 tracking-tighter text-black dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:to-gray-400 drop-shadow-sm">
                FLASH SALE
              </h2>
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <div className="h-[2px] w-12 bg-primary"></div>
                <p className="text-primary font-bold uppercase tracking-[0.3em] text-sm">Limited Time Offer</p>
              </div>
            </div>

            <div className="relative z-10">
              <SalesTimer />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {saleProducts.map((product: any, index: number) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Transition Divider */}
      <div className="relative h-px w-full max-w-7xl mx-auto bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent z-20"></div>

      {/* Featured Products */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        {/* Top ambient glow for Featured Section */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-primary/5 blur-3xl rounded-[50%] pointer-events-none mb-10"></div>

        <h2 className="text-3xl font-bold mb-10 uppercase tracking-widest flex items-center justify-between relative z-10 text-black dark:text-white">
          <span className="flex items-center gap-3">
            <span className="w-1.5 h-8 bg-primary rounded-sm"></span>
            Featured
          </span>
          <Link href="/products" className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1 font-medium group">
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product: any, index: number) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
}
