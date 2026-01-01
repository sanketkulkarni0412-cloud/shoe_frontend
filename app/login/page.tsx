"use client";

import Link from 'next/link';
import { User, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
    const { signInWithGoogle, loginWithEmail, loading: authLoading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isFormLoading, setIsFormLoading] = useState(false);

    const validateForm = () => {
        if (!email || !password) {
            setError('Please fill in all fields');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;

        setIsFormLoading(true);
        try {
            await loginWithEmail(email, password);
        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/invalid-credential') {
                setError('Invalid email or password');
            } else if (err.code === 'auth/user-not-found') {
                setError('No account found with this email');
            } else if (err.code === 'auth/wrong-password') {
                setError('Incorrect password');
            } else if (err.code === 'auth/operation-not-allowed') {
                setError('Email/Password login is not enabled in Firebase Console.');
            } else {
                setError('Failed to login. Please try again.');
            }
        } finally {
            setIsFormLoading(false);
        }
    };

    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || '/';

    const handleGoogleLogin = async () => {
        setIsFormLoading(true);
        setError('');
        try {
            await signInWithGoogle(redirect);
        } catch (err) {
            setError('Google login failed');
        } finally {
            setIsFormLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md bg-secondary p-8 rounded-lg border border-white/5 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -ml-16 -mb-16 pointer-events-none" />

                <div className="text-center mb-8 relative z-10">
                    <User className="w-16 h-16 text-primary mx-auto mb-4 bg-primary/10 p-3 rounded-full" />
                    <h1 className="text-3xl font-bold uppercase tracking-wider">Welcome Back</h1>
                    <p className="text-gray-400 mt-2">Sign in to access your account.</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <div className="space-y-6 relative z-10">
                    {/* Google Login Button */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={isFormLoading}
                        className="w-full bg-white text-black hover:bg-gray-200 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isFormLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Continue with Google
                            </>
                        )}
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-secondary px-2 text-gray-500">Or continue with email</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="flex justify-end">
                                <Link href="/forgot-password" className="text-xs text-primary hover:text-white transition-colors">
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isFormLoading}
                            className="w-full bg-primary hover:bg-red-700 text-white py-4 rounded-full font-bold uppercase tracking-wider transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 mt-8 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {isFormLoading ? (
                                <span className="animate-pulse">Logging In...</span>
                            ) : (
                                <>Log In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-8 text-center text-gray-400 text-sm relative z-10">
                    Don't have an account?{' '}
                    <Link href="/signup" className="text-primary hover:text-white font-bold transition-colors">
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
}
