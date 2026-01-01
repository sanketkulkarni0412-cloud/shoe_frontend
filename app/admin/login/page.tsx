"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth'; // Direct usage
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Lock, User, Key, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminLoginPage() {
    const [email, setEmail] = useState(''); // Changed from username
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const { loginWithEmail } = useAuth(); // Import useAuth

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            // Check Role
            const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
            const role = userDoc.exists() ? userDoc.data().role : 'user';

            if (role !== 'admin') {
                throw new Error("Access Denied: You are not an administrator.");
            }

            router.push('/admin');
        } catch (err: any) {
            setError(err.message.replace('Firebase: ', '') || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1920')] bg-cover bg-center opacity-20 blur-sm" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

            <div className="w-full max-w-md bg-secondary/90 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl relative z-10">
                <div className="text-center mb-8">
                    <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/50">
                        <Lock className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-wider">ADMIN ACCESS</h1>
                    <p className="text-gray-400 mt-2">Enter your credentials to continue</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg mb-6 text-sm font-medium text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                                placeholder="Enter admin email"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Password</label>
                        <div className="relative">
                            <Key className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                                placeholder="Enter password"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary hover:bg-red-700 text-white py-4 rounded-xl font-bold uppercase tracking-wider transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 mt-8 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/25"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>Login <ArrowRight className="w-5 h-5" /></>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/10 text-center">
                    <p className="text-gray-500 text-xs">Shoe Shop Authorized Personnel Only</p>
                </div>
            </div>
        </div>
    );
}
