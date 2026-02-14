"use client";

import { useState, useEffect } from 'react';
import { Search, Eye, Truck, CheckCircle, Clock, XCircle, AlertCircle, X, Download, FileText, Mail, Copy } from 'lucide-react';
import { collection, getDocs, doc, updateDoc, getFirestore, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import NotificationToast from '@/components/NotificationToast';
import InvoiceEmailTemplate from '@/components/InvoiceEmailTemplate';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [statusUpdateValues, setStatusUpdateValues] = useState<{ status: string, note: string, trackingNumber: string }>({ status: 'Pending', note: '', trackingNumber: '' });
    const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
    const [showToast, setShowToast] = useState(false);

    // Invoice State
    const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
    const [showEmailPreview, setShowEmailPreview] = useState(false);


    // Auth to get admin name
    const { user } = useAuth(); // Assuming AuthContext is available based on previous context

    useEffect(() => {
        fetchOrders();
    }, []);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert(`Copied ${text} to clipboard!`);
    };

    const fetchOrders = async () => {
        try {
            const q = query(collection(db, "orders"), orderBy("date", "desc"));
            const querySnapshot = await getDocs(q);
            const items: any[] = [];
            querySnapshot.forEach((doc) => {
                items.push({ id: doc.id, ...doc.data() });
            });
            setOrders(items);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateClick = (order: any) => {
        setSelectedOrder(order);
        setStatusUpdateValues({
            status: order.status,
            note: order.delayNote || '',
            trackingNumber: order.trackingNumber || ''
        });
    };

    const confirmUpdate = async () => {
        if (!selectedOrder) return;

        try {
            await updateDoc(doc(db, "orders", selectedOrder.id), {
                status: statusUpdateValues.status,
                delayNote: statusUpdateValues.note || null,
                trackingNumber: statusUpdateValues.trackingNumber || null,
                history: [...(selectedOrder.history || []), {
                    previousStatus: selectedOrder.status,
                    newStatus: statusUpdateValues.status,
                    timestamp: new Date().toISOString(),
                    updatedBy: user?.name || 'Admin',
                    delayNote: statusUpdateValues.note || null
                }]
            });

            // Refresh local state
            setOrders(orders.map(o => o.id === selectedOrder.id ? {
                ...o,
                status: statusUpdateValues.status,
                delayNote: statusUpdateValues.note,
                trackingNumber: statusUpdateValues.trackingNumber,
                history: [...(o.history || []), {
                    previousStatus: o.status,
                    newStatus: statusUpdateValues.status,
                    timestamp: new Date().toISOString(),
                    updatedBy: user?.name || 'Admin',
                    delayNote: statusUpdateValues.note
                }]
            } : o));

            setShowToast(true);
            setSelectedOrder(null);
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'text-yellow-500 bg-yellow-500/20';
            case 'processing': return 'text-blue-500 bg-blue-500/20';
            case 'shipped': return 'text-purple-500 bg-purple-500/20';
            case 'delivered': return 'text-green-500 bg-green-500/20';
            case 'cancelled': return 'text-red-500 bg-red-500/20';
            default: return 'text-gray-400 bg-gray-500/20';
        }
    };

    const toggleSelectOrder = (id: string) => {
        if (selectedOrders.includes(id)) {
            setSelectedOrders(selectedOrders.filter(oid => oid !== id));
        } else {
            setSelectedOrders([...selectedOrders, id]);
        }
    };

    const toggleSelectAll = () => {
        if (selectedOrders.length === filteredOrders.length) {
            setSelectedOrders([]);
        } else {
            setSelectedOrders(filteredOrders.map(o => o.id));
        }
    };

    const handleBulkDownload = () => {
        if (selectedOrders.length === 0) return;
        // Mock Download
        console.log(`Downloading invoices for: ${selectedOrders.join(', ')}`);
        alert(`Downloaded ${selectedOrders.length} invoices (Mock ZIP)`);
        setSelectedOrders([]);
    };

    const filteredOrders = orders.filter(o => {
        const matchesSearch = o.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatusFilter === 'All' || o.status === selectedStatusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Order Management</h1>
                {selectedOrders.length > 0 && (
                    <Button onClick={handleBulkDownload} size="sm" className="bg-white text-black hover:bg-gray-200">
                        <Download className="w-4 h-4 mr-2" /> Download Selected ({selectedOrders.length})
                    </Button>
                )}
            </div>

            <div className="bg-secondary p-4 rounded-lg mb-6 border border-white/10 flex items-center gap-2">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by Order ID or Email..."
                    className="bg-transparent border-none focus:outline-none text-white w-full"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Status Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
                {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setSelectedStatusFilter(status)}
                        className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${selectedStatusFilter === status
                            ? 'bg-primary text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="text-center py-10">Loading orders...</div>
            ) : (
                <div className="bg-secondary rounded-lg border border-white/10 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-black/20 text-gray-400 uppercase text-xs">
                            <tr>
                                <th className="p-4 w-10">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-600 bg-transparent"
                                        checked={filteredOrders.length > 0 && selectedOrders.length === filteredOrders.length}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th className="p-4">Order ID</th>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Total</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-600 bg-transparent"
                                            checked={selectedOrders.includes(order.id)}
                                            onChange={() => toggleSelectOrder(order.id)}
                                        />
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 group">
                                            <span className="font-mono text-xs text-gray-400">
                                                {order.customId ? order.customId : `#${order.id.slice(0, 8)}...`}
                                            </span>
                                            <button
                                                onClick={() => copyToClipboard(order.customId || order.id)}
                                                className="text-gray-600 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                                                title="Copy Order ID"
                                            >
                                                <Copy className="w-3 h-3" />
                                            </button>
                                        </div>
                                        {order.trackingNumber && (
                                            <div className="text-[10px] text-blue-400 flex items-center gap-1 mt-1">
                                                <Truck className="w-3 h-3" /> {order.trackingNumber}
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div>{order.customerEmail || 'Guest'}</div>
                                        {order.delayNote && <div className="text-xs text-yellow-500 flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" /> Delayed</div>}
                                    </td>
                                    <td className="p-4 text-sm text-gray-400">{new Date(order.date).toLocaleDateString()}</td>
                                    <td className="p-4 font-bold">₹{order.total?.toLocaleString('en-IN')}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <Button size="sm" variant="outline" onClick={() => handleUpdateClick(order)}>
                                            Manage
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!loading && filteredOrders.length === 0 && (
                        <div className="p-8 text-center text-gray-500">No orders found.</div>
                    )}
                </div>
            )}

            {/* Edit Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                            <h2 className="text-xl font-bold">Manage Order #{selectedOrder.id.slice(0, 8)}...</h2>
                            <button onClick={() => setSelectedOrder(null)}><X className="w-5 h-5 text-gray-400" /></button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Status Update */}
                            <div className="space-y-4">
                                <h3 className="font-bold text-gray-400 text-sm uppercase">Update Status</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Status</label>
                                        <select
                                            className="w-full bg-secondary border border-white/10 rounded p-2 focus:border-primary text-white"
                                            value={statusUpdateValues.status}
                                            onChange={(e) => setStatusUpdateValues({ ...statusUpdateValues, status: e.target.value })}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Out for Delivery">Out for Delivery</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Tracking Number</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. TRK123456789"
                                            className="w-full bg-secondary border border-white/10 rounded p-2 focus:border-primary text-white"
                                            value={statusUpdateValues.trackingNumber}
                                            onChange={(e) => setStatusUpdateValues({ ...statusUpdateValues, trackingNumber: e.target.value })}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs text-gray-500 mb-1">Delay Note / Reason (Optional)</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Weather delay, Stock issue..."
                                            className="w-full bg-secondary border border-white/10 rounded p-2 focus:border-primary text-white"
                                            value={statusUpdateValues.note}
                                            onChange={(e) => setStatusUpdateValues({ ...statusUpdateValues, note: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button onClick={confirmUpdate}>Update & Notify User</Button>
                                </div>
                            </div>

                            {/* Invoice & History Log */}
                            <div className="space-y-4 pt-6 border-t border-white/10">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-gray-400 text-sm uppercase flex items-center gap-2"><Clock className="w-4 h-4" /> Order History</h3>
                                    <Button size="sm" variant="ghost" className="text-xs" onClick={() => setShowEmailPreview(true)}>
                                        <Mail className="w-3 h-3 mr-2" /> Preview Invoice Email
                                    </Button>
                                </div>

                                <div className="bg-secondary rounded-lg border border-white/5 overflow-hidden">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-white/5 text-gray-500 text-xs">
                                            <tr>
                                                <th className="p-3">Date</th>
                                                <th className="p-3">Status Change</th>
                                                <th className="p-3">Updated By</th>
                                                <th className="p-3">Note</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {selectedOrder.history && selectedOrder.history.length > 0 ? (
                                                [...selectedOrder.history].reverse().map((log: any, i: number) => (
                                                    <tr key={i}>
                                                        <td className="p-3 text-gray-400">{new Date(log.timestamp).toLocaleString()}</td>
                                                        <td className="p-3">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-gray-500">{log.previousStatus}</span>
                                                                <span className="text-gray-600">→</span>
                                                                <span className={`font-bold ${getStatusColor(log.newStatus).split(' ')[0]}`}>{log.newStatus}</span>
                                                            </div>
                                                        </td>
                                                        <td className="p-3 text-gray-400">{log.updatedBy}</td>
                                                        <td className="p-3 italic text-gray-500">{log.delayNote || '-'}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={4} className="p-4 text-center text-gray-500">No history available</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Invoice Versions */}
                                {selectedOrder.invoiceVersions && selectedOrder.invoiceVersions.length > 0 && (
                                    <div className="mt-6">
                                        <h3 className="font-bold text-gray-400 text-sm uppercase flex items-center gap-2 mb-3"><FileText className="w-4 h-4" /> Invoice Versions</h3>
                                        <div className="grid gap-2">
                                            {[...selectedOrder.invoiceVersions].reverse().map((ver: any, i: number) => (
                                                <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded text-sm">
                                                    <div>
                                                        <span className="font-mono text-primary font-bold mr-2">v{ver.version}</span>
                                                        <span className="text-gray-400">{new Date(ver.timestamp).toLocaleString()}</span>
                                                    </div>
                                                    <div className="text-gray-500 italic text-xs truncate max-w-[200px]">{ver.changes}</div>
                                                    <button className="text-primary hover:text-white transition-colors" title="Download (Mock)">
                                                        <Download className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Email Preview Modal */}
            {selectedOrder && showEmailPreview && (
                <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4">
                    <div className="max-w-3xl w-full relative">
                        <button
                            onClick={() => setShowEmailPreview(false)}
                            className="absolute -top-10 right-0 text-white hover:text-gray-300"
                        >
                            <X className="w-8 h-8" />
                        </button>
                        <InvoiceEmailTemplate
                            order={selectedOrder}
                            onDownload={() => alert('Mock PDF Download Started')}
                        />
                    </div>
                </div>
            )}

            <NotificationToast show={showToast} onClose={() => setShowToast(false)} />
        </div>
    );
}
