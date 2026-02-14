"use client";

import Link from 'next/link';
import { Mail, ArrowRight, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function ForgotPasswordPage() {
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [msg, setMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        setMsg('');

        try {
            await resetPassword(email);
            setStatus('success');
            setMsg('Check your email for the reset link.');
        } catch (err: any) {
            console.error(err);
            setStatus('error');
            if (err.code === 'auth/user-not-found') {
                setMsg('No account found with this email.');
            } else {
                setMsg('Failed to send reset email. Try again.');
            }
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md bg-secondary p-8 rounded-lg border border-white/5 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -ml-16 -mb-16 pointer-events-none" />

                <div className="text-center mb-8 relative z-10">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold uppercase tracking-wider">Reset Password</h1>
                    <p className="text-gray-400 mt-2 text-sm">Enter your email to receive a reset link.</p>
                </div>

                {status === 'success' ? (
                    <div className="text-center space-y-6 animate-in fade-in zoom-in duration-300">
                        <div className="bg-green-500/10 text-green-500 p-4 rounded-lg flex items-center justify-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            <span>{msg}</span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            Didn't receive it? Check your spam folder or try again in a few minutes.
                        </p>
                        <Link
                            href="/login"
                            className="inline-flex items-center text-primary hover:text-white font-bold transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        {status === 'error' && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded text-sm text-center">
                                {msg}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-full font-bold uppercase tracking-wider transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {status === 'loading' ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>Send Reset Link <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>

                        <div className="text-center mt-4">
                            <Link href="/login" className="text-sm text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-1">
                                <ArrowLeft className="w-4 h-4" /> Back to Login
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
