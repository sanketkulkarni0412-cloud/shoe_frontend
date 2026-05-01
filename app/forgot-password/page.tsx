"use client";

import Link from 'next/link';
import { Mail, ArrowRight, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import AuthCard from '@/components/AuthCard';
import { getFirebaseErrorMessage } from '@/lib/firebaseErrors';

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
        } catch (err) {
            console.error(err);
            setStatus('error');
            const errorMessage = getFirebaseErrorMessage(err);
            setMsg(errorMessage);
        }
    };

    return (
        <AuthCard
            title="Reset Password"
            description="Enter your email to receive a reset link."
            icon={<Mail className="w-8 h-8 text-primary" />}
        >
            {status === 'success' ? (
                <div className="text-center space-y-6 animate-in fade-in zoom-in duration-300">
                    <div className="bg-green-500/10 text-green-500 p-4 rounded-lg flex items-center justify-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        <span>{msg}</span>
                    </div>
                    <p className="text-gray-400 text-sm">
                        Didn&apos;t receive it? Check your spam folder or try again in a few minutes.
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
        </AuthCard>
    );
}
