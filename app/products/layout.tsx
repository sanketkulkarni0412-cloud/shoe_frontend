import AdsPanel from '@/components/AdsPanel';

export default function ProductsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen">
            {/* Main Content Area - Add padding on right for desktop to accommodate AdsPanel */}
            <div className="w-full md:pr-[300px] transition-all duration-300">
                {children}
            </div>

            {/* Ads Panel - Fixed on right */}
            <AdsPanel />
        </div>
    );
}
