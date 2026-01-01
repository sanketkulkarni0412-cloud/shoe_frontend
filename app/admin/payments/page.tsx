"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import PermissionGuard from "@/components/admin/PermissionGuard";
import RevenueChart from "@/components/admin/RevenueChart";
import { Download, CreditCard, CheckCircle, XCircle, TrendingUp } from "lucide-react";
import Button from "@/components/ui/Button";

// Mock Data for demonstration
const MOCK_PAYMENTS = [
    { id: "PAY-001", orderId: "ORD-101", user: "Alice", email: "alice@example.com", method: "Credit Card", amount: 120.00, status: "completed", date: "2024-12-20" },
    { id: "PAY-002", orderId: "ORD-102", user: "Bob", email: "bob@example.com", method: "PayPal", amount: 85.50, status: "completed", date: "2024-12-21" },
    { id: "PAY-003", orderId: "ORD-103", user: "Charlie", email: "charlie@example.com", method: "Credit Card", amount: 200.00, status: "failed", date: "2024-12-21" },
    { id: "PAY-004", orderId: "ORD-104", user: "David", email: "david@example.com", method: "Stripe", amount: 45.00, status: "completed", date: "2024-12-22" },
    { id: "PAY-005", orderId: "ORD-105", user: "Eve", email: "eve@example.com", method: "PayPal", amount: 150.00, status: "refunded", date: "2024-12-23" },
    { id: "PAY-006", orderId: "ORD-106", user: "Frank", email: "frank@example.com", method: "Credit Card", amount: 320.00, status: "completed", date: "2024-12-24" },
];

const CHART_DATA = [
    { name: 'Dec 18', total: 400 },
    { name: 'Dec 19', total: 300 },
    { name: 'Dec 20', total: 550 },
    { name: 'Dec 21', total: 450 },
    { name: 'Dec 22', total: 600 },
    { name: 'Dec 23', total: 750 },
    { name: 'Dec 24', total: 900 },
];

export default function AdminPaymentsPage() {
    const { user, toggleRole } = useAuth();
    const [payments, setPayments] = useState(MOCK_PAYMENTS);

    // Summary Stats
    const totalRevenue = payments
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0);
    const successCount = payments.filter(p => p.status === 'completed').length;
    const failedCount = payments.filter(p => p.status === 'failed' || p.status === 'refunded').length;

    const handleExport = () => {
        const headers = ["Payment ID", "Order ID", "User", "Email", "Method", "Amount", "Status", "Date"];
        const rows = payments.map(p => [
            p.id, p.orderId, p.user, p.email, p.method, p.amount.toFixed(2), p.status, p.date
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "payments_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Payment Dashboard</h1>
                    <p className="text-gray-400">Manage transactions, analyze revenue, and export data.</p>
                </div>

                {/* Admin-only Controls */}
                <div className="flex items-center gap-3">
                    {/* Role Toggler for Demo */}
                    <div className="flex items-center gap-2 bg-secondary p-1 rounded-lg border border-white/5">
                        <span className="text-xs text-gray-400 px-2">Simulate:</span>
                        <button onClick={() => toggleRole?.('admin')} className={`text-xs px-2 py-1 rounded ${user?.role === 'admin' ? 'bg-primary text-white' : 'text-gray-400'}`}>Admin</button>
                        <button onClick={() => toggleRole?.('staff')} className={`text-xs px-2 py-1 rounded ${user?.role === 'staff' ? 'bg-primary text-white' : 'text-gray-400'}`}>Staff</button>
                    </div>

                    <PermissionGuard requiredRole="admin">
                        <Button onClick={handleExport} className="flex items-center gap-2">
                            <Download className="w-4 h-4" /> Export CSV
                        </Button>
                    </PermissionGuard>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-secondary border border-white/5 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-400 text-sm font-medium">Total Revenue</h3>
                        <CreditCard className="w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-3xl font-bold text-white">${totalRevenue.toFixed(2)}</p>
                    <p className="text-xs text-green-500 flex items-center mt-2">
                        <TrendingUp className="w-3 h-3 mr-1" /> +12.5% from last week
                    </p>
                </div>

                <div className="bg-secondary border border-white/5 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-400 text-sm font-medium">Successful Payments</h3>
                        <CheckCircle className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-3xl font-bold text-white">{successCount}</p>
                </div>

                <div className="bg-secondary border border-white/5 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-400 text-sm font-medium">Failed / Refunded</h3>
                        <XCircle className="w-5 h-5 text-red-500" />
                    </div>
                    <p className="text-3xl font-bold text-white">{failedCount}</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RevenueChart data={CHART_DATA} type="bar" />
                <RevenueChart data={CHART_DATA} type="line" />
            </div>

            {/* Transactions Table */}
            <div className="bg-secondary border border-white/5 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-white/5">
                    <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 text-gray-400 font-medium">
                            <tr>
                                <th className="p-4">ID</th>
                                <th className="p-4">User</th>
                                <th className="p-4">Method</th>
                                <th className="p-4">Amount</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Date</th>
                                <PermissionGuard requiredRole="admin">
                                    <th className="p-4 text-right">Actions</th>
                                </PermissionGuard>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-gray-300">
                            {payments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-mono">{payment.id}</td>
                                    <td className="p-4">
                                        <div>{payment.user}</div>
                                        <div className="text-xs text-gray-500">{payment.email}</div>
                                    </td>
                                    <td className="p-4">{payment.method}</td>
                                    <td className="p-4 font-bold text-white">${payment.amount.toFixed(2)}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase
                                            ${payment.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                                                payment.status === 'failed' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="p-4">{payment.date}</td>
                                    <PermissionGuard requiredRole="admin">
                                        <td className="p-4 text-right">
                                            <button className="text-red-400 hover:text-red-300 text-xs underline">Refund</button>
                                        </td>
                                    </PermissionGuard>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
