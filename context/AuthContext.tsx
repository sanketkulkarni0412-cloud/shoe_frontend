"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User as FirebaseUser // Alias Firebase's User type to avoid conflict
} from "firebase/auth";
import { auth, db, googleProvider } from "@/lib/firebase";

interface User {
    uid: string;
    email: string | null;
    name: string;
    image?: string;
    phone?: string;
    dob?: string;
    role?: 'admin' | 'staff' | 'user'; // RBAC Role
}

interface AuthContextType {
    user: User | null;
    loading: boolean; // Changed from isLoading
    signInWithGoogle: (redirectUrl?: string) => Promise<void>; // Changed from loginWithGoogle
    loginWithEmail: (email: string, pass: string) => Promise<void>;
    signupWithEmail: (email: string, pass: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    toggleRole?: (role: 'admin' | 'staff' | 'user') => void;
    updateUserImage: (url: string) => void;
    updateUserProfile: (data: { name?: string; phone?: string; dob?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Fetch extra user details from Firestore
                const { doc, getDoc } = await import("firebase/firestore");
                const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
                const userData = userDoc.exists() ? userDoc.data() : {};

                // In a real app, you would fetch the role from Firestore 'users' collection
                // For this demo, we'll default to 'admin' to show features, or 'user'
                const role = firebaseUser.email?.includes('admin') ? 'admin' : (userData.role || 'user');

                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    name: firebaseUser.displayName || userData.name || firebaseUser.email?.split('@')[0] || 'User',
                    image: userData.image || firebaseUser.photoURL || null, // Prioritize Firestore image
                    phone: userData.phone || '',
                    dob: userData.dob || '',
                    role: role as 'admin' | 'staff' | 'user'
                });
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const toggleRole = (newRole: 'admin' | 'staff' | 'user') => {
        if (user) {
            setUser({ ...user, role: newRole });
        }
    };

    const updateUserImage = (url: string) => {
        if (user) {
            setUser({ ...user, image: url });
        }
    };

    const updateUserProfile = async (data: { name?: string; phone?: string; dob?: string }) => {
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) throw new Error("No user logged in");

            // 1. Update Firebase Auth Profile (only supports displayName & photoURL)
            if (data.name) {
                const { updateProfile } = await import("firebase/auth");
                await updateProfile(currentUser, { displayName: data.name });
            }

            // 2. Update Firestore User Document
            const { doc, updateDoc } = await import("firebase/firestore");
            const userRef = doc(db, "users", currentUser.uid);
            await updateDoc(userRef, data);

            // 3. Update Local State
            setUser((prev: any) => ({ ...prev, ...data }));
        } catch (error) {
            console.error("Failed to update profile", error);
            throw error;
        }
    };

    const signInWithGoogle = async (redirectUrl: string = '/') => {
        try {
            setIsLoading(true);
            await signInWithPopup(auth, googleProvider);
            // Check if user exists in Firestore, if not create
            const { doc, getDoc, setDoc } = await import("firebase/firestore");
            const user = auth.currentUser;
            if (user) {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (!userDoc.exists()) {
                    await setDoc(doc(db, "users", user.uid), {
                        name: user.displayName,
                        email: user.email,
                        uid: user.uid,
                        role: 'user',
                        createdAt: new Date().toISOString()
                    });
                }
            }
            router.push(redirectUrl);
        } catch (error: any) {
            console.error("Google Login Failed Full Error:", error);
            if (error.code) {
                console.error("Firebase Error Code:", error.code);
                console.error("Firebase Error Message:", error.message);
            }
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const loginWithEmail = async (email: string, pass: string) => {
        try {
            setIsLoading(true);
            const userCredential = await signInWithEmailAndPassword(auth, email, pass);

            // Check if user is admin to redirect to admin panel
            const { doc, getDoc } = await import("firebase/firestore");
            const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
            const userData = userDoc.exists() ? userDoc.data() : {};

            // Should be admin if role is 'admin' or email contains 'admin' (demo logic)
            const isAdmin = userData.role === 'admin' || email.includes('admin');

            if (isAdmin) {
                router.push('/admin');
            } else {
                router.push('/');
            }
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const signupWithEmail = async (email: string, pass: string, name: string) => {
        try {
            setIsLoading(true);
            const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
            // Save user to Firestore
            const { setDoc, doc } = await import("firebase/firestore");
            await setDoc(doc(db, "users", userCredential.user.uid), {
                name,
                email,
                uid: userCredential.user.uid,
                createdAt: new Date().toISOString(),
                role: 'user' // Default role
            });
            router.push('/');
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            router.push('/login');
        } catch (error) {
            console.error("Logout Failed", error);
        }
    };

    const resetPassword = async (email: string) => {
        try {
            await import("firebase/auth").then(({ sendPasswordResetEmail }) =>
                sendPasswordResetEmail(auth, email)
            );
        } catch (error) {
            console.error("Reset Password Failed", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading: isLoading,
            signInWithGoogle,
            loginWithEmail,
            signupWithEmail,
            logout,
            resetPassword,
            toggleRole,
            updateUserImage,
            updateUserProfile
        }}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
