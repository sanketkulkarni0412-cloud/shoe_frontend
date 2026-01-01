"use client";

import Link from 'next/link';
import { CheckCircle, Home, ShoppingBag, Download } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { API_URL } from '@/lib/api';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { InvoicePDF } from '@/components/InvoicePDF';

export default function OrderSuccessPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (orderId) {
            fetch(`${API_URL}/orders/${orderId}`)
                .then(res => res.json())
                .then(data => {
                    if (!data.error) setOrder(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to load order", err);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [orderId]);

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
            <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <CheckCircle className="w-12 h-12 text-green-500" />
            </div>

            <h1 className="text-5xl font-bold mb-4 uppercase tracking-wider">Order Confirmed!</h1>

            {order && (
                <div className="flex items-center gap-2 mb-4 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                    <p className="text-xl">
                        Order ID: <span className="font-mono text-primary font-bold">{order.customId || '#' + order.id.slice(0, 8)}</span>
                    </p>
                    <button
                        onClick={() => navigator.clipboard.writeText(order.customId || order.id)}
                        className="text-gray-400 hover:text-white transition-colors text-sm underline"
                    >
                        Copy
                    </button>
                </div>
            )}

            <p className="text-gray-400 text-xl mb-8 max-w-md">
                Thank you for your purchase. Your premium footwear is being prepared and will be shipped shortly.
            </p>

            {order && (
                <div className="mb-8">
                    <PDFDownloadLink
                        document={<InvoicePDF order={order} />}
                        fileName={`invoice-${order.id.slice(0, 8)}.pdf`}
                        className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-full font-bold transition-all flex items-center justify-center gap-2"
                    >
                        {({ blob, url, loading, error }) =>
                            loading ? 'Generating Invoice...' : <><Download className="w-4 h-4" /> Download Invoice (PDF)</>
                        }
                    </PDFDownloadLink>
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
                <Link
                    href="/products"
                    className="bg-primary hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                    <ShoppingBag className="w-5 h-5" /> Continue Shopping
                </Link>
                <Link
                    href="/"
                    className="bg-secondary hover:bg-white/10 text-white border border-white/10 px-8 py-4 rounded-full font-bold transition-all flex items-center justify-center gap-2"
                >
                    <Home className="w-5 h-5" /> Return Home
                </Link>
            </div>
        </div>
    );
}
