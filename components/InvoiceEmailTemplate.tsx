"use client";

import Button from '@/components/ui/Button';

interface InvoiceEmailTemplateProps {
    order: any;
    onDownload: () => void;
}

export default function InvoiceEmailTemplate({ order, onDownload }: InvoiceEmailTemplateProps) {
    return (
        <div className="bg-white text-black p-8 max-w-2xl mx-auto rounded-lg shadow-xl font-sans">
            <div className="flex justify-between items-center mb-8 border-b pb-6">
                <div>
                    <h1 className="text-2xl font-bold uppercase tracking-widest text-[#333]">Vogue Kicks</h1>
                    <p className="text-sm text-gray-500">Premium Footwear</p>
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-bold text-gray-800">INVOICE</h2>
                    <p className="text-sm text-gray-500">#{order.customId || order.id.slice(0, 8)}</p>
                    <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Bill To:</h3>
                <p className="font-bold">{order.name || order.customerEmail}</p>
                <p className="text-sm text-gray-600">{order.email || order.customerEmail}</p>
                <p className="text-sm text-gray-600">Payment: {order.paymentMethod}</p>
            </div>

            <table className="w-full mb-8">
                <thead>
                    <tr className="border-b border-gray-200">
                        <th className="text-left py-2 font-bold text-gray-600">Item</th>
                        <th className="text-right py-2 font-bold text-gray-600">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {order.items && order.items.map((item: string, i: number) => (
                        <tr key={i} className="border-b border-gray-100">
                            <td className="py-2 text-gray-800">{item}</td>
                            <td className="py-2 text-right text-gray-800">-</td>
                        </tr>
                    ))}
                    {/* Fallback if detailed items aren't available matching backend stricture */}
                    {!order.items && <tr className="border-b border-gray-100"><td className="py-2 text-gray-800">{order.itemCount} Items</td><td className="py-2 text-right text-gray-800">-</td></tr>}
                </tbody>
                <tfoot>
                    <tr>
                        <td className="py-4 font-bold text-right text-gray-800">Total Amount</td>
                        <td className="py-4 font-bold text-right text-2xl text-primary">₹{order.total.toLocaleString('en-IN')}</td>
                    </tr>
                </tfoot>
            </table>

            <div className="text-center mt-12">
                <button
                    onClick={onDownload}
                    className="bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition-colors font-bold uppercase text-sm"
                >
                    Download PDF
                </button>
                <p className="text-xs text-gray-400 mt-4">This is a system generated invoice.</p>
            </div>
        </div>
    );
}
