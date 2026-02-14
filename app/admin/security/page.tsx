"use client";

import { useState } from 'react';
import { Shield, Lock, AlertTriangle, CheckCircle, Search, Filter, History, Key } from 'lucide-react';

// Mock Security Logs
const MOCK_LOGS = [
    { id: 1, event: 'Admin Login', user: 'admin@shoeshop.com', ip: '192.168.1.10', status: 'Success', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), severity: 'normal' },
    { id: 2, event: 'Failed Login Attempt', user: 'unknown@bot.com', ip: '45.22.19.112', status: 'Failed', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), severity: 'high' },
    { id: 3, event: 'Product Price Update', user: 'admin@shoeshop.com', ip: '192.168.1.10', status: 'Success', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), severity: 'normal' },
    { id: 4, event: 'User Blocked', user: 'admin@shoeshop.com', target: 'spam@user.com', ip: '192.168.1.10', status: 'Success', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), severity: 'medium' },
    { id: 5, event: 'API Key Generated', user: 'System', ip: 'Internal', status: 'Success', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), severity: 'high' },
    { id: 6, event: 'Password Reset Request', user: 'john@doe.com', ip: '10.0.0.5', status: 'Pending', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), severity: 'normal' },
];

export default function SecurityPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All');

    const filteredLogs = MOCK_LOGS.filter(log => {
        const matchesSearch = log.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.user.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'All' || log.severity === filter.toLowerCase();
        return matchesSearch && matchesFilter;
    });

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'high': return 'text-red-500 bg-red-500/20';
            case 'medium': return 'text-yellow-500 bg-yellow-500/20';
            default: return 'text-blue-500 bg-blue-500/20';
        }
    };

    const getIcon = (event: string) => {
        if (event.includes('Login')) return <Key className="w-4 h-4" />;
        if (event.includes('Failed')) return <AlertTriangle className="w-4 h-4" />;
        if (event.includes('Block')) return <Lock className="w-4 h-4" />;
        return <History className="w-4 h-4" />;
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Security Audit Log</h1>
                    <p className="text-gray-400">Monitor system access and critical actions</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-secondary p-2 px-4 rounded-lg border border-white/10 flex items-center gap-2">
                        <Search className="w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search logs..."
                            className="bg-transparent border-none focus:outline-none text-white w-64"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="flex gap-2 mb-6">
                {['All', 'High', 'Medium', 'Normal'].map(level => (
                    <button
                        key={level}
                        onClick={() => setFilter(level)}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${filter === level
                                ? 'bg-primary text-white'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        {level} Severity
                    </button>
                ))}
            </div>

            <div className="bg-secondary rounded-xl border border-white/10 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-black/20 text-gray-400 uppercase text-xs">
                        <tr>
                            <th className="p-4">Event</th>
                            <th className="p-4">User / Source</th>
                            <th className="p-4">IP Address</th>
                            <th className="p-4">Time</th>
                            <th className="p-4">Severity</th>
                            <th className="p-4 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-white/5 transition-colors group">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${getSeverityColor(log.severity)} bg-opacity-20`}>
                                            {getIcon(log.event)}
                                        </div>
                                        <span className="font-bold">{log.event}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-gray-300">
                                    {log.user}
                                    {/* @ts-ignore */}
                                    {log.target && <span className="text-gray-500 text-xs block">Target: {log.target}</span>}
                                </td>
                                <td className="p-4 font-mono text-xs text-gray-400">{log.ip}</td>
                                <td className="p-4 text-gray-400 text-sm">{new Date(log.timestamp).toLocaleString()}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${getSeverityColor(log.severity)}`}>
                                        {log.severity}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <span className={`flex items-center justify-end gap-1 font-bold text-xs ${log.status === 'Success' ? 'text-green-500' :
                                            log.status === 'Failed' ? 'text-red-500' : 'text-yellow-500'
                                        }`}>
                                        {log.status === 'Success' ? <CheckCircle className="w-3 h-3" /> :
                                            log.status === 'Failed' ? <AlertTriangle className="w-3 h-3" /> : null}
                                        {log.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredLogs.length === 0 && (
                    <div className="p-10 text-center text-gray-500">
                        <Shield className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        No security logs found matching your criteria.
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-gradient-to-br from-green-900/20 to-green-600/10 p-6 rounded-xl border border-green-500/20">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-green-400">System Health</h3>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold text-white">99.9%</p>
                    <p className="text-xs text-green-400/60 mt-1">Uptime (Last 30 Days)</p>
                </div>
                <div className="bg-gradient-to-br from-red-900/20 to-red-600/10 p-6 rounded-xl border border-red-500/20">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-red-400">Failed Logins</h3>
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                    </div>
                    <p className="text-2xl font-bold text-white">3</p>
                    <p className="text-xs text-red-400/60 mt-1">Last 24 Hours</p>
                </div>
                <div className="bg-gradient-to-br from-blue-900/20 to-blue-600/10 p-6 rounded-xl border border-blue-500/20">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-blue-400">Active Admins</h3>
                        <Shield className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold text-white">2</p>
                    <p className="text-xs text-blue-400/60 mt-1">Currently Online</p>
                </div>
            </div>
        </div>
    );
}
